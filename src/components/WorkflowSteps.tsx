import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, Circle, Info } from 'lucide-react';

interface WorkflowStepsProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ currentStep, onStepChange }) => {
  const steps = [
    {
      id: 1,
      title: 'Estructura Formal',
      description: 'Analiza la estructura general del tema musical',
      icon: '🏗️'
    },
    {
      id: 2,
      title: 'Melodía Principal',
      description: 'Identifica temas, motivos y desarrollo melódico',
      icon: '🎵'
    },
    {
      id: 3,
      title: 'Acompañamiento',
      description: 'Analiza patrones rítmicos y armónicos de base',
      icon: '🎸'
    },
    {
      id: 4,
      title: 'Conectores',
      description: 'Identifica fills, transiciones y anacrusas',
      icon: '🔗'
    },
    {
      id: 5,
      title: 'Melodía Secundaria',
      description: 'Contracantos, voicing y líneas melódicas adicionales',
      icon: '🎼'
    },
    {
      id: 6,
      title: 'Instrumentación',
      description: 'Identifica y analiza los instrumentos presentes',
      icon: '🎺'
    },
    {
      id: 7,
      title: 'Otros Elementos',
      description: 'Armonía, dinámicas, efectos y articulación',
      icon: '⚡'
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Flujo de Trabajo</h3>
      
      {/* Indicador de progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Paso {currentStep} de {steps.length}</span>
          <span className="text-sm text-gray-600">{Math.round((currentStep / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Paso actual únicamente */}
      {currentStepData && (
        <div className="p-4 bg-blue-50 border-blue-200 border rounded-lg shadow-sm mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{currentStepData.icon}</span>
                <h4 className="text-lg font-semibold text-blue-800">
                  {currentStepData.title}
                </h4>
              </div>
              <p className="text-gray-700">{currentStepData.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Controles de navegación */}
      <div className="flex justify-between">
        <button
          onClick={() => onStepChange(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                step.id === currentStep
                  ? 'bg-blue-600'
                  : step.id < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              onClick={() => onStepChange(step.id)}
              title={step.title}
            />
          ))}
        </div>
        
        <button
          onClick={() => onStepChange(Math.min(steps.length, currentStep + 1))}
          disabled={currentStep === steps.length}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default WorkflowSteps;