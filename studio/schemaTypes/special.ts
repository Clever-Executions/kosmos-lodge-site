import { defineType, defineField } from 'sanity';
import { TagIcon } from '@sanity/icons';

export const special = defineType({
  name: 'special',
  title: 'Special',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Shown as the overlay label on the card (e.g. "Exclusive offer")',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower number = shown first',
      type: 'number',
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }: { title: string; media: unknown }) {
      return { title: title ?? 'Untitled Special', media };
    },
  },
});
