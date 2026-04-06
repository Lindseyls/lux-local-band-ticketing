# LUX — Local User Experience

A full stack ticketing platform built for local venues and independent artists who want a transparent, fee-free alternative to large ticketing platforms.

## The Problem

Large ticketing platforms charge excessive fees and take significant cuts from small artists and local venues who don't have the leverage to negotiate. LUX gives local businesses a simple, direct way to sell tickets to their fans.

## Live Demo

[View the live app here](your_vercel_url_here)

## Tech Stack

- **Frontend:** React
- **Backend/API:** Supabase (auto-generated RESTful API)
- **Database:** PostgreSQL (hosted on Supabase)
- **Styling:** CSS
- **Deployment:** Vercel

## Features

- Browse local bands and view event details
- Select ticket types and quantities with live total calculation
- Enter customer and payment information
- Submit orders persisted to a real PostgreSQL database
- Customer deduplication by email — returning customers reuse their existing record rather than creating duplicates
- Responsive component-based React architecture

## File Structure

```
src/
├── components/
│   ├── specs/
│   │   ├── App.test.js          # Tests for App component — loading, success, empty, error states
│   │   └── TotalAmount.test.js  # Tests for TotalAmount — pricing calculation logic
│   ├── BandInfo.js              # Band image and description (left column)
│   ├── BandTicketForm.js        # Top level layout — header and two columns
│   ├── PaymentForm.js           # Customer info and payment input
│   ├── TicketForm.js            # Ticket selection and order submission
│   ├── TicketType.js            # Individual ticket option with quantity selector
│   └── TotalAmount.js           # Live running total calculation
├── App.js                       # Entry point — fetches bands from Supabase
├── index.css                    # Global styles
└── supabaseClient.js            # Supabase client initialization
```

## How to Run Locally

> **Note:** This app requires a Supabase project with the database schema set up to run locally. The live version can be viewed at the link above or via the walkthrough video.

1. Clone the repository

```
git clone [your repo url]
```

2. Install dependencies

```
npm install
```

3. Create a `.env` file in the root directory

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```

Note: Copy .env.example to .env and fill in your Supabase credentials

4. Start the app

```
npm start
```

## Database Schema

Five tables with a relational structure:

| Table        | Description                                                                       |
| ------------ | --------------------------------------------------------------------------------- |
| bands        | Event info including name, description, image, date, and location                 |
| ticket_types | Ticket options per band with pricing — linked to bands via foreign key            |
| customers    | Customer info with email as unique identifier                                     |
| orders       | Links customers to band purchases with payment status                             |
| order_items  | Line items per order storing ticket type, quantity, and price at time of purchase |

## Key Technical Decisions

- **Prices stored in dollars not cents** — no payment processor integration yet so dollar amounts keep the data readable
- **snake_case to camelCase transformation** — Supabase returns snake_case which is transformed to camelCase in App.js to follow React conventions
- **Array approach for customer lookup** — avoids special Supabase error codes by using array response and checking the first element
- **Cascade deletes on foreign keys** — deleting a band automatically cleans up its ticket types and related orders
- **zip_code stored as text** — prevents leading zeros from being silently dropped by integer types
- **customers table not users** — deliberately named customers since this MVP has no authentication. Users implies login and account management which is a future feature
- **price_at_purchase on order_items** — stores the ticket price at time of purchase so order history is always accurate even if prices change later

## Future Improvements

- Stripe integration for real payment processing
- User authentication so customers can log in and view order history
- Email confirmation on order completion
- Admin dashboard for venues to manage events and view sales
- Row Level Security enabled in Supabase for production
- Seat selection and capacity limits per ticket type
- Pagination for venues with large band catalogs
- Component level CSS modules instead of a single index.css
