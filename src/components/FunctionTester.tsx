import React, { useState } from "react";
import {
  Play,
  Copy,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { CloudFunction, FunctionCall, ParameterValue } from "../types/function";
import { ParameterInput } from "./ParameterInput";

interface FunctionTesterProps {
  selectedFunction: CloudFunction | null;
  onExecute: (
    functionName: string,
    parameters: Record<string, ParameterValue>
  ) => Promise<void>;
  isExecuting: boolean;
  lastCall: FunctionCall | null;
}

export const FunctionTester: React.FC<FunctionTesterProps> = ({
  selectedFunction,
  onExecute,
  isExecuting,
  lastCall,
}) => {
  const [parameters, setParameters] = useState<Record<string, ParameterValue>>(
    {}
  );

  const handleParameterChange = (paramName: string, value: ParameterValue) => {
    setParameters((prev) => ({ ...prev, [paramName]: value }));
  };

  const handleExecute = async () => {
    if (!selectedFunction) return;

    await onExecute(selectedFunction.name, parameters);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResponse = () => {
    if (!lastCall?.response) return;

    const blob = new Blob([JSON.stringify(lastCall.response, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lastCall.functionName}-response.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateParameters = () => {
    if (!selectedFunction) return false;

    return selectedFunction.parameters.every((param) => {
      if (!param.required) return true;
      const value = parameters[param.name];
      return value !== undefined && value !== null && value !== "";
    });
  };

  if (!selectedFunction) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 overflow-y-scroll max-h-[100vh] ">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Select a Function to Test
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a function from the sidebar to start testing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-y-scroll max-h-[100vh] ">
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {selectedFunction.name}
          </h1>
          <button
            onClick={handleExecute}
            disabled={isExecuting || !validateParameters()}
            className={`px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${
              isExecuting || !validateParameters()
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isExecuting ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Execute Function</span>
              </>
            )}
          </button>
        </div>

        {selectedFunction.description && (
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {selectedFunction.description}
          </p>
        )}

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">
              Parameters:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedFunction.parameters.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 dark:text-gray-400">Required:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedFunction.parameters.filter((p) => p.required).length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Parameters Section */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Parameters
          </h2>

          {selectedFunction.parameters.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                This function has no parameters
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedFunction.parameters.map((param) => (
                <div
                  key={param.name}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <ParameterInput
                    parameter={param}
                    value={parameters[param.name]}
                    onChange={(value) =>
                      handleParameterChange(param.name, value)
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Response Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Response
            </h2>
            {lastCall?.response && (
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    copyToClipboard(JSON.stringify(lastCall.response, null, 2))
                  }
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title="Copy response"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={downloadResponse}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  title="Download response"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {!lastCall ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No response yet. Execute a function to see results.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status */}
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg ${
                  lastCall.status === "success"
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                    : lastCall.status === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                }`}
              >
                {lastCall.status === "success" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : lastCall.status === "error" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span className="font-medium capitalize">
                  {lastCall.status}
                </span>
                <span className="text-sm opacity-75">
                  {new Date(lastCall.timestamp).toLocaleTimeString()}
                </span>
              </div>

              {/* Response Data */}
              <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto border dark:border-gray-700">
                <pre className="text-sm text-gray-100 dark:text-gray-200 whitespace-pre-wrap">
                  {lastCall.error
                    ? lastCall.error
                    : JSON.stringify(lastCall.response, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
