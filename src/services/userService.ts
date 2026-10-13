import api from "./api";
import type { CreateEmployeeAccountRequest, UserAccount } from "@/types/modules";

export async function getUsers(): Promise<UserAccount[]> {
  const response = await api.get<UserAccount[]>("/users/all");
  return response.data;
}

export async function updateUserStatus(
  id: number,
  status: boolean,
): Promise<UserAccount> {
  const response = await api.patch<UserAccount>(`/users/${id}/status`, {
    status,
  });
  return response.data;
}

export async function createEmployeeAccount(
  data: CreateEmployeeAccountRequest,
): Promise<UserAccount> {
  const response = await api.post<UserAccount>("/users", data);
  return response.data;
}
