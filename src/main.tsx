import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Arrival } from './Arrival';
import { Family } from './Family';
import { episodes, media, neighbors } from './editorial';
import './styles.css';

const chapters = [
  ['woodcrest', 'Arrival'], ['freemans', 'Freemans'], ['neighbors', 'The Block'], ['episodes', 'Episodes'],
] as const;
const motionPreference = '(prefers-reduced-motion: reduce)';

function Navigation() {
  const [chapter, setChapter] = useState<string>('woodcrest');
  const [sound, setSound] = useState<'off' | 'on' | 'unavailable'>('off');
  const player = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let pending = 0;
    const sections = chapters.map(([id]) => document.getElementById(id));
    function update() {
      pending = 0;
      const active = sections.findLastIndex(section => section && section.getBoundingClientRect().top <= 110);
      setChapter(chapters[Math.max(0, active)][0]);
    }
    function schedule() {
      if (!pending) pending = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(pending);
    };
  }, []);

  async function toggleSound() {
    const audio = player.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    audio.volume = .34;
    try { await audio.play(); }
    catch { setSound('unavailable'); }
  }

  return (
    <header className="site-header">
      <a className="brand" href="#woodcrest">WOODCREST</a>
      <nav className="header-actions" aria-label="Chapters">
        {chapters.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={chapter === id ? 'location' : undefined}>{label}</a>)}
        <button type="button" className="sound" aria-pressed={sound === 'on'} onClick={() => { void toggleSound(); }}>Sound {sound}</button>
      </nav>
      <audio ref={player} src={media('woodcrest-loop.mp3')} preload="none" loop
        onPlaying={() => setSound('on')} onPause={() => setSound('off')} onError={() => setSound('unavailable')} />
    </header>
  );
}

function AroundTheBlock() {
  const [selection, select] = useState(0);
  const neighbor = neighbors[selection];
  return (
    <section className="chapter" id="neighbors" aria-labelledby="neighbors-title">
      <div className="chapter-inner">
        <p className="section-kicker">Woodcrest residents</p><h2 id="neighbors-title">Around the block</h2>
        <div className="block-stage">
          <div key={neighbor.id} className="block-visual reveal" data-tone={neighbor.id} aria-hidden>
            <span>{neighbor.line}</span><strong>{neighbor.label}</strong>
          </div>
          <div className="block-copy">
            <div className="neighbor-choices" role="group" aria-label="Choose a neighbour">
              {neighbors.map((item, index) => <button key={item.id} type="button" aria-pressed={selection === index} onClick={() => select(index)}>{item.label}</button>)}
            </div>
            <article aria-live="polite" aria-atomic><h3>{neighbor.name}</h3><p>{neighbor.copy}</p></article>
          </div>
        </div>
      </div>
    </section>
  );
}

function EpisodeNotes() {
  return (
    <section className="chapter episodes" id="episodes" aria-labelledby="episodes-title">
      <div className="chapter-inner">
        <p className="section-kicker">Episode notes</p><h2 id="episodes-title">The Boondocks</h2>
        <div className="episode-notes">
          {episodes.map(episode => (
            <details key={episode.number}>
              <summary><span>Season 1 · Episode {episode.number}</span> {episode.title}</summary>
              <p>{episode.copy}</p><a href={episode.url}>Episode details</a>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  const [reduced, setReduced] = useState(() => matchMedia(motionPreference).matches);
  useEffect(() => {
    const preference = matchMedia(motionPreference);
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  return <>
    <Navigation />
    <main><Arrival reduced={reduced} /><Family reduced={reduced} /><AroundTheBlock /><EpisodeNotes /></main>
    <footer className="site-footer"><span>CyberByzance · Unofficial editorial about The Boondocks</span><a href="#woodcrest">Back to the overlook</a></footer>
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
