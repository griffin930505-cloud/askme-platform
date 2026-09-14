"use client";
import Script from "next/script";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";

declare global { interface Window { TossPayments?: any } }

function Checkout(){
 const sp=useSearchParams(); const orderId=sp.get("orderId")||""; const amount=Number(sp.get("amount")||0); const title=sp.get("title")||"유료 질문"; const email=sp.get("email")||"";
 const [ready,setReady]=useState(false); const clientKey=process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
 const won=new Intl.NumberFormat("ko-KR").format(amount)+"원";

 async function pay(){
  if(!clientKey){ location.href=`/success?orderId=${encodeURIComponent(orderId)}&amount=${amount}&mock=1`; return; }
  const toss=window.TossPayments(clientKey);
  const widgets=toss.widgets({customerKey:"ANONYMOUS"});
  await widgets.setAmount({currency:"KRW",value:amount});
  await widgets.requestPayment({
    orderId, orderName:title, successUrl:`${location.origin}/success`, failUrl:`${location.origin}/fail`,
    customerEmail:email
  });
 }
 return <div className="profile"><Script src="https://js.tosspayments.com/v2/standard" onLoad={()=>setReady(true)}/><h1>결제</h1><div className="summary"><div className="line"><span>상품</span><b>{title}</b></div><div className="line"><span>주문번호</span><span className="muted">{orderId}</span></div><div className="line"><strong>결제금액</strong><strong style={{fontSize:25}}>{won}</strong></div></div><button className="btn primary block" onClick={pay} disabled={Boolean(clientKey)&&!ready}>{clientKey?"토스페이먼츠로 결제":"테스트 결제 완료"}</button><p className="notice">{clientKey?"실제 토스 테스트/라이브 키 설정에 따라 결제가 진행됩니다.":"현재 Toss 키가 없어 Mock 결제로 동작합니다."}</p></div>
}
export default function Page(){return <Suspense><Checkout/></Suspense>}
