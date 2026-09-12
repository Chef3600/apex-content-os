#!/usr/bin/env node
/* APEX CONTENT STUDIO - broad-market account seeding.
 *
 *   node tools/seed-accounts.mjs            show what would change
 *   node tools/seed-accounts.mjs --write    migrate + append
 *   node tools/seed-accounts.mjs --write --force   allow overwriting past-NEW rows
 *
 * TWO JOBS:
 *
 * 1. MIGRATE the original 52 rows onto the account schema - industry, location
 *    count, lane, growth signal. Nothing is invented: every migrated row gets
 *    locations = null, because nobody has checked.
 *
 * 2. APPEND accounts across the wider vertical set, each carrying the exact
 *    search string that produced it and, in `sourceSaid`, what the result
 *    actually stated. Where a result said "multiple locations" without a
 *    number, locations stays null. A number here means a number was published.
 *
 * WHAT THIS FILE IS NOT: research. A search result naming a company is proof
 * the company exists and nothing else. No row here claims anything about any
 * company's content, and every one lands in NEW - unsendable until a human has
 * opened the site and the grid.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreAccount, lane } from './account-score.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = process.env.APEX_DB || join(root, 'data', 'prospects.json');
const write = process.argv.includes('--write');
const force = process.argv.includes('--force');

const Q = {
  pt:   'WebSearch 2026-09: "Las Vegas physical therapy clinic group multiple locations Henderson Summerlin"',
  dent: 'WebSearch 2026-09: "Las Vegas dental group multiple locations family dentistry Henderson"',
  spa:  'WebSearch 2026-09: "Las Vegas med spa multiple locations aesthetics injectables Henderson Summerlin"',
  rest: 'WebSearch 2026-09: "Las Vegas restaurant group multiple concepts locally owned locations"',
  fit:  'WebSearch 2026-09: "Las Vegas gym fitness studio multiple locations locally owned franchise 2026"',
  auto: 'WebSearch 2026-09: "Las Vegas auto dealer group multiple dealerships family owned Nevada"',
  home: 'WebSearch 2026-09: "Las Vegas home services company HVAC plumbing multiple locations family owned Nevada"',
  chir: 'WebSearch 2026-09: "Las Vegas chiropractic wellness clinic multiple locations Henderson North Las Vegas"',
  vet:  'WebSearch 2026-09: "Las Vegas veterinary hospital group multiple locations animal hospital Nevada"',
  urg:  'WebSearch 2026-09: "Las Vegas urgent care group multiple locations locally owned Nevada clinics"',
  cof:  'WebSearch 2026-09: "Las Vegas local coffee roaster brewery multiple taprooms locations 2026"',
  re:   'WebSearch 2026-09: "Las Vegas real estate brokerage luxury team multiple offices Nevada 2026"',
  hosp: 'WebSearch 2026-09: "Nevada regional hotel casino group locally owned multiple properties non-Strip"',
  hair: 'WebSearch 2026-09: "Las Vegas salon barbershop group multiple locations locally owned Nevada 2026"',
  sig1: 'WebSearch 2026-09: "Las Vegas restaurant opening 2026 new location announced chef"',
  sig2: 'WebSearch 2026-09: "Las Vegas business expansion new location opening announcement September 2026"',
  sig3: 'WebSearch 2026-09: "Las Vegas med spa clinic opens new location 2026 expansion Henderson"',
  sig4: 'WebSearch 2026-09: "Las Vegas Weekly dining news new restaurants September 2026"',
};

/* SIGNAL-SOURCED ACCOUNTS.
 *
 * Sourced by looking for PUBLISHED BUSINESS EVENTS rather than by category.
 * These are the strongest cold rows in the database, because the reason for
 * the email belongs to them: an opening, an expansion, a new concept.
 *
 * The signal is a published fact with a source. It is NOT an observation about
 * their content, and it does not make a row sendable on its own - `msg` still
 * refuses every row with no verified observation. A signal changes what the
 * first line is ABOUT; verification is still what earns the right to send it.
 *
 * [company, industry, locations, website, contact, source, sourceSaid, notes, signal]
 */
