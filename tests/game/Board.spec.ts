import {expect} from 'chai';
import {describe} from 'mocha';
import { Board, PlayerPosition } from '../../server/game/Board';
import { TileDealer } from '../../server/tiles/TileDealer';
import { wait } from '../Utils';

function makeBoard(): Board {
    const dealer = TileDealer.fromFile();
    const playerPositions = [
        new PlayerPosition("1"),
        new PlayerPosition("2")
    ];
    const board = Board.newBoard(dealer, playerPositions);
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

        expect(board.getFirstPlayerId()).to.eq("2");

        wait();

        board.advancePlayerPosition("2", 1);
        expect(board.getFirstPlayerId()).to.eq("2");

        wait();

        board.advancePlayerPosition("1", 0);
        expect(board.getFirstPlayerId()).to.eq("1");
    });

    it('moves availability marker when tile is taken', function() {
        const board = makeBoard();
        expect(board.availabilityMarkerPosition).to.eq(0);
        board.takeTile((board as any).tiles[2].id);
        expect(board.availabilityMarkerPosition).to.eq(2);
    });

    it('disallows to take a tile from position too far from the availability marker', function() {
        const board = makeBoard();
        expect(board.takeTile((board as any).tiles[3].id)).to.be.undefined;
    });

    it('disallows to refresh tiles if there are a lot of tiles', function() {
        const board = makeBoard();
        expect(board.refreshTiles()).to.be.false;
    });

    it('refreshes tiles', function() {
        const board = makeBoard();
        for (let i = 0; i < 10; i++) {
            board.takeTile((board as any).tiles[i].id);
        }
        expect(board.getAvailableTiles().length).to.eq(2);

        board.refreshTiles();

        expect(board.getAvailableTiles().length).to.eq(3);
    });
});
