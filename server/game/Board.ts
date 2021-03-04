import { Tile } from '../tiles/Tile';
import { TileDealer } from '../tiles/TileDealer';

const MAX_PLAYER_POSITION = 23;
const MAX_AVAILABILITY_MARKER_POSITION = 11
const MAX_TILES_AVAILABLE = 3;

export class PlayerPosition {
    public index: number = 0;
    public priority: number = 0;
    
    constructor(public playerId: string) {}
}

export class Board {
    private tiles: Array<Tile | undefined> = [];
    private tileDealer: TileDealer;
    public availabilityMarkerPosition: number = 0;

    constructor(tileDealer: TileDealer, public playerPositions: Array<PlayerPosition>) {
        this.tileDealer = tileDealer;
        this.refreshTiles();
    }

    advancePlayerPosition(playerId: string, steps: number) {
        const pos = this.playerPositions.find((p) => p.playerId === playerId);
        if (pos === undefined) throw new Error('No player with id="' + playerId + '" found on the board');
        let newPositionIndex = pos.index + steps;
        if (newPositionIndex > MAX_PLAYER_POSITION) {
            newPositionIndex -= MAX_PLAYER_POSITION;
        }
        pos.index = newPositionIndex;
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

    refreshTiles(): boolean {
        if (this.getAvailableTiles().length > 2) return false;

        var tile: Tile | undefined;
        for (tile of this.tiles) {
            if (tile) this.tileDealer.discard(tile);
        }
        this.tiles = [];

        for (let i = 0; i <= MAX_AVAILABILITY_MARKER_POSITION; i++) {
            tile = this.tileDealer.deal();
            this.tiles.push(tile);
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

    getTile(tileIndex: number): Tile {
        const tile = this.tiles[tileIndex];
        if (tile === undefined) {
            throw new Error('There is no tile in "' + tileIndex.toString() + '" position');
        }

        if (this.getAvailableTiles().find(t => t.id === tile.id) === undefined) {
            throw new Error('Tile "' + tile.id + '" is not available');
        }

        this.availabilityMarkerPosition = tileIndex;
        this.tiles[tileIndex] = undefined;

        return tile;
    }
}
