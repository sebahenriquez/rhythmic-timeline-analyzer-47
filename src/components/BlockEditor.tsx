
import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';

interface BlockEditorProps {
  isOpen: boolean;
  onClose: () => void;
  block: {
    id: string;
    type: string;
    label: string;
    startTime: number;
    duration: number;
    color: string;
    customText?: string;
  };
  onSave: (updates: { customText?: string; duration: number; startTime: number }) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ isOpen, onClose, block, onSave }) => {
  const [customText, setCustomText] = useState(block.customText || '');
  const [duration, setDuration] = useState(block.duration);
  const [startTime, setStartTime] = useState(block.startTime);

  const handleSave = () => {
    onSave({
      customText,
      duration,
      startTime
    });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${parseFloat(secs).toString().padStart(4, '0')}`;
  };

  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseFloat(parts[1]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Bloque: {block.label}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información adicional:
            </label>
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ej: Motivo A del tema, Guitarra eléctrica, etc."
              className="w-full"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de inicio:
              </label>
              <input
                type="text"
                value={formatTime(startTime)}
                onChange={(e) => {
                  try {
                    const newTime = parseTime(e.target.value);
                    if (!isNaN(newTime) && newTime >= 0) {
                      setStartTime(newTime);
                    }
                  } catch (error) {
                    // Ignorar errores de parsing
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0:00.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (seg):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value) || 0.1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockEditor;
