import { defineComponent } from 'vue';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const MainMenu = defineComponent({
    mixins: [
      NavigationMixing
    ],
    'template': `
      <div class="main-menu">
        <label class="main-menu-title">Novee</label>
        <ul class="menu-items">
            <li class="menu-item">
                <a href="#" v-on:click.prevent="goto('start-solo')">Solo</a>
            </li>
            <li class="menu-item">
                <a href="#" v-on:click.prevent="goto('make-invite')">Multiplayer</a>
            </li>
            <li class="menu-item">
                <a href="#" v-on:click.prevent="goto('make-invite')">Rules</a>
            </li>
            <li class="menu-item menu-item--danger">
                <a href="/logout/">Logout</a>
            </li>
        </ul>
        <div class="menu-footer" title="Sources of the game on GitHub">
          <a href="https://github.com/alrusdi/novee"><img src="/assets/img/github.png"></a>
        </div>
      </div>
    `
});
