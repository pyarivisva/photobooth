import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, Sparkles, Wand2, Frame, Sticker } from 'lucide-react';
import { MiniThumbnailSelector } from './MiniThumbnailSelector';
import { FilterBar } from './FilterBar';
import { StickerCarousel } from './StickerCarousel';
import { DraggableSticker } from './DraggableSticker';

export const EditorWorkspace = ({ 
  stripRef, 
  photos, 
  selectedFrame, 
  activeFilter, 
  stickers,
  slotCount,
  frameOptions,
  onSetActiveFilter,
  onSetSelectedFrame,
  onAddSticker,
  onUpdateSticker,
  onDeleteSticker,
  onExport,
  onBack
}) => {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center z-10 pb-20 px-4">
      {/* Top Header Actions */}
      <div className="w-full flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-[0.2em] transition-colors"
        >
          <ArrowLeft size={16} /> Back to camera
        </button>
        <button 
          onClick={onExport}
          className="group flex items-center gap-3 px-8 py-3 bg-pink-400 text-white rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          <div className="p-1.5 bg-white text-black rounded-lg group-hover:rotate-12 transition-transform">
             <Download size={16} />
          </div>
          Download
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start justify-center w-full">
        {/* LEFT: The Photostrip Preview */}
        <div className="w-full lg:w-auto flex justify-center sticky top-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
             {/* The Container for Export */}
            <div 
              ref={stripRef}
              className="relative shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] overflow-hidden ring-16 ring-white shrink-0"
              style={{ 
                width: '320px',
                height: slotCount === 1 ? '450px' : (slotCount === 3 ? '720px' : '960px'),
                backgroundColor: selectedFrame.color || 'white',
              }}
            >
              {/* Photos Layer */}
              <div 
                className="absolute inset-0 flex flex-col items-center gap-3 z-0"
                style={{ paddingTop: slotCount === 1 ? '20px' : '32px' }}
              >
                {photos.map((src, i) => (
                  <div key={i} className="group relative shadow-sm rounded-sm overflow-hidden bg-slate-100" style={{
                    width: slotCount === 1 ? '280px' : '260px',
                    height: slotCount === 1 ? '350px' : '195px'
                  }}>
                    <img 
                      src={src} 
                      alt={`Photo ${i+1}`}
                      className={`w-full h-full object-cover filter-${activeFilter}`}
                    />
                  </div>
                ))}
              </div>

              {/* Frame Image Overlay */}
              {selectedFrame.src && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <img
                    src={selectedFrame.src}
                    alt="Frame Overlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Stickers Layer */}
              <div className="absolute inset-0 z-20">
                {stickers.map((sticker) => (
                  <DraggableSticker
                    key={sticker.id}
                    sticker={sticker}
                    onUpdate={onUpdateSticker}
                    onDelete={onDeleteSticker}
                  />
                ))}
              </div>
            </div>
            
            <div className="px-6 py-2 bg-white rounded-full text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 shadow-sm">
              Layout: {slotCount} Shots
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Controls - Catalog Paradigm */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6 p-2 overflow-hidden">
          
          {/* Catalog Section: Frames */}
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-6 ml-2">
              <div className="p-2 bg-pink-50 text-pink-500 rounded-xl">
                 <Frame size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-700">Frame Catalog</h3>
            </div>
            <MiniThumbnailSelector 
              options={frameOptions}
              selectedFrame={selectedFrame}
              slotCount={slotCount}
              onSelect={onSetSelectedFrame}
            />
          </section>

          {/* Catalog Section: Filters */}
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-6 ml-2">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                 <Wand2 size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-700">Effect Catalog</h3>
            </div>
            <FilterBar activeFilter={activeFilter} setActiveFilter={onSetActiveFilter} />
          </section>

          {/* Catalog Section: Stickers */}
          <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50 transition-all hover:shadow-md">
            <div className="flex items-center gap-2 mb-6 ml-2">
              <div className="p-2 bg-yellow-50 text-yellow-500 rounded-xl">
                 <Sticker size={18} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-700">Sticker Catalog</h3>
            </div>
            <StickerCarousel onAddSticker={onAddSticker} />
          </section>

        </div>
      </div>
    </div>
  );
};
