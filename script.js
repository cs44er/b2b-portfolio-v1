document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  /* ============================================
     SCROLL PROGRESS BAR
     ============================================ */
  gsap.to('#progressFill', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });

  /* ============================================
     HERO SPOTLIGHT (folgt dem Cursor)
     ============================================ */
  const hero = document.getElementById('hero');
  if (hero && !reduceMotion) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', mx + '%');
      hero.style.setProperty('--my', my + '%');
    });
    hero.addEventListener('mouseleave', () => {
      hero.style.setProperty('--mx', '50%');
      hero.style.setProperty('--my', '25%');
    });
  }

  /* ============================================
     MAGNETISCHE BUTTONS
     ============================================ */
  if (!reduceMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: relX * 0.25,
          y: relY * 0.35,
          duration: 0.4,
          ease: 'power3.out'
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ============================================
     GENERISCHE REVEAL-ANIMATIONEN
     ============================================ */
  const revealEls = gsap.utils.toArray('.reveal-el');

  if (reduceMotion) {
    gsap.set(revealEls, { opacity: 1, y: 0 });
  } else {
    revealEls.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 28 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          });
        }
      });
    });
  }

  /* ============================================
     TRACE-LINE (Section: Lösung)
     ============================================ */
  if (!reduceMotion) {
    gsap.to('#traceFill', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#loesung',
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.6
      }
    });
  } else {
    gsap.set('#traceFill', { scaleY: 1 });
  }

  /* ============================================
     WORKFLOW-DIAGRAMM (Signature-Element)
     ============================================ */
  const dots = {
    off: '#23262E',
    on: '#4CFFA0'
  };

  function buildDiagramTimeline(scrollTriggerConfig) {
    const tl = gsap.timeline({ scrollTrigger: scrollTriggerConfig });
    const durationCounter = { val: 0 };
    const manualCounter = { val: 15 };

    tl.to('#dot1', { backgroundColor: dots.on, boxShadow: '0 0 16px 4px rgba(76,255,160,0.45)', duration: 0.3 })
      .to('#node1 .node-glow', { opacity: 1, duration: 0.3 }, '<')
      .to('#conn1', { scaleX: 1, duration: 0.4, ease: 'none' })
      .to('#dot2', { backgroundColor: dots.on, boxShadow: '0 0 16px 4px rgba(76,255,160,0.45)', duration: 0.3 })
      .to('#node2 .node-glow', { opacity: 1, duration: 0.3 }, '<')
      .to('#conn2', { scaleX: 1, duration: 0.4, ease: 'none' })
      .to('#dot3', { backgroundColor: dots.on, boxShadow: '0 0 16px 4px rgba(76,255,160,0.45)', duration: 0.3 })
      .to('#node3 .node-glow', { opacity: 1, duration: 0.3 }, '<')
      .to(durationCounter, {
        val: 5,
        duration: 0.6,
        onUpdate: () => {
          document.getElementById('statDuration').textContent = Math.round(durationCounter.val) + ' Sek.';
        }
      }, '<')
      .to(manualCounter, {
        val: 0,
        duration: 0.6,
        onUpdate: () => {
          document.getElementById('statManual').textContent = Math.round(manualCounter.val) + ' Min.';
        }
      }, '<');

    return tl;
  }

  if (reduceMotion) {
    gsap.set(['#dot1', '#dot2', '#dot3'], { backgroundColor: dots.on });
    gsap.set(['#node1 .node-glow', '#node2 .node-glow', '#node3 .node-glow'], { opacity: 1 });
    gsap.set(['#conn1', '#conn2'], { scaleX: 1 });
    document.getElementById('statDuration').textContent = '5 Sek.';
    document.getElementById('statManual').textContent = '0 Min.';
  } else {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      buildDiagramTimeline({
        trigger: '#diagramWrap',
        start: 'top top+=90',
        end: '+=120%',
        scrub: 0.8,
        pin: true,
        anticipatePin: 1
      });
    });

    mm.add('(max-width: 767px)', () => {
      buildDiagramTimeline({
        trigger: '#diagramWrap',
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.8
      });
    });
  }

});