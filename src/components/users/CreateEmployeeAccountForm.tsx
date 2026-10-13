"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getEmployees } from "@/services/employeeService";
import { createEmployeeAccount } from "@/services/userService";
import { getApiErrorMessage } from "@/utils/apiError";
import type { Employee } from "@/types/employee";
import type { UserAccount } from "@/types/modules";

export default function CreateEmployeeAccountForm({
  onCreated,
  onCancel,
}: {
  onCreated: (account: UserAccount) => void;
  onCancel: () => void;
}) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError("Không thể tải danh sách nhân viên."))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim()) {
      setError("Vui lòng nhập username.");
      return;
    }
    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (!employeeId) {
      setError("Vui lòng chọn nhân viên.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const account = await createEmployeeAccount({
        username: username.trim(),
        password,
        employeeId: Number(employeeId),
        status,
      });
      onCreated(account);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Không thể tạo tài khoản."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="card form" noValidate onSubmit={(event) => void submit(event)}>
      <div className="formHeading">
        <p className="eyebrow">Tài khoản nhân viên</p>
        <h2>Tạo tài khoản</h2>
        <p className="muted">Mỗi nhân viên chỉ có thể được liên kết với một tài khoản.</p>
      </div>
      <div className="field">
        <label htmlFor="account-username">Username</label>
        <input id="account-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="account-password">Mật khẩu</label>
        <input id="account-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required minLength={8} maxLength={100} />
      </div>
      <div className="field">
        <label htmlFor="account-employee">Nhân viên</label>
        <select id="account-employee" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} disabled={loading} required>
          <option value="">{loading ? "Đang tải..." : "Chọn nhân viên"}</option>
          {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} (NV-{employee.id})</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="account-status">Trạng thái</label>
        <select id="account-status" value={status ? "active" : "inactive"} onChange={(event) => setStatus(event.target.value === "active")}>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm khóa</option>
        </select>
      </div>
      <div className="field">
        <label>Vai trò</label>
        <div className="roleNote">Nhân viên (EMPLOYEE)</div>
      </div>
      {error && <p className="error fullField" role="alert">{error}</p>}
      <div className="formActions fullField">
        <button className="button primary" type="submit" disabled={loading || submitting}>{submitting ? "Đang tạo..." : "Tạo tài khoản"}</button>
        <button className="button" type="button" onClick={onCancel} disabled={submitting}>Hủy</button>
      </div>
    </form>
  );
}
