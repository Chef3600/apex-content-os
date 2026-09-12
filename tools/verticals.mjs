/* APEX CONTENT STUDIO - vertical priors.
 *
 * One table, used by the account score, the offer paths and the outreach
 * angles, so those three can never drift apart.
 *
 * IMPORTANT: every number here is a STRATEGIC PRIOR ABOUT A CATEGORY. None of
 * it is a claim about any individual company. A prior orders the queue; only
 * a human who has looked can say anything about a specific business.
 *
 *   spend       0-3  how much this category habitually spends on marketing
 *   demand      0-4  how often it needs NEW creative
 *   visual      0-4  how much of what it sells can actually be photographed
 *   recurring   0-4  how naturally a one-off becomes a monthly retainer
 *   cred        0-4  how much Larry's chef / hospitality standing carries
 *   buy         0-4  how commonly it buys production from an independent studio
 *   layers      0-2  decision layers between an outsider and a yes.
 *                    0 the owner answers, 1 a manager or marketing lead,
 *                    2 a corporate marketing department. This is what makes a
 *                    three-property casino group a harder first call than a
 *                    five-location med spa, which location count alone misses.
 *   regulated   bool claims and results are legally constrained
 */
export const VERTICALS = {
  'restaurant':           { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },
  'restaurant-group':     { spend: 3, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 1 },
  'bakery':               { spend: 1, demand: 3, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },
  'coffee':               { spend: 2, demand: 3, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },
  'brewery-distillery':   { spend: 2, demand: 3, visual: 4, recurring: 3, cred: 4, buy: 3, layers: 1 },
  'packaged-food':        { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },
  'beverage-brand':       { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },
  'hospitality-hotel':    { spend: 3, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 2, layers: 2 },
  'catering-events':      { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 4, buy: 3, layers: 0 },

  'medspa':               { spend: 3, demand: 4, visual: 4, recurring: 4, cred: 2, buy: 4, regulated: true, layers: 0 },
  'beauty':               { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 2, buy: 4, layers: 0 },
  'dental':               { spend: 3, demand: 3, visual: 2, recurring: 3, cred: 2, buy: 3, regulated: true, layers: 1 },
  'physical-therapy':     { spend: 2, demand: 3, visual: 2, recurring: 3, cred: 2, buy: 2, regulated: true, layers: 0 },
  'chiropractic':         { spend: 2, demand: 3, visual: 2, recurring: 3, cred: 2, buy: 2, regulated: true, layers: 0 },
  'veterinary':           { spend: 2, demand: 3, visual: 4, recurring: 3, cred: 2, buy: 2, regulated: true, layers: 1 },
  'urgent-care':          { spend: 2, demand: 2, visual: 1, recurring: 2, cred: 1, buy: 2, regulated: true, layers: 1 },
  'fitness':              { spend: 2, demand: 4, visual: 4, recurring: 4, cred: 3, buy: 3, layers: 1 },

  'home-services':        { spend: 3, demand: 3, visual: 2, recurring: 3, cred: 1, buy: 3, layers: 1 },
  'automotive':           { spend: 3, demand: 4, visual: 3, recurring: 4, cred: 1, buy: 3, layers: 1 },
  'real-estate':          { spend: 3, demand: 4, visual: 4, recurring: 3, cred: 2, buy: 4, layers: 0 },
  'retail':               { spend: 2, demand: 3, visual: 3, recurring: 3, cred: 2, buy: 2, layers: 1 },
  'professional-services':{ spend: 2, demand: 2, visual: 1, recurring: 2, cred: 1, buy: 2, layers: 1 },
  'entertainment':        { spend: 2, demand: 4, visual: 4, recurring: 3, cred: 3, buy: 2, layers: 2 },
  'ecommerce':            { spend: 3, demand: 4, visual: 4, recurring: 4, cred: 2, buy: 4, layers: 1 },
};