const SIGNAL_ACCOUNTS = [
  ['El Super - North Las Vegas', 'retail', 5, '', '', Q.sig2,
    'Fifth valley store, 1601 W. Craig Road, 32,000 sq ft, opening September 2026, hiring about 120.',
    'Full-service meat, in-house bakery, pan dulce and tortillas, prepared food. A grocery retailer with a real food-production operation - unusually strong fit, plus a recruiting-content need at 120 hires.',
    'Opening a fifth Las Vegas Valley store in September 2026 and hiring about 120 people.'],
  ["Zippy's Las Vegas", 'restaurant-group', null, '', '', Q.sig2,
    'Announced two more planned Las Vegas locations.', '',
    'Announced two additional Las Vegas locations.'],
  ['Alex Prime at El Cortez', 'restaurant', 1, '', 'David Robins, Joe Swan', Q.sig1,
    'El Cortez announced an early-fall opening for a luxury New York-style steakhouse. Both chefs named.',
    'A locally owned downtown property rather than a Strip resort, which usually means the decision sits closer.',
    'Opening a new steakhouse concept in early fall 2026.'],
  ['Maiz Mama', 'restaurant', 1, '', '', Q.sig4,
    'Opened at 5045 W. Tropicana Ave. Handmade tortillas, trompo-roasted meats.',
    'New independent concept whose entire product is visually strong - tortillas, a vertical spit, birria. Among the best-fit rows in the database.',
    'Recently opened a new restaurant on W. Tropicana Ave.'],
  ["Villa's Tacos Las Vegas", 'restaurant', 1, '', '', Q.sig4,
    'Opened its first location outside Los Angeles, in the Durango Resort food court.',
    'First market outside LA. A brand at this stage usually has LA creative that does not cover the new market.',
    'Opened a first location outside Los Angeles.'],
  ["Master Kim's Wagyu House", 'restaurant-group', 2, '', '', Q.sig4,
    'An extension of local favourite Master Kim\'s Korean BBQ, opened at Palace Station.',
    'Second concept from a local operator - the point at which one visual system across both starts to matter.',
    'Opened a second concept at Palace Station.'],
  ["Finney's Crafthouse - Downtown Summerlin", 'restaurant', 1, '', '', Q.sig4,
    'Opening September 21 at Downtown Summerlin, first location outside California.',
    'A dated opening. Time-sensitive either way.',
    'Opening a first Nevada location at Downtown Summerlin on September 21.'],
  ['Estetica Wellness Medical Spa', 'medspa', 1, '', '', Q.sig3,
    'Grand opening March 2026 at 7660 W Sahara Ave; medical aesthetics and wellness.',
    'New independent med spa. Regulated - commercial production only.',
    'Opened in 2026 as a new medical aesthetics and wellness clinic.'],
  ['Ah Spa by Ageless Humans - Westin Lake Las Vegas', 'medspa', 1, '', '', Q.sig3,
    'First full-service Ageless Humans spa inside a hospitality property; formal grand opening to follow in the fall.',
    'Regulated. Buyer may be the spa brand or the resort - establish which before any message.',
    'Opening a first spa inside a hotel, with a formal grand opening in the fall.'],
  ['Cantina Contramar', 'restaurant', 1, '', 'Gabriela Camara', Q.sig1,
    'Opened at Fontainebleau in late March 2026; sibling of Contramar in Mexico City.',
    'INFERENCE, NOT FACT: creative for a Strip resort restaurant is usually handled by the resort marketing department. Verify before assuming the wedge.',
    'Opened a new Las Vegas restaurant in 2026.'],
  ['Maroon by Kwame Onwuachi', 'restaurant', 1, '', 'Kwame Onwuachi', Q.sig1,
    'Opened April 24 at Sahara Las Vegas in the former Bazaar Meat space.',
    'INFERENCE, NOT FACT: likely resort-managed creative. Verify.',
    'Opened a new Las Vegas restaurant in 2026.'],
  ["Sartiano's Italian Steakhouse", 'restaurant', 1, '', 'Scott Sartiano', Q.sig1,
    'Opened March 4 as the West Coast sibling of the Manhattan original.',
    'INFERENCE, NOT FACT: likely resort-managed creative. Verify.',
    'Opened a first West Coast location in 2026.'],
  ['In-N-Out Burger - The BLVD', 'restaurant-group', null, '', '', Q.sig2,
    'A three-story, 10,520 sq ft restaurant confirmed for The BLVD in 2026.',
    'National corporate marketing. Realistically unreachable as a first account - kept for visibility, not for pursuit.',
    'Opening a flagship Las Vegas location in 2026.'],
];

