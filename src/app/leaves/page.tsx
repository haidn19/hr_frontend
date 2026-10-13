"use client";

import AppShell from "@/components/AppShell";
import LeaveModule from "@/components/leaves/LeaveModule";
import EmployeeLeave from "@/components/employee/EmployeeLeave";
import { useSession } from "next-auth/react";

export default function LeavesPage() {
  const { data: session } = useSession();
  const employee = session?.roles.includes("EMPLOYEE") ?? false;
  return (
    <AppShell
      title="Nghỉ phép"
      description={employee ? "Tạo và theo dõi đơn nghỉ phép của bạn." : "Tạo yêu cầu nghỉ và xử lý trạng thái đơn nghỉ phép."}
    >
      {employee ? <EmployeeLeave /> : <LeaveModule />}
    </AppShell>
  );
}
