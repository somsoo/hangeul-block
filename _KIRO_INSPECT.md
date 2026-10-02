# 사이트 정보: 한글 자모 결합 블록 (hangeul-block)

- 주소: https://hangeul-block.enjoy-onepage.com/
- 로컬 경로: `Webapp_Staging\hangeul-block` (배포 완료 시 GitHub Pages main)
- 저장소: somsoo/hangeul-block
- 배포 브랜치: main
- 상태: live (2026-10-02 배포 및 검증 완료)
- 허브 카드: 등록 대기
- 설명: 초성(19), 중성(21), 종성(28) 블록을 조합하여 유니코드 수식으로 완성형 음절을 합성하고 Web Speech API로 발음과 단어 퀘스트를 학습하는 파닉스 웹앱.

## 기술 스택
- 제자 원리 연산: Unicode = 0xAC00 + (초성×588) + (중성×28) + 종성
- 음성 엔진: Web Speech Synthesis API (ko-KR) & Web Audio API 실로폰 사운드
- 모바일 대응: 320px~1200px 0px 오버플로우, 제목/버튼 1줄 엄격 준수, AdSense 90px 클램프
- 데이터 저장: LocalStorage 기반 자모 도감 및 퀘스트 단계 영속화
