import {defineType, defineArrayMember} from 'sanity'

export default defineType({
  title: 'Contenu',
  name: 'bContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Titre H2', value: 'h2'},
        {title: 'Titre H3', value: 'h3'},
        {title: 'Titre H4', value: 'h4'},
        {title: 'Citation', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
        {title: 'Check', value: 'check'},
      ],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
          {title: 'Souligné', value: 'underline'},
          {title: 'Code', value: 'code'},
          {title: 'Surligné', value: 'highlight'},
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) => rule.required(),
              },
              {
                title: 'Ouvrir dans un nouvel onglet',
                name: 'blank',
                type: 'boolean',
                initialValue: true,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Lien interne',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{type: 'post'}, {type: 'author'}, {type: 'category'}],
              },
            ],
          },
        ],
      },
    }),
    // Autres types de contenu custom
    defineArrayMember({
      type: 'image',
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          validation: (rule) => rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Légende',
        },
      ],
    }),
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      preview: {
        select: {
          title: 'text',
        },
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          title: 'Texte',
        },
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              {title: 'Info', value: 'info'},
              {title: 'Warning', value: 'warning'},
              {title: 'Success', value: 'success'},
              {title: 'Error', value: 'error'},
            ],
          },
        },
      ],
    }),
  ],
})
