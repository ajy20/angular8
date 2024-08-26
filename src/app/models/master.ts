export class Masters {
    public status: boolean;
    public contents: Master;
}

/// This class used for dropdown api
export class Master {
    public id: number;
    public name?: string;
    public modifiedBy?: number;
    public lookupValue?: string;
    public lookupType?: string;
    public seq?: number;
}

export class RoleMaster {
    public status: boolean;
    public contents: Master[];
}


/// This class can be used for GetAll api call
export class RestApiData {
    public status: boolean;
    public contents: Master[];
}



export class LeftNav {
    public pageName: string;
    public pageHeader: string;
  }