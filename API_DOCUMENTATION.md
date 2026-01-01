# ZeroSampah API Documentation

## Overview
This document describes all available API endpoints for the ZeroSampah platform.

Base URL: `http://localhost:3000/api` (development) or your deployed URL

## Authentication
Most endpoints require authentication via Clerk. The authentication token should be included in the request headers automatically by the Clerk client SDK.

---

## Reports API

### GET `/api/reports`
Fetch recent waste reports

**Query Parameters:**
- `limit` (optional): Number of reports to return (default: 10)

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user_xxx",
    "location": "Jakarta Selatan",
    "wasteType": "Plastic",
    "amount": "5kg",
    "imageUrl": "https://...",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/reports`
Create a new waste report

**Request Body:**
```json
{
  "userId": "user_xxx",
  "location": "Jakarta Selatan",
  "wasteType": "Plastic",
  "amount": "5kg",
  "imageUrl": "https://...",
  "verificationResult": {
    "wasteType": "Plastic",
    "confidence": 0.95
  }
}
```

**Response:**
```json
{
  "id": 1,
  "userId": "user_xxx",
  "location": "Jakarta Selatan",
  "wasteType": "Plastic",
  "amount": "5kg",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET `/api/reports/[id]`
Get a specific report by ID

**Response:**
```json
{
  "id": 1,
  "userId": "user_xxx",
  "location": "Jakarta Selatan",
  "wasteType": "Plastic",
  "amount": "5kg",
  "imageUrl": "https://...",
  "verificationResult": "...",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## Rewards API

### GET `/api/rewards`
Get all available rewards in the catalog

**Response:**
```json
[
  {
    "id": 1,
    "name": "Voucher Makanan Rp 25.000",
    "description": "Voucher makan di restoran partner",
    "pointsRequired": 100,
    "imageUrl": null,
    "stock": 50,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/rewards`
Create a new reward (admin only)

**Request Body:**
```json
{
  "name": "Voucher Makanan Rp 25.000",
  "description": "Voucher makan di restoran partner",
  "pointsRequired": 100,
  "imageUrl": "https://...",
  "stock": 50
}
```

### POST `/api/rewards/redeem`
Redeem a reward using user points

**Request Body:**
```json
{
  "rewardId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reward redeemed successfully",
  "user": {
    "clerkId": "user_xxx",
    "points": 50,
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `400`: Insufficient points or reward out of stock
- `404`: User or reward not found
- `401`: Unauthorized

### POST `/api/rewards/points`
Update user reward points (internal use)

**Request Body:**
```json
{
  "userId": "user_xxx",
  "pointsToAdd": 10
}
```

---

## Users API

### GET `/api/users/stats`
Get current user's statistics

**Response:**
```json
{
  "user": {
    "clerkId": "user_xxx",
    "email": "user@example.com",
    "fullName": "John Doe",
    "profileImage": "https://...",
    "points": 150
  },
  "stats": {
    "reportsSubmitted": 10,
    "wastesCollected": 5,
    "pointsEarned": 200,
    "pointsRedeemed": 50,
    "currentPoints": 150,
    "eventsOrganized": 2,
    "eventsJoined": 3
  }
}
```

### GET `/api/users/[userId]/stats`
Get specific user's statistics

**Response:** Same as above

---

## Events API

### GET `/api/events`
Get published events or user's events

**Query Parameters:**
- `type` (optional): Filter events
  - `registered`: User's registered events
  - `organized`: User's organized events
  - (none): All published events

**Response:**
```json
[
  {
    "event": {
      "id": 1,
      "organizerId": "user_xxx",
      "title": "Bersih-Bersih Pantai",
      "description": "Mari bersama membersihkan pantai",
      "location": "Pantai Ancol",
      "latitude": "-6.123",
      "longitude": "106.456",
      "eventDate": "2024-02-01T00:00:00Z",
      "eventTime": "08:00",
      "wasteCategories": ["Plastic", "Glass"],
      "status": "published",
      "maxParticipants": 50,
      "rewardInfo": "Makan siang gratis",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "organizer": {
      "clerkId": "user_xxx",
      "fullName": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://..."
    }
  }
]
```

### POST `/api/events`
Create a new event or register for an event

**Create Event Request:**
```json
{
  "title": "Bersih-Bersih Pantai",
  "description": "Mari bersama membersihkan pantai",
  "location": "Pantai Ancol",
  "latitude": "-6.123",
  "longitude": "106.456",
  "eventDate": "2024-02-01",
  "eventTime": "08:00",
  "wasteCategories": ["Plastic", "Glass"],
  "maxParticipants": 50,
  "rewardInfo": "Makan siang gratis",
  "images": [],
  "videos": []
}
```

**Register for Event Request:**
```json
{
  "action": "register",
  "eventId": 1
}
```

**Registration Response:**
```json
{
  "success": true,
  "registration": {
    "id": 1,
    "eventId": 1,
    "userId": "user_xxx",
    "qrCode": "EVENT:1:user_xxx:1234567890",
    "registeredAt": "2024-01-01T00:00:00Z",
    "status": "registered"
  }
}
```

### GET `/api/events/[id]`
Get event details

**Response:**
```json
{
  "event": {
    "id": 1,
    "organizerId": "user_xxx",
    "title": "Bersih-Bersih Pantai",
    "description": "Mari bersama membersihkan pantai",
    "location": "Pantai Ancol",
    "eventDate": "2024-02-01T00:00:00Z",
    "eventTime": "08:00",
    "status": "published"
  },
  "organizer": {
    "clerkId": "user_xxx",
    "fullName": "John Doe"
  },
  "registration": {
    "qrCode": "EVENT:1:user_xxx:1234567890",
    "status": "registered"
  }
}
```

### POST `/api/events/[id]/verify`
Verify attendance with QR code (organizer only)

**Request Body:**
```json
{
  "userId": "user_yyy",
  "qrCodeScanned": "EVENT:1:user_yyy:1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "attendance": {
    "id": 1,
    "eventId": 1,
    "userId": "user_yyy",
    "verifiedAt": "2024-02-01T08:30:00Z"
  },
  "userName": "Jane Doe"
}
```

### GET `/api/events/[id]/verify`
Get verified attendees list

**Response:**
```json
[
  {
    "attendance": {
      "id": 1,
      "eventId": 1,
      "userId": "user_yyy",
      "verifiedAt": "2024-02-01T08:30:00Z"
    },
    "user": {
      "clerkId": "user_yyy",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "profileImage": "https://..."
    }
  }
]
```

---

## Leaderboard API

### GET `/api/leaderboard`
Get user leaderboard

**Response:**
```json
[
  {
    "clerkId": "user_xxx",
    "fullName": "John Doe",
    "email": "john@example.com",
    "points": 500,
    "profileImage": "https://..."
  }
]
```

---

## Notifications API

### GET `/api/notifications`
Get user's unread notifications

**Response:**
```json
[
  {
    "id": 1,
    "userId": "user_xxx",
    "message": "Your report has been verified",
    "type": "success",
    "isRead": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## Tasks API

### GET `/api/tasks`
Get available waste collection tasks

**Response:**
```json
[
  {
    "id": 1,
    "location": "Jakarta Selatan",
    "wasteType": "Plastic",
    "amount": "5kg",
    "status": "pending",
    "date": "2024-01-01T00:00:00Z",
    "userId": "user_xxx",
    "imageUrl": "https://..."
  }
]
```

---

## Collections API

### GET `/api/collections`
Get user's waste collections

**Query Parameters:**
- `userId`: User ID to get collections for

**Response:**
```json
[
  {
    "id": 1,
    "reportId": 1,
    "collectorId": "user_xxx",
    "collectionDate": "2024-01-01T00:00:00Z",
    "status": "collected",
    "comment": "Collected successfully"
  }
]
```

---

## Chat API

### POST `/api/chat`
Chat with AI assistant about waste management

**Request Body:**
```json
{
  "message": "What types of plastic can be recycled?",
  "context": []
}
```

**Response:**
```json
{
  "response": "Most recyclable plastics include...",
  "context": [
    {"role": "user", "content": "What types of plastic can be recycled?"},
    {"role": "assistant", "content": "Most recyclable plastics include..."}
  ]
}
```

---

## Webhooks

### POST `/api/webhooks/user`
Clerk user webhook (handles user.created, user.updated, user.deleted)

**Handled Events:**
- `user.created`: Create new user in database
- `user.updated`: Update user information
- `user.deleted`: Delete user from database

### POST `/api/webhooks/session`
Clerk session webhook

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production:
- User actions: 100 requests per hour
- Anonymous requests: 20 requests per hour
- Admin actions: 1000 requests per hour

---

## Best Practices

1. **Always handle errors**: Check response status codes
2. **Use TypeScript**: All endpoints are type-safe
3. **Validate inputs**: Client-side validation before API calls
4. **Cache responses**: Use appropriate caching strategies
5. **Secure sensitive endpoints**: Always check authentication
6. **Log appropriately**: Monitor API usage and errors

---

## Development Testing

Use the provided test scripts:
- `test-api.js`: Test API endpoints
- `test-connection.js`: Test database connection
- `test-gemini.js`: Test Gemini AI integration

Example usage:
```bash
node test-api.js
```
