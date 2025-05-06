(() => {
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const getPos = el => ({ left: parseFloat(el.style.left), top: parseFloat(el.style.top) });
    const setPos = (el, p) => {
      el.style.left = `${p.left}px`;
      el.style.top  = `${p.top}px`;
    };
    const clamp = (v, min) => (v < min ? min : v);
    const now = () => performance.now();

    let drag = null;
    let sticky = null;
    let pinch = null;
    let lastTap = {time:0,x:0,y:0};
 
    function beginDrag(el, clientX, clientY) {
      if (sticky) endSticky();
      drag = {
        el,
        offsetX: clientX - el.offsetLeft,
        offsetY: clientY - el.offsetTop,
        start: getPos(el)
      };
      el.style.cursor = 'grabbing';
    }
  
    function moveDrag(clientX, clientY) {
      if (!drag) return;
      setPos(drag.el, {
        left: clientX - drag.offsetX,
        top : clientY - drag.offsetY
      });
    }
  
    function endDrag() {
      if (!drag) return;
      drag.el.style.cursor = 'grab';
      drag = null;
    }
  
    function beginSticky(el, clientX, clientY) {
      if (sticky) endSticky();
      sticky = {
        el,
        offsetX: clientX - el.offsetLeft,
        offsetY: clientY - el.offsetTop,
        start: getPos(el)
      };
      el.dataset.origBg = el.style.backgroundColor;
      el.style.backgroundColor = 'orange';
    }
  
    function moveSticky(clientX, clientY) {
      if (!sticky) return;
      setPos(sticky.el, {
        left: clientX - sticky.offsetX,
        top : clientY - sticky.offsetY
      });
    }
  
    function endSticky() {
      if (!sticky) return;
      sticky.el.style.backgroundColor = sticky.el.dataset.origBg || 'red';
      sticky = null;
    }
  
    function abortAction() {
      if (drag) {
        setPos(drag.el, drag.start);
        endDrag();
      }
      if (sticky) {
        setPos(sticky.el, sticky.start);
        endSticky();
      }
    }

    $$('.target').forEach(el => {
      el.style.cursor = 'grab';
  
      el.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        beginDrag(el, e.clientX, e.clientY);
      });
  
      el.addEventListener('dblclick', e => {
        e.preventDefault();
        beginSticky(el, e.clientX, e.clientY);
      });
    });
  
    document.addEventListener('mousemove', e => {
      if (drag) {
        moveDrag(e.clientX, e.clientY);
      } else if (sticky) {
        moveSticky(e.clientX, e.clientY);
      }
    });
  
    document.addEventListener('mouseup', e => {
      if (e.button !== 0) return;
      endDrag();
    });
  
    document.addEventListener('click', () => {
      if (sticky) endSticky();
    });
  
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') abortAction();
    });

    $$('.target').forEach(el => {
      el.addEventListener('touchstart', e => {
        if (e.touches.length > 1) return;
        e.preventDefault();
        const t = e.touches[0];

        const dt = now() - lastTap.time;
        const dx = t.clientX - lastTap.x;
        const dy = t.clientY - lastTap.y;
        const doubleTap = dt < 300 && Math.hypot(dx, dy) < 25;
  
        if (doubleTap) {
          beginSticky(el, t.clientX, t.clientY);
        } else {
          beginDrag(el, t.clientX, t.clientY);
        }
        lastTap = {time: now(), x: t.clientX, y: t.clientY};
      }, {passive:false});
    });
  
    document.addEventListener('touchmove', e => {
      if (drag && e.touches.length === 1) {
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
      } else if (sticky && e.touches.length === 1) {
        const t = e.touches[0];
        moveSticky(t.clientX, t.clientY);
      }

      if ((drag || !sticky) && e.touches.length === 2) {
        const el = drag ? drag.el : e.target.closest('.target');
        if (!el) return;
        if (!pinch) {
          const d = dist2(e.touches);
          pinch = { el, startDist: d, startW: el.offsetWidth, startH: el.offsetHeight };
        } else {
          const d = dist2(e.touches);
          const ratio = d / pinch.startDist;
          const newW = clamp(pinch.startW * ratio, 30);
          const newH = clamp(pinch.startH * ratio, 30);
          el.style.width  = `${newW}px`;
          el.style.height = `${newH}px`;
        }
      }
    }, {passive:false});
  
    document.addEventListener('touchend', e => {
      if (drag && e.touches.length > 0) return;
      if (drag && e.touches.length === 0) endDrag();
  
      if (pinch && e.touches.length < 2) pinch = null;

      if (sticky && !pinch && !drag && e.touches.length === 0) {
        const t = e.changedTouches[0];
        if (Math.hypot(t.clientX - lastTap.x, t.clientY - lastTap.y) < 15 &&
            now() - lastTap.time < 250) {
          endSticky();
        }
      }
    });
  
    document.addEventListener('touchstart', e => {
      if (drag && e.touches.length === 2) {
        abortAction();
      }
    }, {passive:false});

    function dist2(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy);
    }
  })();
  