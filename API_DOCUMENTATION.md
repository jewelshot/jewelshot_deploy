# 📚 JEWELSHOT API DOCUMENTATION

Complete developer guide for the Jewelshot AI API.

---

## 🚀 Quick Start

### 1. Get Your API Token

```bash
# Sign up at https://www.jewelshot.ai
# Your JWT token is available in your account settings
```

### 2. Make Your First Request

```bash
curl -X POST https://www.jewelshot.ai/api/ai/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operationType": "generate",
    "data": {
      "prompt": "luxury diamond ring on marble surface"
    }
  }'
```

### 3. Check Job Status

```bash
curl https://www.jewelshot.ai/api/ai/status/JOB_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔐 Authentication

All API requests require authentication via **Supabase JWT tokens**.

### Getting Your Token

**Client-Side (Browser):**
```javascript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;
```

**Server-Side (Node.js):**
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

const token = data.session.access_token;
```

### Using Your Token

Include the token in the `Authorization` header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 API Endpoints

### Base URL

```
Production: https://www.jewelshot.ai/api
Development: http://localhost:3000/api
```

---

## 🎨 AI Operations

### 1. Submit AI Job

**Endpoint:** `POST /api/ai/submit`

**Request:**
```json
{
  "operationType": "generate",
  "data": {
    "prompt": "luxury jewelry on marble surface with dramatic lighting",
    "image_size": "landscape_16_9"
  },
  "priority": "normal"
}
```

**Response:**
```json
{
  "jobId": "job-abc123xyz",
  "transactionId": "tx-789def",
  "status": "queued",
  "estimatedWait": 30
}
```

**Operation Types:**

| Operation | Description | Cost (Credits) |
|-----------|-------------|----------------|
| `generate` | Generate new image from prompt | 10 |
| `edit` | Edit existing image | 15 |
| `upscale` | Upscale image resolution | 5 |
| `remove-background` | Remove image background | 8 |
| `relight` | Change lighting | 12 |
| `expand` | Expand image boundaries | 10 |
| `magic-prompt` | Enhance prompt | 3 |
| `magic-edit` | AI-guided editing | 15 |
| `flux-lora` | Custom model generation | 20 |
| `camera-control` | Camera angle control | 12 |
| `video-replicate` | Generate video | 25 |

---

### 2. Check Job Status

**Endpoint:** `GET /api/ai/status/{jobId}`

**Statuses:**

**Queued:**
```json
{
  "status": "queued",
  "position": 3,
  "estimatedWait": 45
}
```

**Processing:**
```json
{
  "status": "processing",
  "progress": 65
}
```

**Completed:**
```json
{
  "status": "completed",
  "result": {
    "imageUrl": "https://storage.example.com/result.jpg",
    "width": 1920,
    "height": 1080
  }
}
```

**Failed:**
```json
{
  "status": "failed",
  "error": "AI processing failed",
  "refunded": 10
}
```

---

### 3. Cancel Job

**Endpoint:** `POST /api/ai/cancel/{jobId}`

**Response:**
```json
{
  "success": true,
  "message": "Job cancelled successfully",
  "refunded": 10
}
```

---

## 💳 Credits Management

### Get Credit Balance

**Endpoint:** `GET /api/credits/balance`

**Response:**
```json
{
  "balance": 100,
  "reserved": 10,
  "available": 90
}
```

**Fields:**
- `balance`: Total credits owned
- `reserved`: Credits reserved for ongoing operations
- `available`: Credits available for new operations

---

## 📦 Batch Processing

### 1. Create Batch Project

**Endpoint:** `POST /api/batch/create`

**Request:**
```json
{
  "name": "Product Photoshoot",
  "prompt": "luxury jewelry on marble surface",
  "aspect_ratio": "1:1",
  "total_images": 10
}
```

**Response:**
```json
{
  "batchId": "batch-xyz123",
  "uploadUrl": "https://storage.example.com/upload/batch-xyz123"
}
```

### 2. Upload Images

**Endpoint:** `POST /api/batch/{batchId}/upload-images`

**Request:** Multipart form data with images

### 3. Start Processing

Processing starts automatically after upload.

### 4. Check Batch Status

**Endpoint:** `GET /api/batch/{batchId}`

**Response:**
```json
{
  "id": "batch-xyz123",
  "name": "Product Photoshoot",
  "status": "processing",
  "total_images": 10,
  "completed_count": 7,
  "failed_count": 1,
  "created_at": "2025-01-28T00:00:00Z"
}
```

---

## ⚡ Rate Limits

### Global Limits

| Type | Limit | Window |
|------|-------|--------|
| Global (per IP) | 30 requests | 1 minute |
| AI Operations (per user) | 10 requests | 1 minute |
| Admin (with admin key) | 60 requests | 1 minute |

### Rate Limit Headers

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1643723400
```

### Rate Limit Exceeded (429)

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 45
}
```

**Handling:**
```javascript
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
  // Retry request
}
```

---

## ❌ Error Handling

### Error Format

All errors follow this structure:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Invalid input data |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

### Error Examples

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

**402 Insufficient Credits:**
```json
{
  "error": "Insufficient credits",
  "code": "INSUFFICIENT_CREDITS",
  "details": {
    "required": 10,
    "available": 5
  }
}
```

**422 Validation Error:**
```json
{
  "error": "Invalid input",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "prompt",
    "message": "Prompt is required"
  }
}
```

---

## 📝 Code Examples

### JavaScript/TypeScript

