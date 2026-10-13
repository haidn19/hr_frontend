"use client";

import { useState, type FormEvent } from "react";
import { getMyPayroll } from "@/services/payrollService";
import type { Payroll } from "@/types/modules";
import PayrollResult from "@/components/payroll/PayrollResult";
import PageState from "@/components/ui/PageState";
import { getApiErrorMessage } from "@/utils/apiError";

export default function EmployeePayroll() {
  const now = new Date(); const [month, setMonth] = useState(now.getMonth() + 1); const [year, setYear] = useState(now.getFullYear()); const [payroll, setPayroll] = useState<Payroll | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function submit(e: FormEvent) { e.preventDefault(); try { setLoading(true); setError(""); setPayroll(await getMyPayroll(month, year)); } catch (requestError) { setError(getApiErrorMessage(requestError, "Không thể tải bảng lương.")); } finally { setLoading(false); } }
  return <div className="moduleStack"><form className="card inlineForm" onSubmit={(e) => void submit(e)}><div className="formHeading"><p className="eyebrow">Bảng lương của tôi</p><h2>Xem theo kỳ</h2></div><div className="field"><label htmlFor="salary-month">Tháng</label><input id="salary-month" type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} /></div><div className="field"><label htmlFor="salary-year">Năm</label><input id="salary-year" type="number" min="2020" value={year} onChange={(e) => setYear(Number(e.target.value))} /></div><button className="button primary" disabled={loading}>{loading ? "Đang tải..." : "Xem bảng lương"}</button></form>{error && <PageState type="error" title="Không thể tải bảng lương" description={error} />}{payroll && <PayrollResult payroll={payroll} />}{!payroll && !error && <PageState title="Chưa chọn kỳ lương" description="Chọn tháng và năm để xem bảng lương của bạn." />}</div>;
}
