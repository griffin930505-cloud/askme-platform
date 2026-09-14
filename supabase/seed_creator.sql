-- Run AFTER you have logged in once with your creator email.
-- Replace CREATOR_USER_UUID with the UUID shown in Supabase Authentication > Users.

insert into public.profiles(id,role,display_name)
values('CREATOR_USER_UUID','CREATOR','최혜성')
on conflict(id) do update set role='CREATOR', display_name='최혜성';

insert into public.creator_profiles(user_id,slug,bio,intro,is_verified,platform_fee_bps)
values('CREATOR_USER_UUID','hyesung','외식 프랜차이즈 · 브랜드 · 사업',
'사업, 브랜딩, 프랜차이즈 그리고 제가 직접 겪은 경험에 대해 질문해주세요.',true,1500)
on conflict(user_id) do update set slug='hyesung', is_verified=true;

insert into public.products(creator_id,title,description,product_type,price) values
('CREATOR_USER_UUID','일반 질문','텍스트로 직접 답변합니다','TEXT',10000),
('CREATOR_USER_UUID','음성 답변','음성 메시지로 답변합니다','VOICE',30000),
('CREATOR_USER_UUID','영상 답변','짧은 영상으로 답변합니다','VIDEO',50000),
('CREATOR_USER_UUID','비즈니스 문의','광고·협업·사업 제안을 받습니다','BUSINESS',100000);
