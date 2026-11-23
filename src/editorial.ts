export const media = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;

export const freemans = [
  {
    name: 'Huey Freeman', label: 'Huey', image: 'huey.webp',
    copy: 'Huey watches Woodcrest closely. The more the neighbourhood insists that everything is fine, the more he wants to know who gets to decide what “fine” looks like.',
  },
  {
    name: 'Riley Freeman', label: 'Riley', image: 'riley.webp',
    copy: 'Riley treats Woodcrest like an audience. He wants respect and knows how to put on a show. The suburb gives him plenty of rules to test and neighbours to impress.',
  },
  {
    name: 'Robert “Granddad” Freeman', label: 'Granddad', image: 'granddad.webp',
    copy: 'Granddad came to Woodcrest for a quiet retirement. Between raising two grandsons and keeping up appearances with the neighbours, quiet is the one thing he rarely gets.',
  },
] as const;

export const neighbors = [
  {
    id: 'jazmine', name: 'Jazmine DuBois', label: 'Jazmine', image: 'jazmine-dubois.webp', alt: 'Jazmine DuBois in a white shirt with yellow stars',
    copy: 'Jazmine’s lemonade stand starts as an ordinary sidewalk business. Woodcrest’s wealthiest resident sees something bigger in it, and the show asks who gets to profit from an idea.',
  },
  {
    id: 'ruckus', name: 'Uncle Ruckus', label: 'Uncle Ruckus', image: 'uncle-ruckus.webp', alt: 'Uncle Ruckus wearing a dark suit and blue tie outdoors in Woodcrest',
    copy: 'Ruckus voices the racial prejudice that Woodcrest likes to imagine it has outgrown. The satire comes from the certainty with which he defends those ideas even when they work against him.',
  },
] as const;

const episodeGuide = 'https://www.hbomax.com/show/c43c65e7-49fe-4795-9e13-759bad094a78/s1/';

export const episodes = [
  {
    number: 1, title: 'The Garden Party',
    copy: 'Granddad wants the family to make a good impression on their new neighbours. The party turns that simple ambition into a question about who decides what counts as fitting in.',
    url: episodeGuide + 'e1-garden-party/7f263f71-4570-4ca9-a0c0-38b8fc7f5b9b',
  },
  {
    number: 14, title: 'The Block Is Hot',
    copy: 'Jazmine’s lemonade stand draws the attention of Ed Wuncler. Watch how a small business on an ordinary sidewalk becomes a story about ownership, labour, and bargaining power.',
    url: episodeGuide + 'e14-block-is-hot/ec6416b1-bd37-41d6-90c3-3abc96419d63',
  },
] as const;
