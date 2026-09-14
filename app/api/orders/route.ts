import {NextResponse} from "next/server";
import {hasSupabase} from "@/lib/config";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:Request){
 const b=await req.json();
 if(!b.creatorId||!b.productId||!b.questionText||!b.buyerEmail||!b.amount) return NextResponse.json({error:"필수값이 없습니다."},{status:400});
 const orderId=`ASK-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
 if(!hasSupabase) return NextResponse.json({orderId,amount:b.amount,mock:true});

 const supabase=await createClient();
 const expires=new Date(Date.now()+7*24*60*60*1000).toISOString();
 const {data:q,error:qerr}=await supabase.from("questions").insert({
  creator_id:b.creatorId,product_id:b.productId,question_text:b.questionText,buyer_email:b.buyerEmail,
  is_anonymous:b.anonymous,public_answer_allowed:b.publicAnswerAllowed,status:"PAYMENT_PENDING",amount:b.amount,expires_at:expires
 }).select("id").single();
 if(qerr) return NextResponse.json({error:qerr.message},{status:500});
 const {error:perr}=await supabase.from("payments").insert({question_id:q.id,provider:"TOSS",order_id:orderId,amount:b.amount,status:"READY"});
 if(perr) return NextResponse.json({error:perr.message},{status:500});
 return NextResponse.json({orderId,amount:b.amount,questionId:q.id});
}
