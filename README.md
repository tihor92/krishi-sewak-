# Krishi Sewak Backend

REST API (Node.js, Express, MongoDB) for the Krishi Sewak MSP-protected crop marketplace.

## Setup

```bash
npm install
cp .env.example .env     # then edit MONGO_URI, JWT_SECRET, CLIENT_ORIGINS
npm run seed             # creates the admin user and sample MSP rates
npm run dev              # http://localhost:5000
```

Deploy on Render, Railway or any Node host with a MongoDB Atlas database. Set the same variables from `.env.example` there. Add your frontend URL to `CLIENT_ORIGINS` so CORS allows it.

**Important:** the MSP values in `src/utils/seed.js` are sample numbers. Replace them with the official MSP for the current marketing year, or update them as admin via `PUT /api/msp`.

## Roles and flow

- **farmer**: registers (status `pending`), an admin verifies them, then they can list crops. Listing price must be at or above the MSP for that crop.
- **buyer**: browses certified crops, uses the cart, places orders.
- **admin**: verifies farmers, certifies crop quality (grade A/B/C), manages MSP rates, sees stats.

A crop appears in the public marketplace only when it is `active`, `certified` and has stock.

## Endpoints

All protected routes need the header `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Sign up as `farmer` or `buyer` |
| POST | /api/auth/login | public | Login, returns token |
| GET / PATCH | /api/auth/me | user | Get or update profile |
| POST | /api/auth/change-password | user | Change password |
| GET | /api/msp | public | List MSP rates |
| GET | /api/msp/check?crop=Wheat&price=2500 | public | Check a price against MSP |
| PUT | /api/msp | admin | Create or update an MSP rate |
| DELETE | /api/msp/:id | admin | Remove an MSP rate |
| GET | /api/crops | public | Browse (search, category, state, district, minPrice, maxPrice, sort, page, limit) |
| GET | /api/crops/:id | public* | Crop detail (*uncertified: owner or admin only) |
| GET | /api/crops/mine | farmer | Own listings |
| POST | /api/crops | verified farmer | Create listing (MSP enforced) |
| PATCH / DELETE | /api/crops/:id | farmer (owner) | Update or remove listing |
| GET / DELETE | /api/cart | buyer | View or clear cart |
| POST | /api/cart/items | buyer | `{ cropId, quantityQuintals }` add or set quantity |
| DELETE | /api/cart/items/:cropId | buyer | Remove an item |
| POST | /api/orders | buyer | Checkout (one order per farmer) |
| GET | /api/orders, /api/orders/:id | user | Own orders (admin sees all) |
| PATCH | /api/orders/:id/status | farmer, buyer, admin | Move order forward or cancel |
| GET | /api/admin/stats | admin | Dashboard numbers |
| GET | /api/admin/users | admin | List users (`?role=`, `?verificationStatus=`) |
| PATCH | /api/admin/farmers/:id/verify | admin | `{ status: "verified" \| "rejected", note }` |
| PATCH | /api/admin/users/:id/active | admin | Enable or disable account |
| GET | /api/admin/crops | admin | Review listings (`?qualityStatus=pending`) |
| PATCH | /api/admin/crops/:id/quality | admin | Certify or reject, with grade |

Quantities are in quintals (100 kg) and prices in INR per quintal.

## Example

```bash
curl -X POST localhost:5000/api/auth/register -H 'Content-Type: application/json' \
  -d '{"name":"Ramesh","email":"ramesh@example.com","password":"Passw0rd!","role":"farmer","phone":"9876543210"}'
```

## Notes

- Payments are not integrated. `paymentMethod` is `cod` or `online` as a field only; add Razorpay or similar in `src/routes/orders.js`.
- Images are stored as URLs. Upload to S3 or Cloudinary from the frontend and send the URL.
- Only the last 4 digits of Aadhaar are accepted. Do not store full ID numbers.
