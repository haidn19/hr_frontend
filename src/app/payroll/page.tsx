"use client";

import AppShell from "@/components/AppShell";
import PayrollModule from "@/components/payroll/PayrollModule";
import EmployeePayroll from "@/components/employee/EmployeePayroll";
import { useSession } from "next-auth/react";

export default function PayrollPage() {
  const { data: session } = useSession();
  const employee = session?.roles.includes("EMPLOYEE") ?? false;
  return (
    <AppShell
      title={employee ? "Bảng lương của tôi" : "Bảng lương"}
      description={employee ? "Xem bảng lương theo kỳ của bạn." : "Tính và xem chi tiết lương theo ngày công của từng nhân viên."}
    >
      {employee ? <EmployeePayroll /> : <PayrollModule />}
    </AppShell>
  );
}
