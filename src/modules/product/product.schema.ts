import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInputSchema = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGeneratedSchema = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z.object({
  ...productInputSchema,
});

const productResponseSchema = z.object({
  ...productGeneratedSchema,
  ...productInputSchema,
});

const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
  createProductSchema,
  productResponseSchema,
  productsResponseSchema,
});
