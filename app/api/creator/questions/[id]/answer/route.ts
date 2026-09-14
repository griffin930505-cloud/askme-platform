import {NextResponse} from "next/server";
import {hasSupabase} from "@/lib/config";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params; const {answerText,isPublic}=await req.json();
 if(!answerText?.trim()) return NextResponse.json({error:"답변을 입력해주세요."},{status:400});
 if(!hasSupabase) return NextResponse.json({ok:true,mock:true});
 const s=await createClient(); const {data:{user}}=await s.auth.getUser();
 if(!user) return NextResponse.json({error:"login_required"},{status:401});
 const {error:aerr}=await s.from("answers").insert({question_id:id,answer_text:answerText,is_public:Boolean(isPublic)});
 if(aerr) return NextResponse.json({error:aerr.message},{status:500});
 await s.from("questions").update({status:"ANSWERED",answered_at:new Date().toISOString()}).eq("id",id).eq("creator_id",user.id);
 // Production: create settlement row / trigger email here.
 return NextResponse.json({ok:true});
}
