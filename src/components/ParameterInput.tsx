/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FunctionParameter, ParameterValue } from "../types/function";

interface ParameterInputProps {
  parameter: FunctionParameter;
  value: ParameterValue;
  onChange: (value: ParameterValue) => void;
}

export const ParameterInput: React.FC<ParameterInputProps> = ({
  parameter,
  value,
  onChange,
}) => {
  const getInputType = (type: string) => {
    if (type === "boolean") return "checkbox";
    if (type === "number") return "number";
    if (type.includes("string")) return "text";
    return "text";
  };

  const isObjectType = (type: string) => {
    return type.includes("{") && type.includes("}");
  };

  const isSelectType = (type: string) => {
    return type.includes('"') && type.includes("|");
  };

  const getSelectOptions = (type: string) => {
    const matches = type.match(/"([^"]+)"/g);
    return matches ? matches.map((match) => match.replace(/"/g, "")) : [];
  };

  // Parse an object type string into a key/type map
  const parseObjectType = (type: string): Record<string, string> => {
    const inside = type.replace(/^{|}$/g, "").trim();
    const entries = inside
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);
    const obj: Record<string, string> = {};
    entries.forEach((entry) => {
      const [key, val] = entry.split(":").map((s) => s.trim());
      if (key && val) obj[key] = val;
    });
    return obj;
  };

  const renderSimpleInput = (
    type: string,
    currentValue: ParameterValue,
    onValueChange: (v: ParameterValue) => void
  ) => {
    if (type === "boolean") {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={Boolean(currentValue)}
            onChange={(e) => onValueChange(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 bg-white dark:bg-gray-800"
          />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {currentValue ? "True" : "False"}
          </span>
        </div>
      );
    }

    if (isSelectType(type)) {
      const options = getSelectOptions(type);
      return (
        <select
          value={String(currentValue || "")}
          onChange={(e) => onValueChange(e.target.value || null)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="">Select option...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={getInputType(type)}
        value={String(currentValue || "")}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={`Enter ${type}`}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    );
  };

  const renderObjectInput = () => {
    const properties = parseObjectType(parameter.type);
    const currentValue: Record<string, any> =
      typeof value === "object" && value !== null
        ? (value as Record<string, any>)
        : {};

    return (
      <div className="space-y-2 border p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
        {Object.entries(properties).map(([propName, propType]) => (
          <div key={propName} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {propName}
            </label>
            {renderSimpleInput(propType, currentValue[propName], (newVal) => {
              onChange({
                ...currentValue,
                [propName]: newVal,
              });
            })}
          </div>
        ))}
      </div>
    );
  };

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
      {isObjectType(parameter.type)
        ? renderObjectInput()
        : renderSimpleInput(parameter.type, value, onChange)}
    </div>
  );
};
