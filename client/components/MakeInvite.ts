import { defineComponent } from 'vue';
import { ALL_PLAYER_COLORS, PlayerColor } from '../../server/game/Player';
import { makeFetchOptions } from '../Utils';

export interface Seat {
    id: string;
    nickname: string;
    color: PlayerColor;
}

export const MakeInvite = defineComponent({
    data() {
        return {
            isAdmin: false,
            isLoading: true,
            isSeatsDisabled: false,
            isRefreshing: false,
            inviteId: "",
            seats: []
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
        onInviteReady(inviteInfo: any) {
            this.inviteId = inviteInfo.data.inviteId;
            this.seats = inviteInfo.data.seats;
            this.isLoading = false;
            this.isSeatsDisabled = false;
            this.isAdmin = inviteInfo.data.isAdmin;
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
            const takenSeats = this.seats.filter((s: any) => s.claimedBy);
            return takenSeats.length > 1;
        },
        getAllColors() {
            return ALL_PLAYER_COLORS;
        }
    },
    'template': `
    <div class="make-invite">
        <template v-if="isLoading">
            <div class="loading">Loading...</div>
        </template>
        <template v-else>
            <div class="seats">
                <div class="seat" v-for="seat in seats" :key="seat.id">
                    <template v-if="seat.claimedBy">
                        <div class="seat-claimed">
                            <div class="seat-claimed-caption">Claimed by:</div>
                            <b :class="'seat-claimer seat-color--'+seat.color">{{ seat.claimedBy }}</b>
                        </div>
                    </template>
                    <template v-else>
                        <div class="seat-colors">
                            <label class="seat-color" :class="'seat-color--'+color" v-for="color in getAllColors()">
                                <input type="radio" :name="'color-'+seat.id" :value="color" v-model="seat.color" :disabeled="isSeatsDisabled" />
                            </label>
                        </div>
                        <input type="button" value="Claim seat!" v-on:click.prevent="takeSeat(seat)" :disabeled="isSeatsDisabled"  />
                    </template>
                </div>
            </div>
            <div class="invite-refreshing" v-if="isRefreshing">
                <div class="lds-dual-ring"></div>
                <label class="invite-refreshing-caption">Refreshing invitation...</label>
            </div>
            <div class="invite-start-game" v-if="canStartGame()">
                You can <a class="invite-start-game-link" href="#" v-on:clik.prevent="startGame()">start game</a>
            </div>
        </template>
    </div>
    `
})