import { Internal8DStep } from 'src/app/shared/class/constant';


export class Internal8DRestApi {
    public status: number;
    public contents: Internal8D
}

export class Internal8D {
    public id: number;
    public incidentId: number;
    public incidentNumber: string;
    public isD1Completed: boolean;
    public isD2Completed: boolean;
    public isD3Completed: boolean;
    public isD4Completed: boolean;
    public isD5Completed: boolean;
    public isD6Completed: boolean;
    public isD7Completed: boolean;
    public isD8Completed: boolean;
    public createdBy: number;
    public createdOn: Date;
    public d1UserIds: D1Users[];
}

export class D1Users {
    public id: number;
}