import { z } from 'zod';

export const bookIdSchema = z.string().min(1, "Book ID is required");

export const analysisTypeSchema = z.enum(['summary', 'sentiment', 'characters', 'language'], {
  errorMap: () => ({ message: "Invalid analysis type. Must be 'summary', 'sentiment', 'characters', or 'language'." }),
});

export const analyzeSchema = z.object({
  content: z.string().min(1, "Content is required").max(10000000, "Content must be 10000 characters or less"),
  analysisType: analysisTypeSchema,
});

export const searchQuerySchema = z.string().min(1, "Search query is required").max(100, "Search query must be 100 characters or less");
