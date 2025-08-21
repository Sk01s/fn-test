import React from "react";
import {
  Search,
  FunctionSquare as Function,
  Users,
  Settings,
  Database,
} from "lucide-react";
import { CloudFunction } from "../types/function";
import { ThemeToggle } from "./ThemeToggle";

interface FunctionListProps {
  functions: CloudFunction[];
  selectedFunction: CloudFunction | null;
  onFunctionSelect: (func: CloudFunction) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FunctionList: React.FC<FunctionListProps> = ({
  functions,
  selectedFunction,
  onFunctionSelect,
  searchQuery,
  onSearchChange,
}) => {
  const getFunctionIcon = (functionName: string) => {
    if (functionName.toLowerCase().includes("admin")) return Users;
    if (functionName.toLowerCase().includes("client")) return Database;
    if (functionName.toLowerCase().includes("user")) return Settings;
    return Function;
  };

  const filteredFunctions = functions.filter(
    (func) =>
      func.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      func.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-scroll max-h-[100vh]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Cloud Functions
          </h2>
          <ThemeToggle />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search functions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredFunctions.map((func) => {
          const Icon = getFunctionIcon(func.name);
          const isSelected = selectedFunction?.name === func.name;

          return (
            <button
              key={func.name}
              onClick={() => onFunctionSelect(func)}
              className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                isSelected
                  ? "bg-indigo-50 dark:bg-indigo-900/20 border-r-2 border-r-indigo-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  className={`w-5 h-5 mt-0.5 ${
                    isSelected
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm ${
                      isSelected
                        ? "text-indigo-900 dark:text-indigo-100"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {func.name}
                  </h3>
                  {func.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {func.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {func.parameters.length} params
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {func.parameters.filter((p) => p.required).length}{" "}
                      required
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {filteredFunctions.length} of {functions.length} functions
        </div>
      </div>
    </div>
  );
};
