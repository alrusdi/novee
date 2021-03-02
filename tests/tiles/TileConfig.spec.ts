import {expect} from 'chai';
import {describe} from 'mocha';
import { makeTileConfigFromDefinition } from '../../server/tiles/TileConfig';


describe('TileConfig', function() {
    it('generates correct config from string definition', function() {
        const config = makeTileConfigFromDefinition("t_7_2t_rb2y_r");
        expect(config.color).to.eq("turquoise");
        expect(config.cost).to.eq(7);
        expect(config.tasks[0]).to.deep.equal(["turquoise", "turquoise"]);
        expect(config.tasks[1]).to.deep.equal(["red", "blue", "yellow", "yellow"]);
        expect(config.tasks[2]).to.deep.equal(["red"]);
    });
});
