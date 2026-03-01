import { z } from "zod/v4";

// ── Helpers ─────────────────────────────────────────────────────

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateForm(
  schema: z.ZodType,
  data: unknown
): { success: true } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  if (result.success) return { success: true };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}

// ── Posts ────────────────────────────────────────────────────────

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be 200 characters or less")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
  excerpt: z
    .string()
    .min(1, "Excerpt is required")
    .max(500, "Excerpt must be 500 characters or less"),
  countyId: z.string().uuid("Please select a county"),
  categoryId: z.string().uuid("Please select a category"),
  status: z.enum(["draft", "published", "archived"]),
  featuredImage: z.string().url("Must be a valid URL").nullable().optional(),
  metaTitle: z
    .string()
    .max(70, "Meta title must be 70 characters or less")
    .nullable()
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description must be 160 characters or less")
    .nullable()
    .optional(),
});

export const updatePostSchema = createPostSchema.partial().extend({
  publishedAt: z.string().datetime().nullable().optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

// ── Events ───────────────────────────────────────────────────────

const baseEventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be 200 characters or less"),
  countyId: z.string().uuid("Please select a county"),
  category: z
    .string()
    .min(1, "Please select a category")
    .max(50),
  status: z.enum(["draft", "published", "cancelled"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().nullable().optional(),
  recurring: z.string().max(100).nullable().optional(),
  externalLink: z.string().url("Must be a valid URL").nullable().optional(),
  featuredImage: z.string().url("Must be a valid URL").nullable().optional(),
});

export const createEventSchema = baseEventSchema.refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  { message: "End date must be after start date", path: ["endDate"] }
);

export const updateEventSchema = baseEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// ── Partners ─────────────────────────────────────────────────────

export const createPartnerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be 200 characters or less"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must be 200 characters or less")
    .regex(slugRegex, "Slug must be lowercase alphanumeric with hyphens"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or less"),
  logo: z.string().url("Must be a valid URL").nullable().optional(),
  website: z.string().url("Must be a valid URL").nullable().optional(),
  email: z.string().email("Must be a valid email").nullable().optional(),
  phone: z.string().max(20, "Phone must be 20 characters or less").nullable().optional(),
  address: z.string().max(300, "Address must be 300 characters or less").nullable().optional(),
  countyId: z.string().uuid("Please select a county"),
  category: z
    .string()
    .min(1, "Please select a category")
    .max(50),
  isFeatured: z.boolean(),
  status: z.enum(["active", "inactive"]),
});

export const updatePartnerSchema = createPartnerSchema.partial();

export type CreatePartnerInput = z.infer<typeof createPartnerSchema>;
export type UpdatePartnerInput = z.infer<typeof updatePartnerSchema>;

// ── Ads ──────────────────────────────────────────────────────────

const baseAdSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(200, "Business name must be 200 characters or less"),
  imageUrl: z.string().url("Ad image is required"),
  linkUrl: z.string().url("Link URL must be a valid URL"),
  placementZone: z.string().min(1, "Placement zone is required").max(50),
  countyId: z.string().uuid().nullable().optional(),
  isActive: z.boolean(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date is required"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "End date is required"),
});

export const createAdSchema = baseAdSchema.refine(
  (data) => {
    return new Date(data.endDate) >= new Date(data.startDate);
  },
  { message: "End date must be on or after start date", path: ["endDate"] }
);

export const updateAdSchema = baseAdSchema.partial();

export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;

// ── Users ────────────────────────────────────────────────────────

export const inviteUserSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    fullName: z.string().max(100).optional(),
    role: z.enum(["admin", "editor", "viewer"]),
    assignedCounties: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.role === "editor") return data.assignedCounties.length >= 1;
      return true;
    },
    {
      message: "Editors must be assigned at least one county",
      path: ["assignedCounties"],
    }
  );

export const updateUserSchema = z
  .object({
    role: z.enum(["admin", "editor", "viewer"]),
    assignedCounties: z.array(z.string()),
    fullName: z.string().max(100).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "editor") return data.assignedCounties.length >= 1;
      return true;
    },
    {
      message: "Editors must be assigned at least one county",
      path: ["assignedCounties"],
    }
  );

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// ── Newsletter ──────────────────────────────────────────────────

export const composeNewsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  html: z.string().min(1, "Newsletter content is required"),
});

export type ComposeNewsletterInput = z.infer<typeof composeNewsletterSchema>;

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
