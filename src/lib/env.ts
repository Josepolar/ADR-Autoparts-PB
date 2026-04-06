import { z } from "zod";

const envSchema = z.object({
  // Node
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().url(),

  // NextAuth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),

  // Email
  EMAIL_FROM: z.string().email(),
  EMAIL_SMTP_HOST: z.string(),
  EMAIL_SMTP_PORT: z.string().transform(Number),
  EMAIL_SMTP_USER: z.string(),
  EMAIL_SMTP_PASSWORD: z.string(),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Uploadthing
  UPLOADTHING_SECRET: z.string(),
  UPLOADTHING_APP_ID: z.string(),

  // AWS S3
  AWS_REGION: z.string().default("us-east-1"),
  AWS_S3_BUCKET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_SIGNED_URL_EXPIRATION: z.string().transform(Number).default("3600"),

  // Philippine Gateways
  GCASH_API_KEY: z.string().optional(),
  GCASH_SECRET: z.string().optional(),
  GCASH_MERCHANT_ID: z.string().optional(),
  MAYA_API_KEY: z.string().optional(),
  MAYA_SECRET: z.string().optional(),
  MAYA_MERCHANT_ID: z.string().optional(),

  // Public vars
  NEXT_PUBLIC_APP_NAME: z.string().default("ADR Autoparts"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("0.1.0"),
  NEXT_PUBLIC_API_URL: z.string().url(),

  // Logging
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .default("debug"),
});

export type Env = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);

export default env;
