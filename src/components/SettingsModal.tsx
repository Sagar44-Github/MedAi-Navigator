"use client";

import { useState } from "react";
import { X, Settings, Bell, Lock, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState("medium");
  const [language, setLanguage] = useState("english");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="glassmorphism-enhanced w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close settings"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Settings className="mr-2" /> Settings
        </h2>

        <div className="space-y-6">
          {/* Theme Toggle */}
          <div>
            <h3 className="text-lg font-medium mb-3">Theme</h3>
            <div className="flex items-center justify-between glassmorphism-dark p-3">
              <div className="flex items-center">
                {theme === "dark" ? (
                  <Moon className="h-5 w-5 mr-2 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 mr-2 text-primary" />
                )}
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle theme mode"
              >
                Toggle
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-medium mb-3">Notifications</h3>
            <div className="flex items-center justify-between glassmorphism-dark p-3">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-primary" />
                <span>Push Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  className="sr-only peer"
                  aria-label="Enable notifications"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h3 className="text-lg font-medium mb-3">Privacy</h3>
            <div className="glassmorphism-dark p-3">
              <div className="flex items-center mb-2">
                <Lock className="h-5 w-5 mr-2 text-primary" />
                <span>Privacy Level</span>
              </div>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Select privacy level"
              >
                <option value="low">Low - Share data for better results</option>
                <option value="medium">
                  Medium - Balance privacy and features
                </option>
                <option value="high">High - Maximize privacy</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-lg font-medium mb-3">Language</h3>
            <div className="glassmorphism-dark p-3">
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <span>Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Select language"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>
          </div>

          <div className="pt-4">
            <button
              className="glassmorphism-enhanced glassmorphism-hover w-full py-2 transition duration-300 ease-in-out hover:scale-105"
              aria-label="Save settings"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
