import { useEffect, useRef } from 'react';
import { media } from './editorial';

export function Arrival({ reduced }: { reduced: boolean }) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLVideoElement>(null);
  const street = useRef<HTMLImageElement>(null);
  const opening = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const area = section.current!;
    const frame = stage.current!;
    const video = clip.current;
    const lastFrame = street.current!;
    const heading = opening.current!;
    const progress = bar.current!;
    let pending = 0;

    function render() {
      pending = 0;
      const span = Math.max(1, area.offsetHeight - frame.offsetHeight);
      const position = Math.max(0, Math.min(1, -area.getBoundingClientRect().top / span));
      const ready = Boolean(video && video.readyState >= 2 && !video.error);
      progress.style.transform = `scaleX(${position})`;
      heading.style.opacity = reduced ? '1' : String(Math.max(0, 1 - position * 1.5));
      heading.style.transform = reduced ? '' : `translateY(${-position * 34}px)`;
      lastFrame.style.opacity = reduced || position >= .995 || (!ready && position > .55) ? '1' : '0';
      if (video) {
        video.hidden = !ready;
        if (ready && !video.seeking && Number.isFinite(video.duration)) {
          const time = position * Math.max(0, video.duration - .045);
          if (Math.abs(video.currentTime - time) > .025) video.currentTime = time;
        }
      }
    }

    function schedule() {
      if (!pending) pending = requestAnimationFrame(render);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const events = ['loadeddata', 'seeked', 'error'] as const;
    events.forEach(event => video?.addEventListener(event, schedule));
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      events.forEach(event => video?.removeEventListener(event, schedule));
      cancelAnimationFrame(pending);
    };
  }, [reduced]);

  return (
    <section className="arrival" id="woodcrest" aria-labelledby="site-title" ref={section}>
      <div className="arrival-stage" ref={stage}>
        <img className="arrival-media" src={media('overlook.webp')} alt="An autumn hillside overlooking the houses of Woodcrest" fetchPriority="high" />
        {!reduced && <video className="arrival-media" ref={clip} src={media('arrival.mp4')} muted playsInline preload="auto" hidden aria-hidden />}
        <img className="arrival-media arrival-end" ref={street} src={media('street.webp')} alt="" aria-hidden />
        <div className="opening" ref={opening}>
          <p className="kicker">An unofficial Boondocks editorial</p>
          <h1 id="site-title"><small>Welcome to</small>Woodcrest.</h1>
          <p className="lede">Quiet streets. Three Freemans. Three ways to see the same neighbourhood.</p>
        </div>
        <div className="arrival-controls">
          <span className="scroll-label">Scroll to arrive</span>
          <span className="progress" aria-hidden><i ref={bar} /></span>
          <a href="#freemans">Meet the Freemans</a>
        </div>
      </div>
    </section>
  );
}
