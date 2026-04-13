import { useRef, useState, useEffect } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { 
  Pencil, Eraser, Square, Circle, 
  Minus, Download, Trash2, Undo, Redo 
} from 'lucide-react';

type Tool = 'pencil' | 'eraser' | 'line' | 'rectangle' | 'circle';

export default function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveHistoryState(canvas);
    }
  }, []);

  const saveHistoryState = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(imageData);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  };

  const getCoordinates = (e: ReactMouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setStartPos({ x, y });

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  const draw = (e: ReactMouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // For shapes, we need to redraw the canvas from the last saved state
      // and then draw the new shape on top
      if (historyStep >= 0 && history[historyStep]) {
        ctx.putImageData(history[historyStep], 0, 0);
      }
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;

      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
      } else if (tool === 'rectangle') {
        ctx.rect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2));
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      }
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) saveHistoryState(canvas);
    }
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[newStep]) {
        ctx.putImageData(history[newStep], 0, 0);
      }
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && history[newStep]) {
        ctx.putImageData(history[newStep], 0, 0);
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveHistoryState(canvas);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataUrl;
    link.click();
  };

  const colors = [
    '#000000', '#ef4444', '#f97316', '#eab308', 
    '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'
  ];

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 select-none">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        
        {/* Tools */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-all`}
            title="Pencil"
          >
            <Pencil className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-all`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button 
            onClick={() => setTool('line')}
            className={`p-2 rounded ${tool === 'line' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-all`}
            title="Line"
          >
            <Minus className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded ${tool === 'rectangle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-all`}
            title="Rectangle"
          >
            <Square className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => setTool('circle')}
            className={`p-2 rounded ${tool === 'circle' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'} transition-all`}
            title="Circle"
          >
            <Circle className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center space-x-2">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-gray-400 scale-110' : 'border-gray-200 hover:scale-110'} transition-transform shadow-sm`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0 ml-2"
          />
        </div>

        {/* Size */}
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-sm text-gray-500 font-medium">Size:</span>
          <input
            type="range"
            min="1"
            max="50"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-24 accent-blue-500"
          />
          <span className="text-xs text-gray-500 w-4">{lineWidth}</span>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleUndo}
            disabled={historyStep <= 0}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            title="Undo"
          >
            <Undo className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={handleRedo}
            disabled={historyStep >= history.length - 1}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            title="Redo"
          >
            <Redo className="w-5 h-5 text-gray-700" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-2" />
          <button 
            onClick={handleClear}
            className="p-2 rounded hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 rounded hover:bg-blue-100 text-gray-700 hover:text-blue-600 transition-colors"
            title="Save Image"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={containerRef} 
        className="flex-1 overflow-hidden p-4 flex items-center justify-center cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white shadow-lg rounded-sm"
          style={{
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}
