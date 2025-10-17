// Shared TypeScript types for the application

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  roles?: string[];
  active?: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

export interface AiToolsType {
  id: number;
  name: string;
  description: string;
  ai_tools_count?: number;
  created_at?: string;
}

export interface AiTool {
  id: number;
  name: string;
  link: string;
  documentation: string | null;
  description: string;
  usage: string;
  created_at: string;
  roles?: Role[];
  ai_tools_type?: AiToolsType;
  ai_tools_types?: AiToolsType[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
