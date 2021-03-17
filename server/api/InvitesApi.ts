import { AccountManager } from '../account/AccountManager';
import { InvitationState } from '../game/Const';
import { Game } from '../game/Game';
import { GameManager } from '../game/GamesManager';
import { Seat } from '../game/Invite';
import { InvitesManager } from '../game/InvitesManager';
import { PlayerColor } from '../game/PlayerColor';
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
                isAdmin: this.accountId === invite.accountId,
                state: invite.state,
                yourSeatId: invite.getSeatIdByAccount(this.accountId)
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
                seats: invite.getSeats(),
                isAdmin: true,
                state: invite.state,
                yourSeatId: invite.getSeatIdByAccount(this.accountId)
            }
        }
    }

    takeSeat(seatInfo: TakeSeat): ApiResponse {
        const invite = InvitesManager.getInvite(seatInfo.inviteId);

        const seat = invite.takeSeat(seatInfo.seatId, this.accountId, seatInfo.color);

        if (seat === undefined) {
            return this.error('Can\'t take this seat');
        }

        return {
            status: 'Ok',
            message: 'Seat taken successfully',
            data: {
                inviteId: invite.id,
                seats: this.formatSeats(invite.getSeats()),
                isAdmin: this.accountId === invite.accountId,
                state: invite.state,
                yourSeatId: invite.getSeatIdByAccount(this.accountId)
            }
        }
    }

    setState(inviteId: string, state: InvitationState) {
        const invite = InvitesManager.getInvite(inviteId);

        if ( ! invite.isAdmin(this.accountId)) {
            return this.error('You are not admin of this invitation');
        }

        invite.setState(state);

        return this.success(
            'Invite state changed successfully',
            {
                inviteId: invite.id,
                seats: this.formatSeats(invite.getSeats()),
                isAdmin: this.accountId === invite.accountId,
                state: invite.state,
                yourSeatId: invite.getSeatIdByAccount(this.accountId)
            }
        )
    }

    confirmSeat(inviteId: string, seatId: string) {
        const invite = InvitesManager.getInvite(inviteId);

        const seat = invite.getSeats().find((s: Seat) => s.id === seatId);
        if (seat === undefined) return this.error('Seat is not found', {seatId})

        if (seat.accountId !== this.accountId) return this.error('It is not your seat!', {seatId})

        seat.isConfirmed = true;

        if (invite.isAllSeatsConfirmed()) {
            invite.state = InvitationState.COMPLETE;
            const game = Game.createGameFromInvite(invite);
            GameManager.setGame(game);
        }

        return this.success(
            'Seat is confirmed',
            {
                inviteId: invite.id,
                seats: this.formatSeats(invite.getSeats()),
                isAdmin: this.accountId === invite.accountId,
                state: invite.state,
                yourSeatId: invite.getSeatIdByAccount(this.accountId)
            }
        )
    }

    private formatSeats(seats: Array<Seat>) {
        const newSeats = [];
        for (const seat of seats) {
            newSeats.push({
                id: seat.id,
                color: seat.color,
                claimedBy: this.getClaimedBy(seat.accountId),
                isConfirmed: seat.isConfirmed
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
