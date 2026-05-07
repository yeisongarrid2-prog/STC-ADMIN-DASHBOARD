import { Search, Plus, MoreHorizontal, Mail, Phone, Star, User, Ticket, X } from "lucide-react";
import { Dropdown, DropdownItem, DropdownSeparator } from "../components/ui/Dropdown";

const mockAgents = [
  { id: 1, name: "Ana Silva", email: "ana.silva@empresa.com", role: "Soporte Nivel 2", tickets: 14, resolved: 145, csat: 4.8, status: "online", initial: "AS", color: "bg-purple-100 text-purple-700" },
  { id: 2, name: "Carlos Ruiz", email: "carlos.ruiz@empresa.com", role: "Soporte Nivel 1", tickets: 22, resolved: 132, csat: 4.5, status: "busy", initial: "CR", color: "bg-blue-100 text-blue-700" },
  { id: 3, name: "Miguel Torres", email: "miguel.t@empresa.com", role: "Especialista Redes", tickets: 5, resolved: 98, csat: 4.9, status: "offline", initial: "MT", color: "bg-emerald-100 text-emerald-700" },
  { id: 4, name: "Laura Martínez", email: "laura.m@empresa.com", role: "Soporte Nivel 1", tickets: 18, resolved: 87, csat: 4.2, status: "online", initial: "LM", color: "bg-amber-100 text-amber-700" },
  { id: 5, name: "David Pérez", email: "david.p@empresa.com", role: "Soporte Nivel 2", tickets: 8, resolved: 76, csat: 4.7, status: "online", initial: "DP", color: "bg-pink-100 text-pink-700" },
];

const statusStyles: Record<string, string> = {
  "online": "bg-green-500",
  "busy": "bg-red-500",
  "offline": "bg-gray-400",
};

export default function TechniciansPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Técnicos</h1>
          <p className="text-gray-500 mt-1">Gestiona el equipo de soporte y sus métricas de rendimiento</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar agente..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#12263F] text-white rounded-xl text-sm font-medium hover:bg-[#1A3148] transition-colors shadow-sm">
            <Plus size={18} />
            Nuevo Agente
          </button>
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agente</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tickets Abiertos</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Resueltos (Mes)</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">CSAT</th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${agent.color}`}>
                          {agent.initial}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${statusStyles[agent.status]}`}></span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">{agent.name}</span>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} /> {agent.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {agent.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-gray-900">{agent.tickets}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-lg font-bold text-emerald-600">{agent.resolved}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100 w-max mx-auto">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm">{agent.csat}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Dropdown
                        trigger={
                          <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50">
                            <MoreHorizontal size={20} />
                          </button>
                        }
                      >
                        <DropdownItem><User size={14} className="text-gray-400"/> Ver Perfil</DropdownItem>
                        <DropdownItem><Ticket size={14} className="text-gray-400"/> Reasignar Tickets</DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem danger><X size={14} /> Desactivar Agente</DropdownItem>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
