const env = import.meta.env;

export const config = {
  apiUrl: (env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000',
  mapboxToken: (env.VITE_MAPBOX_TOKEN as string | undefined) ?? '',
  playStoreUrl: (env.VITE_PLAY_STORE_URL as string | undefined) ?? '#',
  appStoreUrl: (env.VITE_APP_STORE_URL as string | undefined) ?? '#',
  supportEmail: (env.VITE_SUPPORT_EMAIL as string | undefined) ?? 'busboxindia@gmail.com',
  supportPhone: (env.VITE_SUPPORT_PHONE as string | undefined) ?? '+918088962704',
};

/** Digits only, country code first, for wa.me links. */
const waNumber = config.supportPhone.replace(/\D/g, '');

/** Opens a WhatsApp chat with the business account (app on phones, WhatsApp Web on desktop). */
export const whatsappUrl = (text = 'Hi BUSBOX, I would like to know more.') =>
  `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

export const mailtoUrl = (subject = 'Enquiry from the BUSBOX website') =>
  `mailto:${config.supportEmail}?subject=${encodeURIComponent(subject)}`;

/** "+918088962704" -> "+91 80889 62704" */
export const prettyPhone = (p = config.supportPhone) => {
  const d = p.replace(/\D/g, '');
  return d.length === 12 && d.startsWith('91') ? `+91 ${d.slice(2, 7)} ${d.slice(7)}` : p;
};

export const rupees = (paise: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(paise / 100);

export const fmtDateTime = (v?: string | null) =>
  v ? new Date(v).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '—';
