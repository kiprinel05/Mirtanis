/**
 * Centralised, high-quality imagery (Unsplash, royalty-free).
 * Using a small helper so sizing/quality stays consistent across the site.
 */
const U = 'https://images.unsplash.com/';

function img(id: string, w = 1600, q = 80): string {
  return `${U}${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const IMAGES = {
  // Hero / atmosphere
  heroLake:        img('photo-1465495976277-4387d4b0b4c6', 2000), // lakeside ceremony arch
  heroAlt:         img('photo-1519225421980-715cb0215aed', 2000), // elegant reception table
  lakeSunset:      img('photo-1470071459604-3b5ec3a7fe05', 1800), // misty lake
  lakeReflect:     img('photo-1483982258113-b72862e6cff6', 1600), // calm water

  // Story / about
  storyTable:      img('photo-1478146896981-b80fe463b330', 1400), // floral table setting
  storyCouple:     img('photo-1583939003579-730e3918a45a', 1400), // couple by lake
  storyDetails:    img('photo-1511285560929-80b456fea0bc', 1200), // bridal bouquet

  // Venues
  tentExterior:    img('photo-1464366400600-7168b8af9bc3', 1600), // tent + string lights
  tentInterior:    img('photo-1519167758481-83f550bb49b3', 1600), // elegant hall interior
  hallInterior:    img('photo-1505236858219-8359eb29e329', 1600), // ballroom
  ceremonyChairs:  img('photo-1507504031003-b417219a0fde', 1600), // outdoor ceremony chairs

  // Experience / lake section
  stringLights:    img('photo-1492684223066-81342ee5ff30', 1800), // night string lights
  champagne:       img('photo-1530103862676-de8c9debad1d', 1400), // champagne toast
  candles:         img('photo-1522413452208-996ff3f3e740', 1400), // soft candles (baptism mood)

  // Gallery fallback set (used when API has no images yet)
  gallery: [
    img('photo-1519225421980-715cb0215aed', 1100),
    img('photo-1511285560929-80b456fea0bc', 1100),
    img('photo-1464366400600-7168b8af9bc3', 1100),
    img('photo-1478146896981-b80fe463b330', 1100),
    img('photo-1465495976277-4387d4b0b4c6', 1100),
    img('photo-1519167758481-83f550bb49b3', 1100),
    img('photo-1530103862676-de8c9debad1d', 1100),
    img('photo-1507504031003-b417219a0fde', 1100),
    img('photo-1492684223066-81342ee5ff30', 1100),
    img('photo-1522413452208-996ff3f3e740', 1100),
    img('photo-1505236858219-8359eb29e329', 1100),
    img('photo-1583939003579-730e3918a45a', 1100)
  ]
};
