import { MAX_ACTIVE_TILES, Player } from '../../game/Player';
import { Side } from '../../tiles/Side';
import { TilesetData, TileCoords } from '../../tiles/Tile';
import { tileForClient } from './BoardAdapter';
import { PlayerClientModel, TileClientModel, TilePlaceholder } from './Interfaces';

function getAttachmentSide(x: number, y: number, coord: TileCoords): Side | false {
    if (x - 1 === coord.x && y === coord.y) return Side.Right;
    if (x + 1 === coord.x && y === coord.y) return Side.Left;
    if (x === coord.x && y - 1 === coord.y) return Side.Top;
    if (x === coord.x && y + 1 === coord.y) return Side.Bottom;
    return false
}

function getTilePlaceholder(x: number, y: number, tilesetData: TilesetData) : TilePlaceholder {
    const emptyPlaceholder: TilePlaceholder = {tileId: '', side: undefined}
    const b = tilesetData.bounds;
    if (x === b.minX - 1 && y === b.minY - 1) return emptyPlaceholder;
    if (x === b.minX - 1 && y === b.maxY + 1) return emptyPlaceholder;
    if (y === b.minY - 1 && x === b.maxX + 1) return emptyPlaceholder;
    if (y === b.maxY + 1 && x === b.maxX + 1) return emptyPlaceholder;

    for (let coord of tilesetData.coords) {
        if (coord.tileId === "") continue;
        const sideToAttach = getAttachmentSide(x, y, coord);
        if (sideToAttach) {
            return {
                tileId: coord.tileId,
                side: sideToAttach
            };
        }
    }
    return emptyPlaceholder;
}

function buildTileset(tilesetData: TilesetData) {
    const tileset: Array<Array<TileClientModel | TilePlaceholder>> = [];
    var newLine: Array<TileClientModel | TilePlaceholder> = [];
    for (let y = tilesetData.bounds.maxY + 1; y >= tilesetData.bounds.minY - 1; y--) {
        newLine = [];
        for (let x = tilesetData.bounds.minX - 1; x <= tilesetData.bounds.maxX + 1; x++) {
            let tileCoord = tilesetData.coords.find((c: TileCoords) => c.x === x && c.y === y);
            if (tileCoord === undefined ) {
                newLine.push(getTilePlaceholder(x, y, tilesetData))
            } else {
                let tile = tilesetData.tiles.get(tileCoord.tileId);
                if (tile === undefined) throw new Error('No tile found in tileset ' + tileCoord.tileId)
                newLine.push(tileForClient(tile))
            }
        }
        tileset.push(newLine)
    }
    return tileset;
}

function getInitialTileset() {
    const tileset: Array<Array<TileClientModel | TilePlaceholder>> = [];
    tileset.push([
        {tileId: '', side: undefined},
        {tileId: '', side: undefined},
        {tileId: '', side: undefined}
    ])

    tileset.push([
        {tileId: '', side: undefined},
        {tileId: 'root', side: Side.Top},
        {tileId: '', side: undefined}
    ])

    tileset.push([
        {tileId: '', side: undefined},
        {tileId: '', side: undefined},
        {tileId: '', side: undefined}
    ])
    return tileset;
}


export function playerToApi(player: Player): PlayerClientModel {
    const rootTile = player.rootTile;
    let activationsRemaining = MAX_ACTIVE_TILES;
    let tileset: Array<Array<TileClientModel | TilePlaceholder>> = [];
    if (rootTile !== undefined) {
        const tilesetData = rootTile.getTilesetData()
        tileset = buildTileset(tilesetData);
        activationsRemaining -= player.getActivationsCount(tilesetData)
    } else {
        tileset = getInitialTileset();
    }
    
    return {
        id: player.id,
        color: player.color,
        tileset: tileset,
        activationsRemaining: activationsRemaining
    }
}
