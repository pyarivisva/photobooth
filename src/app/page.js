/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Download, Loader2, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Satisfy, Montserrat } from 'next/font/google';

import { FrameCard } from '@/components/FrameCard';
import { FlashEffect } from '@/components/FlashEffect';

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

const FRAME_OPTIONS = [
  { id: 'ocean', name: 'Ocean World', src: '/frames/frame-oceanbooth.png' },
  { id: 'ocean-2', name: 'Ocean', src: '/frames/ocean-2.png' },
  { id: 'chicken', name: 'Chicken', src: '/frames/chicken.png' },
];

export default function OceanBooth() {
  const webcamRef = useRef(null);
  const [step, setStep] = useState('select'); // 'select' | 'capture'
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "user",
  };

  const startCaptureProcess = async () => {
    setIsCapturing(true); setPhotos([]);
    const newPhotos = [];
    for (let i = 0; i < 4; i++) {
      for (let c = 3; c > 0; c--) { setCountdown(c); await new Promise(r => setTimeout(r, 1000)); }
      setCountdown(null);
      setShowFlash(true); setTimeout(() => setShowFlash(false), 100);
      const imageSrc = webcamRef.current.getScreenshot();
      newPhotos.push(imageSrc); setPhotos([...newPhotos]);
      await new Promise(r => setTimeout(r, 800));
    }
    setIsCapturing(false);
  };

  const generateFinalImage = (capturedPhotos) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 3600; // Ukuran Figma
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; ctx.fillRect(0, 0, 1200, 3600);

    let loaded = 0;
    capturedPhotos.forEach((photo, index) => {
      const img = new Image(); img.src = photo;
      img.onload = () => {
        const targetRatio = 1000 / 750;
        const imgRatio = img.width / img.height;
        let sX, sY, sW, sH;
        if (imgRatio > targetRatio) {
          sH = img.height; sW = img.height * targetRatio;
          sX = (img.width - sW) / 2; sY = 0;
        } else {
          sW = img.width; sH = img.width / targetRatio;
          sX = 0; sY = (img.height - sH) / 2;
        }
        const yPos = 100 + (index * (750 + 33)); // Sesuai margin desain
        ctx.drawImage(img, sX, sY, sW, sH, 100, yPos, 1000, 750);
        
        if (++loaded === 4) {
          const frame = new Image(); frame.src = selectedFrame.src;
          frame.onload = () => {
            ctx.drawImage(frame, 0, 0, 1200, 3600);
            const link = document.createElement("a");
            link.download = `photostrip-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
          };
        }
      };
    });
  };

  return (
    <main className={`${montserrat.className} min-h-dvh bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800 relative overflow-x-hidden`}>
      
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

      {/* PILIH LAYOUT (Kamera Mati) */}
      {step === 'select' && (
        <div className="w-full max-w-5xl flex flex-col items-center z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {FRAME_OPTIONS.map((frame) => (
              <FrameCard 
                key={frame.id} 
                frame={frame} 
                isSelected={selectedFrame.id === frame.id}
                onClick={() => setSelectedFrame(frame)}
              />
            ))}
          </div>
          <button 
            onClick={() => setStep('capture')}
            className="px-12 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl transition-all hover:scale-105"
          >
            Use This Frame
          </button>
        </div>
      )}

      {/* SESI FOTO (Kamera Nyala Otomatis) */}
      {step === 'capture' && (
        <div className="w-full max-w-6xl flex flex-col items-center z-10">
          <div className="w-full flex justify-between items-center mb-8">
            <button onClick={() => { setStep('select'); setPhotos([]); }} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest">
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
            {/* Main Viewport */}
            <div className="relative w-full max-w-125 aspect-4/3 bg-white rounded-[2.5rem] shadow-2xl border-12 border-white overflow-hidden">
              <Webcam 
                audio={false} ref={webcamRef} screenshotFormat="image/png" videoConstraints={videoConstraints}
                mirrored={true} playsInline={true} className="w-full h-full object-cover" 
              />
              <FlashEffect isVisible={showFlash} />
              <AnimatePresence>
                {countdown && (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <span className="text-[10rem] font-black text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] italic">{countdown}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview Strip */}
            <div className="relative w-45 h-135 shadow-2xl bg-white rounded-lg overflow-hidden ring-4 ring-white shrink-0">
              <div className="absolute inset-0 flex flex-col items-center pt-4.25 gap-1.25">
                {photos.map((src, i) => (
                  <motion.img initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} src={src} className="w-37.5 h-28 object-cover rounded-sm" />
                ))}
              </div>
              <img src={selectedFrame.src} className="absolute inset-0 w-full h-full z-10 pointer-events-none" alt="Overlay" />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 w-full">
            {!isCapturing && (
              <button onClick={startCaptureProcess} className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-bold shadow-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
                <Camera size={24} /> {photos.length > 0 ? "Retake" : "Start Capture"}
              </button>
            )}
            {isCapturing && <div className="flex items-center gap-3 px-10 py-5 bg-slate-100 text-slate-400 rounded-full font-bold animate-pulse tracking-widest"><Loader2 className="animate-spin" /> Say Cheese...</div>}
            {photos.length === 4 && !isCapturing && (
              <div className="flex gap-4">
                <button onClick={() => generateFinalImage(photos)} className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all"><Download size={24} /> Save</button>
                <button onClick={() => setPhotos([])} className="p-5 bg-white text-slate-300 hover:text-red-500 rounded-full shadow-md transition-all"><Trash2 size={24} /></button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}