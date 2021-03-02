import { Side } from './Side';
import { TileColor } from './TileColor';
import { TileConfig } from './TileConfig';

class Requirement {
    constructor(public color: TileColor, public count: number) {}
}

export class Task {
    public requirements: Array<Requirement>;

    constructor(public tile: Tile, colors: Array<TileColor>) {
        this.tile = tile;

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
        if (this.requirements.length === 0) return true;
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

    attachAnotherTile(tile: Tile, side: Side.Left | Side.Right | Side.Top | Side.Bottom) {
        if (side === Side.Left) {
            this.left = tile;
        } else if (side === Side.Right) {
            this.right = tile;
        } else if (side === Side.Top) {
            this.top = tile;
        } else if (side === Side.Bottom) {
            this.bottom = tile;
        }
    }

    private makeId() {
        /*
        Takes a tile config like this:
            {
                "color": "turquoise",
                "cost": 5,
                "tasks": [
                    ["turquoise", "turquoise"],
                    ["red", "red"],
                    ["yellow", "yellow"]
                    
                ]
            },
        And generates a tile id like this
        t_5_2t_2r_2y (<color>_<cost>_<short_task_1>_<short_task_2>...)
        
        */
        let idParts: Array<string> = [
            this.color.toLowerCase()[0],
            this.cost.toString()
        ];

        for (let task of this.tasks) {
            let reqParts: Array<string> = [];
            for (let req of task.requirements) {
                let newPart = (req.count > 1) ? req.count.toString() : "";
                newPart += req.color[0];
                reqParts.push(newPart)
            }
            if (reqParts.length > 0) {
                idParts.push(reqParts.join(""))
            }
        }
        return idParts.join("_");
    }

    static fromConfig(config: TileConfig) {
        let tile = new Tile();

        tile.color = config.color;
        tile.cost = config.cost;

        for (let task of config.tasks) {
            tile.tasks.push(new Task(tile, task));
        }

        tile.id = tile.makeId();

        return tile;
    }

    public getNeighbors(): Array<Tile> {
        let neighbors = [this.left, this.top, this.right, this.bottom].filter(t => t !== undefined);
        return neighbors as Array<Tile>;
    }

    public getCountOfColor(color: TileColor, excludeTile: Tile | undefined = undefined): number {
        let count = 0;
        for (let tile of this.getNeighbors()) {
            if (excludeTile && excludeTile.id == tile.id) continue;
            if (tile.color == color) count++;
            count += tile.getCountOfColor(color, this); 
        }
        return count;
    }
}