"use client";

/**
 * EventAttendees
 * -----------------------------------------------------------------------
 * หน้าแสดง event ที่เข้าร่วมแล้ว พร้อม:
 * - Hero image + ข้อมูล event
 * - Badge "เข้าร่วมแล้ว"
 * - Grid รูป attendees (mock)
 * - ปุ่ม "จับคู่กับคนในงาน" → เปิด MatchModal
 * - MatchModal: swipe-style card เลือก like / pass
 * -----------------------------------------------------------------------
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Check,
  Heart,
  X,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Attendee {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  isMe?: boolean;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const EVENT_DETAIL = {
  id: "evt-001",
  title: "One Piece Pop-up Cafe in Thailand",
  category: "นิทรรศการ / งานศิลปะ / งานฝีมือ",
  dateRange: "12 มีนาคม - 31 ตุลาคม 2569",
  location: "Attraction Hall ชั้น 6, ICONSIAM",
  image: "/ImgEvent/one_piece.jpg",
};

const ATTENDEES: Attendee[] = [
  {
    id: "me",
    name: "ฉัน",
    age: 24,
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "One Piece แฟนพันธุ์แท้มาตั้งแต่ม.ต้น 🏴‍☠️",
    isMe: true,
  },
  {
    id: "u1",
    name: "นภสร",
    age: 23,
    avatar: "https://i.pravatar.cc/150?img=44",
    bio: "ชอบ Zoro มาก ✨ หาเพื่อนดูนิทรรศการด้วยกัน",
  },
  {
    id: "u2",
    name: "ปิยะ",
    age: 26,
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Luffy is my spirit animal 🍖",
  },
  {
    id: "u3",
    name: "มินตรา",
    age: 22,
    avatar: "https://i.pravatar.cc/150?img=48",
    bio: "อ่านมังงะมา 10 ปี มาร่วมฉลองด้วยกัน!",
  },
  {
    id: "u4",
    name: "ธีรภัทร",
    age: 25,
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "ทีม Law 🩺 พร้อมพบเพื่อนใหม่",
  },
  {
    id: "u5",
    name: "ปาณิสรา",
    age: 21,
    avatar: "https://i.pravatar.cc/150?img=49",
    bio: "Nami best girl 🍊 ชอบ cosplay",
  },
  {
    id: "u6",
    name: "กฤษณ์",
    age: 27,
    avatar: "https://i.pravatar.cc/150?img=57",
    bio: "มาคนเดียว หาเพื่อนถ่ายรูปด้วย 📸",
  },
  {
    id: "u7",
    name: "วริษา",
    age: 24,
    avatar: "https://i.pravatar.cc/150?img=45",
    bio: "Robin fan club 📚 อยากคุยเรื่อง lore",
  },
  {
    id: "u8",
    name: "ชนินทร์",
    age: 28,
    avatar: "https://i.pravatar.cc/150?img=68",
    bio: "Gear 5 แซ่บมาก หาคนคุย theory ด้วย",
  },
];

// ---------------------------------------------------------------------------
// MatchCard — card ในกล่อง swipe
// ---------------------------------------------------------------------------

interface MatchCardProps {
  attendee: Attendee;
  onLike: () => void;
  onPass: () => void;
}

function MatchCard({ attendee, onLike, onPass }: MatchCardProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Avatar */}
      <div className="relative">
        <img
          src={attendee.avatar}
          alt={attendee.name}
          className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
        />
      </div>

      {/* Info */}
      <h2 className="mt-4 text-xl font-bold text-gray-900">
        {attendee.name}, {attendee.age}
      </h2>
      <p className="mt-1 text-center text-sm leading-relaxed text-gray-500 px-4">
        {attendee.bio}
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-6">
        <button
          onClick={onPass}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md transition-transform active:scale-95"
          aria-label="ผ่าน"
        >
          <X size={28} className="text-gray-400" />
        </button>
        <button
          onClick={onLike}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-md shadow-rose-200 transition-transform active:scale-95"
          aria-label="ชอบ"
        >
          <Heart size={28} className="fill-white text-white" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MatchModal
// ---------------------------------------------------------------------------

interface MatchModalProps {
  attendees: Attendee[];
  onClose: () => void;
}

