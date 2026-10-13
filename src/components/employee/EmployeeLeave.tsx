"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createMyLeave, getMyLeaves } from "@/services/leaveService";
import type { Leave } from "@/types/modules";
import PageState from "@/components/ui/PageState";
import LeaveList from "@/components/leaves/LeaveList";
import { getApiErrorMessage } from "@/utils/apiError";

export default function EmployeeLeave() {
  const [leaves, setLeaves] = useState<Leave[]>([]); const [reason, setReason] = useState(""); const [startDate, setStartDate] = useState(""); const [endDate, setEndDate] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  useEffect(() => { getMyLeaves().then(setLeaves).catch((e) => setError(getApiErrorMessage(e, "Không thể tải đơn nghỉ phép."))).finally(() => setLoading(false)); }, []);
  async function submit(e: FormEvent) { e.preventDefault(); try { setSaving(true); setError(""); const leave = await createMyLeave({ startDate, endDate, reason }); setLeaves((items) => [leave, ...items]); setReason(""); } catch (requestError) { setError(getApiErrorMessage(requestError, "Không thể tạo đơn nghỉ.")); } finally { setSaving(false); } }
  if (loading) return <PageState type="loading" title="Đang tải đơn nghỉ phép..." />;
  return <div className="moduleStack"><form className="card form" onSubmit={(e) => void submit(e)}><div className="formHeading fullField"><p className="eyebrow">Nghỉ phép của tôi</p><h2>Tạo đơn nghỉ phép</h2></div><div className="field"><label htmlFor="leave-start">Từ ngày</label><input id="leave-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div><div className="field"><label htmlFor="leave-end">Đến ngày</label><input id="leave-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div><div className="field fullField"><label htmlFor="leave-reason">Lý do</label><textarea id="leave-reason" minLength={10} value={reason} onChange={(e) => setReason(e.target.value)} required /></div><div className="formActions fullField"><button className="button primary" disabled={saving}>{saving ? "Đang gửi..." : "Gửi đơn nghỉ"}</button></div></form>{error && <PageState type="error" title="Có lỗi xảy ra" description={error} />}{!error && (leaves.length ? <LeaveList leaves={leaves} canReview={false} onChange={() => undefined} onError={setError} /> : <PageState title="Chưa có đơn nghỉ phép" />)}</div>;
}
