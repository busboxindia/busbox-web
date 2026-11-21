import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StoreBadges } from '../App';
import { Icon, WhatsAppIcon } from '../components/Icon';
import { config, mailtoUrl, whatsappUrl } from '../config';

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Fades sections in as they scroll into view. Skipped when the visitor prefers reduced motion. */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if (reducedMotion() || !('IntersectionObserver' in window)) {
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

/** Cycles through words in place ("bus" → "car" → …). Shows the first word only for reduced motion. */
function Rotator({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => window.clearInterval(t);
  }, [words.length]);
  return (
    <span className="lp-rotator" aria-live="off">
      <span key={i} className="lp-rotator-word">{words[i]}</span>
    </span>
  );
}

const pillars = [
  ['flag', 'Our mission', 'Make sending a parcel as easy as sending a message, by turning journeys that already happen into a delivery network anyone can use.'],
  ['eye', 'Our vision', 'An India where every town is a short trip away, and no parcel is ever too far, too small or too urgent to send.'],
  ['target', 'Our goal', 'Build the most trusted people-powered logistics network, where every handover is verified and every traveller is rewarded fairly.'],
] as const;

const benefits = [
  ['bus', 'Uses journeys already on the road', 'Buses, cars and bikes travel between cities every day. BUSBOX puts the spare space on those trips to work, with no extra vehicles.'],
  ['town', 'Reaches beyond the big cities', 'If someone travels there, BUSBOX can deliver there, including smaller towns and everyday routes.'],
  ['tag', 'Prices that feel fair', 'No new trucks or warehouses to pay for. You pay for a seat on a trip that was happening anyway, not for overheads.'],
  ['shield', 'Verified at every step', 'KYC-verified travellers, photo proof and OTP checks at both pickup and delivery.'],
] as const;

const flows = [
  {
    icon: 'package', who: 'Sender', title: 'Book a delivery in minutes',
    steps: ['Enter pickup and delivery addresses', 'Add parcel details: size, weight and contents', 'Book, then hand it over with your pickup OTP'],
  },
  {
    icon: 'route', who: 'Traveller', title: 'Earn on the way',
    steps: ['Verify your ID once, then share your trip', 'Accept a parcel that fits your journey', 'Deliver it and get paid after the OTP check'],
  },
  {
    icon: 'key', who: 'Receiver', title: 'Tracked and OTP-verified',
    steps: ['Get a tracking link by SMS', 'Watch the parcel move live on the map', 'Check the packing, then share your delivery OTP'],
  },
] as const;

/* ───────── The idea, in one picture ───────── */
const promises = [
  { icon: 'clock', tone: 'fast', title: 'Faster', line: 'No hubs. No sorting. No waiting.', text: 'Your parcel leaves with the next traveller heading your way and goes straight to the door, so it moves as fast as the journey itself.' },
  { icon: 'shield', tone: 'safe', title: 'Safer', line: 'Fewer hands. Every one verified.', text: 'Just one ID-verified traveller carries it from you to the receiver. It changes hands only with an OTP, and you can watch it live.' },
  { icon: 'coins', tone: 'value', title: 'Lighter on your pocket', line: 'Pay for the trip, not the trucks.', text: 'The traveller was going anyway. No new vehicles or warehouses means a fair price for you and extra income for them.' },
] as const;

