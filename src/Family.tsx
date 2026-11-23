import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { freemans, media } from './editorial';

const wrap = (index: number) => (index + freemans.length) % freemans.length;
const slot = (portrait: number, selected: number) => wrap(portrait - selected + 1) - 1;

interface Gesture { id: number; x: number; y: number; captured: boolean }

export function Family({ reduced }: { reduced: boolean }) {
  const [selection, setSelection] = useState({ previous: 0, current: 0 });
  const gesture = useRef<Gesture | null>(null);
  const suppressPointerClick = useRef(0);
  const portraits = useRef<Array<HTMLButtonElement | null>>([]);
  const current = selection.current;
  const character = freemans[current];

  function choose(index: number) {
    setSelection(old => old.current === wrap(index) ? old : { previous: old.current, current: wrap(index) });
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    suppressPointerClick.current = 0;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, captured: false };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    const x = event.clientX - drag.x;
    const y = event.clientY - drag.y;
    if (!drag.captured && Math.abs(y) > 12 && Math.abs(y) > Math.abs(x)) {
      gesture.current = null;
      return;
    }
    if (!drag.captured && Math.abs(x) > 9) {
      drag.captured = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.classList.add('dragging');
    }
    if (drag.captured && !reduced) event.currentTarget.style.setProperty('--drag', `${Math.max(-180, Math.min(180, x))}px`);
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    if (!drag.captured) return;
    event.currentTarget.classList.remove('dragging');
    event.currentTarget.style.removeProperty('--drag');
    suppressPointerClick.current = performance.now() + 350;
    const distance = event.clientX - drag.x;
    if (event.type === 'pointerup' && Math.abs(distance) >= 42) choose(current + (distance < 0 ? 1 : -1));
  }

  function keyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = wrap(current + (event.key === 'ArrowLeft' ? -1 : 1));
    choose(next);
    if (event.target !== event.currentTarget) portraits.current[next]?.focus();
  }

  return (
    <section className="family" id="freemans" aria-labelledby="family-title">
      <div className="family-header">
        <h2 id="family-title">Meet the Freemans</h2>
        <p className="gallery-hint" id="gallery-help">Drag or swipe to explore</p>
      </div>
      <div className="gallery" role="group" tabIndex={0} aria-label="Freeman family portraits" aria-describedby="gallery-help"
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={finish} onPointerCancel={finish}
        onLostPointerCapture={finish} onPointerLeave={() => { if (!gesture.current?.captured) gesture.current = null; }} onKeyDown={keyDown}>
        {freemans.map((item, index) => {
          const offset = slot(index, current);
          const jumps = Math.abs(offset - slot(index, selection.previous)) > 1;
          return (
            <button key={item.name} ref={node => { portraits.current[index] = node; }}
              type="button" className={jumps ? 'portrait jump' : 'portrait'} style={{ '--slot': offset } as CSSProperties}
              aria-label={`Select ${item.name}`} aria-pressed={index === current}
              onClick={event => { if (!event.detail || performance.now() >= suppressPointerClick.current) choose(index); }}>
              <img src={media(item.image)} alt="" draggable={false} loading="lazy" />
              <strong>{item.label}</strong>
            </button>
          );
        })}
      </div>
      <div className="family-details">
        <article className="profile" aria-live="polite" aria-atomic>
          <h3>{character.name}</h3><p>{character.copy}</p>
        </article>
        <div className="controls" aria-label="Choose a Freeman">
          <button type="button" className="nav-button" onClick={() => choose(current - 1)}>Previous</button>
          <button type="button" className="nav-button" onClick={() => choose(current + 1)}>Next</button>
          <div className="character-buttons">
            {freemans.map((item, index) => <button key={item.name} type="button" aria-current={current === index || undefined} onClick={() => choose(index)}>{item.label}</button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
