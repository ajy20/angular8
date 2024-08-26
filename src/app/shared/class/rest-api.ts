import { environment } from 'src/environments/environment';

const URL: string = environment.restApi.api;

export class RestApi {

  // Role Master
  public static roles: string = URL + 'RoleMaster/GetRoles';

  // User Master
  public static users: string = URL + 'UserMaster/GetAllUsers';
  public static save_user: string = URL + 'UserMaster/SaveUser';
  public static delete_user: string = URL + "UserMaster/DeleteUser?UserId={0}&ModifiedBy={1}";
  public static get_user_by_id: string = URL + "UserMaster/GetUserById?UserId={0}";
  public static get_user_id: string = URL + "UserMaster/GetUserByGlobalId?globalId={0}";

  // Product Master
  public static products: string = URL + 'ProductMaster/GetAllProducts';
  public static get_products_by_incident_id: string = URL + 'ProductMaster/GetProductsByIncidentId?incidentId={0}';
  public static save_product: string = URL + 'ProductMaster/SaveProduct';
  public static delete_product: string = URL + "ProductMaster/DeleteProduct?productId={0}&userId={1}";
  public static get_product_by_id: string = URL + "ProductMaster/GetProductById?productId={0}";

  // Team Master
  public static teams: string = URL + 'TeamMaster/GetAllTeams';
  public static get_teams_by_incident_id: string = URL + 'TeamMaster/GetTeamsByIncidentId?incidentId={0}';
  public static save_team: string = URL + 'TeamMaster/SaveTeam';
  public static delete_team: string = URL + "TeamMaster/DeleteTeam?teamId={0}&userId={1}";
  public static get_team_by_id: string = URL + "TeamMaster/GetTeamById?teamId={0}";

  // Get LookupMaster
  public static lookup_master: string = URL + 'LookupMaster/GetLookupByTypes?types={0}';

  // Incident
  public static dashboard_incidents: string = URL + 'Incident/GetDashboardIncidents?createdBy={0}&userRole={1}&isAssignedToMe={2}';
  public static incidents: string = URL + 'Incident/GetAllIncidents';
  public static save_incident: string = URL + 'Incident/SaveIncident';
  public static get_incident_by_id: string = URL + "Incident/GetIncidentById?id={0}";
  public static get_incident_edit_history: string = URL + "Incident/GetIncidentEditHistory?incidentId={0}";

  // Process Master
  public static processes: string = URL + 'ProcessMaster/GetAllProcess';

  // Process Function Master
  public static process_functions: string = URL + 'ProcessFunctionMaster/GetAllProcessFunction';

  // Attachment 
  public static incident_attachment: string = URL + 'Attachment/SaveAttachments?incidentId={0}&stepNumber={1}&createdBy={2}';
  public static get_attachments: string = URL + 'Attachment/GetAllAttachments?incidentId={0}&stepNumber={1}';
  public static delete_attachment: string = URL + 'Attachment/DeleteAttachment?attachmentId={0}&userId={1}';

  // Status
  public static change_status: string = URL + 'Incident/ChangeStatus?incidentId={0}&statusId={1}&createdBy={2}&reason={3}';

  // Decision
  public static change_decision: string = URL + 'Incident/ChangeDecision?incidentId={0}&decisionId={1}&createdBy={2}';

  // Comment
  public static save_comment: string = URL + 'Incident/SaveComments?incidentId={0}&comments={1}&createdBy={2}';

  // D2 Step
  public static get_d2_by_id: string = URL + "D2/GetByIncidentId?incidentId={0}";
  public static save_d2_step: string = URL + "D2/Save";

  // D4 Step
  public static get_d4_by_id: string = URL + "D4/GetByIncidentId?incidentId={0}";
  public static save_d4_step: string = URL + "D4/Save";

  // D5 Step
  public static get_d5: string = URL + 'D5/GetByIncidentId?incidentId={0}';
  public static save_d5: string = URL + 'D5/SaveD5';
  public static save_proposed_corrective_actions: string = URL + 'D5/SaveProposedCorrectiveActions?incidentId={0}&createdBy={1}';
  public static d5_send_approval_request: string = URL + 'D5/SendApprovalRequest?incidentId={0}&createdBy={1}';
  public static d5_cancel_approval_request: string = URL + 'D5/CancelApprovalRequest?incidentId={0}&createdBy={1}';
  public static d5_approve_reject_status: string = URL + 'D5/ApproveRejectRequest?incidentId={0}&createdBy={1}&statusId={2}';

  //D1
  public static get_d1: string = URL + 'D1/GetByIncidentId?incidentId={0}';
  public static save_d1: string = URL + 'D1/SaveMembers?incidentId={0}&createdBy={1}&isCompleted={2}';
  public static delete_member: string = URL + 'D1/DeleteMember?id={0}&createdBy={1}';

  //D3
  public static get_d3: string = URL + 'D3/GetIncidentId?incidentId={0}';
  public static save_d3: string = URL + 'D3/Save';

  // Internal 8D
  public static get_internal_8d_by_incidentid: string = URL + 'Internal8D/GetInternal8DByIncidentId?incidentId={0}';

  // D6 Step
  public static get_d6_by_id: string = URL + "D6/GetByIncidentId?incidentId={0}";
  public static save_d6_step: string = URL + "D6/Save";
  public static save_ca_verifier: string = URL + "D6/SaveCAVerifier";
  public static delete_ca_verifier: string = URL + "D6/DeleteCAVerifier?id={0}&modifiedBy={1}";

  // D7 Step
  public static get_d7_by_id: string = URL + "D7/GetByIncidentId?incidentId={0}";
  public static save_d7_step: string = URL + "D7/Save";

  // D8 Step
  public static d8_get: string = URL + 'D8/GetByIncidentId?incidentId={0}';
  public static d8_get_recognized_team: string = URL + 'D8/GetRecognizeTeam?incidentId={0}';
  public static d8_save_recognized_team: string = URL + 'D8/SaveRecognizeTeam?incidentId={0}&createdBy={1}';
  public static d8_delete_recognized_team: string = URL + 'D8/DeleteRecognizeTeam?incidentId={0}&id={1}&createdBy={2}';
  public static d8_send_approval_request: string = URL + 'D8/SendApprovalRequest?incidentId={0}&createdBy={1}';
  public static d8_cancel_approval_request: string = URL + 'D8/CancelApprovalRequest?incidentId={0}&createdBy={1}';
  public static d8_approve_reject_status: string = URL + 'D8/ApproveRejectRequest?incidentId={0}&createdBy={1}&statusId={2}';
  public static d8_run_verification_check: string = URL + 'D8/RunFinalVerificationCheck?incidentId={0}&createdBy={1}';

  // 8D PDF Generation
  public static internal8d_print: string = URL + 'Report/Get8DReportByIncidentId?incidentId={0}';

}
