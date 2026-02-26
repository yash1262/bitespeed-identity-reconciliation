#!/bin/bash

API_URL="https://bitespeed-identity-service-dxom.onrender.com/identify"

echo "=========================================="
echo "Testing Bitespeed Identity Reconciliation"
echo "=========================================="
echo ""

echo "Test 1: Create first contact"
echo "Request: {\"email\":\"lorraine@hillvalley.edu\",\"phoneNumber\":\"123456\"}"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu","phoneNumber":"123456"}' | python3 -m json.tool
echo ""
echo ""

echo "Test 2: Add secondary contact with new email"
echo "Request: {\"email\":\"mcfly@hillvalley.edu\",\"phoneNumber\":\"123456\"}"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"mcfly@hillvalley.edu","phoneNumber":"123456"}' | python3 -m json.tool
echo ""
echo ""

echo "Test 3: Query with existing email"
echo "Request: {\"email\":\"lorraine@hillvalley.edu\"}"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"lorraine@hillvalley.edu"}' | python3 -m json.tool
echo ""
echo ""

echo "Test 4: Create another primary contact"
echo "Request: {\"email\":\"george@hillvalley.edu\",\"phoneNumber\":\"919191\"}"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"george@hillvalley.edu","phoneNumber":"919191"}' | python3 -m json.tool
echo ""
echo ""

echo "Test 5: Link two primary contacts"
echo "Request: {\"email\":\"george@hillvalley.edu\",\"phoneNumber\":\"123456\"}"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"george@hillvalley.edu","phoneNumber":"123456"}' | python3 -m json.tool
echo ""
