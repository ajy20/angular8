

export class RestApiAttachments {
    public status: number;
    public contents: Attachment[];
}

export class Attachment {
    public id: number;
    public name: string;
    public size: number;
    public incidentId: number;
    public url: string;
    public stepNumber: number;
    public createdOn: Date;
    public createdBy: number;
    public createdByUsername: string;
    public modifiedOn: Date;
    public modifiedBy: number;
}