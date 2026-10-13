"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageState from "@/components/ui/PageState";
import { getMyEmployee } from "@/services/employeeService";
import type { Employee } from "@/types/employee";
import { formatDate } from "@/utils/format";

export default function MyEmployeePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { getMyEmployee().then(setEmployee).catch(() => setError("Không thể tải thông tin cá nhân.")); }, []);
  return <AppShell title="Thông tin cá nhân" description="Hồ sơ nhân sự của bạn.">
    {!employee && !error && <PageState type="loading" title="Đang tải thông tin cá nhân..." />}
    {error && <PageState type="error" title="Không thể tải dữ liệu" description={error} />}
    {employee && <section className="card resultCard"><div className="resultHeader"><div><p className="eyebrow">Hồ sơ nhân viên</p><h2>{employee.name}</h2></div><span className="roleBadge">NV-{employee.id}</span></div><div className="detailGrid"><div><span>Email</span><strong>{employee.email || "—"}</strong></div><div><span>Số điện thoại</span><strong>{employee.phoneNumber || "—"}</strong></div><div><span>Ngày sinh</span><strong>{formatDate(employee.dateOfBirth)}</strong></div><div><span>Phòng ban</span><strong>{employee.department?.name || "—"}</strong></div><div><span>Địa chỉ</span><strong>{employee.address || "—"}</strong></div><div><span>Phép còn lại</span><strong>{employee.remainingLeaveDays ?? 0} ngày</strong></div></div></section>}
  </AppShell>;
}
