"use client"

import React from 'react';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function SettingSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const menuItems = [
    { id: 'account-info', label: 'Account Info' },
    { id: 'change-email', label: 'Change Email' },
    { id: 'password', label: 'Password' },
  ];

  return (
    <nav className="py-4">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left px-6 py-3 transition-colors ${
                activeTab === item.id
                  ? 'bg-[#0A1628] text-white font-medium'
                  : 'text-gray-300 hover:bg-[#192b45] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}