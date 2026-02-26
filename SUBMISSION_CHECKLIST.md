# Bitespeed Backend Task - Submission Checklist

## ✅ All Requirements Met

### 1. Code Repository
- [x] Published to GitHub: https://github.com/yash1262/bitespeed-identity-reconciliation
- [x] Repository is public
- [x] Small commits with insightful messages

### 2. Technical Requirements
- [x] Node.js with TypeScript
- [x] SQL Database (PostgreSQL)
- [x] `/identify` endpoint implemented
- [x] Accepts JSON body (not form-data)
- [x] Returns HTTP 200 with correct response format

### 3. Functionality
- [x] Creates primary contact for new customers
- [x] Creates secondary contacts when new info is provided
- [x] Links contacts with common email or phone
- [x] Primary contacts can turn into secondary
- [x] Oldest contact remains primary
- [x] Returns consolidated contact information

### 4. Deployment
- [x] Hosted online: https://bitespeed-identity-service-dxom.onrender.com
- [x] Endpoint URL in README
- [x] Service is live and accessible

### 5. Testing
All test scenarios from requirements document pass:
- [x] New customer creation
- [x] Secondary contact creation
- [x] Query with just email
- [x] Query with just phone
- [x] Linking two primary contacts

## Submission

Submit the task here: https://forms.gle/hsQBJQ8tzbsp53D77

### Information to Provide:
1. **GitHub Repository URL**: https://github.com/yash1262/bitespeed-identity-reconciliation
2. **Live Endpoint URL**: https://bitespeed-identity-service-dxom.onrender.com/identify
3. **Your Name**: [Your Name]
4. **Your Email**: [Your Email]

## Quick Test Command

```bash
curl -X POST https://bitespeed-identity-service-dxom.onrender.com/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"123456"}'
```

Expected Response:
```json
{
  "contact": {
    "primaryContatctId": <number>,
    "emails": ["test@example.com"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```
