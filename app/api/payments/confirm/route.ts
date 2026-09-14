import {NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";

export async function POST(req:Request){
 try{
  const {paymentKey,orderId,amount}=await req.json();
  if(!paymentKey||!orderId||amount==null) return NextResponse.json({error:"invalid_request"},{status:400});

  const secret=process.env.TOSS_SECRET_KEY;
  if(!secret) return NextResponse.json({error:"payment_not_configured"},{status:503});

  const supabase=createAdminClient();
  const {data:p,error}=await supabase.from("payments").select("amount,question_id,status").eq("order_id",orderId).single();
  if(error||!p) return NextResponse.json({error:"order_not_found"},{status:404});
  if(p.status==="DONE") return NextResponse.json({ok:true,alreadyConfirmed:true});
  if(Number(amount)!==Number(p.amount)) return NextResponse.json({error:"amount_mismatch"},{status:400});

  const auth=Buffer.from(`${secret}:`).toString("base64");
  const r=await fetch("https://api.tosspayments.com/v1/payments/confirm",{method:"POST",headers:{
   Authorization:`Basic ${auth}`,"Content-Type":"application/json","Idempotency-Key":orderId
  },body:JSON.stringify({paymentKey,orderId,amount:p.amount})});
  const data=await r.json();
  if(!r.ok) return NextResponse.json(data,{status:r.status});

  const {error:updatePaymentError}=await supabase.from("payments").update({payment_key:paymentKey,status:"DONE",approved_at:new Date().toISOString()}).eq("order_id",orderId);
  if(updatePaymentError) return NextResponse.json({error:"payment_state_update_failed"},{status:500});

  const {error:updateQuestionError}=await supabase.from("questions").update({status:"ANSWER_PENDING"}).eq("id",p.question_id).eq("status","PAYMENT_PENDING");
  if(updateQuestionError) return NextResponse.json({error:"question_state_update_failed"},{status:500});

  return NextResponse.json({ok:true});
 }catch(e:any){
  return NextResponse.json({error:e?.message||"payment_confirm_failed"},{status:500});
 }
}
