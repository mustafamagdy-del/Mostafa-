
import React from 'react';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface NotificationDropdownProps {
  notifications: Notification[];
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ notifications }) => {
  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-10">
      <div className="p-4 font-bold border-b">الإشعارات</div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 p-4">لا توجد إشعارات جديدة</p>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className={`p-4 border-b hover:bg-gray-50 ${notification.isRead ? 'opacity-60' : ''}`}>
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ar })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
