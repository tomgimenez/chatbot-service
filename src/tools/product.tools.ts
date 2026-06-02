import Anthropic from "@anthropic-ai/sdk";

export const tools: Anthropic.Tool[] = [
  {
    name: 'search_products',
    description: 'Busca productos en el e-commerce. Usá esta tool cuando el usuario pregunte por productos disponibles, precios, stock o categorías',
    input_schema: {
      type: 'object',
      properties: {
        q: {
          type: 'string',
          description: 'Texto para buscar en titulo o atributos del producto'
        },
        category: {
          type: 'string',
          description: 'Nombre o slug de la categoria'
        },
        minPrice: {
          type: 'number',
          description: 'Precio minimo'
        },
        maxPrice: {
          type: 'number',
          description: 'Precio maximo'
        },
        limit: {
          type: 'number',
          description: 'Cantidad de resultados, por defecto 5'
        }
      },
      required: []
    }
  },
  {
    name: 'get_product',
    description: 'Obtiene el detalle completo de un producto por su slug. Usa esta tool cuando el usuario quiera saber mas sobre un producto especifico',
    input_schema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'Slug del producto'
        }
      },
      required: ['slug']
    }
  }
];