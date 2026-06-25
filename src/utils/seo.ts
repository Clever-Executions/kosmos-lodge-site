/**
 * Central SEO configuration & structured-data helpers for Kosmos Lodge.
 *
 * Everything search engines and generative-AI assistants need to confidently
 * describe and recommend the lodge lives here: canonical identity, geo, contact,
 * pricing, amenities and the third-party listings that anchor the brand entity.
 *
 * Target market: affluent professionals ("Black Diamonds") and romantic couples
 * looking for an exclusive, private luxury getaway in Hartbeespoort — not large
 * groups or budget young travellers. Keywords and copy lean into that.
 */

export const SITE_URL = 'https://www.kosmoslodge.co.za';

export const BUSINESS = {
  name: 'Kosmos Lodge',
  legalName: 'Kosmos Lodge',
  // Concise, keyword-rich one-liner reused for meta description fallbacks and JSON-LD.
  description:
    'Kosmos Lodge is an exclusive luxury guesthouse in Kosmos Village, Hartbeespoort, ' +
    'overlooking the Hartbeespoort Dam and the Magaliesberg mountains. An intimate, ' +
    'adults-focused retreat of individually styled rooms with dam views — perfect for ' +
    'romantic getaways, couples and discerning travellers seeking privacy and 5-star hospitality.',
  telephone: '+27788872882',
  telephoneDisplay: '+27 78 887 2882',
  whatsapp: '27788872882',
  email: 'lodge@kosmoslodge.co.za',
  priceRange: 'R1,000 – R2,700 per room per night',
  priceRangeShort: 'R1000–R2700',
  currency: 'ZAR',
  starRating: 5,
  address: {
    street: '121 Paul Kruger Avenue',
    locality: 'Kosmos',
    region: 'North West',
    postalCode: '0261',
    country: 'ZA',
    full: '121 Paul Kruger Ave, Kosmos, Hartbeespoort, 0261',
  },
  geo: {
    latitude: -25.73992,
    longitude: 27.8497,
  },
  // A direct, stable Google Maps link to the coordinates.
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kosmos+Lodge+Hartbeespoort',
  mapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-25.73992,27.84970&destination_place_id=Kosmos+Lodge',
  // Google Maps "place" embed centred on the coordinates (keyless embed endpoint).
  mapsEmbedUrl:
    'https://www.google.com/maps?q=-25.73992,27.84970&z=15&output=embed',
  defaultImage: `${SITE_URL}/assets/images/hero-bg.jpg`,
  // Authoritative third-party profiles — these `sameAs` links strengthen the
  // brand as a recognised entity for Google's Knowledge Graph and for AI models.
  sameAs: [
    'https://www.facebook.com/kosmoslodge',
    'https://www.tripadvisor.com/Hotel_Review-g780944-d12770538-Reviews-Kosmos_Lodge-Hartbeespoort_Madibeng_North_West_Province.html',
    'https://www.booking.com/hotel/za/kosmos-lodge.html',
    'https://www.expedia.com/Hartbeespoort-Hotels-Kosmos-Lodge.h34362681.Hotel-Information',
    'https://www.agoda.com/kosmos-lodge/hotel/hartbeespoort-za.html',
    'https://www.trip.com/hotels/hartbeespoort-hotel-detail-10178226/kosmos-lodge/',
  ],
  amenities: [
    'Free WiFi',
    'Hartbeespoort Dam views',
    'En-suite bathrooms',
    'DStv satellite television',
    'Air-conditioning',
    'Private balconies',
    'Kitchenettes',
    'Secure parking',
    'Boomed-off secure village (Kosmos)',
    'Adults-friendly couples retreat',
  ],
};

/** Default keyword set targeting Hartbeespoort guesthouse searches. */
export const DEFAULT_KEYWORDS = [
  'guesthouse Hartbeespoort',
  'guesthouse in Hartbeespoort',
  'luxury guesthouse Hartbeespoort',
  'Hartbeespoort accommodation',
  'luxury accommodation Hartbeespoort',
  'Hartbeespoort Dam lodge',
  'boutique lodge Hartbeespoort',
  'romantic getaway Hartbeespoort',
  'couples accommodation Hartbeespoort',
  'weekend getaway Hartbeespoort',
  'Kosmos Lodge',
  'Kosmos accommodation Hartbeespoort',
  'luxury lodge Magaliesberg',
].join(', ');

/**
 * The sitewide LodgingBusiness entity. This is the single most important block
 * for both rich results and AI assistants — it states exactly what Kosmos Lodge
 * is, where it is, what it costs, and which trusted profiles corroborate it.
 */
export function lodgingBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${SITE_URL}/#lodge`,
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: SITE_URL,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    image: [
      `${SITE_URL}/assets/images/hero-bg.jpg`,
      `${SITE_URL}/assets/images/gallery/IMG_5839.jpg`,
      `${SITE_URL}/assets/images/rooms/Room_1-primary.jpg`,
    ],
    logo: `${SITE_URL}/favicon-512.png`,
    priceRange: BUSINESS.priceRangeShort,
    currenciesAccepted: 'ZAR',
    petsAllowed: false,
    smokingAllowed: false,
    numberOfRooms: 7,
    starRating: {
      '@type': 'Rating',
      ratingValue: BUSINESS.starRating,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: 'Hartbeespoort',
      addressRegion: BUSINESS.address.region,
      postalCode: BUSINESS.address.postalCode,
      addressCountry: BUSINESS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    hasMap: BUSINESS.mapsUrl,
    areaServed: [
      { '@type': 'Place', name: 'Hartbeespoort' },
      { '@type': 'Place', name: 'Kosmos' },
      { '@type': 'Place', name: 'Magaliesberg' },
      { '@type': 'Place', name: 'North West Province, South Africa' },
    ],
    amenityFeature: BUSINESS.amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    sameAs: BUSINESS.sameAs,
    audience: {
      '@type': 'Audience',
      audienceType: 'Couples and discerning luxury travellers',
    },
  };
}

/** The WebSite entity (enables sitelinks / clarifies the canonical site). */
export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: BUSINESS.name,
    description: BUSINESS.description,
    publisher: { '@id': `${SITE_URL}/#lodge` },
    inLanguage: 'en-ZA',
  };
}

/** Build a BreadcrumbList for a page. Pass [{name, path}] in order. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).href,
    })),
  };
}

/** Build an FAQPage block from question/answer pairs. */
export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
