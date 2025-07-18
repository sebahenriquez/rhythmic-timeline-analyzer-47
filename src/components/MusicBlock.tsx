
import React, { useState, useRef } from 'react';
import { X, Edit, GripHorizontal } from 'lucide-react';
import BlockEditor from './BlockEditor';

interface MusicBlockProps {
  block: {
    id: string;
    type: string;
    label: string;
    startTime: number;
    duration: number;
    color: string;
    customText?: string;
  };
  zoom: number;
  onRemove: () => void;
  onUpdate: (updates: Partial<MusicBlockProps['block']>) => void;
}

const MusicBlock: React.FC<MusicBlockProps> = ({ block, zoom, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const initialMouseX = useRef(0);
  const initialWidth = useRef(0);
  const initialLeft = useRef(0);

  // Calcular texto a mostrar
  const displayText = block.customText 
    ? `${block.label} - ${block.customText}`
    : block.label;

  // Calcular ancho mínimo basado en el texto
  const textLength = displayText.length;
  const minWidth = Math.max(textLength * 6 + 60, 100); // 6px por caracter + espacio para botones
  const width = Math.max(block.duration * zoom * 4, minWidth);
  const left = block.startTime * zoom * 4;

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    initialMouseX.current = e.clientX;
    initialWidth.current = width;
    
    const handleResizeMove = (e: MouseEvent) => {
      const deltaX = e.clientX - initialMouseX.current;
      const newWidth = Math.max(initialWidth.current + deltaX, 40);
      const newDuration = newWidth / (zoom * 4);
      onUpdate({ duration: Math.max(newDuration, 0.1) });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (isResizing) return;
    setIsDragging(true);
    initialMouseX.current = e.clientX;
    initialLeft.current = left;
    
    const handleDragMove = (e: MouseEvent) => {
      const deltaX = e.clientX - initialMouseX.current;
      const newLeft = Math.max(initialLeft.current + deltaX, 0);
      const newStartTime = newLeft / (zoom * 4);
      onUpdate({ startTime: Math.max(newStartTime, 0) });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = (updates: { customText?: string; duration: number; startTime: number }) => {
    onUpdate(updates);
  };


  return (
    <>
      <div
        ref={blockRef}
        className={`absolute top-1 bottom-1 ${block.color} border-2 border-gray-300 rounded shadow-sm flex items-center justify-between px-2 text-xs font-medium text-gray-800 hover:shadow-md transition-all group cursor-move music-block drag-element mobile-friendly ${
          isDragging ? 'opacity-70 shadow-lg' : ''
        } ${isResizing ? 'cursor-ew-resize' : ''}`}
        style={{
          left: `${left}px`,
          width: `${width}px`
        }}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-1 min-w-0 flex-1">
          <span className="text-xs leading-tight whitespace-nowrap overflow-hidden" title={displayText}>
            {displayText}
          </span>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-0.5 hover:bg-blue-100 rounded"
            title="Editar bloque"
          >
            <Edit className="w-3 h-3 text-blue-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-0.5 hover:bg-red-100 rounded"
            title="Eliminar bloque"
          >
            <X className="w-3 h-3 text-red-600" />
          </button>
        </div>

        {/* Handle de redimensionamiento */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
          title="Redimensionar"
        >
          <GripHorizontal className="w-3 h-3 text-gray-500" />
        </div>
      </div>

      <BlockEditor
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        block={block}
        onSave={handleSaveEdit}
      />
    </>
  );
};

export default MusicBlock;
