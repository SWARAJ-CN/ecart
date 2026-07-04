import React, { useState } from 'react';
import { X, User, UserPlus, UserCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const NotificationsSidebar = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/profile/${notification.user.id}`);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 transition-colors"
            >
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="border-b border-slate-200 px-6 py-3 flex gap-2">
              <button
                onClick={markAllAsRead}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 p-6">
                <User size={48} className="text-slate-300" />
                <p className="text-center text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !notification.seen ? 'bg-blue-50/50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                        <img
                          src={
                            notification.user?.profile_pic ||
                            'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                          }
                          alt={notification.user?.username}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {notification.user?.username}
                            </p>
                            <p className="text-sm text-slate-600">
                              {notification.type === 'follow' && (
                                <span className="flex items-center gap-1">
                                  <UserPlus size={14} /> Started following you
                                </span>
                              )}
                            </p>
                          </div>

                          {!notification.seen && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors ml-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationsSidebar;
