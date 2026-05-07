"use client";

import { useState } from "react";
import { 
  Laptop, Server, Network, Printer, Smartphone, 
  BatteryCharging, HardDrive, Cpu, Search, Filter, 
  Plus, MoreVertical, Package, Shield, DownloadCloud,
  Ticket, Activity, RefreshCw, AlertCircle, X, Map as MapIcon, ArrowRightLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---
const ASSET_STATS = [
  { id: 1, label: "Total Activos", value: "2,458", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 2, label: "En Uso", value: "1,832", icon: Laptop, color: "text-green-600", bg: "bg-green-50" },
  { id: 3, label: "En Reparación", value: "45", icon: Cpu, color: "text-orange-600", bg: "bg-orange-50" },
  { id: 4, label: "Garantía Expirada", value: "312", icon: Shield, color: "text-red-600", bg: "bg-red-50" },
];

const CATEGORIES = [
  { id: "hardware", name: "Hardware", icon: Laptop },
  { id: "network", name: "Redes", icon: Network },
  { id: "infra", name: "Infraestructura", icon: Server },
  { id: "consumables", name: "Consumibles", icon: Printer },
  { id: "software", name: "Software", icon: DownloadCloud },
];

const RECENT_ASSETS = [
  { id: "AST-1042", name: "MacBook Pro M2", type: "Computadora", user: "Ana García", status: "En Uso", department: "Desarrollo", date: "Hace 2 días", openTickets: 0, health: 95 },
  { id: "AST-1041", name: "Dell OptiPlex 7090", type: "Computadora", user: "Carlos Ruiz", status: "En Uso", department: "Finanzas", date: "Hace 3 días", openTickets: 1, health: 60 },
  { id: "AST-1040", name: "Cisco Catalyst 9300", type: "Switch", user: "IT Network", status: "Activo", department: "Sistemas", date: "Hace 5 días", openTickets: 2, health: 85 },
  { id: "AST-1039", name: "HP Color LaserJet", type: "Impresora", user: "Recepción", status: "Mantenimiento", department: "RRHH", date: "Hace 1 semana", openTickets: 0, health: 30 },
  { id: "AST-1038", name: "iPhone 14 Pro", type: "Teléfono", user: "Miguel Santos", status: "En Uso", department: "Ventas", date: "Hace 1 semana", openTickets: 0, health: 100 },
];

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState("hardware");
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] pb-8">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 px-8 py-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Activos y Configuración</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestiona el inventario de hardware, redes, infraestructura y licencias de software.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Filter size={16} />
              Filtros
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Plus size={16} />
              Nuevo Activo
            </button>
          </div>
        </div>

        {/* Global Search */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors shadow-inner"
            placeholder="Buscar por número de serie, MAC, nombre, usuario..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <kbd className="hidden sm:inline-block border border-gray-200 rounded px-2 py-0.5 text-xs font-sans text-gray-400">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSET_STATS.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mr-4`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs (Categorías) */}
      <div className="px-8 pt-8">
        <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 pt-4 flex space-x-6">
          {CATEGORIES.map((category) => {
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-medium transition-colors relative ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <category.icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                {category.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area (Simulated) */}
        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {activeTab === 'hardware' && "Equipos de Usuario (Computadoras, Monitores, etc.)"}
              {activeTab === 'network' && "Dispositivos de Red (Switches, Routers)"}
              {activeTab === 'infra' && "Infraestructura (Servidores, Racks, PDUs)"}
              {activeTab === 'consumables' && "Inventario de Consumibles y Cartuchos"}
              {activeTab === 'software' && "Licencias y Programas"}
            </h3>
            
            <div className="flex gap-2">
              <button className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors">
                Exportar CSV
              </button>
            </div>
          </div>

          {/* Simple Table for Recent Assets */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-tl-lg">ID</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre del Activo</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salud</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asignado a</th>
                  <th className="px-4 py-3 bg-gray-50/50 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest rounded-tr-lg">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {RECENT_ASSETS.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {asset.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-800">{asset.name}</span>
                        {asset.openTickets > 0 && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-600 border border-red-100">
                            <Ticket size={9} />
                            {asset.openTickets} 
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">Agregado {asset.date}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">
                        {asset.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className={asset.health < 40 ? "text-red-600 font-medium" : "text-gray-500"}>{asset.health}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${asset.health < 40 ? 'bg-red-500' : asset.health < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                            style={{ width: `${asset.health}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        asset.status === 'En Uso' ? 'bg-green-100 text-green-800' :
                        asset.status === 'Activo' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          asset.status === 'En Uso' ? 'bg-green-500' :
                          asset.status === 'Activo' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}></span>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{asset.user}</div>
                      <div className="text-xs text-gray-500">{asset.department}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Crear Ticket" className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50">
                          <Ticket size={16} />
                        </button>
                        <button title="Ping / Verificar Estado" className="text-gray-400 hover:text-green-600 transition-colors p-1 rounded hover:bg-green-50">
                          <Activity size={16} />
                        </button>
                        <button title="Reasignar" className="text-gray-400 hover:text-orange-600 transition-colors p-1 rounded hover:bg-orange-50">
                          <ArrowRightLeft size={16} />
                        </button>
                        <button 
                          onClick={() => setSelectedAsset(asset)}
                          title="Ver Detalles" 
                          className="text-gray-400 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-100"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Subtle Empty State or View All button */}
          <div className="mt-6 flex justify-center">
            <button className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors">
              Ver todos los activos en esta categoría &rarr;
            </button>
          </div>

        </div>
      </div>

      {/* Asset Details Drawer (CMDB & Financial Info) */}
      <AnimatePresence>
        {selectedAsset && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSelectedAsset(null)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedAsset.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedAsset.id} • {selectedAsset.type}</p>
                </div>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Status & Tickets */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <div className="text-blue-600 mb-1"><Activity size={20} /></div>
                    <div className="text-sm text-gray-500">Estado de Red</div>
                    <div className="font-semibold text-gray-900">En línea (hace 2 min)</div>
                  </div>
                  <div className={`flex-1 ${selectedAsset.openTickets > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-200'} border p-4 rounded-xl`}>
                    <div className={`${selectedAsset.openTickets > 0 ? 'text-red-600' : 'text-gray-400'} mb-1`}><Ticket size={20} /></div>
                    <div className="text-sm text-gray-500">Tickets Activos</div>
                    <div className="font-semibold text-gray-900">{selectedAsset.openTickets} Incidencias</div>
                  </div>
                </div>

                {/* CMDB Map Concept */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapIcon size={16} className="text-gray-400"/>
                    Mapa de Dependencias (CMDB)
                  </h3>
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Fake Visual Graph */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-6 w-full">
                      <div className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Server size={14} className="text-blue-500"/> Switch Core 01
                      </div>
                      
                      <div className="h-6 border-l-2 border-dashed border-blue-300"></div>
                      
                      <div className="bg-blue-600 text-white shadow-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border-2 border-blue-200">
                        <Laptop size={14} /> {selectedAsset.name}
                      </div>

                      <div className="h-6 border-l-2 border-dashed border-gray-300"></div>

                      <div className="flex gap-4">
                        <div className="bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded text-xs font-medium text-gray-600">
                          Windows 11 Pro
                        </div>
                        <div className="bg-white border border-gray-200 shadow-sm px-3 py-1.5 rounded text-xs font-medium text-gray-600">
                          Office 365
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Lifecycle Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-gray-400"/>
                    Ciclo de Vida y Finanzas
                  </h3>
                  <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Vida Útil Restante</span>
                        <span className="font-medium">{selectedAsset.health}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${selectedAsset.health < 40 ? 'bg-red-500' : selectedAsset.health < 70 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                          style={{ width: `${selectedAsset.health}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 mt-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Fecha de Compra</div>
                        <div className="text-sm font-medium">12 Oct 2023</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Fin de Garantía</div>
                        <div className="text-sm font-medium text-orange-600">12 Oct 2026</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Costo de Adquisición</div>
                        <div className="text-sm font-medium">$1,299.00 USD</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Proveedor</div>
                        <div className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">TechStore LLC</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Editar Activo
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Crear Ticket
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
