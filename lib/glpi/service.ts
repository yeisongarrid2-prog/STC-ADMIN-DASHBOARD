import { glpiFetch } from './client';
import { Ticket } from '@/app/store/ticketStore';

export async function fetchGlpiTickets(): Promise<Ticket[]> {
  try {
    // Obtenemos los tickets de GLPI. 
    // Por defecto traemos los últimos 50 para el dashboard.
    const rawTickets = await glpiFetch('Ticket?expand_dropdowns=true&range=0-50&sort=date_mod&order=DESC');
    
    if (!Array.isArray(rawTickets)) {
      console.error('Respuesta inesperada de GLPI:', rawTickets);
      return [];
    }

    return rawTickets.map((t: any) => ({
      id: t.id.toString(),
      type: t.type === 1 ? 'incident' : 'request',
      title: t.name || 'Sin asunto',
      requester: t.users_id_recipient_format || 'Desconocido',
      assignee: t.users_id_lastupdater_format || 'Sin asignar',
      group: t.groups_id_format || 'General',
      status: mapGlpiStatus(t.status),
      priority: mapGlpiPriority(t.priority),
      dueDate: t.time_to_resolve ? new Date(t.time_to_resolve).toLocaleDateString() : 'Sin fecha',
      created: new Date(t.date_creation).toLocaleDateString(),
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
