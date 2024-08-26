export class StepD7Api {
    public status: number;
    public contents: StepD7;
}

export class StepD7 {
    public id: number;
    public incidentId: number;
    public additionalComments?: string;
    public isD7Completed?: boolean;
    public createdBy?: number;
    public modifiedBy?: number;
    public artifactName?: string;
    public reference?: string;
    public correctiveActionFiveWhy: CorrectiveActionFiveWhy[];
    public productDesignArtifacts: Artifacts[];
    public operationsArtifacts: Artifacts[];
    public qualityArtifacts: Artifacts[];
    public processOwnerArtifacts: Artifacts[];
    public lookAcross: LookAcross[];
}

export class CorrectiveActionFiveWhy {
    public id: number;
    public incidentId: number;
    public dBaseId: number;
    public whyQuestion: string;
    public stepNumber: number
    public subStepNumber: number;
}

export class Artifacts {
    public id: number;
    public artifactId: number;
    public artifactName?: string;
    public isApplicable?: boolean;
    public reference?: string;
    public createdBy?: number;
}

export class LookAcross {
    public id: number;
    public incidentId: number;
    public location: string;
    public recommendedActions: string;
}