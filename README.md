# 🍣 Sushi Game
[초밥게임 바로가기](https://dugout.kro.kr/sushi-game)
<div>
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/matter.js-000000?style=for-the-badge" />
  <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white" />
  
</div>

## 소개

React로 만든 퍼즐게임 입니다.</br>
같은 초밥 2개를 합쳐서 더 높은 등급의 초밥을 만들고, 최종 목표인 연어 초밥을 완성해보세요!

> 반응형 디자인을 적용하여 모바일, 태블릿, 데스크탑 등 다양한 환경에서 플레이할 수 있습니다.

## 게임 방식

- 화면을 클릭하여 초밥을 원하는 위치에 떨어뜨립니다.
- 같은 초밥 2개를 합치면 한 단계 높은 초밥이 생성됩니다.
- 최종 목표는 가장 높은 단계의 초밥인 연어를 만드는 것입니다.
- 게임판이 초밥으로 가득 차면 게임오버가 됩니다.
- 연어 초밥을 만들면 게임 클리어!

#### 초밥 단계

단계 | 초밥명 | 이미지 |
:-: | :-------------: | :-------------: |
0 | 마끼 초밥 | <img src="https://dugout.kro.kr/sushi-game/maki.png" width="25" height="25" /> |
1| 계란 초밥 | <img src="https://dugout.kro.kr/sushi-game/egg.png" width="25" height="25" /> |
2| 연어알 초밥 | <img src="https://dugout.kro.kr/sushi-game/salmon_roe.png" width="25" height="25" /> |
3| 새우 초밥 | <img src="https://dugout.kro.kr/sushi-game/shrimp.png" width="25" height="25" /> |
4| 우니 초밥 | <img src="https://dugout.kro.kr/sushi-game/sea_urchin.png" width="25" height="25" /> |
5| 고등어 초밥 | <img src="https://dugout.kro.kr/sushi-game/saba.png" width="25" height="25" /> |
6| 오징어 초밥 | <img src="https://dugout.kro.kr/sushi-game/squid.png" width="25" height="25" /> |
7| 방어 초밥 | <img src="https://dugout.kro.kr/sushi-game/yellow_tail.png" width="25" height="25" /> |
8| 문어 초밥 | <img src="https://dugout.kro.kr/sushi-game/taco.png" width="25" height="25" /> |
9| 참치 초밥 | <img src="https://dugout.kro.kr/sushi-game/tuna.png" width="25" height="25" /> |
10| 연어 초밥 | <img src="https://dugout.kro.kr/sushi-game/salmon.png" width="25" height="25" /> |

## 기술 스택

- **React** (v19): 프론트엔드 라이브러리로 사용하였습니다.
- **Tailwind** (v3): 별도의 CSS 파일 작성 없이 컴포넌트 내부에서 바로 스타일링이 가능해 유지보수가 쉽고, 클래스 이름만으로 빠르게 스타일을 지정할 수 있어 사용하였습니다.
- **Vite** (v6): 빠른 빌드를 위해 사용하였습니다.
- **Matter.js** (v0.19): 2D 물리 엔진 라이브러리로, 충돌 감지와 물리 기반의 움직임을 간편하게 구현할 수 있습니다. 게임의 물리 엔진 구현을 위해 사용하였습니다.
- **Nginx** (v1.18): 정적 파일을 빠르고 안정적으로 서빙하기 위해 사용하였습니다. Vite로 빌드한 정적 파일을 Nginx를 이용해 배포하였습니다.
