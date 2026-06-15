"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  MapPin,
  Users,
  X,
  Check,
  Globe,
  
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const EVENT_DETAIL = {
  id: "evt-001",
  title: "One Piece Pop-up Cafe in Thailand",
  category: "นิทรรศการ / งานศิลปะ / งานฝีมือ",
  dateRange: "12 มีนาคม - 31 ตุลาคม 2569",
  location: "Attraction Hall ชั้น 6, ICONSIAM",
  attendees: 18,
  image: "/ImgEvent/one_piece.jpg",
  description:
    "เตรียมตัวให้พร้อมเหล่าเพื่อนพ้อง! เพราะนี่คือครั้งแรกในประเทศไทยกับนิทรรศการเต็มรูปแบบของ ONE PIECE ผลงานระดับตำนานจากปลายปากกาของ อาจารย์ Eiichiro Oda บนพื้นที่กว่า 600 ตารางเมตร ให้กลายเป็นจักรวาลโจรสลัดแบบ 360 องศา พร้อมเปิดให้เข้าชมฟรี! ตั้งแต่ 12 มี.ค. - 31 ต.ค. 69",

};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DetailEventProps {
  /**
   * เรียกเมื่อกดปิด popup (ปุ่ม X หรือคลิก backdrop)
   * ถ้าไม่ส่งมา จะ fallback ไป router.back()
   */
  onClose?: () => void;
  eventId?: string;
}

export default function DetailEvent({ eventId = EVENT_DETAIL.id, onClose }: DetailEventProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [joined, setJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadJoinedState() {
      const response = await fetch(`/api/events/${eventId}`, {
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (isActive && data.event) {
        setJoined(Boolean(data.event.joined));
      }
    }

    void loadJoinedState();

    return () => {
      isActive = false;
    };
  }, [eventId, user]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleConfirmJoin = async () => {
    setIsJoining(true);

    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?eventId=${encodeURIComponent(eventId)}`);
          return;
        }

        throw new Error("Could not join event");
      }

      setJoined(true);
      setShowConfirm(false);
      onClose?.();
      router.push(`/Event/${eventId}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinClick = () => {
    if (!user) {
      router.push(`/login?eventId=${encodeURIComponent(eventId)}`);
      return;
    }

    setShowConfirm(true);
  };

  return (
    // Backdrop เต็มจอ - คลิกพื้นหลังเพื่อปิด (จาง ๆ ให้เห็นแผนที่ด้านบน)
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/25 sm:items-center sm:p-4"
      onClick={handleClose}
    >
      {/* กล่อง popup แบบ bottom sheet - คลิกข้างในไม่ปิด */}
      <div
        className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* เนื้อหา scroll ได้ */}
        <div className="overflow-y-auto">
          {/* Hero image */}
          <div className="relative  w-full ">
            <img
              src={EVENT_DETAIL.image}
              alt={EVENT_DETAIL.title}
              className="h-auto w-full "
            />
            {/* ปุ่มปิด */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="ปิด"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md"
            >
              <X size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 pt-4">
            {/* Category badge */}
        <div className="flex items-center gap-2 justify-between">
           <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs text-rose-600">
              {EVENT_DETAIL.category}
            </span>
        <Link target="_blank" href={`https://www.google.com/`}
          className="text-xs flex items-center gap-1 font-medium text-blue-500 hover:text-blue-600"
        >
            <Globe size={16} />
          แหล่งที่มา
        </Link>
        </div>
         

            {/* Title */}
            <h1 className="mt-2 text-xl font-bold leading-snug text-gray-900">
              {EVENT_DETAIL.title}
            </h1>

            {/* Meta info */}
            <div className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CalendarDays
                  size={16}
                  className="mt-0.5 shrink-0 text-gray-400"
                />
                <span>{EVENT_DETAIL.dateRange}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span>{EVENT_DETAIL.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <Users size={16} className="mt-0.5 shrink-0 text-gray-400" />
                <span>ผู้เข้าร่วมแล้ว {EVENT_DETAIL.attendees} คน</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-sm leading-relaxed text-gray-700">
              {EVENT_DETAIL.description}
            </p>

            {/* Highlights */}
         

        
          </div>
        </div>

        {/* Sticky bottom bar - ติดล่างของกล่อง popup (ไม่ใช่ของจอ) */}
        <div className="border-t border-gray-100 bg-white px-5 py-3">
          {joined ? (
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-50 py-3 text-sm font-semibold text-emerald-600"
            >
              <Check size={16} />
              เข้าร่วมแล้ว
            </button>
          ) : (
            <button
              type="button"
              onClick={handleJoinClick}
              className="w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white shadow-md"
            >
              เข้าร่วม Event
            </button>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-6"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-gray-900">
                ยืนยันการเข้าร่วม
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-3 flex gap-3">
              <img
                src={EVENT_DETAIL.image}
                alt={EVENT_DETAIL.title}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold leading-snug text-gray-900">
                  {EVENT_DETAIL.title}
                </p>
                <p className="text-xs text-gray-500">
                  {EVENT_DETAIL.dateRange}
                </p>
                <p className="text-xs text-gray-500">
                  {EVENT_DETAIL.location}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              เมื่อกดยืนยัน คุณจะเข้าร่วม event นี้
              และสามารถดูผู้เข้าร่วมคนอื่นเพื่อจับคู่ได้
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-600"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmJoin}
                disabled={isJoining}
                className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-semibold text-white"
              >
                {isJoining ? "กำลังเข้าร่วม..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
