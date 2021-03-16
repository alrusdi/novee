import { Tile } from '../tiles/Tile';
import { TileDealer } from '../tiles/TileDealer';

const MAX_AVAILABILITY_MARKER_POSITION = 11
const MAX_TILES_AVAILABLE = 3;

export class PlayerPosition {
    public index: number = 0;
    public priority: number = 0;
    
    constructor(public playerId: string) {}

    serialize(): string {
        const data = {
            playerId: this.playerId,
            index: this.index,
            priority: this.priority
        }
        return JSON.stringify(data);
    }

    static deserialize(serializedPlayerPosition: string): PlayerPosition {
        const data = JSON.parse(serializedPlayerPosition);
        const pos = new PlayerPosition(data.playerId);
        pos.index = data.index;
        pos.priority = data.priority;
        return pos;
    }
}

export class Board {
    private tiles: Array<Tile | undefined> = [];
    private tileDealer: TileDealer;
    public availabilityMarkerPosition: number = 0;

    private constructor(tileDealer: TileDealer, public playerPositions: Array<PlayerPosition>) {
        this.tileDealer = tileDealer;
    }

    static newBoard(tileDealer: TileDealer, playerPositions: Array<PlayerPosition>): Board {
        const board = new Board(tileDealer, playerPositions);
        board.refreshTiles();
        return board
    }

    getSortedPlayerPositions(): Array<PlayerPosition> {
        const cmp = (p1: PlayerPosition, p2: PlayerPosition) => {
            if (p1.index > p2.index) {
                return 1;
            } else if (p1.index === p2.index) {
                return p1.priority - p2.priority
            } else if (p1.index > p2.index) {
                return -1;
            }
            return 0;
        }

        this.playerPositions.sort(cmp);
        return this.playerPositions;
    }

    advancePlayerPosition(playerId: string, steps: number) {
        const pos = this.playerPositions.find((p) => p.playerId === playerId);
        if (pos === undefined) throw new Error('No player with id="' + playerId + '" found on the board');
        pos.index = pos.index + steps;
        pos.priority = Date.now();
    }

    getFirstPlayerId(): string {
        let topPos = this.playerPositions[0];
        for (let pos of this.playerPositions) {
            if (pos.index > topPos.index) {
                topPos = pos;
                continue;
            }
            if (pos.index === topPos.index && pos.priority > topPos.priority) {
                topPos = pos;
                continue;
            }
        }

        return topPos.playerId;
    }

    countRemainingTiles() {
        return this.tiles.filter((t) => t !== undefined).length
    }

    refreshTiles(soloMode: boolean = false): boolean {
        if (this.getAvailableTiles().length > 2 && ! soloMode) return false;

        var tile: Tile | undefined;
        if (soloMode) {
            for (let i = 0; i <= MAX_AVAILABILITY_MARKER_POSITION; i++) {
                if (this.tiles[i] === undefined) {
                    tile = this.tileDealer.deal();
                    this.tiles[i] = tile;
                }
            }
        } else {
            for (tile of this.tiles) {
                if (tile) this.tileDealer.discard(tile);
            }
            this.tiles = [];

            for (let i = 0; i <= MAX_AVAILABILITY_MARKER_POSITION; i++) {
                tile = this.tileDealer.deal();
                this.tiles.push(tile);
            }
        }
        return true
    }

    getAvailableTiles(): Array<Tile> {
        const availableTiles: Array<Tile> = [];
        for (let i = this.availabilityMarkerPosition; i < MAX_AVAILABILITY_MARKER_POSITION + 1; i++) {
            const tile = this.tiles[i];
            if (tile === undefined) continue;
            availableTiles.push(tile);
            if (availableTiles.length === MAX_TILES_AVAILABLE) break;
        }

        if (availableTiles.length === MAX_TILES_AVAILABLE) return availableTiles;

        for (let i = 0; i <= this.availabilityMarkerPosition; i++) {
            const tile = this.tiles[i];
            if (tile === undefined) continue;
            availableTiles.push(tile);
            if (availableTiles.length === MAX_TILES_AVAILABLE) break;
        }

        return availableTiles;
    }

    takeTile(tileId: string): Tile | undefined {
        const tile = this.getAvailableTiles().find(t => t.id === tileId)
        if (tile === undefined) {
            console.error('Can\t get tile ' + tileId);
            return undefined;
        }

        const tileIndex = this.tiles.indexOf(tile);
        this.availabilityMarkerPosition = tileIndex;
        this.tiles[tileIndex] = undefined;

        return tile;
    }

    getTilesForClient(): Array<Tile | undefined> {
        return this.tiles;
    }

    static deserialize(serializedBoard: string, tileDealer: TileDealer): Board {
        const data = JSON.parse(serializedBoard);
        const playerPositions = data.playerPositions.map((p: string) => PlayerPosition.deserialize(p))
        const board = new Board(tileDealer, playerPositions);
        board.tiles = data.tileIds.map((t: string | undefined) => t !== undefined ?  Tile.fromDefinition(t): undefined);
        board.availabilityMarkerPosition = data.availabilityMarkerPosition;
        return board;
    }

    serialize(): string {
        const data = {
            tileIds: this.tiles.map(t => t?.id),
            availabilityMarkerPosition: this.availabilityMarkerPosition,
            playerPositions: this.playerPositions.map(p => p.serialize())
        }
        return JSON.stringify(data);
    }
}
