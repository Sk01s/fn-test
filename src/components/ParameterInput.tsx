/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FunctionParameter, ParameterValue } from "../types/function";

interface ParameterInputProps {
  parameter: FunctionParameter;
  value: ParameterValue;
  onChange: (value: ParameterValue) => void;
}

/**
 * Utility: split a string by a delimiter but only at top-level (not inside braces or quotes)
 */
const splitTopLevel = (s: string, delim: string) => {
  const parts: string[] = [];
  let buf = "";
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    if (!inSingle && !inDouble) {
      if (ch === "{") depth++;
      if (ch === "}") depth = Math.max(0, depth - 1);
    }
    if (ch === delim && depth === 0 && !inSingle && !inDouble) {
      parts.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf !== "") parts.push(buf);
  return parts.map((p) => p.trim());
};

/**
 * Remove top-level union parts 'null' and 'undefined', pick the first real type
 */
const pickNonNullableTopLevel = (type: string) => {
  const pieces = splitTopLevel(type, "|").map((p) => p.trim());
  const filtered = pieces.filter(
    (p) => p !== "null" && p !== "undefined" && p !== "void"
  );
  return filtered.length ? filtered[0] : pieces[0];
};

/**
 * Detect if a type string is a literal union like: "\"a\" | \"b\"" or "'a' | 'b'"
 */
const isLiteralUnion = (type: string) => {
  const parts = splitTopLevel(type, "|");
  if (parts.length < 2) return false;
  return parts.every(
    (p) =>
      (p.startsWith('"') && p.endsWith('"')) ||
      (p.startsWith("'") && p.endsWith("'"))
  );
};

/**
 * Parse an object type like:
 * { a: string; b?: { x: string }[]; c: number }
 * into an ordered list of entries { name, type, optional }
 */
const parseObjectType = (type: string) => {
  // strip outer braces if present
  const trimmed = type.trim();
  const inside =
    trimmed.startsWith("{") && trimmed.endsWith("}")
      ? trimmed.slice(1, -1)
      : trimmed;

  // split top-level by ; or , (prefer ;)
  // We'll first try semicolons; if none found, split by commas at top level
  let entries = splitTopLevel(inside, ";").filter(Boolean);
  if (entries.length <= 1) {
    entries = splitTopLevel(inside, ",").filter(Boolean);
  }

  const props: { name: string; type: string; optional: boolean }[] = [];

  entries.forEach((entry) => {
    // find top-level ":" that separates name and type
    let namePart = "";
    let typePart = "";
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let found = false;
    for (let i = 0; i < entry.length; i++) {
      const ch = entry[i];
      if (ch === "'" && !inDouble) inSingle = !inSingle;
      if (ch === '"' && !inSingle) inDouble = !inDouble;
      if (!inSingle && !inDouble) {
        if (ch === "{") depth++;
        if (ch === "}") depth = Math.max(0, depth - 1);
      }
      if (!found && ch === ":" && depth === 0 && !inSingle && !inDouble) {
        namePart = entry.slice(0, i).trim();
        typePart = entry.slice(i + 1).trim();
        found = true;
        break;
      }
    }
    if (!found) {
      // fallback: maybe it's something weird; skip
      return;
    }
    // handle optional `?` in name (e.g., criteria?)
    const optional = namePart.endsWith("?");
    const name = optional ? namePart.slice(0, -1).trim() : namePart;
    props.push({ name, type: typePart, optional });
  });

  return props;
};

const getDefaultForType = (type: string): any => {
  const core = pickNonNullableTopLevel(type).trim();
  if (core.endsWith("[]")) return [];
  if (isLiteralUnion(core)) return "";
  if (core.startsWith("{") && core.endsWith("}")) return {};
  if (/^boolean$/i.test(core)) return false;
  if (/^number$/i.test(core)) return 0;
  // fallback to empty string
  return "";
};

const isPrimitive = (type: string) => {
  const t = pickNonNullableTopLevel(type).trim();
  return t === "string" || t === "number" || t === "boolean";
};

/**
 * Recursive rendering component for any type string.
 */
const RenderTypeInput: React.FC<{
  typeStr: string;
  value: any;
  onChange: (v: any) => void;
  paramName?: string;
}> = ({ typeStr, value, onChange, paramName }) => {
  const core = pickNonNullableTopLevel(typeStr).trim();

  // Arrays like `X[]`
  if (core.endsWith("[]")) {
    const elementType = core.slice(0, -2).trim();
    const arr: any[] = Array.isArray(value) ? value : [];
    const pushNew = () => {
      const def = getDefaultForType(elementType);
      onChange([...arr, def]);
    };
    const updateAt = (idx: number, newVal: any) => {
      const copy = [...arr];
      copy[idx] = newVal;
      onChange(copy);
    };
    const removeAt = (idx: number) => {
      const copy = [...arr];
      copy.splice(idx, 1);
      onChange(copy);
    };

    return (
      <div className="space-y-2 border p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {paramName ?? "array"} (array)
          </div>
          <button
            type="button"
            onClick={pushNew}
            className="px-2 py-1 text-xs rounded bg-indigo-600 text-white"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {arr.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              No items
            </div>
          )}
          {arr.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <RenderTypeInput
                    typeStr={elementType}
                    value={item}
                    onChange={(v) => updateAt(idx, v)}
                    paramName={`${paramName ?? "item"}[${idx}]`}
                  />
                </div>
                <div className="ml-2">
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Literal union: "a" | "b"
  if (isLiteralUnion(core)) {
    const opts = splitTopLevel(core, "|").map((p) =>
      p.replace(/^['"]|['"]$/g, "")
    );
    return (
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <option value="">Select option...</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  // Object
  if (core.startsWith("{") && core.endsWith("}")) {
    const props = parseObjectType(core);
    const currentValue: Record<string, any> =
      typeof value === "object" && value !== null ? value : {};

    return (
      <div className="space-y-3 border p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        {props.map((p) => (
          <div key={p.name} className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {p.name}{" "}
                {p.optional ? (
                  <span className="text-xs text-gray-500">(optional)</span>
                ) : null}
              </label>
              <span className="text-xs text-gray-500 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700">
                {p.type}
              </span>
            </div>
            <RenderTypeInput
              typeStr={p.type}
              value={currentValue[p.name]}
              onChange={(nv) =>
                onChange({
                  ...currentValue,
                  [p.name]: nv,
                })
              }
              paramName={p.name}
            />
          </div>
        ))}
      </div>
    );
  }

  // Primitive/simple types
  if (/^boolean$/i.test(core)) {
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-800"
        />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {value ? "True" : "False"}
        </span>
      </div>
    );
  }

  if (/^number$/i.test(core)) {
    return (
      <input
        type="number"
        value={value === undefined || value === null ? "" : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        placeholder={`Enter ${core}`}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    );
  }

  // fallback to text input for strings and unknowns
  return (
    <input
      type="text"
      value={value === undefined || value === null ? "" : String(value)}
      onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
      placeholder={`Enter ${core}`}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
    />
  );
};

export const ParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {parameter.name}
        </label>
        {parameter.required && <span className="text-red-500 text-sm">*</span>}
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
          {parameter.type}
        </span>
      </div>

      {parameter.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {parameter.description}
        </p>
      )}

      <RenderTypeInput
        typeStr={parameter.type}
        value={value}
        onChange={onChange}
        paramName={parameter.name}
      />
    </div>
  );
};
