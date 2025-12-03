// ============ CONSTANTS ============
const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;
const WEEKS_PER_YEAR = 52;

// Education durations in weeks
const EDUCATION_DURATION = {
    high_school: 36, // Remaining senior year
    community_college: 104, // 2 years
    university: 208, // 4 years
    trade_school: 78, // 1.5 years
    military_training: 10, // Boot camp
    military_service: 156 // 3 year commitment after training
};

// ============ TRAIT DESCRIPTORS ============
const TRAIT_DESCRIPTORS = {
    height: {
        1: "Very Short", 2: "Short", 3: "Below Average", 4: "Slightly Short",
        5: "Average", 6: "Slightly Tall", 7: "Above Average", 8: "Tall", 9: "Very Tall", 10: "Towering"
    },
    build: {
        1: "Very Petite", 2: "Petite", 3: "Slender", 4: "Slim",
        5: "Average", 6: "Fit", 7: "Athletic", 8: "Curvy", 9: "Full-Figured", 10: "Plus Size"
    },
    familyWealth: {
        1: "Impoverished", 2: "Poor", 3: "Working Class", 4: "Lower Middle",
        5: "Middle Class", 6: "Upper Middle", 7: "Comfortable", 8: "Wealthy", 9: "Very Wealthy", 10: "Elite"
    },
    intelligence: {
        1: "Struggling", 2: "Slow Learner", 3: "Below Average", 4: "Slightly Below",
        5: "Average", 6: "Bright", 7: "Smart", 8: "Gifted", 9: "Brilliant", 10: "Genius"
    },
    attractiveness: {
        1: "Unfortunate", 2: "Plain", 3: "Below Average", 4: "Unremarkable",
        5: "Average", 6: "Cute", 7: "Attractive", 8: "Very Attractive", 9: "Stunning", 10: "Breathtaking"
    },
    selfControl: {
        1: "Impulsive", 2: "Weak-Willed", 3: "Easily Tempted", 4: "Struggles",
        5: "Average", 6: "Disciplined", 7: "Strong-Willed", 8: "Iron Will", 9: "Monk-like", 10: "Unshakeable"
    }
};

// ============ RETRO SOUND SYSTEM ============
let audioContext = null;
let soundEnabled = true;
let musicEnabled = false;
let musicPlaying = false;
let musicNodes = [];
let musicInterval = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// ============ BACKGROUND MUSIC ============
const MUSIC_TEMPO = 140; // BPM
const BEAT_LENGTH = 60 / MUSIC_TEMPO;

// Melody notes (frequencies in Hz) - upbeat chiptune loop
const MELODY = [
    // Bar 1
    { note: 523, duration: 0.5 },  // C5
    { note: 587, duration: 0.5 },  // D5
    { note: 659, duration: 0.5 },  // E5
    { note: 523, duration: 0.5 },  // C5
    // Bar 2
    { note: 698, duration: 0.5 },  // F5
    { note: 659, duration: 0.5 },  // E5
    { note: 587, duration: 0.5 },  // D5
    { note: 523, duration: 0.5 },  // C5
    // Bar 3
    { note: 784, duration: 0.5 },  // G5
    { note: 698, duration: 0.5 },  // F5
    { note: 659, duration: 0.5 },  // E5
    { note: 587, duration: 0.5 },  // D5
    // Bar 4
    { note: 523, duration: 1 },    // C5 (hold)
    { note: 392, duration: 0.5 },  // G4
    { note: 440, duration: 0.5 },  // A4
    // Bar 5
    { note: 494, duration: 0.5 },  // B4
    { note: 523, duration: 0.5 },  // C5
    { note: 587, duration: 0.5 },  // D5
    { note: 659, duration: 0.5 },  // E5
    // Bar 6
    { note: 698, duration: 0.5 },  // F5
    { note: 784, duration: 0.5 },  // G5
    { note: 698, duration: 0.5 },  // F5
    { note: 659, duration: 0.5 },  // E5
    // Bar 7
    { note: 587, duration: 0.5 },  // D5
    { note: 523, duration: 0.5 },  // C5
    { note: 494, duration: 0.5 },  // B4
    { note: 440, duration: 0.5 },  // A4
    // Bar 8
    { note: 392, duration: 0.5 },  // G4
    { note: 440, duration: 0.5 },  // A4
    { note: 494, duration: 0.5 },  // B4
    { note: 523, duration: 0.5 },  // C5
];

// Bass line (lower octave, simpler pattern)
const BASS = [
    { note: 131, duration: 1 },  // C3
    { note: 131, duration: 1 },
    { note: 175, duration: 1 },  // F3
    { note: 165, duration: 1 },  // E3
    { note: 196, duration: 1 },  // G3
    { note: 175, duration: 1 },  // F3
    { note: 165, duration: 1 },  // E3
    { note: 147, duration: 1 },  // D3
    { note: 131, duration: 1 },  // C3
    { note: 131, duration: 1 },
    { note: 175, duration: 1 },  // F3
    { note: 196, duration: 1 },  // G3
    { note: 165, duration: 1 },  // E3
    { note: 147, duration: 1 },  // D3
    { note: 131, duration: 1 },  // C3
    { note: 131, duration: 1 },
];

function startMusic() {
    if (musicPlaying || !musicEnabled) return;
    
    try {
        let ctx = initAudio();
        if (ctx.state === 'suspended') ctx.resume();
        
        musicPlaying = true;
        let startTime = ctx.currentTime + 0.1;
        
        scheduleMusic(startTime);
    } catch (e) {
        console.log('Music error:', e);
    }
}

