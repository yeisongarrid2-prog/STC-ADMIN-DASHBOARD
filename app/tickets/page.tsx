"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, MoreHorizontal, Clock, ArrowUpRight, ChevronDown, 
  Zap, FileText, CheckSquare, Trash2, UserPlus, Edit2, Mail, CheckCircle2,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

import { useTicketStore, Ticket } from "../store/ticketStore";
import { fetchGlpiTickets } from "@/lib/glpi/service";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/Skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
const statusStyles: Record<string, string> = {
  "Nuevo": "bg-blue-50 text-blue-700 border-blue-200",
  "En curso": "bg-amber-50 text-amber-700 border-amber-200",
  "En espera": "bg-slate-100 text-slate-700 border-slate-200",
  "Resuelto": "bg-green-50 text-green-700 border-green-200",
};

const priorityStyles: Record<string, string> = {
  "Alta": "text-red-600 bg-red-50",
  "Media": "text-amber-600 bg-amber-50",
  "Baja": "text-slate-600 bg-slate-50",
};

const views = [
  { id: 'all', label: 'Todas las Solicitudes', icon: <Filter size={16} /> },
  { id: 'abiertos', label: 'Tickets Nuevos', icon: <div className="w-2 h-2 rounded-full bg-blue-500" /> },
  { id: 'en-curso', label: 'En Curso', icon: <div className="w-2 h-2 rounded-full bg-amber-500" /> },
  { id: 'resueltos', label: 'Resueltos', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
  { id: 'vencidos', label: 'Tickets Vencidos', icon: <div className="w-2 h-2 rounded-full bg-red-500" /> },
  { id: 'hoy', label: 'Vencen Hoy', icon: <div className="w-2 h-2 rounded-full bg-orange-400" /> },
  { id: 'sin-asignar', label: 'Sin Asignar', icon: <div className="w-2 h-2 rounded-full bg-gray-400" /> },
];

function TicketsContent() {
  const { tickets, setTickets } = useTicketStore();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewMenu, setShowViewMenu] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentViewId = searchParams.get('view') || 'all';
  const currentView = views.find(v => v.id === currentViewId) || views[0];

  const loadTickets = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const glpiTickets = await fetchGlpiTickets();
      if (glpiTickets.length > 0) {
        setTickets(glpiTickets);
      }
    } catch (error) {
      toast.error("Error al cargar tickets de GLPI");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    if (currentViewId === 'all') return true;
    if (currentViewId === 'abiertos') return t.status === 'Nuevo';
    if (currentViewId === 'en-curso') return t.status === 'En curso';
    if (currentViewId === 'resueltos') return t.status === 'Resuelto';
    if (currentViewId === 'sin-asignar') return t.assignee === 'Sin asignar';
    if (currentViewId === 'vencidos') {
      // Lógica simple para vencidos (simulación si no hay fecha real)
      return t.status !== 'Cerrado' && t.status !== 'Resuelto'; 
    }
    if (currentViewId === 'hoy') {
      const today = new Date().toLocaleDateString();
      return t.dueDate === today;
    }
    return true;
  });

  const toggleTicket = (id: string) => {
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const setView = (viewId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', viewId);
    router.push(`/tickets?${params.toString()}`);
    setShowViewMenu(false);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 h-full flex flex-col">
      {/* Header & View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="relative">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowViewMenu(!showViewMenu)}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-1.35 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex items-center gap-1">
              {currentView.label} <ChevronDown size={18} className={`text-gray-400 transition-transform ${showViewMenu ? 'rotate-180' : ''}`} />
            </h1>
          </div>

          {showViewMenu && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2">
              {views.map(view => (
                <button
                  key={view.id}
                  onClick={() => setView(view.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                    ${currentViewId === view.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  {view.icon}
                  {view.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button 
            onClick={() => loadTickets()}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded bg-white shadow-sm disabled:opacity-50"
          >
            <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Actualizando..." : "Refrescar"}
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors border border-gray-200 px-3 py-1.5 rounded bg-white shadow-sm">
            <Clock size={14} /> Últimos 30 días
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-lg border border-gray-100 shadow-sm flex-wrap">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded">
          Nuevo Incidente <ChevronDown size={14} />
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <button 
          disabled={selectedTickets.length === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Editar
        </button>
        <button 
          disabled={selectedTickets.length === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Eliminar
        </button>
        <button 
          disabled={selectedTickets.length === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Asignarme
        </button>
        <button 
          disabled={selectedTickets.length === 0}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cerrar
        </button>
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded">
          Asignar <ChevronDown size={14} />
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-3 px-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedTickets.length === tickets.length && tickets.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-2 w-16 text-center text-[11px] font-semibold text-gray-500 cursor-pointer hover:bg-gray-100 flex items-center justify-center gap-1">Id <ChevronDown size={12}/></th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Asunto</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 text-left">Solicitante</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 text-left">Técnico</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 text-left">Estado</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Vencimiento</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 text-right">Creado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && filteredTickets.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td colSpan={8} className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    No se encontraron solicitudes para esta vista.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => toggleTicket(ticket.id)}
                      />
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={14} className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                        <Mail size={14} className="text-gray-400 hover:text-blue-600 cursor-pointer" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center text-[12px] text-blue-600 font-bold">
                    <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                      {ticket.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/tickets/${ticket.id}`} className="flex items-center gap-2.5 group/title">
                      {ticket.type === 'incident' ? (
                        <Zap size={14} className="text-orange-500 shrink-0" strokeWidth={2.5} />
                      ) : (
                        <FileText size={14} className="text-blue-500 shrink-0" strokeWidth={2.5} />
                      )}
                      <span className="text-[13px] font-medium text-gray-700 group-hover/title:text-blue-600 transition-colors truncate max-w-[400px]">
                        {ticket.title}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700">{ticket.requester}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 group/tech cursor-help" title={ticket.assignee}>
                      <div className={`w-1.5 h-1.5 rounded-full ${ticket.assignee !== 'Sin asignar' ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                      <span className="text-[12px] text-gray-700 max-w-[150px] truncate">
                        {ticket.assignee.split(',')[0]}
                      </span>
                      {ticket.assignee.includes(',') && (
                        <span className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-blue-100">
                          +{ticket.assignee.split(',').length - 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700 flex items-center gap-2">
                      {ticket.status === 'Nuevo' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]"></div>}
                      {ticket.status === 'En curso' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]"></div>}
                      {ticket.status === 'En espera' && <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.4)]"></div>}
                      {ticket.status === 'Resuelto' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]"></div>}
                      {ticket.status === 'Cerrado' && <CheckCircle2 size={14} className="text-gray-400"/>}
                      <span className={ticket.status === 'Cerrado' ? 'text-gray-400 font-medium' : 'font-medium'}>
                        {ticket.status}
                      </span>
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700">{ticket.dueDate}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <span className="text-[12px] text-gray-700">{ticket.created}</span>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
          <span className="text-sm text-gray-500 font-medium">Mostrando 1 a {tickets.length} de {tickets.length} tickets</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
              Anterior
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">3</button>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <Suspense fallback={<div className="p-10">Cargando solicitudes...</div>}>
      <TicketsContent />
    </Suspense>
  );
}
