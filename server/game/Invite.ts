import { CreateGameModel } from '../api/models/CreateGameModel';
import { randomId } from '../Utils';
import { InvitationState } from './Const';
import { ALL_PLAYER_COLORS, PlayerColor } from './PlayerColor';

export class Seat {
    public id: string;
    public accountId: string | undefined;
    public color: PlayerColor | undefined;
    public isConfirmed: boolean = false;

    constructor() {
        this.id = randomId();
    }
}

export class Invite {
    public id: string;
    public isPublic: boolean = false;
    public accountId: string = '';
    public state: InvitationState = InvitationState.INVITATION;
    private seats: Array<Seat> = [];

    constructor(public options: CreateGameModel) {
        this.id = randomId();
        var seat: Seat;
        for (let i=0; i < options.maxPlayersCount; i++) {
            seat = new Seat();
            seat.color = this.getFreeColor(undefined, ALL_PLAYER_COLORS[i]);
            this.seats.push(seat)
        }
    }

    private isSeatAlreadyTaken(accountId: string): boolean {
        return this.seats.find(s => s.accountId === accountId) !== undefined;
    }

    private noSeatsAvailable(): boolean {
        const takenSeats = this.seats.filter(s => s.accountId !== undefined);
        return takenSeats.length === this.options.maxPlayersCount;
    }

    setAdmin(accountId: string) {
        this.accountId = accountId;
    }

    isAdmin(accountId: string): boolean {
        return this.accountId === accountId;
    }

    setState(state: InvitationState) {
        this.state = state;
    }

    getSeats() {
        return this.seats;
    }

    getSeatIdByAccount(accountId: string): string {
        const seat = this.getSeats().find((s: Seat) => s.accountId === accountId);
        if (seat === undefined) return '';
        return seat.id;
    }

    isAllSeatsConfirmed() {
        if (this.state !== InvitationState.CONFIRMATION) return false;
        const takenSeatsCount = this.getSeats().filter((s: Seat) => s.accountId !== '' && s.accountId !== undefined).length;
        const confirmedCount = this.getSeats().filter((s: Seat) => s.isConfirmed).length;
        return takenSeatsCount === confirmedCount;
    }

    getFreeColor(accountId: string | undefined, preferredColor: PlayerColor): PlayerColor {
        const takenSeats = this.seats.filter((s) => accountId !== undefined && s.accountId !== accountId)
        const takenColors = takenSeats.map(s => s.color);
        if ( ! takenColors.includes(preferredColor)) {
            return preferredColor;
        }
        const color = ALL_PLAYER_COLORS.find(c => takenColors.includes(c) === false)
        if (color === undefined) throw Error("Can't get free color");
        return color;
    }

    takeSeat(seatId: string, accountId: string, preferredColor: PlayerColor): Seat | undefined {
        if (this.state !== InvitationState.INVITATION) return undefined;

        if (this.isSeatAlreadyTaken(accountId)) return undefined;

        if (this.noSeatsAvailable()) return undefined;

        const seat = this.seats.find(s => s.id === seatId);
        if (seat === undefined) return undefined;

        seat.accountId = accountId;
        seat.color = this.getFreeColor(accountId, preferredColor);

        return seat;
    }
}
