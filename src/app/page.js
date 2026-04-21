"use client";

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Download, Loader2, Trash2, ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satisfy, Montserrat } from 'next/font/google';

import { FrameCard } from '@/components/FrameCard';
import { FlashEffect } from '@/components/FlashEffect';
import { FilterBar } from '@/components/FilterBar';
import { StickerDrawer } from '@/components/StickerDrawer';
import { DraggableSticker } from '@/components/DraggableSticker';
import { LayoutSelector } from '@/components/LayoutSelector';
import { EditorWorkspace } from '@/components/EditorWorkspace';
import { toPng } from 'html-to-image';
import { BackgroundElements } from '@/components/BackgroundElements';

// Inisialisasi font
const satisfy = Satisfy({ 
  subsets: ['latin'], 
  weight: '400',
  variable: '--font-satisfy' 
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
});

// Background is handled by BackgroundElements 

const LAYOUT_OPTIONS = [
  { id: 'classic', name: 'Polaroid', slots: 1, icon: '🖼️' },
  { id: '3-slots', name: 'Photostrip', slots: 3, icon: '📸' },
  { id: '4-slots', name: 'Photostrip', slots: 4, icon: '📸' },
];

const FRAME_OPTIONS = [
  { id: 'classic', name: 'Classic Polaroid', src: '/frames-1-strip/classic.png', slots: 1 },
  { id: 'ocean-3', name: 'Ocean World', src: '/frames-3-strips/frame-oceanbooth.png', slots: 3 },
  { id: 'ocean', name: 'Ocean World', src: '/frames-4-strips/frame-oceanbooth.png', slots: 4 },
  { id: 'ocean-2', name: 'Ocean', src: '/frames-4-strips/ocean-2.png', slots: 4 },
  { id: 'chicken', name: 'Chicken', src: '/frames-4-strips/chicken.png', slots: 4 },
  { id: 'white', name: 'Clean White', color: '#ffffff', slots: 'all' },
  { id: 'pink', name: 'Pastel Pink', color: '#ffd1dc', slots: 'all' },
  { id: 'blue', name: 'Pastel Blue', color: '#b3e5fc', slots: 'all' },
  { id: 'dark', name: 'Midnight', color: '#1e293b', slots: 'all' },
];

