"use client";

import { useState } from "react";
import { User, Bell, Shield, Paintbrush, Database, Globe, Save, Settings, Clock, Plus, MoreHorizontal, X } from "lucide-react";
import { Dropdown, DropdownItem, DropdownSeparator } from "../components/ui/Dropdown";

const tabs = [
  { id: "profile", name: "Perfil", icon: User },
  { id: "preferences", name: "Preferencias", icon: Paintbrush },
  { id: "notifications", name: "Notificaciones", icon: Bell },
  { id: "sla", name: "Políticas SLA", icon: Clock },
  { id: "security", name: "Seguridad", icon: Shield },
  { id: "fields", name: "Campos Personalizados", icon: Database },
  { id: "system", name: "Sistema", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Administra tus preferencias y la configuración global del Helpdesk</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-white text-blue-700 shadow-sm border border-gray-200" 
                      : "text-gray-600 hover:bg-white/60 hover:text-gray-900 border border-transparent"
                  }`}
                >
                  <tab.icon size={18} className={isActive ? "text-blue-600" : "text-gray-400"} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-bold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.name}
            </h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1">
            {/* Mock Content for 'Profile' */}
            {activeTab === "profile" && (
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-sm">
                    CO
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                      Cambiar Avatar
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF o PNG. Max 1MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                    <input type="text" defaultValue="Admin User" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Apellidos</label>
                    <input type="text" defaultValue="Coordinador" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input type="email" defaultValue="admin@empresa.com" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Cargo / Título</label>
                    <input type="text" defaultValue="Coordinador de TI" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* SLA Policies */}
            {activeTab === "sla" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Define los tiempos de respuesta y resolución según la prioridad de los tickets.</p>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
                    <Plus size={16} /> Nueva Política
                  </button>
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Nombre de la Política</th>
                        <th className="px-4 py-3 font-medium">Prioridad Aplicable</th>
                        <th className="px-4 py-3 font-medium">Tiempo de Respuesta</th>
                        <th className="px-4 py-3 font-medium">Tiempo de Resolución</th>
                        <th className="px-4 py-3 font-medium text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {/* SLA 1 */}
                      <tr className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">SLA Corporativo (Crítico)</p>
                          <p className="text-xs text-gray-500 mt-0.5">Aplica a Caídas de Sistema</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700">Urgente</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">15 min</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">2 horas</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Dropdown
                            trigger={
                              <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100">
                                <MoreHorizontal size={18} />
                              </button>
                            }
                          >
                            <DropdownItem><Settings size={14} className="text-gray-400"/> Editar Política</DropdownItem>
                            <DropdownItem><Plus size={14} className="text-gray-400"/> Duplicar</DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem danger><X size={14} /> Eliminar</DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>

                      {/* SLA 2 */}
                      <tr className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">SLA Estándar</p>
                          <p className="text-xs text-gray-500 mt-0.5">Equipos y Software regular</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-yellow-50 text-yellow-700">Media</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">4 horas</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">24 horas</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Dropdown
                            trigger={
                              <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100">
                                <MoreHorizontal size={18} />
                              </button>
                            }
                          >
                            <DropdownItem><Settings size={14} className="text-gray-400"/> Editar Política</DropdownItem>
                            <DropdownItem><Plus size={14} className="text-gray-400"/> Duplicar</DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem danger><X size={14} /> Eliminar</DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>

                      {/* SLA 3 */}
                      <tr className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">SLA Mantenimiento</p>
                          <p className="text-xs text-gray-500 mt-0.5">Solicitudes sin urgencia</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">Baja</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">12 horas</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900">3 días</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Dropdown
                            trigger={
                              <button className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100">
                                <MoreHorizontal size={18} />
                              </button>
                            }
                          >
                            <DropdownItem><Settings size={14} className="text-gray-400"/> Editar Política</DropdownItem>
                            <DropdownItem><Plus size={14} className="text-gray-400"/> Duplicar</DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem danger><X size={14} /> Eliminar</DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab !== "profile" && activeTab !== "sla" && (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <div className="mb-4 p-4 rounded-full bg-gray-50">
                  {(() => {
                    const Icon = tabs.find(t => t.id === activeTab)?.icon || Settings;
                    return <Icon size={32} className="text-gray-400" />;
                  })()}
                </div>
                <p className="font-medium text-gray-500">Configuración de {tabs.find(t => t.id === activeTab)?.name}</p>
                <p className="text-sm mt-1">Esta sección se conectará con la API de GLPI en la siguiente fase.</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              Cancelar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Save size={16} />
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
