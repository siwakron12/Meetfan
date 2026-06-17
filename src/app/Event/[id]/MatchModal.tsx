// components/MatchModal.tsx
import { useState } from "react";
import MatchCard from "./Matchcard";
import { Heart, Sparkles, X } from "lucide-react";

type MatchAttendee = {
  id: string;
  name: string;
  occupation?: string | null;
  district?: string | null;
  joinedAt?: string;
  avatar?: string;
  isMe?: boolean;
};

export default function MatchModal({
  attendees,
  onClose,
}: {
  attendees: MatchAttendee[];
  onClose: () => void;
}) {

  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);

  const candidates = attendees.filter((attendee) => !attendee.isMe);
  const current = candidates[index];
  const isDone = index >=  candidates.length;
    
  const handleLike = () => {
    setLiked((prev) => [...prev, current.id]);
    // simulate mutual match randomly
    if (Math.random() > 0.6) {
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
      className="fixed inset-0 z-1200 flex items-center justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-3xl"
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
                  attendees.find((a) => a.isMe)?.avatar ||
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
              <span className="text-lg font-bold text-rose-500">
                It&apos;s a Match!
              </span>
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
