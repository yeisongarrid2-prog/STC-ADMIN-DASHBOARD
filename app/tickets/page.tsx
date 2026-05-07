"use client";

import { useState, useEffect } from "react";
import { 
  Search, Filter, MoreHorizontal, Clock, ArrowUpRight, ChevronDown, 
  Zap, FileText, CheckSquare, Trash2, UserPlus, Edit2, Mail, CheckCircle2,
  RefreshCcw
} from "lucide-react";
import Link from "next/link";

import { useTicketStore } from "../store/ticketStore";
import { fetchGlpiTickets } from "@/lib/glpi/service";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/Skeleton";
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

export default function TicketsPage() {
  const { tickets, setTickets } = useTicketStore();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const toggleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(t => t.id));
    }
  };

  const toggleTicket = (id: string) => {
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 h-full flex flex-col">
      {/* Header & View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
              <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-1.35 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors flex items-center gap-1">
            Todas las Solicitudes <ChevronDown size={18} className="text-gray-400" />
          </h1>
          <Filter size={16} className="text-blue-500 ml-2" />
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
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Solicitante</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Técnico</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Grupo</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Estado</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500">Vencimiento</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 text-right">Creado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && tickets.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td colSpan={9} className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500">
                    No se encontraron solicitudes en GLPI.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
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
                    <Link href={`/tickets/${ticket.id}`} className="flex items-center gap-2 group/title">
                      {ticket.type === 'incident' ? (
                        <Zap size={14} className="text-orange-500 shrink-0" />
                      ) : (
                        <FileText size={14} className="text-teal-500 shrink-0" />
                      )}
                      <span className="text-[13px] font-medium text-gray-800 group-hover/title:text-blue-600 transition-colors">
                        {ticket.title}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700">{ticket.requester}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${ticket.assignee !== 'Sin asignar' ? 'bg-gray-400' : 'bg-transparent'}`}></div>
                      <span className="text-[12px] text-gray-700">{ticket.assignee}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700">{ticket.group}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[12px] text-gray-700 flex items-center gap-1.5">
                      {ticket.status}
                      {ticket.status === 'Abierto' && <div className="w-3 h-3 rounded-sm bg-orange-400"></div>}
                      {ticket.status === 'Cerrado' && <CheckCircle2 size={12} className="text-green-600"/>}
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
