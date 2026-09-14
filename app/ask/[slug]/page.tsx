"use client";
import {Suspense,useState} from "react";
import {useSearchParams,useParams,useRouter} from "next/navigation";
import {mockProducts,mockCreator} from "@/lib/mock";
const won=(n:number)=>new Intl.NumberFormat("ko-KR").format(n)+"원";

function Ask(){
 const search=useSearchParams(); const params=useParams<{slug:string}>(); const router=useRouter();
 const product=mockProducts.find(x=>x.id===search.get("product"))||mockProducts[0];
 const [question,setQuestion]=useState(""); const [email,setEmail]=useState(""); const [anonymous,setAnonymous]=useState(true); const [publicOk,setPublicOk]=useState(true); const [loading,setLoading]=useState(false);

 async function submit(){
  if(!question.trim()||!email.trim()) return alert("질문과 답변 받을 이메일을 입력해주세요.");
  setLoading(true);
  try{
   const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    creatorId:mockCreator.id, productId:product.id, questionText:question, buyerEmail:email,
    anonymous, publicAnswerAllowed:publicOk, amount:product.price, productTitle:product.title, slug:params.slug
   })});
   const data=await r.json();
   if(!r.ok) throw new Error(data.error||"주문 생성 실패");
   router.push(`/checkout?orderId=${encodeURIComponent(data.orderId)}&amount=${data.amount}&title=${encodeURIComponent(product.title)}&email=${encodeURIComponent(email)}`);
  }catch(e:any){alert(e.message)} finally{setLoading(false)}
 }
 return <div className="profile"><h1>질문 작성</h1><div className="summary"><div className="line"><span>{product.emoji} {product.title}</span><b>{won(product.price)}</b></div><div className="muted">{product.description}</div></div>
 <div className="field"><label>질문 내용</label><textarea maxLength={500} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="궁금한 내용을 구체적으로 적어주세요."/></div>
 <div className="field"><label>답변 받을 이메일</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></div>
 <div className="field"><label><input style={{width:"auto",marginRight:8}} type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)}/>크리에이터에게 익명으로 표시</label></div>
 <div className="field"><label><input style={{width:"auto",marginRight:8}} type="checkbox" checked={publicOk} onChange={e=>setPublicOk(e.target.checked)}/>답변 공개 허용</label></div>
 <button className="btn primary block" disabled={loading} onClick={submit}>{loading?"처리 중...":`${won(product.price)} 결제하러 가기`}</button><p className="notice">결제 후 답변기한 내 미답변이면 환불 정책에 따라 처리합니다.</p></div>
}
export default function Page(){return <Suspense><Ask/></Suspense>}
