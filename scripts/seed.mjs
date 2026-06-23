import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.PUBLIC_SANITY_DATASET ?? 'production',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2026-06-03',
});

async function uploadLocalImage(relPath) {
  const absPath = path.join(__dirname, '..', 'public', relPath);
  if (!fs.existsSync(absPath)) {
    console.warn(`  ⚠ Image not found: ${absPath}`);
    return null;
  }
  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(absPath),
  });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

async function seedSiteSettings() {
  console.log('Seeding siteSettings...');
  await client.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    welcomeBarText: 'Welcome to KOSMOS LODGE HARTBEESPOORT',
    phone: '+27 78 887 2882',
    whatsapp: '27788872882',
    email: 'lodge@kosmoslodge.co.za',
    address: '121 Paul Kruger Ave, Kosmos, Hartbeespoort, 0261',
    mapsUrl: 'https://www.google.co.za/maps/place/Kosmos+Lodge/@-25.7403567,27.8482583,17.08z',
    facebookUrl: 'https://www.facebook.com/kosmoslodge',
    formspreeUrl: 'https://formspree.io/f/mkoeeorg',
    rateCardText: 'R1,000 - R2,700',
    rateCardSubtext: 'Per room per night, depending on room type, dates and number of guests. Enquire for best rates.',
    copyrightYear: 2025,
  });
  console.log('  ✓ siteSettings created');
}

async function seedHomePage() {
  console.log('Seeding homePage...');
  await client.createOrReplace({
    _type: 'homePage',
    _id: 'homePage',
    heroBadge: 'Magaliesberg, Hartbeespoort',
    heroHeading: 'Where Luxury Meets\\nThe Dam Views',
    heroSubheading: 'Spend a luxurious weekend in an exclusive little private lodge, situated in the Magaliesberg mountain village of Kosmos, overlooking the Hartbeespoort Dam.',
    features: [
      { _key: 'f1', icon: 'fas fa-heart', heading: 'Romantic Getaways', subtext: 'Exclusive private lodge for couples' },
      { _key: 'f2', icon: 'fas fa-star', heading: '5 Star Hospitality', subtext: 'Magaliesberg mountain village' },
      { _key: 'f3', icon: 'fas fa-coffee', heading: 'Morning Snacks', subtext: 'Complimentary snacks in every room' },
      { _key: 'f4', icon: 'fas fa-couch', heading: 'Shared Lounge', subtext: 'Comfortable communal spaces' },
      { _key: 'f5', icon: 'fas fa-compass', heading: 'Eat, Explore & Experience', subtext: "Hartbeespoort's best attractions" },
    ],
    aboutLabel: 'Our Story',
    aboutHeading: "Traveller's Choice in Hartbeespoort",
    aboutParagraphs: [
      'We have been living here in Kosmos since 2001. One day we climbed out of our garage window, onto our roof and realised that was the best view in the house! There we started to dream about Kosmos Lodge - and so began a very lengthy process of obtaining all the necessary approvals and completing the build.',
      'We decided on the "Bush Baby" theme, because Kosmos Village is known for having so many of them. In October 2015 we welcomed our first guests and have since enjoyed sharing our beautiful view and surroundings with them.',
    ],
    establishedYear: 2015,
    accordionItems: [
      { _key: 'a1', title: 'About Kosmos Lodge', body: 'Book direct and save! Kosmos Lodge is situated in Kosmos Village, a secure, boomed-off area with beautiful views over the Hartbeespoort Dam.' },
      { _key: 'a2', title: 'Luxurious Weekends', body: 'Spend a luxurious weekend in an exclusive little private lodge, situated in the Magaliesberg Mountain Village of Kosmos, overlooking the Hartbeespoort Dam. The Lodge offers beautiful, air-conditioned bedrooms with quality beds and en suite bathrooms. Each room has a TV with full bouquet DStv. Most rooms also boast a balcony overlooking the dam, with braai and splash pool downstairs.' },
      { _key: 'a3', title: '5 Star Facilities', body: 'Kosmos Lodge is a small establishment with 6 luxury rooms. Rooms 1-5 have kitchenettes with mini fridge, toaster, microwave and kettle. Room 6 is a full self-catering presidential suite. All rooms have air-con, television, and free uncapped fibre WiFi.' },
      { _key: 'a4', title: 'Adventure Awaits', body: 'Hartbeespoort is a very popular tourist destination with hiking trails, bird sanctuaries and many outdoor activities. Visit the No.1 Waterfront, Hot Air Ballooning, The Elephant Sanctuary, Harties Arial Cableway, The Lion & Safari Park and the Windmill Restaurant.' },
    ],
    roomsSectionIntro: 'Seven individually styled rooms, each offering comfort, quality and unforgettable views of the Hartbeespoort Dam.',
  });
  console.log('  ✓ homePage created');
}

