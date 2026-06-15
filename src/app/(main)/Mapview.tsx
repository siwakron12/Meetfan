"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import BottomNav from "../../components/Bottomnav";
import TopSearchBar from "./TopSearchBar";
import TopBar from "../../components/TopBar";
import NearEvent from "./NearEvent";
import DetailEvent from "./DetailEvent";
import { useAuth } from "@/components/AuthProvider";
// ---------------------------------------------------------------------------
// Mock Data
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


  },
];

// สร้าง marker เป็นรูปวงกลมแสดงภาพ preview ของ event แต่ละอัน
// opacity: 0.98 ทำให้ดูเกือบเต็ม ปรับค่าได้ตามชอบ
function createEventIcon(ev: EventItem) {
  return L.divIcon({
    className: "event-photo-marker",
    html: `
      <div style="
        width: 55px;
        height: 55px;
        border-radius: 50%;
        overflow: hidden;
        border: 4px solid #f43f5e;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        opacity: 0.98;
      ">
        <img src="${ev.image}" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid #f43f5e;
        margin: -1px auto 0;
        filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));
      "></div>
    `,
    iconSize: [55, 65],
    iconAnchor: [27.5, 65],
    popupAnchor: [0, -65],
  });
}

// ไอคอนจุดสีฟ้าสำหรับแสดงตำแหน่งของผู้ใช้ (คล้าย Google Maps)
const userIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #3B82F6;
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.25), 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ---------------------------------------------------------------------------
// Helper: เลื่อนแผนที่ไปยังตำแหน่งที่กำหนด เมื่อ position เปลี่ยน
// ---------------------------------------------------------------------------

function FlyToUserLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

const BANGKOK_CENTER: [number, number] = [13.7563, 100.5018];

export default function EventMapPage() {
  const router = useRouter();
  const { user } = useAuth();
  // ตำแหน่งผู้ใช้ (lat, lng) - เริ่มต้นเป็น null จนกว่าจะขออนุญาตและได้ค่า
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // ผู้ใช้ปฏิเสธ หรือหาตำแหน่งไม่ได้ -> ใช้ค่า default (กรุงเทพฯ) ต่อไป
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleJoinEvent = (eventId: string) => {
    if (!user) {
      router.push(`/login?eventId=${encodeURIComponent(eventId)}`);
      return;
    }

    setSelectedEventId(eventId);
  };

  return (
    // flex column เต็มจอ: แถบบน (fixed-height) / แผนที่ (เติมพื้นที่ที่เหลือ) / แถบล่าง (fixed-height)
    // วิธีนี้ทำให้ MapContainer ไม่ทับ TopBar/TopSearchBar/BottomNav อีกต่อไป
    // ดังนั้น popup ที่เปิดจาก marker จะถูก auto-pan อยู่ภายในพื้นที่แผนที่เท่านั้น
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* แถบบน: ไม่ลอยทับแล้ว เป็นส่วนหนึ่งของ layout ปกติ */}
      <div className="flex-shrink-0">
        <TopBar />

      </div>
      <TopSearchBar />
      {/* แผนที่กินพื้นที่ที่เหลือพอดี */}
      <div className="relative flex-1  ">
        <MapContainer
          center={BANGKOK_CENTER}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
            attribution=''
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* เลื่อนแผนที่ไปตำแหน่งผู้ใช้ทันทีที่ได้ค่ามา */}
          <FlyToUserLocation position={userPosition} />

          {/* จุดสีฟ้าแสดงตำแหน่งปัจจุบันของผู้ใช้ */}
          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>คุณอยู่ที่นี่</Popup>
            </Marker>
          )}

          {MOCK_EVENTS.map((ev) => (
            <Marker key={ev.id} position={[ev.lat, ev.lng]} icon={createEventIcon(ev)}>
              <Popup maxWidth={180}
                 autoPan={true} autoPanPadding={[0, 120]}>
                {/* Preview card เล็กๆ ของ event */}
                <div className="   ">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="h-auto w-full object-cover"
                  />
                  <div className="p-2.5">
                    <span className=" rounded-full bg-rose-100 px-1 py-0.5 text-[10px]  text-rose-600">
                      {ev.category}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold leading-snug text-gray-900">
                      {ev.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {ev.location}
                    </p>
                    <p className="text-xs text-gray-500">{ev.date}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      ผู้เข้าร่วม {ev.attendees} คน
                    </p>
                    <button
                      onClick={() => handleJoinEvent(ev.id)}
                      className="mt-2 w-full rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-600">
                      เข้าร่วมกิจกรรม
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Panel ลอย: Popular Near You */}
        <NearEvent onJoinEvent={handleJoinEvent} />
      </div>

      {/* แถบล่าง */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {selectedEventId != null && (

        <DetailEvent eventId={selectedEventId} onClose={() => setSelectedEventId(null)} />

      )}
    </div>
  );
}
