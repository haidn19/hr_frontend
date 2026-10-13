import api from "./api";
import type { Payroll } from "@/types/modules";

export async function getPayroll(
  employeeId: number,
  toDate: string,
): Promise<Payroll> {
  const response = await api.get<Payroll>(`/payroll/${employeeId}`, {
    params: { toDate },
  });
  return response.data;
}

export async function getMyPayroll(month?: number, year?: number): Promise<Payroll> {
  const response = await api.get<Payroll>("/payroll/me", { params: { month, year } });
  return response.data;
}
