import { User } from 'src/app/models/user';

export class D1Model {
  teamLead: User;
  champion: User;
  coreTeamMembers: Array<User>;
  extendedTeamMembers: Array<User>;
  approvers: Array<User>;
}
