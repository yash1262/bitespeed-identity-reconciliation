# Bitespeed Identity Reconciliation Service

A backend service that identifies and tracks customer identity across multiple purchases by linking contact information.

## Features

- Links contacts based on shared email or phone number
- Maintains primary and secondary contact relationships
- Automatically converts primary contacts to secondary when links are discovered
- RESTful API with JSON request/response

## Tech Stack

- Node.js with TypeScript
- Express.js
- PostgreSQL
- pg (node-postgres)

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd bitespeed-identity-reconciliation
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your database connection:
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/bitespeed
```

4. Build the project
```bash
npm run build
```

5. Start the server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoint

### POST /identify

Identifies and consolidates contact information.

**Request Body:**
```json
{
  "email": "string (optional)",
  "phoneNumber": "string (optional)"
}
```

**Response:**
```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [23]
  }
}
```

## Database Schema

```sql
CREATE TABLE Contact (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(255),
  email VARCHAR(255),
  linkedId INTEGER REFERENCES Contact(id),
  linkPrecedence VARCHAR(20) NOT NULL CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  deletedAt TIMESTAMP
);
```

## Deployment

The service is deployed at: [Your deployment URL here]

## Example Usage

```bash
curl -X POST https://your-deployment-url.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}'
```

## How It Works

1. When a new request comes in, the service searches for existing contacts with matching email or phone number
2. If no contacts exist, a new primary contact is created
3. If contacts exist but new information is provided, a secondary contact is created
4. If multiple primary contacts are found (linking two separate identities), the older one remains primary and the newer one becomes secondary
5. All linked contacts are returned with the primary contact's information first

## License

ISC
