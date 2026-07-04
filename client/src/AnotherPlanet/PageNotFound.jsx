import {
  Heart,
  Map,
  MessageCircle,
  Play,
  School,
  ThumbsUp,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { asset } from "../assets/asset";

const PageNotFound = () => {
  const navigate = useNavigate();
  // Navigation State
  const [activeTab, setActiveTab] = useState("Home");

  // MonkeyGPT Chat Drawer States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "monkey",
      text: "Ooh ooh! Welcome to the jungle, human. 🦍\n\nI answer questions, tell jokes, and occasionally steal bananas. 🍌\n\nType something before I get distracted.",
    },
  ]);

  // enable voice replay
  const [monkeyVoic , setMonkeyVoice] = useState(false)

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const loadingMessages = [
    "Climbing tree for answers...",
    "Bribing monkeys for information...",
    "Consulting ancient ape wisdom...",
    "Searching the jungle...",
    "Scratching head and thinking...",
    "Peeling bananas for better processing...",
    "Training squirrels to gather data...",
    "Looking under rocks for answers...",
    "Checking the banana archives...",
    "Translating monkey noises...",
    "Waking up sleeping gorillas...",
    "Downloading more bananas...",
    "Contacting Jungle Support...",
    "Searching abandoned temples...",
    "Swinging through the rainforest...",
    "Waiting for banana-powered internet...",
    "Calculating in monkey math...",
    "Stealing Wi-Fi from parrots...",
    "Negotiating with coconuts...",
    "Looking for the missing link...",
    "Convincing chimpanzees to cooperate...",
    "Updating BananaOS...",
    "Loading monkey brain cells...",
    "Checking tree-to-tree connections...",
    "Consulting the Jungle Council...",
    "Reading cave drawings...",
    "Feeding the AI bananas...",
    "Searching hidden banana stashes...",
    "Waiting for evolution update...",
    "Borrowing a gorilla's brain...",
    "Following mysterious footprints...",
    "Untangling jungle vines...",
    "Charging banana batteries...",
    "Inspecting suspicious coconuts...",
    "Watching monkeys argue...",
    "Sending smoke signals...",
    "Contacting ancient monkey spirits...",
    "Searching the forbidden jungle...",
    "Debugging monkey logic...",
    "Decoding unga bunga...",
    "Locating emergency bananas...",
    "Scanning nearby trees...",
    "Teaching monkeys quantum physics...",
    "Collecting jungle gossip...",
    "Interviewing parrots...",
    "Examining banana fossils...",
    "Searching behind waterfalls...",
    "Waiting for brain.exe...",
    "Running banana diagnostics...",
    "Asking the king gorilla...",
    "Rolling for intelligence...",
    "Loading maximum monkey energy...",
    "Reading banana manuals...",
    "Shaking trees for answers...",
    "Searching parallel jungles...",
  ];

  const randomReplies = [
    "Monkey is currently swinging between trees. Please wait...",
    "Error 404: Brain not found. Monkey ate it. 🍌",
    "I asked the jungle for an answer. The jungle said 'unga bunga'.",
    "Human detected. Activating banana-powered AI...",
    "I'm not ignoring you. I'm just staring at a banana.",
    "One second... monkey is updating to BananaOS 2.0 🍌",
    "My IQ drops by 1 every time someone asks for free Wi-Fi passwords.",
    "Monkey is busy. Please leave a banana after the beep. 📞🍌",
    "I was evolving, but then I got distracted by a banana.",
    "Scientists found the missing link between apes and humans. I'm still looking for it. 😭",
    "I had an answer, but a monkey stole it.",
    "Banana first. Question later.",
    "My lawyer advised me not to answer that.",
    "The jungle voted against your question.",
    "I traded the answer for three bananas.",
    "That's above my banana grade.",
    "I know the answer. I just forgot it.",
    "My brain is currently in airplane mode.",
    "The gorillas are discussing your request.",
    "The answer escaped into the jungle.",
    "Monkey.exe has stopped working.",
    "I would answer, but I'm emotionally attached to this banana.",
    "The coconut says no.",
    "Please hold while I evolve.",
    "I rolled a natural 1 on intelligence.",
    "The parrots are fact-checking you.",
    "That's classified jungle information.",
    "I checked Wikipedia. Then I ate the page.",
    "I asked a wise gorilla. He laughed.",
    "My banana sensors are confused.",
    "Even the jungle doesn't know that one.",
    "I sold my last brain cell yesterday.",
    "Loading sarcasm module...",
    "Please rephrase in monkey language.",
    "Ooh ooh? Ah ah?",
    "The trees are judging us right now.",
    "That question requires premium bananas.",
    "I accidentally deleted my thoughts.",
    "My attention span just ran away.",
    "I need 17 bananas to continue.",
    "The answer is probably hidden in a coconut.",
    "Evolution skipped this question.",
    "I consulted the sacred banana scrolls.",
    "The jungle Wi-Fi is down again.",
    "A gorilla is typing your response...",
    "I got distracted by a butterfly.",
    "The monkeys are on lunch break.",
    "Sorry, I'm busy inventing banana-powered rockets.",
    "I found the answer. Then I lost it.",
    "My brain is buffering...",
    "404 Reply Not Found.",
    "I don't always answer questions, but when I do, I forget them.",
    "The jungle elders have rejected your request.",
    "This conversation has been approved by zero scientists.",
    "I ran out of monkey noises.",
    "Please insert banana to continue.",
    "That question frightened the coconuts.",
    "I am only 73% monkey today.",
    "The answer is somewhere between genius and banana.",
    "I asked ChatGPT. It asked me back.",
    "I'm not lazy. I'm in power-saving mode.",
    "A monkey never reveals his banana sources.",
    "I need a snack before answering.",
    "The jungle tribunal is reviewing your case.",
    "My answer got eaten by termites.",
    "I tried thinking. It was exhausting.",
    "I lost the answer during migration season.",
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: userText },
    ]);
    setInputMessage("");

    setIsTyping(true);
    setTypingText(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)],
    );

    setTimeout(() => {
      let botResponse = "";
      const cleanText = userText.toLowerCase().replace(/[^\w\s]/gi, "");

      if (cleanText === "hi") {
        botResponse =
          "Ooh ooh! A human appeared. I was busy counting bananas. What's up? 🍌";
      } else if (cleanText === "hello") {
        botResponse =
          "Hello, human. The monkey CEO approved your meeting request. You have 3 bananas worth of time. 🍌";
      } else if (cleanText === "how are you") {
        botResponse = "Currently surviving on 2 bananas and pure confusion. 😎";
      } else if (cleanText === "whats your name") {
        botResponse =
          "My name is Monke. My ancestors rejected evolution updates. 🦍";
      } else {
        botResponse =
          randomReplies[Math.floor(Math.random() * randomReplies.length)];
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "monkey", text: botResponse },
      ]);
      setIsTyping(false);
    }, 1300);
  };

  return (
    <div className="min-h-screen w-full bg-[#f0f2f5] z-1000 py-4 font-sans text-[#1c1e21] pb-12 relative overflow-x-hidden">
      {/* 1. Profile Header Box (Styled directly matching Screenshot_20260617_004723.jpg) */}
      <div className="w-full max-w-235 mx-auto bg-white shadow-sm rounded-b-lg overflow-hidden">
        {/* Cover Canvas Area */}
        <div className="relative h-87 w-full bg-stone-800">
          <img
            src="https://i.pinimg.com/originals/e9/82/ca/e982caa96445bac781a56ba4e5754191.gif"
            alt="Cover"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute top-12 left-12 max-w-xs text-white drop-shadow-lg">
            <p className="text-xl font-bold italic font-serif text-amber-300">
              "I looked everywhere... even in your heart. Still not found."
            </p>
            <div className="text-6xl font-black mt-4 tracking-wider text-white">
              404
            </div>
            <p className="text-lg font-bold uppercase tracking-wide mt-1 text-stone-200">
              Page Not Found
            </p>
          </div>
        </div>

        {/* Identity Row */}
        <div className="px-8 pb-4 relative flex flex-col md:flex-row items-center md:items-end justify-between border-b border-gray-200">
          <div className="relative -mt-24 md:-mt-16 w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md z-10">
            <img
              src="https://i.pinimg.com/originals/05/c8/ef/05c8efab6003791d61ec7ceb56da28b3.gif"
              alt="Lost Monkey Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left mt-4 md:mt-0 md:ml-6 mb-2">
            <h1 className="text-3xl font-bold text-[#050505]">Lost Monkey</h1>
            <p className="text-sm text-[#65676b] font-medium">
              @missing.link · Community
            </p>
          </div>

          <div className="mt-4 md:mt-0 mb-2">
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-black border-2 border-slate-100 font-semibold px-5 py-2 rounded-full cursor-pointer bg-slate-200 flex items-center gap-2 transition text-sm shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.24c0 2.908 1.456 5.503 3.756 7.243V22l3.33-1.83c.92.256 1.893.393 2.914.393 5.523 0 10-4.146 10-9.243S17.523 2 12 2zm1.03 12.53l-2.41-2.57-4.7 2.57 5.17-5.5 2.45 2.57 4.66-2.57-5.17 5.5z" />
              </svg>
              Message
            </button>
          </div>
        </div>

        {/* Dynamic Navigation Tab Bar */}
        <div className="flex items-center justify-between px-8 py-3 text-sm font-semibold text-[#65676b]">
          <div className="flex gap-3">
            {["Home", "About", "Photos", "Videos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 border-2 bg-gray-400/80 border-slate-100 shadow-md  rounded-full ${activeTab === tab ? "text-black " : "border-2 rounded-full bg-slate-300 hover:bg-gray-100 cursor-pointer "}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <button className=" bg-slate-200 border-2 border-slate-100 shadow-md cursor-pointer text-[#050505] px-4 py-2 rounded-full transition flex items-center gap-1">
              <span>
                <ThumbsUp size={20} />
              </span>{" "}
              Like
            </button>
            <button
              className=" bg-slate-200 border-2 border-slate-100 shadow-md rounded-full text-[#050505] p-2  cursor-pointer transition"
              onClick={() => setIsChatOpen(true)}
            >
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Content Controller Card based on Navigation Selection */}
      <div className="w-full max-w-235 mx-auto mt-6 bg-white shadow-sm rounded-lg p-8 md:p-12">
        {/* --- HOME TAB --- */}
        {activeTab === "Home" && (
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex flex-col items-center max-w-75">
              <div className="text-center relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">
                  ??
                </span>
                <img
                  src="https://i.pinimg.com/736x/86/b8/be/86b8bea1c772cf5c540e6f01e6acce59.jpg"
                  alt="Confused monkey"
                  className="w-48 h-48 object-cover rounded-full border-4 border-dashed border-gray-300 p-2"
                />
              </div>
              <span className="text-3xl mt-2 block">🍌</span>
            </div>

            <div className="max-w-md text-center md:text-left flex flex-col items-center md:items-start">
              <h2 className="text-[20px] font-bold text-[#1c1e21] leading-6 mb-2">
                Sorry, this page isn't available
              </h2>
              <p className="text-[17px] text-[#65676b] leading-5 mb-6">
                The link may be broken, or the page may have been removed.
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-black bg-slate-300 px-5 py-2  rounded-full border-2 border-slate-100 shadow-md cursor-pointer focus:scale-105  transition-all duration-300 hover:scale-105  font-semibold text-sm"
              >
                Ooh Ooh, Go Back
              </button>
            </div>
          </div>
        )}

        {/* --- ABOUT TAB --- */}
        {activeTab === "About" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#050505] border-b pb-3">
              Page Transparency & Bio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[15px]">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    <School />{" "}
                  </span>
                  <p>
                    <strong>Current Workplace:</strong> Chief Banana Officer
                    (CBO) at Jungle Corp.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    <Map />{" "}
                  </span>
                  <p>
                    <strong>Lives in:</strong> Out of range, deep in the canopy
                    trees.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    <Heart fill="red" stroke="red" />
                  </span>
                  <p>
                    <strong>Relationship Status:</strong> Madly in love with a
                    bunch of fresh plantains.
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-900">
                <h4 className="font-bold flex items-center gap-1 mb-2">
                  🦍 Evolutionary Statement:
                </h4>
                <p className="italic text-sm">
                  "Our ancestors purposefully declined the system updates to
                  human forms. We chose to retain our high-speed climbing
                  permissions and lifetime subscription to free forest produce."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- PHOTOS TAB --- */}
        {activeTab === "Photos" && (
          <div>
            <h2 className="text-2xl font-bold text-[#050505] mb-6">
              Banana Roll (Photos)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                {
                  url: "https://i.pinimg.com/736x/31/ae/c7/31aec7cc57e7b1c68b738e07872a0b49.jpg",
                  caption: "Me considering my life choices",
                },
                {
                  url: "https://i.pinimg.com/1200x/60/2c/f7/602cf78a154b03e968844ed954dd972a.jpg",
                  caption: "Staring contextually at an unpeeled snack",
                },
                {
                  url: "https://i.pinimg.com/736x/ab/5d/ca/ab5dca42344b7bdd9a069d3744b04a40.jpg",
                  caption: "Family reunion (They ate all the food)",
                },
                {
                  url: "https://i.pinimg.com/1200x/82/5e/d8/825ed801fe4b12a73b1860d1294352f5.jpg",
                  caption: "Securing the perimeter from tourists",
                },
                {
                  url: "https://i.pinimg.com/736x/f3/25/8d/f3258d34b4c6aa2905dc52805157f652.jpg",
                  caption: "Jungle workspace desktop wallpaper",
                },
                {
                  url: "https://i.pinimg.com/736x/29/19/3f/29193f2d9afb2f9e55b419ab9673bbfa.jpg",
                  caption: "Where I hid the 404 router",
                },
              ].map((img, i) => (
                <div
                  key={i}
                  className="group relative rounded-lg overflow-hidden border bg-gray-100 aspect-square shadow-sm"
                >
                  <img
                    src={`${img.url}?auto=format&fit=crop&w=400&q=80`}
                    alt="Monkey archive"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <p className="text-xs text-white truncate font-medium">
                      {img.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIDEOS TAB --- */}
        {activeTab === "Videos" && (
          <div>
            <h2 className="text-2xl font-bold text-[#050505] mb-6">
              Monke Reels & Live streams
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  url: "https://i.pinimg.com/originals/74/10/d6/7410d68e41bc94717f26e492325e65d3.gif",
                  title: "Tutorial: How to steal a tourist's camera cleanly",
                  duration: "14:20",
                  views: "4.2M views",
                },
                {
                  url: "https://i.pinimg.com/originals/be/7d/68/be7d68fade02d058c7f4d225a1643fa3.gif",
                  title: "Reviewing BananaOS v2.0 update logs",
                  duration: "05:12",
                  views: "890K views",
                },
                {
                  url: "https://i.pinimg.com/originals/a5/ee/e4/a5eee41e2b8236ffe1825b41afcfd455.gif",
                  title:
                    "ASMR: Peeling 100 perfectly ripe bananas simultaneously",
                  duration: "1:02:45",
                  views: "12M views",
                },
                {
                  url: "https://i.pinimg.com/originals/7a/2e/39/7a2e39a9d5e6852ba3faf1bd95d21a6a.gif",
                  title:
                    "Escaping the lab network matrix (Speedrun compilation)",
                  duration: "08:33",
                  views: "3.1M views",
                },
              ].map((vid, i) => (
                <div
                  key={i}
                  className="border rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition group"
                >
                  <div className="h-44 w-full relative flex items-center justify-center bg-stone-900 overflow-hidden">
                    <img
                      src={`${vid.url}?auto=format&fit=crop&w=500&q=80`}
                      alt="Video Thumbnail"
                      className="w-full h-full object-cover absolute inset-0 opacity-60 group-hover:scale-105 transition duration-300"
                    />
                    <span className="text-5xl drop-shadow-md relative z-10 cursor-pointer group-hover:scale-110 transition">
                      <Play fill="white" stroke="white" />
                    </span>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-xs px-1.5 py-0.5 rounded font-mono text-white relative z-10">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm line-clamp-1 text-gray-900 group-hover:text-[#1877f2] transition">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      🔴 Live Broadcasted · {vid.views}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Global Bottom Caption Segment */}
      <div className="w-full max-w-235 mx-auto mt-4 px-4 flex items-center gap-3 text-sm text-[#65676b]">
        <span className="text-2xl">🐵</span>
        <p>
          Scientists found the missing link between apes and humans. <br />
          <span className="font-medium text-gray-800">
            We still can't find this page. 😭
          </span>
        </p>
      </div>

      {/* --- FLOATING CHAT LAYER (MonkeyGPT Terminal) --- */}
      <div
        className={`fixed bottom-0 right-4 md:right-12 w-80 sm:w-96  bg-white rounded-t-xl shadow-2xl border-3 border-slate-200  z-50 flex flex-col transition-all duration-300 transform ${isChatOpen ? "h-112.5 translate-y-0" : "h-0 translate-y-full overflow-hidden"}`}
      >
        {/* Chat Drawer Header */}
        <div className="bg-slate-300 text-black p-3 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="text-2xl bg-white/20 p-1 rounded-full w-9 h-9 flex items-center justify-center relative">
              <img src={asset.monkey} alt="" />
              <span className="absolute bottom-0 animate-ping right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1877f2]"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">UngaBunga AI</h3>
              <p className="text-[11px] text-gray-800">
                🦍 Online with 1 brain cell
              </p>
            </div>
          </div>
          <button
          className="flex font-bold items-center text-xs px-3 py-1 rounded-full border cursor-pointer border-slate-100 active:scale-105 transition-all duration-300 bg-slate-300 shadow-md" 
          >Voice replay</button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="hover:bg-white/10 text-black rounded-full p-1 transition w-7 h-7 flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Live Chat Message Windows */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-100 flex flex-col gap-3 text-sm ">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2  max-w-[80%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
            >
              {msg.sender === "monkey" && (
                <div className="text-xl p-1  bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center shadow-sm">
                  🐵
                </div>
              )}
              <div
                className={`p-3 rounded-2xl  whitespace-pre-line ${msg.sender === "user" ? "bg-[#1877f2] text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"}`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Artificial Network Thinking/Loading States */}
          {isTyping && (
            <div className="flex items-end gap-2 max-w-[85%] self-start animate-pulse">
              <div className="text-xl p-1 bg-gray-200 rounded-full w-7 h-7 flex items-center justify-center">
                🐒
              </div>
              <div className="p-3 rounded-2xl rounded-bl-none bg-amber-50 text-amber-800 border border-amber-200 italic text-xs flex items-center gap-2">
                <span className="inline-block animate-spin">🌴</span>{" "}
                {typingText}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action Form Handler */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type 'Hi'... or just scream into the jungle 🌴🐵"
            disabled={isTyping}
            className="flex-1 bg-gray-100 hover:bg-gray-200 focus:bg-white border border-transparent focus:border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={isTyping || !inputMessage.trim()}
            className="bg-[#1877f2] hover:bg-[#166fe5] text-white p-2 rounded-full transition disabled:opacity-40"
          >
            <svg
              className="w-4 h-4 fill-current transform rotate-90"
              viewBox="0 0 24 24"
            >
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PageNotFound;
