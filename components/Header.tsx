
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { BellIcon, LogoutIcon } from './icons/Icons';
import NotificationDropdown from './NotificationDropdown';
import { ROLES_AR } from '../constants';

const Header: React.FC = () => {
  const { currentUser, logout, getNotificationsForUser } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = currentUser ? getNotificationsForUser(currentUser.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">مرحباً, {currentUser.name}</h2>
        <p className="text-sm text-gray-500">{ROLES_AR[currentUser.role]}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {isDropdownOpen && <NotificationDropdown notifications={notifications} />}
        </div>
        <button onClick={logout} className="flex items-center text-gray-600 hover:text-indigo-600 p-2 rounded-md hover:bg-gray-100 transition-colors">
          <LogoutIcon />
          <span className="mr-2 text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
