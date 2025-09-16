"use client"

import { useState, useEffect } from "react"
import { IconX, IconSettings, IconPalette, IconBell, IconShield, IconDatabase } from "@tabler/icons-react"

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    streaming: true,
    citations: 'apa',
    language: 'en',
    fontSize: 'medium',
    compactMode: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('research-settings');
      if (savedSettings) {
        try {
          setSettings({ ...settings, ...JSON.parse(savedSettings) });
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      }
    }
  }, [isOpen]);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('research-settings', JSON.stringify(newSettings));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-gray-700 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <IconSettings className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Appearance */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <IconPalette className="w-4 h-4 text-blue-400" />
              <h3 className="text-md font-medium text-white">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Theme</label>
                  <p className="text-sm text-gray-500">Choose your preferred theme</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Font Size</label>
                  <p className="text-sm text-gray-500">Adjust text size for better readability</p>
                </div>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Compact Mode</label>
                  <p className="text-sm text-gray-500">Reduce spacing for more content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => updateSetting('compactMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Research Settings */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <IconDatabase className="w-4 h-4 text-green-400" />
              <h3 className="text-md font-medium text-white">Research</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Streaming Responses</label>
                  <p className="text-sm text-gray-500">Show responses as they're generated</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.streaming}
                    onChange={(e) => updateSetting('streaming', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Citation Format</label>
                  <p className="text-sm text-gray-500">Default format for exported citations</p>
                </div>
                <select
                  value={settings.citations}
                  onChange={(e) => updateSetting('citations', e.target.value)}
                  className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                >
                  <option value="apa">APA</option>
                  <option value="bibtex">BibTeX</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Auto-save Sessions</label>
                  <p className="text-sm text-gray-500">Automatically save research sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <IconBell className="w-4 h-4 text-yellow-400" />
              <h3 className="text-md font-medium text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-gray-300">Enable Notifications</label>
                  <p className="text-sm text-gray-500">Show notifications for research updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <IconShield className="w-4 h-4 text-purple-400" />
              <h3 className="text-md font-medium text-white">Privacy</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Data Usage</h4>
                <p className="text-sm text-gray-400 mb-3">
                  Your research queries are processed to provide better results. 
                  We don't store personal information or share your data with third parties.
                </p>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Learn more about our privacy policy
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
