import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      section: "Dashboard",
      items: [
        { path: "/admin", label: "Overview", icon: "📊" },
        { path: "/admin/analytics", label: "Analytics", icon: "📈" },
      ],
    },
    {
      section: "Inventory",
      items: [
        { path: "/admin/products", label: "Products", icon: "📦" },
        { path: "/admin/categories", label: "Categories", icon: "🏷️" },
        { path: "/admin/stock", label: "Stock Management", icon: "📋" },
      ],
    },
    {
      section: "Orders & Customers",
      items: [
        { path: "/admin/orders", label: "Orders", icon: "🛒" },
        { path: "/admin/customers", label: "Customers", icon: "👥" },
      ],
    },
    {
      section: "System",
      items: [{ path: "/admin/settings", label: "Settings", icon: "⚙️" }],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1b4b27] text-white rounded-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Link to="/" className="flex items-center gap-2 text-[#1b4b27]">
              <div className="w-8 h-8 bg-[#1b4b27] rounded-full flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2L3 7V13L10 18L17 13V7L10 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg">Frozen Haven</span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            {navItems.map((section, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          isActive(item.path)
                            ? "bg-green-50 text-[#1b4b27]"
                            : "text-gray-700 hover:bg-gray-100"
                        }
                      `}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/products"
                className="block w-full px-4 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors text-sm font-medium text-center"
              >
                Add Product
              </Link>
              <Link
                to="/"
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-center"
              >
                View Store
              </Link>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#1b4b27] rounded-full flex items-center justify-center text-white font-bold">
                {adminEmail?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
