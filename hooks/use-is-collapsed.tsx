import * as React from 'react';
import { useIsMobile } from './use-mobile';

const COLLAPSED_BREAKPOINT = 1100;

export function useIsCollapsed() {
  const [isCollapsed, setIsCollapsed] = React.useState<boolean | undefined>(undefined);
  const isMobile = useIsMobile(); // Reuse the existing hook

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${COLLAPSED_BREAKPOINT - 1}px)`);

    const onChange = () => {
      setIsCollapsed(!isMobile && window.innerWidth < COLLAPSED_BREAKPOINT);
    };

    mql.addEventListener('change', onChange);
    onChange(); // Run once on mount

    return () => mql.removeEventListener('change', onChange);
  }, [isMobile]);

  return !!isCollapsed;
}
