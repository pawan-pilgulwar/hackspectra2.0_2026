#!/bin/bash

# HackSpectra API Test Script
# Run this after setting up the backend to verify everything works

BASE_URL="http://localhost:3000"
ADMIN_SECRET="your_admin_secret_here"

echo "🚀 Testing HackSpectra Backend API"
echo "=================================="
echo ""

# Test 1: Seed Problems
echo "📝 Test 1: Seeding problem statements..."
curl -X POST "$BASE_URL/api/admin/seed-problems" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -s | jq '.'
echo ""

# Test 2: Seed Teams
echo "👥 Test 2: Seeding sample teams..."
curl -X POST "$BASE_URL/api/admin/seed-teams" \
  -H "x-admin-secret: $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -s | jq '.'
echo ""

# Test 3: List Problems
echo "📋 Test 3: Fetching problem list..."
curl -X GET "$BASE_URL/api/problems/list" \
  -H "Content-Type: application/json" \
  -s | jq '.problems[0:2]'
echo ""

# Test 4: Authenticate Team
echo "🔐 Test 4: Authenticating team..."
AUTH_RESPONSE=$(curl -X POST "$BASE_URL/api/auth/verify" \
  -H "Content-Type: application/json" \
  -d '{"teamId":"TEAM001","leaderEmail":"leader1@example.com"}' \
  -s)
echo "$AUTH_RESPONSE" | jq '.'
echo ""

# Extract first problem ID for selection test
PROBLEM_ID=$(curl -X GET "$BASE_URL/api/problems/list" -s | jq -r '.problems[0]._id')

# Test 5: Select Problem
echo "✅ Test 5: Selecting a problem..."
curl -X POST "$BASE_URL/api/problems/select" \
  -H "Content-Type: application/json" \
  -d "{\"teamId\":\"TEAM002\",\"problemId\":\"$PROBLEM_ID\"}" \
  -s | jq '.'
echo ""

# Test 6: Submit Custom Problem
echo "💡 Test 6: Submitting custom problem (Student Innovation)..."
curl -X POST "$BASE_URL/api/problems/submit-custom" \
  -H "Content-Type: application/json" \
  -d '{
    "teamId":"TEAM003",
    "title":"AI-Powered Study Assistant",
    "description":"An intelligent tutoring system that adapts to individual student learning patterns and provides personalized recommendations."
  }' \
  -s | jq '.'
echo ""

# Test 7: Try duplicate selection (should fail)
echo "❌ Test 7: Attempting duplicate selection (should fail)..."
curl -X POST "$BASE_URL/api/problems/select" \
  -H "Content-Type: application/json" \
  -d "{\"teamId\":\"TEAM002\",\"problemId\":\"$PROBLEM_ID\"}" \
  -s | jq '.'
echo ""

echo "=================================="
echo "✨ API Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Check MongoDB to verify data was saved"
echo "2. Integrate with frontend"
echo "3. Import real Unstop team data"
