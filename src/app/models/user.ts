import { Master } from './master';

export class Users {
        public status: boolean;
        public contents: User;
}

export class User {
        public id: number;
        public name: string;
        public globalId: string;
        public emailId: string;
        public jobTitle: string;
        public mobilePhone: number;
        public userPrincipleName: string;
        public modifiedBy: number;
        public roleNames: string;
        public roleId: number;
        public roleIds: string;
        public roles: Master[];
        public memberType?: string;
}





