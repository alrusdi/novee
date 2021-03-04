import {expect} from 'chai';
import {describe} from 'mocha';
import { Board, PlayerPosition } from '../../server/game/Board';
import { TileDealer } from '../../server/tiles/TileDealer';
import { wait } from '../Utils';

function makeBoard(): Board {
    const dealer = new TileDealer();
    const playerPositions = [
        new PlayerPosition("1"),
        new PlayerPosition("2")
    ];
    const board = new Board(dealer, playerPositions);
    return board
}

describe('Board', function() {
    it('has working constructor', function() {
        makeBoard();
    });

    it('provides available tiles', function() {
        const board = makeBoard();
        const tiles = board.getAvailableTiles();
        expect(tiles.length).to.eq(3);
    });

    it('provides available tiles', function() {
        const board = makeBoard();
        const tiles = board.getAvailableTiles();
        expect(tiles.length).to.eq(3);
    });

    it('tracks player marker priorities', function() {
        const board = makeBoard();
        board.advancePlayerPosition("2", 1);
        board.advancePlayerPosition("1", 2);

        expect(board.getFirstPlayerId()).to.eq("1");

        wait();

        board.advancePlayerPosition("2", 1);
        expect(board.getFirstPlayerId()).to.eq("2");

        wait();

        board.advancePlayerPosition("1", 0);
        expect(board.getFirstPlayerId()).to.eq("1");
    });

    it('moves availability marker when tile is taken', function() {
        const board = makeBoard();
        board.getTile(2);
        expect(board.availabilityMarkerPosition).to.eq(2);
    });

    it('disallows to take a tile from position too far from the availability marker', function() {
        const board = makeBoard();
        expect(() => board.getTile(3)).to.throw();
    });

    it('disallows to take a tile from empty position', function() {
        const board = makeBoard();
        board.getTile(1)
        expect(() => board.getTile(1)).to.throw();
    });

    it('disallows to refresh tiles if there are a lot of tiles', function() {
        const board = makeBoard();
        expect(board.refreshTiles()).to.be.false;
    });


    it('refreshes tiles', function() {
        const board = makeBoard();
        for (let i = 1; i < 11; i++) {
            board.getTile(i);
        }
        expect(board.getAvailableTiles().length).to.eq(2);

        board.refreshTiles();

        expect(board.getAvailableTiles().length).to.eq(3);
    });
});
