// categorize-transaction.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for smart transaction categorization.
 *
 * The flow takes a transaction description as input and uses AI to determine the most appropriate category.
 *
 * @fileOverview Defines:
 * - `categorizeTransaction`: Function to categorize a transaction.
 * - `CategorizeTransactionInput`: Input type for the categorization.
 * - `CategorizeTransactionOutput`: Output type for the categorization.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const CategorizeTransactionInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction to categorize.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  category: z.string().describe('The predicted category for the transaction.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;


export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}


const categorizeTransactionPrompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are a personal finance assistant. Your task is to categorize transactions based on their description.

  Given the following transaction description, determine the most appropriate category.
  The category should be a single word or short phrase.

  Transaction Description: {{{transactionDescription}}}

  Category:`, // Intentionally leave the category blank, so that the LLM fills it in.
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await categorizeTransactionPrompt(input);
    return output!;
  }
);
