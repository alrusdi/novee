import { defineComponent } from 'vue';
import { makeFetchOptions } from '../Utils';
import { Seat } from './Seat';
import { SeatConfirmation } from './SeatConfirmation';
import { Button } from './Button';
import { NiceFrame } from './NiceFrame';
import { InvitationState } from '../../server/game/Const';

export const MakeInvite = defineComponent({
    data() {
        return {
            isAdmin: false,
            isLoading: true,
            isSeatsDisabled: true,
            isRefreshing: false,
            isSetStateEnabled: false,
            inviteId: "",
            seats: [],
            state: InvitationState.INVITATION,
            confirmationsCount: 0,
            yourSeatId: ''
        } as any;
    },
    mounted() {
        if (this.isInvitationPage()) {
            this.refreshInvite(this.getInviteIdFromUrl());
        } else {
            fetch('/api/invites/create')
                .then((response) => response.json())
                .then((res) => this.onInviteReady(res))
                .catch((_) => alert('Cant create invite'));
        }
    },
    components: {
        Seat,
        SeatConfirmation,
        Button,
        NiceFrame
    },
    methods: {
        refreshInvite(inviteId: string) {
            this.isRefreshing = true;
            fetch('/api/invites/get/' + inviteId)
                .then((response) => response.json())
                .then((res) => this.onInviteReady(res))
                .catch((_) => console.error('Cant refresh invite'));
            setTimeout(() => this.isRefreshing = false, 1500)
        },
        getInviteIdFromUrl() {
            const urlParts = window.location.href.toString().split('/');
            return urlParts[urlParts.length - 1];
        },
        isInvitationPage(): boolean {
            return window.location.href.toString().includes("/invite/");
        },
        updateUrl() {
            if (this.isInvitationPage()) return;
            window.history.replaceState('', 'Invitation to play Novee', '/invite/' + this.inviteId);
        },
        youAreClaimedTheSeat() {
            for (const seat of this.seats) {
                if (seat.claimedBy === 'You') return true;
            }
            return false;
        },
        onInviteReady(inviteInfo: any) {
            this.inviteId = inviteInfo.data.inviteId;
            this.seats = inviteInfo.data.seats;
            this.isLoading = false;
            this.isSeatsDisabled = this.youAreClaimedTheSeat();
            this.isAdmin = inviteInfo.data.isAdmin;
            this.state = inviteInfo.data.state;
            this.yourSeatId = inviteInfo.data.yourSeatId;
            this.isSetStateEnabled = true;
            if (this.state === InvitationState.COMPLETE) {
                window.location.href = '/game/' + this.yourSeatId;
                return;
            }
            this.updateUrl();
            setTimeout(() => this.refreshInvite(this.inviteId), 3000)
        },
        takeSeat(seat: any) {
            const data = {
                inviteId: this.inviteId,
                seatId: seat.id,
                color: seat.color
            }
            const opts = makeFetchOptions(data);
            this.isSeatsDisabled = true;
            fetch('/api/invites/take-seat', opts)
                .then((response) => response.json())
                .then((res) => this.onInviteReady(res))
                .catch((_) => alert('Cant claim this seat'));
        },
        canStartGame() {
            if ( ! this.isAdmin) return false;
            if ( ! this.isSetStateEnabled) return false;
            if (this.state !== InvitationState.INVITATION) return false;
            const takenSeats = this.seats.filter((s: any) => s.claimedBy);
            return takenSeats.length > 1;
        },
        getSeats() {
            console.log(this.state);
            if (this.state === InvitationState.INVITATION) return this.seats;
            if (this.state === InvitationState.CONFIRMATION) return this.seats.filter((s: any) => s.claimedBy !== '');
        },
        setConfirmationState() {
            const urlParts = ['/api/invites/set-state', this.inviteId, InvitationState.CONFIRMATION];
            const url = urlParts.join('/')
            this.isSetStateEnabled = false;
            fetch(url)
                .then((response) => response.json())
                .then((res) => this.onInviteReady(res))
                .catch((_) => alert('Can\'t change invitation state'));
        },
        confirmSeat(seat: any) {
            const urlParts = ['/api/invites/confirm-seat', this.inviteId, seat.id];
            const url = urlParts.join('/')
            fetch(url)
                .then((response) => response.json())
                .then((res) => this.onInviteReady(res))
                .catch((_) => alert('Can\'t confirm your seat'));
        }
    },
    template: `
    <div class="make-invite">
        <NiceFrame title="Invite">
        <div class="make-invite-content">
            <template v-if="isLoading">
                <div class="loading">Loading...</div>
            </template>
            <template v-else>
                <div class="seats" v-if="state === 'invitation'">
                    <template v-for="seat in getSeats()" :key="seat.id">
                        <Seat @onClaimSeat="takeSeat" :seat="seat" :disabled="isSeatsDisabled" />
                    </template>
                </div>
                <div class="seats" v-if="state === 'confirmation'">
                    <template v-for="seat in getSeats()" :key="seat.id">
                        <SeatConfirmation @onConfirmSeat="confirmSeat" :seat="seat" :disabled="seat.id !== yourSeatId" />
                    </template>
                </div>
                <div class="invite-refreshing" v-if="false">
                    <div class="lds-dual-ring"></div>
                    <label class="invite-refreshing-caption">Refreshing invitation...</label>
                </div>
                <div class="invite-start-game" v-if="canStartGame()">
                    <Button :onClick="setConfirmationState">Start game!</Button>
                </div>
            </template>
        </div>
        </NiceFrame>
    </div>
    `
});
