export interface Post {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  countySlug: string;
  category: string;
  date: string;
  author: string;
}

export interface Event {
  title: string;
  date: string;
  endDate?: string;
  location: string;
  countySlug: string;
  county: string;
  category: string;
  description: string;
}

export interface Partner {
  name: string;
  category: string;
  countySlug: string;
  county: string;
  description: string;
  website?: string;
  featured: boolean;
}

export const posts: Post[] = [
  {
    title: "Walking in Lincoln's Footsteps: The Talking Houses of Pittsfield",
    slug: "lincoln-talking-houses-pittsfield",
    excerpt:
      "Discover the self-guided tour that brings Abraham Lincoln's history to life through restored homes and FM radio narration.",
    content:
      "There are probably more houses associated with Abraham Lincoln in Pittsfield than any other city in the state. The city has put together a unique Talking Houses tour — a self-guided driving and walking tour where you tune your car radio to the indicated FM station at each stop and listen to a brief story of Lincoln's history at that location.\n\nLincoln had many friends in Pittsfield and spent a great deal of time here beginning in the 1830s. His law practice and political ambitions brought him back to Pike County numerous times. Nearly 550 documents of cases associated with Lincoln were found in the Pike County courthouse records.\n\nTwo of Lincoln's personal secretaries, John Hay and John George Nicolay, had Pittsfield roots, further cementing the deep connection between Lincoln and this western Illinois community.",
    countySlug: "pike",
    category: "History",
    date: "Jan 15, 2026",
    author: "Riverlands Staff",
  },
  {
    title: "Eagle Season Returns to Calhoun County",
    slug: "eagle-season-calhoun",
    excerpt:
      "The Brussels Free Ferry becomes a prime viewing spot as hundreds of bald eagles return to the river corridor this winter.",
    content:
      "Every winter, Calhoun County becomes one of the premier bald eagle watching destinations in the Midwest. The Two Rivers National Wildlife Refuge in Brussels draws eagle enthusiasts from across the region.\n\nThe Brussels Free Ferry offers a unique vantage point — the ferries help keep the river free of ice during winter, and the action of their propellers stuns fish, making them easy prey for the eagles. This natural phenomenon makes the ferry crossing one of the prime eagle watching spots in the entire region.\n\nCalhoun County, a peninsula almost entirely surrounded by the Mississippi and Illinois rivers, provides the perfect habitat for these majestic birds.",
    countySlug: "calhoun",
    category: "Outdoors",
    date: "Jan 10, 2026",
    author: "Riverlands Staff",
  },
  {
    title: "Quincy's Underground Railroad: Stories of Courage",
    slug: "quincy-underground-railroad",
    excerpt:
      "The Dr. Richard Eells House stands as a testament to the hundreds who found passage to freedom through Adams County.",
    content:
      "The Dr. Richard Eells House is the oldest standing two-story brick house in Quincy and served as a crucial stop on the Underground Railroad. In the 1840s, the house was a stopping point as escaping slaves made their way north to freedom. Dr. Eells is credited with helping several hundred slaves escape.\n\nQuincy's location on the Mississippi River made it a natural crossing point for those seeking freedom. The city's commitment to the cause of abolition earned it the name 'City of Refuge.'\n\nToday, eight self-guided tours are available in Quincy, including the City of Refuge Guide that traces the Underground Railroad history through the city's first three decades.",
    countySlug: "adams",
    category: "History",
    date: "Jan 8, 2026",
    author: "Riverlands Staff",
  },
  {
    title: "Big Eli Wheel: The World's First Portable Ferris Wheel",
    slug: "big-eli-wheel-jacksonville",
    excerpt:
      "Still giving free rides in Jacksonville, this 1900 invention was inspired by the original Chicago World's Fair Ferris wheel.",
    content:
      "Inspired by the original 1893 Chicago Ferris Wheel, W. E. Sullivan and machinist James H. Clements built the first 'Big Eli' Wheel, which debuted in Jacksonville's Central Park on May 23, 1900.\n\nThis remarkable piece of American engineering history still stands and offers free rides, operated by the Jacksonville Rotary in Community Park. It's a living piece of history that connects visitors directly to the ingenuity and spirit of turn-of-the-century Illinois.",
    countySlug: "morgan",
    category: "Attractions",
    date: "Jan 5, 2026",
    author: "Riverlands Staff",
  },
  {
    title: "Brown County Fair: 150+ Years of Illinois Tradition",
    slug: "brown-county-fair-tradition",
    excerpt:
      "The longest continuously running county fair in the state celebrates its agricultural roots and community spirit.",
    content:
      "The Brown County Fairgrounds had its origins in 1872 when a group of enterprising men bought a patch of timber on the northeast corner of Mount Sterling and organized an agricultural society. Thus began what is today the longest continuously running county fair in the State of Illinois.\n\nThe fair celebrates the agricultural heritage that has defined Brown County for over 150 years. From livestock shows to community gatherings, the Brown County Fair remains a beloved tradition that draws visitors from across the region.",
    countySlug: "brown",
    category: "Events",
    date: "Jan 3, 2026",
    author: "Riverlands Staff",
  },
  {
    title: "New Philadelphia: America's First African American-Platted Town",
    slug: "new-philadelphia-history",
    excerpt:
      "The remarkable story of 'Free' Frank McWorter, who purchased his family's freedom and founded a town in 1836.",
    content:
      "New Philadelphia was the first town in the United States to be platted and legally registered by an African American. 'Free' Frank McWorter established the town in 1836, using proceeds from the sale of town lots to purchase the freedom of his family members from slavery.\n\nThe site was added to the National Register of Historic Places in 2005 and designated a National Historic Landmark in 2008. Today, visitors can tour the New Philadelphia Town Site for free, walking the grounds where this remarkable chapter of American history unfolded.",
    countySlug: "pike",
    category: "History",
    date: "Dec 28, 2025",
    author: "Riverlands Staff",
  },
  {
    title: "Exploring the Joe Page Bridge: Engineering Marvel of Calhoun County",
    slug: "joe-page-bridge-calhoun",
    excerpt:
      "The only bridge into Calhoun County features one of the largest lift spans in the world.",
    content:
      "The Joe Page Bridge in Hardin is the only bridge access to Calhoun County, spanning the Illinois River. Its lift span, at 308 feet nine inches long, is one of the largest spans of this type in the world.\n\nBuilt in 1930 and dedicated on July 23, 1931, the bridge was rehabilitated in 2003-04. From the Hardin riverfront, visitors can watch a variety of boats and barges travel up and down the Illinois River as they pass under the drawbridge.",
    countySlug: "calhoun",
    category: "Attractions",
    date: "Dec 20, 2025",
    author: "Riverlands Staff",
  },
  {
    title: "The Governor's Mansion That Time Forgot",
    slug: "governor-duncan-mansion",
    excerpt:
      "Jacksonville's Governor Duncan Mansion served as Illinois' executive residence from 1834 to 1838.",
    content:
      "The Governor Duncan Mansion in Jacksonville served as the official executive mansion for the State of Illinois from 1834 to 1838. This preserved piece of frontier-era Illinois offers visitors a window into the earliest days of state governance.\n\nJacksonville's deep historical roots extend beyond the mansion. Illinois College's Beecher Hall, the oldest college building in the state (1830), served as both a center of learning and a stop on the Underground Railroad. It was named for Edward Beecher, brother of Harriet Beecher Stowe.",
    countySlug: "morgan",
    category: "History",
    date: "Dec 15, 2025",
    author: "Riverlands Staff",
  },
  {
    title: "Stephen A. Douglas: The Winchester Years",
    slug: "stephen-douglas-winchester",
    excerpt:
      "Before his famous debates with Lincoln, Douglas taught school in Scott County for $3 per quarter.",
    content:
      "Stephen A. Douglas moved to Winchester when he was 20 years old in 1833 to teach school. He had forty students who paid him $3 each per quarter. During his time in Scott County, Douglas taught himself the law before leaving Winchester to work as a lawyer.\n\nThis early chapter in Douglas's life laid the foundation for his political career and his eventual famous debates with Abraham Lincoln — including the sixth debate held just up the road in Quincy's Washington Park.",
    countySlug: "scott",
    category: "History",
    date: "Dec 10, 2025",
    author: "Riverlands Staff",
  },
  {
    title: "Schuyler County's Hidden Gem: The 1882 Jail Museum",
    slug: "schuyler-jail-museum",
    excerpt:
      "Rushville's striking 19th-century jail now preserves the county's rich pioneer history.",
    content:
      "The Schuyler Jail, constructed in 1882, is a striking example of 19th-century architecture and is listed on the National Register of Historic Places. Now serving as a museum, it preserves artifacts and stories from Schuyler County's pioneer days.\n\nNearby, the Rushville Post Office features a 1938 oil on canvas mural by artist Rainey Bennett titled 'Hart Fellows – Builder of Rushville,' painted as part of the Treasury Department's Depression-era arts program.",
    countySlug: "schuyler",
    category: "History",
    date: "Dec 5, 2025",
    author: "Riverlands Staff",
  },
];

