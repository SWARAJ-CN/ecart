import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Search,
  SendHorizonal,
  Video,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";
import io from "socket.io-client";
import { BASE_URL } from "../services/baseurl";
import { fetchMessages, fetchUser, sendChatMessage } from "../services/route";
import { asset } from "../assets/asset";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Messages = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const createRoomId = (firstUserId, secondUserId) =>
    `chat-${[Number(firstUserId), Number(secondUserId)].sort((a, b) => a - b).join("-")}`;

  // Automatically scroll to the bottom of the chat box when a message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchUser();
        const fetchedUsers = response?.data || [];
        const authKey = localStorage.getItem("authkey");
        const loggedUser =
          fetchedUsers.find((user) => user.email === authKey) ||
          fetchedUsers[0];

        setUsers(fetchedUsers);
        setCurrentUser(loggedUser);

        if (loggedUser) {
          const threadResponse = await fetchMessages(loggedUser.id);
          setAllMessages(threadResponse?.data || []);

          // Find following array from current logged user metadata
          const followingList = Array.isArray(loggedUser.following)
            ? loggedUser.following
            : [];

          // Target current URL param user, or fallback to the first followed user
          const targetUser = userId
            ? fetchedUsers.find((user) => Number(user.id) === Number(userId))
            : fetchedUsers.find((user) =>
                followingList.includes(Number(user.id)),
              );

          setSelectedUser(targetUser || null);
        }
      } catch (error) {
        console.error("Error initializing chat system:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  useEffect(() => {
    if (!currentUser?.id || !selectedUser?.id) return;

    const loadThread = async () => {
      setLoading(true);
      try {
        const response = await fetchMessages(currentUser.id, selectedUser.id);
        setMessages(response?.data || []);
      } finally {
        setLoading(false);
      }
    };

    loadThread();
  }, [currentUser?.id, selectedUser?.id]);

  useEffect(() => {
    if (!currentUser?.id) return;
    const socket = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    return () => socket.disconnect();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || !selectedUser?.id) return;

    const roomId = createRoomId(currentUser.id, selectedUser.id);
    socketRef.current?.emit("join-room", roomId);

    const handleIncomingMessage = (message) => {
      const isRelevant =
        (message.fromUserId === currentUser.id &&
          message.toUserId === selectedUser.id) ||
        (message.fromUserId === selectedUser.id &&
          message.toUserId === currentUser.id);

      if (isRelevant) {
        setMessages((prev) =>
          prev.some((item) => item.id === message.id)
            ? prev
            : [...prev, message],
        );
        setAllMessages((prev) =>
          prev.some((item) => item.id === message.id)
            ? prev
            : [...prev, message],
        );
      }
    };

    socketRef.current?.on("receive-message", handleIncomingMessage);
    return () =>
      socketRef.current?.off("receive-message", handleIncomingMessage);
  }, [currentUser?.id, selectedUser?.id]);

  // Dynamic Contact Filter Loop - ONLY SHOWS FOLLOWING CREATORS
  const contactList = useMemo(() => {
    if (!currentUser?.id) return [];

    const userFollowingArray = Array.isArray(currentUser.following)
      ? currentUser.following
      : [];

    return (
      users
        .filter((user) => Number(user.id) !== Number(currentUser.id))
        // Strictly restrict user directory lookup list down to matching ids in the following array
        .filter((user) => userFollowingArray.includes(Number(user.id)))
        // Text Filter matching via search query string matching state references
        .filter((user) =>
          user?.username?.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .map((user) => {
          const relatedMessages = allMessages.filter((message) => {
            const from = Number(message.fromUserId);
            const to = Number(message.toUserId);
            return (
              (from === Number(currentUser.id) && to === Number(user.id)) ||
              (from === Number(user.id) && to === Number(currentUser.id))
            );
          });

          const lastMessage = relatedMessages[relatedMessages.length - 1];
          const unreadCount = relatedMessages.filter(
            (message) =>
              Number(message.toUserId) === Number(currentUser.id) &&
              Number(message.fromUserId) === Number(user.id),
          ).length;

          return { ...user, lastMessage, unreadCount };
        })
        .sort(
          (first, second) =>
            new Date(second.lastMessage?.createdAt || 0) -
            new Date(first.lastMessage?.createdAt || 0),
        )
    );
  }, [
    allMessages,
    currentUser?.following,
    currentUser?.id,
    users,
    searchQuery,
  ]);

  const handleSend = async (event) => {
    event.preventDefault();
    const trimmedText = draft.trim();

    if (!trimmedText || !currentUser?.id || !selectedUser?.id) return;

    const optimisticMessage = {
      id: Date.now(),
      fromUserId: Number(currentUser.id),
      toUserId: Number(selectedUser.id),
      text: trimmedText,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setAllMessages((prev) => [...prev, optimisticMessage]);
    setDraft("");

    const response = await sendChatMessage({
      fromUserId: Number(currentUser.id),
      toUserId: Number(selectedUser.id),
      text: trimmedText,
    });

    const savedMessage = response?.data || optimisticMessage;
    setMessages((prev) =>
      prev.map((item) =>
        item.id === optimisticMessage.id ? savedMessage : item,
      ),
    );
    setAllMessages((prev) =>
      prev.map((item) =>
        item.id === optimisticMessage.id ? savedMessage : item,
      ),
    );

    socketRef.current?.emit("send-message", {
      roomId: createRoomId(currentUser.id, selectedUser.id),
      message: savedMessage,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-2 py-20 sm:px-4 md:px-6">
      <div className="mx-auto flex h-[82vh] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        {/* Navigation Sidebar Area */}
        <aside
          className={`w-full lg:max-w-xs flex-col border-r border-slate-100 bg-slate-50/60 ${selectedUser && userId ? "hidden lg:flex" : "flex"}`}
        >
          <div className="px-4 py-4 space-y-3 border-b border-slate-100 bg-white">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct Messages
              </p>
              <h2 className="text-lg font-bold text-slate-800">
                Following Contacts
              </h2>
            </div>

            {/* Functional Sidebar Search Input Block */}
            <div className="relative flex items-center">
              <Search
                size={15}
                className="absolute left-3 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search following users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-9 pr-3 py-1.5 text-xs outline-none focus:border-slate-400 focus:bg-white transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Following Contact Scroller List Container */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {contactList.length > 0 ? (
              contactList.map((contact) => {
                const isActive = selectedUser?.id === contact.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedUser(contact);
                      navigate(`/messages/${contact.id}`);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                        : "hover:bg-slate-100/80 text-slate-700"
                    }`}
                  >
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white shadow-xs">
                      <img
                        src={contact?.profile_pic || asset.nouser}
                        alt={contact?.username}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`truncate text-sm font-bold ${isActive ? "text-white" : "text-slate-800"}`}
                        >
                          @{contact?.username || "user"}
                        </p>
                        {contact.unreadCount > 0 && !isActive && (
                          <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white shrink-0">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                      <p
                        className={`truncate text-xs ${isActive ? "text-indigo-100" : "text-slate-500"} mt-0.5`}
                      >
                        {contact.lastMessage?.text || "Start conversation..."}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs px-4">
                No followed users match your criteria.
              </div>
            )}
          </div>
        </aside>

        {/* Messaging Central Hub Interface Box Frame */}
        <section
          className={`flex-1 flex-col ${!selectedUser || !userId ? "hidden lg:flex" : "flex"}`}
        >
          {selectedUser ? (
            <>
              <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button functionality navigation fallback action trigger context wrapper */}
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      navigate("/messages");
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden shrink-0"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 shrink-0">
                    <img
                      src={selectedUser?.profile_pic || asset.nouser}
                      alt={selectedUser?.username}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      @{selectedUser?.username || "user"}
                    </p>
                    <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                      Online Status
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition active:scale-95">
                    <Phone size={16} />
                  </button>
                  <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition active:scale-95">
                    <Video size={16} />
                  </button>
                  <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition active:scale-95">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </header>

              {/* Message Scroller Node Container view */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4 [&::-webkit-scrollbar]:hidden">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-xs text-slate-400">
                    Loading conversation thread...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-slate-400 gap-2">
                    <MessageCircle className="h-8 w-8 text-indigo-500/60" />
                    <p className="font-semibold text-slate-700 text-sm">
                      Say hello to @{selectedUser.username}!
                    </p>
                    {/* animation later */}
                    <DotLottieReact
                      src="https://lottie.host/8ca6ea26-3ae6-4781-bfa9-b54b39dfe27e/iL7OVFzrJt.lottie"
                      loop
                      autoplay
                      className="w-50 "
                    />
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMine =
                      Number(message.fromUserId) === Number(currentUser?.id);
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3.5 py-2 shadow-2xs text-sm leading-relaxed ${
                            isMine
                              ? "bg-indigo-600 text-white rounded-tr-none"
                              : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`mt-1 text-[9px] text-right font-medium opacity-75 ${isMine ? "text-indigo-100" : "text-slate-400"}`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              { hour: "numeric", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Submission Bar */}
              <form
                onSubmit={handleSend}
                className="border-t border-slate-100 bg-white p-3"
              >
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1 focus-within:border-slate-400 transition-all">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={`Message @${selectedUser.username || "user"}...`}
                    className="flex-1 bg-transparent py-2 text-xs outline-none text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="rounded-lg bg-indigo-600 p-2 text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-40 disabled:hover:bg-indigo-600"
                  >
                    <SendHorizonal size={14} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-slate-50/50 p-6 text-center text-slate-400 gap-2">
              <MessageCircle className="h-10 w-10 text-indigo-500/40" />
              <p className="font-bold text-slate-700 text-sm">
                Select an active chat session
              </p>
              <p className="text-xs max-w-xs leading-normal">
                Choose one of your followed connection streams from the sidebar
                panel to interact.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
