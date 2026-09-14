import Link from "next/link";
import {hasSupabase} from "@/lib/config";
import {createClient} from "@/lib/supabase/server";

const mock=[
 ["홍대 술집 창업, 지금도 괜찮을까요?","30,000원","3시간 전"],
 ["가맹사업 팀 구성은 어떻게 시작해야 할까요?","50,000원","8시간 전"],
 ["광고 협업 제안드립니다.","100,000원","어제"]
];

export default async function Creator(){
 let user:any=null, questions:any[]=mock.map((r,i)=>({id:String(i),question_text:r[0],amount:Number(r[1].replace(/\D/g,"")),created_at:r[2]}));
 if(hasSupabase){
  const s=await createClient(); const {data}=await s.auth.getUser(); user=data.user;
  if(user){const {data:q}=await s.from("questions").select("id,question_text,amount,created_at,status,buyer_email").eq("status","ANSWER_PENDING").order("created_at",{ascending:false}).limit(30); if(q) questions=q}
 }
 return <div><div className="row"><div><h1>Creator Center</h1><div className="muted">{user?user.email:"Mock mode · Supabase 연결 전"}</div></div><Link className="btn" href="/hyesung">내 프로필 보기</Link></div>
 <div className="grid4" style={{marginTop:20}}><div className="stat"><span className="muted">오늘 수익</span><strong>₩320K</strong></div><div className="stat"><span className="muted">이번 달</span><strong>₩4.82M</strong></div><div className="stat"><span className="muted">답변 대기</span><strong>{questions.length}</strong></div><div className="stat"><span className="muted">답변률</span><strong>96%</strong></div></div>
 <div className="section">답변 대기</div>{questions.map((q:any)=><div className="item" key={q.id}><div className="row"><b>{q.question_text}</b><span className="money">{new Intl.NumberFormat("ko-KR").format(q.amount)}원</span></div><div className="muted" style={{fontSize:12,marginTop:7}}>{q.created_at}</div><Link href={`/creator/questions/${q.id}`} className="btn block" style={{marginTop:12}}>답변하기</Link></div>)}</div>
}
