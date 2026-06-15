"use client";



import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock Data (ตัวทดลอง)
// ---------------------------------------------------------------------------

interface EventItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  attendees: number;
  image: string;
  lat: number;
  lng: number;
  distance?: string; // เช่น "1.2 km away"
 
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: "evt-001",
    title: "One Piece Pop-up Cafe in Thailand",
    category: "นิทรรศการ / งานศิลปะ / งานฝีมือ",
    location: "ไอคอนสยาม - ICONSIAM",
    date: "วันนี้ - ส. 31 ต.ค. 2569",
    attendees: 18,
    image: "/ImgEvent/one_piece.jpg",
    lat: 13.726694,
    lng: 100.510498,
    distance: "1.2 km",
    
  },
  {
    id: "evt-002",
    title: "One Piece Pop-up Cafe in Thailand",
    category: "นิทรรศการ / งานศิลปะ / งานฝีมือ",
    location: "ไอคอนสยาม - ICONSIAM",
    date: "วันนี้ - ส. 31 ต.ค. 2569",
    attendees: 18,
    image: "/ImgEvent/one_piece.jpg",
    lat: 13.726694,
    lng: 100.510498,
    distance: "1.2 km",
    
  },
  {
    id: "evt-003",
    title: "One Piece Pop-up Cafe in Thailand",
    category: "นิทรรศการ / งานศิลปะ / งานฝีมือ",
    location: "ไอคอนสยาม - ICONSIAM",
    date: "วันนี้ - ส. 31 ต.ค. 2569",
    attendees: 18,
    image: "/ImgEvent/one_piece.jpg",
    lat: 13.726694,
    lng: 100.510498,
    distance: "1.2 km",
    
  },
 
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface NearEventProps {
  onJoinEvent?: (eventId: string) => void;
}

export default function NearEvent({ onJoinEvent }: NearEventProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-[400] flex justify-center px-3">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl bg-white/95 shadow-lg backdrop-blur-sm">
        {/* Header: title + toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="text-sm font-semibold text-gray-900">
            กิจกรรมใกล้คุณ
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-rose-500">
              ดูทั้งหมด
            </span>
            {isOpen ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronUp size={16} className="text-gray-400" />
            )}
          </div>
        </button>

        {/* Card list (collapsible) */}
        {isOpen && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
            {MOCK_EVENTS.map((ev) => (
              <div
                key={ev.id}
                className="flex w-44 p-1 flex-shrink-0 flex-col overflow-hidden rounded-xl border border-gray-100 shadow-sm "
              >
                {/* Image + badge */}
                <div className="relative h-24 w-full">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="h-full w-full object-contain"
                  />
              
                    <span className="absolute left-1 top-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {ev.distance}
                    </span>
               
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1 p-2.5">
                  <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-gray-900">
                    {ev.title}
                  </h3>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500">
                    <Users size={12} className="shrink-0" />
                    <span className="truncate">
                      { `${ev.attendees} people joined`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                  <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => onJoinEvent?.(ev.id)}
                        className="mt-2 w-fit rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-600"
                      >
                      เข้าร่วมกิจกรรม
                    </button>
                  </div>
                   
                </div>
               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
