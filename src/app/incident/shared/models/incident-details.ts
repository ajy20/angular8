import { Master } from "../../../models/master";


export class RestApiIncidentData {
    public status: number;
    public contents: Incident;
}

export class Incident {
    public id: number;
    public incidentNumber: string;
    public createdBy: number;
    public createdByUsername: string;
    public createdOn: Date;
    public modifiedOn: Date;
    public processId: number;
    public processName: string;
    public processOther: string;
    public processFunctionId: number;
    public processFunctionName: string;
    public processFunctionOther: string;
    public productIds: Master[];
    public productNames: string;
    public productName: string;
    public productOther: string;
    public systemId: number;
    public systemName: string;
    public systemOther: string;
    public decisionId: number;
    public decisionName: string;
    public statusId: number;
    public statusName: string;
    public issueWhat: string;
    public issueWhen: Date;
    public issueWhere: string;
    public issueHowMany: string;
    public affectedTeams: Master[];
    public affectedTeamNames: string;
    public additionalInfo: string;
    public comments: string;
    public statusChangeDate: Date;
    public affectedTeamOther: string;
    public modifiedBy: number;
    public editReason: string;

}





