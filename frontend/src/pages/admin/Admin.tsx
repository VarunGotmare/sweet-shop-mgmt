import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              {user?.name} · {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="flex gap-8 text-sm font-medium">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `py-4 border-b-2 ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`
              }
            >
              Sweets
            </NavLink>

            <NavLink
              to="/admin/transactions"
              className={({ isActive }) =>
                `py-4 border-b-2 ${
                  isActive
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`
              }
            >
              Transactions
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
