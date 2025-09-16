import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      (event.target as HTMLElement)?.contentEditable === 'true'
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    const modifiers = {
      ctrl: event.ctrlKey || event.metaKey,
      shift: event.shiftKey,
      alt: event.altKey,
    };

    // Build shortcut key
    let shortcutKey = '';
    if (modifiers.ctrl) shortcutKey += 'ctrl+';
    if (modifiers.shift) shortcutKey += 'shift+';
    if (modifiers.alt) shortcutKey += 'alt+';
    shortcutKey += key;

    const handler = shortcuts[shortcutKey];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Common shortcuts for research interface
export const RESEARCH_SHORTCUTS = {
  'ctrl+k': () => {
    // Focus search input
    const searchInput = document.querySelector('textarea[placeholder*="research"]') as HTMLTextAreaElement;
    searchInput?.focus();
  },
  'ctrl+/': () => {
    // Show shortcuts help
    const helpModal = document.getElementById('shortcuts-help');
    if (helpModal) {
      helpModal.style.display = 'block';
    }
  },
  'ctrl+h': () => {
    // Toggle history
    const historyButton = document.querySelector('[title="Research History"]') as HTMLButtonElement;
    historyButton?.click();
  },
  'ctrl+s': () => {
    // Save current session
    const saveButton = document.querySelector('[title="Save Session"]') as HTMLButtonElement;
    saveButton?.click();
  },
  'escape': () => {
    // Close modals/panels
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      (modal as HTMLElement).style.display = 'none';
    });
  },
};
