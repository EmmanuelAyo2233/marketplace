# TradeHub — Frontend

React + TailwindCSS frontend for the TradeHub marketplace platform.

## Quick Start

```bash
npm install
cp .env.example .env        # set VITE_API_URL to your backend
npm run dev                 # starts on http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview
```

## Folder Structure

```
src/
├── components/
│   ├── common/        # Spinner, Modal, EmptyState, Pagination, etc.
│   ├── product/       # ProductCard, ProductFilter, ProductCompare
│   ├── order/         # OrderCard, OrderTimeline, DeliveryConfirmBtn
│   ├── wallet/        # WalletCard, TransactionRow
│   └── forms/         # LoginForm, RegisterForm, ProductForm
├── pages/
│   ├── public/        # Landing, ProductListing, ProductDetail, VendorStore, Cart, Checkout
│   ├── auth/          # Login, Register
│   ├── buyer/         # BuyerDashboard, MyOrders, OrderDetail
│   ├── vendor/        # VendorDashboard, MyProducts, AddProduct, EditProduct, VendorOrders, VendorWallet
│   └── admin/         # AdminDashboard, DisputeList, DisputeDetail
├── store/             # Redux — authSlice, cartSlice (persisted)
├── services/          # Axios instance + all API endpoint functions
├── routes/            # AppRouter with protected + role-guarded routes
└── utils/             # formatCurrency, formatDate, ORDER_STATUS_CONFIG, etc.
```

## Key Features

- JWT auth with auto-refresh token queue
- Role-based routing (buyer / vendor / admin)
- Cart with Redux Persist (survives page refresh)
- Escrow-aware order flow with delivery confirmation
- Product comparison (up to 3 products)
- Full vendor dashboard with wallet, orders, product management
- Admin dispute management panel
- Paystack checkout redirect integration
- Responsive — mobile + desktop

## Route Map

| Route | Page | Access |
|---|---|---|
| `/` | Landing | Public |
| `/products` | Product listing | Public |
| `/products/:id` | Product detail | Public |
| `/store/:slug` | Vendor store | Public |
| `/cart` | Cart | Public |
| `/checkout` | Checkout | Buyer |
| `/buyer` | Buyer dashboard | Buyer |
| `/buyer/orders` | My orders | Buyer |
| `/buyer/orders/:id` | Order detail | Buyer |
| `/vendor` | Vendor dashboard | Vendor |
| `/vendor/products` | My products | Vendor |
| `/vendor/products/new` | Add product | Vendor |
| `/vendor/products/:id/edit` | Edit product | Vendor |
| `/vendor/orders` | Vendor orders | Vendor |
| `/vendor/wallet` | Wallet | Vendor |
| `/admin` | Admin dashboard | Admin |
| `/admin/disputes` | Disputes list | Admin |
| `/admin/disputes/:id` | Dispute detail | Admin |
| `/login` | Login | Public |
| `/register` | Register | Public |

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```
