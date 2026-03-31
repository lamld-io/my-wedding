// ============================================================
// Wedding Constants - Duy Lam & Thanh Thoảng
// ============================================================

export const WEDDING = {
  groom: {
    name: "Duy Lam",
    fullName: "Lê Duy Lam",
    role: "Chú Rể",
  },
  bride: {
    name: "Thanh Thoảng",
    fullName: "Nguyễn Thanh Thoảng",
    role: "Cô Dâu",
  },
  date: "2026-04-11T13:00:00+07:00",
  displayDate: "11 . 04 . 2026",
  displayDateFull: "Thứ Bảy, ngày 11 tháng 04 năm 2026",
  time: {
    reception: "13:00",
    ceremony: "13:00 - 17:00",
    receptionLabel: "Đón khách",
    ceremonyLabel: "Khai tiệc",
  },
  venue: {
    name: "Tư Gia",
    address: "Ấp Tân An Chợ, Xã Tân An, Tỉnh Vĩnh Long",
    coordinates: {
      lat: 9.906344,
      lng: 106.152384,
    },
    googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=9.906344,106.152384`,
  },
  quote: "Hạnh phúc là khi được nắm tay nhau đi qua mọi mùa trong đời...",
} as const;

// ============================================================
// Photo Gallery - 37 ảnh chia theo nhóm concept
// ============================================================

export interface WeddingPhoto {
  src: string;
  alt: string;
  group: "hero" | "outdoor" | "studio" | "artistic" | "portrait";
  featured?: boolean;
  orientation: "portrait" | "landscape";
}

export const GALLERY_PHOTOS: WeddingPhoto[] = [
  // === Hero Shots (Featured - hiển thị lớn) ===
  {
    src: "/images/494A1302.jpg",
    alt: "",
    group: "hero",
    featured: true,
    orientation: "portrait",
  },
  {
    src: "/images/494A1134.jpg",
    alt: "",
    group: "hero",
    featured: true,
    orientation: "portrait",
  },
  {
    src: "/images/494A1468.jpg",
    alt: "",
    group: "hero",
    featured: true,
    orientation: "portrait",
  },

  // === Outdoor Garden ===
  {
    src: "/images/494A1150.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1152.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1155.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1160.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1208.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1213.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1240.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1277.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1309.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1315.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1322.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },
  {
    src: "/images/494A1341.jpg",
    alt: "",
    group: "outdoor",
    orientation: "portrait",
  },

  // === Studio White ===
  {
    src: "/images/494A1368.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1385.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1395.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1429.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1434.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1455.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1457.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1458.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1470.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },
  {
    src: "/images/494A1478.jpg",
    alt: "",
    group: "studio",
    orientation: "portrait",
  },

  // === Artistic / Close-up ===
  {
    src: "/images/494A1547.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },
  {
    src: "/images/494A1561.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },
  {
    src: "/images/494A1564.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },
  {
    src: "/images/494A1590.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },
  {
    src: "/images/494A1595.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },
  {
    src: "/images/494A1637.jpg",
    alt: "",
    group: "artistic",
    orientation: "portrait",
  },

  // === Solo Portraits ===
  {
    src: "/images/494A1642.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
  {
    src: "/images/494A1682.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
  {
    src: "/images/494A1721.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
  {
    src: "/images/494A1769.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
  {
    src: "/images/494A1773.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
  {
    src: "/images/494A1822.jpg",
    alt: "",
    group: "portrait",
    orientation: "portrait",
  },
];

// Ảnh cho từng section cụ thể
export const SECTION_IMAGES = {
  splash: "/images/494A1302.jpg",
  hero: "/images/494A1134.jpg",
  bride: "/images/494A1822.jpg",
  groom: "/images/494A1240.jpg",
  coupleLeft: "/images/494A1468.jpg",
  coupleRight: "/images/494A1470.jpg",
  countdown: "/images/494A1315.jpg",
  eventBg: "/images/494A1240.jpg",
  footer: "/images/494A1277.jpg",
} as const;
