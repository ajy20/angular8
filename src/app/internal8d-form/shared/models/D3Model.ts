import { Master } from 'src/app/models/master';
import { Attachment } from 'src/app/incident/shared/models/attachment';

export class D3Model{
    public dBaseId: number;
    public incidentId: number;
    public containmentActions?: string;
    public identification?: string;
    public sortingResults?: string;
    public certifiedMaterialBuildDate?: Date;
    public defectNumber?: string;
    public sortedNumber?: string;
    public isCompleted?: boolean;
    public shortTermContainmentActions?: ContainmentAction[];
    public longTermContainmentActions?: ContainmentAction[];
    public sortLocations?: Array<Master>;
    public attachments?: Array<Attachment>;
    public createdBy: number;
}

export class ContainmentAction{
    public id: number;
    public incidentId: number;
    public dBaseId?: number;
    public actionType: number;
    public description?: string;
    public listCleanPointInfoDate?: Date;
    public deviationNumber?: string;
    public isCompleted?: boolean;
    public containmentResults?: ContainmentResult[];
}

export class ContainmentResult{
    public id: number;
    public incidentId: number;
    public dBaseId?: number;
    public containmentActionId?: number;
    public sortLocation?: number;
    public sortLocationName?: string;
    public locationDetails?: string;
    public startDate?: Date;
    public endDate?: Date;
    public sorted?: number;
    public good?: number;
    public bad?: number;
    public scrapped?: number;
    public reworked?: number;
    public hours?: number;
    public total?: number;
    public responsibility?: string;
}

export class RestApiD3Model{
    public status: number;
    public contents: D3Model;
}