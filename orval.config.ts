import { defineConfig } from 'orval';

const transformOpenApi = (openapi: any) => {
  const str = JSON.stringify(openapi);
  const transformed = str
    // .replace(/ResponseDTO/g, '')
    // .replace(/RequestDTO/g, '')
    .replace(/DTO/g, '');
  return JSON.parse(transformed);
};

export default defineConfig({
  minicrm: {
    input: {
      target: './openapi.json',
      override: {
        transformer: transformOpenApi,
      },
    },
    output: {
      mode: 'tags-split',                      
      target: './src/api/generated/endpoints/minicrm.ts',
      schemas: './src/api/generated/model',   
      client: 'react-query',                  
      httpClient: 'axios',
      mock: true,                             
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts', 
          name: 'customInstance',
        },
        query: {
          useInfinite: true,                  
          useSuspenseQuery: true,            
          useSuspenseInfiniteQuery: true,     
        },
      },
    },
  },
  minicrmZod: {
    input: {
      target: './openapi.json',
      override: {
        transformer: transformOpenApi,
      },
    },
    output: {
      mode: 'tags-split',
      client: 'zod',                           
      target: './src/api/generated/zod/minicrm.ts',
      schemas: './src/api/generated/model',   
    },
  },
});
