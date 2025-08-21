import { useState, useCallback } from 'react';
import { FunctionCall, ParameterValue } from '../types/function';
import { ApiService } from '../services/api';

export const useFunctionTester = () => {
  const [functionCalls, setFunctionCalls] = useState<FunctionCall[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeFunction = useCallback(async (
    functionName: string,
    parameters: Record<string, ParameterValue>
  ) => {
    setIsExecuting(true);
    
    const callId = Date.now().toString();
    const newCall: FunctionCall = {
      id: callId,
      functionName,
      parameters,
      status: 'pending',
      timestamp: new Date(),
    };

    setFunctionCalls(prev => [newCall, ...prev]);

    try {
      // Call the actual Firebase function
      const response = await ApiService.callFunction(functionName, parameters);
      
      setFunctionCalls(prev => prev.map(call => 
        call.id === callId 
          ? { ...call, response, status: 'success' as const }
          : call
      ));
    } catch (error) {
      setFunctionCalls(prev => prev.map(call => 
        call.id === callId 
          ? { ...call, error: error instanceof Error ? error.message : 'Unknown error', status: 'error' as const }
          : call
      ));
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return {
    functionCalls,
    isExecuting,
    executeFunction,
    lastCall: functionCalls[0] || null
  };
};