```typescript
// Submit AI job
async function generateImage(prompt: string) {
  const response = await fetch('/api/ai/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      operationType: 'generate',
      data: { prompt },
    }),
  });

  const { jobId } = await response.json();
  return jobId;
}

// Poll for results
async function waitForResult(jobId: string) {
  while (true) {
    const response = await fetch(`/api/ai/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const status = await response.json();

    if (status.status === 'completed') {
      return status.result;
    }

    if (status.status === 'failed') {
      throw new Error(status.error);
    }

    // Wait 2 seconds before next check
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Usage
const jobId = await generateImage('luxury diamond ring');
const result = await waitForResult(jobId);
console.log('Image URL:', result.imageUrl);
```

### Python

```python
import requests
import time

class JewelshotClient:
    def __init__(self, token):
        self.base_url = 'https://www.jewelshot.ai/api'
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def submit_job(self, operation_type, data):
        """Submit AI processing job"""
        response = requests.post(
            f'{self.base_url}/ai/submit',
            headers=self.headers,
            json={
                'operationType': operation_type,
                'data': data
            }
        )
        response.raise_for_status()
        return response.json()['jobId']
    
    def get_status(self, job_id):
        """Get job status"""
        response = requests.get(
            f'{self.base_url}/ai/status/{job_id}',
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def wait_for_result(self, job_id, poll_interval=2):
        """Poll for job completion"""
        while True:
            status = self.get_status(job_id)
            
            if status['status'] == 'completed':
                return status['result']
            
            if status['status'] == 'failed':
                raise Exception(status['error'])
            
            time.sleep(poll_interval)
    
    def generate_image(self, prompt):
        """Generate image from prompt"""
        job_id = self.submit_job('generate', {'prompt': prompt})
        return self.wait_for_result(job_id)

# Usage
client = JewelshotClient('YOUR_JWT_TOKEN')
result = client.generate_image('luxury diamond ring on marble')
print(f"Image URL: {result['imageUrl']}")
```

### cURL

```bash
#!/bin/bash

TOKEN="YOUR_JWT_TOKEN"
BASE_URL="https://www.jewelshot.ai/api"

# Submit job
JOB_RESPONSE=$(curl -s -X POST "$BASE_URL/ai/submit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "operationType": "generate",
    "data": {
      "prompt": "luxury diamond ring on marble"
    }
  }')

JOB_ID=$(echo $JOB_RESPONSE | jq -r '.jobId')
echo "Job ID: $JOB_ID"

# Poll for result
while true; do
  STATUS_RESPONSE=$(curl -s "$BASE_URL/ai/status/$JOB_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  STATUS=$(echo $STATUS_RESPONSE | jq -r '.status')
  
  if [ "$STATUS" = "completed" ]; then
    IMAGE_URL=$(echo $STATUS_RESPONSE | jq -r '.result.imageUrl')
    echo "Image URL: $IMAGE_URL"
    break
  elif [ "$STATUS" = "failed" ]; then
    ERROR=$(echo $STATUS_RESPONSE | jq -r '.error')
    echo "Error: $ERROR"
    exit 1
  fi
  
  echo "Status: $STATUS"
  sleep 2
done
```

---

## 🔧 Admin API (Admin Key Required)

### Get All Users

**Endpoint:** `GET /api/admin/users`

**Headers:**
```
x-admin-key: YOUR_ADMIN_KEY
```

**Query Parameters:**
- `search`: Search by email
- `status`: Filter by status (all, active, banned)
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

**Response:**
```json
{
  "users": [...],
  "total": 1523,
  "stats": {
    "active": 1450,
    "banned": 73
  }
}
```

### Manage User

**Endpoint:** `PATCH /api/admin/users/{userId}`

**Add Credits:**
```json
{
  "action": "add_credits",
  "amount": 100,
  "reason": "Promotion bonus"
}
```

**Ban User:**
```json
{
  "action": "ban",
  "reason": "Terms violation"
}
```

---

## 📊 Webhooks (Coming Soon)

Get notified when jobs complete:

```json
{
  "event": "job.completed",
  "jobId": "job-abc123",
  "userId": "user-xyz789",
  "result": {
    "imageUrl": "https://..."
  }
}
```

---

## 🛡️ Security Best Practices

1. **Never expose your JWT token** - Keep it server-side
2. **Use HTTPS only** - Never call API over HTTP
3. **Rotate tokens regularly** - Implement token refresh
4. **Validate all inputs** - Don't trust client data
5. **Handle errors gracefully** - Don't expose internal errors
6. **Rate limit your own apps** - Prevent abuse
7. **Monitor usage** - Track API calls and costs

---

## 🌐 SDKs

### Official SDKs

- **JavaScript/TypeScript:** Built-in React hooks
- **Python:** Coming soon
- **PHP:** Coming soon
- **Ruby:** Coming soon

### Community SDKs

Want to contribute? [Submit a PR](https://github.com/jewelshot)

---

## 📞 Support

- **Email:** support@jewelshot.ai
- **Discord:** [Join our community](https://discord.gg/jewelshot)
- **Status:** [status.jewelshot.ai](https://status.jewelshot.ai)
- **GitHub:** [github.com/jewelshot](https://github.com/jewelshot)

---

## 📄 Changelog

### v0.1.0 (Current)
- Initial API release
- AI operations (11 types)
- Batch processing
- Credit system
- Admin panel

---

**Last Updated:** November 27, 2025  
**API Version:** 0.1.0  
**OpenAPI Spec:** [openapi.yaml](/openapi.yaml)

