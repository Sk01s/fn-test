import { useState, useEffect } from "react";
import { CloudFunction } from "../types/function";
import { FunctionList } from "../components/FunctionList";
import { FunctionTester } from "../components/FunctionTester";
import { useFunctionTester } from "../hooks/useFunctionTester";
import { ApiService } from "../services/api";
import { ThemeProvider } from "../contexts/ThemeContext";

function HomePage() {
  const [functions, setFunctions] = useState<CloudFunction[]>([]);
  const [selectedFunction, setSelectedFunction] =
    useState<CloudFunction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const { isExecuting, executeFunction, lastCall } = useFunctionTester();

  useEffect(() => {
    // Fetch function metadata from Firebase
    const fetchFunctions = async () => {
      setLoading(true);
      try {
        const functionsData = await ApiService.getFunctionMetadata();
        setFunctions(functionsData);
      } catch (error) {
        console.error("Failed to load functions:", error);
        // You could show an error message to the user here
      } finally {
        setLoading(false);
      }
    };

    fetchFunctions();
  }, []);

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              Loading Firebase Functions...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <FunctionList
          functions={functions}
          selectedFunction={selectedFunction}
          onFunctionSelect={setSelectedFunction}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <FunctionTester
          selectedFunction={selectedFunction}
          onExecute={executeFunction}
          isExecuting={isExecuting}
          lastCall={lastCall}
        />
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
