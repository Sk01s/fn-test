/* src/services/api.ts */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudFunction } from "../types/function";
import { getAuth } from "firebase/auth";
const API_BASE_URL = "http://127.0.0.1:5001/local/us-central1";

export class ApiService {
  static async getFunctionMetadata(): Promise<CloudFunction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/getFunctions`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected array");
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch function metadata:", error);
      throw error;
    }
  }

  static async callFunction(
    functionName: string,
    parameters: Record<string, any>
  ): Promise<any> {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      let idToken: string | undefined;

      if (currentUser) {
        idToken = await currentUser.getIdToken();
      }

      const response = await fetch(`${API_BASE_URL}/${functionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ data: parameters }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to call function ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * POST to createTestUsers endpoint in emulator. Accepts an array of { email, password }.
   * Returns whatever the backend returns (should include per-email result).
   */
  static async createTestUsers(users: { email: string; password?: string }[]) {
    try {
      const response = await fetch(`${API_BASE_URL}/createTestUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: users }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Failed to create test users:", err);
      throw err;
    }
  }
}
