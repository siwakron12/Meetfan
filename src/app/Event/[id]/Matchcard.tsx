// components/MatchCard.tsx
import { useRef, useState } from "react";
import { Heart, X } from "lucide-react";

type MatchAttendee = {
  id: string;
  name: string;
  occupation?: string | null;
  district?: string | null;
  interests?: string[];
  goals?: string[];
  matchScore?: number;
  matchReasons?: string[];
  matchBreakdown?: {
    interests: number;
    goals: number;
    occupation: number;
  };
  joinedAt?: string;
  avatar?: string;
};

const SWIPE_THRESHOLD = 100; // ลากเกินกี่ px ถึงถือว่า swipe สำเร็จ
const FLY_OUT_DISTANCE = 500; // ระยะที่การ์ดบินออกจอตอนปล่อย/ตัดสินผล

export default function MatchCard({
  attendee,
  onLike,
  onPass,
}: {
  attendee: MatchAttendee;
  onLike: () => void;
  onPass: () => void;
}) {
  // ตำแหน่งลากปัจจุบัน (x, y) และสถานะกำลังลากอยู่ไหม
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  // ทิศที่ตัดสินใจแล้ว ใช้เล่น animation บินออกจอก่อนเรียก callback จริง
  const [exiting, setExiting] = useState<"like" | "pass" | null>(null);

  const startPos = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const getPoint = (e: React.PointerEvent) => ({ x: e.clientX, y: e.clientY });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (exiting) return; // กันลากซ้ำตอนกำลังเล่น exit animation
    setIsDragging(true);
    startPos.current = getPoint(e);
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || exiting) return;
    const point = getPoint(e);
    setDrag({
      x: point.x - startPos.current.x,
      y: point.y - startPos.current.y,
    });
  };

  const finishSwipe = (direction: "like" | "pass") => {
    setExiting(direction);
    // เล่น animation บินออกจอก่อน แล้วค่อยเรียก callback จริงตอนจบ transition
    const flyX = direction === "like" ? FLY_OUT_DISTANCE : -FLY_OUT_DISTANCE;
    setDrag({ x: flyX, y: drag.y });
  };

  const handlePointerUp = () => {
    if (!isDragging || exiting) return;
    setIsDragging(false);

    if (drag.x > SWIPE_THRESHOLD) {
      finishSwipe("like");
    } else if (drag.x < -SWIPE_THRESHOLD) {
      finishSwipe("pass");
    } else {
      // ลากไม่พอ ดีดกลับตำแหน่งเดิม
      setDrag({ x: 0, y: 0 });
    }
  };

  const handleTransitionEnd = () => {
    if (exiting === "like") onLike();
    if (exiting === "pass") onPass();
  };

  // ปุ่มกด: เล่น animation บินออกฝั่งเดียวกับปุ่มที่กด เพื่อความรู้สึกต่อเนื่องกับ swipe
  const handleButtonLike = () => finishSwipe("like");
  const handleButtonPass = () => finishSwipe("pass");

  const rotation = drag.x / 12; // ยิ่งลากไกล ยิ่งเอียงมาก
  const opacity = exiting ? 0 : 1;
  const likeOpacity = Math.min(Math.max(drag.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-drag.x / SWIPE_THRESHOLD, 0), 1);

  return (
    <div className="flex flex-col items-center">
      {/* การ์ดที่ลากได้ */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTransitionEnd={handleTransitionEnd}
        className="relative cursor-grab touch-none select-none active:cursor-grabbing"
        style={{
          transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`,
          opacity,
          transition: isDragging
            ? "none"
            : "transform 0.35s ease, opacity 0.35s ease",
        }}
      >
        <img
          src={attendee.avatar || "https://i.pravatar.cc/150?img=47"}
          alt={attendee.name}
          className="size-64 rounded-lg border-4 object-cover"
          draggable={false}
        />

        {/* ป้าย LIKE - โผล่ตอนลากไปทางขวา */}
        <div
          className="absolute -right-1 top-2 rotate-[-12deg] rounded-lg border-3 border-emerald-500 px-2.5 py-1 text-sm font-extrabold tracking-wide text-emerald-500"
          style={{ opacity: likeOpacity }}
        >
          LIKE
        </div>

        {/* ป้าย NOPE - โผล่ตอนลากไปทางซ้าย */}
        <div
          className="absolute -left-2 top-2 rotate-[12deg] rounded-lg border-3 border-rose-500 px-2.5 py-1 text-sm font-extrabold tracking-wide text-rose-500"
          style={{ opacity: nopeOpacity }}
        >
          NOPE
        </div>
      </div>

      <h2 className="mt-4 text-lg font-bold text-gray-900">{attendee.name}</h2>
      {attendee.occupation && (
        <p className="mt-1 text-sm font-medium text-gray-500">
          {attendee.occupation}
        </p>
      )}

      <div className="mt-3 w-full rounded-2xl border border-rose-100 bg-rose-50 p-4 text-left">
        <p className="text-center text-2xl font-extrabold text-rose-500">
          {attendee.matchScore ?? 0}% Match
        </p>
        {attendee.matchBreakdown && (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">
                Interest
              </p>
              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {attendee.matchBreakdown.interests}%
              </p>
            </div>
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">
                Goal
              </p>
              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {attendee.matchBreakdown.goals}%
              </p>
            </div>
            <div className="rounded-xl bg-white px-2 py-2">
              <p className="text-[10px] font-bold uppercase text-gray-400">
                Occupation
              </p>
              <p className="mt-1 text-sm font-extrabold text-gray-800">
                {attendee.matchBreakdown.occupation}%
              </p>
            </div>
          </div>
        )}
        {attendee.matchReasons && attendee.matchReasons.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Why We Match
            </p>
            <ul className="mt-2 space-y-1.5">
              {attendee.matchReasons.slice(0, 5).map((reason) => (
                <li
                  key={reason}
                  className="flex gap-2 text-sm font-medium leading-snug text-gray-700"
                >
                  <span className="text-emerald-500">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-1 text-xs text-gray-400">ลากการ์ดซ้าย/ขวา หรือกดปุ่มด้านล่าง</p>

      {/* Buttons - ยังกดได้เหมือนเดิม เป็นทางเลือกเสริมจาก swipe */}
      <div className="mt-6 flex gap-6">
        <button
          onClick={handleButtonPass}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md transition-transform active:scale-95"
          aria-label="ผ่าน"
        >
          <X size={28} className="text-gray-400" />
        </button>
        <button
          onClick={handleButtonLike}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-md shadow-rose-200 transition-transform active:scale-95"
          aria-label="ชอบ"
        >
          <Heart size={28} className="fill-white text-white" />
        </button>
      </div>
    </div>
  );
}
