export class StepD6Api {
    public status: number;
    public contents: StepD6;
}

export class StepD6 {
    public id: number;
    public incidentId: number;
    public d6ChangeNumber?: string;
    public d6DateCAEVerified?: Date;
    public d6ActionsTakenAndEvidence?: string;
    public d6Comments?: string;
    public isD6Completed?: boolean;
    public createdBy?: number;
    public modifiedBy?: number;
    public caVerifiers: CAVerifiers[];
    public correctiveActions: CorrectiveActions[];
}

export class CAVerifiers {
    public id: number;
    public incidentId: number;
    public dBaseId: number;
    public name?: string;
    public globalId?: string;
    public emailId?: string;
    public modifiedBy?: number;
}

export class CorrectiveActions {
    public id: number;
    public incidentId: number;
    public dBaseId: number;
    public typeId?: number;
    public typeName?: string;
    public potentialCause?: string;
    public sourceId?: number;
    public sourceName?: string;
    public d6ImplementationPlan?: string;
    public d6EstimatedCost?: number;
    public d6DateImplemented?: Date;
    public additionalNotes?: string;
}