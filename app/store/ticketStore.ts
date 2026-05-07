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

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
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
