"use client"

import { useState, useEffect } from "react"
import { IconLoader2, IconCheck, IconX } from "@tabler/icons-react"
import CitationList from "./CitationList"

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  citations?: any[];
  error?: string;
  onComplete?: () => void;
}

export default function StreamingMessage({ 
  content, 
  isStreaming, 
  citations = [], 
  error,
  onComplete 
}: StreamingMessageProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isStreaming && content) {
      setIsTyping(true);
      
      // Simulate typing effect for better UX
      let index = 0;
      const timer = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          onComplete?.();
        }
      }, 20); // Adjust speed as needed

      return () => clearInterval(timer);
    } else if (!isStreaming) {
      setDisplayedContent(content);
      setIsTyping(false);
    }
  }, [content, isStreaming, onComplete]);

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-400">
          <IconX className="w-4 h-4" />
          <span className="font-medium">Error</span>
        </div>
        <p className="text-red-300 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isStreaming ? (
            <IconLoader2 className="w-5 h-5 text-blue-400 animate-spin" />
          ) : (
            <IconCheck className="w-5 h-5 text-green-400" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-white">
              {displayedContent}
              {isTyping && (
                <span className="inline-block w-2 h-5 bg-blue-400 ml-1 animate-pulse" />
              )}
            </div>
          </div>
          
          {citations && citations.length > 0 && !isStreaming && (
            <CitationList items={citations} />
          )}
          
          {isStreaming && (
            <div className="mt-3 text-sm text-gray-400 flex items-center space-x-2">
              <IconLoader2 className="w-3 h-3 animate-spin" />
              <span>Researching and synthesizing information...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
