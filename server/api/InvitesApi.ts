import { AccountManager } from '../account/AccountManager';
import { Seat } from '../game/Invite';
import { InvitesManager } from '../game/InvitesManager';
import { PlayerColor } from '../game/Player';
import { BaseApi } from './BaseApi';
import { ApiResponse } from './Interfaces';

interface TakeSeat {
    inviteId: string;
    seatId: string;
    color: PlayerColor;
}


export class InvitesApi extends BaseApi {
    getInvite(inviteId: string): ApiResponse {
        const invite = InvitesManager.getInvite(inviteId);

        return {
            status: 'Ok',
            message: 'Invite loaded successfuly',
            data: {
                inviteId: invite.id,
                seats: this.formatSeats(invite.getSeats()),
                isAdmin: this.accountId === invite.accountId
            }
        }
    }

    createInvite(): ApiResponse {
        const invite = InvitesManager.createNewInvite({
            firstPlayerIndex: 0,
            maxPlayersCount: 4,
            adminId: this.accountId
        });
        invite.setAdmin(this.accountId);

        return {
            status: 'Ok',
            message: 'Invite created successfully',
            data: {
                inviteId: invite.id,
                isAdmin: true,
                seats: invite.getSeats()
            }
        }
    }

    takeSeat(seatInfo: TakeSeat): ApiResponse {
        console.log(seatInfo);
        const invite = InvitesManager.getInvite(seatInfo.inviteId);

        const seat = invite.takeSeat(seatInfo.seatId, this.accountId, seatInfo.color);

        if (seat === undefined) {
            return {
                status: 'Fail',
                message: "Can't take this seat"
            }
        }

        return {
            status: 'Ok',
            message: 'Seat taken successfully',
            data: {
                inviteId: invite.id,
                seats: this.formatSeats(invite.getSeats()),
                isAdmin: this.accountId === invite.accountId
            }
        }
    }

    private formatSeats(seats: Array<Seat>) {
        const newSeats = [];
        for (const seat of seats) {
            newSeats.push({
                id: seat.id,
                color: seat.color,
                claimedBy: this.getClaimedBy(seat.accountId)
            })
        }
        return newSeats;
    }


    private getClaimedBy(accountId: string | undefined): string {
        if (accountId === undefined) return "";
        const account = AccountManager.getById(accountId);
        if (account === undefined) return "";

        if (account.id === this.accountId) return "You";

        return account.nickname;
    }
}