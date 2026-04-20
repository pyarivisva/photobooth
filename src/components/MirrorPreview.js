/* eslint-disable @next/next/no-img-element */
import Webcam from 'react-webcam';

export const MirrorPreview = ({ frameSrc }) => (
  <div className="relative w-full h-full bg-slate-100 overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Webcam
        audio={false}
        mirrored={true}
        playsInline={true}
        videoConstraints={{ width: 320, height: 240 }}
        className="w-full h-full object-cover grayscale-[0.3]"
      />
    </div>
    <img 
      src={frameSrc} 
      className="absolute inset-0 w-full h-full z-10 pointer-events-none object-contain" 
      alt="frame-layer" 
    />
  </div>
);