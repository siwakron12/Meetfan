"use client";

/**
 * EventsPage
 * -----------------------------------------------------------------------
 * หน้าหลัก Events:
 * - Search bar ด้านบน
 * - Section "กิจกรรมที่เข้าร่วมแล้ว" (joined)
 * - Section "กิจกรรมทั้งหมด" (all)
 * - กด card → เปิด EventAttendees (bottom sheet)
 * -----------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import { Search, CalendarDays, Check, Heart, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
// mock avatar urls สำหรับ stack preview
const AVATAR_POOL = [
  "https://i.pravatar.cc/150?img=44",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=48",
  "https://i.pravatar.cc/150?img=15",
  "https://i.pravatar.cc/150?img=49",
  "https://i.pravatar.cc/150?img=57",
];

// ---------------------------------------------------------------------------
// Types & Mock Data
// ---------------------------------------------------------------------------

interface EventItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  attendees: number;
  image: string;
  joined: boolean;
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-001",
    title: "One Piece Pop-up Cafe in Thailand",
    category: "นิทรรศการ / งานศิลปะ",
    location: "ICONSIAM ชั้น 6",
    date: "12 มี.ค. - 31 ต.ค. 2569",
    attendees: 18,
    image: "/ImgEvent/one_piece.jpg",
    joined: true,
  },
 
  {
    id: "evt-003",
    title: "Street Food Night Market",
    category: "อาหาร / ตลาด",
    location: "The Commons ทองหล่อ",
    date: "ทุกเสาร์ - อาทิตย์",
    attendees: 87,
    image: "/ImgEvent/one_piece.jpg",
    joined: false,
  },
  {
    id: "evt-004",
    title: "Startup Pitch Night Bangkok",
    category: "ธุรกิจ / เทคโนโลยี",
    location: "True Digital Park",
    date: "28 มิ.ย. 2569",
    attendees: 56,
    image: "/ImgEvent/one_piece.jpg",
    joined: false,
  },
  {
    id: "evt-005",
    title: "Yoga in the Park Morning Session",
    category: "สุขภาพ / กีฬา",
    location: "สวนจตุจักร",
    date: "ทุกอาทิตย์ 07:00 น.",
    attendees: 34,
    image: "/ImgEvent/one_piece.jpg",
    joined: false,
  },
  {
    id: "evt-006",
    title: "Thai Contemporary Art Exhibition",
    category: "นิทรรศการ / งานศิลปะ",
    location: "BACC ศิลปวัฒนธรรมแห่งกรุงเทพ",
    date: "1 มิ.ย. - 15 ก.ค. 2569",
    attendees: 29,
    image: "/ImgEvent/one_piece.jpg",
    joined: false,
  },
];

interface ApiEvent {
  id: string;
  title: string;
  category: string;
  location: string;
  eventDate: string;
  attendeeCount: number;
  imageUrl: string;
  joined: boolean;
}

function toEventItem(event: ApiEvent): EventItem {
  return {
    id: event.id,
    title: event.title,
    category: event.category,
    location: event.location,
    date: new Date(event.eventDate).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    attendees: event.attendeeCount,
    image: event.imageUrl,
    joined: event.joined,
  };
}

// ---------------------------------------------------------------------------
// EventCard
// ---------------------------------------------------------------------------

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
}

// Avatar stack — แสดงคนในงานเพื่อดึงดูด
function AvatarStack({ count, eventId }: { count: number; eventId: string }) {
  const seed = eventId.charCodeAt(eventId.length - 1) % AVATAR_POOL.length;
  const avatars = [0, 1, 2].map((i) => AVATAR_POOL[(seed + i) % AVATAR_POOL.length]);
  const extra = count - 3;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2">
        {avatars.map((src, i) => (
          <img key={i} src={src} className="h-6 w-6 rounded-full border-2 border-white object-cover" alt="" />
        ))}
        {extra > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100">
            <span className="text-[9px] font-bold text-gray-500">+{extra}</span>
          </div>
        )}
      </div>
      <span className="text-[11px] text-gray-400">{count} คนในงาน</span>
    </div>
  );
}

function EventCard({ event, onClick }: EventCardProps) {
  if (event.joined) {
    // === JOINED: row เหมือน not-joined แต่มีปุ่มจับคู่แทน nudge ===
    return (
      <Link href={`/Event/${event.id}`}
       
        className="flex w-full gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 text-left active:opacity-90"
      >
        {/* Thumbnail */}
        <div className="relative w-28 h-full shrink-0 overflow-hidden rounded-xl">
          <img
            src={event.image}
            alt={event.title}
            className="h-auto w-full "
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 -z-10 bg-rose-100" />
          {/* Joined badge บนรูป */}
          <div className="absolute top-0 right-0 flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5">
            <Check size={8} className="text-white" />
            <span className="text-[9px] font-bold text-white">เข้าร่วม</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <span className="inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
              {event.category}
            </span>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
              {event.title}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
              <CalendarDays size={11} />
              <span className="truncate">{event.date}</span>
            </div>
          </div>

          {/* Avatar stack + ปุ่มจับคู่ */}
          <div className="mt-1.5 flex items-center justify-between">
            <AvatarStack count={event.attendees} eventId={event.id} />
            <div className="flex items-center gap-1 rounded-xl bg-rose-500 px-2.5 py-1.5 shadow-sm shadow-rose-200">
              <Heart size={11} className="fill-white text-white" />
              <span className="text-[11px] font-bold text-white">จับคู่</span>
              <p className="text-[11px] font-bold text-white">{event.attendees}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // === NOT JOINED: compact row + avatar stack + "เข้าร่วมเพื่อแมท" ===
  return (
    <button
      onClick={onClick}
      className="flex w-full gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 text-left active:opacity-90"
    >
      {/* Thumbnail */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 -z-10 bg-rose-100" />
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <span className="inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500">
            {event.category}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {event.title}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
            <CalendarDays size={11} />
            <span className="truncate">{event.date}</span>
          </div>
        </div>

        {/* Avatar stack + nudge */}
        <div className="mt-1.5 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
                {event.attendees} คนในงาน
            </p>
          
          <div className="flex items-center gap-0.5">
            <Sparkles size={11} className="text-rose-400" />
            <span className="text-[11px] font-semibold text-rose-400">เข้าร่วมเพื่อแมท</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

interface EventsPageProps {
  onSelectEvent?: (eventId: string) => void;
}

export default function EventsPage({ onSelectEvent }: EventsPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadEvents() {
      setIsLoading(true);
      const response = await fetch("/api/events", { cache: "no-store" });
      const data = await response.json();

      if (isActive && Array.isArray(data.events)) {
        setEvents(data.events.map(toEventItem));
      }

      if (isActive) {
        setIsLoading(false);
      }
    }

    void loadEvents();

    return () => {
      isActive = false;
    };
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q)
    );
  }, [events, query]);

  const joined = filtered.filter((e) => e.joined);
  const all = filtered.filter((e) => !e.joined);

  const handleSelect = async (id: string) => {
    if (!user) {
      router.push(`/login?eventId=${encodeURIComponent(id)}`);
      return;
    }

    setJoiningEventId(id);
    const response = await fetch(`/api/events/${id}/join`, { method: "POST" });
    setJoiningEventId(null);

    if (!response.ok) {
      if (response.status === 401) {
        router.push(`/login?eventId=${encodeURIComponent(id)}`);
      }
      return;
    }

    onSelectEvent?.(id);
    router.push(`/Event/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top bar */}
      <div className="bg-white px-4 pb-3 pt-4 shadow-sm">
        <h1 className="mb-3 text-xl font-bold text-gray-900">กิจกรรม</h1>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5">
          <Search size={16} className="shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหากิจกรรม..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        {isLoading && (
          <p className="mb-3 text-sm text-gray-400">กำลังโหลดกิจกรรม...</p>
        )}

        {/* Joined section */}
        {joined.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2.5 text-sm font-semibold text-gray-500">
              กิจกรรมที่เข้าร่วมแล้ว ({joined.length})
            </h2>
            <div className="flex flex-col gap-2.5">
              {joined.map((ev) => (
                <EventCard key={ev.id} event={ev} onClick={() => {
                  if (joiningEventId !== ev.id) void handleSelect(ev.id);
                }} />
              ))}
            </div>
          </section>
        )}

        {/* All events section */}
        {all.length > 0 && (
          <section>
            <h2 className="mb-2.5 text-sm font-semibold text-gray-500">
              กิจกรรมใกล้คุณ ({all.length})
            </h2>
            <div className="flex flex-col gap-2.5">
              {all.map((ev) => (
                <EventCard key={ev.id} event={ev} onClick={() => {
                  if (joiningEventId !== ev.id) void handleSelect(ev.id);
                }} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <Search size={36} className="text-gray-200" />
            <p className="mt-3 text-sm text-gray-400">ไม่พบกิจกรรมที่ค้นหา</p>
          </div>
        )}
      </div>

    </div>
  );
}
