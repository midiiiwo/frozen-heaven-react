import { Link, useLocation } from "react-router";
import { useCartStore } from "../stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isShop = location.pathname.startsWith("/shop");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-[#1b4b27] hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-[#1b4b27] rounded-full flex items-center justify-center">
              <svg
                width="20"
                height="20"
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
            <span className="text-xl font-bold">Frozen Haven</span>
          </Link>

          {/* Navigation */}
          <nav className="relative flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
            <div className="relative flex items-center gap-2">
              {/** Animated Background */}
              <AnimatePresence>
                {(isHome || isShop) && (
                  <motion.div
                    key={isHome ? "home" : "shop"}
                    layoutId="active-pill"
                    className="absolute inset-0 bg-[#1b4b27] rounded-md"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                    style={{
                      width: "50%",
                      left: isHome ? 0 : "50%",
                    }}
                  />
                )}
              </AnimatePresence>

              {/** Links */}
              <Link
                to="/"
                className={`relative z-10 px-4 py-2 rounded-md font-medium transition-colors ${
                  isHome ? "text-white" : "text-gray-700 hover:text-[#1b4b27]"
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`relative z-10 px-4 py-2 rounded-md font-medium transition-colors ${
                  isShop ? "text-white" : "text-gray-700 hover:text-[#1b4b27]"
                }`}
              >
                Shop
              </Link>
            </div>
          </nav>

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative w-10 h-10 bg-[#1b4b27] rounded-md flex items-center justify-center text-white hover:bg-[#143820] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2L3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V6L14 2H6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 10C13 10.7956 12.6839 11.5587 12.1213 12.1213C11.5587 12.6839 10.7956 13 10 13C9.20435 13 8.44129 12.6839 7.87868 12.1213C7.31607 11.5587 7 10.7956 7 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#f8ba07] text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
