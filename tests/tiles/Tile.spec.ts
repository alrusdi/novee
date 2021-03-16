import { expect } from 'chai';
import { describe } from 'mocha';
import { Side } from '../../server/tiles/Side';
import { Tile } from "../../server/tiles/Tile";

const defs: Array<string> = [
    "05_r_6_ttt_ty_yy",
    "06_y_2_yyyy",
    "07_y_2_yyyy",
    "08_r_5_bb_y",
    "09_t_5_tt_rr_yy",
    "10_y_6_tt_rr_b",
    "11_t_3_byy",
    "12_b_6_tt_rr_y",
    "13_b_3_ybb",
];

describe('Tile', function() {
    it('constructible from string definition', function() {
        const tile = Tile.fromDefinition('05_r_6_ttt_ty_yy');
        expect(tile.tasks.length).to.eq(3);
        expect(tile.cost).to.eq(6);
        expect(tile.color).to.eq('red');
    });

    it('supports another tiles attachment', function() {
        const tiles: Array<Tile> = [];
        for (let tc of defs) {
            tiles.push(Tile.fromDefinition(tc))
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
        /* 
            T - target tile with the Task to complete
            R,B,T,Y - red, blue, turquoise, yellow tile respectively

            Checking the configuration:
            B
            TYY
        */
        const targetTile = Tile.fromDefinition('01_r_1');
        const y1 = Tile.fromDefinition('02_y_1');
        const y2 = Tile.fromDefinition('03_y_2');

        targetTile.attachAnotherTile(y1, Side.Right);
        y1.attachAnotherTile(y2, Side.Right);

        targetTile.attachAnotherTile(Tile.fromDefinition('04_b_1'), Side.Top);

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

        const target = Tile.fromDefinition("01_b_1_rr");

        const redTile1 = Tile.fromDefinition("02_r_1");
        const redTile2 = Tile.fromDefinition("03_r_2");
        const redTile3 = Tile.fromDefinition("04_r_3");

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

        const target = Tile.fromDefinition("01_b_1_rrr");

        const redTile1 = Tile.fromDefinition("02_r_1");
        const redTile2 = Tile.fromDefinition("03_r_2");
        const redTile3 = Tile.fromDefinition("04_r_3");

        target.attachAnotherTile(redTile1, Side.Left);
        target.attachAnotherTile(redTile2, Side.Right);
        target.attachAnotherTile(redTile3, Side.Bottom);

        expect(target.getCountOfColor("red")).to.eq(3);
        expect(target.tasks[0].isComplete()).to.be.true;
    });

    it('calculates tileset size', function () {
        /*
            Tileset is kinda this

            10010000 -> r-line
            11111110 -> b-line
            101X0010 -> y-line
            00010011 -> t-line
        */

        const tiles = [
            Tile.fromDefinition("01_r_1"),
            Tile.fromDefinition("02_r_4"),
            Tile.fromDefinition("03_b_1"),
            Tile.fromDefinition("04_b_2"),
            Tile.fromDefinition("05_b_3"),
            Tile.fromDefinition("06_b_4"),
            Tile.fromDefinition("07_b_5"),
            Tile.fromDefinition("08_b_6"),
            Tile.fromDefinition("09_b_7"),
            Tile.fromDefinition("10_y_1"),
            Tile.fromDefinition("11_y_3"),
            Tile.fromDefinition("12_y_4"),
            Tile.fromDefinition("13_y_7"),
            Tile.fromDefinition("14_t_4"),
            Tile.fromDefinition("15_t_7"),
            Tile.fromDefinition("16_t_0")
        ]

        const ft = (name: string) => {
            const t = tiles.find(t => t.id.endsWith(name));
            if (t === undefined) throw new Error("Tile not found");
            return t
        }

        const xTile = ft("y_4");
        xTile.attachAnotherTile(ft("y_3"), Side.Left)
        xTile.attachAnotherTile(ft("b_4"), Side.Top)
        xTile.attachAnotherTile(ft("t_4"), Side.Bottom)

        ft("b_4").attachAnotherTile(ft("b_3"), Side.Left);
        ft("b_4").attachAnotherTile(ft("b_5"), Side.Right);
        ft("b_4").attachAnotherTile(ft("r_4"), Side.Top);
        ft("b_5").attachAnotherTile(ft("b_6"), Side.Right);
        ft("b_6").attachAnotherTile(ft("b_7"), Side.Right);
        ft("b_7").attachAnotherTile(ft("y_7"), Side.Bottom);
        ft("y_7").attachAnotherTile(ft("t_7"), Side.Bottom);
        ft("t_7").attachAnotherTile(ft("t_0"), Side.Right);
        ft("b_3").attachAnotherTile(ft("b_2"), Side.Left);
        ft("b_2").attachAnotherTile(ft("b_1"), Side.Left);
        ft("b_1").attachAnotherTile(ft("y_1"), Side.Bottom);
        ft("b_1").attachAnotherTile(ft("r_1"), Side.Top);
        ft("y_3").attachAnotherTile(ft("b_3"), Side.Top);

        const size = xTile.getTilesetData();
        expect(size.width).to.eq(8);
        expect(size.height).to.eq(4);
        // console.log(size.coords)
    });

    it('is serializable', function() {
        const target = Tile.fromDefinition("01_b_1_rrr");

        const redTile1 = Tile.fromDefinition("02_r_1");
        const redTile2 = Tile.fromDefinition("03_r_2");
        const redTile3 = Tile.fromDefinition("04_r_3");

        target.attachAnotherTile(redTile1, Side.Left);
        target.attachAnotherTile(redTile2, Side.Right);
        target.attachAnotherTile(redTile3, Side.Bottom);

        const data = target.serialize();
        const newTile: Tile = Tile.deserialize(data);
        
        const nbs = newTile.getAllNeighbors();
        expect(nbs[0]?.id).to.eq(redTile1.id);
        expect(nbs[1]?.id).to.be.undefined;
        expect(nbs[2]?.id).to.eq(redTile2.id);
        expect(nbs[3]?.id).to.eq(redTile3.id);
    });
});