function scheduleMusic(startTime) {
    if (!musicEnabled || !musicPlaying) return;
    
    let ctx = initAudio();
    let melodyTime = startTime;
    let bassTime = startTime;
    
  ...(truncated 885245 characters)...sh;
                let caughtKey = fishPool[Math.floor(Math.random() * fishPool.length)];
                let fish = FISH_TYPES[caughtKey];
                
                // Is it junk?
                if (fish.rarity === 'junk') {
                    document.getElementById('fishingWater').innerText = fish.icon;
                    document.getElementById('fishingContent').innerHTML = `
                        <p class="text-lg">You caught... a ${fish.name}.</p>
                        <p class="text-gray-500 text-sm">Well, that's disappointing.</p>
                    `;
                    document.getElementById('fishingActions').innerHTML = `
                        <button onclick="castLine()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                            🎣 Cast Again
                        </button>
                        <button onclick="closeFishing()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mt-2">
                            Pack Up
                        </button>
                    `;
                    return;
                }
                
                // Something's biting! Start the minigame
                fishingState.caught = caughtKey;
                startFishingMinigame(caughtKey);
                
            }, waitTime);
        }
        
        // Fishing minigame state
        let fishingMinigame = {
            active: false,
            fishPosition: 50,          // 0-100, where fish is on the bar
            catcherPosition: 50,       // 0-100, where player's catcher is
            catcherSize: 30,           // Size of catch zone (skill dependent)
            fishVelocity: 0,           // Current fish movement speed
            fishTargetPos: 50,         // Where fish is trying to go
            progress: 0,               // 0-100, how caught the fish is
            difficulty: 10,            // Fish movement intensity
            timer: null,
            frameId: null
        };
        
        function startFishingMinigame(fishKey) {
            playSound('fishing_bite');
            let fish = FISH_TYPES[fishKey];
            
            // Calculate difficulty based on fish DC (8-25 range)
            let difficulty = fish.dc;
            
            // Catcher size based on hobby skill AND fish difficulty AND equipment
            // Use hobby skill if available, fallback to state.skills.fishing
            let hobbySkill = getHobbySkill('fishing');
            let totalSkill = Math.max(hobbySkill, state.skills.fishing || 0);
            let skillBonus = totalSkill / 100;
            let baseCatcherSize = 25 + Math.floor(skillBonus * 20); // 25-45% base
            
            // Equipment bonus - better gear = bigger catch zone
            let equipBonus = getHobbyEquipmentBonus('fishing');
            baseCatcherSize += Math.floor((equipBonus.skillGain - 1) * 10); // +0-5% from equipment
            
            // Adjust catcher size based on fish difficulty
            // Common (DC 8-10): +15% bigger, Legendary (DC 20+): -10% smaller
            let difficultyMod = Math.max(-10, 20 - difficulty); // +12 for DC8, 0 for DC20, -5 for DC25
            let catcherSize = Math.max(15, Math.min(55, baseCatcherSize + difficultyMod)); // Higher max with equipment
            
            fishingMinigame.active = true;
            fishingMinigame.fishPosition = 50;
            fishingMinigame.catcherPosition = 50;
            fishingMinigame.catcherSize = catcherSize;
            fishingMinigame.fishVelocity = 0;
            fishingMinigame.fishTargetPos = Math.random() * 100;
            fishingMinigame.progress = 50; // Start at 50% - need to fill to catch
            fishingMinigame.difficulty = difficulty;
            
            // Store fish rarity for progress scaling
            fishingMinigame.isEasyFish = difficulty <= 10;
            
            // Create minigame UI
                document.getElementById('fishingContent').innerHTML = `
                <div class="text-center mb-2">
                    <span class="text-xl">${fish.icon}</span>
                    <span class="text-white ml-2">${fish.name}</span>
                    <span class="text-xs text-gray-400 ml-2">(${fish.rarity})</span>
                </div>
                <div class="text-xs text-gray-400 mb-3">Hold SPACE or click to move catcher up. Keep fish in zone!</div>
            `;
            
            document.getElementById('fishingWater').innerHTML = `
                <div id="fishingBar" class="relative w-12 h-48 bg-blue-900 rounded-lg mx-auto border-2 border-blue-500 overflow-hidden">
                    <!-- Catcher zone -->
                    <div id="catcherZone" class="absolute w-full bg-green-500/50 border-y-2 border-green-400 transition-all" style="height: ${catcherSize}%; bottom: ${fishingMinigame.catcherPosition - catcherSize/2}%"></div>
                    <!-- Fish indicator -->
                    <div id="fishIndicator" class="absolute left-1/2 transform -translate-x-1/2 text-2xl transition-all" style="bottom: ${fishingMinigame.fishPosition}%">${fish.icon}</div>
                </div>
                <!-- Progress bar -->
                <div class="mt-3 w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div id="catchProgress" class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all" style="width: ${fishingMinigame.progress}%"></div>
                </div>
                <div class="text-xs text-gray-400 mt-1">Fill the bar to catch!</div>
            `;
                
                document.getElementById('fishingActions').innerHTML = `
                <button id="reelButton" onmousedown="startReeling()" onmouseup="stopReeling()" ontouchstart="startReeling()" ontouchend="stopReeling()" class="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors text-xl select-none">
                    🎣 HOLD TO REEL
                    </button>
                <div class="text-xs text-gray-500 mt-2 text-center">or hold SPACE key</div>
            `;
            
            // Add keyboard listener
            document.addEventListener('keydown', fishingKeyDown);
            document.addEventListener('keyup', fishingKeyUp);
            
            // Start game loop
            fishingMinigame.frameId = requestAnimationFrame(fishingGameLoop);
        }
        
        let isReeling = false;
        
        function startReeling() { isReeling = true; }
        function stopReeling() { isReeling = false; }
        
        function fishingKeyDown(e) {
            if (e.code === 'Space' && fishingMinigame.active) {
                e.preventDefault();
                isReeling = true;
            }
        }
        
        function fishingKeyUp(e) {
            if (e.code === 'Space') {
                isReeling = false;
            }
        }
        
        function fishingGameLoop() {
            if (!fishingMinigame.active) return;
            
            let mg = fishingMinigame;
            
            // Scale movement based on difficulty (DC 8-25)
            // Easy fish (DC 8-10): slower, calmer. Hard fish (DC 20+): faster, erratic
            let difficultyScale = mg.difficulty / 15; // ~0.5 for easy, ~1.5 for legendary
            
            // Move catcher based on input
            if (isReeling) {
                mg.catcherPosition = Math.min(100 - mg.catcherSize/2, mg.catcherPosition + 1.8);
            } else {
                mg.catcherPosition = Math.max(mg.catcherSize/2, mg.catcherPosition - 1.2);
            }
            
            // Move fish (erratic movement)
            // Easy fish change direction less often
            let directionChangeChance = 0.01 + (difficultyScale * 0.015); // 0.015 for easy, 0.035 for hard
            if (Math.random() < directionChangeChance) {
                mg.fishTargetPos = Math.random() * 100;
            }
            
            // Fish velocity toward target - easier fish are slower
            let targetDiff = mg.fishTargetPos - mg.fishPosition;
            let acceleration = 0.008 + (difficultyScale * 0.006); // 0.011 for easy, 0.017 for hard
            mg.fishVelocity += targetDiff * acceleration;
            mg.fishVelocity *= 0.92; // Damping
            
            // Add erratic movement based on difficulty - much calmer for easy fish
            let erraticAmount = mg.difficulty / 12; // Reduced divisor for easier fish
            mg.fishVelocity += (Math.random() - 0.5) * erraticAmount * difficultyScale;
            
            // Apply velocity
            mg.fishPosition += mg.fishVelocity;
            mg.fishPosition = Math.max(5, Math.min(95, mg.fishPosition));
            
            // Check if fish is in catcher zone
            let catcherTop = mg.catcherPosition + mg.catcherSize/2;
            let catcherBottom = mg.catcherPosition - mg.catcherSize/2;
            let inZone = mg.fishPosition >= catcherBottom && mg.fishPosition <= catcherTop;
            
            // Update progress - easier fish fill faster, drain slower
            let progressGain = mg.isEasyFish ? 0.7 : (0.6 - difficultyScale * 0.15); // 0.7 easy, 0.45 hard
            let progressLoss = mg.isEasyFish ? 0.2 : (0.25 + difficultyScale * 0.1);  // 0.2 easy, 0.4 hard
            
            if (inZone) {
                mg.progress = Math.min(100, mg.progress + progressGain);
            } else {
                mg.progress = Math.max(0, mg.progress - progressLoss);
            }
            
            // Update UI
            let fishEl = document.getElementById('fishIndicator');
            let catcherEl = document.getElementById('catcherZone');
            let progressEl = document.getElementById('catchProgress');
            
            if (fishEl) fishEl.style.bottom = mg.fishPosition + '%';
            if (catcherEl) {
                catcherEl.style.bottom = (mg.catcherPosition - mg.catcherSize/2) + '%';
                catcherEl.style.backgroundColor = inZone ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.3)';
            }
            if (progressEl) progressEl.style.width = mg.progress + '%';
            
            // Check win/lose conditions
            if (mg.progress >= 100) {
                endFishingMinigame(true);
                return;
            }
            if (mg.progress <= 0) {
                endFishingMinigame(false);
                return;
            }
            
            mg.frameId = requestAnimationFrame(fishingGameLoop);
        }
        
        function endFishingMinigame(success) {
            fishingMinigame.active = false;
            isReeling = false;
            
            // Remove event listeners
            document.removeEventListener('keydown', fishingKeyDown);
            document.removeEventListener('keyup', fishingKeyUp);
            
            if (fishingMinigame.frameId) {
                cancelAnimationFrame(fishingMinigame.frameId);
            }
            
            if (success) {
                // Caught the fish!
                catchFish(fishingState.caught);
            } else {
                // Fish got away
                playSound('fishing_escape');
                let fish = FISH_TYPES[fishingState.caught];
                document.getElementById('fishingWater').innerText = '💨';
                document.getElementById('fishingContent').innerHTML = `
                    <p class="text-red-400 text-lg">The ${fish.name} got away!</p>
                    <p class="text-gray-400">It escaped the line...</p>
                `;
                document.getElementById('fishingActions').innerHTML = `
                    <button onclick="castLine()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                        🎣 Try Again
                    </button>
                    <button onclick="closeFishing()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mt-2">
                        Pack Up
                    </button>
                `;
                state.stress += 3;
            }
            
            updateUI();
        }
        
        function catchFish(fishKey) {
            playSound('fishing_catch');
            let fish = FISH_TYPES[fishKey];
            let location = FISHING_LOCATIONS[fishingState.location];
            
            // Calculate rewards
            let value = fish.value;
            let xp = fish.xp;
            
            // Skill bonus for value - use hobby skill if higher
            let hobbySkill = getHobbySkill('fishing');
            let totalSkill = Math.max(hobbySkill, state.skills.fishing || 0);
            let skillBonus = 1 + (totalSkill / 200);
            value = Math.floor(value * skillBonus);
            
            // Equipment bonus for value
            let equipBonus = getHobbyEquipmentBonus('fishing');
            if (equipBonus.money) {
                value += Math.floor(equipBonus.money * (fish.rarity === 'legendary' ? 2 : 1));
            }
                
                state.money += value;
                state.skills.fishing = Math.min(100, state.skills.fishing + xp);
            
            // Also increase hobby skill if fishing is a hobby
            if (state.hobbies.active.includes('fishing')) {
                practiceHobby('fishing', 0.5); // Small skill gain per catch
            }
                state.fishing.totalCatches++;
                state.fishing.fishingTrips++;
                state.stress = Math.max(0, state.stress - 3);
                state.happiness = Math.min(100, state.happiness + 2);
                
                // Track best catch
                if (!state.fishing.bestCatch || fish.value > FISH_TYPES[state.fishing.bestCatch]?.value) {
                state.fishing.bestCatch = fishKey;
                }
                
                // Track legendary catches
            if ((fish.rarity === 'legendary' || fish.rarity === 'mythical') && !state.fishing.legendsCaught.includes(fishKey)) {
                state.fishing.legendsCaught.push(fishKey);
                    state.achievements.push(`Caught ${fish.name}`);
                }
                
                let rarityColor = fish.rarity === 'legendary' ? 'text-yellow-400' : 
                                  fish.rarity === 'mythical' ? 'text-purple-400' :
                                  fish.rarity === 'rare' ? 'text-blue-400' :
                                  fish.rarity === 'uncommon' ? 'text-green-400' : 'text-gray-300';
                
                document.getElementById('fishingWater').innerText = fish.icon;
                document.getElementById('fishingContent').innerHTML = `
                <p class="${rarityColor} text-lg font-bold">Caught: ${fish.name}!</p>
                        <p class="text-green-400">+$${value}</p>
                <p class="text-cyan-400 text-sm">+${xp} Fishing XP</p>
                <p class="text-gray-500 text-xs mt-2">Fishing Skill: ${state.skills.fishing}</p>
            `;
            document.getElementById('fishingActions').innerHTML = `
                <button onclick="castLine()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    🎣 Cast Again
                </button>
                <button onclick="closeFishing()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mt-2">
                    Pack Up
                </button>
            `;
        }
        
        function closeFishing() {
            // Clean up minigame if active
            if (fishingMinigame.active) {
                fishingMinigame.active = false;
                isReeling = false;
                document.removeEventListener('keydown', fishingKeyDown);
                document.removeEventListener('keyup', fishingKeyUp);
                if (fishingMinigame.frameId) {
                    cancelAnimationFrame(fishingMinigame.frameId);
                }
            }
            document.getElementById('fishingModal').classList.add('hidden');
            fishingState.location = null;
        }
        
        function getFishingEvent() {
            // Random fishing opportunity
            return {
                category: "🎣 Recreation",
                title: "Perfect Day for Fishing",
                desc: "The weather's nice. You could go fishing to relax and maybe catch something valuable.",
                choices: Object.keys(FISHING_LOCATIONS).map(key => {
                    let loc = FISHING_LOCATIONS[key];
                    let canAccess = !loc.unlock || state.skills.fishing >= loc.unlock;
                    return {
                        text: `${loc.icon} ${loc.name}${loc.cost > 0 ? ` ($${loc.cost})` : ' (Free)'}${!canAccess ? ' 🔒' : ''}`,
                        condition: () => canAccess && state.money >= loc.cost,
                        effect: () => {
                            goFishing(key);
                            return { icon: "🎣", text: `Heading to ${loc.name}...`, stats: loc.cost > 0 ? `-$${loc.cost}` : "Free!" };
                        }
                    };
                }).concat([{
                    text: "Not today",
                    effect: () => {
                        return { icon: "🤷", text: "Maybe next time.", stats: "" };
                    }
                }])
            };
        }

        // ============ HABITS SYSTEM ============
        function calculateMaxWillpower() {
            // Base willpower from self-control trait
            let selfControl = state.characterTraits?.selfControl || 5;
            let base = 30 + (selfControl * 5); // 35-80 base range
            
            // Stress reduces max willpower significantly
            let stressPenalty = Math.floor(state.stress / 5); // -0 to -20
            
            // Energy boosts willpower
            let energyBonus = Math.floor((state.energy - 50) / 10); // -5 to +5
            
            // Rest free time activity gives bonus
            let restBonus = (state.freeTime?.rest || 0) * 1; // +1 per rest hour
            
            // Meditation habit boosts willpower regen
            let meditationBonus = 0;
            if (state.habits?.meditation?.active) {
                meditationBonus = 5 + Math.floor(state.habits.meditation.weeksActive / 4);
            }
            
            return Math.max(20, base - stressPenalty + energyBonus + restBonus + meditationBonus);
        }
        
        function calculateHabitCost(habitKey) {
            let habit = HABITS[habitKey];
            if (!habit || habit.type !== 'good') return 0;
            
            let baseCost = habit.baseCost;
            let weeksActive = state.habits[habitKey]?.weeksActive || 0;
            
            // Habits get easier to maintain over time
            // After 4 weeks: -20%, 8 weeks: -35%, 12 weeks: -50%, 20+ weeks: -60%
            let reduction = 0;
            if (weeksActive >= 20) reduction = 0.60;
            else if (weeksActive >= 12) reduction = 0.50;
            else if (weeksActive >= 8) reduction = 0.35;
            else if (weeksActive >= 4) reduction = 0.20;
            
            return Math.ceil(baseCost * (1 - reduction));
        }
        
        function getTotalHabitCost() {
            let totalCost = 0;
            let totalGain = 0;
            
            Object.keys(state.habits || {}).forEach(key => {
                if (state.habits[key]?.active && HABITS[key]) {
                    if (HABITS[key].type === 'good') {
                        totalCost += calculateHabitCost(key);
                    } else {
                        totalGain += HABITS[key].willpowerGain || 0;
                    }
                }
            });
            
            return totalCost - totalGain;
        }
        
        function openHabitsModal() {
            let modal = document.getElementById('habitsModal');
            
            // Update willpower display
            let maxWP = calculateMaxWillpower();
            let habitCost = getTotalHabitCost();
            let availableWP = maxWP - habitCost;
            
            document.getElementById('habitsWillpowerText').innerText = `${Math.max(0, availableWP)}/${maxWP}`;
            document.getElementById('habitsWillpowerBar').style.width = Math.max(0, (availableWP / maxWP) * 100) + '%';
            
            // Color the bar
            let bar = document.getElementById('habitsWillpowerBar');
            if (availableWP < 0) {
                bar.className = 'h-full bg-red-500 rounded-full transition-all animate-pulse';
            } else if (availableWP < maxWP * 0.3) {
                bar.className = 'h-full bg-orange-500 rounded-full transition-all';
            } else {
                bar.className = 'h-full bg-purple-500 rounded-full transition-all';
            }
            
            // Willpower factors breakdown
            let selfControl = state.characterTraits?.selfControl || 5;
            let factors = [];
            factors.push(`Base (Self-Control ${selfControl}): ${30 + selfControl * 5}`);
            if (state.stress > 0) factors.push(`Stress: -${Math.floor(state.stress / 5)}`);
            if (state.energy !== 50) factors.push(`Energy: ${state.energy > 50 ? '+' : ''}${Math.floor((state.energy - 50) / 10)}`);
            document.getElementById('willpowerFactors').innerHTML = factors.join(' | ');
            
            // Build good habits list
            let goodHabitsDiv = document.getElementById('goodHabitsList');
            goodHabitsDiv.innerHTML = '';
            
            Object.keys(HABITS).filter(k => HABITS[k].type === 'good').forEach(key => {
                let habit = HABITS[key];
                let isActive = state.habits[key]?.active || false;
                let weeksActive = state.habits[key]?.weeksActive || 0;
                let cost = calculateHabitCost(key);
                let canAfford = (availableWP + (isActive ? cost : 0)) >= cost;
                
                let streakText = '';
                if (isActive && weeksActive > 0) {
                    let reduction = Math.round((1 - cost / habit.baseCost) * 100);
                    streakText = `<span class="text-green-400">${weeksActive}wk streak${reduction > 0 ? ` (-${reduction}%)` : ''}</span>`;
                }
                
                let div = document.createElement('div');
                div.className = `p-2 rounded border ${isActive ? 'border-green-500 bg-green-900/20' : 'border-gray-600'} ${!canAfford && !isActive ? 'opacity-50' : ''}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">${habit.icon}</span>
                            <div>
                                <div class="text-white text-sm">${habit.name}</div>
                                <div class="text-xs text-gray-400">${habit.effects.desc}</div>
                                ${habit.moneyCost ? `<div class="text-xs text-yellow-400">$${habit.moneyCost}/week</div>` : ''}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-purple-400 text-sm">${cost} WP</div>
                            ${streakText}
                            <button onclick="toggleHabit('${key}')" class="mt-1 px-2 py-1 text-xs rounded ${isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white" ${!canAfford && !isActive ? 'disabled' : ''}>
                                ${isActive ? 'Stop' : 'Start'}
                            </button>
                        </div>
                    </div>
                `;
                goodHabitsDiv.appendChild(div);
            });
            
            // Build bad habits list
            let badHabitsDiv = document.getElementById('badHabitsList');
            badHabitsDiv.innerHTML = '';
            
            Object.keys(HABITS).filter(k => HABITS[k].type === 'bad').forEach(key => {
                let habit = HABITS[key];
                let isActive = state.habits[key]?.active || false;
                let weeksActive = state.habits[key]?.weeksActive || 0;
                
                let div = document.createElement('div');
                div.className = `p-2 rounded border ${isActive ? 'border-red-500 bg-red-900/20' : 'border-gray-600'}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-lg">${habit.icon}</span>
                            <div>
                                <div class="text-white text-sm">${habit.name}</div>
                                <div class="text-xs text-gray-400">${habit.effects.desc}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-green-400 text-sm">+${habit.willpowerGain} WP</div>
                            ${isActive ? `<span class="text-xs text-red-400">${weeksActive}wk</span>` : ''}
                            <button onclick="toggleHabit('${key}')" class="mt-1 px-2 py-1 text-xs rounded ${isActive ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white">
                                ${isActive ? 'Quit' : 'Pick Up'}
                            </button>
                        </div>
                    </div>
                `;
                badHabitsDiv.appendChild(div);
            });
            
            modal.classList.remove('hidden');
        }
        
        function closeHabitsModal() {
            document.getElementById('habitsModal').classList.add('hidden');
        }
        
        function toggleHabit(key) {
            let habit = HABITS[key];
            if (!habit) return;
            
            if (!state.habits[key]) {
                state.habits[key] = { active: false, weeksActive: 0 };
            }
            
            if (state.habits[key].active) {
                // Stopping habit
                state.habits[key].active = false;
                state.habits[key].weeksActive = 0;
                addLog(`${habit.type === 'bad' ? 'Quit' : 'Stopped'} ${habit.name}`);
            } else {
                // Starting habit
                let maxWP = calculateMaxWillpower();
                let currentCost = getTotalHabitCost();
                let newCost = habit.type === 'good' ? calculateHabitCost(key) : -(habit.willpowerGain || 0);
                
                if (maxWP - currentCost - newCost < 0 && habit.type === 'good') {
                    alert('Not enough willpower! Reduce stress, get more rest, or drop another habit.');
                    return;
                }
                
                state.habits[key].active = true;
                state.habits[key].weeksActive = 0;
                addLog(`${habit.type === 'bad' ? 'Picked up' : 'Started'} ${habit.name}`);
            }
            
            openHabitsModal(); // Refresh
            updateUI();
        }
        
        function processHabitEffects() {
            let totalMoneyCost = 0;
            
            Object.keys(state.habits || {}).forEach(key => {
                if (!state.habits[key]?.active || !HABITS[key]) return;
                
                let habit = HABITS[key];
                state.habits[key].weeksActive++;
                
                // Apply effects
                let effects = habit.effects;
                if (effects.health) state.health = Math.max(0, Math.min(100, state.health + effects.health));
                if (effects.energy) state.energy = Math.max(0, Math.min(100, state.energy + effects.energy));
                if (effects.stress) state.stress = Math.max(0, Math.min(100, state.stress + effects.stress));
                if (effects.happiness) state.happiness = Math.max(0, Math.min(100, state.happiness + effects.happiness));
                if (effects.physical) state.skills.physical = Math.min(100, state.skills.physical + effects.physical);
                if (effects.technical) state.skills.technical = Math.min(100, state.skills.technical + effects.technical);
                if (effects.creativity) state.skills.creativity = Math.min(100, state.skills.creativity + effects.creativity);
                if (effects.social) state.skills.social = Math.min(100, state.skills.social + effects.social);
                if (effects.attractiveness) {
                    let base = state.characterTraits?.attractiveness || 5;
                    state.currentAttractiveness = Math.max(1, Math.min(10, (state.currentAttractiveness || base) + effects.attractiveness));
                }
                
                // Money costs
                if (habit.moneyCost) totalMoneyCost += habit.moneyCost;
                
                // Gambling risk
                if (effects.moneyRisk && Math.random() < 0.3) {
                    let loss = Math.floor(Math.random() * 200) + 50;
                    state.money -= loss;
                    if (Math.random() < 0.1) {
                        let win = Math.floor(Math.random() * 500) + 100;
                        state.money += win;
                    }
                }
            });
            
            state.habitMoneyCost = totalMoneyCost;
            
            // Check if willpower budget is exceeded (habits start failing)
            let maxWP = calculateMaxWillpower();
            let habitCost = getTotalHabitCost();
            
            if (habitCost > maxWP) {
                // Random good habit fails when over budget
                let goodHabits = Object.keys(state.habits).filter(k => 
                    state.habits[k]?.active && HABITS[k]?.type === 'good'
                );
                
                if (goodHabits.length > 0 && Math.random() < 0.4) {
                    let failedHabit = goodHabits[Math.floor(Math.random() * goodHabits.length)];
                    state.habits[failedHabit].active = false;
                    state.habits[failedHabit].weeksActive = 0;
                    state.stress += 10;
                    addLog(`Willpower depleted - ${HABITS[failedHabit].name} habit broken`);
                }
            }
        }
        
        // ============ BAD HABIT DEVELOPMENT ============
        // Check if player is at risk of developing bad habits
        let pendingBadHabitEvent = null;
        
        function checkBadHabitDevelopment() {
            // Don't trigger if already have a pending event
            if (pendingBadHabitEvent) return;
            
            // Only check once per few weeks
            if (state.totalWeeks % 2 !== 0) return;
            
            let triggers = [];
            
            // HIGH STRESS triggers
            if (state.stress >= 70 && Math.random() < 0.15) {
                if (!state.habits?.smoking?.active) {
                    triggers.push({
                        habit: 'smoking',
                        trigger: 'stress',
                        title: "😰 Stress is Getting to You",
                        desc: `Your stress has been dangerously high (${Math.round(state.stress)}%). You find yourself craving something to take the edge off. A coworker offers you a cigarette...`,
                        acceptText: "🚬 Just this once...",
                        resistText: "No thanks, I'll manage",
                        resistDC: 12 + Math.floor(state.stress / 15)
                    });
                }
                if (!state.habits?.drinking?.active && Math.random() < 0.5) {
                    triggers.push({
                        habit: 'drinking',
                        trigger: 'stress',
                        title: "😰 Need to Unwind",
                        desc: `The stress (${Math.round(state.stress)}%) is overwhelming. You keep finding yourself reaching for a drink after work. It's becoming a pattern...`,
                        acceptText: "🍺 I deserve this",
                        resistText: "I should cut back",
                        resistDC: 11 + Math.floor(state.stress / 20)
                    });
                }
            }
            
            // LOW HAPPINESS triggers
            if (state.happiness <= 30 && Math.random() < 0.12) {
                if (!state.habits?.junkFood?.active) {
                    triggers.push({
                        habit: 'junkFood',
                        trigger: 'happiness',
                        title: "😔 Comfort Eating",
                        desc: `You've been feeling down lately (happiness: ${Math.round(state.happiness)}%). Fast food and snacks are becoming your main source of comfort...`,
                        acceptText: "🍔 Food makes me feel better",
                        resistText: "I need healthier coping",
                        resistDC: 10 + Math.floor((30 - state.happiness) / 5)
                    });
                }
                if (!state.habits?.doomScrolling?.active && Math.random() < 0.5) {
                    triggers.push({
                        habit: 'doomScrolling',
                        trigger: 'happiness',
                        title: "😔 Endless Scrolling",
                        desc: `Feeling low (happiness: ${Math.round(state.happiness)}%), you've been spending hours mindlessly scrolling through social media...`,
                        acceptText: "📱 Just a bit more...",
                        resistText: "Put the phone down",
                        resistDC: 9 + Math.floor((30 - state.happiness) / 6)
                    });
                }
            }
            
            // LOW ENERGY triggers
            if (state.energy <= 35 && Math.random() < 0.10) {
                if (!state.habits?.lateSleeper?.active) {
                    triggers.push({
                        habit: 'lateSleeper',
                        trigger: 'energy',
                        title: "🦉 Can't Sleep",
                        desc: `Despite being exhausted (energy: ${Math.round(state.energy)}%), you keep staying up late. Your sleep schedule is getting worse...`,
                        acceptText: "🌙 Just one more hour",
                        resistText: "I really need to sleep",
                        resistDC: 10 + Math.floor((35 - state.energy) / 5)
                    });
                }
                if (!state.habits?.procrastination?.active && Math.random() < 0.5) {
                    triggers.push({
                        habit: 'procrastination',
                        trigger: 'energy',
                        title: "⏰ Too Tired to Start",
                        desc: `You're so drained (energy: ${Math.round(state.energy)}%) that you keep putting things off until the last minute...`,
                        acceptText: "I'll do it tomorrow...",
                        resistText: "Just get it done",
                        resistDC: 9 + Math.floor((35 - state.energy) / 5)
                    });
                }
            }
            
            // FINANCIAL DESPERATION triggers
            if (state.money < -500 && !state.habits?.gambling?.active && Math.random() < 0.08) {
                triggers.push({
                    habit: 'gambling',
                    trigger: 'money',
                    title: "💸 Desperate Times",
                    desc: `You're deep in debt ($${Math.abs(Math.round(state.money))}). Someone mentions a "sure thing" bet that could turn things around...`,
                    acceptText: "🎰 Could be my lucky day",
                    resistText: "That's not how this works",
                    resistDC: 14
                });
            }
            
            // Multiple stressors compound - if 2+ issues, higher chance
            if (state.stress >= 60 && state.happiness <= 40 && state.energy <= 40 && Math.random() < 0.1) {
                if (!state.habits?.drinking?.active) {
                    triggers.push({
                        habit: 'drinking',
                        trigger: 'compound',
                        title: "🌪️ Everything's Too Much",
                        desc: "Stressed, unhappy, and exhausted - you feel like you're drowning. A few drinks seem like the only escape...",
                        acceptText: "🍺 I need something...",
                        resistText: "I'll find another way",
                        resistDC: 15
                    });
                }
            }
            
            // Pick one trigger randomly if multiple
            if (triggers.length > 0) {
                pendingBadHabitEvent = triggers[Math.floor(Math.random() * triggers.length)];
            }
        }
        
        function showBadHabitEvent() {
            if (!pendingBadHabitEvent) return null;
            
            let event = pendingBadHabitEvent;
            let habit = HABITS[event.habit];
            
            return {
                category: "⚠️ Warning",
                title: event.title,
                desc: event.desc,
                choices: [
                    {
                        text: event.acceptText,
                        effect: () => {
                            // Start the bad habit
                            state.habits = state.habits || {};
                            state.habits[event.habit] = {
                                active: true,
                                weeksActive: 0
                            };
                            pendingBadHabitEvent = null;
                            addLog(`Started bad habit: ${habit.name}`);
                            return { 
                                icon: habit.icon, 
                                text: `You've picked up a bad habit: ${habit.name}. It'll be hard to quit.`, 
                                stats: habit.effects.desc 
                            };
                        }
                    },
                    {
                        text: `${event.resistText} (Will DC ${event.resistDC})`,
                        effect: () => {
                            // Try to resist
                            let selfControl = state.characterTraits?.selfControl || 5;
                            let bonus = Math.floor(selfControl / 2) - 2; // -2 to +3
                            let roll = Math.floor(Math.random() * 20) + 1;
                            let total = roll + bonus;
                            let success = total >= event.resistDC || roll === 20;
                            let critFail = roll === 1;
                            
                            pendingBadHabitEvent = null;
                            
                            if (critFail) {
                                // Critical fail - start the habit anyway
                                state.habits = state.habits || {};
                                state.habits[event.habit] = {
                                    active: true,
                                    weeksActive: 0
                                };
                                addLog(`Failed to resist: ${habit.name}`);
                                return { 
                                    icon: "💀", 
                                    text: `Critical Fail! (rolled 1) Despite your best efforts, you couldn't resist. ${habit.name} becomes a habit.`, 
                                    stats: habit.effects.desc 
                                };
                            } else if (success) {
                                state.willpower = Math.max(0, (state.willpower || 0) - 5);
                                state.stress += 3;
                                return { 
                                    icon: "💪", 
                                    text: `You resisted! (${roll}+${bonus}=${total} vs DC ${event.resistDC}) It took willpower, but you stayed strong.`, 
                                    stats: "-5 Willpower, +3 Stress" 
                                };
                            } else {
                                // Failed - start the habit
                                state.habits = state.habits || {};
                                state.habits[event.habit] = {
                                    active: true,
                                    weeksActive: 0
                                };
                                addLog(`Failed to resist: ${habit.name}`);
                                return { 
                                    icon: habit.icon, 
                                    text: `Failed! (${roll}+${bonus}=${total} vs DC ${event.resistDC}) You gave in. ${habit.name} is now a habit.`, 
                                    stats: habit.effects.desc 
                                };
                            }
                        }
                    }
                ]
            };
        }

        // ============ SUBSCRIPTIONS MODAL ============
        function openSubscriptionsModal() {
            let modal = document.getElementById('subscriptionsModal');
            let listDiv = document.getElementById('subscriptionsList');
            listDiv.innerHTML = '';
            
            Object.keys(SUBSCRIPTIONS).forEach(key => {
                let sub = SUBSCRIPTIONS[key];
                let isActive = state.subscriptions[key] || false;
                
                // Check if subscription has a condition (e.g., dating apps not available if married)
                let available = !sub.effects.condition || sub.effects.condition();
                
                let div = document.createElement('div');
                div.className = `p-3 rounded border ${isActive ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-600'} ${!available ? 'opacity-50' : ''} transition-colors`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${sub.icon}</span>
                            <div>
                                <div class="text-white font-medium">${sub.name}</div>
                                <div class="text-xs text-gray-400">${sub.desc}</div>
                                <div class="text-xs text-cyan-400 mt-1">${sub.effects.desc}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-yellow-400 font-bold">$${sub.cost}/wk</div>
                            ${available ? `
                            <button onclick="toggleSubscription('${key}')" class="mt-1 px-3 py-1 text-xs rounded ${isActive ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} text-white transition-colors">
                                ${isActive ? 'Cancel' : 'Subscribe'}
                            </button>
                            ` : '<div class="text-xs text-gray-500">Not available</div>'}
                        </div>
                    </div>
                `;
                listDiv.appendChild(div);
            });
            
            updateSubscriptionsCost();
            modal.classList.remove('hidden');
        }
        
        function closeSubscriptionsModal() {
            document.getElementById('subscriptionsModal').classList.add('hidden');
        }
        
        function toggleSubscription(key) {
            let sub = SUBSCRIPTIONS[key];
            
            if (state.subscriptions[key]) {
                // Cancel subscription
                state.subscriptions[key] = false;
                if (sub.effects.onCancel) sub.effects.onCancel();
                addLog(`Cancelled ${sub.name}`);
            } else {
                // Subscribe
                state.subscriptions[key] = true;
                if (sub.effects.onSubscribe) sub.effects.onSubscribe();
                addLog(`Subscribed to ${sub.name}`);
            }
            
            updateSubscriptionsCost();
            openSubscriptionsModal(); // Refresh the modal
            updateUI();
        }
        
        function updateSubscriptionsCost() {
            let total = 0;
            Object.keys(state.subscriptions).forEach(key => {
                if (state.subscriptions[key] && SUBSCRIPTIONS[key]) {
                    total += SUBSCRIPTIONS[key].cost;
                }
            });
            state.subscriptionCost = total;
            document.getElementById('subsModalCost').innerText = '$' + total;
        }
        
        function processSubscriptionEffects() {
            Object.keys(state.subscriptions).forEach(key => {
                if (state.subscriptions[key] && SUBSCRIPTIONS[key] && SUBSCRIPTIONS[key].effects.weekly) {
                    SUBSCRIPTIONS[key].effects.weekly();
                }
            });
        }

        // ============ FREE TIME MODAL ============
        let tempFreeTime = {}; // Temporary allocation while editing
        
        function openFreeTimeModal() {
            let modal = document.getElementById('freeTimeModal');
            let activitiesDiv = document.getElementById('freeTimeActivities');
            activitiesDiv.innerHTML = '';
            
            // Copy current allocation to temp
            tempFreeTime = { ...state.freeTime };
            
            let maxTime = getAvailableFreeTime();
            
            // Show time breakdown
            let breakdownHtml = '<div class="text-xs text-gray-500 mb-3 p-2 bg-gray-800/50 rounded">';
            breakdownHtml += `<div class="font-medium text-gray-400 mb-1">Time Budget Breakdown:</div>`;
            breakdownHtml += `<div class="grid grid-cols-2 gap-x-4">`;
            breakdownHtml += `<div>Base time: <span class="text-cyan-400">${BASE_FREE_TIME} hrs</span></div>`;
            
            let transportMod = TIME_MODIFIERS.transport[state.car] || 0;
            if (transportMod !== 0) {
                breakdownHtml += `<div>Transport (${TRANSPORT[state.car].name}): <span class="${transportMod < 0 ? 'text-red-400' : 'text-green-400'}">${transportMod > 0 ? '+' : ''}${transportMod} hrs</span></div>`;
            }
            
            if (state.employed) {
                let jobMod = TIME_MODIFIERS.job[state.job] || 0;
                if (jobMod !== 0) {
                    breakdownHtml += `<div>Job: <span class="text-red-400">${jobMod} hrs</span></div>`;
                }
            }
            
            if (state.phase === 'education' || state.phase === 'military_training') {
                let eduType = state.educationType || state.phase;
                let eduMod = TIME_MODIFIERS.education[eduType] || 0;
                if (eduMod !== 0) {
                    breakdownHtml += `<div>Education: <span class="text-red-400">${eduMod} hrs</span></div>`;
                }
            }
            
            if (state.home === 'parents') {
                breakdownHtml += `<div>Living at home: <span class="text-green-400">+2 hrs</span></div>`;
            }
            
            if (state.relationship.children > 0) {
                breakdownHtml += `<div>Children (${state.relationship.children}): <span class="text-red-400">-${state.relationship.children * 3} hrs</span></div>`;
            }
            
            breakdownHtml += `</div>`;
            breakdownHtml += `<div class="mt-1 pt-1 border-t border-gray-700 font-medium">Total Available: <span class="text-cyan-400">${maxTime} hrs/week</span></div>`;
            breakdownHtml += '</div>';
            
            activitiesDiv.innerHTML = breakdownHtml;
            
            // Create activity controls
            Object.keys(FREE_TIME_ACTIVITIES).forEach(key => {
                let activity = FREE_TIME_ACTIVITIES[key];
                let available = activity.requires();
                let currentHours = tempFreeTime[key] || 0;
                
                let costPerHour = typeof activity.costPerHour === 'function' ? activity.costPerHour() : activity.costPerHour;
                let earningsPerHour = activity.earningsPerHour ? activity.earningsPerHour() : 0;
                let desc = typeof activity.desc === 'function' ? activity.desc() : activity.desc;
                
                let div = document.createElement('div');
                div.className = `p-3 rounded border ${available ? 'border-gray-600' : 'border-gray-700 opacity-50'}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">${activity.icon}</span>
                            <div>
                                <div class="text-white font-medium">${activity.name}</div>
                                <div class="text-xs text-gray-400">${desc}</div>
                            </div>
                        </div>
                        <div class="text-right text-xs">
                            ${earningsPerHour > 0 ? `<span class="text-green-400">+$${earningsPerHour}/hr</span>` : 
                              costPerHour > 0 ? `<span class="text-yellow-400">$${costPerHour}/hr</span>` : 
                              `<span class="text-gray-500">Free</span>`}
                            ${!available ? `<br><span class="text-red-400">${activity.requiresText || 'Unavailable'}</span>` : ''}
                        </div>
                    </div>
                    ${available ? `
                    <div class="flex items-center gap-2">
                        <button onclick="adjustFreeTime('${key}', -1)" class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold">-</button>
                        <div class="flex-1 bg-gray-800 rounded-full h-2 relative">
                            <div id="bar-${key}" class="bg-cyan-500 h-full rounded-full transition-all" style="width: ${(currentHours / maxTime) * 100}%"></div>
                        </div>
                        <span id="hours-${key}" class="text-cyan-400 font-mono w-12 text-center">${currentHours} hrs</span>
                        <button onclick="adjustFreeTime('${key}', 1)" class="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold">+</button>
                    </div>
                    ` : ''}
                `;
                
                activitiesDiv.appendChild(div);
            });
            
            updateFreeTimePreview();
            modal.classList.remove('hidden');
        }
        
        function adjustFreeTime(activity, delta) {
            let maxTime = getAvailableFreeTime();
            let currentTotal = Object.values(tempFreeTime).reduce((a, b) => a + b, 0);
            let currentHours = tempFreeTime[activity] || 0;
            
            let newHours = currentHours + delta;
            
            // Constraints
            if (newHours < 0) newHours = 0;
            if (newHours > 10) newHours = 10; // Max 10 hours per activity
            if (delta > 0 && currentTotal >= maxTime) return; // Can't exceed max
            
            tempFreeTime[activity] = newHours;
            
            // Update UI
            document.getElementById(`hours-${activity}`).innerText = newHours + ' hrs';
            document.getElementById(`bar-${activity}`).style.width = (newHours / maxTime) * 100 + '%';
            
            updateFreeTimePreview();
        }
        
        function updateFreeTimePreview() {
            let maxTime = getAvailableFreeTime();
            let total = Object.values(tempFreeTime).reduce((a, b) => a + b, 0);
            let remaining = maxTime - total;
            
            document.getElementById('freeTimeRemaining').innerText = remaining;
            document.getElementById('freeTimeRemaining').className = remaining > 0 ? 'text-cyan-400' : 'text-green-400';
            
            // Calculate total cost
            let totalCost = 0;
            let totalEarnings = 0;
            Object.keys(tempFreeTime).forEach(key => {
                let hours = tempFreeTime[key] || 0;
                let activity = FREE_TIME_ACTIVITIES[key];
                let costPerHour = typeof activity.costPerHour === 'function' ? activity.costPerHour() : activity.costPerHour;
                totalCost += hours * costPerHour;
                if (activity.earningsPerHour) {
                    totalEarnings += hours * activity.earningsPerHour();
                }
            });
            
            let netCost = totalCost - totalEarnings;
            document.getElementById('freeTimeModalCost').innerText = netCost >= 0 ? `$${netCost}` : `+$${Math.abs(netCost)}`;
            document.getElementById('freeTimeModalCost').className = netCost > 0 ? 'text-yellow-400' : 'text-green-400';
            
            // Effects preview
            let effects = calculateFreeTimeEffects(tempFreeTime);
            let previewDiv = document.getElementById('freeTimeEffectsPreview');
            let previewHtml = '';
            
            if (effects.physical) previewHtml += `<div>💪 Physical: <span class="text-cyan-400">+${effects.physical.toFixed(1)}</span></div>`;
            if (effects.social) previewHtml += `<div>🗣️ Social: <span class="text-cyan-400">+${effects.social.toFixed(1)}</span></div>`;
            if (effects.technical) previewHtml += `<div>🔧 Technical: <span class="text-cyan-400">+${effects.technical.toFixed(1)}</span></div>`;
            if (effects.creativity) previewHtml += `<div>🎨 Creativity: <span class="text-cyan-400">+${effects.creativity.toFixed(1)}</span></div>`;
            if (effects.stress) previewHtml += `<div>😰 Stress: <span class="${effects.stress < 0 ? 'text-green-400' : 'text-red-400'}">${effects.stress > 0 ? '+' : ''}${effects.stress.toFixed(1)}</span></div>`;
            if (effects.energy) previewHtml += `<div>⚡ Energy: <span class="${effects.energy > 0 ? 'text-green-400' : 'text-red-400'}">${effects.energy > 0 ? '+' : ''}${effects.energy.toFixed(1)}</span></div>`;
            if (effects.happiness) previewHtml += `<div>☺️ Happiness: <span class="${effects.happiness > 0 ? 'text-green-400' : 'text-red-400'}">${effects.happiness > 0 ? '+' : ''}${effects.happiness.toFixed(1)}</span></div>`;
            if (effects.health) previewHtml += `<div>❤️ Health: <span class="text-green-400">+${effects.health.toFixed(1)}</span></div>`;
            if (effects.attractiveness) previewHtml += `<div>💕 Looks: <span class="text-pink-400">+${effects.attractiveness.toFixed(2)}</span></div>`;
            if (effects.meetingBonus) previewHtml += `<div>💘 Meeting chance: <span class="text-pink-400">+${(effects.meetingBonus * 100).toFixed(0)}%</span></div>`;
            if (effects.careerXP) previewHtml += `<div>📈 Career XP: <span class="text-cyan-400">+${effects.careerXP.toFixed(1)}</span></div>`;
            if (effects.gpaBonus && state.phase === 'education') previewHtml += `<div>📚 GPA Bonus: <span class="text-cyan-400">+${effects.gpaBonus.toFixed(2)}</span></div>`;
            if (totalEarnings > 0) previewHtml += `<div>💵 Overtime: <span class="text-green-400">+$${totalEarnings}/week</span></div>`;
            
            previewDiv.innerHTML = previewHtml || '<div class="text-gray-500">No activities selected</div>';
        }
        
        function calculateFreeTimeEffects(allocation) {
            let effects = {};
            
            Object.keys(allocation).forEach(key => {
                let hours = allocation[key] || 0;
                if (hours === 0) return;
                
                let activity = FREE_TIME_ACTIVITIES[key];
                
                // Call custom processing function if it exists (for hobbies, etc.)
                if (activity.customProcess) {
                    activity.customProcess(hours);
                }
                
                Object.keys(activity.effects).forEach(effect => {
                    let value = activity.effects[effect] * hours;
                    effects[effect] = (effects[effect] || 0) + value;
                });
            });
            
            return effects;
        }
        
        function saveFreeTimeAllocation() {
            state.freeTime = { ...tempFreeTime };
            
            // Update weekly expenses for free time activities
            let totalCost = 0;
            Object.keys(state.freeTime).forEach(key => {
                let hours = state.freeTime[key] || 0;
                let activity = FREE_TIME_ACTIVITIES[key];
                let costPerHour = typeof activity.costPerHour === 'function' ? activity.costPerHour() : activity.costPerHour;
                totalCost += hours * costPerHour;
            });
            
            state.freeTimeExpenses = totalCost;
            
            addLog(`Updated weekly schedule`);
            closeFreeTimeModal();
            updateUI();
        }
        
        function closeFreeTimeModal() {
            document.getElementById('freeTimeModal').classList.add('hidden');
        }
        
        // Adjust free time allocation if max time changes
        function validateFreeTimeAllocation() {
            let maxTime = getAvailableFreeTime();
            let currentTotal = Object.values(state.freeTime).reduce((a, b) => a + b, 0);
            
            // If we're over the limit, proportionally reduce all activities
            if (currentTotal > maxTime) {
                let ratio = maxTime / currentTotal;
                Object.keys(state.freeTime).forEach(key => {
                    state.freeTime[key] = Math.floor((state.freeTime[key] || 0) * ratio);
                });
                
                // Notify player
                addLog(`Schedule adjusted - less free time available (${maxTime} hrs)`);
            }
            
            // Disable activities that are no longer available
            if (!state.fitness.gymMember && state.freeTime.gym > 0) {
                state.freeTime.gym = 0;
            }
            if (!state.employed && state.freeTime.overtime > 0) {
                state.freeTime.overtime = 0;
            }
        }

        // ============ INIT ============
        function createParticles() {
            let container = document.getElementById('particles');
            for (let i = 0; i < 20; i++) {
                let p = document.createElement('div');
                p.className = 'particle';
                p.style.left = Math.random() * 100 + '%';
                p.style.animationDelay = Math.random() * 20 + 's';
                container.appendChild(p);
            }
        }

        function init() {
            createParticles();
            let events = getPhaseEvents();
            displayEvent(events[0]);
            updateUI();
        }

        init();