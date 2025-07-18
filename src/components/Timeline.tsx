import React, { useState, useEffect, useCallback } from 'react';
import TimelineLayer from './TimelineLayer';
import MusicBlocksToolbar from './MusicBlocksToolbar';
import YouTubePlayer from './YouTubePlayer';
import ExportSummary from './ExportSummary';
import WorkflowSteps from './WorkflowSteps';
import { Music, Clock, Users, Palette, Volume2, Piano, Guitar, Mic, Download, Upload } from 'lucide-react';

interface TimelineProps {
  studentName: string;
  studentSurname: string;
}

const Timeline: React.FC<TimelineProps> = ({ studentName, studentSurname }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [layersData, setLayersData] = useState<any[]>([]);
  const [totalDuration, setTotalDuration] = useState(240); // Duración inicial por defecto
  const [videoInfo, setVideoInfo] = useState<{ title: string; url: string }>();
  const [showImport, setShowImport] = useState(false);
  const [currentWorkflowStep, setCurrentWorkflowStep] = useState(1);

  const layers = [
    {
      id: 'estructura',
      name: 'Estructura Formal',
      color: 'bg-purple-100',
      borderColor: 'border-purple-300',
      icon: <Music className="w-4 h-4" />,
      step: 1
    },
    {
      id: 'melodia-principal',
      name: 'Melodía Principal',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300',
      icon: <Volume2 className="w-4 h-4" />,
      step: 2
    },
    {
      id: 'acompañamiento',
      name: 'Acompañamiento',
      color: 'bg-green-100',
      borderColor: 'border-green-300',
      icon: <Guitar className="w-4 h-4" />,
      step: 3
    },
    {
      id: 'conectores',
      name: 'Conectores',
      color: 'bg-emerald-100',
      borderColor: 'border-emerald-300',
      icon: <Guitar className="w-4 h-4" />,
      step: 4
    },
    {
      id: 'melodia-secundaria',
      name: 'Melodía Secundaria',
      color: 'bg-cyan-100',
      borderColor: 'border-cyan-300',
      icon: <Volume2 className="w-4 h-4" />,
      step: 5
    },
    {
      id: 'instrumentacion',
      name: 'Instrumentación',
      color: 'bg-red-100',
      borderColor: 'border-red-300',
      icon: <Mic className="w-4 h-4" />,
      step: 6
    },
    {
      id: 'otros',
      name: 'Otros (Armonía, Dinámicas, etc.)',
      color: 'bg-gray-100',
      borderColor: 'border-gray-300',
      icon: <Music className="w-4 h-4" />,
      step: 7
    }
  ];

  // Filtrar capas según el paso actual del workflow
  const getVisibleLayers = () => {
    return layers.filter(layer => layer.step <= currentWorkflowStep);
  };

  // Autosave
  useEffect(() => {
    const autoSave = () => {
      const projectData = {
        studentName,
        studentSurname,
        layersData,
        videoInfo,
        totalDuration,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem('currentProject', JSON.stringify(projectData));
    };

    const interval = setInterval(autoSave, 30000); // Guardar cada 30 segundos
    return () => clearInterval(interval);
  }, [layersData, videoInfo, totalDuration, studentName, studentSurname]);

  // Cargar proyecto guardado
  useEffect(() => {
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        const projectData = JSON.parse(savedProject);
        if (projectData.studentName === studentName && projectData.studentSurname === studentSurname) {
          setLayersData(projectData.layersData || []);
          setVideoInfo(projectData.videoInfo);
          setTotalDuration(projectData.totalDuration || 240);
        }
      } catch (error) {
        console.error('Error cargando proyecto:', error);
      }
    }
  }, [studentName, studentSurname]);

  // Manejar shortcuts de teclado
  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
    // Solo si no estamos escribiendo en un input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Barra espaciadora para play/pause
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      setIsPlaying(prev => !prev);
    }
    
    // Zoom shortcuts: Cmd/Ctrl + Left/Right arrows
    if ((e.metaKey || e.ctrlKey) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') {
        // Zoom out
        setZoom(prev => Math.max(0.5, prev - 0.5));
      } else if (e.key === 'ArrowRight') {
        // Zoom in
        setZoom(prev => Math.min(10, prev + 0.5));
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  // Función para actualizar los datos de las capas (memorizada para evitar re-renders)
  const updateLayerData = useCallback((layerId: string, blocks: any[]) => {
    setLayersData(prev => {
      const updated = prev.filter(layer => layer.id !== layerId);
      return [...updated, { id: layerId, name: layers.find(l => l.id === layerId)?.name || '', blocks }];
    });
  }, [layers]);

  // Manejar cambio de duración del video
  const handleVideoDurationChange = (duration: number) => {
    setTotalDuration(duration);
  };

  // Sincronizar el tiempo actual con el reproductor en tiempo real
  const handleTimeUpdate = (time: number) => {
    console.log('Timeline time update:', time); // Debug log
    setCurrentTime(time);
  };

  // Manejar información del video
  const handleVideoInfoChange = (info: { title: string; url: string }) => {
    setVideoInfo(info);
  };

  // Manejar importación de datos
  const handleImportData = (data: any) => {
    setVideoInfo(data.videoInfo);
    setTotalDuration(data.videoInfo.duration);
    setLayersData(data.layers);
    // Aquí podrías también cargar automáticamente el video de YouTube si quisieras
  };

  // Generar marcas de tiempo más precisas basadas en el zoom
  const getTimeMarks = () => {
    let interval = 10;
    
    if (zoom >= 8) interval = 1;
    else if (zoom >= 4) interval = 5;
    else if (zoom >= 2) interval = 10;
    
    return Array.from({ length: Math.ceil(totalDuration / interval) + 1 }, (_, i) => i * interval);
  };

  const timeMarks = getTimeMarks();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Controles superiores */}
      <div className="bg-gray-50 border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">Tiempo: {formatTime(currentTime)}</span>
              <span className="text-xs text-gray-500">
                {isPlaying ? '(Reproduciendo)' : '(Pausado)'} - ESPACIO: play/pause | Cmd+←→: zoom
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">1 usuario conectado (modo individual)</span>
              <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Activar Colaborativo
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExport(!showExport)}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <label className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const data = JSON.parse(event.target?.result as string);
                        handleImportData(data);
                      } catch (error) {
                        alert('Error al importar archivo. Verifique que sea un archivo JSON válido.');
                      }
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Panel de YouTube, Workflow y Export */}
      <div className="border-b bg-gray-50 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <YouTubePlayer
            currentTime={currentTime}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            isPlaying={isPlaying}
            onVideoDurationChange={handleVideoDurationChange}
            onVideoInfoChange={handleVideoInfoChange}
          />
          
          <WorkflowSteps 
            currentStep={currentWorkflowStep}
            onStepChange={setCurrentWorkflowStep}
          />
          
          {showExport && (
            <ExportSummary 
              layers={layersData} 
              totalDuration={totalDuration}
              videoInfo={videoInfo}
              studentName={studentName}
              studentSurname={studentSurname}
              onImportData={handleImportData}
            />
          )}
        </div>
      </div>

      {/* Barra de herramientas de bloques musicales */}
      <MusicBlocksToolbar currentWorkflowStep={currentWorkflowStep} />

      {/* Área principal de la línea de tiempo */}
      <div className="flex">
        {/* Panel lateral con nombres de capas */}
        <div className="w-52 bg-gray-50 border-r">
          <div className="h-12 bg-gray-100 border-b flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">Capas de Análisis</span>
          </div>
          {getVisibleLayers().map((layer) => (
            <div
              key={layer.id}
              className={`h-20 ${layer.color} ${layer.borderColor} border-b flex items-center px-3 hover:opacity-80 transition-opacity ${
                layer.step === currentWorkflowStep ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <div className="flex items-center space-x-2">
                {layer.icon}
                <span className="text-xs font-medium text-gray-800 leading-tight">{layer.name}</span>
                {layer.step === currentWorkflowStep && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Área de la línea de tiempo */}
        <div className="flex-1 overflow-x-auto timeline-scroll">
          {/* Regla de tiempo */}
          <div className="h-12 bg-gray-100 border-b relative" style={{ width: `${totalDuration * zoom * 4}px` }}>
            {timeMarks.map((time) => (
              <div
                key={time}
                className="absolute top-0 h-full flex flex-col justify-center"
                style={{ left: `${time * zoom * 4}px` }}
              >
                <div className="w-px h-full bg-gray-300"></div>
                <span className="absolute top-1 text-xs text-gray-600 -translate-x-1/2">
                  {formatTime(time)}
                </span>
              </div>
            ))}
            
            {/* Indicador de tiempo actual */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-500 z-10 transition-all duration-75"
              style={{ left: `${currentTime * zoom * 4}px` }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="absolute -top-6 -left-4 text-xs text-red-600 font-mono bg-white px-1 rounded">
                {formatTime(Math.floor(currentTime))}
              </div>
            </div>
          </div>

          {/* Capas de la línea de tiempo */}
          {getVisibleLayers().map((layer) => (
            <TimelineLayer
              key={layer.id}
              layerId={layer.id}
              layerName={layer.name}
              color={layer.color}
              borderColor={layer.borderColor}
              duration={totalDuration}
              zoom={zoom}
              onTimeClick={setCurrentTime}
              onBlocksChange={(blocks) => updateLayerData(layer.id, blocks)}
              isActive={layer.step === currentWorkflowStep}
            />
          ))}
        </div>
      </div>

      {/* Panel inferior para comentarios, notas y zoom */}
      <div className="bg-gray-50 border-t px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Palette className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Agregar comentario o nota sobre el análisis..."
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-96"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              Agregar
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Zoom:</label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600">{zoom}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
