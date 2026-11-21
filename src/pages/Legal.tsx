import { config, whatsappUrl } from '../config';
import { TERMS_SECTIONS, TERMS_UPDATED } from './termsText';

type Doc = 'terms' | 'privacy' | 'refunds' | 'prohibited';

const UPDATED = '15 October 2026';

/**
 * DRAFT policy text derived from the BUSBOX product spec. Have it reviewed by a qualified
 * lawyer (Consumer Protection (E-Commerce) Rules 2020, DPDP Act 2023, GST, payment-aggregator
 * rules) before public launch.
 */
export function LegalPage({ doc }: { doc: Doc }) {
  return (
    <div className="container narrow section legal">
      <div className="card" style={{ background: 'var(--orange-tint)', borderColor: '#FFD9A8', marginBottom: 24 }}>
        <b>Draft for legal review.</b> <span className="small">This text must be reviewed by counsel before BUSBOX goes live.</span>
      </div>
      {doc === 'terms' && <Terms />}
      {doc === 'privacy' && <Privacy />}
      {doc === 'refunds' && <Refunds />}
      {doc === 'prohibited' && <Prohibited />}
      <p className="muted small" style={{ marginTop: 32 }}>
        Last updated {UPDATED}. Questions: <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a> · <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>
      </p>
    </div>
  );
}

function Terms() {
  return (
    <>
      <h1>Terms and Conditions</h1>
      <p className="muted small">Last updated {TERMS_UPDATED}</p>
      {TERMS_SECTIONS.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {groupBullets(s.items).map((block, i) =>
            Array.isArray(block) ? (
              <ul key={i}>{block.map((b) => <li key={b}>{b}</li>)}</ul>
            ) : (
              <p key={i}>{block}</p>
            ),
          )}
        </section>
      ))}
    </>
  );
}

/** Consecutive "• " items become one bulleted list; other items stay paragraphs. */
function groupBullets(items: string[]): (string | string[])[] {
  const out: (string | string[])[] = [];
  for (const item of items) {
    if (!item.startsWith('• ')) out.push(item);
    else if (Array.isArray(out[out.length - 1])) (out[out.length - 1] as string[]).push(item.slice(2));
    else out.push([item.slice(2)]);
  }
  return out;
}

function Privacy() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <h2>What we collect</h2>
      <ul>
        <li><b>Account:</b> mobile number, name, optional email.</li>
        <li><b>Parcels:</b> pickup/drop addresses, receiver name and phone, parcel description, handover photos.</li>
        <li><b>Travellers:</b> KYC documents (licence, government ID), vehicle details, payout details.</li>
        <li><b>Location:</b> a Traveller’s live location only while they are heading to a pickup or carrying a parcel. We keep only the latest position and delete it when the delivery ends.</li>
        <li><b>Payments:</b> processed by our payment partner; we do not store card or UPI credentials.</li>
      </ul>
      <h2>Who sees what</h2>
      <ul>
        <li>Travellers see your contact details only after accepting your parcel and your payment is verified; the receiver’s details only after pickup.</li>
        <li>Receivers see the Traveller’s first name, vehicle number and live location during transit.</li>
        <li>KYC documents are visible only to authorised BUSBOX staff, and each access is logged.</li>
      </ul>
      <h2>Your rights</h2>
      <p>You can request access, correction or deletion of your data, subject to legal retention requirements (e.g. tax and payment records), by writing to {config.supportEmail}.</p>
    </>
  );
}

function Refunds() {
  return (
    <>
      <h1>Refunds &amp; Cancellations</h1>
      <ul>
        <li><b>Before payment:</b> cancel any time at no cost. If no traveller accepts within 24 hours, the booking expires. If a traveller accepts and you don’t pay within 60 minutes, the booking is cancelled.</li>
        <li><b>Traveller assigned, before pickup:</b> full refund.</li>
        <li><b>After pickup:</b> the booking cannot be cancelled in the app. Contact support for lost, damaged or undelivered parcels.</li>
        <li>Refunds go back to the original payment method, normally within 5–7 working days depending on your bank.</li>
        <li>If you are charged twice, the duplicate payment is refunded automatically.</li>
      </ul>
    </>
  );
}

function Prohibited() {
  const items = [
    'Cash, currency, cheques, bearer instruments, gold, jewellery, precious stones',
    'Narcotics, psychotropic substances, alcohol, tobacco and e-cigarettes',
    'Weapons, ammunition, explosives, fireworks, replicas',
    'Flammable, corrosive, toxic or radioactive materials; gas cylinders; lithium batteries shipped loose',
    'Live animals, plants requiring permits, perishable food that is not sealed',
    'Prescription medicines without a valid prescription',
    'Counterfeit, stolen or pirated goods; anything illegal to own or transport in India',
    'Passports and government ID documents of third parties',
    'Anything over 25 kg (actual or volume weight)',
  ];
  return (
    <>
      <h1>Prohibited items</h1>
      <p>For everyone’s safety, the following cannot be sent through BUSBOX. Travellers may inspect and refuse any parcel. Violations lead to account suspension and may be reported to authorities.</p>
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}