/* What Apex would actually produce for each category, and the angle that
 * earns a reply. The angle is a STARTING POINT for a human who has looked -
 * it is never a substitute for the verified observation. */
export const ANGLES = {
  'restaurant':        { work: 'Menu photography, seasonal dish drops, short-form prep video.', angle: 'A new or changed menu item with no photograph of it.' },
  'restaurant-group':  { work: 'One visual system across concepts, per-location menu shoots, campaign creative.', angle: 'Two locations whose feeds look like different companies.' },
  'bakery':            { work: 'Product photography, seasonal drops, wholesale and catering decks.', angle: 'A seasonal item announced in text with no image.' },
  'coffee':            { work: 'Bag and retail product shots, seasonal drinks, wholesale sell sheets.', angle: 'Retail bags shot on a counter under house light.' },
  'brewery-distillery':{ work: 'Bottle and can photography, release creative, taproom content.', angle: 'A new release with only a label mockup.' },
  'packaged-food':     { work: 'Packshots, in-context lifestyle, retail and Amazon-ready sets.', angle: 'Retail listing images that do not match the shelf reality.' },
  'beverage-brand':    { work: 'Can and bottle photography, flavor launches, retail POS creative.', angle: 'A new flavor with no dedicated creative.' },
  'hospitality-hotel': { work: 'Property, room, F&B and event photography; seasonal campaign creative.', angle: 'A renovated space still shown with pre-renovation photography.' },
  'catering-events':   { work: 'Event galleries, package sell sheets, proposal-ready imagery.', angle: 'A package sold with no photograph of what it looks like.' },

  'medspa':            { work: 'Facility, team and service photography, short-form education, launch creative.', angle: 'A service page with stock imagery instead of their own room and staff.' },
  'beauty':            { work: 'Product photography, application video, launch and seasonal sets.', angle: 'A product line with inconsistent shots across the site and the feed.' },
  'dental':            { work: 'Office, team and patient-experience photography, recruiting content.', angle: 'A stock photo of a model on the homepage of a real practice.' },
  'physical-therapy':  { work: 'Facility and staff photography, exercise demonstration video, location content.', angle: 'Multiple locations sharing one set of photos of one of them.' },
  'chiropractic':      { work: 'Facility and staff photography, technique demonstration, community content.', angle: 'A practice whose only images are of the building exterior.' },
  'veterinary':        { work: 'Facility, team and patient photography, service video, recruiting content.', angle: 'A hospital group with no photography of its own staff.' },
  'urgent-care':       { work: 'Facility and wayfinding photography, staff and recruiting content.', angle: 'Locations a patient cannot recognize from the website.' },
  'fitness':           { work: 'Facility, class and coach content, short-form video, campaign creative.', angle: 'A class schedule with no footage of the classes.' },

  'home-services':     { work: 'Crew, truck and job-site photography, before/after, recruiting content.', angle: 'A fleet and a crew that never appear in their own advertising.' },
  'automotive':        { work: 'Inventory and lifestyle photography, store and staff content, campaign creative.', angle: 'Lot photography shot on a phone in bad light.' },
  'real-estate':       { work: 'Agent and team brand photography, listing and neighborhood video, campaign sets.', angle: 'A luxury listing presented with non-luxury imagery.' },
  'retail':            { work: 'Product and store photography, seasonal sets, campaign creative.', angle: 'An in-store range that does not exist online in any usable image.' },
  'professional-services': { work: 'Team and office brand photography, recruiting and credibility content.', angle: 'A firm represented entirely by stock imagery.' },
  'entertainment':     { work: 'Venue, show and event photography, promo video, campaign creative.', angle: 'An event promoted with a text-only graphic.' },
  'ecommerce':         { work: 'Packshots, lifestyle, paid-social variants, seasonal refreshes.', angle: 'Paid creative that has not changed in months.' },
};

export const REGULATED = Object.entries(VERTICALS)
  .filter(([, v]) => v.regulated).map(([k]) => k);

export const industries = () => Object.keys(VERTICALS);
