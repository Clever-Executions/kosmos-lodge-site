import { defineType, defineField, defineArrayMember } from 'sanity';
import { HomeIcon } from '@sanity/icons';

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'features', title: 'Features Strip' },
    { name: 'about', title: 'About' },
    { name: 'gallery', title: 'Gallery & Awards' },
    { name: 'reviews', title: 'Reviews' },
  ],
  fields: [
    defineField({
      name: 'heroBadge',
      title: 'Hero Badge',
      description: 'Small badge above heading, e.g. "Magaliesberg, Hartbeespoort"',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      description: 'Use \\n for a line break. The second line can be in italics in the template.',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
      group: 'hero',
    }),
    defineField({
      name: 'features',
      title: 'Feature Cards',
      description: 'Five feature cards in the strip below the hero',
      type: 'array',
      group: 'features',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Font Awesome Class', type: 'string', description: 'e.g. fas fa-heart' }),
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'subtext', title: 'Subtext', type: 'string' }),
          ],
          preview: { select: { title: 'heading', subtitle: 'subtext' } },
        }),
      ],
    }),
    defineField({ name: 'aboutLabel', title: 'About Label', type: 'string', group: 'about' }),
    defineField({ name: 'aboutHeading', title: 'About Heading', type: 'string', group: 'about' }),
    defineField({
      name: 'aboutParagraphs',
      title: 'About Paragraphs',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'text' })],
    }),
    defineField({
      name: 'aboutMainImage',
      title: 'About Main Image',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),
    defineField({
      name: 'aboutAccentImage',
      title: 'About Accent Image',
      type: 'image',
      options: { hotspot: true },
      group: 'about',
    }),
    defineField({ name: 'establishedYear', title: 'Established Year', type: 'number', group: 'about' }),
    defineField({
      name: 'accordionItems',
      title: 'About Accordion Items',
      type: 'array',
      group: 'about',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
    defineField({
      name: 'roomsSectionIntro',
      title: 'Rooms Section Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      description: 'Images shown in the "Life at Kosmos Lodge" gallery section',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'awards',
      title: 'Award Images',
      description: 'Award/badge logos in the recognition section',
      type: 'array',
      group: 'gallery',
      of: [defineArrayMember({ type: 'image' })],
    }),

    // ── Guest Reviews / Social Proof ─────────────────────────────────
    // Headline rating + the scrolling 5-star review carousel. Every field
    // is optional: if left blank the site falls back to sensible defaults
    // (the live Google figures and a set of real guest reviews), so adding
    // these fields never blanks the section.
    defineField({
      name: 'reviewsLabel',
      title: 'Reviews Section Label',
      description: 'Small uppercase label, e.g. "Guest Reviews"',
      type: 'string',
      group: 'reviews',
    }),
    defineField({
      name: 'reviewsHeading',
      title: 'Reviews Heading',
      description: 'e.g. "Loved by Our Guests"',
      type: 'string',
      group: 'reviews',
    }),
    defineField({
      name: 'reviewsIntro',
      title: 'Reviews Intro',
      type: 'text',
      rows: 2,
      group: 'reviews',
    }),
    defineField({
      name: 'googleRating',
      title: 'Google Rating',
      description: 'Average star rating out of 5, e.g. 4.5',
      type: 'number',
      group: 'reviews',
      validation: (r) => r.min(0).max(5),
    }),
    defineField({
      name: 'googleReviewCount',
      title: 'Number of Google Reviews',
      description: 'Total review count shown next to the rating, e.g. 128',
      type: 'number',
      group: 'reviews',
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'yearsOperating',
      title: 'Years Operating',
      description: 'How many years the lodge has been welcoming guests, e.g. 11',
      type: 'number',
      group: 'reviews',
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: 'googleReviewsUrl',
      title: 'Google Reviews URL',
      description: 'Link opened when guests click the rating (the Google Maps listing).',
      type: 'url',
      group: 'reviews',
    }),
    defineField({
      name: 'reviews',
      title: 'Review Cards',
      description: 'The 5-star reviews that scroll across the carousel.',
      type: 'array',
      group: 'reviews',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Review Text', type: 'text', rows: 4, validation: (r) => r.required() }),
            defineField({ name: 'author', title: 'Reviewer Name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'context', title: 'Context', type: 'string', description: 'Optional small line under the name, e.g. "Couple · Holiday" or "Google review"' }),
            defineField({ name: 'rating', title: 'Star Rating', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5) }),
          ],
          preview: { select: { title: 'author', subtitle: 'quote' } },
        }),
      ],
    }),
  ],
});
