/**
 * Every user-facing UI string lives here (no i18n framework yet — when one is
 * needed, this file is the migration source). Exercise content is NOT here;
 * it lives in the Library.
 */
export const copy = {
  appName: "Formcheck",
  tagline: "Lihat form yang benar sebelum angkat.",
  nav: { today: "Hari ini", library: "Library" },
  plan: {
    titleToday: "Plan hari ini",
    titleFor: (label: string) => `Plan ${label}`,
    empty: "Belum ada gerakan di plan ini.",
    emptyCta: "Pilih dari Library",
    addMore: "Tambah gerakan",
    previousDay: "Hari sebelumnya",
    nextDay: "Hari berikutnya",
    backToToday: "Ke hari ini",
    moveUp: "Naikkan",
    moveDown: "Turunkan",
    remove: "Hapus dari plan",
  },
  library: {
    title: "Library",
    subtitleFor: (label: string) => `Menambahkan ke plan ${label}`,
    searchPlaceholder: "Cari gerakan…",
    search: "Cari",
    allMuscles: "Semua otot",
    filterByMuscle: "Filter otot",
    add: "Tambah",
    inPlan: "Sudah di plan",
    noResults: "Tidak ada gerakan yang cocok.",
  },
  exercise: {
    targetMuscles: "Otot target",
    primary: "Utama",
    secondary: "Pendukung",
    cues: "Form yang benar",
    faults: "Kesalahan umum",
    consequence: "Akibatnya",
    video: "Video referensi",
    openVideo: (platform: string) => `Buka video di ${platform}`,
    sources: "Sumber",
    draft: "Draft — belum diverifikasi",
    draftHint: "Panduan ini belum dicek ulang. Cocokkan dengan sumbernya sebelum dipercaya.",
    notDrawable: "tidak tergambar di peta",
  },
  auth: {
    title: "Masuk",
    body: "Aplikasi ini pribadi. Masuk dengan akun Google yang terdaftar.",
    google: "Masuk dengan Google",
    denied: "Akun ini tidak punya akses. Aplikasi ini hanya untuk pemiliknya.",
    signOut: "Keluar",
  },
  loading: "Memuat…",
} as const;
