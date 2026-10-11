document.addEventListener('DOMContentLoaded', () => {
    // ==================== GAME STATE ====================
    let playerState = {
        level: 1,
        xp: 0,
        gold: 1250,
        hp: 100,
        completed_questions: [],
        current_quest: "Java Introduction", // Default active topic
        potions: 5
    };

    // Current battle variables
    let currentBattle = {
        active: false,
        difficulty: null,
        monsterHp: 100,
        maxMonsterHp: 100,
        questions: [],
        currentIndex: 0,
        currentQuestion: null
    };

    // ==================== DOM ELEMENTS ====================
    const heroName = document.getElementById('hero-name');
    const heroLevelLabel = document.getElementById('hero-level-label');
    const hpText = document.getElementById('hp-text');
    const hpProgressBar = document.getElementById('hp-progress-bar');
    const xpText = document.getElementById('xp-text');
    const xpProgressBar = document.getElementById('xp-progress-bar');
    const goldAmount = document.getElementById('gold-amount');
    const sidebarNavBtns = document.querySelectorAll('.sidebar-btn');

    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const chapterSelect = document.getElementById('chapter-select');
    const floorProgressText = document.getElementById('floor-progress-text');
    const currentQuestTitle = document.getElementById('current-quest-title');
    const adventureLog = document.getElementById('adventure-log');

    const slotPotion = document.getElementById('slot-potion');
    const potionCount = document.getElementById('potion-count');
    const quickUpgradeBtn = document.getElementById('quick-upgrade-btn');
    const buyPotionBtn = document.querySelector('.buy-potion-btn');

    const targetMonsters = document.querySelectorAll('.target-monster');

    // Battle Modal Elements
    const battleModal = document.getElementById('battle-modal');
    const battleWindow = battleModal ? battleModal.querySelector('.battle-window') : null;
    const battleHeaderDiff = document.getElementById('battle-header-diff');
    const battleHeaderMonster = document.getElementById('battle-header-monster');
    const arenaMonsterLabel = document.getElementById('arena-monster-label');
    const arenaMonsterHpText = document.getElementById('arena-monster-hp-text');
    const arenaMonsterHpFill = document.getElementById('arena-monster-hp-fill');
    const arenaMonsterSprite = document.getElementById('arena-monster-sprite');
    
    const battleQNum = document.getElementById('battle-q-num');
    const battleQTopic = document.getElementById('battle-q-topic');
    const battleQText = document.getElementById('battle-q-text');
    const battleCodeContainer = document.getElementById('battle-code-container');
    const battleCodeContent = document.getElementById('battle-code-content');
    
    const battleMcqChoices = document.getElementById('battle-mcq-choices');
    const battleFitbInputContainer = document.getElementById('battle-fitb-input-container');
    const battleFitbInput = document.getElementById('battle-fitb-input');
    const battleFitbSubmit = document.getElementById('battle-fitb-submit');
    
    const battleStatusText = document.getElementById('battle-status-text');
    const battleCloseBtn = document.getElementById('battle-close-btn');

    const gameAlert = document.getElementById('game-alert');
    const alertTitle = document.getElementById('alert-title');
    const alertMsg = document.getElementById('alert-msg');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    // Helper: Get Language from selected dropdown optgroup
    // Helper: Safely identify selected language from dropdown optgroup
    function getSelectedLanguage() {
        if (!chapterSelect) return "";
        const selectedOption = chapterSelect.options[chapterSelect.selectedIndex];
        if (selectedOption && selectedOption.parentElement && selectedOption.parentElement.tagName === 'OPTGROUP') {
            const label = selectedOption.parentElement.label.toLowerCase();
            if (label.includes('python')) return 'Python';
            if (label.includes('java') && !label.includes('script')) return 'Java';
            if (label.includes('c++') || label.includes('cpp') || label.includes('c plus plus')) return 'C++';
        }
        return "";
    }

    async function fetchQuestionsFromDB(topic, difficulty) {
        try {
            // Clean leading numbers and decode HTML entities
            let cleanTopic = (topic || '').replace(/^\d+[\.\)]\s*/, '').trim().replace(/&amp;/g, '&');
            const language = getSelectedLanguage();
            
            // Build query params using URLSearchParams
            const params = new URLSearchParams();
            params.append('topic', cleanTopic);
            params.append('difficulty', difficulty);
            if (language) {
                params.append('language', language);
            }

            const url = `/api/questions?${params.toString()}`;
            const res = await fetch(url);
            const result = await res.json();
            
            if (result.status === 'success' && result.data && result.data.length > 0) {
                return result.data;
            }
        } catch (err) {
            console.error("Failed to fetch questions from API:", err);
        }

        // Local Fallback from QUESTIONS (questions.js)
        if (typeof QUESTIONS !== 'undefined' && Array.isArray(QUESTIONS)) {
            const normTopic = (topic || '').toLowerCase();
            let matches = QUESTIONS.filter(q => {
                const diffMatch = (q.difficulty || '').toLowerCase() === difficulty.toLowerCase();
                const qTopic = (q.topic || '').toLowerCase();
                const topicMatch = normTopic.includes(qTopic) || qTopic.includes(normTopic);
                return diffMatch && topicMatch;
            });
            if (matches.length === 0) {
                matches = QUESTIONS.filter(q => (q.difficulty || '').toLowerCase() === difficulty.toLowerCase());
            }
            if (matches.length > 0) {
                return matches.map(q => ({
                    id: q.id,
                    topic: q.topic,
                    difficulty: q.difficulty,
                    question_type: q.type || 'mcq',
                    question: q.question,
                    options: q.options || [],
                    correct_answer: q.answer,
                    correct_option: q.type === 'mcq' ? q.answer : '',
                    code_snippet: q.code || '',
                    explanation: q.explanation || ''
                }));
            }
        }
        return [];
    }

    async function loadGameState() {
        try {
            const response = await fetch('/api/state');
            if (response.ok) {
                const data = await response.json();
                if (!data.error) {
                    playerState.level = data.level || 1;
                    playerState.xp = data.xp || 0;
                    playerState.gold = data.gold || 1250;
                    playerState.hp = data.hp !== undefined ? data.hp : 100;
                    
                    if (data.completed_questions) {
                        playerState.completed_questions = data.completed_questions.split(',').map(x => x.trim()).filter(x => x !== '');
                    } else {
                        playerState.completed_questions = [];
                    }
                    
                    playerState.potions = parseInt(localStorage.getItem('potions') || "5");
                    playerState.current_quest = localStorage.getItem('current_quest') || (chapterSelect ? chapterSelect.value : "Java Introduction");
                }
            }
        } catch (err) {
            console.warn("Could not fetch state from API, using LocalStorage backup.", err);
            const localState = localStorage.getItem('algo_quest_player_state');
            if (localState) {
                playerState = JSON.parse(localState);
            }
        }
        
        if (chapterSelect) {
            chapterSelect.value = playerState.current_quest;
        }
        logMessage("> Syncing adventurer files from database...");
        if (heroName) logMessage(`> Logged in as ${heroName.textContent}. HP restored/synced.`);
        
        await renderUI();
        await updateMonsterStatus();
    }

    async function saveGameState() {
        localStorage.setItem('algo_quest_player_state', JSON.stringify(playerState));
        localStorage.setItem('potions', playerState.potions.toString());
        localStorage.setItem('current_quest', playerState.current_quest);

        try {
            await fetch('/api/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    level: playerState.level,
                    xp: playerState.xp,
                    gold: playerState.gold,
                    hp: playerState.hp,
                    completed_questions: playerState.completed_questions.join(',')
                })
            });
        } catch (err) {
            console.error("Failed to sync state to server.", err);
        }
    }

    function logMessage(text, type = "standard") {
        if (!adventureLog) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        adventureLog.appendChild(line);
        adventureLog.scrollTop = adventureLog.scrollHeight;
    }

    async function getFloorDefeatsCount(topic) {
        let count = 0;
        const difficulties = ['easy', 'medium', 'hard'];
        for (const diff of difficulties) {
            const diffQuestions = await fetchQuestionsFromDB(topic, diff);
            const completedDiffQuestions = diffQuestions.filter(q => playerState.completed_questions.includes(q.id.toString()));
            if (diffQuestions.length > 0 && completedDiffQuestions.length === diffQuestions.length) {
                count++;
            }
        }
        return count;
    }

    async function updateMonsterStatus() {
        const rawTopic = chapterSelect ? chapterSelect.options[chapterSelect.selectedIndex].value : playerState.current_quest;
        const topic = rawTopic.replace(/^\d+\.\s*/, '').trim();
        const difficulties = ['easy', 'medium', 'hard'];
        
        for (const diff of difficulties) {
            const diffQuestions = await fetchQuestionsFromDB(topic, diff);
            const completedDiffQuestions = diffQuestions.filter(q => playerState.completed_questions.includes(q.id.toString()));
            const monsterContainer = document.getElementById(`monster-${diff}`);
            const hpLabel = document.getElementById(`monster-${diff}-hp`);
            const questTag = document.getElementById(`quest-tag-${diff}`);
            
            let maxHp = diff === 'easy' ? 100 : (diff === 'medium' ? 150 : 200);
            
            if (diffQuestions.length === 0) {
                if (monsterContainer) {
                    monsterContainer.classList.remove('defeated');
                    monsterContainer.style.opacity = '1';
                }
                if (hpLabel) hpLabel.textContent = `${maxHp}/${maxHp} HP`;
                if (questTag) {
                    questTag.textContent = diff === 'easy' ? "[IN PROGRESS]" : (diff === 'medium' ? "[LEVEL 15]" : "[LOCKED]");
                    questTag.className = diff === 'easy' ? "quest-status-tag text-green" : (diff === 'medium' ? "quest-status-tag text-gold" : "quest-status-tag text-red");
                }
                continue;
            }

            let unsolvedCount = diffQuestions.length - completedDiffQuestions.length;
            let currentHp = Math.ceil((unsolvedCount / diffQuestions.length) * maxHp);
            if (hpLabel) hpLabel.textContent = `${currentHp}/${maxHp} HP`;

            if (currentHp === 0 && monsterContainer) {
                monsterContainer.classList.add('defeated');
                const tag = monsterContainer.querySelector('.monster-name-tag');
                if (tag) tag.style.borderColor = '#444';
                if (hpLabel) {
                    hpLabel.textContent = "SLAYED";
                    hpLabel.style.color = '#777';
                }
                if (questTag) {
                    questTag.textContent = "[DEFEATED]";
                    questTag.className = "quest-status-tag text-green";
                }
            } else if (monsterContainer) {
                monsterContainer.classList.remove('defeated');
                monsterContainer.style.opacity = '1';
                if (hpLabel) hpLabel.style.color = '#fff';
                const tag = monsterContainer.querySelector('.monster-name-tag');
                if (tag) {
                    if (diff === 'easy') tag.className = 'monster-name-tag border-green';
                    if (diff === 'medium') tag.className = 'monster-name-tag border-gold';
                    if (diff === 'hard') tag.className = 'monster-name-tag border-red';
                }
                if (questTag) {
                    questTag.textContent = diff === 'easy' ? "[IN PROGRESS]" : (diff === 'medium' ? "[LEVEL 15]" : "[LOCKED]");
                    questTag.className = diff === 'easy' ? "quest-status-tag text-green" : (diff === 'medium' ? "quest-status-tag text-gold" : "quest-status-tag text-red");
                }
            }
        }
    }

    async function renderUI() {
        const formattedGold = playerState.gold.toLocaleString();
        if (goldAmount) goldAmount.textContent = formattedGold;
        const goldTop = document.getElementById('gold-amount-top');
        if (goldTop) goldTop.textContent = formattedGold;

        if (heroLevelLabel) heroLevelLabel.textContent = `Level ${playerState.level} Coder`;

        if (hpText && hpProgressBar) {
            hpText.textContent = `${playerState.hp}/100`;
            const hpPercent = Math.max(0, Math.min(100, playerState.hp));
            const hpSegment = hpProgressBar.querySelector('.hp-segment');
            if (hpSegment) {
                hpSegment.style.width = `${hpPercent}%`;
                if (hpPercent > 50) hpSegment.className = "hp-segment filled bg-green";
                else if (hpPercent > 20) hpSegment.className = "hp-segment filled bg-gold";
                else hpSegment.className = "hp-segment filled bg-red";
            }
        }

        if (xpText && xpProgressBar) {
            const xpRequired = playerState.level * 1000;
            xpText.textContent = `${playerState.xp}/${xpRequired}`;
            const xpPercent = Math.max(0, Math.min(100, (playerState.xp / xpRequired) * 100));
            const xpSegment = xpProgressBar.querySelector('.hp-segment');
            if (xpSegment) xpSegment.style.width = `${xpPercent}%`;
        }

        if (potionCount) potionCount.textContent = `x${playerState.potions}`;

        if (chapterSelect && currentQuestTitle) {
            const activeTopicName = chapterSelect.options[chapterSelect.selectedIndex].text;
            currentQuestTitle.textContent = activeTopicName;
            const viewportBar = document.getElementById('dungeon-viewport-bar');
            if (viewportBar) viewportBar.textContent = `Dungeon Floor – ${activeTopicName}`;
        }

        if (floorProgressText) {
            const floorDefeats = await getFloorDefeatsCount(playerState.current_quest);
            floorProgressText.textContent = `${floorDefeats} / 3 Monsters Defeated`;
        }
    }

    // Quick Slot Potion Click
    if (slotPotion) {
        slotPotion.addEventListener('click', () => {
            if (playerState.potions <= 0) {
                logMessage("> No HP Potions remaining in inventory!", "err");
                showAlert("Out of Potions", "You have no HP Potions left in your inventory!");
                return;
            }
            if (playerState.hp >= 100) {
                logMessage("> Your HP is already full (100/100)!", "standard");
                return;
            }
            playerState.potions--;
            playerState.hp = Math.min(100, playerState.hp + 25);
            renderUI();
            saveGameState();
            logMessage(`> Consumed HP Potion! Restored +25 HP. (${playerState.hp}/100 HP)`, "gold");
        });
    }

    // ==================== HERO MOVEMENT & DUNGEON MAP ENGINE ====================
    const playerKnight = document.getElementById('player-knight');
    const dungeonStage = document.getElementById('dungeon-stage');
    const spaceTooltip = document.getElementById('space-tooltip');
    const heroSlashFx = document.getElementById('hero-slash-fx');

    let heroPos = { x: 360, y: 240 };
    let heroFacing = 1;
    let walkAnimTimeout = null;

    const monstersData = {
        easy: { id: 'monster-easy', name: 'The Slime of Sorting', x: 210, y: 210, diff: 'easy' },
        medium: { id: 'monster-medium', name: 'The Skeleton of Stacks', x: 460, y: 175, diff: 'medium' },
        hard: { id: 'monster-hard', name: 'The Binary Tree Boss', x: 610, y: 260, diff: 'hard' }
    };

    function getNearestMonster(threshold = 100) {
        let nearest = null;
        let minDist = Infinity;
        for (const key of Object.keys(monstersData)) {
            const m = monstersData[key];
            const elem = document.getElementById(m.id);
            if (elem && elem.classList.contains('defeated')) continue;
            
            const dist = Math.hypot((heroPos.x + 30) - (m.x + 33), (heroPos.y + 50) - (m.y + 33));
            if (dist < minDist && dist <= threshold) {
                minDist = dist;
                nearest = m;
            }
        }
        return nearest;
    }

    function updateHeroPosition() {
        if (!playerKnight) return;
        
        // Clamped walkable area of isometric dungeon floor
        heroPos.x = Math.max(130, Math.min(680, heroPos.x));
        heroPos.y = Math.max(140, Math.min(350, heroPos.y));
        
        playerKnight.style.left = `${heroPos.x}px`;
        playerKnight.style.top = `${heroPos.y}px`;
        
        if (heroFacing === -1) {
            playerKnight.classList.add('facing-left');
        } else {
            playerKnight.classList.remove('facing-left');
        }
        
        // Check proximity to monsters
        const nearMonster = getNearestMonster(95);
        if (nearMonster) {
            if (spaceTooltip) {
                spaceTooltip.textContent = `[SPACE] ATTACK ${nearMonster.name.toUpperCase()}`;
                spaceTooltip.classList.remove('hidden');
            }
        } else {
            if (spaceTooltip) {
                spaceTooltip.classList.add('hidden');
            }
        }
    }

    function triggerHeroAttack(targetMonster) {
        if (!targetMonster) return;
        
        heroFacing = targetMonster.x < heroPos.x ? -1 : 1;
        updateHeroPosition();
        
        // Attack animation
        if (playerKnight) {
            playerKnight.style.transform = `scale(1.15) translateX(${heroFacing * 14}px)`;
        }
        if (heroSlashFx) {
            heroSlashFx.classList.remove('hidden');
        }
        
        const monsterElem = document.getElementById(targetMonster.id);
        if (monsterElem) {
            monsterElem.classList.add('hit');
        }
        
        logMessage(`> Attacking ${targetMonster.name}! Engaging combat...`, "gold");
        
        setTimeout(() => {
            if (playerKnight) playerKnight.style.transform = '';
            if (heroSlashFx) heroSlashFx.classList.add('hidden');
            if (monsterElem) monsterElem.classList.remove('hit');
            
            startBattle(playerState.current_quest, targetMonster.diff);
        }, 260);
    }

    // Keyboard movement event listener
    window.addEventListener('keydown', (e) => {
        if ((battleModal && battleModal.style.display === 'flex') || (gameAlert && gameAlert.style.display === 'flex')) {
            return;
        }
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT')) {
            return;
        }

        const step = 14;
        let moved = false;

        if (e.key === 'ArrowUp' || e.code === 'KeyW') {
            heroPos.y -= step;
            moved = true;
        } else if (e.key === 'ArrowDown' || e.code === 'KeyS') {
            heroPos.y += step;
            moved = true;
        } else if (e.key === 'ArrowLeft' || e.code === 'KeyA') {
            heroPos.x -= step;
            heroFacing = -1;
            moved = true;
        } else if (e.key === 'ArrowRight' || e.code === 'KeyD') {
            heroPos.x += step;
            heroFacing = 1;
            moved = true;
        } else if (e.code === 'Space') {
            e.preventDefault();
            const nearMonster = getNearestMonster(110);
            if (nearMonster) {
                triggerHeroAttack(nearMonster);
            } else {
                if (heroSlashFx) {
                    heroSlashFx.classList.remove('hidden');
                    setTimeout(() => heroSlashFx.classList.add('hidden'), 220);
                }
                logMessage("> Swung sword in thin air! Move closer to a monster to strike.", "standard");
            }
            return;
        }

        if (moved) {
            e.preventDefault();
            if (playerKnight) {
                playerKnight.classList.add('walking');
                clearTimeout(walkAnimTimeout);
                walkAnimTimeout = setTimeout(() => {
                    playerKnight.classList.remove('walking');
                }, 160);
            }
            updateHeroPosition();
        }
    });

    // Click on dungeon floor to move hero
    if (dungeonStage) {
        dungeonStage.addEventListener('click', (e) => {
            if (e.target.closest('.target-monster') || e.target.closest('button')) return;
            const rect = dungeonStage.getBoundingClientRect();
            const targetX = e.clientX - rect.left - 30;
            const targetY = e.clientY - rect.top - 50;
            
            heroFacing = targetX < heroPos.x ? -1 : 1;
            heroPos.x = targetX;
            heroPos.y = targetY;
            
            if (playerKnight) {
                playerKnight.classList.add('walking');
                setTimeout(() => playerKnight.classList.remove('walking'), 220);
            }
            updateHeroPosition();
        });
    }

    // Direct monster click to engage
    targetMonsters.forEach(monster => {
        monster.addEventListener('click', (e) => {
            e.stopPropagation();
            const diff = monster.getAttribute('data-difficulty');
            const target = monstersData[diff];
            triggerHeroAttack(target || { id: monster.id, name: diff.toUpperCase(), diff: diff, x: heroPos.x, y: heroPos.y });
        });
    });

    async function startBattle(topic, diff) {
        const cleanTopic = (topic || '').replace(/^\d+[\.\)]\s*/, '').trim();
        const diffQuestions = await fetchQuestionsFromDB(cleanTopic, diff);
        
        let maxHp = diff === 'easy' ? 100 : (diff === 'medium' ? 150 : 200);
        let monsterName = diff === 'easy' ? "SLIME OF VARIABLES" : (diff === 'medium' ? "SKELETON OF OPERATORS" : "BEHOLDER OF CONDITIONALS");

        if (!diffQuestions || diffQuestions.length === 0) {
            logMessage(`> No encounters found for ${diff.toUpperCase()} on this floor.`, "err");
            showAlert("No Encounters", `No questions found for ${diff.toUpperCase()}. Please select another chapter.`);
            return;
        }

        const unsolved = diffQuestions.filter(q => !playerState.completed_questions.includes(q.id.toString()));
        
        if (unsolved.length === 0) {
            logMessage(`> The ${monsterName} has already been defeated on this floor.`, "standard");
            showAlert("Monster Defeated", `The ${monsterName} is already slain! Select a different difficulty or chapter.`);
            return;
        }

        if (playerState.hp <= 0) {
            logMessage("> You are too weak to fight! Consume an HP Potion first.", "err");
            showAlert("Low Health", "Your HP is 0! Drink an HP Potion from Quick Slots before combat.");
            return;
        }

        currentBattle.active = true;
        currentBattle.difficulty = diff;
        currentBattle.questions = unsolved; // Load the actual questions for this difficulty
        currentBattle.currentIndex = 0;
        currentBattle.maxMonsterHp = maxHp;
        currentBattle.monsterHp = maxHp;
        currentBattle.isAnswering = false;

        if (battleModal) battleModal.style.display = 'flex';
        
        // Hide return button while actively in combat
        if (battleCloseBtn) {
            battleCloseBtn.classList.add('hidden');
        }
        
        if (battleStatusText) {
            battleStatusText.textContent = `> Engaged ${monsterName}! Answer questions to strike.`;
        }
        
        if (battleHeaderDiff) battleHeaderDiff.textContent = `${diff.toUpperCase()} CHALLENGE`;
        if (battleHeaderMonster) battleHeaderMonster.textContent = monsterName;
        if (arenaMonsterLabel) arenaMonsterLabel.textContent = diff === 'easy' ? "SLIME" : (diff === 'medium' ? "SKELETON" : "BEHOLDER");
        
        const arenaMonsterImg = document.getElementById('arena-monster-img');
        if (arenaMonsterImg) {
            if (diff === 'easy') arenaMonsterImg.src = '/static/slime.png';
            if (diff === 'medium') arenaMonsterImg.src = '/static/skeleton.png';
            if (diff === 'hard') arenaMonsterImg.src = '/static/beholder.png';
        }

        updateBattleHp();
        loadBattleQuestion();
    }

    function updateBattleHp() {
        if (!arenaMonsterHpText || !arenaMonsterHpFill) return;
        arenaMonsterHpText.textContent = `${currentBattle.monsterHp}/${currentBattle.maxMonsterHp} HP`;
        const percent = Math.max(0, Math.min(100, (currentBattle.monsterHp / currentBattle.maxMonsterHp) * 100));
        arenaMonsterHpFill.style.width = `${percent}%`;
    }

    function setupMcqListeners() {
        if (!battleMcqChoices) return;
        const choiceBtns = battleMcqChoices.querySelectorAll('.choice-btn');
        choiceBtns.forEach((btn, index) => {
            btn.onclick = () => {
                if (currentBattle.isAnswering) return;
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                const choiceText = btn.textContent.replace(/^[A-D]\)\s*/, '').trim();
                submitAnswer(letter, choiceText);
            };
        });
    }

    function loadBattleQuestion() {
        if (!currentBattle.active) return;
        if (currentBattle.currentIndex >= currentBattle.questions.length) {
            endBattle(true);
            return;
        }

        const q = currentBattle.questions[currentBattle.currentIndex];
        currentBattle.currentQuestion = q;
        currentBattle.isAnswering = false; // Allow answering

        if (battleQNum) battleQNum.textContent = `Question ${currentBattle.currentIndex + 1} of ${currentBattle.questions.length}`;
        if (battleQTopic) battleQTopic.textContent = (q.topic || playerState.current_quest).toUpperCase();
        if (battleQText) battleQText.textContent = q.question;

        const codeText = q.code_snippet || q.code;
        if (codeText && codeText.trim() !== '') {
            if (battleCodeContainer) battleCodeContainer.classList.remove('hidden');
            if (battleCodeContent) battleCodeContent.textContent = codeText;
        } else {
            if (battleCodeContainer) battleCodeContainer.classList.add('hidden');
        }

        const qType = (q.question_type || q.type || 'mcq').toLowerCase();

        if (qType === 'mcq') {
            if (battleMcqChoices) battleMcqChoices.classList.remove('hidden');
            if (battleFitbInputContainer) battleFitbInputContainer.classList.add('hidden');
            
            const choiceBtns = battleMcqChoices.querySelectorAll('.choice-btn');
            let opts = [];
            if (q.options) {
                if (Array.isArray(q.options)) {
                    opts = q.options;
                } else {
                    opts = [q.options.A, q.options.B, q.options.C, q.options.D];
                }
            }

            for (let i = 0; i < 4; i++) {
                if (opts[i] !== undefined && opts[i] !== null && opts[i] !== '') {
                    choiceBtns[i].classList.remove('hidden');
                    choiceBtns[i].textContent = `${String.fromCharCode(65 + i)}) ${opts[i]}`;
                    choiceBtns[i].disabled = false;
                } else {
                    choiceBtns[i].classList.add('hidden');
                }
            }

            setupMcqListeners();

        } else {
            if (battleMcqChoices) battleMcqChoices.classList.add('hidden');
            if (battleFitbInputContainer) battleFitbInputContainer.classList.remove('hidden');
            if (battleFitbInput) {
                battleFitbInput.value = '';
                battleFitbInput.disabled = false;
                battleFitbInput.focus();
            }
        }
    }

    if (battleFitbSubmit) {
        battleFitbSubmit.addEventListener('click', () => {
            if (currentBattle.isAnswering) return;
            if (battleFitbInput) submitAnswer(battleFitbInput.value.trim());
        });
    }
    
    if (battleFitbInput) {
        battleFitbInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (currentBattle.isAnswering) return;
                submitAnswer(battleFitbInput.value.trim());
            }
        });
    }

    function submitAnswer(userLetter, userText = '') {
        if (!currentBattle.active || currentBattle.isAnswering) return;
        const q = currentBattle.currentQuestion;
        if (!q) return;

        currentBattle.isAnswering = true; // Debounce so multiple clicks don't double fire

        const qType = (q.question_type || q.type || 'mcq').toLowerCase();
        
        // Retrieve possible answer strings from DB / questions.js
        const dbCorrectOpt = (q.correct_option || q.answer || '').toString().trim().toUpperCase();
        const dbCorrectAns = (q.correct_answer || q.answer || '').toString().trim().toUpperCase();

        let isCorrect = false;

        if (qType === 'mcq') {
            const letterClicked = userLetter.toUpperCase().trim();
            const optionKey = `OPTION_${letterClicked}`;
            const textClicked = userText.toUpperCase().trim();

            let selectedOptText = "";
            if (q.options) {
                if (Array.isArray(q.options)) {
                    const idx = letterClicked.charCodeAt(0) - 65;
                    selectedOptText = (q.options[idx] || '').toString().toUpperCase().trim();
                } else {
                    selectedOptText = (q.options[letterClicked] || q.options[optionKey] || '').toString().toUpperCase().trim();
                }
            }

            if (
                letterClicked === dbCorrectOpt ||
                optionKey === dbCorrectOpt ||
                letterClicked === dbCorrectAns ||
                (textClicked !== '' && textClicked === dbCorrectAns) ||
                (selectedOptText !== '' && selectedOptText === dbCorrectAns)
            ) {
                isCorrect = true;
            }
        } else {
            const cleanUser = userLetter.toLowerCase().replace(/['"]/g, '').trim();
            const cleanAns = dbCorrectAns.toLowerCase().replace(/['"]/g, '').trim();
            isCorrect = (cleanUser === cleanAns);
        }

        if (isCorrect) {
            handlePlayerAttack();
        } else {
            handleMonsterAttack();
        }
    }

    function handlePlayerAttack() {
        const q = currentBattle.currentQuestion;
        
        const qIdStr = (q.id || '').toString();
        if (qIdStr && !playerState.completed_questions.includes(qIdStr)) {
            playerState.completed_questions.push(qIdStr);
        }

        const totalQ = currentBattle.questions.length || 1;
        const dmg = Math.ceil(currentBattle.maxMonsterHp / totalQ);
        
        currentBattle.monsterHp = Math.max(0, currentBattle.monsterHp - dmg);
        updateBattleHp();

        const monsterSlash = document.getElementById('monster-slash');
        const monsterDmgPopup = document.getElementById('monster-dmg-popup');
        
        if (monsterSlash) monsterSlash.classList.add('active');
        if (monsterDmgPopup) {
            monsterDmgPopup.textContent = `-${dmg}`;
            monsterDmgPopup.classList.add('active');
        }
        
        if (arenaMonsterSprite) arenaMonsterSprite.classList.add('flash-dmg');

        if (battleStatusText) battleStatusText.textContent = `> CRITICAL STRIKE! Correct! You dealt ${dmg} damage!`;
        logMessage(`> Correct answer! Dealt ${dmg} damage to monster!`, "standard");

        setTimeout(() => {
            if (monsterSlash) monsterSlash.classList.remove('active');
            if (monsterDmgPopup) monsterDmgPopup.classList.remove('active');
            if (arenaMonsterSprite) arenaMonsterSprite.classList.remove('flash-dmg');
            
            currentBattle.currentIndex++;
            if (currentBattle.monsterHp <= 0 || currentBattle.currentIndex >= currentBattle.questions.length) {
                endBattle(true);
            } else {
                loadBattleQuestion(); // ADVANCE TO THE NEXT QUESTION!
            }
        }, 650);
    }

    function handleMonsterAttack() {
        let penaltyDmg = 10;
        if (currentBattle.difficulty === 'medium') penaltyDmg = 20;
        if (currentBattle.difficulty === 'hard') penaltyDmg = 30;

        playerState.hp = Math.max(0, playerState.hp - penaltyDmg);
        renderUI();

        const playerSlash = document.getElementById('player-slash');
        const playerDmgPopup = document.getElementById('player-dmg-popup');
        
        if (playerSlash) playerSlash.classList.add('active');
        if (playerDmgPopup) {
            playerDmgPopup.textContent = `-${penaltyDmg}`;
            playerDmgPopup.classList.add('active');
        }
        
        if (battleWindow) battleWindow.classList.add('shake');
        logMessage(`> Incorrect! Monster strikes back, dealing ${penaltyDmg} damage!`, "err");

        if (battleStatusText) battleStatusText.textContent = `> INCORRECT! The monster counters and strikes you for ${penaltyDmg} HP!`;

        setTimeout(() => {
            if (playerSlash) playerSlash.classList.remove('active');
            if (playerDmgPopup) playerDmgPopup.classList.remove('active');
            if (battleWindow) battleWindow.classList.remove('shake');
            currentBattle.isAnswering = false;

            if (playerState.hp <= 0) {
                endBattle(false);
            }
        }, 750);
    }

    function endBattle(victory) {
        currentBattle.active = false;
        
        // Unhide RETURN TO MAP button on combat end
        if (battleCloseBtn) battleCloseBtn.classList.remove('hidden');

        if (victory) {
            let xpReward = 50;
            let goldReward = 20;
            let monsterLabelName = "Slime of Variables";
            
            if (currentBattle.difficulty === 'medium') {
                xpReward = 100;
                goldReward = 50;
                monsterLabelName = "Skeleton of Operators";
            } else if (currentBattle.difficulty === 'hard') {
                xpReward = 200;
                goldReward = 100;
                monsterLabelName = "Beholder of Conditionals";
            }

            playerState.xp += xpReward;
            playerState.gold += goldReward;

            logMessage(`> VICTORY! Slain the ${monsterLabelName}!`, "gold");
            logMessage(`> Earned rewards: +${xpReward} XP, +${goldReward} GP!`, "gold");

            if (battleStatusText) {
                battleStatusText.textContent = `> VICTORY! You have slain the monster! Earned: +${xpReward} XP, +${goldReward} GP!`;
            }
            
            let xpRequired = playerState.level * 1000;
            if (playerState.xp >= xpRequired) {
                playerState.xp -= xpRequired;
                playerState.level++;
                playerState.hp = 100;
                logMessage(`> LEVEL UP! Reached Level ${playerState.level}! Health fully restored.`, "gold");
                showLevelUpAlert();
            }

            // Immediately mark monster slayed on the isometric map
            const diff = currentBattle.difficulty;
            const monsterElem = document.getElementById(`monster-${diff}`);
            if (monsterElem) {
                monsterElem.classList.add('defeated');
                const hpLabel = document.getElementById(`monster-${diff}-hp`);
                if (hpLabel) {
                    hpLabel.textContent = "SLAYED";
                    hpLabel.style.color = '#777';
                }
            }
            const questTag = document.getElementById(`quest-tag-${diff}`);
            if (questTag) {
                questTag.textContent = "[DEFEATED]";
                questTag.className = "quest-status-tag text-green";
            }

            renderUI();
            updateMonsterStatus();
            saveGameState();
        } else {
            logMessage("> DEFEATED! You collapsed on the dungeon floor...", "err");
            
            playerState.hp = 50;
            const goldLoss = Math.floor(playerState.gold * 0.1);
            playerState.gold = Math.max(0, playerState.gold - goldLoss);
            
            logMessage(`> Revived at Dungeon Hub. HP set to 50. Lost ${goldLoss} GP penalty.`, "err");
            if (battleStatusText) battleStatusText.textContent = `> DEFEATED! You fainted! Revived at Dungeon Hub. GP penalty: -${goldLoss} GP.`;
            
            renderUI();
            updateMonsterStatus();
            saveGameState();
            
            showAlert("Fainted", `You fainted in combat! The merchant dragged you back to the hub. You lost 10% of your Gold (${goldLoss} GP). HP restored to 50.`);
        }
    }

   // Close / Return to Map click listener
    if (battleCloseBtn) {
        battleCloseBtn.addEventListener('click', () => {
            currentBattle.active = false;
            if (battleModal) {
                battleModal.style.display = 'none';
            }
            logMessage("> Returned to Map.");
        });
    }

    // Tab Navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.getAttribute('data-tab');
            
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `tab-content-${tabName}`) {
                    pane.classList.add('active');
                }
            });
            
            sidebarNavBtns.forEach(btn => btn.classList.remove('active'));
            if (tabName === 'quest') {
                document.querySelector('[data-tab-nav="quests-nav"]')?.classList.add('active');
            } else if (tabName === 'equipment') {
                document.querySelector('[data-tab-nav="inventory-nav"]')?.classList.add('active');
            }
        });
    });

    sidebarNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sidebarNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const navType = btn.getAttribute('data-tab-nav');
            if (navType === 'quests-nav') {
                document.querySelector('[data-tab="quest"]')?.click();
            } else if (navType === 'inventory-nav') {
                document.querySelector('[data-tab="equipment"]')?.click();
            } else if (navType === 'skills-nav') {
                document.querySelector('[data-tab="lore"]')?.click();
                logMessage("> Skill Tree: Locked. Earn levels to unlock advanced algorithms.");
                showAlert("Skill Tree", "Syntactic Strike, Loop Whirlwind, and Binary Pierce are unlocked! Level up to rank them up.");
            } else if (navType === 'map-nav') {
                showAlert("World Map", "Floor 1: The Foundation [Active]<br>Floor 2: Recursion Crypt [Locked]<br>Floor 3: Dynamic Temple [Locked]");
            } else if (navType === 'log-nav') {
                adventureLog?.scrollIntoView({ behavior: 'smooth' });
                logMessage("> Reviewing dungeon adventure files...");
            }
        });
    });

    if (chapterSelect) {
        chapterSelect.addEventListener('change', async () => {
            playerState.current_quest = chapterSelect.value;
            logMessage(`> Navigated to Chapter: ${chapterSelect.options[chapterSelect.selectedIndex].text.replace(/^\d+\.\s*/, '')}`);
            await renderUI();
            await updateMonsterStatus();
            await saveGameState();
        });
    }

    if (slotPotion) {
        slotPotion.addEventListener('click', () => {
            if (playerState.potions <= 0) {
                logMessage("> You don't have any HP Potions left!", "err");
                showAlert("No Potions", "You don't have any potions. Visit Equipment Vault to buy more using GP.");
                return;
            }

            if (playerState.hp >= 100) {
                logMessage("> Your health is already full!", "standard");
                return;
            }

            playerState.potions--;
            playerState.hp = Math.min(100, playerState.hp + 50);
            
            logMessage(`> Drank HP Potion: Restored 50 Health!`, "standard");
            renderUI();
            saveGameState();
        });
    }

    if (buyPotionBtn) {
        buyPotionBtn.addEventListener('click', () => {
            const cost = 50;
            if (playerState.gold < cost) {
                logMessage("> Not enough Gold coins to buy potion!", "err");
                showAlert("Insufficient Gold", "HP Potion costs 50 GP. Solve more coding challenges to earn gold!");
                return;
            }

            playerState.gold -= cost;
            playerState.potions++;
            
            logMessage(`> Bought 1x HP Potion from merchant vault. (-50 GP)`, "gold");
            renderUI();
            saveGameState();
        });
    }

    if (quickUpgradeBtn) {
        quickUpgradeBtn.addEventListener('click', () => {
            document.querySelector('[data-tab="equipment"]')?.click();
            logMessage("> Visited the merchant's vault.");
        });
    }

    function showAlert(title, message) {
        if (alertTitle) alertTitle.textContent = title;
        if (alertMsg) alertMsg.innerHTML = message;
        if (gameAlert) gameAlert.style.display = 'flex';
    }

    function showLevelUpAlert() {
        if (alertTitle) {
            alertTitle.textContent = "LEVEL UP!";
            alertTitle.className = "alert-title text-gold";
        }
        if (alertMsg) {
            alertMsg.innerHTML = `Congratulations!<br>You reached <strong>Level ${playerState.level} Coder</strong>!<br>Your HP has been fully restored to 100.`;
        }
        if (gameAlert) gameAlert.style.display = 'flex';
    }

    if (alertOkBtn) {
        alertOkBtn.addEventListener('click', () => {
            if (gameAlert) gameAlert.style.display = 'none';
        });
    }

    loadGameState();
});