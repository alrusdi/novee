import { AccountManager } from '../account/AccountManager';
import { GameState, SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT } from '../game/Const';
import { Game } from '../game/Game';
import { GameManager } from '../game/GamesManager';
import { MAX_ACTIVE_TILES, Player } from '../game/Player';
import { PlayerColor } from '../game/PlayerColor';
import { Side } from '../tiles/Side';
import { Tile } from '../tiles/Tile';
import { randomId } from '../Utils';
import { boardToApi } from './adapters/BoardAdapter';
import { playerToApi } from './adapters/PlayerAdapter';
import { BaseApi } from './BaseApi';
import { ApiResponse } from './Interfaces';

export class GamesApi extends BaseApi {
    createSoloGame(): ApiResponse {
        const account = AccountManager.getById(this.accountId);
        if (account === undefined) {
            return {
                status: 'Fail',
                message: 'Can\'t get account',
                data: {}
            }
        }
        const player = new Player(
            randomId(),
            account,
            PlayerColor.Orange
        )
        const game = Game.newGame([player]);
        GameManager.setGame(game);

        return {
            status: 'Ok',
            message: 'Game created successfully',
            data: {
                playerId: player.id
            }
        }
    }

    private commonGameByPlayerId(playerId: string): ApiResponse {
        const game = GameManager.getGameByPlayerId(playerId);
        if (game === undefined) {
            return {
                status: 'Fail',
                message: 'Can\'t get game for player',
                data: {playerId}
            }
        }

        if (game.state === GameState.FINISHED) {
            return {
                status: 'Fail',
                message: 'Game is finished',
                data: {gameId: game.id}
            }
        }

        if ( ! GameManager.doesGameBelongsToAccount(game.id, this.accountId)) {
            return {
                status: 'Fail',
                message: 'Wrong game',
                data: {gameId: game.id}
            }
        }
        const player = game.players.find((p: Player) => p.id === playerId);
        if (player === undefined) throw new Error("Missing player");
        return {
            status: 'Ok',
            message: 'Game loaded successfully',
            data: {game, player}
        }
    }

    getGameByPlayerId(playerId: string): ApiResponse {
        const gameInfo = this.commonGameByPlayerId(playerId);

        if (gameInfo.status === 'Fail') return gameInfo;

        const game: Game = gameInfo.data.game;

        return {
            status: 'Ok',
            message: 'Game loaded successfully',
            data: {
                gameId: game.id,
                board: boardToApi(game.board),
                player: playerToApi(gameInfo.data.player),
                isSolo: game.isSolo(),
                soloStage: game.soloStage,
                soloScore: game.soloScore,
                soloActivations: game.getSoloActivationsCount(),
                soloMaxActivations: game.soloStage === 1 ? SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT : MAX_ACTIVE_TILES
            }
        }
    }

    placeTile(playerId: string, newTileId: string, targetTileId: string, side: Side): ApiResponse {
        const gameInfo = this.commonGameByPlayerId(playerId);

        if (gameInfo.status === 'Fail') return gameInfo;

        const game: Game = gameInfo.data.game;
        const player: Player = gameInfo.data.player;

        if (player.rootTile === undefined) throw new Error('No root tile for player ' + playerId);
        const tilesetData = player.rootTile.getTilesetData();

        const targetTile: Tile | undefined = tilesetData.tiles.get(targetTileId)

        if (targetTile === undefined) {
            return {
                status: 'Fail',
                message: 'It is not your tile',
                data: {
                    gameId: game.id,
                    tileId: targetTileId
                }
            }
        }

        if ( ! targetTile.isSideAvailableToAttach(side)) {
            return {
                status: 'Fail',
                message: 'Wrong side',
                data: {
                    gameId: game.id,
                    tileId: targetTileId,
                    side: side
                }
            }
        }

        const newTile: Tile | undefined = game.board.takeTile(newTileId);

        if (newTile === undefined) {
            return {
                status: 'Fail',
                message: 'Can\t take tile from the board',
                data: {
                    gameId: game.id,
                    tileId: newTileId
                }
            }
        }

        game.attachTileToPlayerTileset(player, newTile, targetTile, side);

        return {
            status: 'Ok',
            message: 'Tile attached successfully',
            data: {
                gameId: game.id,
                board: boardToApi(game.board),
                player: playerToApi(player),
                isSolo: game.isSolo(),
                soloStage: game.soloStage,
                soloScore: game.soloScore,
                soloActivations: game.getSoloActivationsCount(),
                soloMaxActivations: game.soloStage === 1 ? SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT : MAX_ACTIVE_TILES
            }
        }
    }
}