/* [company, industry, locations|null, website, contact, source, sourceSaid, notes] */
const ACCOUNTS = [
  // ---- physical therapy
  ['FYZICAL Therapy & Balance Centers - Las Vegas', 'physical-therapy', 4, 'fyzical.com', '', Q.pt, 'Clinics named in Spring Valley, East Summerlin, Sun City and Whitney Ranch.', 'National franchise; the buyer is the local operator, not corporate.'],
  ['Limitless Sports Medicine', 'physical-therapy', 3, 'limitlesssportsmedicine.com', '', Q.pt, 'Locations named in Las Vegas, Summerlin and Henderson.', ''],
  ['Smith Therapy Partners', 'physical-therapy', null, 'smiththerapypartners.com', '', Q.pt, "Locations throughout Las Vegas and Henderson - no count published.", ''],
  ['Tim Soder Physical Therapy', 'physical-therapy', 2, 'soderpt.com', '', Q.pt, "Two convenient locations - Southwest Las Vegas and Henderson.", ''],
  ['Advanced Manual Therapy', 'physical-therapy', 2, 'advancedmanualtherapy.com', '', Q.pt, 'Described as a clinic in Las Vegas and Henderson.', ''],
  // ---- dental
  ['Vegas Dental Experts', 'dental', 2, 'vegasdentalexpertsnevada.com', 'Dr. Harvey Chin', Q.dent, "Two convenient locations in Las Vegas and Henderson. Principal named.", ''],
  ['Infinity Dental', 'dental', 2, 'infinitydentallv.com', 'Dr. Douglas Sanchez', Q.dent, 'Two addresses published - W. Tropicana and E. Horizon, Henderson.', ''],
  ['Radiant Smiles Dental & Braces', 'dental', null, 'radiantsmilesnv.com', '', Q.dent, "Multiple convenient locations - no count published.", ''],
  ['The Henderson Dentist', 'dental', 2, 'thehendersondentist.com', '', Q.dent, 'Two addresses published - S Eastern Ave and Lone Mountain.', ''],
  ['Las Vegas Dental Group', 'dental', null, 'lasvegasdentalgroup.com', '', Q.dent, 'Serves LV, Henderson, North LV and Summerlin; 50+ years. No count.', ''],
  ['Columbia Dental Group', 'dental', null, 'columbiadentallv.com', '', Q.dent, 'Henderson practice named in results.', ''],
  ['P3 Dental Group', 'dental', null, 'p3dentalgroup.com', '', Q.dent, 'Named in results. Nothing further published.', ''],
  ['Dental Group of Las Vegas', 'dental', null, 'dentalgroupoflasvegas.com', '', Q.dent, 'Named in results. Nothing further published.', ''],
  // ---- med spa / aesthetics
  ['Advanced Aesthetics', 'medspa', 5, 'advancedaestheticslv.com', 'Dr. Tracy Hankins, Dr. Samuel Sohn', Q.spa, "Five locations across the Las Vegas Valley. Both surgeons named.", ''],
  ['NKDSKIN Aesthetics Lounge', 'medspa', 2, 'bestlasvegasmedspa.com', '', Q.spa, 'Henderson and Summerlin locations named.', ''],
  ['Center for Aesthetic Medicine', 'medspa', 1, 'centerforaestheticmedicine.com', 'Heather Rohrer', Q.spa, 'Summerlin. Owner-operator named as the injector.', 'Owner-operated - one decision maker.'],
  ['Beverly Hills Rejuvenation Center - Summerlin', 'medspa', null, 'bhrcenter.com', '', Q.spa, 'Summerlin location on Festival Plaza Drive.', 'Franchise; the buyer is the local owner.'],
  ['Chic la Vie Medical Spa', 'medspa', 1, 'chiclavie.com', '', Q.spa, 'West Sahara Avenue location.', ''],
  ['LuxeFactor Aesthetics', 'medspa', 1, 'luxefactorlv.com', '', Q.spa, 'Summerlin med spa.', ''],
  ['The Aesthetics Lab', 'medspa', null, 'theaestheticslabmedspa.com', '', Q.spa, 'Named in results. No count published.', ''],
  ['Medspa-LV', 'medspa', null, 'medspa-lv.com', '', Q.spa, 'Las Vegas and Summerlin named in the listing title.', ''],
  // ---- restaurant groups
  ["Slater's 50/50 Las Vegas", 'restaurant-group', null, 'slaters5050lasvegas.com', 'Andy Kao, Cindy Sun', Q.rest, 'Locally owned since 2018 with multiple LV locations. Owners named.', ''],
  ['V&E Hospitality Group', 'restaurant-group', null, 'vehospitality.com', '', Q.rest, 'Operates multiple Las Vegas restaurants.', ''],
  ['N9NE Group', 'restaurant-group', null, '', '', Q.rest, 'Owns and operates restaurants and nightclubs; founded 1992.', ''],
  ['Ark Restaurants', 'restaurant-group', 16, 'arkrestaurants.com', '', Q.rest, "16 restaurants and bars, 12 fast food concepts across several states.", 'Public company. Lane C - the wedge is one property or one campaign.'],
  // ---- fitness
  ['TruFusion', 'fitness', null, '', '', Q.fit, 'Las Vegas-based franchise founded 2013; 200+ classes a week.', ''],
  ['Crunch Fitness Las Vegas (Fit Fusion LLC)', 'fitness', 3, '', '', Q.fit, 'Three 42,000 sq ft clubs opening East Henderson, Rainbow, Green Valley; more planned 2026.', 'Fit Fusion LLC is the named local operator - that is the buyer.', 'Three new clubs opening in the Las Vegas Valley, with more announced for 2026.'],
  ['Las Vegas Athletic Clubs', 'fitness', null, '', '', Q.fit, 'Multiple locations across the valley.', ''],
  ['Life Time - Las Vegas', 'fitness', 3, '', '', Q.fit, 'Summerlin and Green Valley open; a Durango-area facility named for 2026.', 'National operator. Wedge is one club opening.', 'A new Durango-area club named for 2026.'],
  // ---- automotive
  ['Chapman Automotive Group', 'automotive', null, 'chapmanlasvegas.com', '', Q.auto, 'Family-owned in the valley since 1966; multiple dealerships.', ''],
  ['Findlay Automotive Group', 'automotive', 35, 'findlayauto.com', '', Q.auto, "35 dealerships across NV, AZ, UT, ID and WA.", 'Lane C. Entry point is one store or one campaign, never the group.'],
  ['Jerry Seiner Dealerships - Las Vegas', 'automotive', 2, 'jerryseiner.com', '', Q.auto, 'Two Las Vegas dealerships named - Mazda and Buick GMC.', ''],
  ['Boktor Motors', 'automotive', 1, 'boktors.com', '', Q.auto, 'Family-owned, E Tropicana Ave.', ''],
  ['AutoSavvy Las Vegas', 'automotive', null, 'autosavvy.com', '', Q.auto, 'Branded-title dealership, Las Vegas location.', ''],
  // ---- home services
  ['Goettl Air Conditioning & Plumbing - Las Vegas', 'home-services', null, 'goettl.com', '', Q.home, 'Serves Henderson, North LV, Summerlin, Spring Valley and more; since 1939.', ''],
  ['702 PlumbAIR Services', 'home-services', 2, '702plumbair.com', '', Q.home, 'North Las Vegas and Henderson locations published.', ''],
  ['Nevada Residential Services', 'home-services', null, 'nrs.vegas', '', Q.home, 'Family-owned HVAC and plumbing serving LV and Henderson.', ''],
  ['Super Service Cooling, Heating & Plumbing', 'home-services', null, 'mysuperservice.com', '', Q.home, 'Family-owned; serves Summerlin, Enterprise, Henderson and more.', ''],
  ['The Cooling Company', 'home-services', 1, 'thecoolingco.com', 'Wellington Santana, Joanna Santana', Q.home, 'Founded 2011, 100% family-owned. Founders named.', ''],
  ['Champion Services', 'home-services', null, 'callchampionservices.com', '', Q.home, 'HVAC and home services, Las Vegas.', ''],
  // ---- chiropractic
  ['Dickinson Chiropractic', 'chiropractic', 2, 'dickinsonchiro-nevada.com', '', Q.chir, 'Two locations published - Henderson and North Las Vegas.', ''],
  ['Las Vegas Valley Care', 'chiropractic', 2, 'lvvalleycare.com', '', Q.chir, 'Two addresses published - N. McDaniel St and St. Rose Pkwy.', ''],
  ['Fine Chiropractic Center', 'chiropractic', 3, 'finechiropractic.com', '', Q.chir, 'West Las Vegas, Henderson and Southwest Las Vegas named.', ''],
  ['The Neck and Back Clinics', 'chiropractic', null, 'theneckandbackclinics.com', '', Q.chir, 'Clinics in Nevada and Arizona; no count published.', ''],
  // ---- veterinary
  ['The Nave Veterinary Group', 'veterinary', 21, 'navegrouplv.com', '', Q.vet, "14 general practice hospitals, 2 emergency hospitals, over 21 freestanding.", 'Largest local vet group found. Lane C - wedge is one hospital or recruiting content.'],
  ['VegasPet Animal Hospital', 'veterinary', 1, 'vegaspet.vet', '', Q.vet, 'Las Vegas veterinary clinic.', ''],
  ['Las Vegas Veterinary Specialty Center', 'veterinary', null, 'lvvetspecialtyer.com', '', Q.vet, 'Tropicana-Durango specialty location named.', ''],
  // ---- urgent care
  ['A+ Urgent Care', 'urgent-care', 2, 'aplusurgentcarelasvegas.com', '', Q.urg, "\"Locally owned practice with two convenient locations\", established 2023.", ''],
  ['American Urgent Care & Infusion Centers', 'urgent-care', 4, 'urgentcareclinicslasvegas.com', '', Q.urg, 'Four locations named - Eastern, Maryland Pkwy, Rainbow, S Eastern.', ''],
  // ---- coffee / brewing
  ['Mothership Coffee Roasters', 'coffee', null, '', '', Q.cof, 'Henderson roaster with multiple locations; no count published.', ''],
  ['Royal Coffee Roasting', 'coffee', 3, '', '', Q.cof, 'Rainbow North, Rainbow and Silverado named.', ''],
  ['Las Vegas Brewing Company', 'brewery-distillery', 1, 'lvbrewco.com', '', Q.cof, 'Family-owned taproom with a renovated patio.', ''],
  // ---- real estate
  ['Huntington & Ellis', 'real-estate', null, 'huntingtonandellis.com', 'Craig Tann', Q.re, 'Independent LV brokerage, $1.44B 2025 volume; team leader named.', ''],
  ['IS LUXURY', 'real-estate', null, 'isluxury.com', 'Ivan Sher', Q.re, 'Luxury brokerage; principal named. Top-ranked agents by volume.', ''],
  ['Elite Realty', 'real-estate', 2, 'eliterealty.net', '', Q.re, "Two company-owned offices - Summerlin and Henderson. Est. 1991.", ''],
  ['Nevada Real Estate Group (LPT Realty)', 'real-estate', null, 'nevadarealestategroup.com', 'Chris Nevada', Q.re, 'Founder named; serves LV, Henderson, Summerlin, Clark County.', ''],
  ['Luxury Real Estate of Nevada', 'real-estate', null, 'luxuryrealestateofnevada.com', '', Q.re, 'Named in results.', ''],
  // ---- hospitality
  ['Circa / The D / Golden Gate', 'hospitality-hotel', 3, '', 'Derek Stevens, Greg Stevens', Q.hosp, 'Three downtown properties under locally owned ownership; owners named.', 'Lane C. Wedge is one property, one F&B outlet or one campaign.'],
  ['TLC Casino Enterprises', 'hospitality-hotel', 3, '', 'Terry Caudill', Q.hosp, "Binion's, Four Queens and Skinny Dugan's; principal named.", 'Lane C.'],
  ['Boyd Gaming - locals market', 'hospitality-hotel', 6, '', '', Q.hosp, "Operates six casinos in the locals market.", 'Enterprise. Lane C. Only realistic entry is one property or one F&B launch.'],
  // ---- salon / grooming
  ['The Gents Place - Summerlin', 'beauty', 1, 'thegentsplace.com', '', Q.hair, "Las Vegas / Summerlin upscale men's grooming location.", 'Franchise; the buyer is the local owner.'],
  ['FINO for MEN', 'beauty', 1, 'finoformen.com', '', Q.hair, 'S Rainbow Blvd barbershop.', ''],
];

