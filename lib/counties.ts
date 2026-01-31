export interface County {
  name: string;
  slug: string;
  seat: string;
  description: string;
  shortDescription: string;
}

export const counties: County[] = [
  {
    name: "Adams County",
    slug: "adams",
    seat: "Quincy",
    description:
      "Home to Quincy, perched on the bluffs of the Mississippi River. With over 100 local landmarks, Underground Railroad heritage, and the famous Lincoln-Douglas debate site, Adams County offers a rich tapestry of history and culture.",
    shortDescription:
      "Mississippi River bluffs, 100+ landmarks, Lincoln-Douglas debate site",
  },
  {
    name: "Pike County",
    slug: "pike",
    seat: "Pittsfield",
    description:
      "Named for explorer Zebulon Pike, this county boasts one of Illinois' most beautiful courthouses, Abraham Lincoln's Talking Houses Tour, and New Philadelphia — the first U.S. town platted by an African American.",
    shortDescription:
      "Lincoln's Talking Houses, New Philadelphia, stunning courthouse",
  },
  {
    name: "Brown County",
    slug: "brown",
    seat: "Mount Sterling",
    description:
      "A small agricultural community known nationally for white-tail deer hunting and home to the longest continuously running county fair in Illinois since 1872.",
    shortDescription:
      "Oldest county fair in Illinois, deer hunting capital",
  },
  {
    name: "Schuyler County",
    slug: "schuyler",
    seat: "Rushville",
    description:
      "One of Illinois' earliest counties, organized in 1825 and named for Founding Father-era statesman Philip Schuyler. Rushville features a striking 1882 jail museum and the historic Phoenix Opera House.",
    shortDescription:
      "Historic jail museum, Phoenix Opera House, Carnegie library",
  },
  {
    name: "Calhoun County",
    slug: "calhoun",
    seat: "Hardin",
    description:
      "A peninsula almost entirely surrounded by the Mississippi and Illinois rivers, accessible by ferry or a single bridge. Famous for peaches, bald eagle watching, and the 1847 Wittmond Hotel still serving guests today.",
    shortDescription:
      "River peninsula, eagle watching, famous peach orchards",
  },
  {
    name: "Scott County",
    slug: "scott",
    seat: "Winchester",
    description:
      "Where Stephen A. Douglas taught school and taught himself law in 1833. Home to the Winchester Burgoo Festival and the route of the 1838 Potawatomi Trail of Death.",
    shortDescription:
      "Stephen A. Douglas history, Burgoo Festival, frontier heritage",
  },
  {
    name: "Morgan County",
    slug: "morgan",
    seat: "Jacksonville",
    description:
      "A cornerstone of Illinois history with the state's first college building, the Governor Duncan Mansion, and deep Underground Railroad heritage. Home to the Big Eli Wheel — the first portable Ferris wheel, still giving free rides.",
    shortDescription:
      "Underground Railroad heritage, first IL college, Big Eli Wheel",
  },
];

export function getCountyBySlug(slug: string): County | undefined {
  return counties.find((c) => c.slug === slug);
}
