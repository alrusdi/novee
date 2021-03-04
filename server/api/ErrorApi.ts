import { BaseApi } from './BaseApi'
import { ApiResponse } from './Interfaces'

export class ErrorApi extends BaseApi {
    error(message: string): ApiResponse  {
        return {
            status: 'Fail',
            message: message
        }
    }
}
