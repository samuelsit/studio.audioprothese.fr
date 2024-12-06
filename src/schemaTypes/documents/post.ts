/* eslint-disable no-useless-escape */
import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Schéma de post de blog enrichi
 * Inclut des fonctionnalités avancées pour le SEO, les catégories, les tags,
 * et une meilleure gestion du contenu multimédia
 */

export default defineType({
  name: 'post',
  title: 'Articles du Blog',
  icon: DocumentTextIcon,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Contenu',
    },
    {
      name: 'meta',
      title: 'Métadonnées',
    },
    {
      name: 'seo',
      title: 'SEO & Social',
    },
    {
      name: 'recommendations',
      title: 'Recommandations',
    },
  ],
  fields: [
    // Contenu principal
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required().min(10).max(100),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      description: "URL unique de l'article (généré automatiquement)",
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .slice(0, 96),
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      validation: (rule) => rule.max(150),
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'bContent',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      description: "Bref résumé de l'article (150-160 caractères recommandés)",
      validation: (rule) => rule.min(50).max(160),
      group: 'content',
    }),

    // Images et Médias
    defineField({
      name: 'coverImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
        metadata: ['blurhash', 'lqip', 'palette'],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: "Description de l'image pour le SEO et l'accessibilité",
          validation: (rule) => rule.required().min(10),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende',
        },
        {
          name: 'credit',
          type: 'string',
          title: 'Crédit photo',
        },
      ],
      validation: (rule) => rule.required(),
      group: 'content',
    }),

    // Métadonnées
    defineField({
      name: 'publishedAt',
      title: 'Date de publication',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'meta',
    }),
    defineField({
      name: 'updatedAt',
      title: 'Dernière mise à jour',
      type: 'datetime',
      group: 'meta',
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'reference',
      to: [{type: 'author'}],
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
      validation: (rule) => rule.required().min(1),
      group: 'meta',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'meta',
    }),

    // SEO et Partage Social
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre optimisé pour les moteurs de recherche (50-60 caractères)',
      validation: (rule) => rule.max(60),
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      description: 'Description pour les résultats de recherche (150-160 caractères)',
      validation: (rule) => rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'socialImage',
      title: 'Image pour réseaux sociaux',
      type: 'image',
      description: 'Image optimisée pour le partage (1200x630px recommandé)',
      options: {
        hotspot: true,
      },
      group: 'seo',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'URL Canonique',
      type: 'url',
      description: "URL canonique si différente de l'URL par défaut",
      group: 'seo',
    }),
    defineField({
      name: 'recommendedPosts',
      title: 'Articles recommandés',
      description: 'Sélectionnez manuellement les articles à recommander',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'post'}],
          options: {
            disableNew: true,
            filter: ({document}) => ({
              filter: '_id != $currentId',
              params: {
                currentId: document._id,
              },
            }),
          },
        },
      ],
      validation: (rule) => rule.unique().max(6),
      group: 'recommendations',
    }),
    // Tags de relation pour les recommandations automatiques
    defineField({
      name: 'relatedTopics',
      title: 'Sujets connexes',
      description: 'Tags spécifiques pour le système de recommandation',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      group: 'recommendations',
    }),

    // Paramètres de recommandation
    defineField({
      name: 'recommendationSettings',
      title: 'Paramètres de recommandation',
      type: 'object',
      group: 'recommendations',
      fields: [
        {
          name: 'priority',
          title: 'Priorité des recommandations',
          type: 'string',
          options: {
            list: [
              {title: 'Manuel uniquement', value: 'manual'},
              {title: 'Automatique uniquement', value: 'auto'},
              {title: 'Manuel puis automatique', value: 'mixed'},
            ],
            layout: 'radio',
          },
          initialValue: 'mixed',
        },
        {
          name: 'maxRecommendations',
          title: 'Nombre maximum de recommandations',
          type: 'number',
          initialValue: 3,
          validation: (rule) => rule.min(0).max(6),
        },
      ],
    }),
  ],

  orderings: [
    {
      title: 'Date de publication, du plus récent',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Titre, A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      date: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, media, authorFirstName, authorLastName, date}) {
      const subtitles = [
        authorFirstName && authorLastName && `par ${authorFirstName} ${authorLastName}`,
        date && `le ${format(parseISO(date), 'dd/MM/yyyy')}`,
      ].filter(Boolean)

      return {
        title,
        media,
        subtitle: subtitles.join(' '),
      }
    },
  },
})
