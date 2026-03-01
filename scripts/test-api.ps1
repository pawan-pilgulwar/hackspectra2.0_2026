# HackSpectra API Test Script (PowerShell)
# Run this after setting up the backend to verify everything works

$BaseUrl = "http://localhost:3000"
$AdminSecret = "your_admin_secret_here"

Write-Host "🚀 Testing HackSpectra Backend API" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Seed Problems
Write-Host "📝 Test 1: Seeding problem statements..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/seed-problems" `
    -Method Post `
    -Headers @{"x-admin-secret"=$AdminSecret; "Content-Type"="application/json"}
$response | ConvertTo-Json
Write-Host ""

# Test 2: Seed Teams
Write-Host "👥 Test 2: Seeding sample teams..." -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$BaseUrl/api/admin/seed-teams" `
    -Method Post `
    -Headers @{"x-admin-secret"=$AdminSecret; "Content-Type"="application/json"}
$response | ConvertTo-Json
Write-Host ""

# Test 3: List Problems
Write-Host "📋 Test 3: Fetching problem list..." -ForegroundColor Yellow
$problems = Invoke-RestMethod -Uri "$BaseUrl/api/problems/list" -Method Get
$problems.problems[0..1] | ConvertTo-Json
Write-Host ""

# Test 4: Authenticate Team
Write-Host "🔐 Test 4: Authenticating team..." -ForegroundColor Yellow
$authBody = @{
    teamId = "TEAM001"
    leaderEmail = "leader1@example.com"
} | ConvertTo-Json

$authResponse = Invoke-RestMethod -Uri "$BaseUrl/api/auth/verify" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $authBody
$authResponse | ConvertTo-Json
Write-Host ""

# Get first problem ID
$problemId = $problems.problems[0]._id

# Test 5: Select Problem
Write-Host "✅ Test 5: Selecting a problem..." -ForegroundColor Yellow
$selectBody = @{
    teamId = "TEAM002"
    problemId = $problemId
} | ConvertTo-Json

$selectResponse = Invoke-RestMethod -Uri "$BaseUrl/api/problems/select" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $selectBody
$selectResponse | ConvertTo-Json
Write-Host ""

# Test 6: Submit Custom Problem
Write-Host "💡 Test 6: Submitting custom problem (Student Innovation)..." -ForegroundColor Yellow
$customBody = @{
    teamId = "TEAM003"
    title = "AI-Powered Study Assistant"
    description = "An intelligent tutoring system that adapts to individual student learning patterns and provides personalized recommendations."
} | ConvertTo-Json

$customResponse = Invoke-RestMethod -Uri "$BaseUrl/api/problems/submit-custom" `
    -Method Post `
    -Headers @{"Content-Type"="application/json"} `
    -Body $customBody
$customResponse | ConvertTo-Json
Write-Host ""

# Test 7: Try duplicate selection (should fail)
Write-Host "❌ Test 7: Attempting duplicate selection (should fail)..." -ForegroundColor Yellow
try {
    $dupResponse = Invoke-RestMethod -Uri "$BaseUrl/api/problems/select" `
        -Method Post `
        -Headers @{"Content-Type"="application/json"} `
        -Body $selectBody
    $dupResponse | ConvertTo-Json
} catch {
    Write-Host "Expected error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✨ API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Check MongoDB to verify data was saved"
Write-Host "2. Integrate with frontend"
Write-Host "3. Import real Unstop team data"
