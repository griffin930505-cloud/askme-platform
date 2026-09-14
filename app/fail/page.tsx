"use client";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
function Fail(){const sp=useSearchParams();return <div className="profile"><div className="glass success"><div style={{fontSize:50}}>⚠️</div><div className="name">결제가 완료되지 않았습니다.</div><p className="muted">{sp.get("message")||"다시 시도해주세요."}</p></div></div>}
export default function Page(){return <Suspense><Fail/></Suspense>}
