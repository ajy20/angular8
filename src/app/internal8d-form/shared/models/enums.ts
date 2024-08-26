export enum MemberType {
  CHAMPION = 'CHAMPION',
  TEAMLEAD = 'TEAMLEAD',
  CORE = 'CORE',
  EXTENDED = 'EXTENDED',
  APPROVER = 'APPROVER',
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum ContainmentActionType {
  SHORT_TERM = 0,
  LONG_TERM = 1
}

export enum Step {
  D1 = 1,
  D2 = 2,
  D3 = 3,
  D4 = 4,
  D5 = 5,
  D6 = 6,
  D7 = 7,
  D8 = 8
}

export enum Internal8DStep {
  D1 = 'D1',
  D2 = 'D2',
  D3 = 'D3',
  D4 = 'D4',
  D5 = 'D5',
  D6 = 'D6',
  D7 = 'D7',
  D8 = 'D8'
}

export enum ConfirmationHeader {
  DELETE = 'Delete Confirmation',
  UNSAVED_DATA = 'Unsaved Data',
  SEND_APPROVAL_REQUEST = 'Confirm sending approval request',
  CANCEL_APPROVAL_REQUEST = 'Confirm approval request cancellation'
}

export enum ConfirmationMessage {
  DELETE = 'Do you want to delete this record?',
  UNSAVED_DATA = 'Do you want proceed with unsaved data?',
  SEND_APPROVAL_REQUEST = 'Do you want to send approval request?',
  CANCEL_APPROVAL_REQUEST = 'Do you want to cancel approval requests?'
}

export enum DStatus {
  NOT_REQUESTED = 0,
  PENDING = 1,
  APPROVE = 2,
  REJECT = 3
}

export enum AILoggerPageName {
  D1 = 'D1 Step',
  D2 = 'D2 Step',
  D3 = 'D3 Step',
  D4 = 'D4 Step',
  D5 = 'D5 Step',
  D6 = 'D6 Step',
  D7 = 'D7 Step',
  D8 = 'D8 Step',
  ALL_INCIDENTS = 'All Incidents',
  VIEW_INCIDENT = 'View Incident',
  EDIT_INCIDENT = 'Add/Edit Incident',
  TOOLKIT = '8D Toolkit',
  USER = 'Manage User',
  PRODUCT = 'Manage Product',
  TEAM = 'Manage Team'
}

export enum AILoggerAction {
  VIEW = 'View',
  SAVE = 'Save',
  UPDATE = 'Update',
  DELETE = 'Delete'
}
