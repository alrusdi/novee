 import { CreateGameModel } from '../api/models/CreateGameModel';
import { Invite } from './Invite';

export class InvitesManager {
    private static invites: Map<string, Invite> = new Map<string, Invite>();
    private static publicInviteIds: Array<string>;

    static flush() {
        InvitesManager.invites = new Map<string, Invite>();
        InvitesManager.publicInviteIds = [];
    }

    static createNewInvite(opts: CreateGameModel ): Invite {
        const invite = new Invite(opts);
        InvitesManager.invites.set(invite.id, invite);
        return invite;
    }

    static getInvite(inviteId: string): Invite {
        const invite = InvitesManager.invites.get(inviteId);
        if (invite === undefined) throw Error('No invite found for id = "' + inviteId + '"');
        return invite;
    }

    static publishInvite(inviteId: string) {
        const invite = this.getInvite(inviteId);
        invite.isPublic = true;
        if ( ! this.publicInviteIds.includes(invite.id)) {
            this.publicInviteIds.push(invite.id);
        }
    }

    static getPublicInvites() {
        return this.publicInviteIds.map(inviteId => this.getInvite(inviteId));
    }

    static removeInvite(inviteId: string) {
        this.invites.delete(inviteId);
        this.publicInviteIds = this.publicInviteIds.filter(i => i !== inviteId);
    }
}