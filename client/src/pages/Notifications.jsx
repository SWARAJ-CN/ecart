import React from "react";
import { useNavigate } from "react-router-dom";
import { X, UserPlus, ArrowLeft } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { asset } from "../assets/asset";

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    navigate(`/profile/${notification.user.id}`);
  };


  return (
    <div className="min-h-screen bg-slate-100 px-3 py-20 md:px-6 lg:px-8 mt-5">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">
                Notifications
              </h1>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                <UserPlus size={48} className="text-slate-300" />
                <p className="text-center text-base">No notifications yet</p>
                 <p className="text-xs text-blue-400 cursor-pointer" onClick={()=>navigate('/users')}>make connections</p>
                <p className="text-center text-sm text-slate-400">
                  You'll see notifications when people follow you
                </p>
                <DotLottieReact
                  src="https://lottie.host/ed4045b1-c695-4f65-8890-74b0a2870d13/guwBM0DHfk.lottie"
                  loop
                  autoplay
                  className="w-100"
                />
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notification.seen ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-4 items-center">
                    <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={notification.user?.profile_pic || asset.nouser}
                        alt={notification.user?.username}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-slate-800">
                        {notification.user?.username}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                        <UserPlus size={16} /> Started following you
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.seen && (
                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-slate-400 hover:text-slate-600 transition-colors p-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
