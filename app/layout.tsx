import "./globals.css";
import Link from "next/link";

export const metadata={title:"ASKME",description:"경험을 답변으로, 답변을 수익으로"};

export default function Layout({children}:{children:React.ReactNode}){
  return <html lang="ko"><body><main className="container">
    <nav className="nav"><Link href="/" className="logo">ASK<span>ME</span></Link>
      <div className="navlinks"><Link className="btn" href="/hyesung">질문하기</Link><Link className="btn" href="/login">크리에이터 로그인</Link></div>
    </nav>
    {children}<footer className="footer">ASKME · 유료 질문/답변 공개 베타</footer>
  </main></body></html>
}
