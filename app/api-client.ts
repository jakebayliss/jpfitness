export interface IUsersClient {
    getJPUserFromEmail(userId: string, token: string): Promise<JPUserDto>;
    createJPUser(command: CreateJPUserCommand, token: string): Promise<JPUser>;
}

export class UsersClient implements IUsersClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "";
    }

    getJPUserFromEmail(userId: string, token: string): Promise<JPUserDto> {
        debugger;
        let url_ = this.baseUrl + "/jpusers/{userId}";
        if (userId === undefined || userId === null)
            throw new Error("The parameter 'userId' must be defined.");
        url_ = url_.replace("{userId}", encodeURIComponent("" + userId));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGetJPUserFromEmail(_response);
        });
    }

    protected processGetJPUserFromEmail(response: Response): Promise<JPUserDto> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        debugger;
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = JPUserDto.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<JPUserDto>(null as any);
    }

    createJPUser(command: CreateJPUserCommand, token: string): Promise<JPUser> {
        let url_ = this.baseUrl + "/api/Users/newjpuser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_: RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Bearer " + token
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processCreateJPUser(_response);
        });
    }

    protected processCreateJPUser(response: Response): Promise<JPUser> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
            result200 = JPUser.fromJS(resultData200);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<JPUser>(null as any);
    }
}

export class JPUserDto implements IJPUserDto {
    name?: string;
    products?: string[];

    constructor(data?: IJPUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.name = _data["name"];
            if (Array.isArray(_data["products"])) {
                this.products = [] as any;
                for (let item of _data["products"])
                    this.products!.push(item);
            }
        }
    }

    static fromJS(data: any): JPUserDto {
        data = typeof data === 'object' ? data : {};
        let result = new JPUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["name"] = this.name;
        if (Array.isArray(this.products)) {
            data["products"] = [];
            for (let item of this.products)
                data["products"].push(item);
        }
        return data;
    }
}

export interface IJPUserDto {
    name?: string;
    products?: string[];
}

export class JPUser implements IJPUser {
    id?: number;
    guid?: string;
    name?: string;
    email?: string;
    product?: string;

    constructor(data?: IJPUser) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.id = _data["id"];
            this.guid = _data["guid"];
            this.name = _data["name"];
            this.email = _data["email"];
            this.product = _data["product"];
        }
    }

    static fromJS(data: any): JPUser {
        data = typeof data === 'object' ? data : {};
        let result = new JPUser();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["id"] = this.id;
        data["guid"] = this.guid;
        data["name"] = this.name;
        data["email"] = this.email;
        data["product"] = this.product;
        return data;
    }
}

export interface IJPUser {
    id?: number;
    guid?: string;
    name?: string;
    email?: string;
    product?: string;
}

export class CreateJPUserCommand implements ICreateJPUserCommand {
    guid?: string;
    name?: string;
    email?: string;
    product?: string;

    constructor(data?: ICreateJPUserCommand) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.guid = _data["guid"];
            this.name = _data["name"];
            this.email = _data["email"];
            this.product = _data["product"];
        }
    }

    static fromJS(data: any): CreateJPUserCommand {
        data = typeof data === 'object' ? data : {};
        let result = new CreateJPUserCommand();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["guid"] = this.guid;
        data["name"] = this.name;
        data["email"] = this.email;
        data["product"] = this.product;
        return data;
    }
}

export interface ICreateJPUserCommand {
    guid?: string;
    name?: string;
    email?: string;
    product?: string;
}

export class ApiException extends Error {
    override message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    debugger;
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}