
import { ErrorApi } from './ErrorApi';
import { GamesApi } from './GamesApi';
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

            if (apiMethod === 'set-state') {
                return {
                    instance: instance,
                    method: instance.setState,
                    args: [urlParts[2], urlParts[3]]
                }
            }

            if (apiMethod === 'confirm-seat') {
                return {
                    instance: instance,
                    method: instance.confirmSeat,
                    args: [urlParts[2], urlParts[3]]
                }
            }
        }

        if (apiNamespace === 'games') {
            const instance = new GamesApi();

            if (apiMethod === 'create') {
                if (urlParts.length === 3 && urlParts[2] === 'solo') {
                    return {
                        instance: instance,
                        method: instance.createSoloGame,
                        args: []
                    }
                }
            }

            if (apiMethod === 'get-by-player') {
                return {
                    instance: instance,
                    method: instance.getGameByPlayerId,
                    args: [urlParts[2]]
                }
            }

            if (apiMethod === 'place-tile') {
                const playerId = urlParts[2];
                const newTileId = urlParts[3];
                const targetTileId = urlParts[4];
                const side = urlParts[5]
                return {
                    instance: instance,
                    method: instance.placeTile,
                    args: [playerId, newTileId, targetTileId, side]
                }
            }

            if (apiMethod === 'refresh-tiles') {
                const playerId = urlParts[2];
                return {
                    instance: instance,
                    method: instance.refreshTiles,
                    args: [playerId]
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
