// ==========================================================================
// 한글 자모 결합 블록 메인 애플리케이션
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // DOM 요소 참조
  const tabFreeMode = document.getElementById('tabFreeMode');
  const tabQuestMode = document.getElementById('tabQuestMode');
  const questBannerCard = document.getElementById('questBannerCard');
  const questEmoji = document.getElementById('questEmoji');
  const questStepBadge = document.getElementById('questStepBadge');
  const questTargetWord = document.getElementById('questTargetWord');
  const questHintDesc = document.getElementById('questHintDesc');
  const btnSpeakTarget = document.getElementById('btnSpeakTarget');
  const questSyllableProgress = document.getElementById('questSyllableProgress');

  const slotCho = document.getElementById('slotCho');
  const slotJung = document.getElementById('slotJung');
  const slotJong = document.getElementById('slotJong');
  const slotChoChar = document.getElementById('slotChoChar');
  const slotChoName = document.getElementById('slotChoName');
  const slotJungChar = document.getElementById('slotJungChar');
  const slotJungName = document.getElementById('slotJungName');
  const slotJongChar = document.getElementById('slotJongChar');
  const slotJongName = document.getElementById('slotJongName');

  const resultCharBubble = document.getElementById('resultCharBubble');
  const resultPhonicsDesc = document.getElementById('resultPhonicsDesc');
  const btnSpeakResult = document.getElementById('btnSpeakResult');
  const btnSaveCollection = document.getElementById('btnSaveCollection');
  const btnClearJongseong = document.getElementById('btnClearJongseong');

  const paletteTitle = document.getElementById('paletteTitle');
  const chipTabs = document.querySelectorAll('.chip-tab');
  const gridCho = document.getElementById('gridCho');
  const gridJung = document.getElementById('gridJung');
  const gridJong = document.getElementById('gridJong');

  const collectionGrid = document.getElementById('collectionGrid');
  const collectionCountBadge = document.getElementById('collectionCountBadge');

  // 상태 관리
  let currentMode = 'free'; // 'free' or 'quest'
  let activeSlot = 'cho';  // 'cho', 'jung', 'jong'

  let selectedCho = 0;   // ㄱ
  let selectedJung = 0;  // ㅏ
  let selectedJong = 0;  // 없음

  // 퀘스트 상태
  let questIndex = 0;
  let questSyllableIndex = 0;

  // ------------------------------------------------------------------------
  // 1. 초기화
  // ------------------------------------------------------------------------
  function init() {
    renderPalettes();
    updateSyllable(true);
    renderCollection();
    setupEventListeners();
  }

  // ------------------------------------------------------------------------
  // 2. 팔레트 블록 렌더링
  // ------------------------------------------------------------------------
  function renderPalettes() {
    // 1) 초성 19개
    gridCho.innerHTML = '';
    HangeulData.CHOSEONG.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `block-btn ${idx === selectedCho ? 'active' : ''}`;
      btn.dataset.idx = idx;
      btn.innerHTML = `<span class="block-char">${c.char}</span><span class="block-name">${c.name}</span>`;
      btn.addEventListener('click', () => selectBlock('cho', idx));
      gridCho.appendChild(btn);
    });

    // 2) 중성 21개
    gridJung.innerHTML = '';
    HangeulData.JUNGSEONG.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `block-btn ${idx === selectedJung ? 'active' : ''}`;
      btn.dataset.idx = idx;
      btn.innerHTML = `<span class="block-char">${c.char}</span><span class="block-name">${c.name}</span>`;
      btn.addEventListener('click', () => selectBlock('jung', idx));
      gridJung.appendChild(btn);
    });

    // 3) 종성 28개
    gridJong.innerHTML = '';
    HangeulData.JONGSEONG.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `block-btn ${idx === selectedJong ? 'active' : ''}`;
      btn.dataset.idx = idx;
      const displayChar = c.char || '(없음)';
      btn.innerHTML = `<span class="block-char">${displayChar}</span><span class="block-name">${c.name}</span>`;
      btn.addEventListener('click', () => selectBlock('jong', idx));
      gridJong.appendChild(btn);
    });
  }

  // ------------------------------------------------------------------------
  // 3. 자모 선택 및 슬롯 전이 로직
  // ------------------------------------------------------------------------
  function selectBlock(type, index) {
    SoundEngine.playTouchChime(index);

    if (type === 'cho') {
      selectedCho = index;
      // 자동 전이: 초성을 고르면 자연스럽게 중성 탭으로 안내
      setActiveSlot('jung');
    } else if (type === 'jung') {
      selectedJung = index;
      // 중성을 고르면 완성 글자 바로 낭독
      setActiveSlot('jong');
    } else if (type === 'jong') {
      selectedJong = index;
    }

    updateSyllable(true);
    refreshPaletteActiveState();
    checkQuestMatch();
  }

  function setActiveSlot(slot) {
    activeSlot = slot;
    [slotCho, slotJung, slotJong].forEach(s => s.classList.remove('active'));

    if (slot === 'cho') {
      slotCho.classList.add('active');
      switchPaletteTab('cho');
    } else if (slot === 'jung') {
      slotJung.classList.add('active');
      switchPaletteTab('jung');
    } else if (slot === 'jong') {
      slotJong.classList.add('active');
      switchPaletteTab('jong');
    }
  }

  function switchPaletteTab(target) {
    chipTabs.forEach(t => {
      if (t.dataset.target === target) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    [gridCho, gridJung, gridJong].forEach(g => g.style.display = 'none');
    if (target === 'cho') {
      gridCho.style.display = 'grid';
      paletteTitle.textContent = '초성(첫소리) 자음 선택';
    } else if (target === 'jung') {
      gridJung.style.display = 'grid';
      paletteTitle.textContent = '중성(가운뎃소리) 모음 선택';
    } else if (target === 'jong') {
      gridJong.style.display = 'grid';
      paletteTitle.textContent = '종성(받침) 자음 선택';
    }
  }

  function refreshPaletteActiveState() {
    gridCho.querySelectorAll('.block-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.idx, 10) === selectedCho);
    });
    gridJung.querySelectorAll('.block-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.idx, 10) === selectedJung);
    });
    gridJong.querySelectorAll('.block-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.idx, 10) === selectedJong);
    });
  }

  // ------------------------------------------------------------------------
  // 4. 음절 합성 및 UI 갱신
  // ------------------------------------------------------------------------
  function updateSyllable(speak = false) {
    const choObj = HangeulData.CHOSEONG[selectedCho];
    const jungObj = HangeulData.JUNGSEONG[selectedJung];
    const jongObj = HangeulData.JONGSEONG[selectedJong];

    slotChoChar.textContent = choObj.char;
    slotChoName.textContent = `${choObj.name} [${choObj.roman}]`;

    slotJungChar.textContent = jungObj.char;
    slotJungName.textContent = `${jungObj.name} [${jungObj.roman}]`;

    slotJongChar.textContent = jongObj.char || '(없음)';
    slotJongName.textContent = jongObj.name;

    const syllable = HangeulData.compose(selectedCho, selectedJung, selectedJong);
    resultCharBubble.textContent = syllable;

    // 버블 팝 애니메이션
    resultCharBubble.classList.remove('pop-anim');
    void resultCharBubble.offsetWidth;
    resultCharBubble.classList.add('pop-anim');

    // 파닉스 상세 설명 조립
    let desc = `${choObj.char}[${choObj.sound}] + ${jungObj.char}[${jungObj.sound}]`;
    if (jongObj.char) {
      desc += ` + ${jongObj.char}[${jongObj.sound}]`;
    }
    desc += ` = ${syllable}`;
    resultPhonicsDesc.textContent = desc;

    if (speak) {
      SoundEngine.speakKorean(syllable);
    }
  }

  // ------------------------------------------------------------------------
  // 5. 퀘스트 모드 로직
  // ------------------------------------------------------------------------
  function setMode(mode) {
    currentMode = mode;
    if (mode === 'free') {
      tabFreeMode.classList.add('active');
      tabQuestMode.classList.remove('active');
      questBannerCard.style.display = 'none';
    } else {
      tabQuestMode.classList.add('active');
      tabFreeMode.classList.remove('active');
      questBannerCard.style.display = 'block';
      loadCurrentQuest();
    }
  }

  function loadCurrentQuest() {
    const quest = HangeulData.QUESTS[questIndex % HangeulData.QUESTS.length];
    questEmoji.textContent = quest.emoji;
    questStepBadge.textContent = `퀘스트 ${quest.id} / ${HangeulData.QUESTS.length}`;
    questTargetWord.textContent = quest.word;
    questHintDesc.textContent = quest.hint;

    renderQuestSyllableChips(quest);
    SoundEngine.speakKorean(quest.word);
  }

  function renderQuestSyllableChips(quest) {
    questSyllableProgress.innerHTML = '';
    quest.syllables.forEach((syl, i) => {
      const chip = document.createElement('span');
      chip.className = 'syllable-slot-chip';
      if (i < questSyllableIndex) {
        chip.classList.add('done');
        chip.textContent = `✓ ${i + 1}번째: ${syl}`;
      } else if (i === questSyllableIndex) {
        chip.classList.add('active');
        chip.textContent = `▶ ${i + 1}번째: ${syl}`;
      } else {
        chip.textContent = `${i + 1}번째: ${syl}`;
      }
      questSyllableProgress.appendChild(chip);
    });
  }

  function checkQuestMatch() {
    if (currentMode !== 'quest') return;

    const quest = HangeulData.QUESTS[questIndex % HangeulData.QUESTS.length];
    const targetSyl = quest.syllables[questSyllableIndex];
    const currentSyl = HangeulData.compose(selectedCho, selectedJung, selectedJong);

    if (currentSyl === targetSyl) {
      SoundEngine.playSuccessFanfare();
      questSyllableIndex++;

      if (questSyllableIndex >= quest.syllables.length) {
        // 단어 전체 완성 축하!
        setTimeout(() => {
          SoundEngine.speakKorean(`${quest.word}! 정답입니다! 아주 잘했어요!`);
          alert(`🎉 축하합니다! 단어 [${quest.word}]를 완성했습니다!`);
          questIndex++;
          questSyllableIndex = 0;
          loadCurrentQuest();
        }, 600);
      } else {
        // 다음 음절로 전이
        renderQuestSyllableChips(quest);
        setActiveSlot('cho');
      }
    }
  }

  // ------------------------------------------------------------------------
  // 6. 도감 (Collection Book)
  // ------------------------------------------------------------------------
  function saveCurrentToCollection() {
    const syllable = HangeulData.compose(selectedCho, selectedJung, selectedJong);
    const choObj = HangeulData.CHOSEONG[selectedCho];
    const jungObj = HangeulData.JUNGSEONG[selectedJung];
    const jongObj = HangeulData.JONGSEONG[selectedJong];

    const item = {
      char: syllable,
      sub: `${choObj.char}+${jungObj.char}${jongObj.char ? '+' + jongObj.char : ''}`,
      timestamp: Date.now()
    };

    HangeulStorage.saveToCollection(item);
    renderCollection();
    SoundEngine.playSuccessFanfare();
  }

  function renderCollection() {
    const list = HangeulStorage.getCollection();
    collectionCountBadge.textContent = `${list.length}개 발견`;

    if (list.length === 0) {
      collectionGrid.innerHTML = '<div class="empty-collection-msg">아직 저장된 글자가 없습니다. 글자를 만들어 보세요!</div>';
      return;
    }

    collectionGrid.innerHTML = '';
    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'collection-item';
      card.innerHTML = `<span class="col-char">${item.char}</span><span class="col-sub">${item.sub}</span>`;
      card.addEventListener('click', () => {
        SoundEngine.speakKorean(item.char);
        const decomposed = HangeulData.decompose(item.char);
        if (decomposed) {
          selectedCho = decomposed.cho;
          selectedJung = decomposed.jung;
          selectedJong = decomposed.jong;
          updateSyllable(false);
          refreshPaletteActiveState();
        }
      });
      collectionGrid.appendChild(card);
    });
  }

  // ------------------------------------------------------------------------
  // 7. 이벤트 바인딩
  // ------------------------------------------------------------------------
  function setupEventListeners() {
    tabFreeMode.addEventListener('click', () => setMode('free'));
    tabQuestMode.addEventListener('click', () => setMode('quest'));

    slotCho.addEventListener('click', () => setActiveSlot('cho'));
    slotJung.addEventListener('click', () => setActiveSlot('jung'));
    slotJong.addEventListener('click', () => setActiveSlot('jong'));

    chipTabs.forEach(tab => {
      tab.addEventListener('click', () => switchPaletteTab(tab.dataset.target));
    });

    btnSpeakResult.addEventListener('click', () => {
      const syl = HangeulData.compose(selectedCho, selectedJung, selectedJong);
      SoundEngine.speakKorean(syl);
    });

    btnSaveCollection.addEventListener('click', () => {
      saveCurrentToCollection();
    });

    btnClearJongseong.addEventListener('click', () => {
      selectedJong = 0;
      updateSyllable(true);
      refreshPaletteActiveState();
    });

    btnSpeakTarget.addEventListener('click', () => {
      const quest = HangeulData.QUESTS[questIndex % HangeulData.QUESTS.length];
      SoundEngine.speakKorean(quest.word);
    });
  }

  init();
});
