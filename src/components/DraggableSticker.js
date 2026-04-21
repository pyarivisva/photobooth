import React from 'react';
import { Rnd } from 'react-rnd';

export const DraggableSticker = ({ sticker, onUpdate, onDelete }) => {
  return (
    <Rnd
      default={{
        x: sticker.x,
        y: sticker.y,
        width: sticker.width,
        height: sticker.height,
      }}
      lockAspectRatio={true}
      onDragStop={(e, d) => onUpdate(sticker.id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        onUpdate(sticker.id, {
          width: ref.offsetWidth,
          height: ref.offsetHeight,
          ...position,
        });
      }}
      bounds="parent"
      className="group"
    >
      <div className="relative w-full h-full">
        <img
          src={sticker.src}
          alt="sticker"
          className="w-full h-full object-contain pointer-events-none select-none"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(sticker.id);
          }}
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 active:scale-90 transition-all z-30"
          title="Hapus Stiker"
          data-export-ignore="true"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </Rnd>
  );
};
