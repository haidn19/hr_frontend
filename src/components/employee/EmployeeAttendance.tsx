"use client";

import { useEffect, useState } from "react";
import { checkInMe, checkOutMe, getMyAttendance } from "@/services/attendanceService";
import { getApiErrorMessage } from "@/utils/apiError";
import { formatDateTime, formatMinutes, toDateInputValue } from "@/utils/format";
import type { Attendance } from "@/types/modules";
import PageState from "@/components/ui/PageState";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";

export default function EmployeeAttendance() {
  const [records, setRecords] = useState<Attendance[]>([]); const [loading, setLoading] = useState(true); const [busy, setBusy] = useState<"in" | "out" | null>(null); const [error, setError] = useState("");
  const today = toDateInputValue(); const record = records.find((item) => item.workDate === today) ?? null;
  const load = () => getMyAttendance().then(setRecords).catch((e) => setError(getApiErrorMessage(e, "Không thể tải dữ liệu chấm công."))).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  async function punch(action: "in" | "out") { try { setBusy(action); setError(""); await (action === "in" ? checkInMe() : checkOutMe()); await load(); } catch (e) { setError(getApiErrorMessage(e, "Không thể chấm công. Vui lòng thử lại.")); } finally { setBusy(null); } }
  if (loading) return <PageState type="loading" title="Đang tải dữ liệu chấm công..." />;
  return <div className="moduleStack"><section className="card actionCard"><div className="formHeading"><p className="eyebrow">Hôm nay</p><h2>Chấm công</h2><p className="muted">Giờ vào: {formatDateTime(record?.checkIn)} · Giờ ra: {formatDateTime(record?.checkOut)}</p></div><div className="buttonGroup"><button className="button primary" type="button" disabled={busy !== null || !!record?.checkIn} onClick={() => void punch("in")}>{busy === "in" ? "Đang chấm công..." : "Check-in"}</button><button className="button" type="button" disabled={busy !== null || !record?.checkIn || !!record?.checkOut} onClick={() => void punch("out")}>{busy === "out" ? "Đang chấm công..." : "Check-out"}</button></div></section>{error && <PageState type="error" title="Không thể thực hiện" description={error} />}{record && <AttendanceSummary record={record} />}<section className="tableWrap"><table><thead><tr><th>Ngày</th><th>Vào</th><th>Ra</th><th>Đi muộn</th><th>Về sớm</th><th>OT</th></tr></thead><tbody>{records.map((item) => <tr key={item.id}><td>{item.workDate}</td><td>{formatDateTime(item.checkIn)}</td><td>{formatDateTime(item.checkOut)}</td><td>{formatMinutes(item.lateMinutes)}</td><td>{formatMinutes(item.earlyLeaveMinutes)}</td><td>{formatMinutes(item.overtimeMinutes)}</td></tr>)}</tbody></table></section></div>;
}