function IdeaSection() {
  return (
    <section className="lp-section lp-idea" id="idea">
      <div className="container">
        <div className="lp-center reveal">
          <span className="lp-kicker">The idea in one picture</span>
          <h2 className="lp-h2">Someone is already going there. <span className="lp-hl">Your parcel goes with them.</span></h2>
          <p className="lp-sub">Every day, buses, cars and bikes travel between cities with room to spare. BUSBOX turns that space into the simplest way to send.</p>
        </div>

        <article className="lp-idea-card reveal">
          <div className="lp-direct" aria-label="BUSBOX route: you, a traveller already making the trip, then the receiver">
            <div className="lp-direct-node"><span><Icon name="home" size={26} /></span><b>You</b><small>Hand it over with your OTP</small></div>
            <div className="lp-direct-line" aria-hidden="true"><span className="lp-direct-parcel"><Icon name="package" size={18} /></span></div>
            <div className="lp-direct-node lp-direct-mid"><span><Icon name="bus" size={26} /></span><b>Verified traveller</b><small>Already making this trip</small></div>
            <div className="lp-direct-line" aria-hidden="true"><span className="lp-direct-parcel late"><Icon name="package" size={18} /></span></div>
            <div className="lp-direct-node"><span><Icon name="user" size={26} /></span><b>Receiver</b><small>Collects with their OTP</small></div>
          </div>
          <p className="lp-idea-foot"><Icon name="check" size={18} /> One direct trip. Two OTP checks. Tracked live, door to door.</p>
        </article>

        <div className="lp-promises">
          {promises.map((p, i) => (
            <article className={`lp-promise lp-promise-${p.tone} reveal`} style={{ transitionDelay: `${i * 90}ms` }} key={p.title}>
              <span className="lp-promise-ic"><Icon name={p.icon} size={24} /></span>
              <h3>{p.title}</h3>
              <b className="lp-promise-line">{p.line}</b>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Moments: what people send ───────── */
const moments = [
  { icon: 'flag', title: 'Left your documents at home?', text: 'Someone travelling from your hometown today can bring them to you.' },
  { icon: 'star', title: 'A birthday you can’t make it to', text: 'Your gift still arrives, carried by someone already heading there.' },
  { icon: 'home', title: 'A taste of home', text: 'Festival sweets and home-made snacks, sent with someone already on the way.' },
  { icon: 'package', title: 'Samples for a client', text: 'Small business? Get samples to customers in other cities quickly and affordably.' },
] as const;

function MomentsSection() {
  return (
    <section className="lp-section lp-section-alt" id="moments">
      <div className="container">
        <div className="lp-center reveal">
          <span className="lp-kicker">Made for real life</span>
          <h2 className="lp-h2">What will you send first?</h2>
          <p className="lp-sub">The things that matter most are rarely big. They just need to get there, safely and soon.</p>
        </div>
        <div className="lp-moments">
          {moments.map((m, i) => (
            <a className="lp-moment reveal" href="#get-started" style={{ transitionDelay: `${i * 80}ms` }} key={m.title}>
              <span className="lp-moment-ic"><Icon name={m.icon} size={24} /></span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <span className="lp-moment-cta">Send it with BUSBOX <Icon name="arrow" size={16} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Follow one parcel (interactive) ───────── */
const journey = [
  { icon: 'package', title: 'Book', text: 'Tell us where it’s going and what you’re sending. It takes just a few taps in the app.' },
  { icon: 'users', title: 'Match', text: 'A KYC-verified traveller already heading that way accepts your parcel. You see who they are and how they travel.' },
  { icon: 'key', title: 'Pickup', text: 'Meet the traveller and share your pickup OTP. Only then does the parcel change hands.' },
  { icon: 'nav', title: 'On the way', text: 'Follow the parcel live on the map. Location is shared only while the booking is active.' },
  { icon: 'check', title: 'Delivered', text: 'The receiver checks the packing and shares the delivery OTP. The traveller’s earning is released after delivery.' },
] as const;

function PhoneScreen({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="ps ps-book">
          <div className="ps-title">Send a parcel</div>
          <div className="ps-field"><span className="ps-dot navy" /> <div><small>Pickup</small><b>Bengaluru</b></div></div>
          <div className="ps-field"><span className="ps-dot orange" /> <div><small>Drop</small><b>Mangaluru</b></div></div>
          <div className="ps-field"><span className="ps-dot box"><Icon name="package" size={12} /></span> <div><small>Sending</small><b>Gift box</b></div></div>
          <div className="ps-price"><small>Next traveller on this route</small><b>Leaving soon</b><span>Verified · tracked live</span></div>
          <div className="ps-btn">Book delivery</div>
        </div>
      );
    case 1:
      return (
        <div className="ps ps-match">
          <div className="ps-title">Traveller found</div>
          <div className="ps-radar"><span /><span /><span /><i><Icon name="bus" size={22} /></i></div>
          <div className="ps-card">
            <div className="ps-avatar"><Icon name="user" size={20} /></div>
            <div><b>Your traveller</b><small><Icon name="shield" size={12} /> KYC verified · by bus</small></div>
          </div>
          <div className="ps-chip ok"><Icon name="check" size={14} /> Accepted your parcel</div>
        </div>
      );
    case 2:
      return (
        <div className="ps ps-otp">
          <div className="ps-title">Pickup OTP</div>
          <p className="ps-muted">Share this only when the traveller has your parcel.</p>
          <div className="ps-otp-boxes">{['4', '8', '2', '7'].map((d, i) => <span key={i} style={{ animationDelay: `${i * 0.25}s` }}>{d}</span>)}</div>
          <div className="ps-chip ok"><Icon name="check" size={14} /> Pickup OTP verified</div>
          <div className="ps-chip"><Icon name="nav" size={14} /> Live tracking started</div>
        </div>
      );
    case 3:
      return (
        <div className="ps ps-map">
          <div className="ps-mapbox">
            <svg viewBox="0 0 200 220" aria-hidden="true">
              <path d="M0 60h200M0 150h200M60 0v220M140 0v220" stroke="#e2e8f0" strokeWidth="10" />
              <path id="ps-route" d="M30 190 C 60 150, 50 110, 100 100 S 160 60, 170 30" fill="none" stroke="#0b2b66" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
              <circle cx="30" cy="190" r="7" fill="#0b2b66" />
              <circle cx="170" cy="30" r="7" fill="#ff8a00" />
              <g>
                <circle r="11" fill="#ff8a00" opacity=".25"><animate attributeName="r" values="8;15;8" dur="1.6s" repeatCount="indefinite" /></circle>
                <circle r="6" fill="#ff8a00" stroke="#fff" strokeWidth="2" />
                <animateMotion dur="5s" repeatCount="indefinite"><mpath href="#ps-route" /></animateMotion>
              </g>
            </svg>
          </div>
          <div className="ps-sheet">
            <span className="ps-chip live"><span className="live-dot" /> Live</span>
            <b>On the way to Mangaluru</b>
            <small>Tracked from pickup to doorstep</small>
          </div>
        </div>
      );
    default:
      return (
        <div className="ps ps-done">
          <div className="ps-big-check"><Icon name="check" size={40} /></div>
          <div className="ps-title center">Delivered</div>
          <p className="ps-muted center">Delivery OTP verified by the receiver.</p>
          <div className="ps-stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="star" size={22} />)}</div>
          <div className="ps-chip ok center"><Icon name="wallet" size={14} /> Traveller paid</div>
        </div>
      );
  }
}

function JourneySection() {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || reducedMotion()) return;
    const t = window.setTimeout(() => setStep((s) => (s + 1) % journey.length), 4200);
    return () => window.clearTimeout(t);
  }, [step, auto]);

  const pick = (i: number) => { setStep(i); setAuto(false); };

  return (
    <div className="lp-journey">
      <ol className="lp-steps" role="tablist" aria-label="Parcel journey">
        {journey.map((s, i) => (
          <li key={s.title}>
            <button type="button" role="tab" id={`jt-${i}`} aria-selected={step === i} aria-controls="journey-panel"
              className={`lp-step${step === i ? ' on' : ''}${i < step ? ' done' : ''}`} onClick={() => pick(i)}>
              <span className="lp-step-num">{i < step ? <Icon name="check" size={16} /> : i + 1}</span>
              <span className="lp-step-body">
                <b><Icon name={s.icon} size={16} /> {s.title}</b>
                <span className="lp-step-text">{s.text}</span>
              </span>
              {step === i && auto && <span className="lp-step-bar" key={`bar-${step}`} />}
            </button>
          </li>
        ))}
      </ol>
      <div className="lp-phone-wrap" id="journey-panel" role="tabpanel" aria-labelledby={`jt-${step}`}>
        <div className="lp-phone">
          <div className="lp-phone-notch" />
          <div className="lp-phone-screen" key={step}><PhoneScreen step={step} /></div>
        </div>
        <div className="lp-phone-glow" aria-hidden="true" />
      </div>
    </div>
  );
}

/* ───────── Safety ───────── */
const safety = [
  ['shield', 'Verified travellers', 'Every traveller verifies their identity, for example with Aadhaar e-KYC or DigiLocker, before they can accept a parcel.'],
  ['key', 'OTP at both ends', 'The parcel changes hands only with the sender’s pickup OTP, and is handed over only against the receiver’s delivery OTP.'],
  ['camera', 'Photo proof', 'Parcel photos and the trip record are kept, so any problem can be reviewed.'],
  ['nav', 'Live, private tracking', 'Follow the parcel on a live map. Location is tracked only while a booking is active.'],
  ['wallet', 'Earnings held until delivery', 'The traveller’s earning is paid only after the parcel is delivered, so every traveller is motivated to deliver it safely.'],
  ['phone', 'Real people on WhatsApp', 'A question or a worry at any point? Message us on WhatsApp and a real person from our team will help.'],
] as const;

/* ───────── FAQ (answers follow the Terms & Conditions) ───────── */
const faqs: [string, JSX.Element][] = [
  ['What exactly is BUSBOX?', <>BUSBOX is a technology platform that connects people who want to send a parcel with verified travellers and transport operators already going that way. We handle matching, payments, live tracking and OTP checks; the traveller carries the parcel.</>],
  ['Who carries my parcel?', <>An independent traveller, such as someone taking a bus, driving a car or riding a bike on that route, or a transport operator. Every traveller verifies their identity before they can accept a parcel.</>],
  ['Is my parcel really safe with a stranger?', <>Every traveller verifies their identity before they can accept a parcel. Your parcel changes hands only with your pickup OTP, is handed over only against the receiver&rsquo;s delivery OTP, and you can follow it live the whole way. The traveller is paid only after delivery.</>],
  ['Why is it faster?', <>There are no hubs, sorting centres or waiting for the next truck. Your parcel goes directly with a traveller who is already making that trip, so it moves as fast as the journey itself.</>],
  ['Can I see where my parcel is?', <>Yes. You can watch it move on a live map from pickup to the doorstep, and the receiver gets a tracking link by SMS too.</>],
  ['How do travellers earn?', <>Share your trip or browse parcel requests on your route, accept one that fits, and deliver it. Your earning is paid after the delivery OTP is confirmed.</>],
];

export default function Home() {
  useReveal();

  return (
    <>
      {/* ───────── Home ───────── */}
      <section className="lp-hero" id="home">
        <div className="lp-hero-glow" aria-hidden="true" />
        <div className="lp-hero-glow lp-hero-glow-2" aria-hidden="true" />
        <div className="container lp-hero-grid">
          <div className="lp-hero-copy">
            <span className="lp-eyebrow"><span className="lp-dot" /> People-powered logistics</span>
            <h1>Closer than <em>you&nbsp;think.</em></h1>
            <p className="lp-hero-line">
              It rides with someone already going <span className="lp-nowrap">by <Rotator words={['bus', 'car', 'van', 'truck', 'bike']} /></span>
            </p>
            <p className="lp-lead">
              No hubs, no waiting, no stress. BUSBOX hands your parcel to a verified traveller already heading that way,
              so it goes straight to the door, tracked live and protected by OTP at every handover.
            </p>
            <div className="lp-cta">
              <a className="btn btn-primary lp-btn-lg lp-btn-shine" href="#get-started">Send your first parcel <Icon name="arrow" size={18} /></a>
              <a className="btn lp-btn-outline lp-btn-lg" href="#get-started"><Icon name="coins" size={18} /> Earn while travelling</a>
            </div>
            <ul className="lp-promise-chips">
              <li><span className="ok"><Icon name="shield" size={16} /></span> Safe &amp; verified</li>
              <li><span><Icon name="clock" size={16} /></span> Fast &amp; direct</li>
              <li><span><Icon name="coins" size={16} /></span> Easy on your pocket</li>
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
              <div className="lp-traveller">
                <span className="lp-traveller-av"><Icon name="user" size={18} /></span>
                <div><b>Your traveller</b><small><Icon name="shield" size={12} /> KYC verified · travelling by bus</small></div>
                <span className="lp-traveller-ic"><Icon name="bus" size={18} /></span>
              </div>
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
        <a className="lp-scroll-cue" href="#idea" aria-label="Scroll to see how BUSBOX works"><Icon name="chevron" size={22} /></a>
      </section>

      <IdeaSection />
      <MomentsSection />

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
              <p>More reach, fair prices and real peace of mind, every time you send.</p>
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
            <h2 className="lp-h2">Follow one parcel, start to finish.</h2>
            <p className="lp-sub">Five simple steps. Tap any step to see it in the app.</p>
          </div>
          <div className="reveal"><JourneySection /></div>

          <div className="lp-center lp-center-tight reveal">
            <h3 className="lp-h3">Three roles, one smooth handover.</h3>
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

      {/* ───────── Safety ───────── */}
      <section className="lp-section lp-safety" id="safety">
        <div className="container">
          <div className="lp-center reveal">
            <span className="lp-kicker">Safety &amp; trust</span>
            <h2 className="lp-h2">Peace of mind, from the first tap to the doorstep.</h2>
            <p className="lp-sub">You always know who has your parcel, where it is, and that it reached the right person.</p>
          </div>
          <div className="lp-safety-grid">
            {safety.map(([icon, title, text], i) => (
              <article className="lp-safe reveal" style={{ transitionDelay: `${(i % 3) * 80}ms` }} key={title}>
                <span className="lp-safe-ic"><Icon name={icon} size={22} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="lp-safety-note reveal">
            Some items can&rsquo;t travel with BUSBOX. <Link to="/prohibited-items">See prohibited items <Icon name="arrow" size={14} /></Link>
          </p>
        </div>
      </section>

      {/* ───────── Get started ───────── */}
      <section className="lp-section" id="get-started">
        <div className="container">
          <div className="lp-band lp-band-hot reveal">
            <div className="lp-band-copy">
              <span className="lp-band-pill"><span className="lp-dot" /> Now welcoming early users</span>
              <h2>Your first BUSBOX delivery is just a few taps away.</h2>
              <p>Be one of the first in your city to send the smarter way, or turn the trips you already take into extra income.</p>
              <ul className="lp-band-checks">
                <li><Icon name="check" size={16} /> Verified travellers</li>
                <li><Icon name="check" size={16} /> OTP at both ends</li>
                <li><Icon name="check" size={16} /> Live tracking</li>
                <li><Icon name="check" size={16} /> Help on WhatsApp</li>
              </ul>
            </div>
            <div className="lp-band-side">
              <StoreBadges />
              <a className="lp-band-wa" href={whatsappUrl('Hi BUSBOX, I want to send my first parcel!')} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> Or start right now on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="lp-section lp-section-alt" id="faq">
        <div className="container">
          <div className="lp-faq-grid">
            <div className="reveal lp-faq-intro">
              <span className="lp-kicker">FAQ</span>
              <h2 className="lp-h2">Questions, answered.</h2>
              <p className="lp-sub lp-sub-left">Can&rsquo;t find what you&rsquo;re looking for? Message us and a real person will reply.</p>
              <a className="btn lp-btn-wa" href={whatsappUrl('Hi BUSBOX, I have a question.')} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Ask on WhatsApp
              </a>
            </div>
            <div className="lp-faq reveal">
              {faqs.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}<span className="lp-faq-ic"><Icon name="chevron" size={18} /></span></summary>
                  <div className="lp-faq-a"><p>{a}</p></div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Contact ───────── */}
      <section className="lp-section" id="contact">
        <div className="container">
          <div className="lp-center reveal">
            <span className="lp-kicker">Contact us</span>
            <h2 className="lp-h2">We&rsquo;re here to help.</h2>
            <p className="lp-sub">Questions about a delivery, partnerships or becoming a transport partner? Reach us directly.</p>
          </div>
          <div className="lp-contact">
            <article className="lp-contact-card reveal">
              <span className="lp-ic lp-ic-wa"><WhatsAppIcon size={26} /></span>
              <h3>Message us on WhatsApp</h3>
              <p>The quickest way to reach us. Send a message any time and a real person from our team will reply.</p>
              <a className="btn lp-btn-wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={18} /> Send a WhatsApp message
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
