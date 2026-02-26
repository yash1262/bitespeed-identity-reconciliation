#!/bin/bash

echo "Testing API - Creating contacts with email only"
echo "=============================================="
echo ""

echo "Test 1: Create contact with email"
curl -s -X POST "https://bitespeed-identity-service-dxom.onrender.com/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"doc@hillvalley.edu"}' | python3 -m json.tool

echo ""
echo ""
echo "Test 2: Add another email to same person"
curl -s -X POST "https://bitespeed-identity-service-dxom.onrender.com/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"brown@hillvalley.edu"}' | python3 -m json.tool

echo ""
echo ""
echo "Test 3: Query first email - should show both"
curl -s -X POST "https://bitespeed-identity-service-dxom.onrender.com/identify" \
  -H "Content-Type: application/json" \
  -d '{"email":"doc@hillvalley.edu"}' | python3 -m json.tool
