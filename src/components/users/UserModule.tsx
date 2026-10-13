"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getUsers } from "@/services/userService";
import type { UserAccount } from "@/types/modules";
import PageState from "@/components/ui/PageState";
import UserTable from "./UserTable";
import CreateEmployeeAccountForm from "./CreateEmployeeAccountForm";

export default function UserModule() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const isAdmin = session?.roles.includes("ADMIN") ?? false;

  useEffect(() => {
    if (!isAdmin) return;
    getUsers()
      .then(setUsers)
      .catch(() => setError("Không thể tải danh sách tài khoản."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return <PageState type="error" title="Không có quyền truy cập" description="Phân hệ này chỉ dành cho quản trị viên." />;

  function replaceUser(changed: UserAccount) {
    setUsers((current) => current.map((user) => user.id === changed.id ? changed : user));
  }

  function addUser(account: UserAccount) {
    setUsers((current) => [...current, account]);
    setShowCreateForm(false);
  }

  return (
    <div className="moduleStack">
      <div className="sectionToolbar"><p className="muted">{users.length} tài khoản trên hệ thống</p><div className="actions"><span className="roleNote">Chỉ quản trị viên</span><button className="button primary" type="button" onClick={() => setShowCreateForm((visible) => !visible)}>{showCreateForm ? "Đóng form" : "+ Tạo tài khoản"}</button></div></div>
      {showCreateForm && <CreateEmployeeAccountForm onCreated={addUser} onCancel={() => setShowCreateForm(false)} />}
      {loading && <PageState type="loading" title="Đang tải tài khoản" />}
      {error && <PageState type="error" title="Có lỗi xảy ra" description={error} />}
      {!loading && !error && users.length === 0 && <PageState title="Chưa có tài khoản" />}
      {!loading && users.length > 0 && <UserTable users={users} onChange={replaceUser} onError={setError} />}
    </div>
  );
}
