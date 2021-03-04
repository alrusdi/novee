
import { ErrorApi } from './ErrorApi';
import { ApiData, ApiResponse } from './Interfaces';
import { InvitesApi } from './InvitesApi';

export class Dispatcher {
    static parseUrlArguments(url: string): ApiData {
        const urlParts = url.split('/').slice(2);

        const apiNamespace = urlParts[0];
        const apiMethod = urlParts[1];

        if (apiNamespace === 'invites') {
            const instance = new InvitesApi();

            if (apiMethod === 'create') {
                return {
                    instance: instance,
                    method: instance.createInvite,
                    args: []
                }
            }

            if (apiMethod === 'take-seat') {
                return {
                    instance: instance,
                    method: instance.takeSeat,
                    args: []
                }
            }

            if (apiMethod === 'get') {
                return {
                    instance: instance,
                    method: instance.getInvite,
                    args: [urlParts[2]]
                }
            }
        }

        const instance = new ErrorApi();
        return {
            instance: instance,
            method: instance.error,
            args: ['Unsupported API method ' + apiNamespace + "." + apiMethod]
        }

    } 

    static handleGetRequest(accountId: string, url: string): ApiResponse {
        const apiData = Dispatcher.parseUrlArguments(url);
        apiData.instance.accountId = accountId;
        return apiData.method.apply(apiData.instance, apiData.args);
    }

    static handlePostRequest(accountId: string, url: string, postData: any): ApiResponse {
        const apiData = Dispatcher.parseUrlArguments(url);
        apiData.instance.accountId = accountId;
        apiData.args.push(apiData.instance.parseUserInputData(postData));
        return apiData.method.apply(apiData.instance, apiData.args);
    }
}