#!/usr/bin/env node
/* Seed the prospect list.
 *
 *   node tools/seed-prospects.mjs [--force]
 *
 * Every company here is real and was surfaced by a named web search, recorded
 * per row in `source`. Nothing else about them is asserted.
 *
 * `contentWeakness` is deliberately EMPTY on every seeded row. It is filled
 * only by a human during verification, with something they actually saw. The
 * `useCase` field is why content plausibly matters for that category - a
 * business-model statement, not a claim about their current content.
 *
 * No email addresses are seeded. Inventing one is worse than having none.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DB = join(root, 'data', 'prospects.json');

const SRC = {
  rest: 'WebSearch 2026-09: "best local chef-owned restaurants Las Vegas off-Strip 2026 independent"',
  coffee: 'WebSearch 2026-09: "Las Vegas coffee roasters local roasting company list 2026"',
  brew: 'WebSearch 2026-09: "Las Vegas craft brewery distillery local independent 2026 list taproom"',
  bake: 'WebSearch 2026-09: "Las Vegas local bakery artisan bread pastry shop independent 2026"',
  beauty: 'WebSearch 2026-09: "Las Vegas local skincare beauty brand med spa aesthetics studio independent 2026"',
  fit: 'WebSearch 2026-09: "Las Vegas boutique fitness studio pilates gym wellness independent local 2026"',
  food: 'WebSearch 2026-09: Las Vegas packaged food / specialty food sourcing',
  prior: 'Prior session research - search only, never verified',
};

/* tier, company, note-from-search (fact only), useCase, priority 1-3, contact, site */
const SEED = [
// ---- Restaurants: chef-owned, off-Strip. Larry's credibility is highest here.
['Restaurant','Esther\'s Kitchen','Chef-owner James Trees. Downtown Arts District. Sourdough, handmade pasta.','Menu photography, seasonal dish drops, social content. A reservation-driven room sells on images.',2,'James Trees, chef-owner','',SRC.rest],
['Restaurant','Al Solito Posto','Second restaurant from James Trees. Seasonal handmade pasta menu.','Seasonal menu changes mean recurring shoot need, not a one-off.',2,'James Trees, chef-owner','',SRC.rest],
['Restaurant','Milpa Mexican Cafe','Chef DJ Flores. Nixtamalizes and grinds his own masa in house.','A process story that is visually specific and almost never shot properly.',1,'DJ Flores, chef','',SRC.rest],
['Restaurant','Johnny C\'s Diner','Owned by Chef Johnny Church, Chopped winner. Breakfast and lunch.','Named-chef diner: menu stills plus a founder-story set.',2,'Johnny Church, chef-owner','',SRC.rest],
['Restaurant','Anima by EDO','EDO Hospitality Group, Chef Oscar Amador. Spring Valley. Mediterranean/Italian tapas.','Tapas menus are image-dense - many small plates, each needing a frame.',2,'Oscar Amador, chef','',SRC.rest],
// ---- Coffee roasters: retail bags are a shelf product. Clearest recurring need.
['Beverage','Vesta Coffee Roasters','Arts District roastery, bakery and cafes.','Retail bag on shelf competes with national packaging creative. Recurring SKU refresh.',1,'','vestacoffee.com',SRC.coffee],
['Beverage','Desert Wind Coffee Roasters','Roaster on Sahara.','Bagged retail coffee plus wholesale sell sheets.',1,'','desertwindcoffee.com',SRC.coffee],
['Beverage','Mothership Coffee Roasters','Multi-location roaster. Also powers Sunrise Coffee.','Multi-location means per-site environment frames plus one shared bag system.',1,'','',SRC.coffee],
['Beverage','Yaw Farm Coffee Roaster','Roaster on West Charleston.','Single-origin storytelling is the category\'s main differentiator and is visual.',2,'','',SRC.coffee],
['Beverage','Take It Easy Roasters','Chinatown. Specialty coffee plus Colombian food and pastries.','Two product lines - coffee and food - doubles the shoot list.',1,'','',SRC.coffee],
['Beverage','Royal Coffee Roasting','Multiple Las Vegas locations. Meal-donation mission tied to pounds roasted.','A mission that is stated but rarely shown. Cause-led brands need human frames.',2,'','',SRC.coffee],
['Beverage','Sunrise Coffee','Described as the longest-running independent coffee shop in Las Vegas.','Heritage positioning needs imagery that does not look dated.',2,'','',SRC.coffee],
['Beverage','Iwana Specialty Coffee','Las Vegas specialty roaster.','Retail bag plus cafe menu.',2,'','',SRC.coffee],
['Beverage','Cafe do Paraiso','Las Vegas specialty coffee.','Retail bag plus cafe menu.',3,'','',SRC.coffee],
['Beverage','Vileo Coffee Bar','Las Vegas coffee bar.','Menu and drink content.',3,'','',SRC.coffee],
// ---- Breweries: cans and labels are packaging. Taprooms are events.
['Beverage','Able Baker Brewing Co.','32 taps. Brews house beers for Esther\'s Kitchen and AREA15.','Can/label creative plus collab announcements. B2B collabs are content events.',1,'','',SRC.brew],
['Beverage','CraftHaus Brewery','Arts District. 24 taps. Serves kombucha, cider and cold brew alongside beer.','The non-beer line typically has no dedicated creative at all.',1,'','',SRC.brew],
['Beverage','Nevada Brew Works','Arts District. Full kitchen - pizza, burgers, wings, pretzels.','Brewery plus a real food menu: two shoot lists, one visit.',1,'','',SRC.brew],
['Beverage','HUDL Brewing Company','Downtown. 22 taps. San Diego-inspired brewpub.','Rotating taps mean rotating creative.',2,'','',SRC.brew],
['Beverage','Astronomy Aleworks','30+ craft beers on tap. Named releases.','Named releases are individual products needing individual frames.',2,'','',SRC.brew],
['Beverage','Bad Beat Brewing','Distributes in Nevada only.','In-state distribution means shelf creative has direct sell-through value.',2,'','',SRC.brew],
['Beverage','Las Vegas Distillery','Distillery in the same business park as CraftHaus.','Spirits bottles are the highest-value product photography category in beverage.',1,'','',SRC.brew],
// ---- Bakeries: the most photogenic category in food, and usually shot worst.
['Bakery','Desert Bread','Small-batch sourdough and seasonal pastries near Sunset Park. Freshly milled grains.','Seasonal pastry rotation is a recurring content calendar by default.',1,'','desertbreadlv.com',SRC.bake],
['Bakery','Great Buns Bakery','Operating since 1982. Artisan bread, bagels, rolls, pastries.','Long-established bakeries often run on very old photography.',1,'','greatbunsbakery.net',SRC.bake],
['Bakery','Pullman Bread','Japanese bakery in Las Vegas.','Japanese bakery product is visually distinctive and travels well on social.',1,'','',SRC.bake],
['Bakery','Bon Breads Baking Co','Las Vegas bakery.','Daily product, daily content need.',2,'','',SRC.bake],
['Bakery','Atelier-T55','Las Vegas artisan bakery.','Patisserie detail rewards macro work.',2,'','',SRC.bake],
['Bakery','Vegas Sourdough','Las Vegas sourdough bakery.','Crumb shots are the category\'s proof and are hard to light.',2,'','',SRC.bake],
['Bakery','The Daily Bread','Las Vegas bakery.','Daily product, daily content need.',3,'','',SRC.bake],
// ---- Beauty / med spa: highest marketing budget of any tier here.
['Beauty','Skinfuzion','Owner Kim Hutchinson, licensed advanced and laser technician. ~20 years in Las Vegas.','Treatment-room, product and practitioner frames. Heavy paid social category.',1,'Kim Hutchinson, owner','',SRC.beauty],
['Beauty','DermaBella Medical Spa','Founded 2011 by Dr. Andrea Dempsey. Membership tiers.','Membership model needs recurring creative to sell renewals.',1,'Dr. Andrea Dempsey, founder','',SRC.beauty],
['Beauty','Estetica Wellness Medical Spa','Opened March 2026 in Las Vegas.','New openings need a full asset library from zero - the single best time to sell one.',1,'','',SRC.beauty],
['Beauty','Nursie Cosmetics Aesthetics & Wellness','Las Vegas aesthetic center.','Retail skincare alongside treatments - product photography need.',2,'','',SRC.beauty],
['Beauty','Novuskin','Membership-model medical spa, Las Vegas.','Membership renewals are a recurring creative need.',2,'','',SRC.beauty],
['Beauty','Advanced Aesthetics','Las Vegas medical spa.','Treatment and facility imagery.',3,'','',SRC.beauty],
['Beauty','LaVie Advanced Aesthetics','Las Vegas med spa.','Treatment and facility imagery.',3,'','',SRC.beauty],
['Beauty','Divine Med Spa','Las Vegas med spa.','Treatment and facility imagery.',3,'','',SRC.beauty],
// ---- Fitness / wellness: real content need, thinner budgets. Second wave.
['Fitness','Ember & Frost','Boutique studio: semi-private training, Lagree, Pilates, yoga, recovery.','Class-format variety means a broad, reusable content library.',2,'','emberxfrost.com',SRC.fit],
['Fitness','Blue Chip Conditioning','Pilates-based wellness center. Private, semi-private and group.','Rehab and athlete positioning needs credible, non-stock imagery.',2,'','bluechipconditioning.com',SRC.fit],
['Fitness','The Good Place LV','Reformer studio with a boutique selling activewear and wellness products.','Retail boutique inside the studio is a product photography need.',2,'','thegoodplacelv.com',SRC.fit],
['Fitness','Grow Core Pilates','Ft Apache and W Flamingo. 4 reformers, 2 Cadillacs, no membership fees.','Small studio competing against chains on feel, which is purely visual.',3,'','',SRC.fit],
['Fitness','The Pilates Studio Las Vegas','Metreon Center. Pilates and Megaformer.','Class and facility content.',3,'','thepilatesstudiolasvegas.com',SRC.fit],
// ---- Packaged food producers
['Packaged food','Desert Moon Farms','Specialty mushroom farm, Las Vegas, founded 2020 by EvaSara Luna and Enrique Gonzalez.','Wholesale sell sheets and chef accounts. Produce is sold on appearance.',1,'EvaSara Luna and Enrique Gonzalez, founders','',SRC.food],
['Packaged food','Michael\'s Gourmet Pantry','Specialty food, Las Vegas. Chef and owner Michael Stamm since 1999.','Chef-to-chef opener. Established range, likely dated imagery.',1,'Michael Stamm, chef and owner','',SRC.food],
];

