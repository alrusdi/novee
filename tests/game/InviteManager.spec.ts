import {expect} from 'chai';
import {describe} from 'mocha';
import { CreateGameModel } from '../../server/api/models/CreateGameModel';
import { InvitesManager } from '../../server/game/InvitesManager';


describe('InviteManager', function() {
    it('creates invite from options', function() {
        InvitesManager.flush();

        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: "7"
        }
        const invite = InvitesManager.createNewInvite(cfg);

        expect(invite.id).to.not.be.undefined;
        expect(invite.isPublic).to.be.false;

        const loadedInvite = InvitesManager.getInvite(invite.id);
        expect(invite.id).to.eq(loadedInvite.id)
    });

    it('returns list of the public invites', function() {
        InvitesManager.flush();
        
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: "7"
        }
        const invite = InvitesManager.createNewInvite(cfg);
        InvitesManager.publishInvite(invite.id);
        expect(invite.isPublic).to.be.true;

        const invite2 = InvitesManager.createNewInvite(cfg);
        InvitesManager.publishInvite(invite2.id);
        expect(invite2.isPublic).to.be.true;

        const invite3 = InvitesManager.createNewInvite(cfg);
        expect(invite3.isPublic).to.be.false;

        const invites = InvitesManager.getPublicInvites();
        expect(invites.length).to.eq(2);
        expect(invites.map(i => i.id)).includes(invite.id)
        expect(invites.map(i => i.id)).includes(invite2.id)
    });

    it('removes invite by id', function() {
        InvitesManager.flush();
        
        const cfg: CreateGameModel = {
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: "7"
        }
        const invite = InvitesManager.createNewInvite(cfg);
        InvitesManager.publishInvite(invite.id);

        const invite2 = InvitesManager.createNewInvite(cfg);
        InvitesManager.publishInvite(invite2.id);

        let invites = InvitesManager.getPublicInvites();
        expect(invites.length).to.eq(2);

        InvitesManager.removeInvite(invite.id);

        invites = InvitesManager.getPublicInvites();
        expect(invites.length).to.eq(1);
        expect(invites.map(i => i.id)).includes(invite2.id)
    });
});
