import { DApprover } from './dApprover';
import { DApprovalHistory } from './dApprovalHistory';

export class StepD8
{
  public id: number;
  public incidentId: number;
  public dateClosed?: Date;
  public issueInitiator: string;
  public statusId: number;
  public isCompleted: boolean;
  public createdBy: number;
  public approverStatuses: DApprover[];
  public approverHistory: DApprovalHistory[];
  public isApprovalInitiated: boolean;
  public recognizeTeam: RecognizeTeamMember[];
}

export class RecognizeTeamMember {
  public incidentId: number;
  public dbaseId: number;
  public globalId: string;
  public name: string;
  public emailId: string;
}

export class StepD8Api {
  public status: number;
  public contents: StepD8;
}

export class RestApiRecognizeTeam {
  public status: number;
  public contents: RecognizeTeamMember[];
}


export class RestApiFinalVerification {
  public status: number;
  public contents: FinalVerificationResult[];
}

export class FinalVerificationResult {
  public step: string;
  public stepName: string;
  public message: string;
}
