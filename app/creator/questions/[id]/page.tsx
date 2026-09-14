"use client";
import {useParams} from "next/navigation";
import {useState} from "react";
export default function Answer(){
 const {id}=useParams<{id:string}>(); const [text,setText]=useState(""); const [msg,setMsg]=useState("");
 async function save(){const r=await fetch(`/api/creator/questions/${id}/answer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({answerText:text,isPublic:true})}); const d=await r.json(); setMsg(r.ok?"답변을 등록했습니다.":d.error||"등록 실패")}
 return <div className="profile"><h1>답변 작성</h1><div className="field"><label>답변</label><textarea value={text} onChange={e=>setText(e.target.value)} placeholder="경험과 생각을 담아 답변해주세요."/></div><button className="btn primary block" onClick={save}>답변 등록</button>{msg&&<p className="notice">{msg}</p>}</div>
}
