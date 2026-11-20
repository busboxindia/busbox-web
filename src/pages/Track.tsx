import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Schematic from '../components/Schematic';

// Mapbox GL is large; load it only on the tracking page.
const TrackMap = lazy(() => import('../components/TrackMap'));
import { StoreBadges } from '../App';
import { config, fmtDateTime } from '../config';

interface TrackData {
  code: string;
  status: string;
  trackingPhase: 'NONE' | 'APPROACHING' | 'LIVE' | 'ENDED';
  senderFirstName: string;
  receiverName: string;
  drop: { label: string; lat: number; lng: number };
  traveller: { firstName: string; vehicleNumber: string; vehicleType: string } | null;
  location: { lat: number; lng: number; updatedAt?: string } | null;
  etaMinutes: number | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  canReview: boolean;
}

const STATUS: Record<string, [string, string]> = {
  PENDING_PAYMENT: ['Traveller found', 'var(--warning)'],
  AWAITING_TRAVELLER: ['Finding a traveller', 'var(--orange)'],
  ACCEPTED: ['Traveller assigned', 'var(--navy)'],
  TRAVELLER_EN_ROUTE: ['Being picked up', 'var(--navy)'],
  IN_TRANSIT: ['On the way to you', 'var(--orange)'],
  DELIVERED: ['Delivered', 'var(--success)'],
  CANCELLED: ['Cancelled', 'var(--danger)'],
  EXPIRED: ['Cancelled', 'var(--danger)'],
};
const ORDER = ['AWAITING_TRAVELLER', 'PENDING_PAYMENT', 'ACCEPTED', 'TRAVELLER_EN_ROUTE', 'IN_TRANSIT', 'DELIVERED'];

