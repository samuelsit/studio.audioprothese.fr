import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Auteurs',
  icon: UserIcon,
  type: 'document',
  groups: [
    {
      name: 'personal',
      title: 'Informations personnelles',
    },
    {
      name: 'social',
      title: 'Réseaux sociaux',
    },
    {
      name: 'professional',
      title: 'Informations professionnelles',
    },
  ],
  fields: [
    defineField({
      name: 'firstName',
      title: 'Prénom',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'personal',
    }),
    defineField({
      name: 'lastName',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'personal',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc) => `${doc.firstName}-${doc.lastName}`,
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      group: 'personal',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          validation: (rule) => rule.required(),
        },
      ],
      group: 'personal',
    }),
    defineField({
      name: 'bio',
      title: 'Biographie',
      type: 'array',
      of: [{type: 'block'}],
      group: 'personal',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
      group: 'personal',
    }),
    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      group: 'professional',
    }),
    defineField({
      name: 'expertise',
      title: "Domaines d'expertise",
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'professional',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'object',
      group: 'social',
      fields: [
        {name: 'twitter', type: 'url', title: 'Twitter'},
        {name: 'linkedin', type: 'url', title: 'LinkedIn'},
        {name: 'github', type: 'url', title: 'GitHub'},
        {name: 'website', type: 'url', title: 'Site web'},
      ],
    }),
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'lastName',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: `${title} ${subtitle}`,
        media,
      }
    },
  },
})
