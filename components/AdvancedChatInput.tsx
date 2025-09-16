"use client"

import { useState, useRef, useEffect } from "react"
import { IconSend, IconMicrophone, IconPaperclip, IconX, IconLoader2 } from "@tabler/icons-react"

interface AdvancedChatInputProps {
  onSend: (message: string) => void;
  onFileUpload?: (file: File) => void;
  loading?: boolean;
  placeholder?: string;
  suggestions?: string[];
}

export default function AdvancedChatInput({ 
  onSend, 
  onFileUpload, 
  loading = false, 
  placeholder = "Ask a research question...",
  suggestions = []
}: AdvancedChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !loading) {
      onSend(message.trim());
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (onFileUpload) {
      files.forEach(file => onFileUpload(file));
    }
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const startRecording = () => {
    // TODO: Implement voice recording
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="text-sm text-gray-400">Attached files:</div>
          {attachedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <IconPaperclip className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">{file.name}</span>
                <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="text-sm text-gray-400">Suggested queries:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px] max-h-[200px]"
            rows={3}
            disabled={loading}
          />
          
          {/* Input Actions */}
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Attach file"
            >
              <IconPaperclip className="w-4 h-4" />
            </button>
            
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={`p-2 transition-colors ${
                isRecording 
                  ? 'text-red-400 bg-red-400/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Voice input"
            >
              <IconMicrophone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Press Enter to send • Shift+Enter for new line
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !message.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <IconLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconSend className="w-4 h-4" />
            )}
            <span>{loading ? "Researching..." : "Ask"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
