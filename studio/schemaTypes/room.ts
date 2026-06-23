import { defineType, defineField, defineArrayMember } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

export const room = defineType({
  name: 'room',
  title: 'Room',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'number',
      title: 'Room Number',
      type: 'number',
      validation: (r) => r.required().integer().positive(),
    }),
    defineField({
      name: 'name',
      title: 'Room Name',
      type: 'string',
      description: 'e.g. Room 1',
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
      description: 'Small label above the page heading, e.g. "Accommodation"',
      type: 'string',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero Heading',
      description: 'Main room title, e.g. "Queen Size Bed & Dam View"',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Card Tagline',
      description: 'Short description shown on the rooms listing card',
      type: 'string',
    }),
    defineField({
      name: 'leadText',
      title: 'Lead Paragraph',
      description: 'Main room description paragraph on the room detail page',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bedType',
      title: 'Bed Type',
      description: 'e.g. "Queen Size Bed - white duvet, extra blanket, 4 pillows"',
      type: 'string',
    }),
    defineField({
      name: 'maxGuests',
      title: 'Max Guests',
      type: 'number',
    }),
    defineField({
      name: 'viewDescription',
      title: 'View Description',
      description: 'e.g. "Balcony with sliding door overlooking the Hartbeespoort Dam"',
      type: 'string',
    }),
    defineField({
      name: 'metaTags',
      title: 'Meta Tags',
      description: 'Badges shown below the heading on the room detail page',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Font Awesome Class', type: 'string', description: 'e.g. fas fa-users' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      description: 'Full amenity list shown on the room detail page',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Font Awesome Class', type: 'string', description: 'e.g. fas fa-tv' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'cardTags',
      title: 'Card Tags',
      description: 'Small tags shown on the room listing card (icon + label)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Font Awesome Class', type: 'string' }),
            defineField({ name: 'label', title: 'Label', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      description: 'Background image shown in the page hero banner',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cardImage',
      title: 'Card Image',
      description: 'Image shown on the rooms listing page card',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Photo strip and lightbox gallery images',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
  ],
  orderings: [
    {
      title: 'Room Number',
      name: 'numberAsc',
      by: [{ field: 'number', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'heroHeading', media: 'cardImage' },
  },
});
