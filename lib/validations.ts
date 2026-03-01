import { z } from "zod/v4";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const newsletterTopics = ["events", "business_news"] as const;
export const newsletterFrequencies = ["weekly", "biweekly", "monthly"] as const;

export const newsletterFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  counties: z.array(z.string()).optional(),
  topics: z.array(z.enum(newsletterTopics)).optional(),
  frequency: z.enum(newsletterFrequencies).optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;

export const newsletterPreferencesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  counties: z.array(z.string()),
  topics: z.array(z.enum(newsletterTopics)),
  frequency: z.enum(newsletterFrequencies),
});

export type NewsletterPreferencesData = z.infer<typeof newsletterPreferencesSchema>;

export const partnerApplicationSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.url("Please enter a valid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  county: z.string().min(1, "Please select a county"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  additionalInfo: z.string().optional(),
});

export type PartnerApplicationData = z.infer<typeof partnerApplicationSchema>;

export const loginFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
