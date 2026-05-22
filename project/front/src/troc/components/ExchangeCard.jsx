/**
 * ExchangeCard Component
 * Displays a single exchange proposal with action buttons based on exchange status
 * User journey step: viewing and managing exchange proposals
 */

const ExchangeCard = ({
  exchange,
  isProposer = false,
  isReceiver = false,
  onAccept,
  onConfirm,
  onRefuse,
  onDelete,
  loading = false,
}) => {
  /**
   * Get status color based on exchange status
   * PENDING: yellow/orange (awaiting response)
   * ACCEPTED: blue (negotiation phase)
   * CONFIRMED: green (completed)
   * REFUSED: red (declined)
   */
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ACCEPTED: "bg-blue-100 text-blue-800 border-blue-300",
      CONFIRMED: "bg-green-100 text-green-800 border-green-300",
      REFUSED: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  /**
   * Get product status color
   */
  const getProductStatusColor = (status) => {
    const colors = {
      AVAILABLE: "text-green-600",
      PENDING: "text-orange-600",
      CLOSED: "text-red-600",
    };
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white hover:shadow-lg transition-shadow">
      {/* Exchange Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <div
          className={`px-3 py-1 rounded-full border text-sm font-semibold ${getStatusColor(
            exchange.status,
          )}`}
        >
          {exchange.status}
        </div>
        <span className="text-gray-500 text-sm">
          {/* Exchange ID for reference */}
          Exchange #{exchange.id}
        </span>
      </div>

      {/* Products Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Proposer Product (what's being offered) */}
        <div className="border-l-4 border-blue-500 pl-3">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Offered Product
          </p>
          <p className="font-semibold text-lg">
            {exchange.proposerProduct?.postTitle || "Product"}
          </p>
          <p className="text-sm text-gray-600">
            Category: {exchange.proposerProduct?.category || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">
            By: {exchange.proposerProduct?.author?.firstName}{" "}
            {exchange.proposerProduct?.author?.lastName}
          </p>
          <p
            className={`text-xs mt-1 ${getProductStatusColor(
              exchange.proposerProduct?.status,
            )}`}
          >
            Status: {exchange.proposerProduct?.status}
          </p>
        </div>

        {/* Receiver Product (what's being requested) */}
        <div className="border-l-4 border-purple-500 pl-3">
          <p className="text-xs font-semibold text-gray-600 uppercase">
            Requested Product
          </p>
          <p className="font-semibold text-lg">
            {exchange.receiverProduct?.postTitle || "Product"}
          </p>
          <p className="text-sm text-gray-600">
            Category: {exchange.receiverProduct?.category || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">
            By: {exchange.receiverProduct?.author?.firstName}{" "}
            {exchange.receiverProduct?.author?.lastName}
          </p>
          <p
            className={`text-xs mt-1 ${getProductStatusColor(
              exchange.receiverProduct?.status,
            )}`}
          >
            Status: {exchange.receiverProduct?.status}
          </p>
        </div>
      </div>

      {/* Action Buttons - varies by user role and exchange status */}
      <div className="flex flex-wrap gap-2">
        {/* Receiver actions: Accept, Confirm, Refuse (only if this exchange is proposed to this user) */}
        {isReceiver && exchange.status === "PENDING" && (
          <>
            <button
              onClick={() => onAccept(exchange.id)}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors text-sm"
            >
              {loading ? "Processing..." : "Accept"}
            </button>
            <button
              onClick={() => onRefuse(exchange.id)}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm"
            >
              {loading ? "Processing..." : "Refuse"}
            </button>
          </>
        )}

        {/* Receiver can confirm after acceptance (negotiation phase complete) */}
        {isReceiver && exchange.status === "ACCEPTED" && (
          <>
            <button
              onClick={() => onConfirm(exchange.id)}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 transition-colors text-sm"
            >
              {loading ? "Processing..." : "Confirm Exchange"}
            </button>
            <button
              onClick={() => onRefuse(exchange.id)}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm"
            >
              {loading ? "Processing..." : "Refuse"}
            </button>
          </>
        )}

        {/* Proposer can delete (only if still pending) */}
        {isProposer && exchange.status === "PENDING" && (
          <button
            onClick={() => onDelete(exchange.id)}
            disabled={loading}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 transition-colors text-sm"
          >
            {loading ? "Processing..." : "Delete Proposal"}
          </button>
        )}

        {/* View only for completed or refused exchanges */}
        {(exchange.status === "CONFIRMED" || exchange.status === "REFUSED") && (
          <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded text-sm">
            {exchange.status === "CONFIRMED"
              ? "Exchange Completed"
              : "Exchange Refused"}
          </span>
        )}
      </div>

      {/* Help text for current status */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          {exchange.status === "PENDING" &&
            "Awaiting response from the product owner..."}
          {exchange.status === "ACCEPTED" &&
            "Exchange accepted! Start negotiating via chat before confirming."}
          {exchange.status === "CONFIRMED" &&
            "This exchange is complete and both products are now closed."}
          {exchange.status === "REFUSED" &&
            "This exchange was refused. The products are now available again."}
        </p>
      </div>
    </div>
  );
};

export default ExchangeCard;
