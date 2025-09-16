"use client"

import { useState, useEffect } from "react"
import { IconX, IconRefresh, IconAlertCircle } from "@tabler/icons-react"

interface ErrorToastProps {
  error: string;
  traceId?: string;
  onRetry?: () => void;
  onDemoFallback?: () => void;
  onDismiss?: () => void;
}

export default function ErrorToast({ 
  error, 
  traceId, 
  onRetry, 
  onDemoFallback, 
  onDismiss 
}: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 10000); // Auto-dismiss after 10 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-900/90 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <IconAlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-red-100">Research Error</h4>
            <p className="text-sm text-red-200 mt-1">{error}</p>
            {traceId && (
              <p className="text-xs text-red-300 mt-2 font-mono">
                Trace ID: {traceId}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-100 bg-red-800/50 rounded hover:bg-red-800/70 transition-colors"
                >
                  <IconRefresh className="w-3 h-3 mr-1" />
                  Retry
                </button>
              )}
              {onDemoFallback && (
                <button
                  onClick={onDemoFallback}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-100 bg-red-800/50 rounded hover:bg-red-800/70 transition-colors"
                >
                  Use Demo Answer
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
