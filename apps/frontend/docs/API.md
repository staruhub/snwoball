# Snowball API Documentation

## Overview

This document describes the REST API endpoints used by the Snowball Fund Analysis Report System.

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Staging**: `https://staging-api.snowball.example.com/api/v1`
- **Production**: `https://api.snowball.example.com/api/v1`

## Authentication

All API requests (except login) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Refresh Token

```
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "string"
}
```

---

## Reports API

### List Reports

```
GET /reports
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| limit | integer | Items per page (default: 20) |
| status | string | Filter by status (draft, published, archived) |
| sort | string | Sort field (created_at, updated_at, name) |
| order | string | Sort order (asc, desc) |

**Response:**
```json
{
  "items": [
    {
      "id": "string",
      "name": "string",
      "status": "draft",
      "fund_id": "string",
      "fund_name": "string",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Get Report

```
GET /reports/:id
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "status": "draft",
  "fund_id": "string",
  "global_config": {
    "date_range": {
      "start": "2023-01-01",
      "end": "2024-01-01"
    },
    "benchmark": "000300.SH",
    "frequency": "daily",
    "nav_type": "adjusted"
  },
  "modules": [
    {
      "id": "string",
      "module_type": "nav-trend",
      "order": 0,
      "config": {},
      "locked_params": []
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Create Report

```
POST /reports
```

**Request Body:**
```json
{
  "name": "string",
  "fund_id": "string",
  "template_id": "string" // optional
}
```

### Update Report

```
PUT /reports/:id
```

**Request Body:**
```json
{
  "name": "string",
  "global_config": {},
  "modules": []
}
```

### Delete Report

```
DELETE /reports/:id
```

---

## Templates API

### List Templates

```
GET /templates
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type (system, personal) |
| category | string | Filter by category |

### Get Template

```
GET /templates/:id
```

### Create Template

```
POST /templates
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "weekly",
  "modules": []
}
```

---

## Funds API

### Search Funds

```
GET /funds/search
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (name or code) |
| type | string | Fund type filter |
| limit | integer | Max results (default: 20) |

**Response:**
```json
{
  "items": [
    {
      "id": "000001.OF",
      "name": "华夏成长混合",
      "type": "混合型",
      "manager": "张三"
    }
  ]
}
```

### Get Fund Data

```
GET /funds/:id/data
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| start_date | string | Start date (YYYY-MM-DD) |
| end_date | string | End date (YYYY-MM-DD) |
| fields | string | Comma-separated field list |

---

## Export API

### Export Report to PDF

```
POST /exports/pdf
```

**Request Body:**
```json
{
  "report_id": "string",
  "options": {
    "orientation": "portrait",
    "include_cover": true,
    "include_toc": true,
    "include_page_numbers": true
  }
}
```

**Response:**
```json
{
  "task_id": "string",
  "status": "processing"
}
```

### Get Export Status

```
GET /exports/:task_id/status
```

**Response:**
```json
{
  "task_id": "string",
  "status": "completed",
  "progress": 100,
  "download_url": "https://..."
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "bad_request",
  "message": "Invalid request parameters",
  "details": {}
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API requests are rate limited:
- **Anonymous**: 60 requests/minute
- **Authenticated**: 600 requests/minute

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp
