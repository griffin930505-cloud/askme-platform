export const hasSupabase=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export const hasToss=Boolean(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY && process.env.TOSS_SECRET_KEY);
export const appUrl=process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
