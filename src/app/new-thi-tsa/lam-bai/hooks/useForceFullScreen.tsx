import { useEffect, useState, Dispatch, SetStateAction } from 'react';

// code này em cũng tham khảo AI anh check giúp em nhé =))
function getIsFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const d: any = document;
  return !!(d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement);
}

export function useFullscreenState(
  defaultValue = false
): { isFullscreen: boolean; setIsFullscreen: Dispatch<SetStateAction<boolean>> } {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() =>
    typeof document !== 'undefined' ? getIsFullscreen() : defaultValue
  );

  useEffect(() => {
    if (typeof document === 'undefined') return; // Safe for SSR

    const onChange = () => setIsFullscreen(getIsFullscreen());

    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange as any);
    document.addEventListener('mozfullscreenchange', onChange as any);
    document.addEventListener('MSFullscreenChange', onChange as any);

    onChange();

    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange as any);
      document.removeEventListener('mozfullscreenchange', onChange as any);
      document.removeEventListener('MSFullscreenChange', onChange as any);
    };
  }, []);

  return { isFullscreen, setIsFullscreen };
}
