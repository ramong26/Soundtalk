# 🎵 Soundtalk (Spotify 기반 음악 플랫폼)

Next.js, TypeScript, MongoDB, Redis, GPT-4o API 등을 활용해  
음악 정보 조회, 인터뷰, 댓글 기능을 제공하는 음악 웹 애플리케이션입니다.  

## 🚀 주요 기능

- **트랙/앨범 상세 페이지**
  - Spotify API 기반 음악 정보 조회
  - Redis 캐싱으로 응답 속도 개선 (600ms → 120ms, **약 80% 성능 향상**)
- **GPT-4o 기반 앨범 정보 추출**
  - 상품명·설명을 기반으로 아티스트/앨범명 자동 추출
  - 반복적인 수작업 데이터 정제 제거
  - 샘플 검증 결과 **정확도 92% (23/25)** 달성
- **YouTube API 최적화**
  - MongoDB를 1차 데이터 소스로 활용하여 API 호출 60% 감소
  - 할당량 초과 문제 해결
- **댓글 및 인증 시스템**
  - Next.js API Routes + MongoDB
  - JWT 인증 & bcrypt 해싱 처리 → 보안 강화
- **SEO 최적화**
  - CSR 대신 SSR 구조 설계 → Lighthouse SEO 점수 **100점 달성**

---

## 🛠 기술 스택

- **Frontend**: Next.js (App Router), TypeScript, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, MongoDB, Redis, JWT
- **Infra/Tooling**: Docker, Vercel, GitHub Actions
- **AI/External API**: OpenAI GPT-4o, Spotify API, YouTube API

---

## 📈 성과

- Redis 캐시 도입으로 **페이지 로딩 속도 5배 향상**
- GPT-4o 기반 자동화로 **앨범 정보 추출 정확도 92% 달성**
- YouTube API 요청 **60% 감소**, 할당량 초과 문제 해결
- SEO 최적화로 **Lighthouse SEO 100점** 달성

---

## 📷 미리보기

| 메인 페이지 | 트랙 상세 페이지 | 인터뷰 페이지 |
|-------------|-----------------|---------------|
| ![main](https://github.com/username/project/assets/xxx) | ![track](https://github.com/username/project/assets/xxx) | ![interview](https://github.com/username/project/assets/xxx) |

---

## 📌 설치 및 실행 방법

```bash
# 레포지토리 클론
git clone https://github.com/username/project.git
cd project

# 환경 변수 설정
cp .env.example .env.local

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
