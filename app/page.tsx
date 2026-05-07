"use client";

import { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Calendar, ChevronDown, Filter, Download, Plus, 
  GripHorizontal, MoreVertical, TrendingUp, TrendingDown,
  LayoutDashboard, Settings2, Clock, AlertCircle, Eye
} from 'lucide-react';
import { fetchDashboardStats } from '@/lib/glpi/service';

// Mock Data
const volumeData = [
  { date: '1 Abr', creados: 45, resueltos: 38 },
  { date: '5 Abr', creados: 52, resueltos: 49 },
  { date: '10 Abr', creados: 38, resueltos: 42 },
  { date: '15 Abr', creados: 65, resueltos: 55 },
  { date: '20 Abr', creados: 48, resueltos: 60 },
  { date: '25 Abr', creados: 58, resueltos: 54 },
  { date: '28 Abr', creados: 42, resueltos: 45 },
];

const priorityData = [
  { name: 'Urgente', value: 15, color: '#ef4444' }, // red-500
  { name: 'Alta', value: 30, color: '#f97316' },    // orange-500
  { name: 'Media', value: 45, color: '#eab308' },   // yellow-500
  { name: 'Baja', value: 10, color: '#3b82f6' },    // blue-500
];

const techData = [
  { name: 'Ana S.', tickets: 145 },
  { name: 'Carlos R.', tickets: 132 },
  { name: 'Miguel T.', tickets: 98 },
  { name: 'Laura M.', tickets: 87 },
  { name: 'David P.', tickets: 76 },
];

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("Este Mes");
  const [stats, setStats] = useState({
    open: 0,
    assigned: 0,
    resolved: 0,
    closed: 0,
    unassigned: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
      setIsLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-full">
      
      {/* Dashboard Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Dashboard Selector */}
        <div className="flex items-center gap-3 relative cursor-pointer group">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <LayoutDashboard size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Dashboard Activo</p>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Resumen de Helpdesk
              </h1>
              <ChevronDown size={18} className="text-gray-400 group-hover:text-blue-500" />
            </div>
          </div>
        </div>

        {/* Right: Actions & Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar size={16} className="text-gray-500" />
            {dateRange}
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          </button>
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          
          <button className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm" title="Filtros Avanzados">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shadow-sm" title="Exportar Reporte">
            <Download size={18} />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-[#12263F] text-white rounded-md text-sm font-medium hover:bg-[#1A3148] transition-colors shadow-sm ml-2">
            <Plus size={16} />
            Añadir Widget
          </button>
        </div>
      </div>

      {/* Widgets Grid */}
      <div className="space-y-6">
        
        {/* Scorecards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Tickets Vencidos - Rojo (Emergencia) */}
          <div className="bg-[#FFF1F2] rounded-lg shadow-sm border border-[#FECDD3] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#881337]">Tickets Vencidos</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <AlertCircle size={14} className="text-[#BE123C]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#881337] mt-2">
              {isLoading ? "..." : (stats.open + stats.unassigned)}
            </h3>
          </div>

          {/* Vencen Hoy - Naranja/Amarillo (Advertencia) */}
          <div className="bg-[#FFFBEB] rounded-lg shadow-sm border border-[#FEF3C7] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#92400E]">Vencen Hoy</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <Clock size={14} className="text-[#D97706]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#92400E] mt-2">
              {isLoading ? "..." : "0"}
            </h3>
          </div>

          {/* Sin Asignar - Naranja (Acción requerida) */}
          <div className="bg-[#FFF7ED] rounded-lg shadow-sm border border-[#FFEDD5] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#9A3412]">Sin Asignar</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <UserPlus size={14} className="text-[#EA580C]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#9A3412] mt-2">
              {isLoading ? "..." : stats.unassigned}
            </h3>
          </div>

          {/* Tickets Abiertos - Azul (Volumen normal) */}
          <div className="bg-[#EFF6FF] rounded-lg shadow-sm border border-[#DBEAFE] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#1E40AF]">Tickets Abiertos</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <Ticket size={14} className="text-[#2563EB]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#1E40AF] mt-2">
              {isLoading ? "..." : stats.open}
            </h3>
          </div>

          {/* En Espera - Gris/Morado (Pausado) */}
          <div className="bg-[#F8FAFC] rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#475569]">En Espera</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <Clock size={14} className="text-[#64748B]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#475569] mt-2">
              {isLoading ? "..." : stats.assigned}
            </h3>
          </div>

          {/* Tickets en Seguimiento - Verde (Fluyendo) */}
          <div className="bg-[#F0FDF4] rounded-lg shadow-sm border border-[#DCFCE7] p-4 flex flex-col justify-between relative min-h-[120px]">
            <div className="flex justify-between items-start">
              <p className="text-[13px] font-semibold text-[#166534]">Tickets en Seguimiento</p>
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center shadow-sm">
                <Eye size={14} className="text-[#16A34A]" />
              </div>
            </div>
            <h3 className="text-4xl font-bold text-[#166534] mt-2">
              {isLoading ? "..." : "0"}
            </h3>
          </div>

        </div>

        </div>

        {/* Main Chart Row */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 group relative hover:shadow-md transition-shadow">
          <div className="absolute top-3 right-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-move transition-opacity z-10 flex items-center gap-2">
            <button className="hover:text-gray-600"><Settings2 size={16} /></button>
            <GripHorizontal size={18} />
          </div>
          
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-gray-800">Volumen de Tickets: Creados vs Resueltos</h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Creados
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Resueltos
              </div>
            </div>
          </div>
          
          <div className="p-6 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorResueltos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="creados" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCreados)" activeDot={{ r: 6, strokeWidth: 0 }} />
                <Area type="monotone" dataKey="resueltos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorResueltos)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bar Chart: Techs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 group relative hover:shadow-md transition-shadow flex flex-col">
            <div className="absolute top-3 right-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-move transition-opacity z-10 flex items-center gap-2">
              <button className="hover:text-gray-600"><Settings2 size={16} /></button>
              <GripHorizontal size={18} />
            </div>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-bold text-gray-800">Top 5 Técnicos (Tickets Resueltos)</h2>
            </div>
            <div className="p-6 flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={techData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="tickets" fill="#12263F" radius={[0, 4, 4, 0]} barSize={24}>
                    {techData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#12263F'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart: Priority */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 group relative hover:shadow-md transition-shadow flex flex-col">
            <div className="absolute top-3 right-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-move transition-opacity z-10 flex items-center gap-2">
              <button className="hover:text-gray-600"><Settings2 size={16} /></button>
              <GripHorizontal size={18} />
            </div>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-[15px] font-bold text-gray-800">Tickets Abiertos por Prioridad</h2>
            </div>
            <div className="p-6 flex-1 min-h-[300px] flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">100</p>
                  <p className="text-xs text-gray-500 font-medium">Totales</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Vertical Legend */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-3">
                {priorityData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}
