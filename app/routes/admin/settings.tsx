import { useState } from "react";
import type { Route } from "./+types/settings";
import { seedDatabase } from "../../lib/seed/seedDatabase";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Settings - Admin - Frozen Haven" }];
}

export default function AdminSettings() {
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

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
