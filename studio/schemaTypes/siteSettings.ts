import { defineType, defineField } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'welcomeBarText',
      title: 'Welcome Bar Text',
      type: 'string',
      description: 'Text shown in the top bar across all pages',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Display format, e.g. +27 78 887 2882',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Country code + number, no spaces or +. e.g. 27788872882',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'mapsUrl',
      title: 'Google Maps URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'formspreeUrl',
      title: 'Formspree Form URL',
      description: 'The action URL for the contact form from formspree.io',
      type: 'url',
    }),
    defineField({
      name: 'rateCardText',
      title: 'Rate Card Heading',
      description: 'e.g. R1,000 - R2,700',
      type: 'string',
    }),
    defineField({
      name: 'rateCardSubtext',
      title: 'Rate Card Subtext',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright Year',
      type: 'number',
    }),
  ],
});
