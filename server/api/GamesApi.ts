import { AccountManager } from '../account/AccountManager';
import { Game } from '../game/Game';
import { GameManager } from '../game/GamesManager';
import { Player } from '../game/Player';
import { PlayerColor } from '../game/PlayerColor';
import { Side } from '../tiles/Side';
import { randomId } from '../Utils';
import { GamesApiActions } from './actions/GamesApiActions';
import { gameDataToApi } from './adapters/GameAdapter';
import { BaseApi } from './BaseApi';
import { ApiResponse } from './Interfaces';

export class GamesApi extends BaseApi {
    createSoloGame(): ApiResponse {
        const account = AccountManager.getById(this.accountId);
        if (account === undefined) {
            return this.error('Can\'t get account')
        }
        const player = new Player(
            randomId(),
            account,
            PlayerColor.Orange
        )
        const game = Game.newGame([player]);
        GameManager.setGame(game);

        return this.success('Game created successfully', {playerId: player.id})
    }

    getGameByPlayerId(playerId: string): ApiResponse {
        return GamesApiActions.startNewAction(this.accountId)
            .loadGameDataByPlayerId(playerId)
            .onComplete((res: GamesApiActions) => {
                return this.success(
                    'Game loaded successfully',
                    gameDataToApi(res.game(), res.player(), this.accountId)
                )
            })
    }

    placeTile(playerId: string, newTileId: string, targetTileId: string, side: Side): ApiResponse {
        return GamesApiActions.startNewAction(this.accountId)
            .loadGameDataByPlayerId(playerId)
            .checkIfItIsYourTurn()
            .placeRootTileIfNeeded(newTileId, targetTileId)
            .checkIfTargetTileValid(targetTileId, side)
            .takeTileFromTheBoard(newTileId)
            .attachTileToPlayerTileset(side)
            .onComplete((res: GamesApiActions) => {
                return this.success(
                    'Tile attached successfully',
                    gameDataToApi(res.game(), res.player(), this.accountId)
                )
            })
    }

    refreshTiles(playerId: string) {
        return GamesApiActions.startNewAction(this.accountId)
            .loadGameDataByPlayerId(playerId)
            .checkIfItIsYourTurn()
            .checkIfYouCanRefreshTiles()
            .refreshTiles()
            .onComplete((res: GamesApiActions) => {
                return this.success(
                    'Tiles refreshed successfully',
                    gameDataToApi(res.game(), res.player(), this.accountId)
                )
            })
    }
}
