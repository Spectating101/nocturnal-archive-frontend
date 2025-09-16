"use client"

import { IconX, IconKeyboard } from "@tabler/icons-react"

interface ShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl', 'K'], description: 'Focus search input' },
    { keys: ['Ctrl', '/'], description: 'Show this help' },
    { keys: ['Ctrl', 'H'], description: 'Toggle research history' },
    { keys: ['Ctrl', 'S'], description: 'Save current session' },
    { keys: ['Escape'], description: 'Close modals/panels' },
    { keys: ['Enter'], description: 'Send message' },
    { keys: ['Shift', 'Enter'], description: 'New line in input' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <IconKeyboard className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-gray-300">{shortcut.description}</span>
              <div className="flex items-center space-x-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <div key={keyIndex} className="flex items-center">
                    <kbd className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-gray-500 mx-1">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-800 text-gray-300 text-xs rounded border border-gray-600">/</kbd> to toggle this help
          </p>
        </div>
      </div>
    </div>
  );
}
