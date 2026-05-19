/**
 * ExchangeProposalForm Component
 * Allows users to propose an exchange between their product and another user's product
 * User journey step: creating a new exchange proposal
 */

import { useState } from "react";

const ExchangeProposalForm = ({
  availableProducts = [],
  otherUserProducts = [],
  onSubmit,
  loading = false,
  error = null,
  success = null,
  onClearMessages = () => {},
}) => {
  // Form state for selecting products for exchange
  const [proposerProductId, setProposerProductId] = useState("");
  const [receiverProductId, setReceiverProductId] = useState("");
  const [formError, setFormError] = useState(null);

  /**
   * Handle form submission
   * Validates that user selected both products before submitting
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validation: Both products must be selected
    if (!proposerProductId || !receiverProductId) {
      setFormError("Please select both products for the exchange");
      return;
    }

    // Validation: Cannot exchange same product
    if (proposerProductId === receiverProductId) {
      setFormError("You cannot propose an exchange with the same product");
      return;
    }

    try {
      // Find the full product objects
      const proposerProduct = availableProducts.find(
        (p) => p.id === parseInt(proposerProductId),
      );
      const receiverProduct = otherUserProducts.find(
        (p) => p.id === parseInt(receiverProductId),
      );

      if (!proposerProduct || !receiverProduct) {
        setFormError("One or both products could not be found");
        return;
      }

      // Submit exchange proposal
      await onSubmit(proposerProduct, receiverProduct);

      // Reset form on success
      setProposerProductId("");
      setReceiverProductId("");
    } catch (err) {
      setFormError(err.message || "Failed to create exchange proposal");
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-2">Propose an Exchange</h2>
      <p className="text-gray-600 text-sm mb-6">
        Select one of your products and another user's product to propose an
        exchange
      </p>

      {/* Error message display */}
      {(error || formError) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
          <span>{error || formError}</span>
          <button
            onClick={() => {
              setFormError(null);
              onClearMessages();
            }}
            className="text-red-700 hover:text-red-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success message display */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between items-center">
          <span>{success}</span>
          <button
            onClick={onClearMessages}
            className="text-green-700 hover:text-green-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Exchange proposal form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select proposer product (user's product to offer) */}
        <div>
          <label
            htmlFor="proposer-product"
            className="block font-semibold mb-2"
          >
            Your Product (What you offer)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Choose one of your available products
          </p>
          <select
            id="proposer-product"
            value={proposerProductId}
            onChange={(e) => setProposerProductId(e.target.value)}
            disabled={loading || availableProducts.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          >
            <option value="">
              {availableProducts.length === 0
                ? "No available products"
                : "Select your product..."}
            </option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title} - {product.status}
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select receiver product (other user's product to request) */}
        <div>
          <label
            htmlFor="receiver-product"
            className="block font-semibold mb-2"
          >
            Requested Product (What you want)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Choose another user's product you're interested in
          </p>
          <select
            id="receiver-product"
            value={receiverProductId}
            onChange={(e) => setReceiverProductId(e.target.value)}
            disabled={loading || otherUserProducts.length === 0}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100"
          >
            <option value="">
              {otherUserProducts.length === 0
                ? "No products available"
                : "Select product to request..."}
            </option>
            {otherUserProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title} - By {product.author?.firstName}{" "}
                {product.author?.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange preview (shows what will happen) */}
        {proposerProductId && receiverProductId && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold mb-2">Exchange Preview:</p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-gray-600">You offer:</p>
                <p className="font-semibold">
                  {
                    availableProducts.find(
                      (p) => p.id === parseInt(proposerProductId),
                    )?.title
                  }
                </p>
              </div>
              <div className="text-2xl text-gray-400">↔</div>
              <div className="flex-1 text-right">
                <p className="text-xs text-gray-600">You receive:</p>
                <p className="font-semibold">
                  {
                    otherUserProducts.find(
                      (p) => p.id === parseInt(receiverProductId),
                    )?.title
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info box: what happens after submission */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            📋 What happens next:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1. Your proposal is sent to the product owner</li>
            <li>2. They can accept (start negotiating) or refuse</li>
            <li>
              3. If accepted, you negotiate via chat before confirming the
              exchange
            </li>
            <li>4. Once confirmed, both products are permanently closed</li>
          </ul>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={
            loading ||
            !proposerProductId ||
            !receiverProductId ||
            availableProducts.length === 0 ||
            otherUserProducts.length === 0
          }
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Creating Exchange..." : "Propose Exchange"}
        </button>
      </form>
    </div>
  );
};

export default ExchangeProposalForm;