/* The 8 carried over from prior sessions. Never verified, never contacted. */
const PRIOR = [
['Packaged food','Revved Up Hot Sauce','Hot sauce. Shopify DTC plus Made in Nevada retail.','Multi-channel bottle brand: PDP hero plus retail shelf creative.',1,'','revvedupsauce.com'],
['Packaged food','Heat Junkie Foods','Two regional lines - Vegas Heat Junkie and Boulder Heat Junkie - each with its own where-to-buy page.','Two lines, two territories. Shelf creative per line plus a shared system.',1,'Steven Torti, owner','',],
['Packaged food','Distilled Spices','Chef-founded infused spice line. DTC plus Faire wholesale.','Faire line-sheet imagery. Chef-to-chef opener available.',1,'Alicia Shevetone, chef and founder','',],
['Packaged food','Saucy','Chef-founded hot sauce.','Chef-to-chef opener plus bottle hero.',2,'Chef Amy','saucythesauce.com',],
['Packaged food','Drip Sauce Co.','Sauce brand, Las Vegas DTC. Thin search footprint.','Confirm still trading before any work.',3,'Husband-and-wife founders','',],
['Packaged food','Bachi Spice Co.','Teriyaki sauce carried on the Made in Nevada marketplace.','Single SKU - show one bottle six ways.',2,'','',],
['Packaged food','Brough Ranch','Whiskey beef jerky, Nevada retail.','Jerky is shot flat by nearly every brand. Texture macro is an ownable upgrade.',2,'','',],
['Beverage','Darkshot Coffee','Reno. Own roast label plus cafes.','Only worth working if bagged coffee is a real channel, not merch.',3,'','',],
];