/** Receiver tracking page — the link in the SMS. No login; only data the receiver should see. */
export default function Track() {
  const { token = '' } = useParams();
  const [data, setData] = useState<TrackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${config.apiUrl}/api/v1/public/track/${encodeURIComponent(token)}`);
      if (!res.ok) throw new Error(res.status === 404 ? 'This tracking link is invalid or has expired.' : 'Could not load tracking.');
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [token]);

  useEffect(() => {
    load();
    const poll = setInterval(load, 30_000); // fallback if the socket drops
    const socket = io(`${config.apiUrl}/realtime`, { transports: ['websocket'], auth: { trackingToken: token } });
    socket.on('parcel:location', (p: { lat: number; lng: number; etaMinutes: number; at: string }) =>
      setData((d) => (d ? { ...d, location: { lat: p.lat, lng: p.lng, updatedAt: p.at }, etaMinutes: p.etaMinutes } : d)),
    );
    socket.on('parcel:status', load);
    return () => {
      clearInterval(poll);
      socket.disconnect();
    };
  }, [token, load]);

  if (error) {
    return (
      <div className="container narrow section">
        <div className="card stack" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40 }}>📦</div>
          <h2 style={{ fontSize: 22 }}>{error}</h2>
          <p className="muted">Check the link in your SMS, or contact {config.supportEmail}.</p>
        </div>
      </div>
    );
  }
  if (!data) return <div className="container narrow section muted">Loading your parcel…</div>;

  const [label, color] = STATUS[data.status] ?? [data.status, 'var(--muted)'];
  const step = ORDER.indexOf(data.status);
  const live = data.trackingPhase === 'LIVE';

  return (
    <div className="container narrow" style={{ padding: '20px 16px 0' }}>
      <div className="stack">
        <div className="card stack">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="muted small">Parcel from {data.senderFirstName}</div>
              <h2 style={{ fontSize: 22, color }}>{label}</h2>
            </div>
            {live && data.etaMinutes != null && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ font: '700 22px Poppins', color: 'var(--navy)' }}>{data.etaMinutes} min</div>
                <div className="muted small">estimated</div>
              </div>
            )}
          </div>
          {step >= 0 && (
            <div className="progress">
              {ORDER.map((s, i) => <span key={s} className={i <= step ? 'on' : ''} />)}
            </div>
          )}
        </div>

        {config.mapboxToken ? (
          <Suspense fallback={<Schematic drop={data.drop} traveller={live && data.location ? data.location : null} />}>
            <TrackMap drop={data.drop} traveller={live && data.location ? data.location : null} />
          </Suspense>
        ) : (
          <Schematic drop={data.drop} traveller={live && data.location ? data.location : null} />
        )}
        <div className="row small muted">
          {live ? <><span className="live-dot" /> Live location · updated {fmtDateTime(data.location?.updatedAt)}</> : data.status === 'DELIVERED' ? 'Tracking has ended.' : 'Live tracking starts once your parcel is picked up.'}
        </div>

        {data.traveller && data.status !== 'DELIVERED' && (
          <div className="card row">
            <div className="icon-bubble" style={{ background: 'var(--navy-tint)', color: 'var(--navy)' }}>🚌</div>
            <div style={{ flex: 1 }}>
              <b>{data.traveller.firstName}</b> is carrying your parcel
              <div className="muted small">{data.traveller.vehicleType.toLowerCase()} · {data.traveller.vehicleNumber}</div>
            </div>
          </div>
        )}

        {data.status === 'IN_TRANSIT' && (
          <div className="card" style={{ background: 'var(--orange-tint)', borderColor: '#FFD9A8' }}>
            <b>Keep your delivery OTP ready.</b>
            <div className="small" style={{ marginTop: 4 }}>
              We sent a 4-digit code to your phone. Share it with the traveller <u>only</u> after you receive the parcel.
            </div>
          </div>
        )}

        <div className="card">
          <ul className="timeline">
            <li><span className="dot done" /> Booked and paid by {data.senderFirstName}</li>
            <li><span className={`dot ${data.pickedUpAt ? 'done' : ''}`} /> Picked up {data.pickedUpAt ? `· ${fmtDateTime(data.pickedUpAt)}` : ''}</li>
            <li><span className={`dot ${data.deliveredAt ? 'done' : ''}`} /> Delivered to {data.receiverName} {data.deliveredAt ? `· ${fmtDateTime(data.deliveredAt)}` : ''}</li>
          </ul>
          <div className="muted small" style={{ marginTop: 8 }}>Drop point: {data.drop.label}</div>
        </div>

        {data.canReview && <Review token={token} onDone={load} />}

        <div className="card stack">
          <div>
            <b>Track faster in the BUSBOX app</b>
            <div className="muted small">Get live notifications and send your own parcels with travellers on your route.</div>
          </div>
          <StoreBadges />
        </div>
      </div>
    </div>
  );
}

function Review({ token, onDone }: { token: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (skip = false) => {
    setBusy(true);
    const res = await fetch(`${config.apiUrl}/api/v1/public/track/${encodeURIComponent(token)}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skip ? { skip: true } : { rating, ...(comment.trim() && { comment: comment.trim() }) }),
    });
    setBusy(false);
    if (res.ok) {
      setMsg(skip ? 'Skipped.' : 'Thank you for your feedback!');
      setTimeout(onDone, 1200);
    } else {
      setMsg('Could not save your rating. Please try again.');
    }
  };

  if (msg) return <div className="card">{msg}</div>;
  return (
    <div className="card stack" style={{ textAlign: 'center' }}>
      <b>How was your delivery?</b>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} className={i <= rating ? 'on' : ''} onClick={() => setRating(i)} aria-label={`${i} star`}>★</button>
        ))}
      </div>
      <textarea rows={2} placeholder="Anything to add? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button className="btn btn-primary" disabled={!rating || busy} onClick={() => submit()}>Submit rating</button>
      <button className="btn btn-ghost" disabled={busy} onClick={() => submit(true)}>Skip</button>
    </div>
  );
}
