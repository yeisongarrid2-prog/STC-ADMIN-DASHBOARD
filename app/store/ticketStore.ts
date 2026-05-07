import { create } from 'zustand';

export interface Reply {
  id: string;
  author: string;
  authorInitials: string;
  date: string;
  content: string;
  isInternal: boolean;
  to?: string;
}

export interface Ticket {
  id: string;
  type: string;
  title: string;
  requester: string;
  assignee: string;
  group: string;
  status: string;
  dueDate: string;
  created: string;
  priority: string;
  source: string;
  replies?: Reply[];
}

interface TicketState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addReply: (ticketId: string, reply: Reply) => void;
}

const initialTickets: Ticket[] = [
  { 
    id: "1", type: "incident", title: "Error 42 P42 en Adobe Illustrator", requester: "Zhang Wei", assignee: "Aparna Ragavan", group: "Activos de Software", status: "Cerrado", dueDate: "28 Oct, 2019", created: "21 Oct, 2019", priority: "Alta", source: "Portal",
    replies: [
      {
        id: "r1",
        author: "Aparna Ragavan",
        authorInitials: "AR",
        date: "ayer a las 3:15 PM",
        to: "zhang.wei@empresa.com",
        isInternal: false,
        content: "Hola Zhang,\n\nGracias por contactarnos. Este error suele ocurrir cuando Illustrator se queda sin memoria RAM asignada para el procesamiento de gráficos vectoriales complejos.\n\nHe ajustado las políticas de memoria de tu perfil de forma remota. Por favor, cierra la aplicación, espera 2 minutos, vuelve a abrirla e intenta exportar de nuevo.\n\nQuedo atenta para confirmar si se resolvió.\n\nSaludos,\nSoporte TI"
      }
    ]
  },
  { id: "2", type: "incident", title: "Señal de WiFi débil en el bloque 4", requester: "José Luis", assignee: "Lana Reyes", group: "Redes", status: "Abierto", dueDate: "25 Oct, 2019", created: "22 Oct, 2019", priority: "Media", source: "Correo" },
  { id: "3", type: "request", title: "Solicitud de cuenta en Zoho CRM", requester: "Karthikeyan", assignee: "Aditya Shinde", group: "Cuentas de Usuario", status: "Cerrado", dueDate: "25 Oct, 2019", created: "21 Oct, 2019", priority: "Baja", source: "Portal" },
  { id: "4", type: "request", title: "Crear cuenta de prueba para producto", requester: "Stephen Nelson", assignee: "Robert Lee", group: "Cuentas de Usuario", status: "Abierto", dueDate: "24 Oct, 2019", created: "24 Oct, 2019", priority: "Media", source: "Chat" },
  { id: "5", type: "request", title: "Instalar Forticlient en mi equipo", requester: "Gerald Blu", assignee: "Lana Reyes", group: "Activos de Software", status: "Abierto", dueDate: "23 Oct, 2019", created: "18 Oct, 2019", priority: "Alta", source: "Portal" },
  { id: "6", type: "request", title: "VPN con desconexiones frecuentes", requester: "Zhang Wei", assignee: "Stephen Nelson", group: "Redes", status: "En espera", dueDate: "30 Oct, 2019", created: "24 Oct, 2019", priority: "Media", source: "Correo" },
];

export const useTicketStore = create<TicketState>((set) => ({
  tickets: initialTickets,
  setTickets: (tickets) => set({ tickets }),
  updateTicket: (id, updates) => set((state) => ({
    tickets: state.tickets.map((t) => (t.id === id ? { ...t, ...updates } : t))
  })),
  addReply: (ticketId, reply) => set((state) => ({
    tickets: state.tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          replies: [...(t.replies || []), reply]
        };
      }
      return t;
    })
  }))
}));
