import { BaseApi } from './BaseApi';

export interface ApiResponse {
    status: 'Ok' | 'Fail';
    message: string;
    data?: any;
}

export interface ApiHandler {
    (...args: any[]): ApiResponse
};

export interface ApiData {
    instance: BaseApi;
    method: ApiHandler;
    args: Array<any>;
}
