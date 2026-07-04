import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUser } from '../services/route';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [newFollowers, setNewFollowers] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchUser();
        const users = response?.data || [];
        const authKey = localStorage.getItem('authkey');
        const currentUser = users.find((user) => user.email === authKey);

        if (!currentUser) return;

        // Get list of new followers
        const followers = currentUser.followers || [];
        const followerObjects = users.filter((user) => followers.includes(user.id));

        setNewFollowers(followerObjects);
        setUnseenCount(followerObjects.length);

        const notifsList = followerObjects.map((follower) => ({
          id: follower.id,
          type: 'follow',
          message: `${follower.username} started following you`,
          user: follower,
          createdAt: new Date().toISOString(),
          seen: false,
        }));

        setNotifications(notifsList);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, seen: true } : notif
      )
    );
    setUnseenCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, seen: true })));
    setUnseenCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        newFollowers,
        unseenCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
