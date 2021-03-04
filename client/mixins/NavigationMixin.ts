export const NavigationMixing = {
    methods: {
      goto(screen: string) {
        (this as any).$root.screen = screen;
      }
    }
  }