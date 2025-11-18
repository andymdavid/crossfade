export function initAnimations() {
  const heroStack = document.querySelector('.hero-stack');
  const hero = document.querySelector('.hero');
  const mission = document.querySelector('.mission');
  const zoomEls = document.querySelectorAll('.text-zoom');
  const faqItems = document.querySelectorAll('.faq__item');
  const portfolioGrid = document.querySelector('.portfolio__grid');
  const statsOverlay = document.querySelector('.stats--overlay');
  const floatingNav = document.querySelector('.floating-nav');

  // Ensure nav starts hidden
  if (floatingNav) {
    floatingNav.classList.remove('is-visible');
    console.log('Floating nav initialized as hidden');
  }

  if (heroStack && hero) {
    let stackTop = heroStack.offsetTop;
    let heroHeight = hero.offsetHeight || window.innerHeight || 1;
    let stackHeight = window.innerHeight * 3; // 300vh explicitly (CSS defines .hero-stack as 300vh)

    // Debug logging
    console.log('stackTop:', stackTop);
    console.log('heroHeight:', heroHeight);
    console.log('stackHeight (calculated):', stackHeight);
    console.log('heroStack.offsetHeight:', heroStack.offsetHeight);
    console.log('Transition will happen at:', stackTop + (heroHeight * 2.15), 'px (215vh)');
    console.log('Mission appears at:', stackTop + stackHeight - window.innerHeight, 'px');

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
    let hasTransitioned = false;

    const update = () => {
      const scrollY = window.scrollY;
      const progress = clamp((scrollY - stackTop) / heroHeight, 0, 1);

      // Keep viewport-locked until 215vh, then transition to scrolling
      const transitionPoint = stackTop + (heroHeight * 2.15); // 215vh

      // During crossfade and until 215vh: Keep sections viewport-locked
      if (scrollY < transitionPoint) {
        hero.style.position = 'fixed';
        hero.style.top = '0';
        const heroOpacity = 1 - progress;
        hero.style.opacity = heroOpacity.toFixed(3);
        hero.style.transform = `scale(${(1 - 0.05 * progress).toFixed(3)})`;

        if (statsOverlay) {
          statsOverlay.style.position = 'fixed';
          statsOverlay.style.top = '0';
          const statsOpacity = clamp(progress, 0, 1);
          statsOverlay.style.opacity = statsOpacity.toFixed(3);
        }
        hasTransitioned = false;
      } else if (!hasTransitioned) {
        // Transition ONCE: Change to absolute at current position, then let them scroll naturally
        console.log('TRANSITIONING to absolute at scrollY:', scrollY, 'transitionPoint:', transitionPoint);
        const topPosition = (scrollY - stackTop) + 'px';

        hero.style.position = 'absolute';
        hero.style.top = topPosition;
        hero.style.opacity = '0';
        hero.style.transform = 'scale(0.95)';

        if (statsOverlay) {
          statsOverlay.style.position = 'absolute';
          statsOverlay.style.top = topPosition;
          statsOverlay.style.opacity = '1';
        }

        hasTransitioned = true;
        console.log('Positioned at top:', topPosition);
      }
      // After transition: Do nothing - let them scroll naturally

      if (mission && scrollY >= stackTop + stackHeight - window.innerHeight) {
        mission.classList.add('is-revealed');
      }

      // Show floating nav after 300vh crossfade section
      if (floatingNav) {
        const showThreshold = stackTop + stackHeight - window.innerHeight;
        if (scrollY >= showThreshold) {
          floatingNav.classList.add('is-visible');
          console.log('Nav shown at scrollY:', scrollY, 'threshold:', showThreshold);
        } else {
          floatingNav.classList.remove('is-visible');
        }
      }
    };

    window.addEventListener('scroll', update);
    window.addEventListener('resize', () => {
      stackTop = heroStack.offsetTop;
      heroHeight = hero.offsetHeight || window.innerHeight || 1;
      stackHeight = window.innerHeight * 3; // 300vh explicitly
      hasTransitioned = false; // Allow re-calculation on resize
      update();
    });

    update();
  }

  if (zoomEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    zoomEls.forEach((el) => observer.observe(el));
  }

  if (faqItems.length) {
    faqItems.forEach((item) => {
      const button = item.querySelector('.faq__button');
      const content = item.querySelector('.faq__content');
      if (!button || !content) return;

      const toggleItem = () => {
        const isOpen = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0px';
        }
      };

      button.addEventListener('click', toggleItem);
      button.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem();
        }
      });
    });
  }

  if (portfolioGrid) {
    // Duplicate children for seamless loop
    portfolioGrid.innerHTML += portfolioGrid.innerHTML;
    portfolioGrid.classList.add('portfolio__grid--auto');
  }
}
