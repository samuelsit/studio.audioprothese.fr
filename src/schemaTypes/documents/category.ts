import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Catégories',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icône',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'color',
      title: 'Couleur',
      type: 'string',
      description: 'Code couleur hexadécimal',
      validation: (rule) => rule.regex(/^#[0-9A-Fa-f]{6}$/),
    }),
    defineField({
      name: 'parent',
      title: 'Catégorie parente',
      type: 'reference',
      to: [{type: 'category'}],
      // Évite les références circulaires
      options: {
        filter: ({document}) => ({
          filter: '_id != $id',
          params: {id: document._id},
        }),
      },
    }),
  ],
})
