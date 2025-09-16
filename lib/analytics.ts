// Analytics and performance tracking
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' && 
                    typeof window !== 'undefined' && 
                    !window.location.hostname.includes('localhost');
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
    };

    this.events.push(analyticsEvent);

    // Send to analytics service (e.g., PostHog, Mixpanel, etc.)
    this.sendToAnalytics(analyticsEvent);
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // PostHog integration
    if (typeof window !== 'undefined' && (window as any).posthog) {
      (window as any).posthog.capture(event.event, event.properties);
    }

    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, event.properties);
    }

    // Custom analytics endpoint
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch(error => {
        console.warn('Analytics tracking failed:', error);
      });
    }
  }

  // Research-specific events
  trackResearchQuery(query: string, mode: string = 'academic') {
    this.track('research_query', {
      query_length: query.length,
      mode,
      has_attachments: false, // TODO: Track file attachments
    });
  }

  trackResearchResponse(responseTime: number, citations: number, mode: string) {
    this.track('research_response', {
      response_time_ms: responseTime,
      citations_count: citations,
      mode,
    });
  }

  trackCitationExport(format: 'apa' | 'bibtex', citationCount: number) {
    this.track('citation_export', {
      format,
      citation_count: citationCount,
    });
  }

  trackSessionStart() {
    this.track('session_start', {
      timestamp: new Date().toISOString(),
    });
  }

  trackSessionEnd(duration: number, messageCount: number) {
    this.track('session_end', {
      duration_ms: duration,
      message_count: messageCount,
    });
  }

  trackError(error: string, context?: string) {
    this.track('error', {
      error_message: error,
      context,
      url: window.location.href,
    });
  }

  trackPerformance(metric: string, value: number, unit: string = 'ms') {
    this.track('performance', {
      metric,
      value,
      unit,
    });
  }
}

export const analytics = new Analytics();

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string) {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string) {
    const start = this.marks.get(startMark);
    if (start) {
      const duration = performance.now() - start;
      analytics.trackPerformance(name, duration);
      return duration;
    }
    return 0;
  }

  measurePageLoad() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        analytics.trackPerformance('page_load', loadTime);
      });
    }
  }

  measureAPIResponse(endpoint: string, startTime: number) {
    const duration = performance.now() - startTime;
    analytics.trackPerformance(`api_${endpoint}`, duration);
    return duration;
  }
}

export const performanceMonitor = new PerformanceMonitor();
