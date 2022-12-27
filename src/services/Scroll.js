import * as Scroll from 'react-scroll';

const scroll = Scroll.animateScroll;

export const scrollToTop = () => scroll.scrollToTop();

export const scrollHandler = () => scroll.scrollMore(350);
