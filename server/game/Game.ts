import { Side } from '../tiles/Side';
import { Tile } from '../tiles/Tile';
import { TileDealer } from '../tiles/TileDealer';
import { randomId, shuffle } from '../Utils';
import { Board, PlayerPosition } from './Board';
import { GameState, SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT } from './Const';
import { MAX_ACTIVE_TILES, Player } from './Player';

interface InitialGameSettings {
    id: string;
    dealer: TileDealer;
    players: Array<Player>;
    firstPlayer: Player;
    activePlayer: Player;
    board: Board;
}

export class Game {
    public id: string;
    public players: Array<Player>;
    public board: Board;
    public state: GameState = GameState.NEW;
    public soloScore: number = 0;
    public soloStage: 1 | 2 = 1;

    private soloPrevActivationsCount: number = 0;
    private firstPlayer: Player;
    private activePlayer: Player;
    private dealer: TileDealer;
    private round: number = 1;
    private playersMadeTurnThisRound: Array<string> = [];

    private constructor(initialGameSettings: InitialGameSettings) {
        this.id = initialGameSettings.id;
        this.dealer = initialGameSettings.dealer;
        this.players = initialGameSettings.players;
        this.firstPlayer = initialGameSettings.firstPlayer;
        this.activePlayer = initialGameSettings.activePlayer;
        this.board = initialGameSettings.board;
    }

    static newGame(players: Array<Player>): Game {
        const dealer = TileDealer.fromFile()
        shuffle(players);
        const playersPositions = players.map(p => new PlayerPosition(p.id));

        const board = Board.newBoard(dealer, playersPositions)

        for (let p of players) {
            p.rootTile = dealer.deal();
        }

        const firstPlayerId = board.getFirstPlayerId();
        const firstPlayer = players.find(p => p.id === firstPlayerId);
        if (firstPlayer === undefined) throw new Error('Can\'t set first player');

        const settings: InitialGameSettings = {
            id: randomId(),
            dealer: dealer,
            players: players,
            firstPlayer: firstPlayer,
            activePlayer: firstPlayer,
            board: board
        }
        const game = new Game(settings);
        game.state = GameState.ACTIVE;
        return game
    }

    getSoloActivationsCount(): number {
        const activationsCount = this.firstPlayer.getActivationsCount();
        return activationsCount;
    }

    isSolo() {
        return this.players.length < 2;
    }

    attachTileToPlayerTileset(player: Player, newTile: Tile, targetTile: Tile, side: Side) {
        if (this.isSolo()) {
            this.soloScore += newTile.cost;
            this.soloPrevActivationsCount = this.firstPlayer.getActivationsCount();
        }
        targetTile.attachAnotherTile(newTile, side);
        this.board.advancePlayerPosition(player.id, newTile.cost);


        this.finishTurn(player);
    }

    finishTurn(player: Player) {
        this.playersMadeTurnThisRound.push(player.id);

        this.nextPlayer();

        if (this.isRoundOver()) {
            return this.finishRound();
        }
    }

    nextPlayer() {
        const activePlayerId = this.board.getFirstPlayerId();
        if (activePlayerId != this.activePlayer.id) {
            const newActivePlayer = this.players.find((p) => p.id === activePlayerId);
            if (newActivePlayer === undefined) throw new Error('Can\'t set active player ' + activePlayerId);
            this.activePlayer = newActivePlayer;
        }
    }

    isRoundOver(): boolean {
        return this.playersMadeTurnThisRound.length === this.players.length
    }

    isGameOver(): boolean {
        for (let p of this.players) {
            if (p.getActivationsCount() === MAX_ACTIVE_TILES) return true;
        }
        return false;
    }

    finishGame() {
        this.state = GameState.FINISHED;
    }

    isEndOfSoloStage(): boolean {
        if (this.board.countRemainingTiles() === 0) return true;
        const activationsCount = this.firstPlayer.getActivationsCount();
        if (this.soloPrevActivationsCount < SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT && activationsCount >= SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT) return true;
        if (activationsCount === MAX_ACTIVE_TILES) return true;
        return false;
    }

    finishRound() {
        if (this.isSolo()) {
            const activationsCount = this.firstPlayer.getActivationsCount();
            if (this.isEndOfSoloStage()) {
                if (this.soloStage === 1) {
                    this.soloScore += (SOLO_GAME_FIRST_STAGE_ACTIVATIONS_COUNT - activationsCount) * 10;
                    this.soloStage = 2;
                } else {
                    this.soloScore += (MAX_ACTIVE_TILES - activationsCount) * 10;
                    return this.finishGame();
                }
                this.board.refreshTiles(true);
            }
        }

        if (this.isGameOver()) {
            return this.finishGame();
        }

        this.round += 1;
        this.playersMadeTurnThisRound = [];
    }

    serialize(): string {
        const data = {
            id: this.id,
            round: this.round,
            firstPlayerId: this.firstPlayer.id,
            activePlayerId: this.activePlayer.id,
            players: this.players.map((p) => p.serialize()),
            dealer: this.dealer.serialize(),
            board: this.board.serialize(),
            playersMadeTurnThisRound: this.playersMadeTurnThisRound,
            state: this.state,
            soloScore: this.soloScore,
            soloStage: this.soloStage
        }
        return JSON.stringify(data);
    }

    static deserialize(serializedGame: string): Game {
        const data = JSON.parse(serializedGame);
        const players = data.players.map((p: string) => Player.deserialize(p))
        const firstPlayer = players.find((p: Player) => p.id === data.firstPlayerId)
        const activePlayer = players.find((p: Player) => p.id === data.activePlayerId)
        const dealer = TileDealer.deserialize(data.dealer);
        const settings: InitialGameSettings = {
            id: data.id,
            dealer: dealer,
            players: players,
            firstPlayer: firstPlayer,
            activePlayer: activePlayer,
            board: Board.deserialize(data.board, dealer),
        }
        const game = new Game(settings);
        game.state = data.state;
        game.playersMadeTurnThisRound = data.playersMadeTurnThisRound;
        return game;
    }
}
