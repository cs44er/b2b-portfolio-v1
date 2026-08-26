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
     PROBLEM/CASE-CARDS: STAGGERED REVEAL
     ============================================ */
  function staggerReveal(containerId, itemSelector) {
    const container = document.getElementById(containerId);
    const items = gsap.utils.toArray(itemSelector);
    if (!items.length) return;

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 40, scale: 0.96 });
    ScrollTrigger.create({
      trigger: container || items[0],
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    });
  }

  staggerReveal('casesGrid', '.case-card');

  /* ============================================
     TRACE-LINE (Section: Fundament)
     ============================================ */
  if (!reduceMotion) {
    gsap.to('#traceFill', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#fundament',
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 0.6
      }
    });
  } else {
    gsap.set('#traceFill', { scaleY: 1 });
  }

  /* ============================================
     ÜBRIGENS: KI-SCRAMBLE-DECODE-EFFEKT
     ============================================ */
  function scrambleReveal(el, finalText, duration = 1100) {
    const chars = '!<>-_\\/[]{}—=+*^?#01';
    const queue = [];
    for (let i = 0; i < finalText.length; i++) {
      const start = Math.random() * duration * 0.5;
      const end = start + duration * 0.3 + Math.random() * duration * 0.3;
      queue.push({ to: finalText[i], start, end, char: '' });
    }
    let startTime = null;
    function frame(time) {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      let out = '';
      let done = 0;
      for (let i = 0; i < queue.length; i++) {
        const q = queue[i];
        if (q.to === ' ') {
          out += ' ';
          if (elapsed >= q.end) done++;
          continue;
        }
        if (elapsed >= q.end) {
          done++;
          out += q.to;
        } else if (elapsed >= q.start) {
          if (!q.char || Math.random() < 0.3) {
            q.char = chars[Math.floor(Math.random() * chars.length)];
          }
          out += q.char;
        }
      }
      el.textContent = out;
      if (done < queue.length) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = finalText;
      }
    }
    requestAnimationFrame(frame);
  }

  const metaAside = document.getElementById('metaAside');
  const metaScrambleEl = document.getElementById('metaScramble');
  const metaSubtext = document.getElementById('metaSubtext');

  if (metaAside && metaScrambleEl && metaSubtext) {
    const finalText = metaScrambleEl.dataset.text || metaScrambleEl.textContent.trim();

    if (reduceMotion) {
      metaScrambleEl.textContent = finalText;
    } else {
      gsap.set(metaAside, { opacity: 0, y: 28 });
      gsap.set(metaSubtext, { opacity: 0, y: 12 });
      metaScrambleEl.textContent = '';

      ScrollTrigger.create({
        trigger: metaAside,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(metaAside, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            onComplete: () => {
              scrambleReveal(metaScrambleEl, finalText, 1100);
              gsap.to(metaSubtext, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: 0.9,
                ease: 'power2.out'
              });
            }
          });
        }
      });
    }
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