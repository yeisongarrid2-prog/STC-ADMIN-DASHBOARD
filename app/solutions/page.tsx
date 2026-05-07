import { Search, Folder, FileText, ChevronRight, BookOpen, Plus } from "lucide-react";

const categories = [
  { id: 1, name: "Problemas Comunes (FAQ)", articles: 24, icon: BookOpen, color: "text-blue-500 bg-blue-50" },
  { id: 2, name: "Configuración de Red", articles: 12, icon: Folder, color: "text-emerald-500 bg-emerald-50" },
  { id: 3, name: "Hardware y Periféricos", articles: 18, icon: Folder, color: "text-amber-500 bg-amber-50" },
  { id: 4, name: "Accesos y VPN", articles: 9, icon: Folder, color: "text-purple-500 bg-purple-50" },
];

const recentArticles = [
  { id: 101, title: "Cómo configurar la VPN corporativa en Windows 11", category: "Accesos y VPN", views: 342, author: "Miguel Torres" },
  { id: 102, title: "Pasos para reiniciar la contraseña del ERP", category: "Problemas Comunes", views: 890, author: "Ana Silva" },
  { id: 103, title: "Solución a problemas de impresión en red", category: "Hardware y Periféricos", views: 215, author: "Carlos Ruiz" },
  { id: 104, title: "Instalación del cliente de correo Outlook", category: "Problemas Comunes", views: 156, author: "Laura Martínez" },
  { id: 105, title: "Guía de conexión a red Wi-Fi de invitados", category: "Configuración de Red", views: 420, author: "Miguel Torres" },
];

export default function SolutionsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Base de Conocimiento</h1>
          <p className="text-gray-500 mt-1">Gestiona artículos y soluciones para agilizar el soporte</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#12263F] text-white rounded-xl text-sm font-medium hover:bg-[#1A3148] transition-colors shadow-sm">
            <Plus size={18} />
            Nuevo Artículo
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Sidebar Categories */}
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en artículos..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm shadow-sm"
            />
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Categorías</h3>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li key={category.id}>
                  <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <category.icon size={18} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                      {category.articles}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Article List Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-0">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-gray-900">Artículos Recientes</h2>
            <button className="text-sm text-blue-600 font-medium hover:underline">Ver todos</button>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2">
            <ul className="space-y-1">
              {recentArticles.map((article) => (
                <li key={article.id}>
                  <a href="#" className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 text-gray-300 group-hover:text-blue-500 transition-colors">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            Por {article.author}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-4">
                      <span className="text-xs text-gray-400 font-medium">{article.views} vistas</span>
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}
