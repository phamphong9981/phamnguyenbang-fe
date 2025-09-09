import type { App } from './App';

export const mouseMoveEvents = ({ app }: { app: App }) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      app.state.mouseX = e.x;
      app.state.mouseY = e.y;
    });
  }
};
