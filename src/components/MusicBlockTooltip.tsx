import React, { useState } from 'react';
import { Info, Music, Volume2 } from 'lucide-react';

interface MusicBlockTooltipProps {
  blockType: string;
  blockLabel: string;
  children: React.ReactNode;
}

const MusicBlockTooltip: React.FC<MusicBlockTooltipProps> = ({ 
  blockType, 
  blockLabel, 
  children 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Información educativa sobre cada tipo de elemento musical
  const getTooltipInfo = (type: string, label: string) => {
    const tooltips: { [key: string]: { description: string; example: string; } } = {
      // Estructura Formal
      'intro': {
        description: 'Sección inicial que presenta el tema musical',
        example: 'Generalmente de 4-8 compases que prepara la entrada principal'
      },
      'verso': {
        description: 'Sección principal que desarrolla la narrativa musical',
        example: 'Contiene la melodía principal y avanza la historia'
      },
      'estribillo': {
        description: 'Sección que se repite, generalmente la más memorable',
        example: 'Parte "pegadiza" que se queda en la memoria del oyente'
      },
      'puente': {
        description: 'Sección de contraste que conecta otras partes',
        example: 'Proporciona variedad armónica y melódica'
      },
      'final': {
        description: 'Sección conclusiva de la pieza musical',
        example: 'Puede ser abrupto, fade out o con resolución armónica'
      },
      
      // Melodía Principal
      'tema-a': {
        description: 'Primera idea melódica principal del tema',
        example: 'Melodía característica que define la identidad de la canción'
      },
      'tema-b': {
        description: 'Segunda idea melódica contrastante',
        example: 'Proporciona variedad al tema principal'
      },
      'melodia-ritmica': {
        description: 'Melodía que enfatiza el aspecto rítmico',
        example: 'Línea melódica con acentos y patrones rítmicos marcados'
      },
      'desarrollo-motivico': {
        description: 'Variaciones y elaboraciones de motivos melódicos',
        example: 'Transformaciones de ideas musicales básicas'
      },
      
      // Melodía Secundaria
      'contracanto': {
        description: 'Melodía secundaria que acompaña la principal',
        example: 'Una línea melódica independiente que complementa'
      },
      'voicing': {
        description: 'Arreglo de múltiples voces en acordes',
        example: 'Distribución de notas en diferentes instrumentos o voces'
      },
      'soli-unisono': {
        description: 'Varios instrumentos tocando la misma melodía',
        example: 'Sección donde múltiples instrumentos tocan al unísono'
      },
      
      // Conectores
      'fill': {
        description: 'Elemento musical que llena espacios entre secciones',
        example: 'Breve pasaje instrumental, común en batería'
      },
      'transicion': {
        description: 'Pasaje que conecta una sección con otra',
        example: 'Elemento que suaviza el cambio entre partes'
      },
      'anacrusa': {
        description: 'Nota(s) que preceden al primer tiempo fuerte',
        example: 'Pickup que anticipa la entrada principal'
      },
      
      // Acompañamiento
      'bajo': {
        description: 'Línea de bajo que define la base armónica',
        example: 'Fundamento grave que sostiene la armonía'
      },
      'acordes': {
        description: 'Progresión armónica de soporte',
        example: 'Secuencia de acordes que acompañan la melodía'
      },
      'patron-ritmico': {
        description: 'Figura rítmica repetitiva de acompañamiento',
        example: 'Groove o patrón que mantiene el pulso'
      }
    };

    return tooltips[type.toLowerCase()] || tooltips[label.toLowerCase().replace(/\s+/g, '-')] || {
      description: 'Elemento musical del análisis',
      example: 'Consulta con tu profesor para más información'
    };
  };

  const tooltipInfo = getTooltipInfo(blockType, blockLabel);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      
      {showTooltip && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
              <Music className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">{blockLabel}</h4>
              <p className="text-sm text-gray-700 mb-3">{tooltipInfo.description}</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">EJEMPLO</span>
                </div>
                <p className="text-xs text-gray-600">{tooltipInfo.example}</p>
              </div>
            </div>
          </div>
          
          {/* Flecha del tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default MusicBlockTooltip;