# HackSpectra Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Code Quality
- ✅ All TypeScript files compile without errors
- ✅ No ESLint warnings or errors
- ✅ All API routes have proper runtime declarations
- ✅ JWT authentication implemented with HTTP-only cookies
- ✅ MongoDB connection caching properly configured

### 2. API Routes Configuration
All API routes have been configured with:
- ✅ `export const dynamic = 'force-dynamic';`
- ✅ `export const runtime = 'nodejs';`

**Routes verified:**
- ✅ `/api/auth/verify` - Authentication endpoint
- ✅ `/api/auth/me` - Get current user
- ✅ `/api/auth/logout` - Logout endpoint
- ✅ `/api/problems/list` - List all problems
- ✅ `/api/problems/select` - Select problem (protected)
- ✅ `/api/problems/submit-custom` - Submit custom problem (protected)
- ✅ `/api/admin/seed-teams` - Seed teams (admin)
- ✅ `/api/admin/seed-problems` - Seed problems (admin)

### 3. Dependencies
- ✅ `jsonwebtoken@9.0.3` - JWT authentication
- ✅ `mongoose@8.23.0` - MongoDB ODM
- ✅ `@types/jsonwebtoken@9.0.10` - TypeScript types
- ✅ All other dependencies installed

---

## 🚀 Vercel Deployment Steps

### Step 1: Environment Variables Setup

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add the following variables for **Production**, **Preview**, and **Development**:

