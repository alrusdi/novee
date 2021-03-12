import { defineComponent } from 'vue';
import { Button } from './Button';


export const MainMenu = defineComponent({
    components: {
      Button
    },
    'template': `
      <div class="main-menu">
        <label class="main-menu-title">Novee</label>
        <div class="menu-items">
          <Button page="start-solo">Solo</Button>
          <Button page="make-invite">Multiplayer</Button>
          <Button page="rules">Rules</Button>
          <Button link="/logout" color="red">Logout</Button>
        </div>
        <div class="menu-footer" title="Sources of the game on GitHub">
          <a href="https://github.com/alrusdi/novee"><img src="/assets/img/github.png"></a>
        </div>
      </div>
    `
});
