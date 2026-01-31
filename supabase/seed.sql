-- =============================================================
-- Riverlands Seed Data
-- Run this after schema.sql to populate initial data
-- =============================================================

-- Counties (in display order)
insert into counties (name, slug, seat, description, short_description, display_order) values
(
  'Adams County', 'adams', 'Quincy',
  'Home to Quincy, perched on the bluffs of the Mississippi River. With over 100 local landmarks, Underground Railroad heritage, and the famous Lincoln-Douglas debate site, Adams County offers a rich tapestry of history and culture.',
  'Mississippi River bluffs, 100+ landmarks, Lincoln-Douglas debate site',
  1
),
(
  'Pike County', 'pike', 'Pittsfield',
  'Named for explorer Zebulon Pike, this county boasts one of Illinois'' most beautiful courthouses, Abraham Lincoln''s Talking Houses Tour, and New Philadelphia — the first U.S. town platted by an African American.',
  'Lincoln''s Talking Houses, New Philadelphia, stunning courthouse',
  2
),
(
  'Brown County', 'brown', 'Mount Sterling',
  'A small agricultural community known nationally for white-tail deer hunting and home to the longest continuously running county fair in Illinois since 1872.',
  'Oldest county fair in Illinois, deer hunting capital',
  3
),
(
  'Schuyler County', 'schuyler', 'Rushville',
  'One of Illinois'' earliest counties, organized in 1825 and named for Founding Father-era statesman Philip Schuyler. Rushville features a striking 1882 jail museum and the historic Phoenix Opera House.',
  'Historic jail museum, Phoenix Opera House, Carnegie library',
  4
),
(
  'Calhoun County', 'calhoun', 'Hardin',
  'A peninsula almost entirely surrounded by the Mississippi and Illinois rivers, accessible by ferry or a single bridge. Famous for peaches, bald eagle watching, and the 1847 Wittmond Hotel still serving guests today.',
  'River peninsula, eagle watching, famous peach orchards',
  5
),
(
  'Scott County', 'scott', 'Winchester',
  'Where Stephen A. Douglas taught school and taught himself law in 1833. Home to the Winchester Burgoo Festival and the route of the 1838 Potawatomi Trail of Death.',
  'Stephen A. Douglas history, Burgoo Festival, frontier heritage',
  6
),
(
  'Morgan County', 'morgan', 'Jacksonville',
  'A cornerstone of Illinois history with the state''s first college building, the Governor Duncan Mansion, and deep Underground Railroad heritage. Home to the Big Eli Wheel — the first portable Ferris wheel, still giving free rides.',
  'Underground Railroad heritage, first IL college, Big Eli Wheel',
  7
);

-- Categories
insert into categories (name, slug, description, display_order) values
('History',     'history',     'Historical stories, landmarks, and heritage',    1),
('Events',      'events',      'Festivals, tours, and community gatherings',     2),
('Outdoors',    'outdoors',    'Nature, trails, parks, and outdoor recreation',  3),
('Attractions', 'attractions', 'Museums, landmarks, and points of interest',     4),
('Food & Drink','food-drink',  'Restaurants, wineries, orchards, and local fare', 5),
('News',        'news',        'Community news and updates',                      6),
('Culture',     'culture',     'Arts, music, theater, and cultural events',       7);

-- Site Settings (initial values — client updates these from admin panel)
insert into site_settings (key, value, description) values
('site_tagline',       'Discover the Heart of Illinois',          'Main site tagline shown in hero sections'),
('contact_email',      'info@riverlands.com',                     'Public contact email'),
('contact_phone',      '',                                        'Public contact phone number'),
('facebook_url',       '',                                        'Facebook page URL'),
('instagram_url',      '',                                        'Instagram profile URL'),
('twitter_url',        '',                                        'Twitter/X profile URL'),
('youtube_url',        '',                                        'YouTube channel URL'),
('tiktok_url',         '',                                        'TikTok profile URL'),
('footer_text',        'Discover the historic river counties of western Illinois.', 'Footer description text'),
('ad_rates_contact',   'true',                                    'Show "contact for rates" instead of specific pricing'),
('newsletter_frequency','weekly',                                  'Newsletter send frequency (weekly, biweekly, monthly)');
