import {expect} from 'chai';
import {describe} from 'mocha';
import { CreateGameModel } from '../../server/api/models/CreateGameModel';
import { Invite } from '../../server/game/Invite';
import { PlayerColor } from '../../server/game/PlayerColor';


describe('Invite', function() {
    it('has working constructor', function() {
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: "7"
        }
        const invite = new Invite(cfg);

        expect(invite.id).to.not.be.undefined;
        expect(invite.isPublic).to.be.false;
    });

    it('accepts players to join', function() {
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: "7"
        }
        const invite = new Invite(cfg);
        const seats = invite.getSeats();

        const seat = invite.takeSeat(seats[0].id, "100", PlayerColor.Orange);
        expect(seat?.accountId).to.eq("100");
        expect(seat?.color).to.eq(PlayerColor.Orange);

        const seat2 = invite.takeSeat(seats[1].id,"200", PlayerColor.Orange);
        expect(seat2?.accountId).to.eq("200");
        expect(seat2?.color).not.to.eq(PlayerColor.Orange);
    });

    it('does not accept new players if all places are taken', function() {
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 2,
            adminId: "7"
        }
        const invite = new Invite(cfg);
        const seats = invite.getSeats();

        const seat = invite.takeSeat(seats[0].id, "100", PlayerColor.Orange);
        expect(seat?.accountId).to.eq("100");
        expect(seat?.color).to.eq(PlayerColor.Orange);

        const seat2 = invite.takeSeat(seats[1].id, "200", PlayerColor.Orange);
        expect(seat2?.accountId).to.eq("200");
        expect(seat2?.color).not.to.eq(PlayerColor.Orange);

        const seat3 = invite.takeSeat("0", "300", PlayerColor.Pink);
        expect(seat3).to.be.undefined;
    });


    it('does not accept the same player twice', function() {
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 2,
            adminId: "7"
        }
        const invite = new Invite(cfg);
        const seats = invite.getSeats();

        const seat = invite.takeSeat(seats[0].id, "100", PlayerColor.Orange);
        expect(seat?.accountId).to.eq("100");
        expect(seat?.color).to.eq(PlayerColor.Orange);

        const seat3 = invite.takeSeat(seats[1].id, "100", PlayerColor.Pink);
        expect(seat3).to.be.undefined;
    });
});
