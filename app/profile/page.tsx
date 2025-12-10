'use client';

import { User, Settings, CreditCard, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  JD
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">John Doe</h2>
                  <p className="text-xs text-gray-500">Free Plan</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'general' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-4 w-4" />
                  General
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'billing' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" defaultValue="John" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" defaultValue="Doe" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input type="email" defaultValue="john.doe@example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Tell us a little about yourself..."></textarea>
                    </div>

                    <div className="flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage your subscription and billing details.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-900">Free Explorer Plan</p>
                      <p className="text-sm text-blue-700">Your plan renews on Nov 1, 2023</p>
                    </div>
                    <Button variant="outline" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50">Upgrade Plan</Button>
                  </div>
                </div>
              )}

              {/* Other tabs placeholders */}
              {(activeTab === 'notifications' || activeTab === 'settings') && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Settings className="h-12 w-12 mb-4 opacity-20" />
                  <p>This section is under construction.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
