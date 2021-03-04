import { expect } from 'chai';
import { describe } from 'mocha';
import { Side } from '../../server/tiles/Side';
import { Tile } from "../../server/tiles/Tile";
import { makeTileConfigFromDefinition, TileConfig } from '../../server/tiles/TileConfig';

const configs: Array<TileConfig> = [
    {
        "color": "red",
        "cost": 6,
        "tasks": [
            ["turquoise", "turquoise", "turquoise"],
            ["turquoise", "yellow"],
            ["yellow", "yellow"]
        ]
    },
    {
        "color": "yellow",
        "cost": 2,
        "tasks": [
            ["yellow", "yellow", "yellow", "yellow"]
        ]
    },
    {
        "color": "blue",
        "cost": 3,
        "tasks": [
            ["yellow"],
            ["blue", "blue"]
        ]
    },
    {
        "color": "turquoise",
        "cost": 1,
        "tasks": [
            []
        ]
    },
    {
        "color": "yellow",
        "cost": 5,
        "tasks": [
            ["red", "red", "red"],
            ["red"]
        ]
    }
];

describe('Tile', function() {
    it('constructible from JSON-like config', function() {
        const tile = Tile.fromConfig(configs[0]);
        expect(tile.id).to.eq("r_6_3t_ty_2y");
    });

    it('supports another tiles attachment', function() {
        
        const tiles: Array<Tile> = [];
        for (let tc of configs) {
            tiles.push(Tile.fromConfig(tc))
        }

        let targetTile = tiles[4];

        targetTile.attachAnotherTile(tiles[0], Side.Left);
        targetTile.attachAnotherTile(tiles[1], Side.Top);
        targetTile.attachAnotherTile(tiles[2], Side.Right);
        targetTile.attachAnotherTile(tiles[3], Side.Bottom);

        const neighbors = targetTile.getNeighbors();
        expect(neighbors[0].id).to.eq(tiles[0].id)
        expect(neighbors[1].id).to.eq(tiles[1].id)
        expect(neighbors[2].id).to.eq(tiles[2].id)
        expect(neighbors[3].id).to.eq(tiles[3].id)
    });

    it('calculates adjanced colors count', function() {
        const tiles: Array<Tile> = [];
        for (let tc of configs) {
            tiles.push(Tile.fromConfig(tc))
        }

        const targetTile = tiles[0];

        targetTile.attachAnotherTile(tiles[1], Side.Right);
        tiles[1].attachAnotherTile(tiles[4], Side.Right);

        targetTile.attachAnotherTile(tiles[2], Side.Top);

        expect(targetTile.getCountOfColor("yellow")).to.eq(2);

        expect(targetTile.getCountOfColor("blue")).to.eq(1);
    });

    it('calculates adjanced colors count case 2', function() {
        /* 
            T - target tile with the Task to complete
            R,B,T,Y - red, blue, turquoise, yellow tile respectively

            Checking the configuration:
            T
            RR
            R

            to complete 3r task
        */

        const target = Tile.fromConfig(makeTileConfigFromDefinition("b_1_3r"));

        const redTile1 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));
        const redTile2 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));
        const redTile3 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));

        target.attachAnotherTile(redTile1, Side.Bottom);
        redTile1.attachAnotherTile(redTile2, Side.Right);
        redTile1.attachAnotherTile(redTile3, Side.Bottom);

        expect(target.getCountOfColor("red")).to.eq(3);
        expect(target.tasks[0].isComplete()).to.be.true;
    });

    it('calculates adjanced colors count case 3', function() {
        /* 
            T - target tile with the Task to complete
            R,B,T,Y - red, blue, turquoise, yellow tile respectively

            Checking the configuration:
            RTR
             R

            to complete 3r task
        */

        const target = Tile.fromConfig(makeTileConfigFromDefinition("b_1_3r"));

        const redTile1 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));
        const redTile2 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));
        const redTile3 = Tile.fromConfig(makeTileConfigFromDefinition("r_1"));

        target.attachAnotherTile(redTile1, Side.Left);
        target.attachAnotherTile(redTile2, Side.Right);
        target.attachAnotherTile(redTile3, Side.Bottom);

        expect(target.getCountOfColor("red")).to.eq(3);
        expect(target.tasks[0].isComplete()).to.be.true;
    });
});
