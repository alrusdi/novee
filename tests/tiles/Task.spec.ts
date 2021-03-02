import {expect} from 'chai';
import {describe} from 'mocha';
import {Tile, Task} from "../../server/tiles/Tile";


describe('Task', function() {
    it('should initialize requirements', function() {
        const task = new Task( new Tile(), ["red", "red", "yellow"]);
        expect(task.requirements.length).to.eq(2);

        const req1 = task.requirements[0];
        expect(req1.color).to.eq("red");
        expect(req1.count).to.eq(2);

        const req2 = task.requirements[1];
        expect(req2.color).to.eq("yellow");
        expect(req2.count).to.eq(1);
    });
});
