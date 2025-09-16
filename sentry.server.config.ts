import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Capture unhandled promise rejections
  captureUnhandledRejections: true,
  
  // Set release version for better error tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  
  // Set environment
  environment: process.env.NODE_ENV || 'development',
  
  // Add custom context
  beforeSend(event) {
    event.tags = {
      ...event.tags,
      component: 'server',
      platform: 'nextjs'
    };
    
    return event;
  }
});
