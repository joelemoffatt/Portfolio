import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		stack: z.array(z.string()),
		repo: z.union([
			z.string(),
			z.array(z.object({ label: z.string(), url: z.string() })),
		]).optional(),
		live: z.string().optional(),
		date: z.coerce.date(),
		featured: z.boolean().optional().default(false),
	}),
});

export const collections = { projects };
