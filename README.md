# ASKME Live Beta v3

실제 공개 베타를 위한 Next.js + Supabase + Toss Payments 스타터입니다.

## 지금 바로 확인
키가 없어도 Mock mode로 전체 질문 흐름을 확인할 수 있습니다.

```bash
npm install
npm run dev
```

http://localhost:3000/hyesung

## 실제 서비스로 전환하는 순서

### 1. Supabase
- 새 프로젝트 생성
- SQL Editor에서 `supabase/schema.sql` 실행
- Project URL / Publishable Key를 `.env.local`에 입력
- `/login`에서 크리에이터 이메일로 최초 로그인
- Authentication > Users에서 UUID 확인
- `supabase/seed_creator.sql`의 `CREATOR_USER_UUID`를 실제 UUID로 바꾸고 실행

### 2. Toss Payments
- 개발자센터에서 테스트 키 발급
- `.env.local`에 client key / secret key 입력
- 테스트 결제를 먼저 완료
- 실제 사업자 계약/심사 후 live key로 교체

### 3. 배포
- GitHub 저장소에 업로드
- Vercel에서 Import Project
- Vercel Environment Variables에 `.env.local` 항목 입력
- NEXT_PUBLIC_APP_URL을 배포 URL로 변경

### 4. 공개 베타 URL
`https://YOUR-DOMAIN/hyesung`

이 링크를 인스타/유튜브/SOOP 프로필에 걸면 됩니다.

## 현재 구현
- 가입 없는 질문자 UX
- 상품별 질문 링크
- 이메일 수집
- 익명 질문 옵션
- 주문 생성
- Toss SDK v2 결제 요청
- 서버 승인 API
- DB 금액 재검증
- Idempotency-Key
- Supabase 로그인(Magic link)
- 크리에이터 질문함
- 답변 등록
- 공개답변 데이터 구조
- 결제/질문/답변/정산 스키마
- 기본 RLS

## 공개 전에 추가 권장
- 이용약관 / 개인정보처리방침
- 환불 정책
- 답변 완료 이메일
- 신고/차단
- 자동 미답변 환불 배치
- Toss 웹훅 검증
- 정산 지급대행 및 KYC
- 관리자 어드민
- 음성/영상 Storage 업로드
