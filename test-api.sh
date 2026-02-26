#!/bin/bash

# Test script for the /identify endpoint
# Usage: ./test-api.sh <your-service-url>

if [ -z "$1" ]; then
  echo "Usage: ./test-api.sh <service-url>"
  echo "Example: ./test-api.sh https://bitespeed-identity-service.onrender.com"
  exit 1
fi

SERVICE_URL=$1

echo "Testing /identify endpoint at $SERVICE_URL"
echo ""

echo "Test 1: Create new primary contact"
curl -X POST "$SERVICE_URL/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}' \
  | json_pp
echo ""
echo ""

echo "Test 2: Add secondary contact with new email"
curl -X POST "$SERVICE_URL/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}' \
  | json_pp
echo ""
echo ""

echo "Test 3: Query existing contact"
curl -X POST "$SERVICE_URL/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}' \
  | json_pp
echo ""
