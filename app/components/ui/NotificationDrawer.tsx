"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Info, CheckCircle2 } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export function NotificationDrawer() {
  const { isNotificationsOpen, setNotifications } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mockNotifications = [
    { id: 1, type: "info", title: "Nuevo Ticket Asignado", desc: "El ticket #INC-819 ha sido asignado a ti.", time: "Hace 5 min" },
    { id: 2, type: "success", title: "SLA Cumplido", desc: "Ticket #REQ-402 resuelto a tiempo.", time: "Hace 1 hora" },
    { id: 3, type: "info", title: "Nueva respuesta", desc: "Manoj.paul respondió al ticket #INC-819", time: "Ayer" },
  ];

  if (!mounted) return null;

  return (
    <>
      {isNotificationsOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[80]"
            onClick={() => setNotifications(false)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-[340px] bg-white z-[90] flex flex-col border-l border-gray-200 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-gray-800" />
                <h2 className="font-semibold text-gray-900">Notificaciones</h2>
                <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
              </div>
              <button 
                onClick={() => setNotifications(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="flex gap-3 items-start group cursor-pointer">
                    <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${notif.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {notif.type === 'info' ? <Info size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div className="flex-1 border-b border-gray-50 pb-4 group-hover:border-transparent transition-colors">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{notif.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5 leading-snug">{notif.desc}</p>
                      <span className="text-xs text-gray-400 font-medium mt-2 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
              <button className="w-full py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Marcar todas como leídas
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
