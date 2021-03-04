import { defineComponent } from 'vue';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const MainMenu = defineComponent({
    mixins: [
      NavigationMixing
    ],
    'template': `
      <div class="main-menu">
        <ul class="menu-items">
            <li class="menu-item">
                <a href="#" v-on:click.prevent="goto('start-solo')">Solo</a>
            </li>
            <li class="menu-item">
                <a href="#" v-on:click.prevent="goto('make-invite')">Multiplayer</a>
            </li>
        </ul>
      </div>
    `
});
