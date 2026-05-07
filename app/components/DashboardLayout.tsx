"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, Users, Settings, Search, Bell, Menu, X, Plus, HelpCircle, Calendar, Grid, Box } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { CommandPalette } from "./ui/CommandPalette";
import { NotificationDrawer } from "./ui/NotificationDrawer";
import { Dropdown, DropdownItem, DropdownSeparator } from "./ui/Dropdown";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { 
    isSidebarOpen, toggleSidebar, 
    isMobileSidebarOpen: isMobileOpen, setMobileSidebar: setIsMobileOpen,
    toggleNotifications
  } = useUIStore();
  
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Técnicos", href: "/technicians", icon: Users },
    { name: "Activos", href: "/assets", icon: Box },
    { name: "Soluciones", href: "/solutions", icon: Grid },
    { name: "Configuración", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Freshservice Style (Dark) */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 bg-[#12263F] border-r border-[#12263F] flex-col transition-all duration-300 ease-in-out transform ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${isSidebarOpen ? "w-56" : "w-[68px]"} flex`}
      >
        <div className="h-12 flex items-center justify-center px-4 border-b border-white/5">
          <button 
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">H</span>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto mt-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isSidebarOpen ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded-lg font-medium transition-all duration-200 group relative ${
                  isActive 
                    ? "bg-[#1E3852] text-white" 
                    : "text-slate-400 hover:text-white hover:bg-[#1A3148]"
                }`}
                title={!isSidebarOpen ? item.name : ""}
              >
                <item.icon size={20} className={isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"} />
                {isSidebarOpen && <span className="ml-3 text-sm">{item.name}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && !isMobileOpen && (
                  <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB]">
        {/* Header - Freshservice Style (White, Clean) */}
        <header className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                IT
              </div>
              <span className="font-semibold text-gray-800 hidden sm:block">IT Servicedesk</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => useUIStore.getState().setCommandPalette(true)}
              className="hidden sm:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-md transition-colors text-sm"
            >
              <Search size={16} />
              <span className="font-medium mr-2">Buscar...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-gray-500 rounded border border-gray-200 shadow-sm">
                Ctrl K
              </kbd>
            </button>
            <button className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors hidden sm:block">
              <Calendar size={18} />
            </button>
            
            <Dropdown 
              width="w-48"
              trigger={
                <button className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded-md shadow-sm transition-colors text-sm font-medium flex items-center gap-1.5 ml-2">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Nuevo</span>
                </button>
              }
            >
              <DropdownItem><Ticket size={16} className="text-gray-400" /> Nuevo Ticket</DropdownItem>
              <DropdownItem><Users size={16} className="text-gray-400" /> Nuevo Técnico</DropdownItem>
              <DropdownSeparator />
              <DropdownItem><Grid size={16} className="text-gray-400" /> Nuevo Artículo (KB)</DropdownItem>
            </Dropdown>
            
            <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            
            <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors hidden sm:block">
              <HelpCircle size={18} />
            </button>
            <button 
              onClick={toggleNotifications}
              className="text-gray-500 hover:text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm ml-1 cursor-pointer">
              X
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global UI Components */}
      <CommandPalette />
      <NotificationDrawer />
    </div>
  );
}
