"use client";
import {useState} from "react";
import {createClient} from "@/lib/supabase/client";
export default function Login(){
 const [email,setEmail]=useState(""); const [msg,setMsg]=useState("");
 async function login(){
  try{const supabase=createClient(); const {error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}/auth/callback?next=/creator`}}); if(error) throw error; setMsg("로그인 링크를 이메일로 보냈습니다.");}catch(e:any){setMsg("Supabase 키 설정 후 로그인할 수 있습니다. "+e.message)}
 }
 return <div className="profile"><h1>크리에이터 로그인</h1><div className="glass"><div className="field"><label>이메일</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="creator@example.com"/></div><button className="btn primary block" onClick={login}>이메일로 로그인 링크 받기</button>{msg&&<p className="notice">{msg}</p>}</div></div>
}
