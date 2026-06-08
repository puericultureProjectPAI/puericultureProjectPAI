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

## File Structure (current)

```
troc/
├── components/
│   ├── TrocBackHeader.jsx       # Back header used on detail pages
│   └── TrocOfferSection.jsx     # CTA section to propose an exchange
├── hooks/
│   └── useTroc.js               # Hook to publish a TROC announcement
├── utils/
│   └── exchangeApi.jsx          # API service layer for exchanges
├── views/
│   ├── ProductTrocDetailView.jsx
│   └── MyProductsSelectionView.jsx
├── api.js                       # small aggregation of exported api helpers
├── index.jsx                    # Module exports
└── README.md                    # This file
```

## Component Documentation

### Product Detail & Selection Views

The module now focuses on the product detail flow required by the Figma spec:

- `ProductTrocDetailView.jsx`: product detail (images, description, CTA to propose exchange)
- `MyProductsSelectionView.jsx`: lets the connected user choose one of their products to offer in exchange

Use the detail route to inspect the seeded product (see below): `/troc/products/100000`

Note: the previous management UI (list, cards, proposal form) was removed to keep the codebase focused on the detail + selection flows required by the current design.

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

See `utils/exchangeApi.jsx` for exchange API helpers.

## Styling

The module uses Tailwind CSS for styling. Key classes used:

- Grid layouts for responsive design
- Flexbox for component arrangement
- Color-coded status badges
- Hover effects for interactivity
- Disabled states for loading

## Notes for Integration

1. **Authentication**: The module expects authentication via context from `common/security/AuthContext.jsx`

2. **Seeding for UI testing**: A seeded product is added via migration `20260608_seed_troc_product.sql` with product id `100000`. Use `/troc/products/100000` to view it after applying migrations / seeding.

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
