
import Timeline from '../components/Timeline';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = () => {
  const [studentName, setStudentName] = useState('');
  const [studentSurname, setStudentSurname] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('studentName');
    const savedSurname = localStorage.getItem('studentSurname');
    if (savedName && savedSurname) {
      setStudentName(savedName);
      setStudentSurname(savedSurname);
      setShowForm(false);
    }
  }, []);

  const handleSaveStudentInfo = () => {
    if (studentName.trim() && studentSurname.trim()) {
      localStorage.setItem('studentName', studentName);
      localStorage.setItem('studentSurname', studentSurname);
      setShowForm(false);
    }
  };

  const handleEditInfo = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analizador de Arreglos</h1>
          <p className="text-sm text-gray-600 mb-6">Por favor, ingrese sus datos para comenzar</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido:
              </label>
              <input
                type="text"
                value={studentSurname}
                onChange={(e) => setStudentSurname(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese su apellido"
              />
            </div>
            <button
              onClick={handleSaveStudentInfo}
              disabled={!studentName.trim() || !studentSurname.trim()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar Análisis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analizador de Arreglos</h1>
              <p className="text-sm text-gray-600">
                Estudiante: {studentName} {studentSurname} 
                <button 
                  onClick={handleEditInfo}
                  className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                >
                  (editar)
                </button>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/teacher"
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                <span>Visor Docente</span>
              </Link>
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>Modo Individual</option>
                <option>Modo Colaborativo</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                Nueva Sesión
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Timeline studentName={studentName} studentSurname={studentSurname} />
      </main>
    </div>
  );
};

export default Index;