#### Required Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackspectra?retryWrites=true&w=majority
```
- Get from MongoDB Atlas
- Ensure IP whitelist includes `0.0.0.0/0` for Vercel

```env
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
```
- Generate a strong random secret (min 32 characters)
- Use: `openssl rand -base64 32` or online generator
- NEVER use the default from `.env` file

```env
HACKATHON_PHASE=PROBLEM_SELECTION
```
- Options: `REGISTRATION` | `PROBLEM_SELECTION` | `LOCKED`

```env
NEXT_PUBLIC_SELECTION_ENABLED=true
```
- Set to `false` to disable problem selection UI

```env
ADMIN_SECRET=your-admin-secret-for-seed-endpoints
```
- Used for `/api/admin/*` endpoints
- Generate a strong random secret

#### Optional Variables:

```env
UNSTOP_API_KEY=your_unstop_api_key
UNSTOP_API_URL=https://api.unstop.com/v1
```
- Only if integrating with Unstop API

---

### Step 2: MongoDB Atlas Configuration

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Vercel's dynamic IPs

2. **Database User:**
   - Ensure database user has read/write permissions
   - Username and password should match `MONGODB_URI`

3. **Connection String:**
   - Use the connection string format:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hackspectra?retryWrites=true&w=majority
   ```

---

### Step 3: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to Vercel Dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Configure environment variables (from Step 1)
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

### Step 4: Post-Deployment Verification

#### 4.1 Check Build Logs
- Go to Vercel Dashboard → Deployments → Latest Deployment
- Check "Build Logs" for any errors
- Ensure build completes successfully

#### 4.2 Check Function Logs
- Go to "Functions" tab
- Click on any API route
- Check for runtime errors or warnings

#### 4.3 Test Authentication Flow

**Test 1: Seed Data (Admin)**
```bash
# Seed teams
curl -X POST https://your-app.vercel.app/api/admin/seed-teams \
  -H "x-admin-secret: your-admin-secret"

# Seed problems
curl -X POST https://your-app.vercel.app/api/admin/seed-problems \
  -H "x-admin-secret: your-admin-secret"
```

**Test 2: Authentication**
```bash
# Authenticate
curl -X POST https://your-app.vercel.app/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"teamId":"TEAM001","leaderEmail":"leader1@example.com"}' \
  -c cookies.txt

# Expected: 200 OK with Set-Cookie header
```

**Test 3: Get Current User**
```bash
# Get authenticated user
curl https://your-app.vercel.app/api/auth/me \
  -b cookies.txt

# Expected: 200 OK with team data
```

**Test 4: List Problems**
```bash
# List all problems
curl https://your-app.vercel.app/api/problems/list

# Expected: 200 OK with problems array
```

**Test 5: Select Problem**
```bash
# Select a problem (requires authentication)
curl -X POST https://your-app.vercel.app/api/problems/select \
  -H "Content-Type: application/json" \
  -d '{"problemId":"PROBLEM_ID_FROM_LIST"}' \
  -b cookies.txt

# Expected: 200 OK with success message
```

#### 4.4 Test Frontend

1. Visit `https://your-app.vercel.app`
2. Navigate to Authentication page
3. Enter credentials: `TEAM001` / `leader1@example.com`
4. Should redirect to Problems page
5. Verify problem list loads
6. Test problem selection (if not already selected)

---

## 🔍 Troubleshooting

### Issue: 500 Internal Server Error

**Check:**
1. Vercel Function Logs for specific error
2. Environment variables are set correctly
3. MongoDB connection string is valid
4. JWT_SECRET is defined (min 32 characters)

**Common Causes:**
- Missing `runtime = 'nodejs'` declaration
- Missing environment variables
- MongoDB connection issues
- Invalid JWT_SECRET

### Issue: Authentication Cookie Not Set

**Check:**
1. Response headers include `Set-Cookie`
2. Cookie has `HttpOnly; Secure; SameSite=Lax`
3. Domain matches your Vercel domain

**Fix:**
- Ensure `secure: true` in production
- Check browser console for cookie errors

### Issue: MongoDB Connection Timeout

**Check:**
1. MongoDB Atlas Network Access allows `0.0.0.0/0`
2. Connection string is correct
3. Database user has proper permissions

**Fix:**
- Update Network Access in MongoDB Atlas
- Verify connection string format

### Issue: JWT Verification Failed

**Check:**
1. JWT_SECRET matches between token generation and verification
2. Token hasn't expired (7 days default)
3. Cookie is being sent in requests

**Fix:**
- Regenerate JWT_SECRET and redeploy
- Clear browser cookies and re-authenticate

---

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Track API response times
- Monitor error rates

### MongoDB Atlas Monitoring
- Check connection count
- Monitor query performance
- Set up alerts for high load

### Custom Logging
All API routes include server-side logging:
- Database connection status
- JWT generation/verification errors
- Problem selection conflicts
- Authentication failures

Check Vercel Function Logs for these messages.

---

## 🔒 Security Checklist

- ✅ JWT_SECRET is strong and unique (min 32 characters)
- ✅ HTTP-only cookies prevent XSS attacks
- ✅ Secure flag enabled in production (HTTPS only)
- ✅ ADMIN_SECRET protects admin endpoints
- ✅ MongoDB connection uses authentication
- ✅ No sensitive data in client-side code
- ✅ Environment variables not committed to Git
- ✅ CORS properly configured (same-origin)

---

## 📝 Post-Deployment Tasks

1. **Test all user flows:**
   - Authentication
   - Problem selection
   - Custom problem submission
   - Logout

2. **Verify data persistence:**
   - Check MongoDB Atlas for seeded data
   - Verify team selections are saved
   - Test problem slot counting

3. **Performance testing:**
   - Test with multiple concurrent users
   - Verify atomic updates prevent race conditions
   - Check API response times

4. **Update documentation:**
   - Document production URL
   - Update team credentials
   - Share admin endpoints with organizers

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ All API endpoints return 200 OK for valid requests
- ✅ Authentication flow works end-to-end
- ✅ JWT cookies are set and verified correctly
- ✅ Problem selection updates database atomically
- ✅ Frontend displays selected problems correctly
- ✅ No 500 errors in Vercel Function Logs
- ✅ MongoDB connections are stable
- ✅ All TypeScript compiles without errors

---

## 📞 Support

If issues persist after following this checklist:

1. Check Vercel Function Logs for specific errors
2. Review `VERCEL_500_ERROR_FIX.md` for common issues
3. Verify all environment variables are set
4. Test MongoDB connection separately
5. Contact Vercel support if infrastructure issues

---

**Last Updated:** March 1, 2026
**Status:** ✅ Ready for Production Deployment
