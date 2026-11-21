import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Home from './pages/Home';
import Track from './pages/Track';
import { LegalPage } from './pages/Legal';
import { config, mailtoUrl, whatsappUrl } from './config';
import { Icon, WhatsAppIcon } from './components/Icon';

export function Wordmark({ light = false, tagline = false }: { light?: boolean; tagline?: boolean }) {
  return (
    <Link to="/" className={`wordmark${light ? ' light' : ''}`} aria-label="BUSBOX home">
      <img src="/favicon.svg" alt="" width={30} height={30} />
      <span className="wordmark-text">
        <span className="wordmark-name">
          <span className="bus">BUS</span>
          <span className="box">BOX</span>
        </span>
        {tagline && <span className="wordmark-tag">Closer than you think</span>}
      </span>
    </Link>
  );
}

export function StoreBadges() {
  return (
    <div className="store-badges">
      <a className="store" href={config.playStoreUrl} target="_blank" rel="noreferrer">
        <span style={{ fontSize: 22 }}>▶</span>
        <span>
          <small>GET IT ON</small>
          <b>Google Play</b>
        </span>
      </a>
      <a className="store" href={config.appStoreUrl} target="_blank" rel="noreferrer">
        <span style={{ fontSize: 22 }}></span>
        <span>
          <small>Download on the</small>
          <b>App Store</b>
        </span>
      </a>
    </div>
  );
}

const navLinks = [
  ['The idea', '/#idea'],
  ['How it works', '/#how-it-works'],
  ['Safety', '/#safety'],
  ['FAQ', '/#faq'],
  ['Contact', '/#contact'],
] as const;

export default function App() {
  const { pathname, hash, key } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);

  // New page: go to the top, or to the section named in the URL (e.g. /#contact from the Terms page).
  // `key` changes on every click, so clicking the same link twice still scrolls.
  useEffect(() => {
    setMenuOpen(false);
    if (hash) {
      const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 0);
      return () => window.clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  // Header shadow and the reading-progress bar.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, [pathname]);

  // Underline the nav link for the section on screen.
  useEffect(() => {
    setActive('');
    if (pathname !== '/' || !('IntersectionObserver' in window)) return;
    const els = navLinks.map(([, to]) => document.getElementById(to.split('#')[1])).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' open' : ''}`}>
        <div className="nav-progress" ref={progressRef} aria-hidden="true" />
        <div className="container">
          <Wordmark tagline />
          <div className="spacer" />
          <nav className="nav-links" aria-label="Main">
            {navLinks.map(([label, to]) => (
              <Link key={to} className={`link${active === to.split('#')[1] ? ' active' : ''}`} to={to}>{label}</Link>
            ))}
          </nav>
          <Link className="btn btn-primary nav-cta" to="/#get-started">Get Started</Link>
          <button className="nav-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}>
            <Icon name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
        <nav className="nav-mobile" aria-label="Mobile">
          {navLinks.map(([label, to]) => <Link key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</Link>)}
          <Link className="btn btn-primary" to="/#get-started" onClick={() => setMenuOpen(false)}>Get Started</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/t/:token" element={<Track />} />
          <Route path="/terms" element={<LegalPage doc="terms" />} />
          <Route path="/privacy" element={<LegalPage doc="privacy" />} />
          <Route path="/refund-policy" element={<LegalPage doc="refunds" />} />
          <Route path="/prohibited-items" element={<LegalPage doc="prohibited" />} />
          <Route path="*" element={<div className="container section"><h2>Page not found</h2><p className="muted"><Link to="/">Go home</Link></p></div>} />
        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="foot-grid">
            <div className="foot-brand">
              <Wordmark light />
              <p>
                BUSBOX connects people who need to send parcels with travellers and transport operators already heading their way.
                Verified, tracked and closer than you think.
              </p>
            </div>
            <div>
              <h4>Company</h4>
              <Link to="/#about">About Us</Link>
              <Link to="/#how-it-works">How It Works</Link>
              <Link to="/#safety">Safety</Link>
              <Link to="/#faq">FAQ</Link>
              <Link to="/#contact">Contact</Link>
            </div>
            <div>
              <h4>Legal</h4>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms &amp; Conditions</Link>
              <Link to="/refund-policy">Refunds &amp; Cancellations</Link>
              <Link to="/prohibited-items">Prohibited Items</Link>
            </div>
            <div>
              <h4>Get in touch</h4>
              <a href={mailtoUrl()} className="foot-contact"><Icon name="mail" size={16} /> {config.supportEmail}</a>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="foot-contact">
                <WhatsAppIcon size={16} /> Message us on WhatsApp
              </a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} BUSBOX. All rights reserved.</span>
            <span>Closer than you think.</span>
          </div>
        </div>
      </footer>

      {!pathname.startsWith('/t/') && (
        <a className="wa-fab" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label="Chat with BUSBOX on WhatsApp">
          <WhatsAppIcon size={28} />
        </a>
      )}
    </>
  );
}