async function seedRooms() {
  console.log('Seeding rooms...');
  const rooms = [
    {
      number: 1,
      name: 'Room 1',
      slug: { _type: 'slug', current: 'room-1' },
      heroLabel: 'Accommodation',
      heroHeading: 'Queen Size Bed & Dam View',
      tagline: 'Queen size bed, balcony and kitchenette with one of the best dam views.',
      leadText: 'Book direct and save! Kosmos Lodge is situated in Kosmos Village, a secure, boomed-off area with beautiful views over the Hartbeespoort Dam. Room 1 offers a private balcony with a sliding door overlooking the dam - perfect for couples seeking a romantic retreat.',
      bedType: 'Queen Size Bed - white duvet, extra blanket, 4 pillows',
      maxGuests: 2,
      viewDescription: 'Balcony with sliding door overlooking the Hartbeespoort Dam',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '2 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Dam View' },
        { _key: 'm3', icon: 'fas fa-door-open', label: 'Balcony' },
        { _key: 'm4', icon: 'fas fa-fire', label: 'Gas Fireplace' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-car', label: 'Secured Parking' },
        { _key: 'am3', icon: 'fas fa-shower', label: 'Large Shower & Marble Top Basin' },
        { _key: 'am4', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am5', icon: 'fas fa-fire', label: 'Gas Fire Place' },
        { _key: 'am6', icon: 'fas fa-door-open', label: 'Balcony with Sliding Door' },
        { _key: 'am7', icon: 'fas fa-bed', label: 'Queen Size Bed' },
        { _key: 'am8', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-wind', label: 'A/C' },
        { _key: 'ct3', icon: 'fas fa-tv', label: 'DStv' },
      ],
    },
    {
      number: 2,
      name: 'Room 2',
      slug: { _type: 'slug', current: 'room-2' },
      heroLabel: 'Accommodation',
      heroHeading: 'Queen Size Bed - Full Dam View',
      tagline: 'Queen size bed, large shower and marble basin with a beautiful dam outlook.',
      bedType: 'Queen Size Bed',
      maxGuests: 2,
      viewDescription: 'Full dam view',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '2 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Full Dam View' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-shower', label: 'Large Shower & Marble Top Basin' },
        { _key: 'am3', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am4', icon: 'fas fa-bed', label: 'Queen Size Bed' },
        { _key: 'am5', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-wind', label: 'A/C' },
        { _key: 'ct3', icon: 'fas fa-tv', label: 'DStv' },
      ],
    },
    {
      number: 3,
      name: 'Room 3',
      slug: { _type: 'slug', current: 'room-3' },
      heroLabel: 'Accommodation',
      heroHeading: 'Queen Size Bed - Full Dam View',
      tagline: 'Queen bed, aircon and gas fireplace with a stunning dam outlook.',
      bedType: 'Queen Size Bed',
      maxGuests: 2,
      viewDescription: 'Full dam view',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '2 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Full Dam View' },
        { _key: 'm3', icon: 'fas fa-fire', label: 'Gas Fireplace' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am3', icon: 'fas fa-fire', label: 'Gas Fire Place' },
        { _key: 'am4', icon: 'fas fa-bed', label: 'Queen Size Bed' },
        { _key: 'am5', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-fire', label: 'Fireplace' },
        { _key: 'ct3', icon: 'fas fa-tv', label: 'DStv' },
      ],
    },
    {
      number: 4,
      name: 'Room 4',
      slug: { _type: 'slug', current: 'room-4' },
      heroLabel: 'Accommodation',
      heroHeading: 'Double Bed - Side View',
      tagline: 'Double bed, modern fittings and a quieter side-facing outlook.',
      bedType: 'Double Bed',
      maxGuests: 2,
      viewDescription: 'Side view',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '2 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Side View' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am3', icon: 'fas fa-bed', label: 'Double Bed' },
        { _key: 'am4', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-wind', label: 'A/C' },
        { _key: 'ct3', icon: 'fas fa-tv', label: 'DStv' },
      ],
    },
    {
      number: 5,
      name: 'Room 5',
      slug: { _type: 'slug', current: 'room-5' },
      heroLabel: 'Accommodation',
      heroHeading: 'King Size Bed - Partial Dam View',
      tagline: 'King size bed, bath and shower, with a partial dam view.',
      bedType: 'King Size Bed',
      maxGuests: 2,
      viewDescription: 'Partial dam view',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '2 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Partial Dam View' },
        { _key: 'm3', icon: 'fas fa-bath', label: 'Bath' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am3', icon: 'fas fa-bath', label: 'Bath & Shower' },
        { _key: 'am4', icon: 'fas fa-bed', label: 'King Size Bed' },
        { _key: 'am5', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-wind', label: 'A/C' },
        { _key: 'ct3', icon: 'fas fa-bath', label: 'Bath' },
      ],
    },
    {
      number: 6,
      name: 'Room 6',
      slug: { _type: 'slug', current: 'room-6' },
      heroLabel: 'Accommodation',
      heroHeading: 'King Size Bed + Sleeper Couch - Full Dam View',
      tagline: 'Presidential suite with private patio, swing chair and a full dam view.',
      bedType: 'King Size Bed + Sleeper Couch',
      maxGuests: 4,
      viewDescription: 'Full dam view, private patio',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '4 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Full Dam View' },
        { _key: 'm3', icon: 'fas fa-utensils', label: 'Full Kitchen' },
        { _key: 'm4', icon: 'fas fa-couch', label: 'Private Patio' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am3', icon: 'fas fa-utensils', label: 'Full Self-Catering Kitchen' },
        { _key: 'am4', icon: 'fas fa-bed', label: 'King Size Bed' },
        { _key: 'am5', icon: 'fas fa-couch', label: 'Sleeper Couch' },
        { _key: 'am6', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
        { _key: 'am7', icon: 'fas fa-chair', label: 'Private Patio with Swing Chair' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-utensils', label: 'Kitchen' },
        { _key: 'ct3', icon: 'fas fa-couch', label: 'Patio' },
      ],
    },
    {
      number: 7,
      name: 'Room 7',
      slug: { _type: 'slug', current: 'room-7' },
      heroLabel: 'Accommodation',
      heroHeading: 'Queen Size Bed + Bunk Bed - Full Dam View',
      tagline: 'Sleeps 4 with a queen bed, bunk bed and a full dam-facing balcony.',
      bedType: 'Queen Size Bed + Bunk Bed',
      maxGuests: 4,
      viewDescription: 'Full dam view, balcony',
      metaTags: [
        { _key: 'm1', icon: 'fas fa-users', label: '4 Guests' },
        { _key: 'm2', icon: 'fas fa-mountain', label: 'Full Dam View' },
        { _key: 'm3', icon: 'fas fa-door-open', label: 'Balcony' },
      ],
      amenities: [
        { _key: 'am1', icon: 'fas fa-tv', label: 'Large Television - Full DStv Bouquet' },
        { _key: 'am2', icon: 'fas fa-wind', label: 'Air Conditioning' },
        { _key: 'am3', icon: 'fas fa-fire', label: 'Gas Fire Place' },
        { _key: 'am4', icon: 'fas fa-bed', label: 'Queen Size Bed + Bunk Bed' },
        { _key: 'am5', icon: 'fas fa-door-open', label: 'Balcony' },
        { _key: 'am6', icon: 'fas fa-wifi', label: 'Free Uncapped WiFi' },
      ],
      cardTags: [
        { _key: 'ct1', icon: 'fas fa-wifi', label: 'WiFi' },
        { _key: 'ct2', icon: 'fas fa-wind', label: 'A/C' },
        { _key: 'ct3', icon: 'fas fa-fire', label: 'Fireplace' },
      ],
    },
  ];

  for (const room of rooms) {
    await client.createOrReplace({ _type: 'room', _id: `room-${room.number}`, ...room });
    console.log(`  ✓ ${room.name} created`);
  }
}

async function seedActivities() {
  console.log('Seeding activities...');
  const activities = [
    {
      _id: 'activity-waterfront',
      name: 'No.1 Waterfront',
      slug: { _type: 'slug', current: 'waterfront' },
      heroLabel: 'No. 1 — Hartbeespoort',
      cardSummary: 'Charter a yacht and create memories that last a lifetime on the dam.',
      paragraphs: ['Memories last a lifetime. When you charter a yacht on the Hartbeespoort Dam, you create an experience you will never forget. The No.1 Waterfront is your gateway to the dam.'],
      hours: 'Monday – Sunday, 09:00 AM – 18:00 PM',
      locationAddress: 'Hartbeespoort Dam, North West',
      sidebarIcon: 'fas fa-anchor',
      order: 1,
    },
    {
      _id: 'activity-balloon',
      name: 'Hot Air Ballooning',
      slug: { _type: 'slug', current: 'balloon' },
      heroLabel: 'No. 2 — Hartbeespoort',
      cardSummary: 'Soar above the Magaliesberg and Hartbeespoort Dam at sunrise.',
      paragraphs: [
        'Enjoy an unforgettable adventure while you experience total peace and tranquillity over some of the most splendid scenery our country has to offer, with nothing to disturb the peace but the occasional hiss of the burners above you.',
        'Hot Air Ballooning creates memories, memories are forever. Watch the sun rise from a Hot Air Balloon over Hartbeespoort Dam. Your Hot Air Ballooning Experience begins just before sunrise. Hot chocolate and marshmallows, or tea and coffee is served on your arrival while the crew prepares the balloon for inflation.',
        'Flights are generally about 1 hour to 1 hour 20 minutes, depending on the winds. On a clear day your pilot will be able to point out places of interest in the Hartbeespoort area. A traditional champagne toast and cold beverages are enjoyed on landing.',
      ],
      hours: 'Monday – Sunday, 08:00 AM – 18:00 PM',
      locationAddress: 'R560 Skeerpoort, 2146',
      locationMapsUrl: 'https://www.google.com/maps?q=R560+skeerpoort+2146',
      contactPhone: '+27 (11) 705 3201',
      contactEmail: 'website@balloon.co.za',
      sidebarIcon: 'fas fa-wind',
      order: 2,
    },
    {
      _id: 'activity-sanctuary',
      name: 'Elephant Sanctuary',
      slug: { _type: 'slug', current: 'sanctuary' },
      heroLabel: 'No. 3 — Hartbeespoort',
      cardSummary: 'Walk hand-in-trunk with incredible elephants in their natural habitat.',
      paragraphs: ['The Elephant Sanctuary is unique in that it offers visitors the incredible opportunity to walk hand-in-trunk with the elephants. A life-changing encounter with these gentle giants.'],
      sidebarIcon: 'fas fa-paw',
      order: 3,
    },
    {
      _id: 'activity-cableway',
      name: 'Harties Arial Cableway',
      slug: { _type: 'slug', current: 'cableway' },
      heroLabel: 'No. 4 — Hartbeespoort',
      cardSummary: 'Panoramic views of the Magaliesberg, dam and surrounding areas.',
      paragraphs: ['The Harties Cableway offers visitors panoramic views of the beautiful Magaliesberg, Hartbeespoort Dam and surrounding areas, as well as excellent recreational and educational facilities.'],
      sidebarIcon: 'fas fa-mountain',
      order: 4,
    },
    {
      _id: 'activity-safari',
      name: 'Lion & Safari Park',
      slug: { _type: 'slug', current: 'safari' },
      heroLabel: 'No. 5 — Hartbeespoort',
      cardSummary: "600 hectares of wilderness with South Africa's most iconic animals.",
      paragraphs: ["The Lion and Safari Park is a 600 hectare wilderness reserve situated in the Hartbeespoort, Magaliesberg and Cradle of Humankind area. Get up close to South Africa's most iconic animals."],
      sidebarIcon: 'fas fa-binoculars',
      order: 5,
    },
    {
      _id: 'activity-windmill',
      name: 'Windmill Restaurant',
      slug: { _type: 'slug', current: 'windmill' },
      heroLabel: 'No. 6 — Hartbeespoort',
      cardSummary: 'Famous for their legendary brunch - the perfect mid-morning indulgence.',
      paragraphs: ['The Windmill restaurant serves a mean brunch. Most well known for their mid-morning delights. If you want to impress, take your guests here - they are guaranteed to love it.'],
      sidebarIcon: 'fas fa-utensils',
      order: 6,
    },
  ];

  for (const act of activities) {
    await client.createOrReplace({ _type: 'activity', ...act });
    console.log(`  ✓ ${act.name} created`);
  }
}

async function uploadRoomImages() {
  console.log('\nUploading room images...');
  const imageMappings = [
    { roomId: 'room-1', field: 'heroImage', localPath: 'assets/images/rooms/Room_1-IMG_5863.jpg' },
    { roomId: 'room-1', field: 'cardImage', localPath: 'assets/images/rooms/Room_1-primary.jpg' },
    { roomId: 'room-2', field: 'heroImage', localPath: 'assets/images/rooms/Room_2-primary.jpg' },
    { roomId: 'room-2', field: 'cardImage', localPath: 'assets/images/rooms/Room_2-primary.jpg' },
    { roomId: 'room-3', field: 'heroImage', localPath: 'assets/images/rooms/Room_3-primary.jpg' },
    { roomId: 'room-3', field: 'cardImage', localPath: 'assets/images/rooms/Room_3-primary.jpg' },
    { roomId: 'room-4', field: 'heroImage', localPath: 'assets/images/rooms/Room_4-primary.jpg' },
    { roomId: 'room-4', field: 'cardImage', localPath: 'assets/images/rooms/Room_4-primary.jpg' },
    { roomId: 'room-5', field: 'heroImage', localPath: 'assets/images/rooms/Room_5-primary.jpg' },
    { roomId: 'room-5', field: 'cardImage', localPath: 'assets/images/rooms/Room_5-primary.jpg' },
    { roomId: 'room-6', field: 'heroImage', localPath: 'assets/images/rooms/Room_6-primary.jpg' },
    { roomId: 'room-6', field: 'cardImage', localPath: 'assets/images/rooms/Room_6-primary.jpg' },
    { roomId: 'room-7', field: 'heroImage', localPath: 'assets/images/rooms/Room_7-primary.jpg' },
    { roomId: 'room-7', field: 'cardImage', localPath: 'assets/images/rooms/Room_7-primary.jpg' },
  ];

  for (const { roomId, field, localPath } of imageMappings) {
    const img = await uploadLocalImage(localPath);
    if (img) {
      await client.patch(roomId).set({ [field]: img }).commit();
      console.log(`  ✓ ${roomId}.${field} uploaded`);
    }
  }
}

async function main() {
  console.log('🌿 Starting Kosmos Lodge content seed...\n');
  await seedSiteSettings();
  await seedHomePage();
  await seedRooms();
  await seedActivities();
  await uploadRoomImages();
  console.log('\n✅ Seed complete! Open https://kosmoslodge.sanity.studio to review content.');
  console.log('   → Upload activity images manually via Studio > Media Library');
  console.log('   → Upload gallery images and award images via Studio > Homepage');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
