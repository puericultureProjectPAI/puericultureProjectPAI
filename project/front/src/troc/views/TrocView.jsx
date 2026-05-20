/**
 * TrocView Component (Main Troc Page)
 * Integrates the complete exchange flow showing:
 * 1. Form to propose exchanges
 * 2. List of user's own exchanges
 * 3. List of exchanges proposed to user
 *
 * User journey visualization:
 * - PROPOSER FLOW: Create proposal (PENDING) → see response → delete if needed
 * - RECEIVER FLOW: Receive proposal → accept (ACCEPTED) → negotiate (chat) → confirm (CONFIRMED)
 * - Both: refuse if not interested (REFUSED)
 */

import { useEffect, useState } from "react";
import { useExchangeManager } from "../hooks/useExchangeManager";
import { useAuth } from "../../common/security/AuthContext";
import ExchangeProposalForm from "../components/ExchangeProposalForm";
import ExchangeList from "../components/ExchangeList";

// Mock products - In real app, these would come from backend and use the authenticated user's ID
// For now, we generate mock products dynamically with the real user ID
const getMockAvailableProducts = (userId, userFirstName, userLastName) => [
  {
    id: 1,
    postTitle: "Vintage High Chair",
    category: "Meubles et décoration",
    status: "AVAILABLE",
    author: { id: userId, firstName: userFirstName, lastName: userLastName },
  },
  {
    id: 2,
    postTitle: "Baby Stroller",
    category: "Poussettes, porte-bébés et sièges auto",
    status: "AVAILABLE",
    author: { id: userId, firstName: userFirstName, lastName: userLastName },
  },
  {
    id: 3,
    postTitle: "Crib Set",
    category: "Meubles et décoration",
    status: "AVAILABLE",
    author: { id: userId, firstName: userFirstName, lastName: userLastName },
  },
];

const MOCK_OTHER_PRODUCTS = [
  {
    id: 101,
    postTitle: "Baby Car Seat",
    category: "Sécurité bébé et enfant",
    status: "AVAILABLE",
    author: { id: "other-user-1", firstName: "Jane", lastName: "Smith" },
  },
  {
    id: 102,
    postTitle: "Playpen",
    category: "Jeux et jouets",
    status: "AVAILABLE",
    author: { id: "other-user-2", firstName: "Bob", lastName: "Johnson" },
  },
  {
    id: 103,
    postTitle: "Changing Table",
    category: "Meubles et décoration",
    status: "AVAILABLE",
    author: { id: "other-user-1", firstName: "Jane", lastName: "Smith" },
  },
  {
    id: 104,
    postTitle: "Baby Monitor",
    category: "Santé et grossesse",
    status: "AVAILABLE",
    author: { id: "other-user-3", firstName: "Alice", lastName: "Williams" },
  },
];

