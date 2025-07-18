import React, { useState, useRef } from 'react';
import { Download, FileText, Table, FileSpreadsheet, Upload } from 'lucide-react';

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

interface ExportData {
  studentInfo: {
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
  version: string;
}

interface ExportSummaryProps {
  layers: Layer[];
  totalDuration: number;
  videoInfo?: { title: string; url: string };
  studentName: string;
  studentSurname: string;
  onImportData?: (data: ExportData) => void;
}

const ExportSummary: React.FC<ExportSummaryProps> = ({ 
  layers, 
  totalDuration, 
  videoInfo,
  studentName,
  studentSurname,
  onImportData 
}) => {
  const [exportFormat, setExportFormat] = useState<'text' | 'csv' | 'timeline'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateExportData = (): ExportData => {
    return {
      studentInfo: {
        name: studentName,
        surname: studentSurname,
        fullName: `${studentName} ${studentSurname}`
      },
      videoInfo: {
        title: videoInfo?.title || 'Sin título',
        url: videoInfo?.url || '',
        duration: totalDuration
      },
      layers,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  };

  const generateTextSummary = () => {
    const data = generateExportData();
    let summary = "=== RESUMEN DEL ANÁLISIS MUSICAL ===\n\n";
    
    summary += `Estudiante: ${data.studentInfo.fullName}\n`;
    summary += `Video: ${data.videoInfo.title}\n`;
    summary += `URL: ${data.videoInfo.url}\n`;
    summary += `Duración: ${formatTime(data.videoInfo.duration)}\n`;
    summary += `Fecha de análisis: ${new Date(data.exportDate).toLocaleDateString()}\n\n`;
    
    // Resumen por capas
    layers.forEach(layer => {
      if (layer.blocks.length > 0) {
        summary += `${layer.name.toUpperCase()}:\n`;
        layer.blocks
          .sort((a, b) => a.startTime - b.startTime)
          .forEach(block => {
            const endTime = block.startTime + block.duration;
            const displayText = block.customText 
              ? `${block.label} - ${block.customText}`
              : block.label;
            summary += `  • ${formatTime(block.startTime)} - ${formatTime(endTime)}: ${displayText}\n`;
          });
        summary += "\n";
      }
    });

    // Línea de tiempo cronológica
    const allBlocks: (Block & { layerName: string })[] = [];
    layers.forEach(layer => {
      layer.blocks.forEach(block => {
        allBlocks.push({ ...block, layerName: layer.name });
      });
    });

    if (allBlocks.length > 0) {
      summary += "=== LÍNEA DE TIEMPO CRONOLÓGICA ===\n\n";
      allBlocks
        .sort((a, b) => a.startTime - b.startTime)
        .forEach(block => {
          const endTime = block.startTime + block.duration;
          const displayText = block.customText 
            ? `${block.label} - ${block.customText}`
            : block.label;
          summary += `${formatTime(block.startTime)} - ${formatTime(endTime)} | ${block.layerName}: ${displayText}\n`;
        });
    }

    return summary;
  };

  const generateCSV = () => {
    const data = generateExportData();
    let csv = `Estudiante,${data.studentInfo.fullName}\n`;
    csv += `Video,${data.videoInfo.title}\n`;
    csv += `URL,${data.videoInfo.url}\n`;
    csv += `Duración,${formatTime(data.videoInfo.duration)}\n`;
    csv += `Fecha,${new Date(data.exportDate).toLocaleDateString()}\n\n`;
    csv += "Tiempo Inicio,Tiempo Fin,Capa,Elemento,Información Adicional\n";
    
    layers.forEach(layer => {
      layer.blocks
        .sort((a, b) => a.startTime - b.startTime)
        .forEach(block => {
          const endTime = block.startTime + block.duration;
          csv += `${formatTime(block.startTime)},${formatTime(endTime)},"${layer.name}","${block.label}","${block.customText || ''}"\n`;
        });
    });

    return csv;
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (exportFormat) {
      case 'text':
        content = generateTextSummary();
        filename = 'analisis-musical.txt';
        mimeType = 'text/plain';
        break;
      case 'csv':
        content = generateCSV();
        filename = 'analisis-musical.csv';
        mimeType = 'text/csv';
        break;
      case 'timeline':
        content = generateTimelineTable();
        filename = 'timeline-analisis.csv';
        mimeType = 'text/csv';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const data = generateExportData();
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analisis-musical-completo.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: ExportData = JSON.parse(content);
        
        if (data.layers && data.videoInfo && onImportData) {
          onImportData(data);
        } else {
          alert('Archivo no válido. Asegúrate de importar un archivo JSON exportado desde esta aplicación.');
        }
      } catch (error) {
        alert('Error al leer el archivo. Asegúrate de que sea un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const generateTimelineTable = () => {
    const intervals = 10; // Cada 10 segundos
    const timeSlots = Math.ceil(totalDuration / intervals);
    
    let table = "Tiempo,";
    layers.forEach(layer => {
      table += `${layer.name},`;
    });
    table += "\n";

    for (let i = 0; i < timeSlots; i++) {
      const timeStart = i * intervals;
      const timeEnd = Math.min((i + 1) * intervals, totalDuration);
      table += `${formatTime(timeStart)}-${formatTime(timeEnd)},`;
      
      layers.forEach(layer => {
        const activeBlocks = layer.blocks.filter(block => 
          block.startTime < timeEnd && (block.startTime + block.duration) > timeStart
        );
        
        const blockNames = activeBlocks.map(block => 
          block.customText ? `${block.label} (${block.customText})` : block.label
        );
        
        table += `"${blockNames.join('; ')}",`;
      });
      table += "\n";
    }

    return table;
  };

  const previewContent = () => {
    switch (exportFormat) {
      case 'text':
        return generateTextSummary();
      case 'csv':
        return generateCSV();
      case 'timeline':
        return generateTimelineTable();
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">Exportar/Importar</span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleImport}
              className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Importar</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Completo</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="text"
              checked={exportFormat === 'text'}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="text-blue-600"
            />
            <FileText className="w-4 h-4" />
            <span className="text-sm">Resumen de texto</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="text-blue-600"
            />
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-sm">CSV (Excel)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="timeline"
              checked={exportFormat === 'timeline'}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="text-blue-600"
            />
            <Table className="w-4 h-4" />
            <span className="text-sm">Tabla temporal</span>
          </label>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          <span>Descargar</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h4>
        <pre className="text-xs bg-gray-50 p-3 rounded border max-h-64 overflow-auto font-mono">
          {previewContent()}
        </pre>
      </div>
    </div>
  );
};

export default ExportSummary;
