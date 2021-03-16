import {expect} from 'chai';
import {describe} from 'mocha';
import {TileDealer} from "../../server/tiles/TileDealer";


describe('TileDealer', function() {
    it('correctly loads tile configs fron json file', function() {
        const dealer = TileDealer.fromFile();
        expect(dealer.getRemainingTilesCount()).to.eq(67);
    });

    it('deals random tile', function() {
        const dealer = TileDealer.fromFile();
        expect(dealer.getRemainingTilesCount()).to.eq(67);

        const tile = dealer.deal();
        expect(tile.cost).greaterThan(0);

        expect(dealer.getRemainingTilesCount()).to.eq(66);
    });

    it('supports tiles discard', function() {
        const dealer = TileDealer.fromFile();
        expect(dealer.getRemainingTilesCount()).to.eq(67);

        const tile = dealer.deal();
        expect(tile.cost).greaterThan(0);
        
        dealer.discard(tile);
        expect((dealer as any).discard.length).to.eq(1);
    });

    it('serializable', function () {
        const dealer = TileDealer.fromFile();
        dealer.discard(dealer.deal())
        dealer.discard(dealer.deal())
        const serialized = dealer.serialize();
        const newDealer = TileDealer.deserialize(serialized);
        expect(newDealer.getRemainingTilesCount()).to.eq(dealer.getRemainingTilesCount());
        expect((newDealer as any).discardedTiles.length).to.eq((dealer as any).discardedTiles.length);
    });
});
