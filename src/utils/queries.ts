import { defineQuery } from 'groq';

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]`
);

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "homePage"][0]`
);

export const ROOMS_QUERY = defineQuery(
  `*[_type == "room"] | order(number asc)`
);

export const ROOM_SLUGS_QUERY = defineQuery(
  `*[_type == "room" && defined(slug.current)]{ "params": { "slug": slug.current } }`
);

export const ROOM_BY_SLUG_QUERY = defineQuery(
  `*[_type == "room" && slug.current == $slug][0]`
);

export const SPECIALS_QUERY = defineQuery(
  `*[_type == "special"] | order(order asc)`
);

export const ACTIVITIES_QUERY = defineQuery(
  `*[_type == "activity"] | order(order asc)`
);

export const ACTIVITY_SLUGS_QUERY = defineQuery(
  `*[_type == "activity" && defined(slug.current)]{ "params": { "slug": slug.current } }`
);

export const ACTIVITY_BY_SLUG_QUERY = defineQuery(
  `*[_type == "activity" && slug.current == $slug][0]`
);

export const HOME_DATA_QUERY = defineQuery(`{
  "page": *[_type == "homePage"][0],
  "settings": *[_type == "siteSettings"][0],
  "rooms": *[_type == "room"] | order(number asc),
  "activities": *[_type == "activity"] | order(order asc)
}`);
