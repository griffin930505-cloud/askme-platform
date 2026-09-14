import {NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";

export async function POST(req:Request){
 try{
  const b=await req.json();
  if(!b.productId||!b.questionText||!b.buyerEmail) return NextResponse.json({error:"필수값이 없습니다."},{status:400});

  const supabase=createAdminClient();
  const {data:product,error:productError}=await supabase
   .from("products")
   .select("id,creator_id,title,price,is_active")
   .eq("id",b.productId)
   .eq("is_active",true)
   .single();

  if(productError||!product) return NextResponse.json({error:"판매 중인 상품을 찾을 수 없습니다."},{status:404});

  const orderId=`ASK-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  const expires=new Date(Date.now()+7*24*60*60*1000).toISOString();

  const {data:q,error:qerr}=await supabase.from("questions").insert({
   creator_id:product.creator_id,
   product_id:product.id,
   question_text:String(b.questionText).trim(),
   buyer_email:String(b.buyerEmail).trim().toLowerCase(),
   is_anonymous:b.anonymous!==false,
   public_answer_allowed:b.publicAnswerAllowed!==false,
   status:"PAYMENT_PENDING",
   amount:product.price,
   expires_at:expires
  }).select("id").single();

  if(qerr) return NextResponse.json({error:qerr.message},{status:500});

  const {error:perr}=await supabase.from("payments").insert({
   question_id:q.id,
   provider:"TOSS",
   order_id:orderId,
   amount:product.price,
   status:"READY"
  });

  if(perr){
   await supabase.from("questions").delete().eq("id",q.id);
   return NextResponse.json({error:perr.message},{status:500});
  }

  return NextResponse.json({orderId,amount:product.price,questionId:q.id,productTitle:product.title});
 }catch(e:any){
  return NextResponse.json({error:e?.message||"주문 생성 중 오류가 발생했습니다."},{status:500});
 }
}
