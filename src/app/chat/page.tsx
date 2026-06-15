"use client";

/**
 * ChatList
 * -----------------------------------------------------------------------
 * หน้าแชทหลัก แบ่งเป็น 2 ส่วน:
 *   1. "Matches ใหม่" - คนที่ match กันแล้วแต่ยังไม่เคยคุย (horizontal scroll avatar)
 *   2. "ข้อความ" - รายการแชทที่เคยคุยแล้ว เรียงตามเวลาล่าสุด
 *
 * แต่ละแชทมี tag บอกว่า match กันจาก event ไหน (context ของแอป)
 * เขียนด้วย Tailwind ทั้งหมด, mock data ก่อน ทีหลังค่อยดึงจาก /api/matches, /api/messages
 *
 * วางไฟล์ที่ เช่น app/(main)/chat/page.tsx
 * ใช้ icon จาก lucide-react:
 *   npm install lucide-react
 * -----------------------------------------------------------------------
 */

import { Search } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

interface NewMatch {
  id: string;
  name: string;
  avatar: string;
  eventName: string;
  matchedAgo: string; // เช่น "2 ชม.ที่แล้ว"
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  eventName: string;
  lastMessage: string;
  time: string; // เช่น "5 นาทีที่แล้ว"
  unreadCount: number;
  isTyping?: boolean;
}

const NEW_MATCHES: NewMatch[] = [
  {
    id: "m-001",
    name: "มิ้นท์",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces",
    eventName: "Sunset Run Club",
    matchedAgo: "2 ชม.ที่แล้ว",
  },
  {
    id: "m-002",
    name: "ตี๋",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces",
    eventName: "Indie Live Set",
    matchedAgo: "5 ชม.ที่แล้ว",
  },
  {
    id: "m-003",
    name: "พลอย",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop&crop=faces",
    eventName: "Street Food Crawl",
    matchedAgo: "เมื่อวาน",
  },
  {
    id: "m-004",
    name: "เกม",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=160&h=160&fit=crop&crop=faces",
    eventName: "One Piece Pop-up",
    matchedAgo: "เมื่อวาน",
  },
  {
    id: "m-005",
    name: "เกม",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=160&h=160&fit=crop&crop=faces",
    eventName: "One Piece Pop-up",
    matchedAgo: "เมื่อวาน",
  },
  {
    id: "m-006",
    name: "เกม",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=160&h=160&fit=crop&crop=faces",
    eventName: "One Piece Pop-up",
    matchedAgo: "เมื่อวาน",
  },
  {
    id: "m-007",
    name: "เกม",
    avatar:
      "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=160&h=160&fit=crop&crop=faces",
    eventName: "One Piece Pop-up",
    matchedAgo: "เมื่อวาน",
  },
];

const CONVERSATIONS: Conversation[] = [
  {
    id: "c-001",
    name: "ฟ้า",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=faces",
    online: true,
    eventName: "One Piece Pop-up Cafe",
    lastMessage: "ขอบคุณที่มาคุยด้วยนะ รอเจอกันวันเสาร์เลย!",
    time: "5 นาทีที่แล้ว",
    unreadCount: 2,
  },
 
  {
    id: "c-003",
    name: "หนาน",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=faces",
    online: true,
    eventName: "Sunset Run Club",
    lastMessage: "",
    time: "เมื่อวาน",
    unreadCount: 1,
    isTyping: true,
  },
  {
    id: "c-004",
    name: "อร",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=160&h=160&fit=crop&crop=faces",
    online: false,
    eventName: "Indie Live Set: ดนตรีในสวน",
    lastMessage: "โอเคค่ะ งั้นไปกันเลย ขอบคุณนะ",
    time: "2 วันที่แล้ว",
    unreadCount: 0,
  },
  {
    id: "c-005",
    name: "ปลื้ม",
    avatar:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=160&h=160&fit=crop&crop=faces",
    online: false,
    eventName: "Acoustic Live Night",
    lastMessage: "วันนั้นสนุกมากเลย ครั้งหน้าไปด้วยกันอีกนะ",
    time: "3 วันที่แล้ว",
    unreadCount: 0,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatList() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-100 bg-white px-4 pb-3 pt-[calc(env(safe-area-inset-top)+12px)]">
        <h1 className="text-lg font-bold text-gray-900">แชท</h1>

        {/* Search */}
        <div className="mt-3 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรือ event..."
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            readOnly
          />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* ---------------- New Matches ---------------- */}
        {NEW_MATCHES.length > 0 && (
          <div className="border-b border-gray-100 py-4">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-sm font-semibold text-gray-900">
                แมทใหม่
              </h2>
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                {NEW_MATCHES.length}
              </span>
            </div>

            <div className="mt-3 flex gap-4 overflow-x-auto px-4 scrollbar-hide">
              {NEW_MATCHES.map((match) => (
                <button
                  key={match.id}
                  type="button"
                  className="flex w-16 flex-shrink-0 flex-col items-center gap-1.5"
                >
                  <div className="relative">
                    <div className="h-16 w-16  m-2 rounded-full ring-2 ring-rose-500 ring-offset-2 ring-offset-white">
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    {/* badge "ใหม่" */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow">
                      ใหม่
                    </span>
                  </div>
                  <span className="w-full truncate text-center text-xs font-medium text-gray-700 mt-1">
                    {match.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- Conversations ---------------- */}
        <div className="px-2 py-2">
          <h2 className="px-3 py-1 text-sm font-semibold text-gray-900">
            ข้อความ
          </h2>

          <div className="flex flex-col">
            {CONVERSATIONS.map((chat) => {
              const isUnread = chat.unreadCount > 0;

              return (
                <button
                  key={chat.id}
                  type="button"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  {/* Avatar + online dot */}
                  <div className="relative shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    {chat.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-sm ${
                          isUnread
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-800"
                        }`}
                      >
                        {chat.name}
                      </span>
                      <span
                        className={`shrink-0 text-[11px] ${
                          isUnread ? "text-rose-500 font-semibold" : "text-gray-400"
                        }`}
                      >
                        {chat.time}
                      </span>
                    </div>

                    {/* Event context tag */}
                    <span className="truncate text-[11px] text-gray-400">
                      💬 match จาก {chat.eventName}
                    </span>

                    {/* Last message / typing */}
                    <div className="flex items-center justify-between gap-2">
                      {chat.isTyping ? (
                        <span className="truncate text-xs font-medium text-rose-500">
                          กำลังพิมพ์...
                        </span>
                      ) : (
                        <span
                          className={`truncate text-xs ${
                            isUnread
                              ? "font-medium text-gray-700"
                              : "text-gray-500"
                          }`}
                        >
                          {chat.lastMessage}
                        </span>
                      )}

                      {isUnread && (
                        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
    
    </div>
  );
}