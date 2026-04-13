import { useState } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize, RotateCw, 
  ChevronLeft, ChevronRight, Image as ImageIcon, 
  Download, Trash2
} from 'lucide-react';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80',
  'https://images.unsplash.com/photo-1682687982501-1e58f813f22b?w=1200&q=80',
  'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=1200&q=80',
  'https://images.unsplash.com/photo-1682695794816-7b9da18ed470?w=1200&q=80',
];

export default function ImageViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  const currentImage = SAMPLE_IMAGES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_IMAGES.length);
    resetTransform();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SAMPLE_IMAGES.length) % SAMPLE_IMAGES.length);
    resetTransform();
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  
  const resetTransform = () => {
    setScale(1);
    setRotation(0);
    setFitMode('contain');
  };

  const toggleFit = () => {
    setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-gray-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3d3d3d]">
        <div className="flex items-center space-x-4">
          <ImageIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium">Image {currentIndex + 1} of {SAMPLE_IMAGES.length}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button onClick={handleZoomOut} className="p-2 rounded hover:bg-[#3d3d3d] transition-colors" title="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-2 rounded hover:bg-[#3d3d3d] transition-colors" title="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-[#4d4d4d] mx-2" />
          <button onClick={toggleFit} className={`p-2 rounded hover:bg-[#3d3d3d] transition-colors ${fitMode === 'cover' ? 'bg-[#3d3d3d]' : ''}`} title="Fit to screen">
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={handleRotate} className="p-2 rounded hover:bg-[#3d3d3d] transition-colors" title="Rotate">
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2 rounded hover:bg-[#3d3d3d] transition-colors text-gray-400 hover:text-white" title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 rounded hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black/50">
        {/* Navigation Overlays */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image Container */}
        <div 
          className="w-full h-full flex items-center justify-center overflow-hidden"
          style={{ cursor: scale > 1 ? 'grab' : 'default' }}
        >
          <img
            src={currentImage}
            alt={`Sample ${currentIndex + 1}`}
            className="transition-transform duration-200 ease-out"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              objectFit: fitMode,
              width: fitMode === 'cover' ? '100%' : 'auto',
              height: fitMode === 'cover' ? '100%' : 'auto',
              maxHeight: '100%',
              maxWidth: '100%'
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="h-24 bg-[#2d2d2d] border-t border-[#3d3d3d] flex items-center justify-center space-x-2 px-4 py-2 overflow-x-auto">
        {SAMPLE_IMAGES.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              resetTransform();
            }}
            className={`relative flex-shrink-0 h-full aspect-video rounded-md overflow-hidden border-2 transition-all ${
              idx === currentIndex ? 'border-blue-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