const TrocView = () => {
  // Get authenticated user from context (replaces MOCK_CURRENT_USER_ID)
  const { user } = useAuth();

  // Exchange manager hook for all exchange operations
  const exchangeManager = useExchangeManager();

  // Local component state
  const [activeSection, setActiveSection] = useState("overview");

  /**
   * Generate mock products with the authenticated user's real ID
   * In production, these will come from backend API calls
   */
  const mockAvailableProducts = getMockAvailableProducts(
    user?.id,
    user?.user_metadata?.firstName || "User",
    user?.user_metadata?.lastName || "",
  );

  const { fetchMyExchanges, fetchExchangesProposedToMe } = exchangeManager;

  /**
   * Initialize: Load all exchanges when component mounts
   */
  useEffect(() => {
    // Load user's exchanges
    fetchMyExchanges();
    // Load exchanges proposed to this user
    fetchExchangesProposedToMe();
  }, [fetchMyExchanges, fetchExchangesProposedToMe]);

  /**
   * Handle exchange creation
   * Creates a new exchange proposal with the selected products
   */
  const handleCreateExchange = async (proposerProduct, receiverProduct) => {
    try {
      const response = await exchangeManager.createNewExchange(
        proposerProduct,
        receiverProduct,
      );
      // Success: form will be reset in useExchangeManager
      return response;
    } catch (err) {
      console.error("Failed to create exchange:", err);
      // Error is handled in the hook and displayed via exchangeManager.error
    }
  };

  /**
   * Get statistics for the dashboard summary
   */
  const getStats = () => {
    const pendingCount = exchangeManager.myExchanges.filter(
      (e) => e.status === "PENDING",
    ).length;
    const incomingCount = exchangeManager.proposedToMeExchanges.filter(
      (e) => e.status === "PENDING",
    ).length;
    const activeCount =
      exchangeManager.myExchanges.filter(
        (e) => e.status === "ACCEPTED" || e.status === "PENDING",
      ).length +
      exchangeManager.proposedToMeExchanges.filter(
        (e) => e.status === "ACCEPTED" || e.status === "PENDING",
      ).length;
    const completedCount =
      exchangeManager.myExchanges.filter((e) => e.status === "CONFIRMED")
        .length +
      exchangeManager.proposedToMeExchanges.filter(
        (e) => e.status === "CONFIRMED",
      ).length;

    return { pendingCount, incomingCount, activeCount, completedCount };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TROC - Product Exchange
          </h1>
          <p className="text-gray-600">
            Trade your unwanted items for products you need. Free, easy, and
            community-driven.
          </p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingCount}
            </p>
            <p className="text-sm text-gray-600">My Pending Proposals</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {stats.incomingCount}
            </p>
            <p className="text-sm text-gray-600">Incoming Proposals</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {stats.activeCount}
            </p>
            <p className="text-sm text-gray-600">Active Negotiations</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.completedCount}
            </p>
            <p className="text-sm text-gray-600">Completed Exchanges</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveSection("overview")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeSection === "overview"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            📋 Overview
          </button>
          <button
            onClick={() => setActiveSection("propose")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeSection === "propose"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            ✏️ Propose Exchange
          </button>
          <button
            onClick={() => setActiveSection("manage")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeSection === "manage"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            📦 Manage Exchanges
          </button>
        </div>

        {/* Overview Section - Information and Journey */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* User Journey Flow */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">How TROC Works</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Proposer Journey */}
                <div>
                  <h3 className="font-bold text-lg text-blue-600 mb-3">
                    🎯 As a Proposer
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">Propose Exchange</p>
                        <p className="text-sm text-gray-600">
                          Select your product and the one you want
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-yellow-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-yellow-600">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Wait for Response</p>
                        <p className="text-sm text-gray-600">
                          Proposal is PENDING until the other user responds
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-red-600">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">Delete if Needed</p>
                        <p className="text-sm text-gray-600">
                          You can delete your proposal while it's still pending
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Receiver Journey */}
                <div>
                  <h3 className="font-bold text-lg text-purple-600 mb-3">
                    👤 As a Receiver
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-purple-600">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">Receive Proposal</p>
                        <p className="text-sm text-gray-600">
                          Someone proposes an exchange for your product
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Accept & Negotiate</p>
                        <p className="text-sm text-gray-600">
                          Accept the proposal and chat to finalize details
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">Confirm Exchange</p>
                        <p className="text-sm text-gray-600">
                          Both products are now permanently closed
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-red-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold text-red-600">
                        4
                      </div>
                      <div>
                        <p className="font-semibold">Refuse (Optional)</p>
                        <p className="text-sm text-gray-600">
                          You can refuse any proposal at any time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveSection("propose")}
                  className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                >
                  ➕ Create New Proposal
                </button>
                <button
                  onClick={() => setActiveSection("manage")}
                  className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center font-semibold"
                >
                  📊 View All Exchanges
                </button>
                <button
                  onClick={exchangeManager.fetchExchangesProposedToMe}
                  className="p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center font-semibold"
                >
                  🔄 Refresh Proposals
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Propose Exchange Section */}
        {activeSection === "propose" && (
          <div>
            <ExchangeProposalForm
              availableProducts={mockAvailableProducts}
              otherUserProducts={MOCK_OTHER_PRODUCTS}
              onSubmit={handleCreateExchange}
              loading={exchangeManager.loading}
              error={exchangeManager.error}
              success={exchangeManager.successMessage}
              onClearMessages={() => {
                exchangeManager.clearError();
                exchangeManager.clearSuccessMessage();
              }}
            />
          </div>
        )}

        {/* Manage Exchanges Section */}
        {activeSection === "manage" && (
          <div>
            <ExchangeList
              myExchanges={exchangeManager.myExchanges}
              proposedToMeExchanges={exchangeManager.proposedToMeExchanges}
              currentUserId={user?.id}
              onAccept={exchangeManager.acceptExchangeProposal}
              onConfirm={exchangeManager.confirmExchangeProposal}
              onRefuse={exchangeManager.refuseExchangeProposal}
              onDelete={exchangeManager.deleteExchangeProposal}
              loading={exchangeManager.loading}
            />
          </div>
        )}

        {/* Global Error/Success Messages */}
        {exchangeManager.error && activeSection !== "propose" && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow">
            {exchangeManager.error}
          </div>
        )}

        {exchangeManager.successMessage && activeSection !== "propose" && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow">
            {exchangeManager.successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrocView;