/* Existing rows were seeded before the account schema existed. Map tier ->
 * industry from what was already recorded, and leave every location count
 * null, because nobody has checked a single one. */
function industryFor(r) {
  const t = (r.tier || '').toLowerCase();
  const c = ((r.category || '') + ' ' + (r.company || '')).toLowerCase();
  if (t === 'restaurant') return 'restaurant';
  if (t === 'bakery') return 'bakery';
  if (t === 'fitness') return 'fitness';
  if (t === 'packaged food') return 'packaged-food';
  if (t === 'beauty') return /med\s?spa|aesthetic|injectable|skin|laser/.test(c) ? 'medspa' : 'beauty';
  if (t === 'beverage') {
    if (/coffee|roast|espresso|cafe/.test(c)) return 'coffee';
    if (/brew|beer|distill|spirit|taproom|cider|meade?ry/.test(c)) return 'brewery-distillery';
    return 'beverage-brand';
  }
  if (t === 'warm') return 'restaurant';
  return 'packaged-food';
}

const BLANK = {
  social: '', email: '', emailSource: '', contentWeakness: '', observation: '',
  opportunity: '', state: 'NEW', score: null, verifiedAt: '', angle: '', offer: '',
  subject: '', channel: '', contactedAt: '', followupAt: '', followups: 0,
  response: '', respondedAt: '', replyText: '', nextAction: 'Verify', notes: '',
};

