import AppShell from "@/components/AppShell";
import EmployeeDashboard from "@/components/employee/EmployeeDashboard";

export default function DashboardPage() {
  return <AppShell title="Tổng quan" description="Theo dõi nhanh công việc và thông tin cá nhân."><EmployeeDashboard /></AppShell>;
}
