import {expect} from 'chai';
import {describe} from 'mocha';
import {TileDealer} from "../../server/tiles/TileDealer";


describe('TileDealer', function() {
    it('correctly loads tile configs fron json file', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(57);

        expect(dealer.visibleTiles.length).to.eq(11);
    });

    it('deals random tile', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(57);

        const tile = dealer.dealTile();
        expect(tile.cost).greaterThan(0);

        expect(dealer.getRemainingTilesCount()).to.eq(56);
    });

    it('supports tiles discard', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(57);

        const tile = dealer.dealTile();
        expect(tile.cost).greaterThan(0);
        
        dealer.discardTile(tile);
        expect((dealer as any).discard.length).to.eq(1);
    });
});