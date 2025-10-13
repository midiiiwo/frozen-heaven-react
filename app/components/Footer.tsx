import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-[#1b4b27] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link
                to="/shop"
                className="hover:text-gray-300 transition-colors"
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="flex flex-col gap-2">
              <p>(+233) 123-456-789</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                Off Fiapre Odumase Road near Kyenky3 hene's House
              </a>
              <p>Delivery Available</p>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Business Hours</h3>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">Operating Hours</p>
              <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
              <p>Saturday: 9:00 AM - 5:00 PM</p>
              <p>Sunday: 10:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center">
          <p>© 2025 Frozen Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
