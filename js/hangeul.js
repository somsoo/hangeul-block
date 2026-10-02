// ==========================================================================
// 한글 유니코드 제자 원리 산술 엔진 및 메타데이터
// ==========================================================================
const HangeulData = (function () {
  const CHOSEONG = [
    { char: 'ㄱ', name: '기역', roman: 'g', sound: '그' },
    { char: 'ㄲ', name: '쌍기역', roman: 'kk', sound: '끄' },
    { char: 'ㄴ', name: '니은', roman: 'n', sound: '느' },
    { char: 'ㄷ', name: '디귿', roman: 'd', sound: '드' },
    { char: 'ㄸ', name: '쌍디귿', roman: 'tt', sound: '뜨' },
    { char: 'ㄹ', name: '리을', roman: 'r', sound: '르' },
    { char: 'ㅁ', name: '미음', roman: 'm', sound: '므' },
    { char: 'ㅂ', name: '비읍', roman: 'b', sound: '브' },
    { char: 'ㅃ', name: '쌍비읍', roman: 'pp', sound: '쁘' },
    { char: 'ㅅ', name: '시옷', roman: 's', sound: '스' },
    { char: 'ㅆ', name: '쌍시옷', roman: 'ss', sound: '쓰' },
    { char: 'ㅇ', name: '이응', roman: 'ng', sound: '으(소리없음)' },
    { char: 'ㅈ', name: '지읒', roman: 'j', sound: '즈' },
    { char: 'ㅉ', name: '쌍지읒', roman: 'jj', sound: '쯔' },
    { char: 'ㅊ', name: '치읓', roman: 'ch', sound: '츠' },
    { char: 'ㅋ', name: '키읔', roman: 'k', sound: '크' },
    { char: 'ㅌ', name: '티읕', roman: 't', sound: '트' },
    { char: 'ㅍ', name: '피읖', roman: 'p', sound: '프' },
    { char: 'ㅎ', name: '히읗', roman: 'h', sound: '흐' }
  ];

  const JUNGSEONG = [
    { char: 'ㅏ', name: '아', roman: 'a', sound: '아' },
    { char: 'ㅐ', name: '애', roman: 'ae', sound: '애' },
    { char: 'ㅑ', name: '야', roman: 'ya', sound: '야' },
    { char: 'ㅒ', name: '얘', roman: 'yae', sound: '얘' },
    { char: 'ㅓ', name: '어', roman: 'eo', sound: '어' },
    { char: 'ㅔ', name: '에', roman: 'e', sound: '에' },
    { char: 'ㅕ', name: '여', roman: 'yeo', sound: '여' },
    { char: 'ㅖ', name: '예', roman: 'ye', sound: '예' },
    { char: 'ㅗ', name: '오', roman: 'o', sound: '오' },
    { char: 'ㅘ', name: '와', roman: 'wa', sound: '와' },
    { char: 'ㅙ', name: '왜', roman: 'wae', sound: '왜' },
    { char: 'ㅚ', name: '외', roman: 'oe', sound: '외' },
    { char: 'ㅛ', name: '요', roman: 'yo', sound: '요' },
    { char: 'ㅜ', name: '우', roman: 'u', sound: '우' },
    { char: 'ㅝ', name: '워', roman: 'wo', sound: '워' },
    { char: 'ㅞ', name: '웨', roman: 'we', sound: '웨' },
    { char: 'ㅟ', name: '위', roman: 'wi', sound: '위' },
    { char: 'ㅠ', name: '유', roman: 'yu', sound: '유' },
    { char: 'ㅡ', name: '으', roman: 'eu', sound: '으' },
    { char: 'ㅢ', name: '의', roman: 'ui', sound: '의' },
    { char: 'ㅣ', name: '이', roman: 'i', sound: '이' }
  ];

  const JONGSEONG = [
    { char: '', name: '받침 없음', roman: '', sound: '받침 없음' },
    { char: 'ㄱ', name: '기역', roman: 'k', sound: '악' },
    { char: 'ㄲ', name: '쌍기역', roman: 'k', sound: '악' },
    { char: 'ㄳ', name: '기역시옷', roman: 'k', sound: '악' },
    { char: 'ㄴ', name: '니은', roman: 'n', sound: '안' },
    { char: 'ㄵ', name: '니은지읒', roman: 'n', sound: '안' },
    { char: 'ㄶ', name: '니은히읗', roman: 'n', sound: '안' },
    { char: 'ㄷ', name: '디귿', roman: 't', sound: '앋' },
    { char: 'ㄹ', name: '리을', roman: 'l', sound: '알' },
    { char: 'ㄺ', name: '리을기역', roman: 'k', sound: '악' },
    { char: 'ㄻ', name: '리을미음', roman: 'm', sound: '암' },
    { char: 'ㄼ', name: '리을비읍', roman: 'l/p', sound: '알' },
    { char: 'ㄽ', name: '리을시옷', roman: 'l', sound: '알' },
    { char: 'ㄾ', name: '리을티읕', roman: 'l', sound: '알' },
    { char: 'ㄿ', name: '리을피읖', roman: 'p', sound: '압' },
    { char: 'ㅀ', name: '리을히읗', roman: 'l', sound: '알' },
    { char: 'ㅁ', name: '미음', roman: 'm', sound: '암' },
    { char: 'ㅂ', name: '비읍', roman: 'p', sound: '압' },
    { char: 'ㅄ', name: '비읍시옷', roman: 'p', sound: '압' },
    { char: 'ㅅ', name: '시옷', roman: 't', sound: '앗' },
    { char: 'ㅆ', name: '쌍시옷', roman: 't', sound: '앗' },
    { char: 'ㅇ', name: '이응', roman: 'ng', sound: '앙' },
    { char: 'ㅈ', name: '지읒', roman: 't', sound: '앚' },
    { char: 'ㅊ', name: '치읓', roman: 't', sound: '앛' },
    { char: 'ㅋ', name: '키읔', roman: 'k', sound: '앜' },
    { char: 'ㅌ', name: '티읕', roman: 't', sound: '앝' },
    { char: 'ㅍ', name: '피읖', roman: 'p', sound: '앞' },
    { char: 'ㅎ', name: '히읗', roman: 't', sound: '앟' }
  ];

  // 10개 퀘스트 단어 세트
  const QUESTS = [
    {
      id: 1,
      word: '사과',
      emoji: '🍎',
      hint: '새콤달콤 빨갛게 익은 맛있는 과일이에요!',
      syllables: ['사', '과']
    },
    {
      id: 2,
      word: '나무',
      emoji: '🌳',
      hint: '초록빛 잎사귀가 가득한 커다란 식물이에요!',
      syllables: ['나', '무']
    },
    {
      id: 3,
      word: '바다',
      emoji: '🌊',
      hint: '푸른 파도가 일렁이는 시원하고 넓은 물이에요!',
      syllables: ['바', '다']
    },
    {
      id: 4,
      word: '별',
      emoji: '⭐',
      hint: '깜깜한 밤하늘을 반짝반짝 비춰줘요!',
      syllables: ['별']
    },
    {
      id: 5,
      word: '달',
      emoji: '🌙',
      hint: '밤하늘에 떠서 세상을 비추는 은은한 빛이에요!',
      syllables: ['달']
    },
    {
      id: 6,
      word: '나비',
      emoji: '🦋',
      hint: '꽃밭 위를 팔랑팔랑 날아다니는 곤충이에요!',
      syllables: ['나', '비']
    },
    {
      id: 7,
      word: '강아지',
      emoji: '🐶',
      hint: '멍멍 짖으며 꼬리를 살랑살랑 흔드는 귀여운 동물!',
      syllables: ['강', '아', '지']
    },
    {
      id: 8,
      word: '호랑이',
      emoji: '🐯',
      hint: '어흥! 줄무늬가 멋진 용맹한 숲속의 왕!',
      syllables: ['호', '랑', '이']
    },
    {
      id: 9,
      word: '비행기',
      emoji: '✈️',
      hint: '하얀 날개로 구름 위 높은 하늘을 날아가요!',
      syllables: ['비', '행', '기']
    },
    {
      id: 10,
      word: '꽃',
      emoji: '🌸',
      hint: '봄이 오면 피어나는 알록달록 향기로운 자연의 선물!',
      syllables: ['꽃']
    }
  ];

  // 유니코드 산술 합성 공식
  function compose(choIdx, jungIdx, jongIdx = 0) {
    if (choIdx < 0 || choIdx >= 19 || jungIdx < 0 || jungIdx >= 21 || jongIdx < 0 || jongIdx >= 28) {
      return '';
    }
    const code = 0xAC00 + (choIdx * 588) + (jungIdx * 28) + jongIdx;
    return String.fromCharCode(code);
  }

  // 음절 분해
  function decompose(syllable) {
    if (!syllable || syllable.length === 0) return null;
    const code = syllable.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return null;

    const cho = Math.floor(code / 588);
    const jung = Math.floor((code % 588) / 28);
    const jong = code % 28;

    return {
      cho,
      jung,
      jong,
      choObj: CHOSEONG[cho],
      jungObj: JUNGSEONG[jung],
      jongObj: JONGSEONG[jong]
    };
  }

  return {
    CHOSEONG,
    JUNGSEONG,
    JONGSEONG,
    QUESTS,
    compose,
    decompose
  };
})();
