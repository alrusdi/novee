import { Side } from './Side';
import { TileColor } from './TileColor';
import { colorFromLetter, parseColors } from './TileConfig';

export class Requirement {
    constructor(public color: TileColor, public count: number) {}
}

interface Bounds {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

export interface TilesetData {
    width: number;
    height: number;
    bounds: Bounds;
    coords: Array<TileCoords>;
    tiles: Map<string, Tile>;
}

interface Coords {
    x: number;
    y: number;
}

export interface TileCoords {
    tileId: string;
    x: number;
    y: number;
}

class CoordsInfo {
    constructor(
        public allTiles: Map<string, Tile>,
        public coords: Map<string, Coords>
    ) {}

    getTileByCoords(coords: Coords): Tile | undefined {
        let tile: Tile | undefined = undefined;
        this.coords.forEach((c: Coords, tileId: string) => {
            if (c.x === coords.x && c.y === coords.y) {
                tile = this.allTiles.get(tileId)
            }
        });
        return tile;
    }
}

export class Task {
    public requirements: Array<Requirement>;

    constructor(public tile: Tile, colors: Array<TileColor>) {
        this.tile = tile;
        if (colors.length === 1) {
            this.requirements = [new Requirement(colors[0], 1)];
            return;
        }

        colors.sort();
        let taskRequirements: Array<Requirement> = [];

        let prevColor: TileColor = colors[0];
        var newColor: TileColor;
        let countOfColor = 1;
        let isLastIteration = false;
        for (let reqId = 1; reqId < colors.length; reqId ++) {
            isLastIteration = reqId + 1 ===  colors.length;
            newColor = colors[reqId];
            if (newColor !== prevColor) {
                taskRequirements.push(new Requirement(prevColor, countOfColor));
                countOfColor = 1;
                prevColor = newColor;

                if ( ! isLastIteration) continue;
            } else {
                countOfColor += 1;
                prevColor = newColor;
                if ( ! isLastIteration) continue;
            }

            taskRequirements.push(new Requirement(prevColor, countOfColor));
        }
        this.requirements = taskRequirements;
    }

    public isComplete(): boolean {
        if (this.requirements.length === 0) return false; // No requirements === no chanses to activate task
        for (let req of this.requirements) {
            if (this.tile.getCountOfColor(req.color) < req.count) {
                return false;
            }
        }
        return true;
    }
}

export class Tile {
    public id: string = "";
    public cost: number = 0;
    public color: TileColor = "red";
    public tasks: Array<Task> = [];

    private left: Tile | undefined = undefined;
    private right: Tile | undefined = undefined;
    private top: Tile | undefined = undefined;
    private bottom: Tile | undefined = undefined;

    attachAnotherTile(tile: Tile, side: Side) {
        const coordsInfo = this.getCoordsInfo();
        const curCoords = coordsInfo.coords.get(this.id);
        if (curCoords === undefined) throw new Error('Can\'t find current tile coords');

        var coords: Coords | undefined = undefined;
        if (side === Side.Left) {
            coords = {x: curCoords.x - 1, y: curCoords.y};
        } else if (side === Side.Right) {
            coords = {x: curCoords.x + 1, y: curCoords.y};
        } else if (side === Side.Top) {
            coords = {x: curCoords.x, y: curCoords.y + 1};
        } else if (side === Side.Bottom) {
            coords = {x: curCoords.x, y: curCoords.y - 1};
        }

        if (coords === undefined) return;
        coordsInfo.coords.set(tile.id, coords);
        this.syncRelations(coordsInfo);
        tile.syncRelations(coordsInfo);
    }

    isSideAvailableToAttach(side: Side): boolean {
        if (side === Side.Left && this.left === undefined) return true;
        if (side === Side.Top && this.top === undefined) return true;
        if (side === Side.Right && this.right === undefined) return true;
        if (side === Side.Bottom && this.bottom === undefined) return true;
        return false;
    }

    serialize(): string {
        const coordsInfo = this.getCoordsInfo();
        const coords: Array<any> = [];
        coordsInfo.coords.forEach((value, key) => {
            coords.push({
                id: key,
                coords: value
            })
        })
        return JSON.stringify({
            rootTileId: this.id,
            coords: coords
        });
    }

    static deserialize(serializedTileset: string): Tile {
        const tiles = new Map<string, Tile>();
        const coords = new Map<string, Coords>();
        const data = JSON.parse(serializedTileset);

        for (const coordInfo of data.coords) {
            tiles.set(coordInfo.id, Tile.fromDefinition(coordInfo.id));
            coords.set(coordInfo.id, coordInfo.coords)
        }

        const coordsInfo = new CoordsInfo(tiles, coords);

        for (const tile of tiles.values()) {
            tile.syncRelations(coordsInfo)
        }

        const rootTile = tiles.get(data.rootTileId);
        if (rootTile === undefined) throw new Error('Can\'t parse root tile');
        return rootTile;
    }

