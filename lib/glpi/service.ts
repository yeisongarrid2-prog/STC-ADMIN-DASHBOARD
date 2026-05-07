import { glpiFetch } from './client';
import { Ticket } from '@/app/store/ticketStore';

export async function fetchGlpiTickets(): Promise<Ticket[]> {
  try {
    const query = [
      'expand_dropdowns=1',
      'range=0-100',
      'sort=15',
      'order=DESC',
      'criteria[0][field]=15',
      'criteria[0][searchtype]=morethan',
      'criteria[0][value]=2026-01-01 00:00:00'
    ].join('&');

    const rawTickets = await glpiFetch(`search/Ticket?${query}`);
    const ticketsData = rawTickets.data || [];

    if (!Array.isArray(ticketsData)) {
      console.error('Respuesta inesperada de GLPI:', rawTickets);
      return [];
    }

    const tickets = ticketsData.map((t: any) => ({
      id: t[2]?.toString() || t[1]?.toString() || '?', 
      type: t[14] === 1 ? 'incident' : 'request',
      title: t[1] || 'Sin asunto',
      requester: t[4] || 'Desconocido', 
      assignee: t[5] || 'Sin asignar',  
      status: mapGlpiStatus(parseInt(t[12])),
      priority: mapGlpiPriority(parseInt(t[3])),
      dueDate: t[18] ? new Date(t[18]).toLocaleDateString() : 'Sin fecha',
      created: t[15] ? new Date(t[15]).toLocaleDateString() : '?',
      source: 'GLPI'
    }));

    // Obtener nombres reales de los usuarios
    const userIds = new Set<string>();
    tickets.forEach(t => {
      if (t.requester && t.requester !== 'Desconocido') userIds.add(t.requester);
      
      if (t.assignee && t.assignee !== 'Sin asignar') {
        if (Array.isArray(t.assignee)) {
          t.assignee.forEach((id: string) => userIds.add(id));
        } else {
          userIds.add(t.assignee);
        }
      }
    });

    if (userIds.size > 0) {
      try {
        const usersData = await glpiFetch(`User?range=0-100`);
        const userMap: Record<string, string> = {};
        usersData.forEach((u: any) => {
          userMap[u.id.toString()] = u.firstname || u.realname ? `${u.firstname || ''} ${u.realname || ''}`.trim() : u.name;
        });

        tickets.forEach(t => {
          if (userMap[t.requester]) t.requester = userMap[t.requester];
          
          if (t.assignee && t.assignee !== 'Sin asignar') {
            if (Array.isArray(t.assignee)) {
              t.assignee = t.assignee
                .map((id: string) => userMap[id] || id)
                .join(', ');
            } else if (userMap[t.assignee]) {
              t.assignee = userMap[t.assignee];
            }
          }
        });
      } catch (e) {
        console.error('Error mapping users:', e);
      }
    }

    return tickets;
  } catch (error) {
    console.error('Error fetching GLPI tickets:', error);
    return [];
  }
}

export async function fetchDashboardStats() {
  try {
    const baseQuery = 'criteria[0][field]=15&criteria[0][searchtype]=morethan&criteria[0][value]=2026-01-01 00:00:00';
    
    // Hacemos varias peticiones en paralelo para obtener los conteos
    const [open, assigned, resolved, closed, unassigned] = await Promise.all([
      glpiFetch(`search/Ticket?range=0-0&${baseQuery}&criteria[1][link]=AND&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=1`), // Nuevo (1)
      glpiFetch(`search/Ticket?range=0-0&${baseQuery}&criteria[1][link]=AND&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=2`), // Asignado (2)
      glpiFetch(`search/Ticket?range=0-0&${baseQuery}&criteria[1][link]=AND&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=5`), // Resuelto (5)
      glpiFetch(`search/Ticket?range=0-0&${baseQuery}&criteria[1][link]=AND&criteria[1][field]=12&criteria[1][searchtype]=equals&criteria[1][value]=6`), // Cerrado (6)
      glpiFetch(`search/Ticket?range=0-0&${baseQuery}&criteria[1][link]=AND&criteria[1][field]=5&criteria[1][searchtype]=equals&criteria[1][value]=0`),  // Sin técnico
    ]);

    return {
      open: open.totalcount || 0,
      assigned: assigned.totalcount || 0,
      resolved: resolved.totalcount || 0,
      closed: closed.totalcount || 0,
      unassigned: unassigned.totalcount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { open: 0, assigned: 0, resolved: 0, closed: 0, unassigned: 0 };
  }
}

function mapGlpiStatus(status: number): string {
  const statuses: Record<number, string> = {
    1: 'Nuevo',
    2: 'En curso (asignado)',
    3: 'En curso (planificado)',
    4: 'En espera',
    5: 'Resuelto',
    6: 'Cerrado'
  };
  return statuses[status] || 'Desconocido';
}

function mapGlpiPriority(priority: number): string {
  const priorities: Record<number, string> = {
    1: 'Baja',
    2: 'Baja',
    3: 'Media',
    4: 'Alta',
    5: 'Alta',
    6: 'Urgente'
  };
  return priorities[priority] || 'Media';
}
