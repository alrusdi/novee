import { defineComponent } from 'vue';
import { Button } from './Button';

export const Seat = defineComponent({
    props: ['seat', 'disabled'],
    methods: {
        claimSeat() {
            if (this.seat.claimedBy) return;
            this.$emit('onClaimSeat', this.seat)
        }
    },
    components: {
        Button
    },
    template: `
      <div class="seat-container">
        <div class="seat-color" :class="'seat-color--'+seat.color"></div>
        <div class="seat-frame"></div>
        <div class="seat-claimed-by" v-if="seat.claimedBy">
            {{ seat.claimedBy }}
        </div>
        <div class="seat-checkmark" v-if="seat.claimedBy"></div>
        <div class="seat-claim-button">
            <Button v-if="seat.claimedBy || disabled" :isDisabled="true">Wait others...</Button>
            <Button v-else color="green" :onClick="claimSeat">Claim seat!</Button>
        </div>
      </div>
    `
});
