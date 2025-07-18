import React, { useState, useEffect } from 'react';
import MusicBlock from './MusicBlock';
import MusicBlockTooltip from './MusicBlockTooltip';

interface TimelineLayerProps {
  layerId: string;
  layerName: string;
  color: string;
  borderColor: string;
  duration: number;
  zoom: number;
  onTimeClick: (time: number) => void;
  onBlocksChange: (blocks: any[]) => void;
  isActive?: boolean;
}

const TimelineLayer: React.FC<TimelineLayerProps> = ({
  layerId,
  layerName,
  color,
  borderColor,
  duration,
  zoom,
  onTimeClick,
  onBlocksChange,
  isActive = false
}) => {
  const [blocks, setBlocks] = useState<Array<{
    id: string;
    type: string;
    label: string;
    startTime: number;
    duration: number;
    color: string;
    customText?: string;
  }>>([]);

  // Reportar cambios en los bloques al componente padre (evitar bucles infinitos)
  useEffect(() => {
    onBlocksChange(blocks);
  }, [blocks]); // Removido onBlocksChange de las dependencias

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const blockData = JSON.parse(e.dataTransfer.getData('application/json'));
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    
    // Snap a grilla de 1 segundo
    const rawTime = clickX / (zoom * 4);
    const startTime = Math.max(0, Math.round(rawTime));
    
    const newBlock = {
      id: `${layerId}-${Date.now()}`,
      type: blockData.type,
      label: blockData.label,
      startTime,
      duration: blockData.defaultDuration || 10,
      color: blockData.color,
      customText: ''
    };

    setBlocks(prev => [...prev, newBlock]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTimelineClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const time = clickX / (zoom * 4);
    onTimeClick(time);
  };

  const removeBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const updateBlock = (blockId: string, updates: Partial<typeof blocks[0]>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  // Generar líneas guía cada 1 segundo para la grilla
  const getGuideLines = () => {
    return Array.from({ length: Math.ceil(duration) }, (_, i) => i);
  };

  const guideLines = getGuideLines();

  return (
    <div
      className={`h-20 md:h-20 sm:h-16 ${color} ${borderColor} border-b relative cursor-pointer hover:opacity-90 transition-opacity timeline-layer touch-manipulation`}
      style={{ width: `${duration * zoom * 4}px` }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleTimelineClick}
    >
      {/* Líneas de guía verticales */}
      {guideLines.map((time) => (
        <div
          key={time}
          className="absolute top-0 h-full w-px bg-gray-200 opacity-50"
          style={{ left: `${time * zoom * 4}px` }}
        ></div>
      ))}

      {/* Bloques musicales */}
      {blocks.map((block) => (
        <MusicBlockTooltip key={block.id} blockType={block.type} blockLabel={block.label}>
          <MusicBlock
            block={block}
            zoom={zoom}
            onRemove={() => removeBlock(block.id)}
            onUpdate={(updates) => updateBlock(block.id, updates)}
          />
        </MusicBlockTooltip>
      ))}

      {/* Área de drop indicator */}
      <div className="absolute inset-0 border-2 border-dashed border-transparent hover:border-blue-300 transition-colors pointer-events-none"></div>
    </div>
  );
};

export default TimelineLayer;