const rows = [];
let n = 0;
const mk = (tier, company, note, useCase, priority, contact, site, source) => ({
  id: `p${String(++n).padStart(3, '0')}`,
  company, tier, category: note, market: 'Las Vegas, NV',
  website: site || '', social: '', contact: contact || '',
  email: '', emailSource: '',
  source,
  // Why content plausibly matters for this business model. NOT a claim about
  // their current content.
  useCase,
  priority,
  // Filled by a human at verification, never by a tool.
  contentWeakness: '', observation: '', opportunity: '',
  state: 'NEW', score: null, verifiedAt: '',
  angle: '', offer: '', subject: '', channel: '',
  contactedAt: '', followupAt: '', followups: 0,
  response: '', respondedAt: '', replyText: '',
  nextAction: 'Verify - open the site and the Instagram grid',
  notes: '',
});

for (const [tier, company, note, useCase, priority, contact, site, source] of SEED)
  rows.push(mk(tier, company, note, useCase, priority, contact, site, source));
for (const [tier, company, note, useCase, priority, contact, site] of PRIOR)
  rows.push(mk(tier, company, note, useCase, priority, contact, site, SRC.prior));

if (existsSync(DB) && !process.argv.includes('--force')) {
  const cur = JSON.parse(readFileSync(DB, 'utf8'));
  const touched = cur.filter(r => r.state && r.state !== 'NEW').length;
  if (touched) {
    console.error(`${DB} has ${touched} row(s) past NEW. Refusing to overwrite. Use --force.`);
    process.exit(1);
  }
}
writeFileSync(DB, JSON.stringify(rows, null, 2) + '\n');

const by = k => rows.reduce((a, r) => (a[r[k]] = (a[r[k]] || 0) + 1, a), {});
console.log(`seeded ${rows.length} prospects`);
console.log('by tier    ', by('tier'));
console.log('by priority', by('priority'));
console.log('\nEvery row is state NEW with an empty contentWeakness.');
console.log('Nothing is claimed about any of them until a human verifies.');
