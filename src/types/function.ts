export interface FunctionParameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface CloudFunction {
  name: string;
  description: string;
  parameters: FunctionParameter[];
}

export interface FunctionCall {
  id: string;
  functionName: string;
  parameters: Record<string, any>;
  response?: any;
  error?: string;
  status: "pending" | "success" | "error";
  timestamp: Date;
}

export type ParameterValue = string | number | boolean | object | null;
