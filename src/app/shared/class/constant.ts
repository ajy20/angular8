
// Constant for Role
export enum RoleConstant {
  admin = 1,
  incidentApprover = 2,
  user = 3
}

export enum EnumDecision {
  dashboardDecision = 0,
  viewIncidentDecision = 1,
  decisionVal = 0,
  editIncidentDecisionVal = 5
}

export enum EnumStatus {
  statusVal = 1
}


export enum ApiResponse {
  failed = 0,
  success = 1,
  alreadyExist = 2,
  dependent = 3,
  noContent = 4,
  unauthorizedUser = 5
}

export enum D4SubStep {
  occurence = 1,
  detection = 2
}

export enum D4PotentialCause {
  investigation = 1,
  occurrence = 2,
  detection = 3,
}

export enum Internal8DStep {
  d1Step = 1,
  d2Step = 2,
  d3Step = 3,
  d4Step = 4,
  d5Step = 5,
  d6Step = 6,
  d7Step = 7,
  d8Step = 8
}

export enum EnumLookup {
  ROOT_CAUSE_TYPE = 'ROOT_CAUSE_TYPE',
  ROOT_CAUSE_SOURCE = 'ROOT_CAUSE_SOURCE',
  CAUSE_TYPE = 'CAUSE_TYPE'
}

export enum EnumPageName {
  INCIDENT_DETAILS = 'Incident Details',
  EDIT_INCIDENT_DETAILS = 'Edit Incident Details',
  TOOLKIT = '8D Toolkit'
}

export enum FileUploadSize {
  FILE_UPLOAD_SIZE = 1200000000
}