if (!existsSync(DB)) { console.error(`missing ${DB}`); process.exit(1); }
const db = JSON.parse(readFileSync(DB, 'utf8'));

const touched = db.filter(r => r.state !== 'NEW');
if (touched.length && !force) {
  console.log(`\n  ${touched.length} row(s) are past NEW. Migration adds fields only; it never`);
  console.log('  resets state, observations or replies. Continuing.\n');
}

// 1. migrate
let migrated = 0;
for (const r of db) {
  if (r.industry) continue;
  r.industry = industryFor(r);
  r.locations = null;
  r.locationsSource = '';
  r.signal = ''; r.signalSource = '';
  r.sourceSaid = r.sourceSaid || '';
  r.lane = lane(r);
  migrated++;
}

// 2. append
const have = new Map(db.map(r => [r.company.toLowerCase().trim(), r]));
let added = 0, enriched = 0;
let n = db.length;
for (const [company, industry, locations, website, contact, source, sourceSaid, notes, signal] of [...ACCOUNTS, ...SIGNAL_ACCOUNTS]) {
  const existing = have.get(company.toLowerCase().trim());
  if (existing) {
    // A second search that publishes a location count or a principal's name is
    // new evidence about a row we already had. Fill the blanks, touch nothing
    // a human has decided - state, observation, score and reply all stand.
    let e = 0;
    if (existing.locations == null && locations != null) {
      existing.locations = locations; existing.locationsSource = source; e++;
    }
    if (!existing.contact && contact) { existing.contact = contact; e++; }
    if (!existing.website && website) { existing.website = website; e++; }
    if (!existing.sourceSaid && sourceSaid) { existing.sourceSaid = sourceSaid; e++; }
    if (!existing.signal && signal) { existing.signal = signal; existing.signalSource = source; e++; }
    if (e) enriched++;
    continue;
  }
  n++;
  db.push({
    id: `a${String(n).padStart(3, '0')}`,
    company, tier: industry, industry,
    category: sourceSaid,
    market: 'Las Vegas, NV',
    website, contact,
    locations, locationsSource: locations != null ? source : '',
    source, sourceSaid,
    useCase: '',
    signal: signal || '', signalSource: signal ? source : '',
    priority: 3, lane: lane({ locations }),
    ...BLANK,
    notes: notes || '',
  });
  have.set(company.toLowerCase().trim(), db[db.length - 1]);
  added++;
}

