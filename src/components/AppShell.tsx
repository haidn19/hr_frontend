"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, type ReactNode } from "react";
import AuthGuard from "./AuthGuard";
import { useCurrentUser } from "./CurrentUserProvider";

const navigation = [
  { href: "/", label: "Tổng quan", short: "" },
  { href: "/employees", label: "Nhân viên", short: "" },
  { href: "/departments", label: "Phòng ban", short: "" },
  { href: "/attendance", label: "Chấm công", short: "" },
  { href: "/leaves", label: "Nghỉ phép", short: "" },
  { href: "/payroll", label: "Bảng lương", short: "" },
  { href: "/users", label: "Tài khoản", short: "TK", adminOnly: true },
];

const employeeNavigation = [
  { href: "/dashboard", label: "Tổng quan", short: "" },
  { href: "/employees/me", label: "Nhân viên", short: "" },
  { href: "/attendance", label: "Chấm công", short: "" },
  { href: "/leaves", label: "Nghỉ phép", short: "" },
  { href: "/payroll", label: "Bảng lương", short: "" },
];

interface Props {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function AppShell({
  title,
  description,
  children,
  action,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { user, loading } = useCurrentUser();
  const isAdmin = user?.role === "ADMIN" || (session?.roles.includes("ADMIN") ?? false);
  const isEmployee = user?.role === "EMPLOYEE" || (session?.roles.includes("EMPLOYEE") ?? false);
  const activeNavigation = isEmployee ? employeeNavigation : navigation.filter((item) => !item.adminOnly || isAdmin);
  const displayName = user?.employeeName || user?.username || session?.user?.name || "Người dùng";

  useEffect(() => {
    const adminPaths = ["/users", "/departments", "/employees/create"];
    if (isEmployee && adminPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      router.replace("/dashboard");
    }
    if (isEmployee && pathname === "/employees") router.replace("/employees/me");
    if (isEmployee && pathname === "/") router.replace("/dashboard");
  }, [isEmployee, pathname, router]);

  return (
    <AuthGuard>
      <div className="appShell">
        <aside className="sidebar">
          <Link className="brand" href="/" title="Về trang tổng quan">
            <span className="brandMark">NS</span>
            <span>
              <strong>Quản lý nhân sự</strong>
            </span>
          </Link>

          <p className="navLabel">{isEmployee ? "Không gian của tôi" : "Quản lý"}</p>

          <nav className="navigation" aria-label="Điều hướng chính">
            {activeNavigation
              .map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    className={active ? "navItem active" : "navItem"}
                    href={item.href}
                    key={item.href}
                    title={`Mở ${item.label.toLowerCase()}`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{item.short}</span>
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="sidebarFooter">
            <div className="userAvatar">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <strong>{loading ? "Đang tải..." : displayName}</strong>
              <small>{isAdmin ? "Quản trị viên" : "Nhân viên"}</small>
            </div>
            <button
              className="logoutButton"
              type="button"
              title="Đăng xuất khỏi hệ thống"
              aria-label="Đăng xuất khỏi hệ thống"
              onClick={() => void signOut({ callbackUrl: "/login" })}
            >
              Thoát
            </button>
          </div>
        </aside>

        <main className="mainArea">
          <header className="pageHeader">
            <div>
              <p className="eyebrow">Hệ thống quản lý nhân sự</p>
              <h1>{title}</h1>
              <p className="pageDescription">{description}</p>
            </div>
            {action && <div className="headerAction">{action}</div>}
          </header>
          <div className="pageContent">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
