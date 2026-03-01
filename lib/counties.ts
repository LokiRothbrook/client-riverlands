export interface County {
  id: string;
  name: string;
  slug: string;
  seat: string;
  description: string;
  shortDescription: string;
  heroImage: string | null;
  lat: number | null;
  lng: number | null;
  displayOrder: number;
}

// Static county data used by client components (dropdowns, filters) and as
// fallback when DB is empty. Server components should use the async functions
// from lib/counties-server.ts instead.
export const counties: County[] = [
  {
    id: "fallback-adams",
    name: "Adams County",
    slug: "adams",
    seat: "Quincy",
    description:
      "Home to Quincy, perched on the bluffs of the Mississippi River. With over 100 local landmarks, Underground Railroad heritage, and the famous Lincoln-Douglas debate site, Adams County offers a rich tapestry of history and culture.",
    shortDescription:
      "Mississippi River bluffs, 100+ landmarks, Lincoln-Douglas debate site",
    heroImage: null,
    lat: 39.9356,
    lng: -91.4099,
    displayOrder: 0,
  },
  {
    id: "fallback-pike",
    name: "Pike County",
    slug: "pike",
    seat: "Pittsfield",
    description:
      "Named for explorer Zebulon Pike, this county boasts one of Illinois' most beautiful courthouses, Abraham Lincoln's Talking Houses Tour, and New Philadelphia — the first U.S. town platted by an African American.",
    shortDescription:
      "Lincoln's Talking Houses, New Philadelphia, stunning courthouse",
    heroImage: null,
    lat: 39.6086,
    lng: -90.7854,
    displayOrder: 1,
  },
  {
    id: "fallback-brown",
    name: "Brown County",
    slug: "brown",
    seat: "Mount Sterling",
    description:
      "A small agricultural community known nationally for white-tail deer hunting and home to the longest continuously running county fair in Illinois since 1872.",
    shortDescription:
      "Oldest county fair in Illinois, deer hunting capital",
    heroImage: null,
    lat: 39.9872,
    lng: -90.7601,
    displayOrder: 2,
  },
  {
    id: "fallback-schuyler",
    name: "Schuyler County",
    slug: "schuyler",
    seat: "Rushville",
    description:
      "One of Illinois' earliest counties, organized in 1825 and named for Founding Father-era statesman Philip Schuyler. Rushville features a striking 1882 jail museum and the historic Phoenix Opera House.",
    shortDescription:
      "Historic jail museum, Phoenix Opera House, Carnegie library",
    heroImage: null,
    lat: 40.1211,
    lng: -90.5632,
    displayOrder: 3,
  },
  {
    id: "fallback-calhoun",
    name: "Calhoun County",
    slug: "calhoun",
    seat: "Hardin",
    description:
      "A peninsula almost entirely surrounded by the Mississippi and Illinois rivers, accessible by ferry or a single bridge. Famous for peaches, bald eagle watching, and the 1847 Wittmond Hotel still serving guests today.",
    shortDescription:
      "River peninsula, eagle watching, famous peach orchards",
    heroImage: null,
    lat: 39.1137,
    lng: -90.6277,
    displayOrder: 4,
  },
  {
    id: "fallback-scott",
    name: "Scott County",
    slug: "scott",
    seat: "Winchester",
    description:
      "Where Stephen A. Douglas taught school and taught himself law in 1833. Home to the Winchester Burgoo Festival and the route of the 1838 Potawatomi Trail of Death.",
    shortDescription:
      "Stephen A. Douglas history, Burgoo Festival, frontier heritage",
    heroImage: null,
    lat: 39.6297,
    lng: -90.4524,
    displayOrder: 5,
  },
  {
    id: "fallback-morgan",
    name: "Morgan County",
    slug: "morgan",
    seat: "Jacksonville",
    description:
      "A cornerstone of Illinois history with the state's first college building, the Governor Duncan Mansion, and deep Underground Railroad heritage. Home to the Big Eli Wheel — the first portable Ferris wheel, still giving free rides.",
    shortDescription:
      "Underground Railroad heritage, first IL college, Big Eli Wheel",
    heroImage: null,
    lat: 39.734,
    lng: -90.229,
    displayOrder: 6,
  },
];
