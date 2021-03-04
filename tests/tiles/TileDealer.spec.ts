import {expect} from 'chai';
import {describe} from 'mocha';
import {TileDealer} from "../../server/tiles/TileDealer";


describe('TileDealer', function() {
    it('correctly loads tile configs fron json file', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(68);
    });

    it('deals random tile', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(68);

        const tile = dealer.deal();
        expect(tile.cost).greaterThan(0);

        expect(dealer.getRemainingTilesCount()).to.eq(67);
    });

    it('supports tiles discard', function() {
        const dealer = new TileDealer();
        expect(dealer.getRemainingTilesCount()).to.eq(68);

        const tile = dealer.deal();
        expect(tile.cost).greaterThan(0);
        
        dealer.discard(tile);
        expect((dealer as any).discard.length).to.eq(1);
    });
});