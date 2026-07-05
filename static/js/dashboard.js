document.addEventListener('DOMContentLoaded', () => {
    // ==================== GAME STATE ====================
    let playerState = {
        level: 1,
        xp: 0,
        gold: 1250,
        hp: 100,
        completed_questions: [],
        current_quest: "variables", // Active chapter topic
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
    // Sidebar Elements
    const heroName = document.getElementById('hero-name');
    const heroLevelLabel = document.getElementById('hero-level-label');
    const hpText = document.getElementById('hp-text');
    const hpProgressBar = document.getElementById('hp-progress-bar');
    const xpText = document.getElementById('xp-text');
    const xpProgressBar = document.getElementById('xp-progress-bar');
    const goldAmount = document.getElementById('gold-amount');
    const sidebarNavBtns = document.querySelectorAll('.sidebar-btn');

    // Tab Contents & Header Navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const chapterSelect = document.getElementById('chapter-select');
    const floorProgressText = document.getElementById('floor-progress-text');
    const currentQuestTitle = document.getElementById('current-quest-title');
    const adventureLog = document.getElementById('adventure-log');

    // Potion slots & Shop
    const slotPotion = document.getElementById('slot-potion');
    const potionCount = document.getElementById('potion-count');
    const quickUpgradeBtn = document.getElementById('quick-upgrade-btn');
    const buyPotionBtn = document.querySelector('.buy-potion-btn');

    // Monsters on Floor
    const monsterEasy = document.getElementById('monster-easy');
    const monsterMedium = document.getElementById('monster-medium');
    const monsterHard = document.getElementById('monster-hard');
    const targetMonsters = document.querySelectorAll('.target-monster');

    // Battle Modal Elements
    const battleModal = document.getElementById('battle-modal');
    const battleWindow = battleModal.querySelector('.battle-window');
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

    // Popups
    const gameAlert = document.getElementById('game-alert');
    const alertTitle = document.getElementById('alert-title');
    const alertMsg = document.getElementById('alert-msg');
    const alertOkBtn = document.getElementById('alert-ok-btn');

    // ==================== CORE INITIALIZATION ====================
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
                    
                    // Parse completed questions
                    if (data.completed_questions) {
                        playerState.completed_questions = data.completed_questions.split(',').filter(x => x.trim() !== '');
                    } else {
                        playerState.completed_questions = [];
                    }
                    
                    // Potion count stored in session/localStorage
                    playerState.potions = parseInt(localStorage.getItem('potions') || "5");
                    playerState.current_quest = localStorage.getItem('current_quest') || "variables";
                }
            }
        } catch (err) {
            console.warn("Could not fetch state from API, using LocalStorage backup.", err);
            // Load from LocalStorage fallback
            const localState = localStorage.getItem('algo_quest_player_state');
            if (localState) {
                playerState = JSON.parse(localState);
            }
        }
        
        // Sync inputs
        chapterSelect.value = playerState.current_quest;
        logMessage("> Syncing adventurer files from database...");
        logMessage(`> Logged in as ${heroName.textContent}. HP restored/synced.`);
        
        renderUI();
        updateMonsterStatus();
    }

    async function saveGameState() {
        // Save to LocalStorage
        localStorage.setItem('algo_quest_player_state', JSON.stringify(playerState));
        localStorage.setItem('potions', playerState.potions.toString());
        localStorage.setItem('current_quest', playerState.current_quest);

        // Save to Database via API
        try {
            await fetch('/api/state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

    // ==================== RENDERING & UI UPDATES ====================
    function renderUI() {
        // Gold GP
        goldAmount.textContent = playerState.gold.toLocaleString();

        // Level
        heroLevelLabel.textContent = `Level ${playerState.level} Coder`;

        // HP Bar
        hpText.textContent = `${playerState.hp}/100`;
        const hpPercent = Math.max(0, Math.min(100, playerState.hp));
        hpProgressBar.querySelector('.hp-segment').style.width = `${hpPercent}%`;
        
        // HP Bar Color adjust
        const hpSegment = hpProgressBar.querySelector('.hp-segment');
        if (hpPercent > 50) {
            hpSegment.className = "hp-segment filled bg-green";
        } else if (hpPercent > 20) {
            hpSegment.className = "hp-segment filled bg-gold";
        } else {
            hpSegment.className = "hp-segment filled bg-red";
        }

        // XP Bar
        const xpRequired = playerState.level * 1000;
        xpText.textContent = `${playerState.xp}/${xpRequired}`;
        const xpPercent = Math.max(0, Math.min(100, (playerState.xp / xpRequired) * 100));
        xpProgressBar.querySelector('.hp-segment').style.width = `${xpPercent}%`;

        // Potion quick slot count
        potionCount.textContent = `x${playerState.potions}`;

        // Select active topic header
        const activeTopicName = chapterSelect.options[chapterSelect.selectedIndex].text.substring(3);
        currentQuestTitle.textContent = activeTopicName;

        // Floor progress summary text
        const floorDefeats = getFloorDefeatsCount(playerState.current_quest);
        floorProgressText.textContent = `${floorDefeats} / 3 Monsters Defeated`;
    }

    function logMessage(text, type = "standard") {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        adventureLog.appendChild(line);
        adventureLog.scrollTop = adventureLog.scrollHeight;
    }

    function getFloorDefeatsCount(topic) {
        let count = 0;
        const difficulties = ['easy', 'medium', 'hard'];
        difficulties.forEach(diff => {
            const diffQuestions = QUESTIONS.filter(q => q.topic === topic && q.difficulty === diff);
            const completedDiffQuestions = diffQuestions.filter(q => playerState.completed_questions.includes(q.id));
            if (diffQuestions.length > 0 && completedDiffQuestions.length === diffQuestions.length) {
                count++;
            }
        });
        return count;
    }

    function updateMonsterStatus() {
        const topic = playerState.current_quest;
        const difficulties = ['easy', 'medium', 'hard'];
        
        difficulties.forEach(diff => {
            const diffQuestions = QUESTIONS.filter(q => q.topic === topic && q.difficulty === diff);
            const completedDiffQuestions = diffQuestions.filter(q => playerState.completed_questions.includes(q.id));
            const monsterContainer = document.getElementById(`monster-${diff}`);
            const hpLabel = document.getElementById(`monster-${diff}-hp`);
            
            let maxHp = diff === 'easy' ? 100 : (diff === 'medium' ? 150 : 200);
            
            if (diffQuestions.length === 0) {
                monsterContainer.classList.add('hidden');
                return;
            } else {
                monsterContainer.classList.remove('hidden');
            }

            let unsolvedCount = diffQuestions.length - completedDiffQuestions.length;
            let currentHp = Math.ceil((unsolvedCount / diffQuestions.length) * maxHp);
            hpLabel.textContent = `${currentHp}/${maxHp} HP`;

            if (currentHp === 0) {
                monsterContainer.style.opacity = '0.35';
                monsterContainer.querySelector('.monster-name-tag').style.borderColor = '#444';
                hpLabel.textContent = "SLAYED";
                hpLabel.style.color = '#777';
            } else {
                monsterContainer.style.opacity = '1';
                hpLabel.style.color = '#fff';
                // Reset tag border colors
                const tag = monsterContainer.querySelector('.monster-name-tag');
                if (diff === 'easy') tag.className = 'monster-name-tag border-green';
                if (diff === 'medium') tag.className = 'monster-name-tag border-gold';
                if (diff === 'hard') tag.className = 'monster-name-tag border-red';
            }
        });
    }

    // ==================== NAVIGATION & TAB TOGGLING ====================
    // Header navigation links switcher
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
            
            // Sync with sidebar nav selection
            sidebarNavBtns.forEach(btn => btn.classList.remove('active'));
            if (tabName === 'quest') {
                document.querySelector('[data-tab-nav="quests-nav"]').classList.add('active');
            } else if (tabName === 'equipment') {
                document.querySelector('[data-tab-nav="inventory-nav"]').classList.add('active');
            }
        });
    });

    // Sidebar navigation buttons switcher
    sidebarNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sidebarNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const navType = btn.getAttribute('data-tab-nav');
            
            // Map sidebar tabs to main screen views
            if (navType === 'quests-nav') {
                // Switch to Quests tab
                document.querySelector('[data-tab="quest"]').click();
            } else if (navType === 'inventory-nav') {
                // Switch to Equipment tab
                document.querySelector('[data-tab="equipment"]').click();
            } else if (navType === 'skills-nav') {
                document.querySelector('[data-tab="lore"]').click(); // Just fallback to lore or show inline alert
                logMessage("> Skill Tree: Locked. Earn levels to unlock advanced algorithms.");
                showAlert("Skill Tree", "Syntactic Strike, Loop Whirlwind, and Binary Pierce are unlocked! Level up to rank them up.");
            } else if (navType === 'map-nav') {
                showAlert("World Map", "Floor 1: The Foundation [Active]<br>Floor 2: Recursion Crypt [Locked]<br>Floor 3: Dynamic Temple [Locked]");
            } else if (navType === 'log-nav') {
                // Scroll straight to log terminal
                adventureLog.scrollIntoView({ behavior: 'smooth' });
                logMessage("> Reviewing dungeon adventure files...");
            }
        });
    });

    // Chapter dropdown select listener
    chapterSelect.addEventListener('change', () => {
        playerState.current_quest = chapterSelect.value;
        logMessage(`> Navigated to Chapter: ${chapterSelect.options[chapterSelect.selectedIndex].text.substring(3)}`);
        renderUI();
        updateMonsterStatus();
        saveGameState();
    });

    // ==================== BATTLE SYSTEM ====================
    // Engage monster trigger
    targetMonsters.forEach(monster => {
        monster.addEventListener('click', () => {
            const diff = monster.getAttribute('data-difficulty');
            startBattle(playerState.current_quest, diff);
        });
    });

    function startBattle(topic, diff) {
        const diffQuestions = QUESTIONS.filter(q => q.topic === topic && q.difficulty === diff);
        const unsolved = diffQuestions.filter(q => !playerState.completed_questions.includes(q.id));
        
        let maxHp = diff === 'easy' ? 100 : (diff === 'medium' ? 150 : 200);
        let monsterName = diff === 'easy' ? "SLIME OF VARIABLES" : (diff === 'medium' ? "SKELETON OF OPERATORS" : "BEHOLDER OF CONDITIONALS");
        
        if (unsolved.length === 0) {
            logMessage(`> The ${monsterName} has already been defeated on this floor.`, "standard");
            showAlert("Monster Defeated", `The ${monsterName} is already slain! Select a different difficulty or chapter.`);
            return;
        }

        if (playerState.hp <= 0) {
            logMessage("> You are too weak to fight! Consume an HP Potion first.", "err");
            showAlert("Low Health", "Your HP is 0! Please drink an HP Potion from your Quick Slots or buy one from the Merchant Vault before engaging in combat.");
            return;
        }

        // Initialize battle state
        currentBattle.active = true;
        currentBattle.difficulty = diff;
        currentBattle.questions = unsolved;
        currentBattle.currentIndex = 0;
        currentBattle.maxMonsterHp = maxHp;
        currentBattle.monsterHp = Math.ceil((unsolved.length / diffQuestions.length) * maxHp);
        
        // Open Battle Modal
        battleModal.style.display = 'flex';
        battleCloseBtn.classList.add('hidden');
        battleStatusText.textContent = `> Engaged ${monsterName}! Answer questions to deal damage.`;
        
        // Adjust Battle Arena Styles
        battleHeaderDiff.textContent = `${diff.toUpperCase()} CHALLENGE`;
        battleHeaderMonster.textContent = monsterName;
        arenaMonsterLabel.textContent = diff === 'easy' ? "SLIME" : (diff === 'medium' ? "SKELETON" : "BEHOLDER");
        
        // Sprite class setup
        arenaMonsterSprite.className = "monster-sprite animated-breathing";
        if (diff === 'easy') arenaMonsterSprite.classList.add('green-slime-sprite');
        if (diff === 'medium') arenaMonsterSprite.classList.add('skeleton-sprite');
        if (diff === 'hard') arenaMonsterSprite.classList.add('beholder-sprite');

        updateBattleHp();
        loadBattleQuestion();
    }

    function updateBattleHp() {
        arenaMonsterHpText.textContent = `${currentBattle.monsterHp}/${currentBattle.maxMonsterHp} HP`;
        const percent = Math.max(0, Math.min(100, (currentBattle.monsterHp / currentBattle.maxMonsterHp) * 100));
        arenaMonsterHpFill.style.width = `${percent}%`;
    }

    function loadBattleQuestion() {
        if (currentBattle.currentIndex >= currentBattle.questions.length) {
            endBattle(true);
            return;
        }

        const q = currentBattle.questions[currentBattle.currentIndex];
        currentBattle.currentQuestion = q;

        // Render Q Text
        battleQNum.textContent = `Question ${currentBattle.currentIndex + 1} of ${currentBattle.questions.length}`;
        battleQTopic.textContent = q.topic.toUpperCase();
        battleQText.textContent = q.question;

        // Render Code block if any
        if (q.code) {
            battleCodeContainer.classList.remove('hidden');
            battleCodeContent.textContent = q.code;
        } else {
            battleCodeContainer.classList.add('hidden');
        }

        // Render Input panel
        if (q.type === 'mcq') {
            battleMcqChoices.classList.remove('hidden');
            battleFitbInputContainer.classList.add('hidden');
            
            const choiceBtns = battleMcqChoices.querySelectorAll('.choice-btn');
            for (let i = 0; i < 4; i++) {
                if (q.options && q.options[i]) {
                    choiceBtns[i].classList.remove('hidden');
                    choiceBtns[i].textContent = `${String.fromCharCode(65 + i)}) ${q.options[i]}`;
                } else {
                    choiceBtns[i].classList.add('hidden');
                }
            }
        } else {
            battleMcqChoices.classList.add('hidden');
            battleFitbInputContainer.classList.remove('hidden');
            battleFitbInput.value = '';
            battleFitbInput.focus();
        }
    }

    // MCQ answer click listener
    const choiceBtns = battleMcqChoices.querySelectorAll('.choice-btn');
    choiceBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            submitAnswer(letter);
        });
    });

    // FITB answer submit listener
    battleFitbSubmit.addEventListener('click', () => {
        submitAnswer(battleFitbInput.value.trim());
    });
    
    battleFitbInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAnswer(battleFitbInput.value.trim());
        }
    });

    function submitAnswer(userAnswer) {
        const q = currentBattle.currentQuestion;
        const isMcq = q.type === 'mcq';
        let isCorrect = false;

        if (isMcq) {
            // Compare letters (A, B, C, D)
            isCorrect = (userAnswer.toUpperCase() === q.answer.toUpperCase());
        } else {
            // String comparison (case insensitive, trim spaces, remove quotes if user added them)
            const cleanUser = userAnswer.toLowerCase().replace(/['"]/g, '').trim();
            const cleanAns = q.answer.toLowerCase().replace(/['"]/g, '').trim();
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
        
        // Mark question completed
        if (!playerState.completed_questions.includes(q.id)) {
            playerState.completed_questions.push(q.id);
        }

        // Calculate damage
        const diffQuestionsCount = QUESTIONS.filter(qs => qs.topic === q.topic && qs.difficulty === currentBattle.difficulty).length;
        const dmg = Math.ceil(currentBattle.maxMonsterHp / diffQuestionsCount);
        
        currentBattle.monsterHp = Math.max(0, currentBattle.monsterHp - dmg);
        updateBattleHp();

        // Visual effects (Slash on monster)
        const monsterSlash = document.getElementById('monster-slash');
        const monsterDmgPopup = document.getElementById('monster-dmg-popup');
        
        monsterSlash.classList.add('active');
        monsterDmgPopup.textContent = `-${dmg}`;
        monsterDmgPopup.classList.add('active');
        
        arenaMonsterSprite.classList.add('flash-dmg');

        battleStatusText.textContent = `> CRITICAL STRIKE! You dealt ${dmg} damage to the monster!`;
        logMessage(`> Solved "${q.id}": Dealt ${dmg} damage to Monster!`, "standard");

        setTimeout(() => {
            monsterSlash.classList.remove('active');
            monsterDmgPopup.classList.remove('active');
            arenaMonsterSprite.classList.remove('flash-dmg');
            
            // Advance Question
            currentBattle.currentIndex++;
            if (currentBattle.monsterHp <= 0) {
                endBattle(true);
            } else {
                loadBattleQuestion();
            }
        }, 1000);
    }

    function handleMonsterAttack() {
        // Calculate penalty damage to player HP
        let penaltyDmg = 10;
        if (currentBattle.difficulty === 'medium') penaltyDmg = 20;
        if (currentBattle.difficulty === 'hard') penaltyDmg = 30;

        playerState.hp = Math.max(0, playerState.hp - penaltyDmg);
        renderUI();

        // Visual effects (Slash on player, shake window)
        const playerSlash = document.getElementById('player-slash');
        const playerDmgPopup = document.getElementById('player-dmg-popup');
        
        playerSlash.classList.add('active');
        playerDmgPopup.textContent = `-${penaltyDmg}`;
        playerDmgPopup.classList.add('active');
        
        battleWindow.classList.add('shake');
        logMessage(`> Failed Question: Monster counters, dealing ${penaltyDmg} damage!`, "err");

        battleStatusText.textContent = `> MISS! The monster counters and strikes you for ${penaltyDmg} HP!`;

        setTimeout(() => {
            playerSlash.classList.remove('active');
            playerDmgPopup.classList.remove('active');
            battleWindow.classList.remove('shake');

            if (playerState.hp <= 0) {
                endBattle(false);
            }
        }, 1000);
    }

    function endBattle(victory) {
        currentBattle.active = false;
        battleCloseBtn.classList.remove('hidden');

        if (victory) {
            // Defeat Monster Rewards
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

            battleStatusText.textContent = `> VICTORY! You have slain the monster! Recycled logs: +${xpReward} XP, +${goldReward} GP!`;
            
            // Check Level up
            let xpRequired = playerState.level * 1000;
            if (playerState.xp >= xpRequired) {
                playerState.xp -= xpRequired;
                playerState.level++;
                playerState.hp = 100; // Restore health on level up!
                logMessage(`> LEVEL UP! Reached Level ${playerState.level}! Health fully restored.`, "gold");
                showLevelUpAlert();
            }

            renderUI();
            updateMonsterStatus();
            saveGameState();
        } else {
            // Player Fainted
            logMessage("> DEFEATED! You collapsed in the dungeon floor...", "err");
            
            // Penalize gold, revive at hub with 50 hp
            playerState.hp = 50;
            const goldLoss = Math.floor(playerState.gold * 0.1);
            playerState.gold = Math.max(0, playerState.gold - goldLoss);
            
            logMessage(`> Revived at Dungeon Hub. HP set to 50. Lost ${goldLoss} GP penalty.`, "err");
            
            battleStatusText.textContent = `> DEFEATED! You fainted! Revived at Dungeon Hub. GP penalty: -${goldLoss} GP.`;
            
            renderUI();
            updateMonsterStatus();
            saveGameState();
            
            showAlert("Fainted", `You fainted in combat! The merchant dragged you back to the hub. You lost 10% of your Gold (${goldLoss} GP). HP restored to 50.`);
        }
    }

    battleCloseBtn.addEventListener('click', () => {
        battleModal.style.display = 'none';
    });

    // ==================== MERCHANT & INVENTORY ====================
    // HP Potion quick slot use
    slotPotion.addEventListener('click', () => {
        if (playerState.potions <= 0) {
            logMessage("> You don't have any HP Potions left!", "err");
            showAlert("No Potions", "You don't have any potions. Visit the Equipment Merchant Vault to buy more using GP.");
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

    // Buy Potion inside Shop tab
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

    // Upgrade Gear button
    quickUpgradeBtn.addEventListener('click', () => {
        // Redirect to Merchant Equipment tab
        document.querySelector('[data-tab="equipment"]').click();
        logMessage("> Visited the merchant's vault.");
    });

    // ==================== ALERTS / MODALS ====================
    function showAlert(title, message) {
        alertTitle.textContent = title;
        alertMsg.innerHTML = message;
        gameAlert.style.display = 'flex';
    }

    function showLevelUpAlert() {
        alertTitle.textContent = "LEVEL UP!";
        alertTitle.className = "alert-title text-gold";
        alertMsg.innerHTML = `Congratulations!<br>You reached <strong>Level ${playerState.level} Coder</strong>!<br>Your HP has been fully restored to 100.`;
        gameAlert.style.display = 'flex';
    }

    alertOkBtn.addEventListener('click', () => {
        gameAlert.style.display = 'none';
    });

    // Initialize Game state
    loadGameState();
});