export const events: Event[] = [
  {
    title: "Quincy Museum Passport Weekend",
    date: "Feb 15-16, 2026",
    location: "Quincy, IL",
    countySlug: "adams",
    county: "Adams",
    category: "Culture",
    description:
      "Buy-one-get-one-free admission to 10 of Quincy's museums with the complimentary Museum Passport.",
  },
  {
    title: "Bald Eagle Days at Two Rivers",
    date: "Feb 22, 2026",
    location: "Brussels, IL",
    countySlug: "calhoun",
    county: "Calhoun",
    category: "Outdoors",
    description:
      "Join naturalists at the Two Rivers National Wildlife Refuge for guided eagle watching along the river.",
  },
  {
    title: "Pittsfield Lincoln Heritage Walk",
    date: "Mar 7, 2026",
    location: "Pittsfield, IL",
    countySlug: "pike",
    county: "Pike",
    category: "History",
    description:
      "Guided walking tour of Abraham Lincoln-associated sites with local historians.",
  },
  {
    title: "Winchester Burgoo Festival",
    date: "Mar 14, 2026",
    location: "Winchester, IL",
    countySlug: "scott",
    county: "Scott",
    category: "Festival",
    description:
      "Annual celebration of community and food featuring the traditional burgoo stew and live entertainment.",
  },
  {
    title: "Jacksonville Underground Railroad Tour",
    date: "Apr 5, 2026",
    location: "Jacksonville, IL",
    countySlug: "morgan",
    county: "Morgan",
    category: "History",
    description:
      "Guided tour of Underground Railroad sites including Woodlawn Farm, Beecher Hall, and the Asa Talcott home.",
  },
  {
    title: "Calhoun County Peach Festival",
    date: "Aug 8-9, 2026",
    location: "Brussels, IL",
    countySlug: "calhoun",
    county: "Calhoun",
    category: "Festival",
    description:
      "Celebrate the county's famous peach harvest with fresh fruit, baked goods, and family activities.",
  },
  {
    title: "Brown County Fair",
    date: "Aug 15-20, 2026",
    location: "Mount Sterling, IL",
    countySlug: "brown",
    county: "Brown",
    category: "Fair",
    description:
      "The longest continuously running county fair in Illinois features livestock shows, entertainment, and community celebrations.",
  },
  {
    title: "Rushville Heritage Days",
    date: "Sep 12-13, 2026",
    location: "Rushville, IL",
    countySlug: "schuyler",
    county: "Schuyler",
    category: "Festival",
    description:
      "Celebrate Schuyler County's pioneer heritage with historical reenactments, music, and local crafts.",
  },
];

