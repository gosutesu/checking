import * as v from 'valibot';

export const ConfigSchema = v.object({
  targetDir: v.string(),
  webhookUrl: v.string(),
});

export type Config = v.InferInput<typeof ConfigSchema>;