export default function OceanBooth() {
  const webcamRef = useRef(null);
  const stripRef = useRef(null);
  const [step, setStep] = useState('layout'); // 'layout' | 'capture' | 'results' | 'edit'
  const [slotCount, setSlotCount] = useState(4);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[5]); // Default to White
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showFlash, setShowFlash] = useState(false);
  const [activeFilter, setActiveFilter] = useState('normal');
  const [stickers, setStickers] = useState([]);
  const [retakeIndex, setRetakeIndex] = useState(null);

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "user",
  };

  const startCaptureProcess = async () => {
    setIsCapturing(true); 
    
    // If not a retake, clear all photos
    if (retakeIndex === null) {
      setPhotos([]);
    }

    const currentPhotos = retakeIndex !== null ? [...photos] : [];
    
    // Determine which indices to capture
    const indicesToCapture = retakeIndex !== null ? [retakeIndex] : Array.from({ length: slotCount }, (_, i) => i);

    for (const i of indicesToCapture) {
      for (let c = 3; c > 0; c--) { 
        setCountdown(c); 
        await new Promise(r => setTimeout(r, 1000)); 
      }
      setCountdown(null);
      setShowFlash(true); 
      setTimeout(() => setShowFlash(false), 100);
      
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (retakeIndex !== null) {
        currentPhotos[i] = imageSrc;
      } else {
        currentPhotos.push(imageSrc);
      }
      
      setPhotos([...currentPhotos]);
      await new Promise(r => setTimeout(r, 800));
    }
    
    setIsCapturing(false);
    setRetakeIndex(null); // Reset retake index
    setStep('results');
  };

  const addSticker = (src) => {
    const newSticker = {
      id: Date.now(),
      src,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };
    setStickers([...stickers, newSticker]);
  };

  const updateSticker = (id, data) => {
    setStickers(stickers.map((s) => (s.id === id ? { ...s, ...data } : s)));
  };

  const deleteSticker = (id) => {
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const exportPhotostrip = async () => {
    if (!stripRef.current) return;
    try {
      // Filter out elements like the 'Ambil Ulang' buttons or stickers delete buttons
      const filter = (node) => {
        return node?.getAttribute?.('data-export-ignore') !== 'true';
      };

      const dataUrl = await toPng(stripRef.current, { 
        quality: 1.0, 
        pixelRatio: 2,
        backgroundColor: null, // Maintain transparency
        filter: filter
      });
      
      const link = document.createElement('a');
      link.download = `oceanbooth-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  return (
    <main className={`${montserrat.className} min-h-dvh flex flex-col items-center py-10 px-4 font-sans text-slate-800 relative overflow-hidden`}>
      <BackgroundElements />
      
      {/* HEADER */}
      <motion.div className="text-center mb-10 z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-[0.3em] text-pink-400 uppercase">
            Frame your story
          </span>
        </div>
        
        {/* Font Satisfy */}
        <h1 className={`${satisfy.className} text-5xl lg:text-6xl text-blue-600 drop-shadow-sm`}>
          Photobooth
        </h1>
        
        <div className="h-1 w-20 bg-linear-to-r from-transparent via-blue-200 to-transparent mx-auto mt-2" />
      </motion.div>

      {/* STEP 1: LAYOUT SELECTION */}
      {step === 'layout' && (
        <LayoutSelector 
          options={LAYOUT_OPTIONS} 
          onSelect={(slots) => {
            setSlotCount(slots);
            setStep('capture');
          }}
        />
      )}

      {/* STEP 2: CAPTURE */}
      {step === 'capture' && (
        <div className="w-full max-w-6xl flex flex-col items-center z-10">
          <div className="w-full flex justify-between items-center mb-8">
            <button 
              onClick={() => { 
                setStep('layout'); 
                setPhotos([]); 
                setStickers([]);
                setSelectedFrame(FRAME_OPTIONS[5]); // Reset to default (White)
                setActiveFilter('normal');
              }} 
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
            {/* Main Viewport */}
            <div className={`relative w-full max-w-160 aspect-4/3 bg-white rounded-[3rem] shadow-2xl border-16 border-white overflow-hidden`}>
              <Webcam 
                audio={false} ref={webcamRef} screenshotFormat="image/png" videoConstraints={videoConstraints}
                mirrored={true} playsInline={true} className="w-full h-full object-cover" 
              />
              <FlashEffect isVisible={showFlash} />
              <AnimatePresence>
                {countdown && (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <span className="text-[10rem] font-black text-white drop-shadow-lg italic">{countdown}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Preview Strip (Returning requested feature) */}
            <div 
              className="relative shadow-2xl bg-white rounded-2xl overflow-hidden ring-8 ring-white shrink-0 hidden lg:block"
              style={{ 
                width: '192px',
                height: slotCount === 1 ? '270px' : (slotCount === 3 ? '400px' : '520px'),
                backgroundColor: selectedFrame.color || 'white'
              }}
            >
              <div 
                className="absolute inset-0 flex flex-col items-center gap-2"
                style={{ paddingTop: slotCount === 1 ? '12px' : '24px' }}
              >
                {photos.map((src, i) => (
                  <div key={i} className="relative shadow-sm rounded-md overflow-hidden bg-slate-100" style={{
                    width: slotCount === 1 ? '168px' : '160px',
                    height: slotCount === 1 ? '210px' : '120px'
                  }}>
                    <img 
                      src={src} 
                      alt={`Preview ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              {selectedFrame.src && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <img 
                    src={selectedFrame.src} 
                    alt="Frame Overlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
             <div className="flex gap-4">
                {[...Array(slotCount)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full transition-all duration-500 ${i < photos.length ? 'bg-blue-500 scale-125' : 'bg-slate-200'}`} />
                ))}
             </div>
               
                {!isCapturing && (
                <button 
                  onClick={startCaptureProcess} 
                  className="flex items-center gap-3 px-12 py-6 bg-blue-600 text-white rounded-full font-black text-lg shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all uppercase tracking-tight"
                >
                  <Camera size={28} /> {retakeIndex !== null ? 'Ambil Ulang' : 'Start Shoot!'}
                </button>
              )}
              {isCapturing && <div className="flex items-center gap-3 px-12 py-6 bg-slate-100 text-slate-400 rounded-full font-bold animate-pulse tracking-widest uppercase"><Loader2 className="animate-spin" /> Taking Photo {photos.length + 1}...</div>}
            </div>
          </div>
      )}

      {/* STEP 3: RESULTS PREVIEW */}
      {step === 'results' && (
        <div className="w-full max-w-6xl flex flex-col items-center z-10">
          <div className="w-full flex justify-between items-center mb-8 px-4">
            <button 
              onClick={() => { 
                setStep('layout'); 
                setPhotos([]); 
                setStickers([]);
                setSelectedFrame(FRAME_OPTIONS[5]); // Reset to default (White)
                setActiveFilter('normal');
              }} 
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} /> Cancel & Pick Layout
            </button>
            <button onClick={() => { setStep('capture'); setPhotos([]); }} className="flex items-center gap-2 text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors">
              <Trash2 size={16} /> Retake Photos
            </button>
          </div>

          <div className="flex flex-col items-center gap-10">
            <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative shadow-2xl overflow-hidden ring-8 ring-white shrink-0"
               style={{ 
                 width: '320px',
                 height: slotCount === 1 ? '450px' : (slotCount === 3 ? '720px' : '960px'),
                 backgroundColor: selectedFrame.color || 'white',
               }}
            >
               <div className="absolute inset-0 flex flex-col items-center gap-3 z-0" style={{ paddingTop: slotCount === 1 ? '20px' : '32px' }}>
                {photos.map((src, i) => (
                  <div key={i} className="group relative shadow-sm rounded-sm overflow-hidden bg-slate-100" style={{
                    width: slotCount === 1 ? '280px' : '260px',
                    height: slotCount === 1 ? '350px' : '195px'
                  }}>
                    <img 
                      src={src} 
                      alt={`Photo ${i+1}`}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => {
                        setRetakeIndex(i);
                        setStep('capture');
                      }}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 rounded-sm z-20"
                      data-export-ignore="true"
                    >
                      <Camera size={32} />
                      <span className="font-black text-xs uppercase tracking-widest">Ambil Ulang</span>
                    </button>
                  </div>
                ))}
              </div>
              {selectedFrame.src && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <img 
                    src={selectedFrame.src} 
                    alt="Overlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </motion.div>

            <button 
              onClick={() => setStep('edit')}
              className="px-12 py-6 bg-pink-400 text-white rounded-full font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
              Decorate <Sparkles className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: EDITOR WORKSPACE */}
      {step === 'edit' && (
        <EditorWorkspace 
          stripRef={stripRef}
          photos={photos}
          selectedFrame={selectedFrame}
          activeFilter={activeFilter}
          stickers={stickers}
          slotCount={slotCount}
          frameOptions={FRAME_OPTIONS.filter(opt => opt.slots === slotCount || opt.slots === 'all')}
          onSetActiveFilter={setActiveFilter}
          onSetSelectedFrame={setSelectedFrame}
          onAddSticker={addSticker}
          onUpdateSticker={updateSticker}
          onDeleteSticker={deleteSticker}
          onExport={exportPhotostrip}
          onBack={() => { setStep('capture'); setPhotos([]); setStickers([]); }}
        />
      )}
      {/* FOOTER */}
      <footer className="mt-auto py-8 text-slate-400 font-bold text-[10px] uppercase tracking-[0.4em] z-10">
        © 2026 Photobooth
      </footer>
    </main>
  );
}