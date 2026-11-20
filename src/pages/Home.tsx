import { useEffect } from 'react';
import { StoreBadges } from '../App';
import { Icon, WhatsAppIcon } from '../components/Icon';
import { config, mailtoUrl, prettyPhone, whatsappUrl } from '../config';

/** Fades sections in as they scroll into view. Skipped when the visitor prefers reduced motion. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const pillars = [
  ['flag', 'Our mission', 'Make sending a parcel as easy as sending a message, by turning journeys that already happen into a delivery network anyone can use.'],
  ['eye', 'Our vision', 'An India where every town is a short trip away, and no parcel is ever too far, too small or too urgent to send.'],
  ['target', 'Our goal', 'Build the most trusted people-powered logistics network, where every handover is verified and every traveller is rewarded fairly.'],
] as const;

const benefits = [
  ['bus', 'Uses journeys already on the road', 'Buses, cars and bikes travel between cities every day. BUSBOX puts the spare space on those trips to work, with no extra vehicles.'],
  ['town', 'Reaches beyond the big cities', 'If someone travels there, BUSBOX can deliver there, including towns that courier networks often skip.'],
  ['tag', 'Clear, upfront pricing', 'See the full price before you book. No hidden charges, and you pay only after a traveller accepts.'],
  ['shield', 'Verified at every step', 'KYC-verified travellers, photo proof and OTP checks at both pickup and delivery.'],
] as const;

const flows = [
  {
    icon: 'package', who: 'Sender', title: 'Book a delivery in minutes',
    steps: ['Enter pickup and delivery addresses', 'Add parcel details: size, weight and contents', 'See the price and book. Pay once a traveller accepts'],
  },
  {
    icon: 'route', who: 'Traveller', title: 'Earn on the way',
    steps: ['Share your trip or browse requests on your route', 'Accept a parcel that fits your journey', 'Deliver it and get paid after the OTP check'],
  },
  {
    icon: 'key', who: 'Delivery', title: 'Tracked and OTP-verified',
    steps: ['Pickup confirmed with the sender’s OTP', 'Live tracking from pickup to the doorstep', 'Delivery confirmed with the receiver’s OTP'],
  },
] as const;

export default function Home() {
  useReveal();

  return (
    <>
      {/* ───────── Home ───────── */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-glow" aria-hidden="true" />
        <div className="container lp-hero-grid">
          <div className="lp-hero-copy">
            <span className="lp-eyebrow"><span className="lp-dot" /> People-powered logistics</span>
            <h1>Closer than <em>you&nbsp;think.</em></h1>
            <p className="lp-lead">
              BUSBOX connects people who need to send parcels with travellers and transport operators already going that way.
              Faster, more affordable delivery, verified by OTP at every handover.
            </p>
            <div className="lp-cta">
              <a className="btn btn-primary lp-btn-lg" href="#get-started">Get Started <Icon name="arrow" size={18} /></a>
              <a className="btn lp-btn-outline lp-btn-lg" href="#contact">Contact Us</a>
            </div>
            <ul className="lp-trust">
              <li><Icon name="shield" size={18} /> KYC-verified travellers</li>
              <li><Icon name="key" size={18} /> OTP pickup &amp; delivery</li>
              <li><Icon name="nav" size={18} /> Live tracking</li>
            </ul>
          </div>

          <div className="lp-hero-art" aria-hidden="true">
            <div className="lp-route-card">
              <div className="lp-route-head">
                <span className="lp-chip-live"><span className="live-dot" /> In transit</span>
                <span className="lp-muted-sm">BBX parcel · Size M</span>
              </div>
              <svg className="lp-route-svg" viewBox="0 0 320 170">
                <path id="lp-route" d="M30 135 C 90 135, 90 40, 160 60 S 250 40, 290 35" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                <path className="lp-route-dash" d="M30 135 C 90 135, 90 40, 160 60 S 250 40, 290 35" fill="none" stroke="#FF8A00" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
                <circle cx="30" cy="135" r="9" fill="#0B2B66" />
                <circle cx="30" cy="135" r="4" fill="#fff" />
                <circle cx="290" cy="35" r="9" fill="#FF8A00" />
                <circle cx="290" cy="35" r="4" fill="#fff" />
                <g className="lp-route-box">
                  <rect x="-11" y="-11" width="22" height="22" rx="5" fill="#0B2B66" />
                  <path d="M-5 -1 L0 -5 L5 -1 L5 5 L-5 5 Z" fill="#FF8A00" />
                  <animateMotion dur="6s" repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
                    <mpath href="#lp-route" />
                  </animateMotion>
                </g>
              </svg>
              <div className="lp-route-foot">
                <div><small>From</small><b>Pickup point</b></div>
                <Icon name="arrow" size={18} />
                <div style={{ textAlign: 'right' }}><small>To</small><b>Your doorstep</b></div>
              </div>
            </div>
            <div className="lp-float lp-float-a">
              <span className="lp-float-ic ok"><Icon name="check" size={16} /></span>
              <div><b>Picked up</b><small>OTP verified</small></div>
            </div>
            <div className="lp-float lp-float-b">
              <span className="lp-float-ic"><Icon name="clock" size={16} /></span>
              <div><b>On the way</b><small>Tracked live</small></div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section className="lp-section" id="about">
        <div className="container">
          <div className="lp-about-grid">
            <div className="reveal">
              <span className="lp-kicker">About BUSBOX</span>
              <h2 className="lp-h2">A delivery network built from journeys already happening.</h2>
            </div>
            <div className="reveal lp-about-text">
              <p>
                Every day, thousands of buses, cars and bikes travel between India&rsquo;s cities and towns with room to spare.
                BUSBOX is a technology platform that turns that spare space into a reliable delivery network.
              </p>
              <p>
                <b>Senders</b> book a delivery in the app. <b>Travellers and transport operators</b> heading the same way
                accept it, carry it and earn money for the trip. BUSBOX handles matching, secure payments, live tracking and
                OTP verification, so everyone knows exactly where the parcel is and who has it.
              </p>
            </div>
          </div>

          <div className="lp-pillars">
            {pillars.map(([icon, title, text], i) => (
              <article className="lp-card reveal" style={{ transitionDelay: `${i * 80}ms` }} key={title}>
                <span className="lp-ic"><Icon name={icon} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="lp-benefits reveal">
            <div className="lp-benefits-head">
              <h3>Why parcel delivery is easier with BUSBOX</h3>
              <p>More reach, lower cost and more peace of mind than a traditional courier.</p>
            </div>
            <div className="lp-benefits-grid">
              {benefits.map(([icon, title, text]) => (
                <div className="lp-benefit" key={title}>
                  <span className="lp-ic lp-ic-navy"><Icon name={icon} size={20} /></span>
                  <div>
                    <h4>{title}</h4>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="lp-section lp-section-alt" id="how-it-works">
        <div className="container">
          <div className="lp-center reveal">
            <span className="lp-kicker">How it works</span>
            <h2 className="lp-h2">Three roles, one smooth handover.</h2>
            <p className="lp-sub">From booking to doorstep, every step is visible and every handover is verified.</p>
          </div>
          <div className="lp-flows">
            {flows.map((f, i) => (
              <article className="lp-flow reveal" style={{ transitionDelay: `${i * 100}ms` }} key={f.who}>
                <div className="lp-flow-top">
                  <span className="lp-ic lp-ic-lg"><Icon name={f.icon} size={26} /></span>
                  <span className="lp-flow-num">0{i + 1}</span>
                </div>
                <span className="lp-flow-who">{f.who}</span>
                <h3>{f.title}</h3>
                <ol>
                  {f.steps.map((s) => (
                    <li key={s}><span className="lp-tick"><Icon name="check" size={14} /></span>{s}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Get started ───────── */}
      <section className="lp-section" id="get-started">
        <div className="container">
          <div className="lp-band reveal">
            <div>
              <h2>Ready to send, or ready to earn?</h2>
              <p>Get the BUSBOX app. Book your first delivery, or add your next trip and start earning.</p>
            </div>
            <StoreBadges />
          </div>
        </div>
      </section>

      {/* ───────── Contact ───────── */}
      <section className="lp-section lp-section-alt" id="contact">
        <div className="container">
          <div className="lp-center reveal">
            <span className="lp-kicker">Contact us</span>
            <h2 className="lp-h2">We&rsquo;re here to help.</h2>
            <p className="lp-sub">Questions about a delivery, partnerships or becoming a transport partner? Reach us directly.</p>
          </div>
          <div className="lp-contact">
            <article className="lp-contact-card reveal">
              <span className="lp-ic lp-ic-wa"><WhatsAppIcon size={26} /></span>
              <h3>Chat on WhatsApp</h3>
              <p>The quickest way to reach us.</p>
              <a className="lp-contact-val" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">{prettyPhone()}</a>
              <a className="btn lp-btn-wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Start WhatsApp chat
              </a>
            </article>
            <article className="lp-contact-card reveal" style={{ transitionDelay: '100ms' }}>
              <span className="lp-ic"><Icon name="mail" size={26} /></span>
              <h3>Send us an email</h3>
              <p>For detailed queries and business enquiries.</p>
              <a className="lp-contact-val" href={mailtoUrl()}>{config.supportEmail}</a>
              <a className="btn btn-navy" href={mailtoUrl()}>
                <Icon name="mail" size={18} /> Write an email
              </a>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
