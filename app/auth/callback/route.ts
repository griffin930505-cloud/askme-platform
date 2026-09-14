import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
export async function GET(req:Request){
 const u=new URL(req.url); const code=u.searchParams.get("code"); const next=u.searchParams.get("next")||"/creator";
 if(code){const s=await createClient(); await s.auth.exchangeCodeForSession(code)}
 return NextResponse.redirect(new URL(next,u.origin));
}
