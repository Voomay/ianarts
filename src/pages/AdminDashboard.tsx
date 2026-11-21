import React, { useState, useEffect, useRef } from "react";
import { auth, logout, signInWithGoogle, db, collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, INITIAL_ARTWORKS } from "../lib/firebase";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Send, 
  Sparkles, 
  LayoutGrid, 
  MessageSquare, 
  BarChart3, 
  ChevronRight, 
  ExternalLink, 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  Save, 
  Check, 
  Type, 
  Upload, 
  ArrowLeft,
  RefreshCw,
  Eye,
  Sliders
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AVAILABLE_AUDIO_TRACKS } from "../components/GalleryControls";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [artworks, setArtworks] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'artworks' | 'inquiries' | 'wall-heading' | 'stats'>('artworks');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  
  // Custom Wall Inscription Text
  const [wallHeading, setWallHeading] = useState<string>(() => {
    return localStorage.getItem('ian_art_custom_heading') || "ITS ABOUT TIME";
  });
  const [headingSaved, setHeadingSaved] = useState(false);

  // New Artwork Form
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    artist: "Ian Art",
    year: "2026",
    image: "",
    audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
    description: "",
    wallText: "",
    price: 18500,
    width: 2.2,
    height: 2.2,
    order: 10
  });

  const [loading, setLoading] = useState(true);
  const [previewAudioId, setPreviewAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePreviewAudio = (audioUrl: string, id: string) => {
    if (previewAudioId === id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPreviewAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audio.volume = 0.85;
      audio.play().then(() => {
        setPreviewAudioId(id);
      }).catch(console.error);
      audio.onended = () => {
        setPreviewAudioId(null);
      };
      audioRef.current = audio;
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Load from Firestore or Fallback to INITIAL_ARTWORKS
    try {
      const qArt = query(collection(db, "artworks"), orderBy("order", "asc"));
      const unsubArt = onSnapshot(qArt, (snapshot) => {
        if (snapshot.docs && snapshot.docs.length > 0) {
          const list = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }));
          setArtworks(list);
          localStorage.setItem('ian_art_virtual_gallery_artworks', JSON.stringify(list));
        } else {
          setArtworks(INITIAL_ARTWORKS);
        }
      });

      const qInq = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const unsubInq = onSnapshot(qInq, (snapshot) => {
        if (snapshot.docs) {
          setInquiries(snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })));
        }
      });

      return () => {
        unsubArt();
        unsubInq();
      };
    } catch {
      setArtworks(INITIAL_ARTWORKS);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setGuestMode(false);
  };

  const handleStartEdit = (art: any) => {
    setEditingId(art.id);
    setEditForm({
      title: art.title || "",
      artist: art.artist || "Ian Art",
      year: art.year || "2026",
      image: art.customImageUrl || art.image || "",
      audio: art.audio || "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
      description: art.description || "",
      wallText: art.wallText || "",
      price: art.price || 18500,
      width: art.width || 2.2,
      height: art.height || 2.2,
      order: art.order ?? 0
    });
  };

  const handleSaveEdit = async (artId: string) => {
    try {
      const updatedList = artworks.map(a => {
        if (a.id === artId) {
          return {
            ...a,
            ...editForm,
            customImageUrl: editForm.image,
            image: editForm.image,
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      });

      setArtworks(updatedList);
      localStorage.setItem('ian_art_virtual_gallery_artworks', JSON.stringify(updatedList));

      // Save overrides cache
      const cachedOverrides = JSON.parse(localStorage.getItem('ian_art_virtual_gallery_art_overrides') || '{}');
      cachedOverrides[artId] = {
        ...editForm,
        customImageUrl: editForm.image,
        image: editForm.image,
      };
      localStorage.setItem('ian_art_virtual_gallery_art_overrides', JSON.stringify(cachedOverrides));

      // Try updating in Firestore
      try {
        await updateDoc(doc(db, "artworks", artId), {
          ...editForm,
          customImageUrl: editForm.image,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Firestore update skipped, local saved successfully:", err);
      }

      setSavedSuccessId(artId);
      setTimeout(() => setSavedSuccessId(null), 3000);
      setEditingId(null);
    } catch (err) {
      console.error("Error updating artwork:", err);
    }
  };

  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newId = `art-custom-${Date.now()}`;
      const entry = {
        ...newArtwork,
        id: newId,
        customImageUrl: newArtwork.image,
        order: artworks.length,
        updatedAt: new Date().toISOString()
      };

      const updatedList = [...artworks, entry];
      setArtworks(updatedList);
      localStorage.setItem('ian_art_virtual_gallery_artworks', JSON.stringify(updatedList));

      try {
        await addDoc(collection(db, "artworks"), {
          ...entry,
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Firestore add skipped, local saved:", err);
      }

      setNewArtwork({
        title: "",
        artist: "Ian Art",
        year: "2026",
        image: "",
        audio: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg",
        description: "",
        wallText: "",
        price: 18500,
        width: 2.2,
        height: 2.2,
        order: updatedList.length
      });

      alert("Artwork added and deployed to Virtual Gallery!");
    } catch (err) {
      console.error("Error adding artwork:", err);
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this artwork slot?")) {
      try {
        const updatedList = artworks.filter(a => a.id !== id);
        setArtworks(updatedList);
        localStorage.setItem('ian_art_virtual_gallery_artworks', JSON.stringify(updatedList));

        try {
          await deleteDoc(doc(db, "artworks", id));
        } catch {}
      } catch (err) {
        console.error("Error deleting artwork:", err);
      }
    }
  };

  const handleSaveWallHeading = () => {
    localStorage.setItem('ian_art_custom_heading', wallHeading);
    setHeadingSaved(true);
    setTimeout(() => setHeadingSaved(false), 3000);
  };

  const handleResetToFactoryOrder = () => {
    if (window.confirm("Reset all 10 gallery artworks to the default fine art collection?")) {
      localStorage.removeItem('ian_art_virtual_gallery_art_overrides');
      localStorage.setItem('ian_art_virtual_gallery_artworks', JSON.stringify(INITIAL_ARTWORKS));
      setArtworks(INITIAL_ARTWORKS);
      alert("Gallery reset to original master collection!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono tracking-widest uppercase text-xs animate-pulse">
        Initializing Curator Node...
      </div>
    );
  }

  // Allow access if logged in or clicked Guest Curator Sandbox
  const isAuthorized = user !== null || guestMode;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="max-w-md w-full bg-[#0a0a0c] border border-white/10 p-8 rounded-2xl shadow-2xl text-center space-y-6 relative z-10">
          <div className="w-12 h-12 bg-white text-black font-black flex items-center justify-center rounded-xl mx-auto text-xl italic font-display">
            IAN
          </div>
          <div>
            <h1 className="text-2xl font-display font-black uppercase tracking-tight">Curator Backend</h1>
            <p className="text-xs text-zinc-400 mt-2 font-light">
              Manage the 3D Virtual Gallery, edit 150-word narratives, upload images, configure audio soundtracks, and customize wall inscriptions.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => signInWithGoogle().catch(console.error)}
              className="w-full py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              Sign In with Google
            </button>
            <button
              onClick={() => setGuestMode(true)}
              className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders size={14} /> Enter as Curator Sandbox
            </button>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between text-[11px] text-zinc-500 font-mono">
            <Link to="/" className="hover:text-white transition-colors">← Back to Site</Link>
            <Link to="/virtual-gallery" className="hover:text-white transition-colors">Live 3D Gallery →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black font-sans">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 md:w-64 bg-black border-r border-white/10 flex flex-col z-50">
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-black font-display italic text-sm rounded">
              IAN
            </div>
            <span className="hidden md:block font-display font-black tracking-tighter text-lg uppercase italic">
              CURATOR
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-2 mt-4">
          {[
            { id: 'artworks', label: '3D Gallery Exhibits', icon: LayoutGrid },
            { id: 'wall-heading', label: 'Wall Inscription', icon: Type },
            { id: 'inquiries', label: 'Collector Inquiries', icon: MessageSquare },
            { id: 'stats', label: 'Analytics & Signals', icon: BarChart3 },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-lg transition-all group cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-white text-black font-bold' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="hidden md:block text-[11px] uppercase tracking-wider font-semibold truncate">
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div layoutId="nav-dot" className="hidden md:block ml-auto w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/virtual-gallery"
            className="w-full flex items-center gap-2.5 p-2.5 bg-white/10 hover:bg-white hover:text-black rounded text-[10px] font-mono uppercase tracking-widest text-white transition-all justify-center"
          >
            <Eye size={14} />
            <span className="hidden md:inline">View Live 3D</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 p-2.5 text-zinc-500 hover:text-red-400 transition-colors text-[10px] font-mono uppercase tracking-widest justify-center cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20 md:pl-64 min-h-screen pb-20">
        <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
          
          {/* Header Bar */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-mono">
                {user ? `Authenticated as ${user.email || 'Curator'}` : 'Guest Curator Sandbox Mode'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight uppercase">
                {activeTab === 'artworks' && '3D Gallery Exhibits & Narratives'}
                {activeTab === 'wall-heading' && 'Room Heading & Wall Inscription'}
                {activeTab === 'inquiries' && 'Collector Purchase Signals'}
                {activeTab === 'stats' && 'Gallery Intelligence & Stats'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/virtual-gallery" 
                className="px-4 py-2 bg-white text-black font-extrabold text-[10px] uppercase tracking-widest rounded flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg"
              >
                <Sparkles size={12} /> Live 3D Gallery
              </Link>
              <Link 
                to="/" 
                className="px-3.5 py-2 border border-white/15 hover:border-white text-[10px] uppercase tracking-widest font-mono text-zinc-300 hover:text-white rounded transition-all"
              >
                Website
              </Link>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {/* TAB 1: 3D GALLERY ARTWORKS (THE 10 SLOTS + CUSTOM PIECES) */}
            {activeTab === 'artworks' && (
              <motion.div 
                key="artworks"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-10"
              >
                {/* Control Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 border border-white/10 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-300">Total Exhibition Slots: <strong>{artworks.length}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleResetToFactoryOrder}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white rounded text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Restore the master initial 10 artwork metadata"
                    >
                      <RefreshCw size={12} /> Reset to Defaults
                    </button>
                  </div>
                </div>

                {/* Artwork Slots List */}
                <div className="space-y-6">
                  {artworks.map((art, idx) => {
                    const isEditing = editingId === art.id;
                    const isSaved = savedSuccessId === art.id;
                    const wordCount = (isEditing ? editForm.description : art.description || "").trim().split(/\s+/).filter(Boolean).length;

                    return (
                      <div 
                        key={art.id} 
                        id={`art-slot-${art.id}`}
                        className={`bg-[#0a0a0c] border transition-all rounded-xl p-5 md:p-6 ${
                          isEditing ? 'border-white ring-1 ring-white/20' : 'border-white/10 hover:border-white/25'
                        }`}
                      >
                        {isEditing ? (
                          /* EDIT MODE */
                          <div className="space-y-5 animate-fade-in">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                                EDITING SLOT #{idx + 1}: {art.title}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">ID: {art.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              {/* Left Column: Image Preview & URL */}
                              <div className="space-y-3">
                                <div className="aspect-square bg-black border border-white/10 rounded-lg overflow-hidden flex items-center justify-center relative group">
                                  {editForm.image ? (
                                    <img 
                                      src={editForm.image} 
                                      alt="Preview" 
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <div className="text-zinc-600 font-mono text-xs">NO IMAGE SET</div>
                                  )}
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                    Artwork Image URL / Path
                                  </label>
                                  <input 
                                    type="text"
                                    value={editForm.image}
                                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                    placeholder="/artwork/art/image.png or https://..."
                                    className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                    Or Choose Sample Asset
                                  </label>
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) setEditForm({ ...editForm, image: e.target.value });
                                    }}
                                    className="w-full bg-black/60 border border-white/15 p-2 text-xs text-white rounded focus:border-white focus:outline-none"
                                  >
                                    <option value="">-- Choose High-Res Preset --</option>
                                    <option value="/artwork/art/78abe36e-a129-4a65-8d65-14c846260ad1.png">Pop Art Visions (Yellow)</option>
                                    <option value="/artwork/art/ChatGPT Image Jun 6, 2026, 07_08_21 PM.png">Archbishop Desmond Tutu</option>
                                    <option value="/artwork/art/ChatGPT Image Jun 6, 2026, 07_13_31 PM.png">Nelson Mandela Tribute</option>
                                    <option value="/artwork/art/ChatGPT Image Jun 6, 2026, 07_16_25 PM.png">Marilyn Monroe in Wood</option>
                                    <option value="/artwork/art/ChatGPT Image Jun 6, 2026, 07_38_16 PM.png">Sacred Crown of Thorns</option>
                                    <option value="/artwork/art/ChatGPT Image May 27, 2026, 01_18_17 AM.png">The Majestic Pride (Lion)</option>
                                    <option value="/artwork/art/ChatGPT Image May 27, 2026, 12_00_04 AM.png">Serengeti Monarch (Elephant)</option>
                                    <option value="/artwork/art/ba58f07a-ea1b-4911-ba96-0caf7dd2729d.png">Aura & Geometric Silhouette</option>
                                    <option value="/artwork/d00ca55d-63ac-4ab4-ad3b-fcf3f900a7f6 (2).png">Grand 6m Centerpiece</option>
                                  </select>
                                </div>
                              </div>

                              {/* Right 2 Columns: Title, Description, Song, Wall Inscription, Price */}
                              <div className="md:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="sm:col-span-2">
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                      Artwork Title
                                    </label>
                                    <input 
                                      type="text"
                                      value={editForm.title}
                                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-bold uppercase focus:border-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                      Artist Name
                                    </label>
                                    <input 
                                      type="text"
                                      value={editForm.artist}
                                      onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                      Creation Year
                                    </label>
                                    <input 
                                      type="text"
                                      value={editForm.year}
                                      onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-mono focus:border-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                      Price (ZAR)
                                    </label>
                                    <input 
                                      type="number"
                                      value={editForm.price}
                                      onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-mono focus:border-white focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                                      3D Wall Inscription / Plaque
                                    </label>
                                    <input 
                                      type="text"
                                      value={editForm.wallText}
                                      onChange={(e) => setEditForm({ ...editForm, wallText: e.target.value })}
                                      placeholder="e.g. ITS ABOUT TIME"
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none font-mono"
                                    />
                                  </div>
                                </div>

                                {/* Audio Soundtrack Selector */}
                                <div>
                                  <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1 flex items-center justify-between">
                                    <span>Artwork Audio Soundtrack / Song</span>
                                    {editForm.audio && (
                                      <button
                                        type="button"
                                        onClick={() => handleTogglePreviewAudio(editForm.audio, `preview-${art.id}`)}
                                        className="text-[9px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                      >
                                        {previewAudioId === `preview-${art.id}` ? <Pause size={10} /> : <Play size={10} />}
                                        {previewAudioId === `preview-${art.id}` ? 'Stop Audio' : 'Preview Track'}
                                      </button>
                                    )}
                                  </label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <select
                                      value={
                                        AVAILABLE_AUDIO_TRACKS.some(t => t.url === editForm.audio)
                                          ? editForm.audio
                                          : 'custom'
                                      }
                                      onChange={(e) => {
                                        if (e.target.value !== 'custom') {
                                          setEditForm({ ...editForm, audio: e.target.value });
                                        }
                                      }}
                                      className="bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none"
                                    >
                                      {AVAILABLE_AUDIO_TRACKS.map((t, tIdx) => (
                                        <option key={tIdx} value={t.url}>🎵 {t.title}</option>
                                      ))}
                                      <option value="custom">Custom Audio URL...</option>
                                    </select>
                                    <input 
                                      type="text"
                                      value={editForm.audio}
                                      onChange={(e) => setEditForm({ ...editForm, audio: e.target.value })}
                                      placeholder="https://... or /artwork/song.mp3"
                                      className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-mono focus:border-white focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {/* Rich Narrative & Description (150 words) */}
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase block">
                                      Artwork Overview & Narrative Description (~150 Words)
                                    </label>
                                    <span className={`text-[10px] font-mono ${wordCount >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                      {wordCount} words
                                    </span>
                                  </div>
                                  <textarea 
                                    rows={5}
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    placeholder="Write a deep artistic narrative detailing the wooden mosaic block relief, textures, palette, and conceptual inspiration..."
                                    className="w-full bg-black/60 border border-white/15 p-3 text-xs text-zinc-200 rounded leading-relaxed focus:border-white focus:outline-none resize-y"
                                  />
                                </div>

                                {/* Save / Cancel Buttons */}
                                <div className="flex items-center gap-3 pt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(art.id)}
                                    className="px-6 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded flex items-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                                  >
                                    <Save size={14} /> Save & Deploy Live
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingId(null)}
                                    className="px-4 py-2.5 border border-white/15 text-zinc-400 hover:text-white rounded text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* DISPLAY VIEW */
                          <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-start">
                            {/* Artwork Thumbnail */}
                            <div className="w-28 h-28 sm:w-32 sm:h-32 bg-black border border-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                              {art.customImageUrl || art.image ? (
                                <img 
                                  src={art.customImageUrl || art.image} 
                                  alt={art.title} 
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <span className="text-zinc-600 font-mono text-[10px]">NO IMAGE</span>
                              )}
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 space-y-2 min-w-0 w-full">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-mono font-bold">
                                    SLOT #{idx + 1}
                                  </span>
                                  <h3 className="text-base sm:text-lg font-display font-black uppercase text-white truncate">
                                    {art.title}
                                  </h3>
                                  <span className="text-xs font-mono text-zinc-500 shrink-0">[{art.year || '2026'}]</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {isSaved && (
                                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-mono flex items-center gap-1 animate-pulse">
                                      <Check size={11} /> Saved Live
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleStartEdit(art)}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black border border-white/20 rounded text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Edit2 size={12} /> Edit Details
                                  </button>
                                  {idx >= 10 && (
                                    <button
                                      onClick={() => handleDeleteArtwork(art.id)}
                                      className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                                      title="Delete Slot"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400">
                                <span>Artist: <strong className="text-white">{art.artist || 'Ian Art'}</strong></span>
                                <span>•</span>
                                <span>Price: <strong className="text-white">R{(art.price || 18500).toLocaleString()}</strong></span>
                                <span>•</span>
                                <span>Wall Plaque: <strong className="text-white">{art.wallText || 'Gallery Standard'}</strong></span>
                                <span>•</span>
                                {art.audio && (
                                  <button
                                    type="button"
                                    onClick={() => handleTogglePreviewAudio(art.audio, art.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border transition-all cursor-pointer ${
                                      previewAudioId === art.id 
                                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold' 
                                        : 'bg-white/5 border-white/15 text-zinc-300 hover:text-white'
                                    }`}
                                  >
                                    {previewAudioId === art.id ? <Pause size={10} /> : <Play size={10} />}
                                    <span>{previewAudioId === art.id ? 'Playing Song' : 'Preview Soundtrack'}</span>
                                  </button>
                                )}
                              </div>

                              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed pt-1 font-light">
                                {art.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ADD NEW ARTWORK FORM */}
                <div className="bg-zinc-950 border border-white/10 rounded-xl p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-sm font-display font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Plus size={16} /> Deploy New Artwork To Gallery
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500">Append Custom Piece</span>
                  </div>

                  <form onSubmit={handleAddArtwork} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Piece Title *
                        </label>
                        <input 
                          required
                          type="text"
                          value={newArtwork.title}
                          onChange={(e) => setNewArtwork({ ...newArtwork, title: e.target.value })}
                          placeholder="e.g. MONUMENTAL HORIZON"
                          className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Artist Name
                        </label>
                        <input 
                          type="text"
                          value={newArtwork.artist}
                          onChange={(e) => setNewArtwork({ ...newArtwork, artist: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Year
                        </label>
                        <input 
                          type="text"
                          value={newArtwork.year}
                          onChange={(e) => setNewArtwork({ ...newArtwork, year: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Artwork Image URL / Path *
                        </label>
                        <input 
                          required
                          type="text"
                          value={newArtwork.image}
                          onChange={(e) => setNewArtwork({ ...newArtwork, image: e.target.value })}
                          placeholder="https://... or /artwork/art/photo.png"
                          className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded font-mono focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                          Audio Soundtrack Preset
                        </label>
                        <select
                          value={newArtwork.audio}
                          onChange={(e) => setNewArtwork({ ...newArtwork, audio: e.target.value })}
                          className="w-full bg-black/60 border border-white/15 p-2.5 text-xs text-white rounded focus:border-white focus:outline-none"
                        >
                          {AVAILABLE_AUDIO_TRACKS.map((t, idx) => (
                            <option key={idx} value={t.url}>🎵 {t.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">
                        Artwork Overview & Narrative Description (~150 Words) *
                      </label>
                      <textarea 
                        required
                        rows={4}
                        value={newArtwork.description}
                        onChange={(e) => setNewArtwork({ ...newArtwork, description: e.target.value })}
                        placeholder="Write a deep artistic narrative detailing the wooden mosaic block relief, textures, palette, and conceptual inspiration..."
                        className="w-full bg-black/60 border border-white/15 p-3 text-xs text-zinc-200 rounded leading-relaxed focus:border-white focus:outline-none resize-y"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-[0.2em] rounded flex items-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-xl"
                    >
                      <Plus size={16} /> Deploy Artwork to Virtual Gallery
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* TAB 2: WALL HEADING INSCRIPTION */}
            {activeTab === 'wall-heading' && (
              <motion.div 
                key="wall-heading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#0a0a0c] border border-white/10 rounded-xl p-8 space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-display font-black uppercase text-white">
                    3D Wall Inscription Heading
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                    This text is mounted as the primary monumental architectural inscription above the North & South grand gallery centerpieces.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">
                      Main Inscription Text
                    </label>
                    <input 
                      type="text"
                      value={wallHeading}
                      onChange={(e) => setWallHeading(e.target.value)}
                      placeholder='e.g. "ITS ABOUT TIME"'
                      className="w-full bg-black/60 border border-white/15 p-3 text-sm font-display font-bold uppercase tracking-wider text-white rounded focus:border-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSaveWallHeading}
                      className="px-6 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded flex items-center gap-2 hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
                    >
                      <Save size={14} /> Update Inscription Live
                    </button>
                    {headingSaved && (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
                        <Check size={14} /> Updated in Virtual Gallery!
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: COLLECTOR INQUIRIES */}
            {activeTab === 'inquiries' && (
              <motion.div 
                key="inquiries"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {inquiries.length === 0 ? (
                  <div className="bg-[#0a0a0c] border border-white/10 p-20 text-center rounded-xl space-y-3">
                    <MessageSquare size={32} className="text-zinc-600 mx-auto" />
                    <p className="text-zinc-400 uppercase tracking-widest text-xs font-mono">No customer inquiries received yet.</p>
                    <p className="text-zinc-600 text-xs">New inquiries from purchase/rent forms will appear here in real time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-[#0a0a0c] border border-white/10 p-6 rounded-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <span className="px-2.5 py-1 bg-white/10 text-white rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                            {inq.type || 'Inquiry'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base font-bold uppercase text-white">{inq.fullName || inq.buyerName}</h4>
                          <p className="text-xs font-mono text-zinc-400">{inq.email || inq.buyerEmail}</p>
                          {inq.phone && <p className="text-xs font-mono text-zinc-500">{inq.phone}</p>}
                        </div>

                        {inq.artworkTitle && (
                          <div className="p-2.5 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">
                            Artwork: <strong className="text-white">{inq.artworkTitle}</strong>
                          </div>
                        )}

                        {inq.message && (
                          <p className="text-xs text-zinc-300 italic bg-black/40 p-3 rounded border border-white/5 leading-relaxed">
                            "{inq.message}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: STATS */}
            {activeTab === 'stats' && (
              <motion.div 
                key="stats"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {[
                  { label: 'Exhibition Artworks', value: artworks.length, icon: ImageIcon },
                  { label: 'Collector Inquiries', value: inquiries.length, icon: MessageSquare },
                  { label: '3D Gallery Status', value: 'ACTIVE (3.8m)', icon: Sparkles },
                ].map((s, idx) => (
                  <div key={idx} className="bg-[#0a0a0c] border border-white/10 p-8 rounded-xl space-y-3 text-center">
                    <s.icon size={24} className="text-zinc-400 mx-auto" />
                    <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-400">{s.label}</p>
                    <h3 className="text-3xl font-display font-black text-white">{s.value}</h3>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
};