    private syncRelations(coordsInfo: CoordsInfo) {
        const tileCoords = coordsInfo.coords.get(this.id);
        if (tileCoords === undefined) throw new Error('Can\'t find tile coords');

        const tx = tileCoords.x;
        const ty = tileCoords.y

        const left = coordsInfo.getTileByCoords({x: tx - 1, y: ty})
        if (left !== undefined) {
            this.left = left;
            left.right = this;
        }

        const right = coordsInfo.getTileByCoords({x: tx + 1, y: ty})
        if (right !== undefined) {
            this.right = right;
            right.left = this;
        }

        const top = coordsInfo.getTileByCoords({x: tx, y: ty + 1})
        if (top !== undefined) {
            this.top = top;
            top.bottom = this;
        }

        const bottom = coordsInfo.getTileByCoords({x: tx, y: ty - 1})
        if (bottom !== undefined) {
            this.bottom = bottom;
            bottom.top = this;
        }
    }

    static fromDefinition(def: string): Tile {
        let tile = new Tile();
        tile.id = def;
        const parts = def.split('_');
        tile.color = colorFromLetter(parts[1]);
        tile.cost = parseInt(parts[2]);
        const colorSets = parts.slice(3, 7).map(parseColors);
        for (let colors of colorSets) {
            tile.tasks.push(new Task(tile, colors));
        }
        return tile;
    }

    public getNeighbors(): Array<Tile> {
        let neighbors = this.getAllNeighbors().filter(t => t !== undefined);
        return neighbors as Array<Tile>;
    }

    public getAllNeighbors(): Array<Tile | undefined> {
        return [this.left, this.top, this.right, this.bottom];
    }

    public getCountOfColor(color: TileColor, alreadyVisited: Set<string> | undefined = undefined): number {
        let count = 0;
        if (alreadyVisited === undefined) {
            alreadyVisited = new Set<string>();
        }
        alreadyVisited.add(this.id);
        for (let tile of this.getNeighbors()) {
            if (alreadyVisited.has(tile.id)) continue;
            if (tile.color == color) {
                count++;
                count += tile.getCountOfColor(color, alreadyVisited);
            }
        }
        return count;
    }

    private getCoordsInfo(): CoordsInfo {
        const coords = new Map<string, Coords>();
        coords.set(this.id, {x: 0, y: 0});
        const allTiles = new Map<string, Tile>();
        this.visit(this, coords, allTiles);
        return new CoordsInfo(allTiles, coords);
    }

    public getTilesetData(): TilesetData {
        const coordsInfo = this.getCoordsInfo();
        const bounds: Bounds = {minX: 0, maxX: 0, minY: 0, maxY: 0};
        const normalizedCoords = new Array<TileCoords>();
        for (let coord of coordsInfo.coords.values()) {
            if (coord.x < bounds.minX) bounds.minX = coord.x;
            if (coord.x > bounds.maxX) bounds.maxX = coord.x;
            if (coord.y < bounds.minY) bounds.minY = coord.y;
            if (coord.y > bounds.maxY) bounds.maxY = coord.y;
        }

        for (let key of coordsInfo.coords.keys()) {
            const coord = coordsInfo.coords.get(key);
            if (coord === undefined) continue;
            normalizedCoords.push({
                tileId: key,
                x: coord.x,
                y: coord.y
            })
        }

        return {
            width: (bounds.maxX - bounds.minX) + 1,
            height: (bounds.maxY - bounds.minY) + 1,
            bounds: bounds,
            coords: normalizedCoords,
            tiles: coordsInfo.allTiles
        };
    }

    private visit(tile: Tile, coords: Map<string, Coords>, allTiles: Map<string, Tile>) {
        const currrentCoords = coords.get(tile.id);
        if (currrentCoords === undefined) throw new Error("Attempt to visit tile with unknown coords")
        if (allTiles.get(tile.id) === undefined) {
            allTiles.set(tile.id, tile);
        }

        if (tile.left !== undefined) {
            if (coords.get(tile.left.id) === undefined) {
                coords.set(tile.left.id, {x: currrentCoords.x - 1, y: currrentCoords.y});
                this.visit(tile.left, coords, allTiles);
            }
        }

        if (tile.top !== undefined) {
            if (coords.get(tile.top.id) === undefined) {
                coords.set(tile.top.id, {x: currrentCoords.x, y: currrentCoords.y + 1});
                this.visit(tile.top, coords, allTiles);
            }
        }

        if (tile.right !== undefined) {
            if (coords.get(tile.right.id) === undefined) {
                coords.set(tile.right.id, {x: currrentCoords.x + 1, y: currrentCoords.y});
                this.visit(tile.right, coords, allTiles);
            }
        }

        if (tile.bottom !== undefined) {
            if (coords.get(tile.bottom.id) === undefined) {
                coords.set(tile.bottom.id, {x: currrentCoords.x, y: currrentCoords.y - 1});
                this.visit(tile.bottom, coords, allTiles);
            }
        }
    }
}
