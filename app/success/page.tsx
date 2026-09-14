"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";

function Success(){
 const sp=useSearchParams(); const [msg,setMsg]=useState("결제를 확인하고 있습니다...");
 useEffect(()=>{(async()=>{
  const paymentKey=sp.get("paymentKey"); const orderId=sp.get("orderId"); const amount=Number(sp.get("amount")||0); const mock=sp.get("mock");
  if(mock){setMsg("테스트 결제가 완료됐습니다. 질문이 접수되었습니다.");return}
  const r=await fetch("/api/payments/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({paymentKey,orderId,amount})});
  const d=await r.json(); setMsg(r.ok?"결제가 완료됐습니다. 질문이 접수되었습니다.":`결제 확인 실패: ${d.message||d.error||"unknown"}`);
 })()},[sp]);
 return <div className="profile"><div className="glass success"><div style={{fontSize:54}}>✅</div><div className="name">{msg}</div><p className="muted">답변이 등록되면 입력하신 이메일로 안내하는 기능을 연결할 수 있습니다.</p></div></div>
}
export default function Page(){return <Suspense><Success/></Suspense>}
