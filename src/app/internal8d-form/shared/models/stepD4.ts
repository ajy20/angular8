

export class StepD4Api {
    public status: number;
    public contents: StepD4;
}

export class StepD4 {
    public id: number;
    public incidentId: number;
    public d4WhyMade?: string;
    public d4HowVerified?: string;
    public d4Identification?: string;
    public isD4Completed?: boolean;
    public createdBy?: number;
    public modifiedBy: number;
    public currentRole: number;
    public occurenceFiveWhy: FiveWhy[];
    public detectionFiveWhy: FiveWhy[];
    public subStep1: PotentialCause[];
    public subStep2: PotentialCause[];
    public subStep3: PotentialCause[];
}

export class FiveWhy {
    public id: number;
    public incidentId: number;
    public dBaseId: number;
    public whyQuestion: string;
    public stepNumber: number
    public subStepNumber: number;
}

export class PotentialCause {
    public id: number;
    public incidentId: number;
    public dBaseId: number;
    public typeId?: number;
    public typeName?: string;
    public causeDescription?: string;
    public sourceId?: number;
    public sourceName?: string;
    public sourceOther?: string;
    public causeTypeId?: number;
    public causeTypeName?: string;
    public d4ExplainsIsOrIsNot?: boolean;
    public d4HowConfirmed?: string;
    public d4IsProbableRootCause?: boolean;
    public subStepNumber?: number;
    public additionalNotes?: string;
    public d5ProposedCorrectiveActions?: string;
    public d5VerificationEvidence?: string;
}


