
// MOCK FIREBASE LAYER - USES LOCALSTORAGE INSTEAD OF EXTERNAL DB
const STORAGE_PREFIX = "ian_art_";

const getStorageItem = (key: string, defaultValue: any) => {
  const item = localStorage.getItem(STORAGE_PREFIX + key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = (key: string, value: any) => {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
};

// Clear outdated artworks from localStorage to ensure 100% accurate 10-piece synchronization
try {
  const vTag = localStorage.getItem("ian_art_v_tag");
  if (vTag !== "2026_v4_correct_order") {
    localStorage.removeItem("ian_art_artworks");
    localStorage.setItem("ian_art_v_tag", "2026_v4_correct_order");
  }
} catch (e) {
  console.warn("Storage migration skipped", e);
}

// Initial Artworks in exact 100% matching order with 3D gallery exhibit walls
export const INITIAL_ARTWORKS = [
  {
    id: "art-1",
    title: "Pop Art Visions (Yellow Shades)",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/78abe36e-a129-4a65-8d65-14c846260ad1.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "A striking pop-art portrait featuring vibrant yellow statement sunglasses and bold crimson lips, sculpted from hundreds of dimensional hand-finished wooden block pixels.",
    order: 0
  },
  {
    id: "art-2",
    title: "Archbishop Desmond Tutu",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image Jun 6, 2026, 07_08_21 PM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "A revered commemorative portrait of Archbishop Desmond Tutu (and iconic South African cultural figures), masterfully composed with textured monochrome wooden blocks capturing warmth, historic spirit, and peace legacy.",
    order: 1
  },
  {
    id: "art-3",
    title: "Nelson Mandela Tribute",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image Jun 6, 2026, 07_13_31 PM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "An iconic commemorative portrait of Nelson Mandela, sculpted with layered tonal wood tiles that bring his radiant leadership and resilience into architectural focus.",
    order: 2
  },
  {
    id: "art-4",
    title: "Marilyn Monroe in Wood",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image Jun 6, 2026, 07_16_25 PM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "An evocative pop tribute to Marilyn Monroe, capturing her timeless glamour through thousands of contrasting dark and ivory timber block cuts with an iconic crimson focal accent.",
    order: 3
  },
  {
    id: "art-5",
    title: "Sacred Crown of Thorns",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image Jun 6, 2026, 07_38_16 PM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "A deeply moving spiritual portrait depicting Christ adorned with the Crown of Thorns, crafted from intricate dimensional wooden grain blocks evoking reverence and sacrifice.",
    order: 4
  },
  {
    id: "art-6",
    title: "The Majestic Pride (African Lion)",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image May 27, 2026, 01_18_17 AM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "A commanding wildlife portrait celebrating the sovereign African Lion, carved with layered textures and sunlit amber hues embodying untamed strength.",
    order: 5
  },
  {
    id: "art-7",
    title: "Serengeti Monarch (Elephant)",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ChatGPT Image May 27, 2026, 12_00_04 AM.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "A majestic fine art study of the African elephant, balancing monumental presence with delicate natural grain contours in handcrafted relief.",
    order: 6
  },
  {
    id: "art-8",
    title: "Aura & Geometric Silhouette",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/art/ba58f07a-ea1b-4911-ba96-0caf7dd2729d.png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "An avant-garde exploration of silhouette, light refraction, and geometric harmony, balancing negative space with textured timber relief.",
    order: 7
  },
  {
    id: "art-9",
    title: "Discover The Journey - North Gallery",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/d00ca55d-63ac-4ab4-ad3b-fcf3f900a7f6 (2).png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "The monumental North Gallery centerpiece spanning 6 meters, celebrating Ian Art's signature architectural wood block craft and human expression.",
    order: 8
  },
  {
    id: "art-10",
    title: "Discover The Journey - South Gallery",
    year: "2026",
    artist: "Ian Art",
    image: "/artwork/d00ca55d-63ac-4ab4-ad3b-fcf3f900a7f6 (1).png",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "The grand South Gallery centerpiece, complementing the architectural axis with panoramic textural depth and contemporary South African artistry.",
    order: 9
  }
];

// Mock Auth
export const auth = {
  currentUser: getStorageItem("user", null),
  onAuthStateChanged: (callback: (user: any) => void) => {
    const user = getStorageItem("user", null);
    callback(user);
    window.addEventListener("storage", () => {
      callback(getStorageItem("user", null));
    });
    return () => {};
  }
};

export const loginWithEmail = async (email: string, pass: string) => {
  if ((email === "admin@gallery.com" || email === "admin") && pass === "IanArt2026!") {
    const user = { email: "admin@gallery.com", uid: "admin-1" };
    setStorageItem("user", user);
    window.dispatchEvent(new Event("storage"));
    return user;
  }
  throw { code: "auth/invalid-credential", message: "Invalid credentials" };
};

export const signInWithGoogle = async () => {
  const user = { email: "curator@ianart.co.za", uid: "curator-1", displayName: "Gallery Curator" };
  setStorageItem("user", user);
  window.dispatchEvent(new Event("storage"));
  return user;
};

export const logout = async () => {
  localStorage.removeItem(STORAGE_PREFIX + "user");
  window.dispatchEvent(new Event("storage"));
};

// Mock Firestore
export const db = {};

export const collection = (db: any, path: string) => path;

export const query = (path: string, ...args: any[]) => path;

export const orderBy = (...args: any[]) => ({ type: "orderBy", args });

export const onSnapshot = (path: string, callback: (snapshot: any) => void) => {
  const sync = () => {
    const data = getStorageItem(path, path === "artworks" ? INITIAL_ARTWORKS : []);
    callback({
      docs: data.map((item: any) => ({
        id: item.id,
        data: () => item
      }))
    });
  };

  sync();
  window.addEventListener("storage", sync);
  return () => window.removeEventListener("storage", sync);
};

export const addDoc = async (path: string, data: any) => {
  const current = getStorageItem(path, []);
  const newItem = { id: Date.now().toString(), ...data, createdAt: new Date() };
  setStorageItem(path, [...current, newItem]);
  window.dispatchEvent(new Event("storage"));
  return newItem;
};

export const updateDoc = async (docRef: { path: string; id: string }, data: any) => {
  const current = getStorageItem(docRef.path, []);
  const updated = current.map((item: any) => item.id === docRef.id ? { ...item, ...data } : item);
  setStorageItem(docRef.path, updated);
  window.dispatchEvent(new Event("storage"));
};

export const deleteDoc = async (docRef: { path: string; id: string }) => {
  const current = getStorageItem(docRef.path, []);
  const filtered = current.filter((item: any) => item.id !== docRef.id);
  setStorageItem(docRef.path, filtered);
  window.dispatchEvent(new Event("storage"));
};

export const doc = (db: any, path: string, id: string) => ({ path, id });

export const serverTimestamp = () => new Date();
