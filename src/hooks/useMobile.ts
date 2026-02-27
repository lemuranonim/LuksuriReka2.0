import { useMedia } from 'react-use';

export function useMobile() {
    // Use a default state of false for SSR safety
    const isMobile = useMedia('(max-width: 767px)', false);
    return isMobile;
}

export function useTablet() {
    const isTablet = useMedia('(max-width: 1023px)', false);
    return isTablet;
}
