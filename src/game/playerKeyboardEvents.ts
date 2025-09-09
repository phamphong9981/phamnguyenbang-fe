import type { App } from './App';

export const playerKeyboardEvents = ({ player }: { player: App['player'] }) => {
  if (typeof window === 'undefined') return;

  let timeoutCancel: NodeJS.Timeout | null = null;
  let intervalIncrease: NodeJS.Timeout | null = null;
  let intervalDecrease: NodeJS.Timeout | null = null;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (timeoutCancel) clearTimeout(timeoutCancel);
      if (intervalIncrease) clearTimeout(intervalIncrease);
      player.increaseThrust();
      timeoutCancel = setTimeout(player.cancelThrust, 1000);
      intervalIncrease = setInterval(player.increaseThrust, 100);
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      if (intervalDecrease) clearTimeout(intervalDecrease);
      if (intervalIncrease) clearTimeout(intervalIncrease);
      intervalDecrease = setTimeout(player.decreaseThrust, 200);
    }
  });
};
