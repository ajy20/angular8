export class StepD2Api {
    public status: number;
    public contents: StepD2;
}

export class StepD2 {
    public id: number;
    public incidentId: number;
    public d2NumOfSuspectParts?: string;
    public d2NumOfActualParts?: string;
    public d2NumOfCustomerReportedParts?: string;
    public d2ComplaintDate?: Date;
    public d2NonConfirmityCreatedDate?: Date;
    public d2TargetClosureDate?: Date;
    public d2ProblemSummary?: string;
    public isD2Completed?: boolean;
    public createdBy?: number; 
    public modifiedBy: number; 
    public currentRole: number;
    public what?: QuestionAnswer[];
    public when?: QuestionAnswer[];
    public where?: QuestionAnswer[];
    public extent?: QuestionAnswer[];
}

export class QuestionAnswer {
    public answerId: number;
    public questionId: number;
    public category: string;
    public question: string;
    public seq?: number;
    public answerIs: string;
    public answerIsNot: string;
}