# Monitoring and Logging Guide

## Overview

This document describes the monitoring and logging setup for the Snowball Fund Analysis Report System.

## Frontend Monitoring

### Performance Monitoring

We use Core Web Vitals to track frontend performance:

```typescript
// lib/monitoring/web-vitals.ts
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    timestamp: Date.now(),
  });

  // Use sendBeacon for reliability
  navigator.sendBeacon('/api/analytics/vitals', body);
}

export function initWebVitals() {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

### Key Metrics to Monitor

| Metric | Target | Description |
|--------|--------|-------------|
| LCP | < 2.5s | Largest Contentful Paint |
| FID | < 100ms | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| TTFB | < 600ms | Time to First Byte |
| FCP | < 1.8s | First Contentful Paint |

### Error Tracking

```typescript
// lib/monitoring/error-tracking.ts
export function initErrorTracking() {
  window.onerror = (message, source, lineno, colno, error) => {
    reportError({
      type: 'global',
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
    });
  };

  window.onunhandledrejection = (event) => {
    reportError({
      type: 'unhandledrejection',
      message: event.reason?.message,
      stack: event.reason?.stack,
    });
  };
}

async function reportError(error) {
  await fetch('/api/analytics/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    }),
  });
}
```

## Backend Monitoring

### Health Check Endpoint

```python
# FastAPI health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "checks": {
            "database": await check_database(),
            "redis": await check_redis(),
        }
    }
```

### Prometheus Metrics

```python
# Metrics to expose
from prometheus_client import Counter, Histogram

REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

PDF_EXPORT_DURATION = Histogram(
    'pdf_export_duration_seconds',
    'PDF export processing time',
    ['pages']
)
```

## Logging Configuration

### Log Levels

| Level | Usage |
|-------|-------|
| DEBUG | Detailed debugging information |
| INFO | General operational messages |
| WARNING | Unexpected but handled events |
| ERROR | Error events requiring attention |
| CRITICAL | Critical failures |

### Log Format

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "INFO",
  "service": "frontend",
  "message": "User logged in",
  "context": {
    "userId": "123",
    "ip": "192.168.1.1"
  },
  "trace_id": "abc123"
}
```

### Frontend Logging

```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;

  private log(entry: LogEntry) {
    const payload = {
      timestamp: new Date().toISOString(),
      ...entry,
      url: window.location.href,
    };

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      navigator.sendBeacon('/api/logs', JSON.stringify(payload));
    } else {
      console[entry.level](payload);
    }
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'info', message, context });
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log({ level: 'error', message, context });
  }

  // ... other methods
}

export const logger = Logger.getInstance();
```

## Alerting Rules

### Critical Alerts

```yaml
# Prometheus alerting rules
groups:
  - name: critical
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"

      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
```

### Notification Channels

- **Slack**: Real-time alerts
- **Email**: Daily summaries, critical alerts
- **PagerDuty**: On-call escalation

## Dashboard Recommendations

### Overview Dashboard

- Request rate
- Error rate
- P95/P99 latency
- Active users
- Database connections

### Business Dashboard

- Reports created per day
- PDF exports per day
- Active users per day
- Popular modules

### Infrastructure Dashboard

- CPU/Memory usage
- Disk I/O
- Network traffic
- Container health

## Log Retention

| Environment | Retention |
|-------------|-----------|
| Development | 7 days |
| Staging | 30 days |
| Production | 90 days |

## Security Logging

Events that must be logged:
- Login attempts (success/failure)
- Password changes
- Permission changes
- Data exports
- Admin actions

```python
# Security event logging
async def log_security_event(
    event_type: str,
    user_id: str,
    details: dict,
    request: Request
):
    await security_logger.info({
        "event_type": event_type,
        "user_id": user_id,
        "ip_address": request.client.host,
        "user_agent": request.headers.get("user-agent"),
        "details": details,
    })
```

## Tools and Services

### Recommended Stack

| Purpose | Tool |
|---------|------|
| APM | Datadog / New Relic |
| Logging | ELK Stack / Loki |
| Metrics | Prometheus + Grafana |
| Error Tracking | Sentry |
| Uptime | Pingdom / UptimeRobot |

### Integration Example

```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter sensitive data
    return event;
  },
});
```
