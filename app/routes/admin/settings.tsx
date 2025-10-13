// import { useState } from "react";
// import type { Route } from "./+types/settings";
// import { seedDatabase } from "../../lib/seed/seedDatabase";

// export function meta({}: Route.MetaArgs) {
//   return [{ title: "Settings - Admin - Frozen Haven" }];
// }

// export default function AdminSettings() {
//   const [seeding, setSeeding] = useState(false);
//   const [seedMessage, setSeedMessage] = useState("");

//   const handleSeedDatabase = async () => {
//     if (
//       confirm(
//         "Are you sure you want to seed the database? This will add products and categories."
//       )
//     ) {
//       setSeeding(true);
//       setSeedMessage("");

//       const result = await seedDatabase();

//       setSeedMessage(result.message);
//       setSeeding(false);
//     }
//   };

//   return (
//     <div className="p-6 lg:p-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
//         <p className="text-gray-600">
//           Manage your store settings and preferences
//         </p>
//       </div>

//       {/* Database Management Section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Database Management
//         </h2>
//         <p className="text-gray-600 mb-4">
//           Seed the database with initial products and categories. This is useful
//           when setting up the store for the first time.
//         </p>

//         {seedMessage && (
//           <div
//             className={`p-4 mb-4 rounded-md ${seedMessage.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
//           >
//             {seedMessage}
//           </div>
//         )}

//         <button
//           onClick={handleSeedDatabase}
//           disabled={seeding}
//           className="px-6 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {seeding ? "Seeding Database..." : "Seed Database"}
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4">
//           Store Information
//         </h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Store Name
//             </label>
//             <input
//               type="text"
//               defaultValue="Frozen Haven"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Contact Email
//             </label>
//             <input
//               type="email"
//               defaultValue="admin@frozenhaven.com"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               defaultValue="+233 XX XXX XXXX"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
//             />
//           </div>
//           <button className="px-6 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium">
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import type { Route } from "./+types/settings";
import { seedDatabase } from "../../lib/seed/seedDatabase";
import { useGetProducts } from "../../hooks/useProducts";
import { useGetOrders } from "../../hooks/useOrders";
import { useGetCategories } from "../../hooks/useCetegory";
import { useGetCustomers } from "../../hooks/useCustomer";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings - Admin - Frozen Haven" }];
}

export default function AdminSettings() {
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  // Fetch data for stats
  const { data: products } = useGetProducts();
  const { data: orders } = useGetOrders();
  const { data: categories } = useGetCategories();
  const { data: customers } = useGetCustomers();

  // Check Firebase connection
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  };

  const isFirebaseConfigured = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );

  const handleSeedDatabase = async () => {
    if (
      confirm(
        "Are you sure you want to seed the database? This will add products and categories."
      )
    ) {
      setSeeding(true);
      setSeedMessage("");

      const result = await seedDatabase();

      setSeedMessage(result.message);
      setSeeding(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your store settings and preferences
        </p>
      </div>

      {/* Firebase Connection Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Firebase Connection
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${isFirebaseConfigured ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="font-medium">
              {isFirebaseConfigured ? "Connected" : "Not Connected"}
            </span>
          </div>
          {isFirebaseConfigured && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Project ID:</span>{" "}
                {firebaseConfig.projectId}
              </p>
              <p>
                <span className="font-medium">Auth Domain:</span>{" "}
                {firebaseConfig.authDomain}
              </p>
            </div>
          )}
          {!isFirebaseConfigured && (
            <p className="text-sm text-red-600">
              Please configure Firebase environment variables in .env file
            </p>
          )}
        </div>
      </div>

      {/* Database Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Database Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">
              {products?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Products</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">
              {orders?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Orders</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {categories?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Categories</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-3xl font-bold text-orange-600">
              {customers?.length || 0}
            </p>
            <p className="text-sm text-gray-600 mt-1">Customers</p>
          </div>
        </div>
      </div>

      {/* Database Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Database Management
        </h2>
        <p className="text-gray-600 mb-4">
          Seed the database with initial products and categories. This is useful
          when setting up the store for the first time.
        </p>

        {seedMessage && (
          <div
            className={`p-4 mb-4 rounded-md ${seedMessage.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
          >
            {seedMessage}
          </div>
        )}

        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="px-6 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {seeding ? "Seeding Database..." : "Seed Database"}
        </button>

        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Seeding will add 22 products and 8 categories
            to your database. Existing data will not be duplicated.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Store Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="Frozen Haven"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              defaultValue="admin@frozenhaven.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+233 XX XXX XXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1b4b27]"
            />
          </div>
          <button className="px-6 py-2 bg-[#1b4b27] text-white rounded-md hover:bg-[#143820] transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
