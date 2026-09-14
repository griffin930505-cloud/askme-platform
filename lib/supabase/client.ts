import {createBrowserClient} from "@supabase/ssr";
export function createClient(){
 const u=process.env.NEXT_PUBLIC_SUPABASE_URL, k=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!u||!k) throw new Error("Supabase environment variables are missing");
 return createBrowserClient(u,k);
}
