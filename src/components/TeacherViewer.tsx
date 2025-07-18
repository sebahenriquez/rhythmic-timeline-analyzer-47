
import React, { useState } from 'react';
import { Eye, FileText, Clock, User, ArrowLeft } from 'lucide-react';

interface Block {
  id: string;
  type: string;
  label: string;
  startTime: number;
  duration: number;
  color: string;
  customText?: string;
}

interface Layer {
  id: string;
  name: string;
  blocks: Block[];
}

interface AnalysisData {
  studentInfo?: {
    name: string;
    surname: string;
    fullName: string;
  };
  videoInfo: {
    title: string;
    url: string;
    duration: number;
  };
  layers: Layer[];
  exportDate: string;
}

interface TeacherViewerProps {
  onBack?: () => void;
}

const TeacherViewer: React.FC<TeacherViewerProps> = ({ onBack }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<{ start: number; end: number } | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: AnalysisData = JSON.parse(content);
        
        if (data.layers && data.videoInfo) {
          setCurrentAnalysis(data);
        } else {
          alert('Archivo no válido.');
        }
      } catch (error) {
        alert('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
  };

  const generateLayerSummary = (layer: Layer) => {
    if (layer.blocks.length === 0) return null;

    const sortedBlocks = layer.blocks.sort((a, b) => a.startTime - b.startTime);
    
    return (
      <div key={layer.id} className="bg-white border rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">{layer.name}</h3>
        <div className="space-y-2">
          {sortedBlocks.map((block, index) => {
            const endTime = block.startTime + block.duration;
            return (
              <div 
                key={block.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded border-l-4"
                style={{ borderLeftColor: block.color.replace('bg-', '#').replace('-100', '') }}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">{block.label}</span>
                    {block.customText && (
                      <span className="text-sm text-gray-600 italic">- {block.customText}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatTime(block.startTime)} - {formatTime(endTime)} 
                    <span className="ml-2">({Math.floor(block.duration)}s)</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  #{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const generateTimelineSummary = () => {
    if (!currentAnalysis) return null;

    const allBlocks: (Block & { layerName: string })[] = [];
    currentAnalysis.layers.forEach(layer => {
      layer.blocks.forEach(block => {
        allBlocks.push({ ...block, layerName: layer.name });
      });
    });

    const sortedBlocks = allBlocks.sort((a, b) => a.startTime - b.startTime);

    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Línea de Tiempo Cronológica</h3>
        <div className="space-y-2">
          {sortedBlocks.map((block, index) => {
            const endTime = block.startTime + block.duration;
            return (
              <div 
                key={`${block.id}-timeline`} 
                className="flex items-center p-2 hover:bg-gray-50 rounded"
              >
                <div className="w-20 text-sm font-mono text-gray-600 flex-shrink-0">
                  {formatTime(block.startTime)}
                </div>
                <div className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                     style={{ backgroundColor: block.color.replace('bg-', '#').replace('-100', '#e5e7eb') }}>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-700">{block.layerName}:</span>
                  <span className="text-sm text-gray-600 ml-2">{block.label}</span>
                  {block.customText && (
                    <span className="text-sm text-gray-500 italic ml-1">- {block.customText}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {Math.floor(block.duration)}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver</span>
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Visor de Corrección</h1>
                <p className="text-sm text-gray-600">Herramienta para revisar análisis de estudiantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <FileText className="w-4 h-4" />
                <span>Cargar Análisis</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!currentAnalysis ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay análisis cargado</h3>
            <p className="text-gray-600 mb-6">Carga un archivo JSON exportado desde la herramienta de análisis</p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
              <FileText className="w-5 h-5" />
              <span>Seleccionar Archivo</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Información del Video */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Información del Análisis</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentAnalysis.studentInfo && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estudiante:</label>
                    <p className="text-gray-800">{currentAnalysis.studentInfo.fullName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Video:</label>
                  <p className="text-gray-800">{currentAnalysis.videoInfo.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duración:</label>
                  <p className="text-gray-800">{formatTime(currentAnalysis.videoInfo.duration)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha de análisis:</label>
                  <p className="text-gray-800">{new Date(currentAnalysis.exportDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">URL:</label>
                  <a 
                    href={currentAnalysis.videoInfo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver en YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Resumen por Capas */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Análisis por Capas</h2>
              {currentAnalysis.layers.map(layer => generateLayerSummary(layer))}
            </div>

            {/* Timeline Cronológico */}
            {generateTimelineSummary()}
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherViewer;
