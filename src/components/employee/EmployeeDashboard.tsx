"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import { getMyAttendance } from "@/services/attendanceService";
import { getMyEmployee } from "@/services/employeeService";
import PageState from "@/components/ui/PageState";
import { formatDateTime } from "@/utils/format";
import type { Attendance } from "@/types/modules";
import type { Employee } from "@/types/employee";

export default function EmployeeDashboard() {
  const { user, loading: loadingUser, error } = useCurrentUser();
  const [today, setToday] = useState<Attendance | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyAttendance(), getMyEmployee()])
      .then(([attendance, profile]) => {
        const date = new Date().toISOString().slice(0, 10);
        setToday(attendance.find((record) => record.workDate === date) ?? null);
        setEmployee(profile);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loadingUser || loading) return <PageState type="loading" title="Đang tải không gian làm việc..." />;
  if (error || !user) return <PageState type="error" title="Không thể tải thông tin cá nhân" description={error} />;

  return <div className="moduleStack">
    <section className="card"><p className="eyebrow">Không gian của tôi</p><h2>Xin chào, {user.employeeName || user.username}</h2><p className="muted">Hôm nay là {new Intl.DateTimeFormat("vi-VN", { dateStyle: "full" }).format(new Date())}.</p></section>
    <section className="statsGrid">
      <article className="statCard accentCard"><span className="statLabel">Trạng thái hôm nay</span><strong className="statText">{today?.status === "COMPLETED" ? "Đã hoàn tất" : today?.checkIn ? "Đang làm việc" : "Chưa chấm công"}</strong><small>Vào: {formatDateTime(today?.checkIn)}</small></article>
      <article className="statCard"><span className="statLabel">Phép còn lại</span><strong>{employee?.remainingLeaveDays ?? "—"}</strong><small>Ngày phép khả dụng</small></article>
      <article className="statCard"><span className="statLabel">Giờ ra</span><strong className="statText">{formatDateTime(today?.checkOut)}</strong><small>Cập nhật theo chấm công</small></article>
    </section>
    <section className="moduleGrid">
      <Link className="moduleCard" href="/attendance"><span>01</span><div><h3>Chấm công</h3><p>Ghi nhận giờ vào và giờ ra.</p></div><b>→</b></Link>
      <Link className="moduleCard" href="/leaves"><span>02</span><div><h3>Nghỉ phép</h3><p>Tạo và theo dõi đơn nghỉ của bạn.</p></div><b>→</b></Link>
      <Link className="moduleCard" href="/payroll"><span>03</span><div><h3>Bảng lương</h3><p>Xem bảng lương cá nhân.</p></div><b>→</b></Link>
    </section>
  </div>;
}
