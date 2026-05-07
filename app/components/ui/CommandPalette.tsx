"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Ticket, Users, Settings, LayoutDashboard, Grid } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export function CommandPalette() {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPalette } = useUIStore();

  const [mounted, setMounted] = useState(false);

  // Toggle the menu when ⌘K or Ctrl+K is pressed
  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isCommandPaletteOpen, setCommandPalette]);

  if (!mounted || !isCommandPaletteOpen) return null;

  const runCommand = (command: () => void) => {
    setCommandPalette(false);
    command();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPalette(false)}
      />
      <div className="fixed left-1/2 top-[10%] z-[101] w-full max-w-xl -translate-x-1/2 rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-full">
        <div className="flex items-center border-b border-gray-100 px-3">
          <Search className="mr-2 shrink-0 text-gray-400" size={18} />
          <input 
            placeholder="Escribe un comando o busca algo..." 
            className="flex-1 bg-transparent py-4 outline-none text-sm placeholder:text-gray-400" 
            autoFocus
          />
          <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono font-medium">ESC</span>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-500 px-2 py-1.5">Ir a</div>
          
          <div 
            onClick={() => runCommand(() => router.push("/"))}
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700"
          >
            <LayoutDashboard size={16} /> Dashboard
          </div>
          <div 
            onClick={() => runCommand(() => router.push("/tickets"))}
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700"
          >
            <Ticket size={16} /> Tickets
          </div>
          <div 
            onClick={() => runCommand(() => router.push("/technicians"))}
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 hover:text-blue-700"
          >
            <Users size={16} /> Técnicos
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <div className="text-xs font-semibold text-gray-500 px-2 py-1.5">Acciones</div>
          <div 
            onClick={() => runCommand(() => console.log("Crear Nuevo Ticket"))}
            className="flex items-center gap-2 px-2 py-2 text-sm text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <Ticket size={16} className="text-gray-400" /> Crear Nuevo Ticket...
          </div>
        </div>
      </div>
    </>
  );
}
