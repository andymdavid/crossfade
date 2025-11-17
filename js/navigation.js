export function initNavigation() {
  const header = document.querySelector('.header');
  const nav = document.querySelector('.header__nav');
  const toggle = document.querySelector('.header__toggle');
  if (!header || !nav || !toggle) return;

  const stickyClass = 'header--sticky';
  const onScroll = () => {
    if (window.scrollY > 10) {
      header.classList.add(stickyClass);
    } else {
      header.classList.remove(stickyClass);
    }
  };

  window.addEventListener('scroll', onScroll);
  onScroll();

  const openClass = 'header__nav--open';
  let focusable = [];
  const closeMenu = () => {
    nav.classList.remove(openClass);
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleMenu = () => {
    const isOpen = nav.classList.toggle(openClass);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      focusable = Array.from(
        nav.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      );
      focusable[0]?.focus();
    }
  };

  toggle.addEventListener('click', toggleMenu);

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!nav.classList.contains(openClass)) return;
    if (event.key !== 'Tab') return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      last.focus();
      event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === last) {
      first.focus();
      event.preventDefault();
    }
  });
}
