#!/bin/bash

API_URL="https://bitespeed-identity-service-dxom.onrender.com/identify"

echo "=== Test 1: New customer (no existing contact) ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}' | jq .

echo -e "\n=== Test 2: Same phone, new email (should create secondary) ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}' | jq .

echo -e "\n=== Test 3: Query with just phone ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"phoneNumber":"123456"}' | jq .

echo -e "\n=== Test 4: Query with just email ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu"}' | jq .

echo -e "\n=== Test 5: New customer (different contact) ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"george@hillvalley.edu","phoneNumber":"919191"}' | jq .

echo -e "\n=== Test 6: Another new customer ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"biffsucks@hillvalley.edu","phoneNumber":"717171"}' | jq .

echo -e "\n=== Test 7: Link two primary contacts (primary should turn secondary) ==="
curl -s -X POST $API_URL -H "Content-Type: application/json" \
  -d '{"email":"george@hillvalley.edu","phoneNumber":"717171"}' | jq .
