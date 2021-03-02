import { Tile } from './Tile';
import tileConfigs from '../../data/tiles.json'
import { shuffle } from '../Helpers';
import { TileConfig } from './TileConfig';

export class TileDealer {
    private tiles: Array<Tile> = [];
    public visibleTiles: Array<Tile> = [];
    private discard: Array<Tile> = [];

    constructor() {
        for (let config of tileConfigs) {
            this.tiles.push(Tile.fromConfig(config as TileConfig));
        }
        shuffle(this.tiles);
        this.refreshVisibleTiles();
    }

    public refreshVisibleTiles() {
        var tile: Tile;
        for (tile of this.visibleTiles) {
            this.discardTile(tile);
        }
        this.visibleTiles = [];

        for (let i = 0; i < 11; i++) {
            tile = this.dealTile();
            this.visibleTiles.push(tile);
        }
    }

    public getRemainingTilesCount() {
        return this.tiles.length;
    }

    public discardTile(tile: Tile) {
        this.discard.push(tile);
    }

    public dealTile(): Tile {
        let tile = this.tiles.pop();
        if (tile === undefined) {
            this.tiles = this.discard.slice()
            this.discard = [];
            shuffle(this.tiles)
            tile = this.tiles.pop()
        }

        if (tile === undefined) throw new Error("Empty tiles array in dealer");
        return tile;
    }
}