import { PotentialCause } from './stepD4';
import { DApprovalHistory } from './dApprovalHistory';
import { DApprover } from './dApprover';

export class StepD5 {
  public id: number;
  public incidentId: number;
  public additionalComments: string;
  public statusId: number;
  public isCompleted: boolean;
  public proposedCorrectiveActions: PotentialCause[];
  public createdBy: number;
  public approverStatuses: DApprover[];
  public approverHistory: DApprovalHistory[];
  public isApprovalInitiated: boolean;
}

export class StepD5Api {
  public status: number;
  public contents: StepD5;
}
