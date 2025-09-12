# 🎵 Soundtalk (Spotify 기반 음악 플랫폼)

![Hompage-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/480f4c3a-9398-4f02-a9f1-babf9b406a07)

Next.js, TypeScript, MongoDB, Redis 등을 활용해  
**음악 정보 조회, 인터뷰, 댓글 기능**을 제공하는 음악 웹 애플리케이션입니다.  

---
## 🔗 배포 주소

https://music-charts.vercel.app/

---
## 🚀 주요 기능

- **트랙/앨범 상세 페이지**
  - Spotify API 기반 음악 정보 조회
  - Redis 캐싱으로 응답 속도 개선 (600ms → 120ms, **약 80% 성능 향상**)
- **아티스트 인터뷰 검색**
  - **Google Custom Search API**를 활용해 아티스트 관련 인터뷰 목록 제공
  - MongoDB에 검색 결과를 캐싱하여 API 호출을 최소화
  - 인터뷰 데이터는 아티스트 상세 페이지에서 확인 가능
- **댓글 및 인증 시스템**
  - Next.js API Routes + MongoDB
  - JWT 인증 & bcrypt 해싱 처리 → 보안 강화

---

## 🛠 기술 스택

### 🎨 Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)<br>
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)<br>
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)<br>
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)<br>
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat&logo=framer&logoColor=white)<br>

### 🔧 Backend
![Next.js API](https://img.shields.io/badge/Next.js%20API%20Routes-000000?style=flat&logo=next.js&logoColor=white) – 서버리스 백엔드 <br>
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) – 댓글 CRUD, 유저 정보, 스포티파이, Gemini API 등 검색 결과 저장 <br>
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white) – API 응답 캐싱 및 TTL 기반 데이터 만료 처리 <br>
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) – 토큰 기반 인증 및 권한 관리 <br>
![Auth](https://img.shields.io/badge/Cookie--based%20Auth-FFCC00?style=flat&logo=cookiecutter&logoColor=black) – 로그인 시 토큰을 HTTP-only 쿠키에 저장 <br>

### ⚙️ Infra / Tooling
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) – 개발/운영 환경 컨테이너화 <br>
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) – 프론트엔드 배포 플랫폼 <br>
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white) – CI/CD 파이프라인 자동화 <br>

### 🤖 AI / External API
![Google Gemini](https://img.shields.io/badge/Gemini%202.5%20Flash-4285F4?style=flat&logo=google&logoColor=white) – AI 기반 데이터 처리 <br>
![Spotify](https://img.shields.io/badge/Spotify%20API-1DB954?style=flat&logo=spotify&logoColor=white) – 음악 트랙/앨범 정보 제공 <br>
![YouTube](https://img.shields.io/badge/YouTube%20API-FF0000?style=flat&logo=youtube&logoColor=white) – 영상 및 인터뷰 데이터 제공 <br>


---

## 📈 성과

- Redis 캐시 도입으로 **트랙 상세 페이지 로딩 속도 5배 향상**
  
---

## 📷 미리보기

### 🏠 홈페이지
- 서비스 소개, 로그인/회원가입 모달, Top1 트랙에 대한 인터뷰를 미리보기, 추천 채널 등이 포함된 첫 진입 페이지입니다.
![Hompage-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/480f4c3a-9398-4f02-a9f1-babf9b406a07)

---
### 🔐 로그인 / 회원가입 페이지

- **React Hook Form과 Zod**를 활용하여 실시간 폼 유효성 검사 및 에러 처리하였습니다
- **JWT 기반 인증, bcrypt 비밀번호 해싱 처리**로 보안 강화하였습니다.
  
<img width="293" height="394" alt="image" src="https://github.com/user-attachments/assets/1c21661a-7b5d-4283-80f5-be51589b017c" />

---
### 📄 트랙 상세 페이지

- **MongoDB를 이용해 댓글 작성/수정/삭제** 기능을 제공합니다.
- Spotify Api와 더 빠른 데이터 캐싱을 위한 **Redis**를 사용했습니다.
  
![Trackpage-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/ef36fbf4-333c-48b9-82c2-35129834a7a6)

---
### 👤 트랙 아티스트 상세 페이지

- **Wikipedia API**를 이용해 아티스트 정보를 불러옵니다
- **Google Custom Search API**를 이용해 해당 아티스트에 대한 인터뷰 목록을 불러옵니다
  
<img width="506" height="855" alt="image" src="https://github.com/user-attachments/assets/bb0ae86e-c49a-4f6f-a463-0fafd46ea9c7" />

---
### ⚖️ 트랙 추천 페이지

- Spotify Api를 이용해 장르를 선택하면 이에 맞는 트랙이 나옵니다.
- 트랙을 누르면 트랙 상세페이지로 이동합니다.
  
<img width="1110" height="1232" alt="image" src="https://github.com/user-attachments/assets/e6f7c79a-ff59-4106-a625-90cb90757807" />

## 📌 설치 및 실행 방법

```bash
# 레포지토리 클론
git clone https://github.com/ramong26/Soundtalk.git
cd Soundtalk

# 환경 변수 설정
cp .env.example .env.local

# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm run dev
