
import React from 'react';
import { Music, Waves, Guitar, Mic, Piano, Volume2, Layers, MoreHorizontal } from 'lucide-react';

interface MusicBlocksToolbarProps {
  currentWorkflowStep: number;
}

const MusicBlocksToolbar: React.FC<MusicBlocksToolbarProps> = ({ currentWorkflowStep }) => {
  const blockCategories = [
    {
      name: 'Estructura Formal',
      icon: <Music className="w-4 h-4" />,
      blocks: [
        { type: 'intro', label: 'Intro', color: 'bg-purple-200', defaultDuration: 8 },
        { type: 'verse', label: 'A (Estrofa)', color: 'bg-purple-300', defaultDuration: 16 },
        { type: 'chorus', label: 'B (Estribillo)', color: 'bg-purple-400', defaultDuration: 16 },
        { type: 'bridge', label: 'Puente', color: 'bg-purple-500', defaultDuration: 8 },
        { type: 'coda', label: 'Coda', color: 'bg-purple-600', defaultDuration: 4 }
      ]
    },
    {
      name: 'Melodía Principal',
      icon: <Volume2 className="w-4 h-4" />,
      blocks: [
        { type: 'tema-a', label: 'TEMA A', color: 'bg-blue-200', defaultDuration: 8 },
        { type: 'tema-b', label: 'TEMA B', color: 'bg-blue-300', defaultDuration: 8 },
        { type: 'tema-c', label: 'TEMA C', color: 'bg-blue-400', defaultDuration: 8 },
        { type: 'melodia-ritmica', label: 'Melodía Rítmica', color: 'bg-blue-500', defaultDuration: 4 },
        { type: 'melodia-expresiva', label: 'Melodía Expresiva', color: 'bg-blue-600', defaultDuration: 4 },
        { type: 'desarrollo-motivico', label: 'Desarrollo motívico', color: 'bg-blue-700', defaultDuration: 4 }
      ]
    },
    {
      name: 'Melodía Secundaria',
      icon: <Waves className="w-4 h-4" />,
      blocks: [
        { type: 'linea-armonica', label: 'Línea Armónica', color: 'bg-cyan-200', defaultDuration: 8 },
        { type: 'contracanto-una-voz', label: 'Contracanto (una voz)', color: 'bg-cyan-300', defaultDuration: 8 },
        { type: 'voicing-estable', label: 'Voicing estable (3 o más voces)', color: 'bg-cyan-400', defaultDuration: 8 },
        { type: 'soli-unisono', label: 'Soli unísono', color: 'bg-cyan-500', defaultDuration: 4 },
        { type: 'soli-dos-voces', label: 'Soli a dos voces', color: 'bg-cyan-600', defaultDuration: 4 },
        { type: 'soli-tres-voces', label: 'Soli a 3 voces o más', color: 'bg-cyan-700', defaultDuration: 4 }
      ]
    },
    {
      name: 'Contracanto/Voicing',
      icon: <Layers className="w-4 h-4" />,
      blocks: [
        { type: 'counterpoint', label: 'Contracanto', color: 'bg-teal-200', defaultDuration: 4 },
        { type: 'voicing', label: 'Voicing', color: 'bg-teal-300', defaultDuration: 8 },
        { type: 'harmony-line', label: 'Línea Armónica', color: 'bg-teal-400', defaultDuration: 4 }
      ]
    },
    {
      name: 'Conectores',
      icon: <Guitar className="w-4 h-4" />,
      blocks: [
        { type: 'fill', label: 'Fill', color: 'bg-emerald-200', defaultDuration: 2 },
        { type: 'transition', label: 'Transición', color: 'bg-emerald-300', defaultDuration: 4 },
        { type: 'pickup', label: 'Anacrusa / Pickup', color: 'bg-emerald-400', defaultDuration: 1 }
      ]
    },
    {
      name: 'Acompañamiento',
      icon: <Guitar className="w-4 h-4" />,
      blocks: [
        { type: 'marcacion', label: 'Marcación', color: 'bg-green-200', defaultDuration: 4 },
        { type: 'comping', label: 'Comping', color: 'bg-green-300', defaultDuration: 8 },
        { type: 'groove', label: 'Groove', color: 'bg-green-400', defaultDuration: 8 }
      ]
    },
    {
      name: 'Armonía',
      icon: <Piano className="w-4 h-4" />,
      blocks: [
        { type: 'rearmonizacion', label: 'Rearmonización', color: 'bg-yellow-200', defaultDuration: 8 },
        { type: 'modulacion', label: 'Modulación', color: 'bg-yellow-300', defaultDuration: 4 },
        { type: 'cadencia', label: 'Cadencia', color: 'bg-yellow-400', defaultDuration: 2 },
        { type: 'tonicizacion', label: 'Tonicización', color: 'bg-yellow-500', defaultDuration: 4 }
      ]
    },
    {
      name: 'Instrumentación',
      icon: <Mic className="w-4 h-4" />,
      blocks: [
        { type: 'solo', label: 'Solo', color: 'bg-red-200', defaultDuration: 16 },
        { type: 'soli', label: 'Soli', color: 'bg-red-300', defaultDuration: 8 },
        { type: 'riff', label: 'Riff', color: 'bg-red-400', defaultDuration: 4 },
        { type: 'hit', label: 'Hit', color: 'bg-red-500', defaultDuration: 0.5 },
        { type: 'textura', label: 'Textura', color: 'bg-red-600', defaultDuration: 8 }
      ]
    },
    {
      name: 'Otros',
      icon: <MoreHorizontal className="w-4 h-4" />,
      blocks: [
        { type: 'dynamics', label: 'Dinámicas', color: 'bg-gray-200', defaultDuration: 4 },
        { type: 'articulation', label: 'Articulación', color: 'bg-gray-300', defaultDuration: 2 },
        { type: 'effect', label: 'Efecto', color: 'bg-gray-400', defaultDuration: 1 }
      ]
    }
  ];

  // Map categories to workflow steps
  const getVisibleCategories = () => {
    const categoryStepMap: Record<string, number> = {
      'Estructura Formal': 1,
      'Melodía Principal': 2,
      'Acompañamiento': 3,
      'Conectores': 4,
      'Melodía Secundaria': 5,
      'Contracanto/Voicing': 5, // Same as step 5
      'Instrumentación': 6,
      'Otros': 7,
      'Armonía': 7 // Same as step 7
    };

    return blockCategories.filter(category => 
      categoryStepMap[category.name] <= currentWorkflowStep
    );
  };

  const handleDragStart = (e: React.DragEvent, block: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="bg-white border-b p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Elementos Musicales</h3>
        <p className="text-xs text-gray-500">Arrastra los bloques a las capas de la línea de tiempo. Puedes editarlos después de colocarlos.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {getVisibleCategories().map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center space-x-1 mb-2">
              {category.icon}
              <h4 className="text-xs font-medium text-gray-600">{category.name}</h4>
            </div>
            <div className="space-y-1">
              {category.blocks.map((block) => (
                <div
                  key={block.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`${block.color} px-2 py-1 rounded text-xs font-medium text-gray-800 cursor-grab hover:shadow-md transition-shadow border border-gray-200 active:cursor-grabbing truncate`}
                  title={block.label}
                >
                  {block.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicBlocksToolbar;
