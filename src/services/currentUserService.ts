import api from "./api";

export interface CurrentUser {
  userId: number;
  username: string;
  role: "ADMIN" | "EMPLOYEE" | "STAFF" | "USER";
  employeeId: number | null;
  employeeName: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await api.get<CurrentUser>("/me");
  return response.data;
}
