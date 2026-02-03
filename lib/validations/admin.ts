import { z } from "zod";

// ── Posts ────────────────────────────────────────────────────────

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  featuredImage: z.string().url().nullable().optional(),
  countyId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  metaTitle: z.string().max(70).nullable().optional(),
  metaDescription: z.string().max(160).nullable().optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// ── Events ───────────────────────────────────────────────────────

export const updateEventSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  location: z.string().max(200).optional(),
  countyId: z.string().uuid().optional(),
  category: z.string().max(50).optional(),
  status: z.enum(["draft", "published", "cancelled"]).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  recurring: z.string().max(100).nullable().optional(),
  externalLink: z.string().url().nullable().optional(),
  featuredImage: z.string().url().nullable().optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// ── Partners ─────────────────────────────────────────────────────

export const updatePartnerSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  description: z.string().max(2000).optional(),
  logo: z.string().url().nullable().optional(),
  website: z.string().url().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  countyId: z.string().uuid().optional(),
  category: z.string().max(50).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;

// ── Ads ──────────────────────────────────────────────────────────

export const updateAdSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url().optional(),
  placementZone: z.string().max(50).optional(),
  countyId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type UpdateAdInput = z.infer<typeof updateAdSchema>;

// ── Users ────────────────────────────────────────────────────────

export const updateUserSchema = z.object({
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  assignedCounties: z.array(z.string()).optional(),
  fullName: z.string().max(100).nullable().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ── Site Settings ────────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1).max(100),
      value: z.string(),
      description: z.string().max(500).optional(),
    })
  ),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
