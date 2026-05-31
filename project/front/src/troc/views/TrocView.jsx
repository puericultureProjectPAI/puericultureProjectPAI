/**
 * TrocView Component (Main Troc Page)
 * Integrates the complete exchange flow showing:
 * 1. Form to propose exchanges
 * 2. List of user's own exchanges
 * 3. List of exchanges proposed to user
 * 4. LABORATOIRE : Test de l'échange triangulaire (Back-end Matching)
 */

import { useEffect, useState } from "react";
import { useExchangeManager } from "../hooks/useExchangeManager";
import { useAuth } from "../../common/security/AuthContext";
import ExchangeProposalForm from "../components/ExchangeProposalForm";
import ExchangeList from "../components/ExchangeList";

// On importe ton composant de test depuis l'index de ton module troc
import TriangularExchangePage from "../pages/TriangularExchangePage";

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
  const { user } = useAuth();
  const exchangeManager = useExchangeManager();
  const [activeSection, setActiveSection] = useState("overview");

  const mockAvailableProducts = getMockAvailableProducts(
    user?.id,
    user?.user_metadata?.firstName || "User",
    user?.user_metadata?.lastName || "",
  );

  const { fetchMyExchanges, fetchExchangesProposedToMe } = exchangeManager;

  useEffect(() => {
    fetchMyExchanges();
    fetchExchangesProposedToMe();
  }, [fetchMyExchanges, fetchExchangesProposedToMe]);

  const handleCreateExchange = async (proposerProduct, receiverProduct) => {
    try {
      const response = await exchangeManager.createNewExchange(
        proposerProduct,
        receiverProduct,
      );
      return response;
    } catch (err) {
      console.error("Failed to create exchange:", err);
    }
  };

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
            Trade your unwanted items for products you need.
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

          {/* NOUVEL ONGLET : AJOUTÉ POUR TON LABO TRIANGULAIRE */}
          <button
            onClick={() => setActiveSection("triangular")}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeSection === "triangular"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-orange-300 hover:bg-orange-50 text-orange-600"
            }`}
          >
            ⚡ Triangular Match (Labo)
          </button>
        </div>

        {/* 1. Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">How TROC Works</h2>
              <div className="grid md:grid-cols-2 gap-8">
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
                  </div>
                </div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Propose Exchange Section */}
        {activeSection === "propose" && (
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
        )}

        {/* 3. Manage Exchanges Section */}
        {activeSection === "manage" && (
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
        )}

        {/* 4. NOUVELLE SECTION : Affichage de ton composant de test */}
        {/* 4. NOUVELLE SECTION : Affichage de ton prototype d'échange triangulaire */}
        {activeSection === "triangular" && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <TriangularExchangePage />
          </div>
        )}

        {/* Global Toast Messages */}
        {exchangeManager.error && activeSection !== "propose" && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow z-50">
            {exchangeManager.error}
          </div>
        )}
        {exchangeManager.successMessage && activeSection !== "propose" && (
          <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow z-50">
            {exchangeManager.successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrocView;
