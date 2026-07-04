import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMessages, fetchUser } from '../services/route';

const TopChats = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const response = await fetchUser();
        const users = response?.data || [];
        const authKey = localStorage.getItem('authkey');
        const currentUser = users.find((user) => user.email === authKey);

        if (!currentUser) return;

        const messagesResponse = await fetchMessages(currentUser.id);
        const allMessages = messagesResponse?.data || [];

        const enrichedConnections = users
          .filter((user) => Number(user.id) !== Number(currentUser.id))
          .map((user) => {
            const relatedMessages = allMessages.filter((message) => {
              const from = Number(message.fromUserId);
              const to = Number(message.toUserId);
              return (from === Number(currentUser.id) && to === Number(user.id)) || (from === Number(user.id) && to === Number(currentUser.id));
            });

            return {
              ...user,
              lastMessage: relatedMessages[relatedMessages.length - 1],
              count: relatedMessages.length,
            };
          })
          .filter((user) => user.count > 0)
          .sort((first, second) => new Date(second.lastMessage?.createdAt || 0) - new Date(first.lastMessage?.createdAt || 0));

        setConnections(enrichedConnections);
      } catch (error) {
        console.error(error);
      }
    };

    loadConnections();
  }, []);

  return (
    <div className="flex h-80 w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <h1 className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-center text-sm font-semibold text-slate-700">
        Recent Messages
      </h1>

      <div className="mt-3 flex-1 space-y-2.5 overflow-y-auto pr-1">
        {connections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500">
            No recent chats yet.
          </div>
        ) : (
          connections.map((user) => (
            <div
              key={user?.id}
              onClick={() => navigate(`/messages/${user.id}`)}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-2.5 shadow-xs transition-all duration-200 hover:bg-slate-50/80"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                  <img src={user?.profile_pic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={user?.username} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">{user?.username}</p>
                  <p className="truncate text-xs text-slate-500">{user.lastMessage?.text || 'Start chatting'}</p>
                </div>
              </div>

              <span className="min-w-6 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-center text-xs font-bold text-indigo-600">
                {user?.count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopChats;