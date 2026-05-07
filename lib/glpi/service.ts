import { glpiFetch } from './client';
import { Ticket } from '@/app/store/ticketStore';

export async function fetchGlpiTickets(): Promise<Ticket[]> {
  try {
    // Filtramos tickets desde el 1 de Enero de 2026 y ordenamos por fecha de creación descendente.
    // Usamos el endpoint de búsqueda para filtros más avanzados.
    // Campo 15 es date_creation en GLPI.
    const query = [
      'expand_dropdowns=true',
      'range=0-100', // Traemos hasta 100 tickets
      'sort=15',     // Ordenar por fecha de creación
      'order=DESC',
      'criteria[0][field]=15',
      'criteria[0][condition]=greater',
      'criteria[0][value]=2026-01-01 00:00:00'
    ].join('&');

    const rawTickets = await glpiFetch(`search/Ticket?${query}`);
    
    // El endpoint /search devuelve un objeto con 'data' y 'totalcount'
    const ticketsData = rawTickets.data || [];

    if (!Array.isArray(ticketsData)) {
      console.error('Respuesta inesperada de GLPI:', rawTickets);
      return [];
    }

    return ticketsData.map((t: any) => ({
      id: t[1].toString(), // En /search, los campos vienen indexados o por nombre dependiendo de la versión
      type: t[14] === 1 ? 'incident' : 'request', // Campo 14 suele ser type
      title: t[1] || 'Sin asunto',
      requester: t[4] || 'Desconocido', // Campo 4 suele ser requester
      assignee: t[5] || 'Sin asignar',  // Campo 5 suele ser assignee
      group: t[7] || 'General',         // Campo 7 suele ser group
      status: mapGlpiStatus(parseInt(t[12])), // Campo 12 suele ser status
      priority: mapGlpiPriority(parseInt(t[3])), // Campo 3 suele ser priority
      dueDate: t[18] ? new Date(t[18]).toLocaleDateString() : 'Sin fecha', // Campo 18 suelen ser vencimiento
      created: new Date(t[15]).toLocaleDateString(), // Campo 15 es date_creation
      source: 'GLPI'
    }));
  } catch (error) {
    console.error('Error fetching GLPI tickets:', error);
    return [];
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
