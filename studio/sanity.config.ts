import { defineConfig } from 'sanity';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

// No real Sanity project exists yet. Run `npx sanity init` (or create one at
// sanity.io/manage) to get a real projectId, then set SANITY_STUDIO_PROJECT_ID
// in a local .env file — see env.example and the root README.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'default',
  title: 'Boliches Gchú',

  projectId,
  dataset,

  plugins: [visionTool()],

  schema: {
    types: schemaTypes,
  },
});