// 3. score
for (const r of db) {
  const s = scoreAccount(r);
  if (s.total != null) { r.accountScore = s.total; r.priority = s.priority; r.lane = lane(r); }
}

const byInd = {};
for (const r of db) byInd[r.industry] = (byInd[r.industry] || 0) + 1;
const byLane = {}; for (const r of db) byLane[r.lane] = (byLane[r.lane] || 0) + 1;
const byP = {}; for (const r of db) byP[r.priority] = (byP[r.priority] || 0) + 1;

console.log(`\n  ${migrated} migrated onto the account schema, ${added} appended, ${enriched} enriched.`);
console.log(`  ${db.length} accounts total across ${Object.keys(byInd).length} industries.\n`);
for (const [k, v] of Object.entries(byInd).sort((a, b) => b[1] - a[1]))
  console.log(`    ${String(v).padStart(3)}  ${k}`);
console.log(`\n  Lane A ${byLane.A || 0}   Lane B ${byLane.B || 0}   Lane C ${byLane.C || 0}`);
console.log(`  P1 ${byP[1] || 0}   P2 ${byP[2] || 0}   P3 ${byP[3] || 0}   P4 ${byP[4] || 0}`);
console.log(`  ${db.filter(r => r.locations != null).length} rows carry a PUBLISHED location count.`);
console.log(`  ${db.filter(r => r.state === 'NEW').length} rows are NEW - none of them sendable.\n`);

if (write) { writeFileSync(DB, JSON.stringify(db, null, 2) + '\n'); console.log('  Written.\n'); }
else console.log('  Nothing written. Add --write.\n');
