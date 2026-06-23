import { defineType, defineField, defineArrayMember } from 'sanity';
import { EarthGlobeIcon } from '@sanity/icons';

export const activity = defineType({
  name: 'activity',
  title: 'Activity',
  type: 'document',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroLabel',
      title: 'Hero Label',
      description: 'e.g. "No. 2 — Hartbeespoort"',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Body Image',
      description: 'Large image shown in the body of the activity detail page',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardImage',
      title: 'Card Image',
      description: 'Image shown on the Explore listing page card',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardSummary',
      title: 'Card Summary',
      description: 'Short text shown on the Explore listing card and homepage preview',
      type: 'string',
    }),
    defineField({
      name: 'paragraphs',
      title: 'Body Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      description: 'e.g. "Monday – Sunday, 08:00 AM – 18:00 PM"',
      type: 'string',
    }),
    defineField({
      name: 'locationAddress',
      title: 'Location Address',
      type: 'string',
    }),
    defineField({
      name: 'locationMapsUrl',
      title: 'Location Google Maps URL',
      type: 'url',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'sidebarIcon',
      title: 'Sidebar Icon',
      description: 'Font Awesome class for the sidebar navigation link, e.g. fas fa-wind',
      type: 'string',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower number = shown first (1 = Waterfront, 2 = Balloon, etc.)',
      type: 'number',
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'heroLabel', media: 'heroImage' },
  },
});
