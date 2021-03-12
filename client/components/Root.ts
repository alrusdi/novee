import { defineComponent } from 'vue';
import { MainMenu } from './MainMenu';
import { MakeInvite } from './MakeInvite';
import { StartSolo } from './StartSolo';
import { Game } from './Game';
import { NavigationMixing } from '../mixins/NavigationMixin';

export const Root = defineComponent({
  data() {
    return {
      screen: 'main-menu'
    }
  },
  components: {
    MainMenu,
    MakeInvite,
    StartSolo,
    Game
  },
  mixins: [
    NavigationMixing
  ],
  mounted() {
    const url = window.location.href;
    if (url.includes('/invite/')) {
        this.goto('make-invite');
    }
    if (url.includes('/game/')) {
        this.goto('game');
    }
  },
  'template': `
    <div :class="'container ' + 'topmost-'+screen">
      <div class="top-navigation" v-if="screen!=='main-menu'">
        <ul class="navigation-items">
          <li class="navigation-item">
            <a href="/">Main menu</a>
          </li>
          <li class="navigation-item navigation-item--logout">
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </div>
      <template v-if="screen==='main-menu'">
        <MainMenu />
      </template>
      <template v-if="screen==='make-invite'">
        <MakeInvite />
      </template>
      <template v-if="screen==='start-solo'">
        <StartSolo />
      </template>
      <template v-if="screen==='game'">
        <Game />
      </template>
    </div>
  `
});
