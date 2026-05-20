# TROC Module - Product Exchange System

## Overview

The TROC (Trade & Exchange) module provides a complete frontend implementation for a product exchange system where users can trade items within a community.

## Features

### User Journey

**As a Proposer:**

1. Browse available products from other users
2. Propose an exchange with one of your products
3. Proposal enters PENDING state
4. Wait for the other user's response
5. Delete proposal if needed (while still PENDING)

**As a Receiver:**

1. Receive exchange proposals for your products
2. Accept proposal → Exchange enters ACCEPTED state (negotiation phase)
3. Negotiate via chat (external integration)
4. Confirm exchange → Exchange enters CONFIRMED state (both products closed)
5. Or refuse proposal → Exchange enters REFUSED state (products available again)

### Exchange Status Flow

```
PENDING → (Accept) → ACCEPTED → (Confirm) → CONFIRMED
        → (Refuse) → REFUSED

PENDING → (Delete by proposer) → Cancelled
```

## File Structure

```
troc/
├── components/
│   ├── ExchangeCard.jsx         # Single exchange card with actions
│   ├── ExchangeList.jsx         # List view with filtering and tabs
│   └── ExchangeProposalForm.jsx # Form to create new proposals
├── hooks/
│   └── useExchangeManager.jsx   # Custom hook for exchange operations
├── utils/
│   └── exchangeApi.jsx          # API service layer
├── views/
│   └── TrocView.jsx             # Main view/page component
├── index.jsx                    # Module exports
└── README.md                    # This file
```

## Component Documentation

### TrocView

Main page component that orchestrates the entire TROC experience.

**Features:**

- Dashboard with statistics (pending, incoming, active, completed exchanges)
- Tab-based navigation (Overview, Propose Exchange, Manage Exchanges)
- User journey visualization
- Quick action buttons

**Usage:**

```jsx
import { TrocView } from "./troc";

function App() {
  return <TrocView />;
}
```

### ExchangeProposalForm

Form component for proposing new exchanges.

**Props:**

- `availableProducts`: Array of products the current user can offer
- `otherUserProducts`: Array of products from other users
- `onSubmit`: Callback function when form is submitted
- `loading`: Boolean indicating loading state
- `error`: Error message to display
- `success`: Success message to display
- `onClearMessages`: Callback to clear messages

**Features:**

- Product selection dropdowns
- Exchange preview
- Form validation
- Step-by-step instructions

### ExchangeList

Tabbed list component for viewing exchanges.

**Props:**

- `myExchanges`: User's proposed exchanges
- `proposedToMeExchanges`: Exchanges proposed to user
- `currentUserId`: ID of current user
- `onAccept`: Handler for accepting exchanges
- `onConfirm`: Handler for confirming exchanges
- `onRefuse`: Handler for refusing exchanges
- `onDelete`: Handler for deleting exchanges
- `loading`: Boolean indicating loading state

**Features:**

- Tab switching between "My Exchanges" and "Proposed to Me"
- Status filtering (All, Active, Pending)
- Exchange statistics summary
- Responsive grid layout

### ExchangeCard

Individual exchange display component.

**Props:**

- `exchange`: Exchange object
- `isProposer`: Boolean indicating if user is proposer
- `isReceiver`: Boolean indicating if user is receiver
- `onAccept`: Accept handler
- `onConfirm`: Confirm handler
- `onRefuse`: Refuse handler
- `onDelete`: Delete handler
- `loading`: Boolean indicating loading state

**Features:**

- Status-based color coding
- Product information display
- Context-aware action buttons
- Status description help text

### useExchangeManager

Custom React hook for managing exchange operations.

**Returns Object:**

```javascript
{
  // State
  myExchanges: [],
  proposedToMeExchanges: [],
  exchangesForProduct: [],
  loading: false,
  error: null,
  successMessage: null,

  // Methods
  fetchMyExchanges: async () => {},
  fetchExchangesProposedToMe: async () => {},
  fetchExchangesForProduct: async (productId) => {},
  createNewExchange: async (proposerProduct, receiverProduct) => {},
  acceptExchangeProposal: async (exchangeId) => {},
  confirmExchangeProposal: async (exchangeId) => {},
  refuseExchangeProposal: async (exchangeId) => {},
  deleteExchangeProposal: async (exchangeId) => {},
  clearSuccessMessage: () => {},
  clearError: () => {},
}
```

**Usage:**

```jsx
import { useExchangeManager } from './troc';

function MyComponent() {
  const exchangeManager = useExchangeManager();

  useEffect(() => {
    exchangeManager.fetchMyExchanges();
    exchangeManager.fetchExchangesProposedToMe();
  }, []);

  return (
    // Use exchangeManager state and methods
  );
}
```

## API Integration

The module integrates with backend API endpoints:

- `GET /troc/exchanges/my-exchanges` - Get user's proposals
- `GET /troc/exchanges/proposed-to-me` - Get incoming proposals
- `POST /troc/exchanges` - Create new exchange
- `POST /troc/exchanges/{id}/accepted` - Accept proposal
- `POST /troc/exchanges/{id}/confirm` - Confirm exchange
- `POST /troc/exchanges/{id}/refused` - Refuse proposal
- `DELETE /troc/exchanges/{id}` - Delete proposal
- `GET /troc/exchanges/product/{id}/status` - Check product exchange status

See `utils/exchangeApi.jsx` for implementation details.

## Styling

The module uses Tailwind CSS for styling. Key classes used:

- Grid layouts for responsive design
- Flexbox for component arrangement
- Color-coded status badges
- Hover effects for interactivity
- Disabled states for loading

## Notes for Integration

1. **Authentication**: The module expects authentication via context from `common/security/AuthContext.jsx`

2. **Mock Data**: `TrocView.jsx` uses mock products for demonstration. Replace with real API calls:

   ```jsx
   // Fetch from backend instead of mock data
   const { data: availableProducts } = await apiClient.get(
     "/products/my-available",
   );
   const { data: otherProducts } = await apiClient.get(
     "/products/available-from-others",
   );
   ```

3. **Chat Integration**: Exchange negotiation references chat but is not implemented. Connect with chat module after accepting exchanges.

4. **User Context**: Currently uses mock user ID. Replace with actual user from authentication context:

   ```jsx
   const { user } = useAuthContext();
   const CURRENT_USER_ID = user?.id;
   ```

5. **Error Handling**: All components display errors. Ensure API responses follow error format:
   ```json
   {
     "error": "Error message"
   }
   ```

## Future Enhancements

- [ ] Real-time notifications for proposal updates
- [ ] Chat integration for negotiation phase
- [ ] Search and filter products by category
- [ ] User ratings and reviews
- [ ] Exchange history and analytics
- [ ] Undo/revision functionality for exchanges
- [ ] Automated reminder emails
- [ ] Mobile app version

## Development Notes

- All components are commented in English as per team standards
- Code follows React hooks patterns
- No external component libraries (only Tailwind CSS)
- Separation of concerns: API logic, business logic (hooks), and presentation (components)
- Error handling at each layer