function MatchModal({ attendees, onClose }: MatchModalProps) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  const candidates = attendees.filter((a) => !a.isMe);
  const current = candidates[index];
  const isDone = index >= candidates.length;

  const handleLike = () => {
    setLiked((prev) => [...prev, current.id]);
    // simulate mutual match randomly
    if (Math.random() > 0.4) {
      setShowMatch(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handlePass = () => {
    setIndex((i) => i + 1);
  };

  const handleMatchNext = () => {
    setShowMatch(false);
    setIndex((i) => i + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-sm flex-col overflow-hidden rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">จับคู่ในงาน</h3>
          <button onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Progress dots */}
        {!isDone && (
          <div className="mb-6 flex justify-center gap-1.5">
            {candidates.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < index
                    ? "w-3 bg-rose-300"
                    : i === index
                    ? "w-5 bg-rose-500"
                    : "w-3 bg-gray-200"
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        {showMatch ? (
          /* Match! screen */
          <div className="flex flex-col items-center py-4">
            <div className="flex -space-x-4">
              <img
                src={
                  ATTENDEES.find((a) => a.isMe)?.avatar ||
                  "https://i.pravatar.cc/150?img=47"
                }
                className="h-24 w-24 rounded-full border-4 border-white object-cover"
                alt="me"
              />
              <img
                src={current.avatar}
                className="h-24 w-24 rounded-full border-4 border-rose-100 object-cover"
                alt={current.name}
              />
            </div>
            <div className="mt-5 flex items-center gap-2">
              <Sparkles size={18} className="text-rose-500" />
              <span className="text-lg font-bold text-rose-500">It&apos;s a Match!</span>
              <Sparkles size={18} className="text-rose-500" />
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              คุณและ{current.name} ต่างชื่นชอบกัน
              <br />
              เริ่มคุยกันได้เลย!
            </p>
            <button className="mt-6 w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white shadow-md shadow-rose-200">
              ส่งข้อความหา{current.name}
            </button>
            <button
              onClick={handleMatchNext}
              className="mt-3 w-full rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-600"
            >
              ดูคนต่อไป
            </button>
          </div>
        ) : isDone ? (
          /* Done screen */
          <div className="flex flex-col items-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <Heart size={28} className="fill-rose-400 text-rose-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-gray-900">
              ดูครบทุกคนแล้ว!
            </p>
            <p className="mt-1 text-sm text-gray-400">
              ชอบ {liked.length} คน จาก {candidates.length} คน
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white"
            >
              กลับ
            </button>
          </div>
        ) : (
          <MatchCard
            attendee={current}
            onLike={handleLike}
            onPass={handlePass}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

interface EventAttendeesProps {
  onClose?: () => void;
}

export default function EventAttendees({ onClose }: EventAttendeesProps) {
  const router = useRouter();
  const [showMatch, setShowMatch] = useState(false);

  const handleBack = () => {
    if (onClose) onClose();
    else router.back();
  };

  const me = ATTENDEES.find((a) => a.isMe)!;
  const others = ATTENDEES.filter((a) => !a.isMe);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Hero */}
      <div className="relative h-122 w-fit lg:w-full mx-auto ">
        <img
          src={EVENT_DETAIL.image}
          alt={EVENT_DETAIL.title}
          className="h-full w-full object-cover"
        />
        {/* Gradient overlay */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        {/* Joined badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 shadow">
          <Check size={13} className="text-white" />
          <span className="text-xs font-semibold text-white">เข้าร่วมแล้ว</span>
        </div>

        {/* Title on image */}
        <div className="absolute bottom-4 text-white left-4 right-4">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold  backdrop-blur-sm">
            {EVENT_DETAIL.category}
          </span>
          <h1 className="mt-1.5 text-lg font-bold leading-snug  drop-shadow">
            {EVENT_DETAIL.title}
          </h1>
        </div>
      </div>

      {/* Meta info */}
      <div className="bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gray-400" />
            <span>{EVENT_DETAIL.dateRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gray-400" />
            <span>{EVENT_DETAIL.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={15} className="text-gray-400" />
            <span>ผู้เข้าร่วม {ATTENDEES.length} คน</span>
          </div>
        </div>
      </div>

      {/* Match CTA */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => setShowMatch(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 shadow-md shadow-rose-200 transition-transform active:scale-[0.98]"
        >
          <Heart size={18} className="fill-white text-white" />
          <span className="text-sm font-bold text-white">จับคู่กับคนในงาน</span>
          <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-semibold text-white">
            {others.length} คน
          </span>
        </button>
      </div>

      {/* Attendees grid */}
      <div className="mx-4 mt-5">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          ผู้เข้าร่วมกิจกรรม
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {/* Me — always first */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <img
                src={me.avatar}
                alt={me.name}
                className="h-16 w-16 rounded-full border-2 border-rose-400 object-cover"
              />
              {/* "Me" dot */}
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white">
                <Check size={10} className="text-white" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-rose-500">
              {me.name}
            </span>
          </div>

          {/* Others */}
          {others.map((a) => (
            <div key={a.id} className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <img
                  src={a.avatar}
                  alt={a.name}
                  className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover"
                />
              </div>
              <span className="text-[11px] text-gray-600">{a.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-10" />

      {/* Match Modal */}
      {showMatch && (
        <MatchModal
          attendees={ATTENDEES}
          onClose={() => setShowMatch(false)}
        />
      )}
    </div>
  );
}
