import {NextResponse} from "next/server";
import {hasSupabase} from "@/lib/config";
import {createClient} from "@/lib/supabase/server";

export async function POST(req:Request){
 const {paymentKey,orderId,amount}=await req.json();
 const secret=process.env.TOSS_SECRET_KEY;
 if(!secret) return NextResponse.json({ok:true,mock:true});

 // IMPORTANT: production verifies amount against DB, never trusts browser amount.
 let expected=amount; let questionId:string|undefined;
 if(hasSupabase){
  const supabase=await createClient();
  const {data:p,error}=await supabase.from("payments").select("amount,question_id,status").eq("order_id",orderId).single();
  if(error||!p) return NextResponse.json({error:"order_not_found"},{status:404});
  expected=p.amount; questionId=p.question_id;
  if(Number(amount)!==Number(expected)) return NextResponse.json({error:"amount_mismatch"},{status:400});
 }
 const auth=Buffer.from(`${secret}:`).toString("base64");
 const r=await fetch("https://api.tosspayments.com/v1/payments/confirm",{method:"POST",headers:{
  Authorization:`Basic ${auth}`,"Content-Type":"application/json","Idempotency-Key":orderId
 },body:JSON.stringify({paymentKey,orderId,amount:expected})});
 const data=await r.json();
 if(!r.ok) return NextResponse.json(data,{status:r.status});

 if(hasSupabase){
  const supabase=await createClient();
  await supabase.from("payments").update({payment_key:paymentKey,status:"DONE",approved_at:new Date().toISOString()}).eq("order_id",orderId);
  if(questionId) await supabase.from("questions").update({status:"ANSWER_PENDING"}).eq("id",questionId);
 }
 return NextResponse.json({ok:true});
}
