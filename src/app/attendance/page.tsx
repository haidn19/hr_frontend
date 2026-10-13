"use client";

import AppShell from "@/components/AppShell";
import AttendanceModule from "@/components/attendance/AttendanceModule";
import EmployeeAttendance from "@/components/employee/EmployeeAttendance";
import { useSession } from "next-auth/react";

export default function AttendancePage() {
  const { data: session } = useSession();
  const employee = session?.roles.includes("EMPLOYEE") ?? false;
  return (
    <AppShell
      title="Chấm công"
      description={employee ? "Ghi nhận và theo dõi thời gian làm việc của bạn." : "Ghi nhận giờ làm, tra cứu công ngày và theo dõi cân đối công tháng."}
    >
      {employee ? <EmployeeAttendance /> : <AttendanceModule />}
    </AppShell>
  );
}
