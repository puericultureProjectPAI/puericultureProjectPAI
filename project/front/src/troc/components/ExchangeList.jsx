/**
 * ExchangeList Component
 * Displays lists of exchanges with filtering and management capabilities
 * Shows "My Exchanges" and "Exchanges Proposed to Me" tabs
 * User journey step: viewing and managing all exchange proposals
 */

import { useState } from "react";
import ExchangeCard from "./ExchangeCard";

const ExchangeList = ({
  myExchanges = [],
  proposedToMeExchanges = [],
  currentUserId,
  onAccept,
  onConfirm,
  onRefuse,
  onDelete,
  loading = false,
}) => {
  // Tab state to switch between "My Exchanges" and "Proposed to Me"
  const [activeTab, setActiveTab] = useState("my-exchanges");

  /**
   * Filter status for exchange display
   * Can show all, only pending, or only active exchanges
   */
  const [statusFilter, setStatusFilter] = useState("all");

  /**
   * Filter exchanges based on selected status
   * @param {Array} exchanges - The exchanges to filter
   * @returns {Array} Filtered exchanges
   */
  const filterExchanges = (exchanges) => {
    if (statusFilter === "all") return exchanges;
    if (statusFilter === "active")
      return exchanges.filter(
        (e) => e.status !== "CONFIRMED" && e.status !== "REFUSED",
      );
    if (statusFilter === "pending")
      return exchanges.filter((e) => e.status === "PENDING");
    return exchanges;
  };

  // Get active exchanges based on selected tab
  const displayedExchanges =
    activeTab === "my-exchanges"
      ? filterExchanges(myExchanges)
      : filterExchanges(proposedToMeExchanges);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Exchange Management</h2>

      {/* Tabs for switching between my exchanges and proposed to me */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("my-exchanges")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "my-exchanges"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          My Exchanges ({myExchanges.length})
        </button>
        <button
          onClick={() => setActiveTab("proposed-to-me")}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === "proposed-to-me"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Proposed to Me ({proposedToMeExchanges.length})
        </button>
      </div>

      {/* Filter buttons for status */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="text-sm font-semibold text-gray-600 self-center">
          Filter:
        </span>
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-gray-900 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("active")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter("pending")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            statusFilter === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending
        </button>
      </div>

      {/* Empty state - no exchanges */}
      {displayedExchanges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">No exchanges found</p>
          <p className="text-gray-400 text-sm">
            {activeTab === "my-exchanges"
              ? "You haven't proposed any exchanges yet."
              : "No exchange proposals have been made for your products yet."}
          </p>
        </div>
      ) : (
        /* Display exchange cards */
        <div className="space-y-4">
          {displayedExchanges.map((exchange) => (
            <ExchangeCard
              key={exchange.id}
              exchange={exchange}
              // Determine if current user is proposer or receiver
              isProposer={
                exchange.proposerProduct?.author?.id === currentUserId
              }
              isReceiver={
                exchange.receiverProduct?.author?.id === currentUserId
              }
              // Action handlers
              onAccept={onAccept}
              onConfirm={onConfirm}
              onRefuse={onRefuse}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      )}

      {/* Status summary at the bottom */}
      {displayedExchanges.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-yellow-50 p-3 rounded">
              <p className="text-2xl font-bold text-yellow-600">
                {
                  displayedExchanges.filter((e) => e.status === "PENDING")
                    .length
                }
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-2xl font-bold text-blue-600">
                {
                  displayedExchanges.filter((e) => e.status === "ACCEPTED")
                    .length
                }
              </p>
              <p className="text-xs text-gray-600">Negotiating</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-2xl font-bold text-green-600">
                {
                  displayedExchanges.filter((e) => e.status === "CONFIRMED")
                    .length
                }
              </p>
              <p className="text-xs text-gray-600">Confirmed</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <p className="text-2xl font-bold text-red-600">
                {
                  displayedExchanges.filter((e) => e.status === "REFUSED")
                    .length
                }
              </p>
              <p className="text-xs text-gray-600">Refused</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeList;
