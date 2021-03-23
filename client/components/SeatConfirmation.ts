import { defineComponent } from 'vue';
import { Button } from './Button';

export const SeatConfirmation = defineComponent({
    props: ['seat', 'disabled'],
    methods: {
        confirmSeat() {
            if (this.seat.isConfirmed) return;
            this.$emit('onConfirmSeat', this.seat)
        },
        getDisabledButtonText() {
            if (this.seat.isConfirmed) return 'Ready!';
            if (this.seat.isConfirmed && ! this.disabled) return 'Wait others';
            if (this.disabled) return 'Not confirmed';
            return '';
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
        <div class="seat-checkmark" v-if="seat.isConfirmed"></div>
        <div class="seat-pending" v-else"></div>
        <div class="seat-claim-button">
            <Button v-if="seat.isConfirmed || disabled" :isDisabled="true">
                {{ getDisabledButtonText() }}
            </Button>
            <Button v-else color="green" :onClick="confirmSeat">Ready!</Button>
        </div>
      </div>
    `
});
