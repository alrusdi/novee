import { ApiResponse } from './Interfaces';

export class BaseApi {
    public accountId: string = "";

    parseUserInputData(data: any): any {
        return data;
    }

    success(message: string, data: any): ApiResponse {
        return {
            status: 'Ok',
            message: message,
            data: data
        }
    }

    error(message: string, data: any = undefined): ApiResponse {
        return {
            status: 'Fail',
            message: message,
            data: data
        }
    }
}
