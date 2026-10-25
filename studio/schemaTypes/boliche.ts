import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'boliche',
  title: 'Boliche',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'nombre',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Boliche', value: 'boliche' },
          { title: 'Bar', value: 'bar' },
          { title: 'Pub', value: 'pub' },
          { title: 'After', value: 'after' },
          { title: 'Disco', value: 'disco' },
        ],
        layout: 'radio',
      },
      initialValue: 'boliche',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'direccion',
      title: 'Dirección',
      type: 'string',
    }),
    defineField({
      name: 'ubicacion',
      title: 'Ubicación',
      type: 'geopoint',
    }),
    defineField({
      name: 'anioInicio',
      title: 'Año de inicio',
      description: 'Año en que abrió sus puertas.',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'anioFin',
      title: 'Año de cierre',
      description: 'Dejar vacío si sigue activo.',
      type: 'number',
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: 'cerrado',
      title: 'Cerrado',
      description:
        'Marcar manualmente como cerrado cuando no se sabe el año de cierre (anioFin vacío).',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'verificado',
      title: 'Verificado',
      description: 'Si estos datos fueron confirmados en persona.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'imagenes',
      title: 'Imágenes',
      type: 'array',
      of: [{ type: 'image' }],
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
    }),
    defineField({
      name: 'detalle',
      title: 'Detalle',
      description: 'Campo libre para sumar información en el futuro.',
      type: 'text',
      initialValue: 'Sin datos',
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'tipo',
    },
  },
});
