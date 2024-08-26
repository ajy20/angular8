

export class RestApiIncidentEditHistory {
    public status: number;
    public contents: IncidentEditHistory[];
}

export class IncidentEditHistory {
    public id: number;
    public reason: string;
    public createdBy: number;
    public createdByUsername: string;
    public createdOn: Date;
    public modifiedOn: Date;
    public modifiedBy: number;
}