/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, Download, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OceanBooth() {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  // Resolusi ideal untuk iPhone dan Laptop
  const videoConstraints = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: "user",
  };

  // logika ambil foto (4 Pose)
  const startCaptureProcess = async () => {
    setIsCapturing(true);
    setPhotos([]);
    const newPhotos = [];

    for (let i = 0; i < 4; i++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);
      
      // Efek Flash
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 100);

      const imageSrc = webcamRef.current.getScreenshot();
      newPhotos.push(imageSrc);
      setPhotos([...newPhotos]);
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    setIsCapturing(false);
  };

  // logika download
  const generateFinalImage = (capturedPhotos) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; // Sesuai ukuran Figma kamu
    canvas.height = 3600;
    const ctx = canvas.getContext("2d");

    // Isi background putih dulu agar transparan aman
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let loadedImages = 0;
    capturedPhotos.forEach((photo, index) => {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        const targetRatio = 1000 / 750;
        const imgRatio = img.width / img.height;
        let sX, sY, sWidth, sHeight;

        if (imgRatio > targetRatio) {
          sHeight = img.height;
          sWidth = img.height * targetRatio;
          sX = (img.width - sWidth) / 2;
          sY = 0;
        } else {
          sWidth = img.width;
          sHeight = img.width / targetRatio;
          sX = 0;
          sY = (img.height - sHeight) / 2;
        }

        const yPos = 100 + (index * (750 + 33));
        ctx.drawImage(img, sX, sY, sWidth, sHeight, 100, yPos, 1000, 750);

        loadedImages++;
        if (loadedImages === 4) {
          const frame = new Image();
          frame.src = "/frames/frame-oceanbooth.png";
          frame.onload = () => {
            ctx.drawImage(frame, 0, 0, 1200, 3600);
            const link = document.createElement("a");
            link.download = `ocean-photostrip-${Date.now()}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
          };
        }
      };
    });
  };

  return (
    <main className="min-h-dvh bg-[#F0F9FF] flex flex-col items-center py-6 px-4 font-sans text-blue-900 overflow-x-hidden">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl lg:text-4xl font-black mb-6 tracking-tight text-transparent bg-clip-textbg-linear-to-r from-blue-600 to-cyan-500"
      >
        OCEAN BOOTH
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start w-full max-w-6xl justify-center">
        
        {/* Viewport kamera utama */}
        <div className="relative w-full max-w-125 aspect-4/3 bg-white rounded-4xl shadow-2xl border-8 lg:border-12 border-white overflow-hidden">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            mirrored={true}
            className="w-full h-full object-cover"
            playsInline={true}
          />

          {/* Efek Flash kilat putih */}
          <AnimatePresence>
            {showFlash && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-60"
              />
            )}
          </AnimatePresence>
          
          {/* Overlay Hitung Mundur */}
          <AnimatePresence>
            {countdown && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/10 z-50 pointer-events-none"
              >
                <span className="text-9xl font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]">{countdown}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* PREVIEW STRIP */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Live Preview</span>
          <div className="relative w-40 h-120 lg:w-45 lg:h-135 shadow-2xl bg-white rounded-lg overflow-hidden ring-4 ring-white">
            <div className="absolute inset-0 flex flex-col items-center pt-3.75 lg:pt-4.25 gap-1 lg:gap-1.25">
              {photos.map((src, i) => (
                <motion.img 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  src={src} 
                  className="w-33.25 lg:w-37.5 h-25 lg:h-28 object-cover rounded-sm" 
                />
              ))}
            </div>
            <img 
              src="/frames/frame-oceanbooth.png"
              className="absolute inset-0 w-full h-full z-10 pointer-events-none"
              alt="Ocean Frame" 
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-10 flex flex-wrap justify-center gap-4 w-full">
        {!isCapturing && (
          <button 
            onClick={startCaptureProcess}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-xl transition-all hover:scale-105 active:scale-95 text-lg"
          >
            <Camera size={24} /> {photos.length > 0 ? "Foto Ulang" : "Mulai Photobooth"}
          </button>
        )}

        {isCapturing && (
          <div className="flex items-center gap-3 px-8 py-4 bg-gray-200 text-gray-500 rounded-full font-bold animate-pulse">
            <Loader2 className="animate-spin" /> Sedang Berpose...
          </div>
        )}

        {photos.length === 4 && !isCapturing && (
          <>
            <button 
              onClick={() => generateFinalImage(photos)}
              className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold shadow-xl transition-all hover:scale-105"
            >
              <Download size={24} /> Simpan Foto
            </button>
            <button 
              onClick={() => setPhotos([])}
              className="p-4 bg-red-50 text-red-500 hover:bg-red-100 rounded-full transition-all shadow-md"
              title="Hapus"
            >
              <Trash2 size={24} />
            </button>
          </>
        )}
      </div>

      <p className="mt-auto pt-10 text-blue-300 text-[10px] tracking-widest font-medium">MADE WITH ❤️ BY PYARI • UNUD IT</p>
    </main>
  );
}