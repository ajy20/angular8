export interface DashboardIncident {
  id: number;
  incidentNumber: string;
  description: string;
  decisionId: number;
  statusId: number;
  teamLead: string;
  comments: string;
  champion: string;
  submittedBy: string;
  enable8d: boolean;
}
