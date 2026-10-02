// ==========================================================================
// 한글 자모 도감 및 퀘스트 저장소
// ==========================================================================
const HangeulStorage = (function () {
  const COLLECTION_KEY = 'hangeul_collection_v1';
  const QUEST_KEY = 'hangeul_quest_step_v1';

  function getCollection() {
    try {
      const raw = localStorage.getItem(COLLECTION_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveToCollection(item) {
    try {
      const list = getCollection();
      // 중복 체크
      if (!list.some(x => x.char === item.char)) {
        list.unshift(item);
        localStorage.setItem(COLLECTION_KEY, JSON.stringify(list));
      }
      return list;
    } catch (e) {
      return [];
    }
  }

  function getQuestStep() {
    try {
      const val = localStorage.getItem(QUEST_KEY);
      return val ? parseInt(val, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  function saveQuestStep(step) {
    try {
      localStorage.setItem(QUEST_KEY, String(step));
    } catch (e) {}
  }

  return {
    getCollection,
    saveToCollection,
    getQuestStep,
    saveQuestStep
  };
})();