export const partners: Partner[] = [
  {
    name: "Wittmond Hotel & Restaurant",
    category: "Lodging & Dining",
    countySlug: "calhoun",
    county: "Calhoun County",
    description:
      "Serving guests for over five generations in the heart of Brussels, overlooking the scenic countryside. Established in 1847 as the Wittmond Trading Post.",
    website: "https://example.com",
    featured: true,
  },
  {
    name: "Heartland Lodge",
    category: "Lodging & Recreation",
    countySlug: "pike",
    county: "Pike County",
    description:
      "Premier hunting lodge and outfitter offering horseback riding, fishing, ATV trails, and UTV rentals in prime whitetail territory.",
    website: "https://example.com",
    featured: true,
  },
  {
    name: "Villa Kathrine Visitor Center",
    category: "Tourism",
    countySlug: "adams",
    county: "Adams County",
    description:
      "Mediterranean-style landmark perched on a Mississippi River bluff, housing Quincy's Tourist Information Center.",
    featured: true,
  },
  {
    name: "Golden Windmill Museum & Gift Shop",
    category: "Museum & Shopping",
    countySlug: "adams",
    county: "Adams County",
    description:
      "The only smock mill in the state with original stones and gears, dating to 1872. Museum and gift shop on site.",
    featured: true,
  },
  {
    name: "Pike County Visitors Center",
    category: "Tourism",
    countySlug: "pike",
    county: "Pike County",
    description:
      "Located in Pittsfield's community center with information about events, businesses, activities, and attractions throughout Pike County.",
    featured: false,
  },
  {
    name: "Lewis Round Barn Museum",
    category: "Museum",
    countySlug: "adams",
    county: "Adams County",
    description:
      "80-foot diameter round barn built in 1914, featuring antique farm machinery and household items from 20th-century farms.",
    featured: false,
  },
  {
    name: "Calhoun County Visitors Center",
    category: "Tourism",
    countySlug: "calhoun",
    county: "Calhoun County",
    description:
      "Free maps and information about Calhoun County including the Barn Quilt Trail, orchards, and local restaurants.",
    featured: false,
  },
  {
    name: "McCully Heritage Project",
    category: "Outdoors & Recreation",
    countySlug: "calhoun",
    county: "Calhoun County",
    description:
      "940 acres of hills and hollows offering 15 miles of hiking and horseback riding trails in stunning natural terrain.",
    featured: false,
  },
];

export function getPostsByCounty(countySlug: string): Post[] {
  return posts.filter((p) => p.countySlug === countySlug);
}

export function getEventsByCounty(countySlug: string): Event[] {
  return events.filter((e) => e.countySlug === countySlug);
}

export function getPartnersByCounty(countySlug: string): Partner[] {
  return partners.filter((p) => p.countySlug === countySlug);
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
