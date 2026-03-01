-- Add coordinates to counties (for map/explore page)
ALTER TABLE counties ADD COLUMN IF NOT EXISTS lat double precision;
ALTER TABLE counties ADD COLUMN IF NOT EXISTS lng double precision;

-- Add featured flag to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS posts_featured_idx ON posts(is_featured) WHERE is_featured = true;

-- Seed the 7 initial counties (if table is empty)
INSERT INTO counties (name, slug, seat, description, short_description, display_order, lat, lng)
SELECT * FROM (VALUES
  ('Adams County',    'adams',    'Quincy',         'Home to Quincy, perched on the bluffs of the Mississippi River. With over 100 local landmarks, Underground Railroad heritage, and the famous Lincoln-Douglas debate site, Adams County offers a rich tapestry of history and culture.',         'Mississippi River bluffs, 100+ landmarks, Lincoln-Douglas debate site', 0, 39.9356, -91.4099),
  ('Pike County',     'pike',     'Pittsfield',     'Named for explorer Zebulon Pike, this county boasts one of Illinois'' most beautiful courthouses, Abraham Lincoln''s Talking Houses Tour, and New Philadelphia — the first U.S. town platted by an African American.', 'Lincoln''s Talking Houses, New Philadelphia, stunning courthouse',      1, 39.6086, -90.7854),
  ('Brown County',    'brown',    'Mount Sterling',  'A small agricultural community known nationally for white-tail deer hunting and home to the longest continuously running county fair in Illinois since 1872.',                                                                                    'Oldest county fair in Illinois, deer hunting capital',                  2, 39.9872, -90.7601),
  ('Schuyler County', 'schuyler', 'Rushville',       'One of Illinois'' earliest counties, organized in 1825 and named for Founding Father-era statesman Philip Schuyler. Rushville features a striking 1882 jail museum and the historic Phoenix Opera House.',                                     'Historic jail museum, Phoenix Opera House, Carnegie library',           3, 40.1211, -90.5632),
  ('Calhoun County',  'calhoun',  'Hardin',          'A peninsula almost entirely surrounded by the Mississippi and Illinois rivers, accessible by ferry or a single bridge. Famous for peaches, bald eagle watching, and the 1847 Wittmond Hotel still serving guests today.',                     'River peninsula, eagle watching, famous peach orchards',               4, 39.1137, -90.6277),
  ('Scott County',    'scott',    'Winchester',       'Where Stephen A. Douglas taught school and taught himself law in 1833. Home to the Winchester Burgoo Festival and the route of the 1838 Potawatomi Trail of Death.',                                                                          'Stephen A. Douglas history, Burgoo Festival, frontier heritage',       5, 39.6297, -90.4524),
  ('Morgan County',   'morgan',   'Jacksonville',    'A cornerstone of Illinois history with the state''s first college building, the Governor Duncan Mansion, and deep Underground Railroad heritage. Home to the Big Eli Wheel — the first portable Ferris wheel, still giving free rides.',     'Underground Railroad heritage, first IL college, Big Eli Wheel',       6, 39.7340, -90.2290)
) AS v(name, slug, seat, description, short_description, display_order, lat, lng)
WHERE NOT EXISTS (SELECT 1 FROM counties LIMIT 1);
