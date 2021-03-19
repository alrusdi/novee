import { Game } from '../../game/Game';
import { GameManager } from '../../game/GamesManager';
import { Player } from '../../game/Player';
import { Side } from '../../tiles/Side';
import { Tile } from '../../tiles/Tile';
import { ApiResponse } from '../Interfaces';

export class GamesApiActions {
    private _game: Game | undefined = undefined;
    private _player: Player | undefined = undefined;
    private _newTile: Tile | undefined = undefined;
    private _targetTile: Tile | undefined = undefined;
    private isStopped: boolean = false;
    private errorMessage: string = "";
    private errorData: any = {};
    private playerId: string = "";

    private constructor(private accountId: string) {
        
    }

    static startNewAction(accountId: string) {
        return new GamesApiActions(accountId);
    }

    game(): Game {
        if (this._game === undefined) throw new Error('Game is not defined');
        return this._game;
    }

    player(): Player {
        if (this._player === undefined) throw new Error('Player is not defined');
        return this._player;
    }

    rootTile(): Tile {
        const tile = this.player().rootTile;
        if (tile === undefined) throw new Error('No root tile');
        return tile;
    }

    newTile(): Tile {
        if (this._newTile === undefined) throw new Error('No new tile defined');
        return this._newTile;
    }

    targetTile(): Tile {
        if (this._targetTile === undefined) throw new Error('No target tile defined');
        return this._targetTile;
    }

    loadGameDataByPlayerId(playerId: string): GamesApiActions {
        if (this.isStopped) return this;
        this.playerId = playerId;

        this._game = GameManager.getGameByPlayerId(playerId);

        if (this._game === undefined) {
            return this.error('Can\'t get game for player', {playerId})
        }

        this._player = this._game.players.find((p: Player) => p.id === playerId);
        if (this._player === undefined) {
            return this.error('Missing player', {playerId})
        }

        if (this._player.account.id !== this.accountId) {
            return this.error('Wrong account', {playerId})
        }
        return this
    }

    checkIfItIsYourTurn(): GamesApiActions {
        if (this.isStopped) return this;

        if (this.game().getActivePlayer().account.id !== this.accountId) {
            return this.error('It is not your turn!', {accountId: this.accountId})
        }

        return this;
    }

    checkIfGameIsAvailableForThisUser(): GamesApiActions {
        if (this.isStopped) return this;
        if (GameManager.doesGameBelongsToAccount(this.game().id, this.accountId)) {
            return this;
        }
        return this.error('Wrong game', {gameId: this.game().id})
    }

    placeRootTileIfNeeded(newTileId: string, targetTileId: string): GamesApiActions {
        if (this.isStopped) return this;

        if (this.player().rootTile !== undefined) return this;

        if (targetTileId !== 'root') return this.error('No root tile for player', {playerId: this.playerId});

        return this.takeTileFromTheBoard(newTileId)
            .startPlayerTileset()
            .stop();
    }

    startPlayerTileset(): GamesApiActions {
        if (this.isStopped) return this;
        this.game().startPlayerTileset(this.player(), this.newTile());
        return this;
    }

    checkIfTargetTileValid(targetTileId: string, side: Side): GamesApiActions {
        if (this.isStopped) return this;

        const tilesetData = this.rootTile().getTilesetData();

        this._targetTile = tilesetData.tiles.get(targetTileId)

        if (this._targetTile === undefined) {
            return this.error('It is not your tile', {gameId: this.game().id, tileId: targetTileId})
        }

        if ( ! this._targetTile.isSideAvailableToAttach(side)) {
            return this.error('Wrong side', {gameId: this.game().id, tileId: targetTileId, side: side})
        }

        return this;
    }

    takeTileFromTheBoard(newTileId: string): GamesApiActions {
        if (this.isStopped) return this;

        this._newTile = this.game().board.takeTile(newTileId);

        if (this._newTile === undefined) {
            return this.error(
                'Can\t take tile from the board',
                {gameId: this.game().id, tileId: newTileId}
            )
        }
        return this;
    }

    attachTileToPlayerTileset(side: Side) {
        if (this.isStopped) return this;

        this.game().attachTileToPlayerTileset(
            this.player(), 
            this.newTile(), 
            this.targetTile(), 
            side
        );

        return this;
    }

    stop(): GamesApiActions {
        this.isStopped = true;
        return this;
    }

    error(message: string, data: any) {
        this.isStopped = true;
        this.errorMessage = message;
        this.errorData = data;
        return this;
    }

    onComplete(cb: (res: GamesApiActions) => ApiResponse): ApiResponse {
        if (this.isStopped && this.errorMessage) {
            return {
                status: 'Fail',
                message: this.errorMessage,
                data: this.errorData
            }
        }
        return cb(this);
    }
}