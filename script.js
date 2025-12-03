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
            
            // Schedule melody
            MELODY.forEach(note => {
                let osc = ctx.createOscillator();
                let gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(note.note, melodyTime);
                
                let noteDuration = note.duration * BEAT_LENGTH;
                gain.gain.setValueAtTime(0.06, melodyTime);
                gain.gain.setValueAtTime(0.06, melodyTime + noteDuration * 0.8);
                gain.gain.linearRampToValueAtTime(0, melodyTime + noteDuration);
                
                osc.start(melodyTime);
                osc.stop(melodyTime + noteDuration);
                
                musicNodes.push({ osc, gain });
                melodyTime += noteDuration;
            });
            
            // Schedule bass
            BASS.forEach(note => {
                let osc = ctx.createOscillator();
                let gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(note.note, bassTime);
                
                let noteDuration = note.duration * BEAT_LENGTH;
                gain.gain.setValueAtTime(0.08, bassTime);
                gain.gain.setValueAtTime(0.08, bassTime + noteDuration * 0.7);
                gain.gain.linearRampToValueAtTime(0, bassTime + noteDuration);
                
                osc.start(bassTime);
                osc.stop(bassTime + noteDuration);
                
                musicNodes.push({ osc, gain });
                bassTime += noteDuration;
            });
            
            // Schedule drums (simple kick on beats)
            let drumTime = startTime;
            let totalBeats = 32;
            for (let i = 0; i < totalBeats; i++) {
                // Kick on 1 and 3
                if (i % 4 === 0 || i % 4 === 2) {
                    let osc = ctx.createOscillator();
                    let gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, drumTime);
                    osc.frequency.exponentialRampToValueAtTime(50, drumTime + 0.1);
                    
                    gain.gain.setValueAtTime(0.15, drumTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, drumTime + 0.1);
                    
                    osc.start(drumTime);
                    osc.stop(drumTime + 0.1);
                    musicNodes.push({ osc, gain });
                }
                
                // Hi-hat on off-beats
                if (i % 2 === 1) {
                    let osc = ctx.createOscillator();
                    let gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(1000 + Math.random() * 500, drumTime);
                    
                    gain.gain.setValueAtTime(0.02, drumTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, drumTime + 0.05);
                    
                    osc.start(drumTime);
                    osc.stop(drumTime + 0.05);
                    musicNodes.push({ osc, gain });
                }
                
                drumTime += BEAT_LENGTH * 0.5;
            }
            
            // Calculate total loop duration and schedule next loop
            let loopDuration = MELODY.reduce((sum, n) => sum + n.duration, 0) * BEAT_LENGTH;
            
            // Schedule next loop slightly before this one ends
            setTimeout(() => {
                if (musicEnabled && musicPlaying) {
                    // Clean up old nodes
                    musicNodes = musicNodes.filter(n => {
                        try { return n.osc.context.currentTime < startTime + loopDuration; } 
                        catch { return false; }
                    });
                    scheduleMusic(ctx.currentTime + 0.1);
                }
            }, (loopDuration - 0.5) * 1000);
        }
        
        function stopMusic() {
            musicPlaying = false;
            
            // Stop all music nodes
            musicNodes.forEach(node => {
                try {
                    node.gain.gain.setValueAtTime(0, audioContext?.currentTime || 0);
                    node.osc.stop();
                } catch (e) {}
            });
            musicNodes = [];
        }
        
        function toggleMusic() {
            musicEnabled = !musicEnabled;
            document.getElementById('musicToggle').innerText = musicEnabled ? '🎵' : '🎵';
            document.getElementById('musicToggle').classList.toggle('opacity-50', !musicEnabled);
            
            if (musicEnabled) {
                startMusic();
            } else {
                stopMusic();
            }
        }
        
        function playSound(type) {
            if (!soundEnabled) return;
            
            try {
                let ctx = initAudio();
                if (ctx.state === 'suspended') ctx.resume();
                
                let osc = ctx.createOscillator();
                let gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                let now = ctx.currentTime;
                
                switch(type) {
                    case 'click':
                        // Short blip
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(800, now);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.exponentialDecayTo && gain.gain.exponentialDecayTo(0.01, now + 0.05);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.05);
                        osc.start(now);
                        osc.stop(now + 0.05);
                        break;
                        
                    case 'select':
                        // Menu select sound
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(440, now);
                        osc.frequency.setValueAtTime(880, now + 0.05);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.1);
                        osc.start(now);
                        osc.stop(now + 0.1);
                        break;
                        
                    case 'success':
                        // Happy ascending arpeggio
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(523, now);        // C5
                        osc.frequency.setValueAtTime(659, now + 0.08); // E5
                        osc.frequency.setValueAtTime(784, now + 0.16); // G5
                        osc.frequency.setValueAtTime(1047, now + 0.24); // C6
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.35);
                        osc.start(now);
                        osc.stop(now + 0.35);
                        break;
                        
                    case 'failure':
                        // Sad descending
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(400, now);
                        osc.frequency.setValueAtTime(300, now + 0.1);
                        osc.frequency.setValueAtTime(200, now + 0.2);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.3);
                        osc.start(now);
                        osc.stop(now + 0.3);
                        break;
                        
                    case 'coin':
                        // Coin collect sound
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(987, now);  // B5
                        osc.frequency.setValueAtTime(1319, now + 0.06); // E6
                        gain.gain.setValueAtTime(0.08, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.15);
                        osc.start(now);
                        osc.stop(now + 0.15);
                        break;
                        
                    case 'levelup':
                        // Level up fanfare
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(523, now);
                        osc.frequency.setValueAtTime(659, now + 0.1);
                        osc.frequency.setValueAtTime(784, now + 0.2);
                        osc.frequency.setValueAtTime(1047, now + 0.3);
                        osc.frequency.setValueAtTime(1319, now + 0.4);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.setValueAtTime(0.1, now + 0.4);
                        gain.gain.linearRampToValueAtTime(0, now + 0.6);
                        osc.start(now);
                        osc.stop(now + 0.6);
                        break;
                        
                    case 'hurt':
                        // Damage/bad event
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(200, now);
                        osc.frequency.linearRampToValueAtTime(100, now + 0.15);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.15);
                        osc.start(now);
                        osc.stop(now + 0.15);
                        break;
                        
                    case 'advance':
                        // Week advance
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(600, now);
                        osc.frequency.setValueAtTime(800, now + 0.05);
                        gain.gain.setValueAtTime(0.08, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.1);
                        osc.start(now);
                        osc.stop(now + 0.1);
                        break;
                        
                    case 'fishing_bite':
                        // Fish on the line!
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(880, now);
                        osc.frequency.setValueAtTime(1100, now + 0.05);
                        osc.frequency.setValueAtTime(880, now + 0.1);
                        osc.frequency.setValueAtTime(1100, now + 0.15);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.25);
                        osc.start(now);
                        osc.stop(now + 0.25);
                        break;
                        
                    case 'fishing_catch':
                        // Caught a fish!
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(523, now);
                        osc.frequency.setValueAtTime(659, now + 0.05);
                        osc.frequency.setValueAtTime(784, now + 0.1);
                        osc.frequency.setValueAtTime(1047, now + 0.15);
                        osc.frequency.setValueAtTime(1319, now + 0.2);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.35);
                        osc.start(now);
                        osc.stop(now + 0.35);
                        break;
                        
                    case 'fishing_escape':
                        // Fish got away
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(400, now);
                        osc.frequency.linearRampToValueAtTime(150, now + 0.2);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.25);
                        osc.start(now);
                        osc.stop(now + 0.25);
                        break;
                        
                    case 'crime':
                        // Shady sound
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(150, now);
                        osc.frequency.setValueAtTime(200, now + 0.1);
                        osc.frequency.setValueAtTime(150, now + 0.2);
                        gain.gain.setValueAtTime(0.08, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.3);
                        osc.start(now);
                        osc.stop(now + 0.3);
                        break;
                        
                    case 'jail':
                        // Prison door slam
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(100, now);
                        osc.frequency.setValueAtTime(50, now + 0.1);
                        gain.gain.setValueAtTime(0.15, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.2);
                        osc.start(now);
                        osc.stop(now + 0.2);
                        break;
                        
                    default:
                        // Default beep
                        osc.type = 'square';
                        osc.frequency.setValueAtTime(440, now);
                        gain.gain.setValueAtTime(0.1, now);
                        gain.gain.linearRampToValueAtTime(0, now + 0.1);
                        osc.start(now);
                        osc.stop(now + 0.1);
                }
            } catch (e) {
                // Audio not supported, silently fail
            }
        }
        
        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('soundToggle').innerText = soundEnabled ? '🔊' : '🔇';
            if (soundEnabled) playSound('select');
        }

        // ============ GAME STATE ============
        let state = {
            // Time
            week: 1,
            totalWeeks: 0,
            
            // Character identity
            gender: null, // 'male' or 'female'
            characterTraits: {
                height: 5,           // 1-10 scale (used for males)
                build: 5,            // 1-10 scale (used for females)
                familyWealth: 5,     // 1-10 scale
                intelligence: 5,     // 1-10 scale
                attractiveness: 5,   // 1-10 scale (base, can be modified by fitness)
                selfControl: 5       // 1-10 scale (affects willpower/habits)
            },
            currentAttractiveness: 5, // Actual attractiveness (base + fitness bonuses)
            
            // Willpower & Habits
            willpower: 50,           // Current willpower (0-100)
            maxWillpower: 50,        // Max willpower based on traits
            habits: {},              // Active habits { habitKey: { active: true, weeksActive: 0 } }
            habitCost: 0,            // Total willpower cost of habits
            
            // Fitness/Self-improvement
            fitness: {
                gymMember: false,
                healthyEating: false,
                workoutStreak: 0,     // Consecutive weeks of working out
                fitnessLevel: 50,     // 0-100 fitness scale (50 = average)
                routineEstablished: false, // After 8 weeks, stress reduction kicks in
                peakFitness: 50       // Highest fitness achieved (for comparison)
            },
            
            // Free time allocation (hours per week, total 20 hours)
            freeTime: {
                gym: 0,              // Requires gym membership, +attractiveness/physical
                hobbies: 0,          // Practice hobbies (free basic)
                hobbies_premium: 0,  // Hobbies with classes/equipment ($15/hr)
                socialize: 0,        // Hang out with friends (free)
                socialize_premium: 0,// Night out, bars, events ($20/hr)
                overtime: 0,         // +money, +career, +stress, -energy
                study: 0,            // Self-study (free)
                study_premium: 0,    // Study with tutor ($25/hr)
                rest: 0,             // -stress, +energy, +health (free)
                relationship: 0,     // Quality time at home (free)
                relationship_premium: 0, // Date night out ($30/hr)
                fishing: 0           // +fishing skill, -stress, +happiness
            },
            
            // Free time priorities (1 = highest priority, cut last; higher numbers = cut first)
            freeTimePriorities: {
                gym: 5,
                hobbies: 6,
                hobbies_premium: 8,
                socialize: 7,
                socialize_premium: 9,
                overtime: 4,
                study: 3,
                study_premium: 10,
                rest: 1,
                relationship: 2,
                relationship_premium: 11,
                fishing: 12
            },
            
            // Free time targets (what user wants when time is available)
            freeTimeTargets: {
                gym: 0,
                hobbies: 0,
                hobbies_premium: 0,
                socialize: 0,
                socialize_premium: 0,
                overtime: 0,
                study: 0,
                study_premium: 0,
                rest: 0,
                relationship: 0,
                relationship_premium: 0,
                fishing: 0
            },
            
            // Core stats
            health: 100,
            energy: 100,
            happiness: 75,
            stress: 20,
            
            // Money (will be modified by familyWealth during character creation)
            money: 1200,
            debt: 0,
            studentLoans: 0,        // Non-dischargeable in bankruptcy
            studentLoanAPR: 6.5,    // Federal student loan interest rate
            studentLoansBorrowedThisYear: 0, // Track annual borrowing
            studentLoansLastYearReset: 0,    // Week of last annual reset
            maxStudentLoansPerYear: 12500,   // Federal loan limit per year (approx)
            creditCardDebt: 0,
            hasCreditCard: false,
            creditLimit: 0,
            creditAPR: 22,
            bankruptcyFiled: false,
            bankruptcyWeek: 0,
            weeklyIncome: 0,
            weeklyExpenses: 50,
            freeTimeExpenses: 0,   // Cost of free time activities
            overtimeEarnings: 0,   // Extra income from overtime
            subscriptions: {},     // Active subscriptions { gym: true, streaming: true, etc. }
            subscriptionCost: 0,   // Total weekly subscription cost
            
            // Tutorial
            tutorialComplete: false,
            
            // Life phase
            phase: 'character_creation', // character_creation, deciding, education, job_hunting, employed, retired
            phaseWeek: 0,
            phaseTarget: 0,
            
            // Education
            education: 'high_school_senior',
            educationType: null, // What they're pursuing
            educationProgress: 0,
            gpa: 3.0,
            
            // Career
            employed: false,
            job: null,
            jobTitle: '',
            salary: 0,
            performance: 50,
            weeksAtJob: 0,
            jobApplications: 0,
            interviews: 0,
            
            // Skills (0-100)
            skills: {
                technical: 10,
                social: 30,
                physical: 40,
                creativity: 20,
                fishing: 0       // Fishing mini-game skill
            },
            
            // Fishing stats
            fishing: {
                totalCatches: 0,
                bestCatch: null,
                fishingTrips: 0,
                legendsCaught: []
            },
            
            // Living situation
            home: 'parents',
            car: 'bus',
            
            // Relationships
            hasPartner: false,
            partnerName: null,
            partnerStats: null,
            relationshipWeeks: 0,
            married: false,
            
            // Loneliness system
            weeksWithoutPartner: 0,
            loneliness: 0,           // 0-100, accumulated loneliness
            lastRelationshipWeek: 0, // When last relationship ended
            
            // Friends system
            friends: [],  // Array of { name, metAt, bond, lastContact, trait, icon }
            maxFriends: 5,
            
            // Criminal system
            criminal: {
                record: [],           // Past offenses: { crime, week, caught }
                heatLevel: 0,         // Police awareness (0-100)
                connections: 0,       // Criminal network contacts
                inJail: false,
                jailWeeksRemaining: 0,
                totalJailTime: 0,
                lawyerRetained: false
            },
            
            // Business system
            business: {
                active: false,
                type: null,           // 'food_truck', 'consulting', 'online_store', 'app_startup'
                name: '',
                employees: 0,
                maxEmployees: 0,
                revenue: 0,
                expenses: 0,
                reputation: 50,       // 0-100
                weeksActive: 0,
                loan: 0,
                loanPayment: 0,
                customerBase: 0
            },
            
            // Home decoration system
            homeDecor: {
                furniture: [],        // Array of owned furniture item keys
                quality: 0,           // Overall home quality (0-100)
                style: 'basic'        // 'basic', 'cozy', 'modern', 'luxury'
            },
            
            // Hobbies system
            hobbies: {
                active: [],           // Array of active hobby keys (max 3)
                skills: {},           // { hobbyKey: skillLevel (0-100) }
                equipment: {},        // { hobbyKey: [owned equipment keys] }
                weeklyHours: {},      // { hobbyKey: hours allocated }
                totalHours: {}        // { hobbyKey: lifetime hours }
            },
            
            // Flags
            achievements: [],
            traits: [],
            exhaustionCollapse: false,
            lastFamilyHelpWeek: null,
            
            // Military specific
            military: {
                rank: 0, // 0=Recruit, 1=Private, 2=PFC, 3=Specialist, 4=Corporal, 5=Sergeant
                mos: null, // Military Occupational Specialty
                squadMorale: 50,
                combatXP: 0,
                missionsCompleted: 0,
                deployed: false,
                deploymentWeek: 0,
                buddyName: null,
                buddyAlive: true,
                medals: [],
                killCount: 0,
                wounded: false
            },
            
            // University specific
            university: {
                major: null,
                majorSelected: false,
                semester: 1, // 1-8 semesters
                professorMentor: null,
                professorRelationship: 0, // 0-100
                club: null,
                clubWeeks: 0,
                studyBuddy: null,
                studyBuddyRelationship: 0,
                internshipCompleted: false,
                onProbation: false,
                honorsList: false,
                studyAbroadDone: false,
                thesisStarted: false,
                thesisProgress: 0,
                partiesAttended: 0,
                allNighters: 0,
                droppedClasses: 0
            },
            
            // Trade school specific
            tradeSchool: {
                trade: null, // electrician, plumber, hvac, welder, mechanic
                certLevel: 0, // 0=Student, 1=Apprentice, 2=Journeyman, 3=Master
                hoursLogged: 0,
                projectsCompleted: 0,
                safetyIncidents: 0,
                mentorName: null,
                mentorRelationship: 0,
                unionMember: false,
                toolQuality: 1, // 1-3 (basic, professional, premium)
                clientRating: 50, // 0-100
                injuries: 0
            },
            
            // Employment specific
            career: {
                coworkerAlly: null,
                coworkerRival: null,
                bossRelationship: 50,
                boss: null,  // { name, personality, relationship }
                projectActive: false,
                projectWeek: 0,
                projectSuccess: 0,
                promotionsDenied: 0,
                companiesWorked: 0,
                networkContacts: 0,
                sideHustle: null,
                businessOwner: false,
                lookingForNewJob: false
            },
            
            // Relationship specific
            relationship: {
                datesCount: 0,
                arguments: 0,
                lastDateWeek: 0,
                metFamily: false,
                familyApproval: 50,
                livingTogether: false,
                children: 0,
                childrenAges: [],
                weddingSize: null, // small, medium, large
                anniversaries: 0
            },
            
            // Financial specific
            finances: {
                investments: 0,
                investmentType: null, // conservative, moderate, aggressive
                homeOwned: false,
                homeValue: 0,
                mortgage: 0,
                carOwned: null,
                carValue: 0,
                carPayment: 0,
                creditScore: 650,
                emergencyFund: 0,
                retirementAccount: 0,
                // Credit card
                hasCreditCard: false,
                creditLimit: 0,
                creditBalance: 0,
                creditAPR: 0, // Annual percentage rate
                minPaymentDue: 0,
                missedPayments: 0
            },
            
            // Weekly Balance tracking
            neglect: {
                work: 0,      // Weeks neglecting work
                health: 0,    // Weeks neglecting health
                relationship: 0, // Weeks neglecting partner
                growth: 0,    // Weeks neglecting skills
                fun: 0        // Weeks without fun/relaxation
            },
            
            // Meta
            eventQueue: [],
            usedEvents: new Set(),
            lastEventIds: [],           // Track last few event IDs to prevent immediate repeats
            eventCooldowns: {}          // { eventId: weekLastShown } - prevent certain events too frequently
        };

        // ============ MILITARY SYSTEM ============
        const RANKS = [
            { name: "Recruit", abbr: "RCT", pay: 350 },
            { name: "Private", abbr: "PVT", pay: 400 },
            { name: "Private First Class", abbr: "PFC", pay: 450 },
            { name: "Specialist", abbr: "SPC", pay: 500 },
            { name: "Corporal", abbr: "CPL", pay: 550 },
            { name: "Sergeant", abbr: "SGT", pay: 650 }
        ];

        const MOS_OPTIONS = {
            infantry: { name: "Infantry (11B)", icon: "⚔️", desc: "Front-line combat", statBonus: "physical", combatChance: 0.7, reqPhysical: 45, reqIntel: 0 },
            medic: { name: "Combat Medic (68W)", icon: "🏥", desc: "Save lives under fire", statBonus: "technical", combatChance: 0.5, reqPhysical: 35, reqIntel: 6 },
            engineer: { name: "Combat Engineer (12B)", icon: "💣", desc: "Demolitions & construction", statBonus: "technical", combatChance: 0.4, reqPhysical: 40, reqIntel: 5 },
            intel: { name: "Intelligence (35F)", icon: "🔍", desc: "Information warfare", statBonus: "technical", combatChance: 0.2, reqPhysical: 25, reqIntel: 7 },
            logistics: { name: "Logistics (92A)", icon: "📦", desc: "Supply & support", statBonus: "social", combatChance: 0.15, reqPhysical: 25, reqIntel: 4 },
            armor: { name: "Armor Crewman (19K)", icon: "🛡️", desc: "Tank operations", statBonus: "technical", combatChance: 0.5, reqPhysical: 35, reqIntel: 5, reqHeight: { max: 8 } },
            special_ops: { name: "Special Forces (18X)", icon: "🦅", desc: "Elite operations", statBonus: "physical", combatChance: 0.8, reqPhysical: 65, reqIntel: 6 }
        };

        const BUDDY_NAMES = ["Rodriguez", "Murphy", "Jackson", "Williams", "Davis", "Miller", "Wilson", "Thompson", "Garcia", "Martinez"];

        // ============ UNIVERSITY SYSTEM ============
        const MAJORS = {
            stem: { name: "Computer Science", icon: "💻", desc: "Tech & programming", statBonus: "technical", jobBonus: ["software_dev", "senior_dev", "it_support"], socialPenalty: -5 },
            business: { name: "Business Admin", icon: "📊", desc: "Management & finance", statBonus: "social", jobBonus: ["junior_analyst", "senior_analyst", "marketing", "manager"], socialPenalty: 0 },
            premed: { name: "Pre-Med Biology", icon: "🔬", desc: "Path to medicine", statBonus: "technical", jobBonus: ["dental_hygienist"], socialPenalty: -3, stressBonus: 10 },
            arts: { name: "Fine Arts", icon: "🎨", desc: "Creative expression", statBonus: "creativity", jobBonus: ["marketing"], socialPenalty: 5, moneyPenalty: true },
            engineering: { name: "Engineering", icon: "⚙️", desc: "Build the future", statBonus: "technical", jobBonus: ["software_dev", "senior_dev"], socialPenalty: -5, stressBonus: 5 },
            communications: { name: "Communications", icon: "📣", desc: "Media & PR", statBonus: "social", jobBonus: ["marketing", "admin_assistant"], socialPenalty: 10 }
        };

        const PROFESSOR_TYPES = [
            { name: "Dr. Chen", personality: "demanding", field: "stem", bonus: { technical: 5, stress: 10 } },
            { name: "Prof. Williams", personality: "nurturing", field: "arts", bonus: { creativity: 5, happiness: 5 } },
            { name: "Dr. Reeves", personality: "connected", field: "business", bonus: { social: 5 } },
            { name: "Prof. Martinez", personality: "brilliant", field: "premed", bonus: { technical: 8, stress: 15 } },
            { name: "Dr. Thompson", personality: "inspiring", field: "engineering", bonus: { technical: 5, creativity: 3 } },
            { name: "Prof. Anderson", personality: "charismatic", field: "communications", bonus: { social: 8 } }
        ];

        const CLUBS = {
            greek: { name: "Greek Life (Fraternity/Sorority)", icon: "🏛️", cost: 200, social: 15, happiness: 10, gpaRisk: -0.2, networkBonus: 20 },
            sports: { name: "Intramural Sports", icon: "🏀", cost: 50, physical: 10, social: 5, happiness: 8, energy: -10 },
            academic: { name: "Honor Society", icon: "🎓", cost: 25, technical: 5, gpaBonus: 0.1, social: -5 },
            volunteer: { name: "Community Service", icon: "🤝", cost: 0, social: 10, happiness: 10, resumeBonus: true },
            arts_club: { name: "Arts & Theater", icon: "🎭", cost: 30, creativity: 10, social: 5, happiness: 5 },
            debate: { name: "Debate Team", icon: "🎤", cost: 25, social: 8, technical: 3, confidence: 10 }
        };

        const STUDY_BUDDY_NAMES = ["Alex", "Jamie", "Chris", "Morgan", "Taylor", "Jordan", "Casey", "Riley"];

        // ============ TRADE SCHOOL SYSTEM ============
        const TRADES = {
            electrician: { name: "Electrician", icon: "⚡", desc: "Power systems & wiring", statBonus: "technical", dangerLevel: 3, baseHourlyPay: 18 },
            plumber: { name: "Plumber", icon: "🔧", desc: "Pipes & water systems", statBonus: "technical", dangerLevel: 2, baseHourlyPay: 17 },
            hvac: { name: "HVAC Technician", icon: "❄️", desc: "Heating & cooling", statBonus: "technical", dangerLevel: 2, baseHourlyPay: 19 },
            welder: { name: "Welder", icon: "🔥", desc: "Metal fabrication", statBonus: "technical", dangerLevel: 4, baseHourlyPay: 20 },
            carpenter: { name: "Carpenter", icon: "🪚", desc: "Woodwork & framing", statBonus: "physical", dangerLevel: 2, baseHourlyPay: 16 },
            mechanic: { name: "Auto Mechanic", icon: "🚗", desc: "Vehicle repair", statBonus: "technical", dangerLevel: 2, baseHourlyPay: 17 }
        };

        const TRADE_CERT_LEVELS = [
            { name: "Student", abbr: "STU", hourlyMultiplier: 0.5 },
            { name: "Apprentice", abbr: "APP", hourlyMultiplier: 0.75 },
            { name: "Journeyman", abbr: "JRN", hourlyMultiplier: 1.0 },
            { name: "Master", abbr: "MST", hourlyMultiplier: 1.5 }
        ];

        const TRADE_MENTOR_NAMES = ["Big Mike", "Old Joe", "Dave", "Tony", "Frank", "Carlos", "Steve", "Rick"];

        const TRADE_CLIENT_TYPES = [
            { type: "Residential", difficulty: 10, pay: 1.0, stressBonus: 0 },
            { type: "Commercial", difficulty: 13, pay: 1.3, stressBonus: 5 },
            { type: "Industrial", difficulty: 16, pay: 1.6, stressBonus: 10 },
            { type: "Emergency", difficulty: 12, pay: 2.0, stressBonus: 15 }
        ];

        // ============ EMPLOYMENT/CAREER SYSTEM ============
        const COWORKER_NAMES = ["Sarah", "Mike", "Jennifer", "David", "Lisa", "Kevin", "Amanda", "Brian", "Nicole", "Jason"];
        
        const BOSS_TYPES = [
            { name: "micromanager", trait: "Watches everything", stressBonus: 10, promotionChance: 0.8 },
            { name: "hands-off", trait: "Never around", stressBonus: -5, promotionChance: 0.6 },
            { name: "mentor", trait: "Supportive guide", stressBonus: 0, promotionChance: 1.0 },
            { name: "climber", trait: "Political player", stressBonus: 5, promotionChance: 1.2 },
            { name: "old-school", trait: "By the book", stressBonus: 5, promotionChance: 0.7 }
        ];

        const JOB_CATEGORIES = {
            retail: { jobs: ['fast_food', 'retail', 'server'], projects: ['inventory', 'holiday_rush', 'customer_complaint'], culture: 'fast-paced' },
            office: { jobs: ['admin_assistant', 'junior_analyst', 'accountant', 'marketing', 'senior_analyst', 'manager'], projects: ['quarterly_report', 'audit', 'presentation'], culture: 'corporate' },
            tech: { jobs: ['it_support', 'software_dev', 'senior_dev'], projects: ['product_launch', 'bug_crisis', 'system_migration'], culture: 'startup' },
            trades: { jobs: ['electrician_apprentice', 'plumber_apprentice', 'mechanic', 'master_electrician'], projects: ['big_contract', 'inspection', 'emergency_call'], culture: 'blue-collar' },
            healthcare: { jobs: ['dental_hygienist'], projects: ['difficult_patient', 'compliance_audit', 'equipment_upgrade'], culture: 'clinical' }
        };

        const PROJECT_TYPES = {
            quarterly_report: { name: "Quarterly Report", duration: 4, difficulty: 12, reward: 0.2, failure: 'warning' },
            audit: { name: "Company Audit", duration: 3, difficulty: 14, reward: 0.15, failure: 'stress' },
            presentation: { name: "Big Presentation", duration: 2, difficulty: 13, reward: 0.25, failure: 'reputation' },
            product_launch: { name: "Product Launch", duration: 6, difficulty: 15, reward: 0.4, failure: 'blame' },
            bug_crisis: { name: "Critical Bug Fix", duration: 1, difficulty: 16, reward: 0.3, failure: 'blame' },
            system_migration: { name: "System Migration", duration: 8, difficulty: 14, reward: 0.35, failure: 'overtime' },
            inventory: { name: "Inventory Count", duration: 2, difficulty: 10, reward: 0.1, failure: 'warning' },
            holiday_rush: { name: "Holiday Season", duration: 6, difficulty: 11, reward: 0.2, failure: 'exhaustion' },
            customer_complaint: { name: "Customer Escalation", duration: 1, difficulty: 12, reward: 0.15, failure: 'stress' }
        };

        const SIDE_HUSTLES = {
            freelance: { name: "Freelancing", icon: "💻", income: 200, timeReq: 15, skillReq: 'technical', minSkill: 40 },
            rideshare: { name: "Rideshare Driver", icon: "🚗", income: 150, timeReq: 20, skillReq: null, minSkill: 0 },
            tutoring: { name: "Tutoring", icon: "📚", income: 175, timeReq: 10, skillReq: 'technical', minSkill: 50 },
            ecommerce: { name: "Online Store", icon: "📦", income: 100, timeReq: 8, skillReq: 'social', minSkill: 30, variance: 150 },
            content: { name: "Content Creation", icon: "📱", income: 50, timeReq: 12, skillReq: 'creativity', minSkill: 40, variance: 300 }
        };

        // ============ RELATIONSHIP SYSTEM ============
        const DATE_ACTIVITIES = {
            dinner: { name: "Nice Dinner", icon: "🍽️", cost: 80, bondGain: 8, happinessGain: 10, dc: 10 },
            movie: { name: "Movie Night", icon: "🎬", cost: 40, bondGain: 5, happinessGain: 6, dc: 8 },
            adventure: { name: "Adventure Date", icon: "🎢", cost: 100, bondGain: 12, happinessGain: 15, dc: 12 },
            cooking: { name: "Cook Together", icon: "👨‍🍳", cost: 30, bondGain: 10, happinessGain: 8, dc: 11 },
            concert: { name: "Concert/Show", icon: "🎵", cost: 120, bondGain: 15, happinessGain: 18, dc: 10 },
            staycation: { name: "Weekend Getaway", icon: "🏖️", cost: 300, bondGain: 25, happinessGain: 25, dc: 10 },
            simple: { name: "Walk in the Park", icon: "🌳", cost: 0, bondGain: 4, happinessGain: 5, dc: 8 }
        };

        const RELATIONSHIP_CRISES = [
            { name: "Trust Issues", desc: "They found old texts on your phone. Nothing happened, but...", dc: 14, bondLoss: 15 },
            { name: "Growing Apart", desc: "You've both been so busy. When did you last really talk?", dc: 12, bondLoss: 10 },
            { name: "Family Conflict", desc: "Your families don't get along. It's becoming a problem.", dc: 13, bondLoss: 12 },
            { name: "Future Disagreement", desc: "You want different things. Kids? Location? Career vs family?", dc: 15, bondLoss: 20 },
            { name: "Money Stress", desc: "Financial pressure is straining the relationship.", dc: 11, bondLoss: 8 }
        ];

        const CHILD_NAMES = ["Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Sophia", "Elijah", "Isabella", "Lucas"];
        
        const PARENTING_EVENTS = [
            { age: 0, title: "Sleepless Nights", desc: "The baby won't stop crying. Neither of you has slept.", energy: -30, stress: 20, happiness: -5, bond: 5 },
            { age: 1, title: "First Steps", desc: "They took their first steps today!", energy: 0, stress: -10, happiness: 25, bond: 10 },
            { age: 2, title: "Terrible Twos", desc: "Tantrums. So many tantrums.", energy: -20, stress: 15, happiness: -5, bond: 0 },
            { age: 5, title: "First Day of School", desc: "They look so small with that big backpack.", energy: 10, stress: -5, happiness: 15, bond: 5 },
            { age: 10, title: "Growing Up Fast", desc: "They're developing their own personality. Where did the time go?", energy: 0, stress: 5, happiness: 10, bond: 5 },
            { age: 13, title: "Teenage Rebellion", desc: "Door slamming. Eye rolling. \"You don't understand!\"", energy: -15, stress: 20, happiness: -10, bond: -5 },
            { age: 16, title: "Learning to Drive", desc: "White-knuckle grip on the door handle. They're doing fine.", energy: -10, stress: 15, happiness: 5, bond: 5 },
            { age: 18, title: "Graduation Day", desc: "They did it. They're ready for the world. You're not ready to let go.", energy: 0, stress: -10, happiness: 30, bond: 10 }
        ];

        // ============ RANDOM LIFE EVENTS SYSTEM ============
        const CRISIS_EVENTS = [
            { 
                type: "car_accident",
                title: "Car Accident",
                desc: "Screeching tires. Impact. Your car is totaled.",
                condition: () => state.car !== 'walk' && state.car !== 'bus',
                dc: 13,
                successOutcome: { health: -5, stress: 15, money: -500, text: "Minor accident. You're shaken but okay. Deductible hurts." },
                failOutcome: { health: -25, stress: 30, money: -2000, text: "Serious accident. Hospital bills, no car." },
                critFailOutcome: { health: -40, stress: 40, money: -5000, text: "ICU. Months of recovery. Life-changing." }
            },
            {
                type: "medical_emergency",
                title: "Medical Emergency",
                desc: "Sharp pain. Something's very wrong. You need help NOW.",
                condition: () => true,
                dc: 0,
                successOutcome: { health: -10, stress: 20, money: -800, text: "ER visit. Expensive but caught early. You'll be fine." },
                failOutcome: { health: -20, stress: 30, money: -3000, text: "Surgery required. Recovery will take time." },
                critFailOutcome: { health: -35, stress: 45, money: -10000, text: "Major procedure. Bills are devastating." }
            },
            {
                type: "theft",
                title: "Robbed!",
                desc: "You come home to an open door. Someone's been here.",
                condition: () => state.home !== 'parents',
                dc: 0,
                successOutcome: { happiness: -10, stress: 20, money: -500, text: "Some valuables gone. Police can't help. Violation feeling." },
                failOutcome: { happiness: -15, stress: 25, money: -1500, text: "They took everything of value. Insurance doesn't cover half." },
                critFailOutcome: { happiness: -25, stress: 35, money: -3000, text: "Total loss. Some things had sentimental value. Gone forever." }
            },
            {
                type: "lawsuit",
                title: "Legal Trouble",
                desc: "Official letter. Someone is suing you.",
                condition: () => state.employed || state.finances.homeOwned,
                dc: 14,
                successOutcome: { stress: 25, money: -1000, text: "Lawyer helped settle it. Expensive lesson." },
                failOutcome: { stress: 35, money: -5000, text: "Lost the case. Damages and legal fees pile up." },
                critFailOutcome: { stress: 50, money: -15000, happiness: -20, text: "Devastating judgment. Financial ruin looms." }
            },
            {
                type: "natural_disaster",
                title: "Natural Disaster",
                desc: "Storm, flood, fire — nature doesn't care about your plans.",
                condition: () => state.home !== 'parents',
                dc: 0,
                successOutcome: { stress: 20, money: -1000, happiness: -10, text: "Minor damage. Insurance covers most of it." },
                failOutcome: { stress: 30, money: -5000, happiness: -20, text: "Major damage. Displaced for weeks." },
                critFailOutcome: { stress: 45, money: -20000, happiness: -30, text: "Total loss. Starting over from nothing." }
            }
        ];

        const WINDFALL_EVENTS = [
            {
                title: "Inheritance",
                desc: "A distant relative you barely knew passed away. They left you something.",
                minAmount: 5000,
                maxAmount: 50000,
                condition: () => getAge() >= 25,
                rarity: 0.02
            },
            {
                title: "Lottery Win",
                desc: "You bought a scratch-off on a whim. Wait... is that...?",
                minAmount: 100,
                maxAmount: 10000,
                condition: () => true,
                rarity: 0.01
            },
            {
                title: "Tax Refund Surprise",
                desc: "The accountant found deductions you missed. Big refund incoming.",
                minAmount: 500,
                maxAmount: 3000,
                condition: () => state.employed,
                rarity: 0.03
            },
            {
                title: "Investment Payout",
                desc: "That stock tip from years ago? It finally paid off.",
                minAmount: 1000,
                maxAmount: 20000,
                condition: () => state.finances.investments > 0,
                rarity: 0.02
            },
            {
                title: "Class Action Settlement",
                desc: "Remember that sketchy product? There was a lawsuit. You're getting a check.",
                minAmount: 200,
                maxAmount: 2000,
                condition: () => true,
                rarity: 0.02
            },
            {
                title: "Found Money",
                desc: "Cleaning out old boxes... wait, is that cash? Is that a LOT of cash?",
                minAmount: 100,
                maxAmount: 1000,
                condition: () => true,
                rarity: 0.01
            }
        ];

        const FAMILY_EVENTS = [
            {
                title: "Parent Health Scare",
                desc: "Mom/Dad is in the hospital. Doctor says it's serious.",
                condition: () => getAge() >= 30,
                effects: { stress: 25, happiness: -15, money: -500 },
                choices: true
            },
            {
                title: "Sibling Wedding",
                desc: "Your brother/sister is getting married! You're in the wedding party.",
                condition: () => getAge() >= 22,
                effects: { happiness: 15, money: -800, stress: 10 },
                choices: false
            },
            {
                title: "Family Reunion",
                desc: "The whole extended family is gathering. Aunts, uncles, cousins, drama.",
                condition: () => true,
                effects: { stress: 10, happiness: 5, social: 3 },
                choices: false
            },
            {
                title: "Niece/Nephew Born",
                desc: "Your sibling had a baby! You're an aunt/uncle now.",
                condition: () => getAge() >= 25,
                effects: { happiness: 15 },
                choices: false
            },
            {
                title: "Parent Needs Help",
                desc: "Your parents are getting older. They need help around the house... or more.",
                condition: () => getAge() >= 35,
                effects: { stress: 15, money: -200, happiness: -5 },
                choices: true
            },
            {
                title: "Family Falling Out",
                desc: "Big argument at a family gathering. Things were said. Sides taken.",
                condition: () => true,
                effects: { stress: 20, happiness: -15 },
                choices: false
            }
        ];

        // ============ FINANCIAL SYSTEM ============
        const INVESTMENT_TYPES = {
            conservative: { name: "Conservative (Bonds/Index)", icon: "📊", weeklyReturn: 0.001, risk: 0.05, minLoss: -0.02, maxGain: 0.015 },
            moderate: { name: "Moderate (Balanced)", icon: "📈", weeklyReturn: 0.002, risk: 0.15, minLoss: -0.05, maxGain: 0.04 },
            aggressive: { name: "Aggressive (Growth)", icon: "🚀", weeklyReturn: 0.003, risk: 0.25, minLoss: -0.15, maxGain: 0.1 },
            crypto: { name: "Cryptocurrency", icon: "₿", weeklyReturn: 0.005, risk: 0.4, minLoss: -0.3, maxGain: 0.25 }
        };

        const HOMES_FOR_SALE = {
            starter: { name: "Starter Home", icon: "🏠", price: 150000, downPayment: 30000, mortgage: 800, equity: 0.3, happiness: 15 },
            family: { name: "Family Home", icon: "🏡", price: 300000, downPayment: 60000, mortgage: 1500, equity: 0.35, happiness: 25 },
            luxury: { name: "Luxury Home", icon: "🏰", price: 600000, downPayment: 120000, mortgage: 3000, equity: 0.4, happiness: 40 }
        };

        const CARS_FOR_SALE = {
            used_economy: { name: "Used Economy Car", icon: "🚗", price: 8000, loan: 200, maintenance: 30, reliability: 0.9 },
            used_suv: { name: "Used SUV", icon: "🚙", price: 15000, loan: 350, maintenance: 40, reliability: 0.85 },
            new_sedan: { name: "New Sedan", icon: "🚘", price: 30000, loan: 500, maintenance: 25, reliability: 0.98 },
            new_suv: { name: "New SUV", icon: "🚐", price: 45000, loan: 750, maintenance: 30, reliability: 0.98 },
            sports: { name: "Sports Car", icon: "🏎️", price: 60000, loan: 1000, maintenance: 50, reliability: 0.95 }
        };

        const CREDIT_SCORE_FACTORS = {
            excellent: { min: 750, loanMultiplier: 0.9, approvalBonus: 20 },
            good: { min: 700, loanMultiplier: 1.0, approvalBonus: 10 },
            fair: { min: 650, loanMultiplier: 1.1, approvalBonus: 0 },
            poor: { min: 0, loanMultiplier: 1.3, approvalBonus: -20 }
        };

        function getCreditTier() {
            if (state.finances.creditScore >= 750) return CREDIT_SCORE_FACTORS.excellent;
            if (state.finances.creditScore >= 700) return CREDIT_SCORE_FACTORS.good;
            if (state.finances.creditScore >= 650) return CREDIT_SCORE_FACTORS.fair;
            return CREDIT_SCORE_FACTORS.poor;
        }

        // Neglect thresholds - consecutive weeks of neglect before consequences
        const NEGLECT_THRESHOLDS = {
            work: { weeks: 4, consequence: "Performance review warning" },
            health: { weeks: 6, consequence: "Health issues emerge" },
            relationship: { weeks: 5, consequence: "Partner feels neglected" },
            growth: { weeks: 8, consequence: "Feeling stagnant" },
            fun: { weeks: 6, consequence: "Burnout risk" }
        };

        function getNeglectWarningEvent() {
            // Check each neglect area and return warning event if threshold exceeded
            // ALSO check actual stat levels - not just neglect counters!
            
            // ============ STAT-BASED WARNINGS (actual levels) ============
            
            // CRITICAL HEALTH WARNING (health < 30)
            if (state.health < 30 && Math.random() < 0.4) {
                return {
                    category: "🚨 Health Crisis",
                    title: "Body Shutting Down",
                    desc: `Your health is at ${Math.round(state.health)}%. Your body is failing. This is serious.`,
                    choices: [
                        {
                            text: "Emergency room visit [-$500]",
                            condition: () => state.money >= 500,
                            effect: () => {
                                state.money -= 500;
                                state.health = Math.min(100, state.health + 30);
                                state.energy = Math.min(100, state.energy + 20);
                                return { icon: "🏥", text: "Doctors stabilize you. You need to make changes.", stats: "-$500, +30 Health, +20 Energy" };
                            }
                        },
                        {
                            text: "Rest at home (free but slower)",
                            effect: () => {
                                state.health = Math.min(100, state.health + 10);
                                state.energy = Math.min(100, state.energy + 15);
                                if (state.employed) state.performance -= 15;
                                return { icon: "🛏️", text: "You stay in bed for days. Slowly recovering.", stats: "+10 Health, -15 Performance" };
                            }
                        },
                        {
                            text: "Ignore it (dangerous)",
                            effect: () => {
                                state.health -= 10;
                                if (state.health <= 0) {
                                    return { icon: "💀", text: "This is the end...", stats: "Game Over" };
                                }
                                return { icon: "💀", text: "You're gambling with your life.", stats: "-10 Health (critical!)" };
                            }
                        }
                    ]
                };
            }
            
            // HIGH STRESS WARNING (stress > 75)
            if (state.stress > 75 && Math.random() < 0.35) {
                return {
                    category: "🔥 Burnout",
                    title: "Breaking Point",
                    desc: `Your stress is at ${Math.round(state.stress)}%. You're barely holding it together. Something has to give.`,
                    choices: [
                        {
                            text: "Take a mental health day",
                            effect: () => {
                                state.stress -= 25;
                                state.energy += 20;
                                state.happiness += 10;
                                if (state.employed) state.performance -= 5;
                                return { icon: "🧘", text: "You called in. Breathe. Reset.", stats: "-25 Stress, +20 Energy, -5 Performance" };
                            }
                        },
                        {
                            text: "Push through (risk health)",
                            effect: () => {
                                state.health -= 15;
                                state.stress += 5;
                                return { icon: "😰", text: "Your body is paying the price for your mind.", stats: "-15 Health, +5 Stress" };
                            }
                        },
                        {
                            text: "Quit the source of stress",
                            condition: () => state.employed,
                            effect: () => {
                                let oldJob = state.jobTitle;
                                state.employed = false;
                                state.job = null;
                                state.phase = 'job_hunting';
                                state.stress -= 40;
                                state.happiness += 15;
                                addLog(`Quit ${oldJob} for mental health`);
                                return { icon: "🚪", text: "You quit. Instant relief... but now what?", stats: "-40 Stress, +15 Happy, Unemployed" };
                            }
                        }
                    ]
                };
            }
            
            // LOW ENERGY WARNING (energy < 25)
            if (state.energy < 25 && Math.random() < 0.3) {
                return {
                    category: "😴 Exhaustion",
                    title: "Running on Empty",
                    desc: `Your energy is at ${Math.round(state.energy)}%. You can barely function. Everything is harder.`,
                    choices: [
                        {
                            text: "Sleep it off (skip responsibilities)",
                            effect: () => {
                                state.energy = Math.min(100, state.energy + 40);
                                state.stress -= 10;
                                if (state.employed) state.performance -= 8;
                                if (state.phase === 'education') state.gpa = Math.max(0, state.gpa - 0.05);
                                return { icon: "😴", text: "You slept 14 hours straight. Feel human again.", stats: "+40 Energy, -10 Stress, Missed stuff" };
                            }
                        },
                        {
                            text: "Coffee and push through",
                            effect: () => {
                                state.energy += 15;
                                state.health -= 5;
                                state.stress += 5;
                                return { icon: "☕", text: "Caffeine is not a substitute for sleep. But it'll do.", stats: "+15 Energy, -5 Health, +5 Stress" };
                            }
                        },
                        {
                            text: "Rearrange schedule (long-term fix)",
                            effect: () => {
                                state.energy += 20;
                                state.freeTime.rest = Math.min(10, (state.freeTime.rest || 0) + 4);
                                return { icon: "📅", text: "You block out more time for rest going forward.", stats: "+20 Energy, +4 hrs rest/week" };
                            }
                        }
                    ]
                };
            }
            
            // LOW FITNESS WARNING (fitness < 25)
            if (state.fitness.fitnessLevel < 25 && Math.random() < 0.2) {
                return {
                    category: "⚠️ Fitness",
                    title: "Out of Shape",
                    desc: `Your fitness is at ${Math.round(state.fitness.fitnessLevel)}%. You get winded climbing stairs. Your body is struggling.`,
                    choices: [
                        {
                            text: "Join a gym",
                            condition: () => !state.fitness.gymMember && state.money >= 200,
                            effect: () => {
                                state.fitness.gymMember = true;
                                state.weeklyExpenses += 50;
                                state.money -= 50; // First week
                                return { icon: "🏋️", text: "New gym membership. Time to turn this around.", stats: "Gym membership started" };
                            }
                        },
                        {
                            text: "Start eating healthier",
                            condition: () => !state.fitness.healthyEating,
                            effect: () => {
                                state.fitness.healthyEating = true;
                                state.weeklyExpenses += 30;
                                return { icon: "🥗", text: "Meal prep begins. Small steps.", stats: "Healthy eating started" };
                            }
                        },
                        {
                            text: "Go for a walk (free, small help)",
                            effect: () => {
                                state.fitness.fitnessLevel = Math.min(100, state.fitness.fitnessLevel + 2);
                                state.energy += 5;
                                return { icon: "🚶", text: "A walk around the block. It's a start.", stats: "+2 Fitness, +5 Energy" };
                            }
                        },
                        {
                            text: "Ignore it",
                            effect: () => {
                                state.health -= 5;
                                return { icon: "🍔", text: "You'll deal with it later. Maybe.", stats: "-5 Health" };
                            }
                        }
                    ]
                };
            }
            
            // LOW PERFORMANCE AT WORK (performance < 35)
            if (state.employed && state.performance < 35 && Math.random() < 0.4) {
                return {
                    category: "⚠️ Career",
                    title: "On Thin Ice",
                    desc: `Your work performance is at ${Math.round(state.performance)}%. HR has scheduled a meeting.`,
                    choices: [
                        {
                            text: "Put in extra effort this week",
                            effect: () => {
                                state.performance = Math.min(100, state.performance + 15);
                                state.stress += 15;
                                state.energy -= 20;
                                return { icon: "💪", text: "You stayed late every night. They noticed the improvement.", stats: "+15 Performance, +15 Stress, -20 Energy" };
                            }
                        },
                        {
                            text: "Ask for help from a coworker",
                            condition: () => state.career.coworkerAlly,
                            effect: () => {
                                state.performance = Math.min(100, state.performance + 10);
                                state.skills.social += 2;
                                return { icon: "🤝", text: `${state.career.coworkerAlly} covers for you and helps you catch up.`, stats: "+10 Performance" };
                            }
                        },
                        {
                            text: "Start looking for other jobs",
                            effect: () => {
                                state.lookingForNewJob = true;
                                state.stress += 10;
                                return { icon: "🔍", text: "Better to leave on your terms than get fired.", stats: "Now job hunting" };
                            }
                        }
                    ]
                };
            }
            
            // ============ NEGLECT-BASED WARNINGS (original system) ============
            
            if (state.neglect.work >= NEGLECT_THRESHOLDS.work.weeks && state.employed) {
                return {
                    category: "⚠️ Warning",
                    title: "Performance Slipping",
                    desc: `You've been coasting at work for ${state.neglect.work} weeks. Your boss has noticed. (Performance: ${Math.round(state.performance)}%)`,
                    choices: [
                        {
                            text: "Promise to do better [Reset neglect, +20 Stress]",
                            effect: () => {
                                state.neglect.work = 0;
                                state.stress += 20;
                                state.performance = Math.max(20, state.performance - 10);
                                return { icon: "😰", text: "You smooth things over, but the pressure is on.", stats: "-10 Performance, +20 Stress" };
                            }
                        },
                        {
                            text: "Blame external factors [50% chance they buy it]",
                            effect: () => {
                                if (Math.random() > 0.5) {
                                    state.neglect.work = Math.floor(state.neglect.work / 2);
                                    return { icon: "🤷", text: "They bought your excuse. For now.", stats: "Partial neglect reset" };
                                }
                                state.performance -= 20;
                                state.career.bossRelationship -= 15;
                                state.neglect.work = 0;
                                return { icon: "😬", text: "They didn't buy it. You're on thin ice.", stats: "-20 Performance, -15 Boss relationship" };
                            }
                        },
                        {
                            text: "Accept the consequences",
                            effect: () => {
                                state.performance -= 15;
                                state.neglect.work = 0;
                                if (state.performance < 20) {
                                    state.employed = false;
                                    state.job = null;
                                    state.phase = 'job_hunting';
                                    addLog("Fired for poor performance");
                                    return { icon: "📦", text: "You're let go. Time to find something new.", stats: "Fired!" };
                                }
                                return { icon: "📉", text: "Formal warning on your record.", stats: "-15 Performance" };
                            }
                        }
                    ]
                };
            }
            
            if (state.neglect.health >= NEGLECT_THRESHOLDS.health.weeks || (state.health < 50 && state.neglect.health >= 3)) {
                return {
                    category: "⚠️ Health Warning",
                    title: "Body Breaking Down",
                    desc: `You've ignored your health for ${state.neglect.health} weeks. Health: ${Math.round(state.health)}%. Your body is rebelling.`,
                    choices: [
                        {
                            text: "See a doctor [-$200, Prevent worse]",
                            condition: () => state.money >= 200,
                            effect: () => {
                                state.money -= 200;
                                state.health -= 10;
                                state.neglect.health = 0;
                                return { icon: "🏥", text: "Doctor says you caught it early. Rest and lifestyle changes needed.", stats: "-$200, -10 Health, Neglect reset" };
                            }
                        },
                        {
                            text: "Push through [-25 Health, Keep going]",
                            effect: () => {
                                state.health -= 25;
                                state.energy -= 20;
                                state.neglect.health = Math.floor(state.neglect.health / 2);
                                if (state.health <= 20) {
                                    state.stress += 30;
                                    return { icon: "🚨", text: "Collapse imminent. You need to change NOW.", stats: "-25 Health, -20 Energy, Critical!" };
                                }
                                return { icon: "😤", text: "You ignore the warning signs. For now.", stats: "-25 Health, -20 Energy" };
                            }
                        },
                        {
                            text: "Take a week off [Miss work, Full recovery]",
                            effect: () => {
                                state.health = Math.min(100, state.health + 20);
                                state.energy = Math.min(100, state.energy + 30);
                                state.neglect.health = 0;
                                if (state.employed) state.performance -= 10;
                                return { icon: "🛏️", text: "Rest. Real rest. Your body thanks you.", stats: "+20 Health, +30 Energy, -10 Perf" };
                            }
                        }
                    ]
                };
            }
            
            if (state.neglect.relationship >= NEGLECT_THRESHOLDS.relationship.weeks && state.hasPartner) {
                return {
                    category: "💔 Relationship Warning",
                    title: `${state.partnerName} Feels Neglected`,
                    desc: `You haven't prioritized the relationship in ${state.neglect.relationship} weeks. ${state.partnerName} is pulling away.`,
                    choices: [
                        {
                            text: "Plan a special date [-$150, Show you care]",
                            condition: () => state.money >= 150,
                            effect: () => {
                                state.money -= 150;
                                state.partnerStats.supportiveness += 15;
                                state.neglect.relationship = 0;
                                state.happiness += 10;
                                return { icon: "💕", text: `${state.partnerName} is touched by the effort. "I needed this."`, stats: "-$150, +15 Bond, +10 Happy" };
                            }
                        },
                        {
                            text: "Have an honest conversation [Risky but free]",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 12);
                                state.neglect.relationship = 0;
                                
                                if (check.success) {
                                    state.partnerStats.supportiveness += 10;
                                    return { icon: "🤝", text: `[Rolled ${check.total}] You talked it out. Understanding reached.`, stats: "+10 Bond" };
                                }
                                state.partnerStats.supportiveness -= 10;
                                state.stress += 15;
                                return { icon: "😢", text: `[Rolled ${check.total}] It turned into an argument. Tension remains.`, stats: "-10 Bond, +15 Stress" };
                            }
                        },
                        {
                            text: "Promise to change [Buys time but...]",
                            effect: () => {
                                state.neglect.relationship = 2; // Partial reset
                                state.partnerStats.supportiveness -= 5;
                                return { icon: "🤞", text: `"I'll do better." ${state.partnerName} has heard this before.`, stats: "-5 Bond, Partial reset" };
                            }
                        },
                        {
                            text: "Maybe we need space...",
                            effect: () => {
                                if (state.partnerStats.supportiveness < 40) {
                                    state.hasPartner = false;
                                    state.partnerName = null;
                                    state.happiness -= 25;
                                    addLog("Relationship ended");
                                    return { icon: "💔", text: "It's over. They agree. Maybe it's for the best?", stats: "-25 Happiness, Relationship ended" };
                                }
                                state.partnerStats.supportiveness -= 20;
                                state.neglect.relationship = 0;
                                return { icon: "😔", text: `${state.partnerName} is hurt but gives you space.`, stats: "-20 Bond" };
                            }
                        }
                    ]
                };
            }
            
            if (state.neglect.fun >= NEGLECT_THRESHOLDS.fun.weeks || (state.stress > 60 && state.happiness < 40)) {
                return {
                    category: "⚠️ Burnout Warning",
                    title: "All Work, No Play",
                    desc: `${state.neglect.fun} weeks without real relaxation. Stress: ${Math.round(state.stress)}%, Happiness: ${Math.round(state.happiness)}%. You're burning out.`,
                    choices: [
                        {
                            text: "Take a mental health day [+Energy, -Performance]",
                            effect: () => {
                                state.energy += 25;
                                state.happiness += 15;
                                state.stress -= 20;
                                state.neglect.fun = 0;
                                if (state.employed) state.performance -= 5;
                                return { icon: "🌴", text: "You called in. Guilt-free rest. Needed this.", stats: "+25 Energy, +15 Happy, -20 Stress" };
                            }
                        },
                        {
                            text: "Small treat [-$50, Partial relief]",
                            condition: () => state.money >= 50,
                            effect: () => {
                                state.money -= 50;
                                state.happiness += 8;
                                state.stress -= 10;
                                state.neglect.fun = Math.floor(state.neglect.fun / 2);
                                return { icon: "🎁", text: "A small indulgence. Helps a little.", stats: "-$50, +8 Happy, -10 Stress" };
                            }
                        },
                        {
                            text: "Keep grinding [Risk serious burnout]",
                            effect: () => {
                                state.neglect.fun += 2;
                                state.stress += 15;
                                state.happiness -= 10;
                                if (state.stress > 80) {
                                    state.health -= 15;
                                    return { icon: "🔥", text: "Pushing through... but at what cost?", stats: "+15 Stress, -10 Happy, -15 Health (burnout)" };
                                }
                                return { icon: "😤", text: "No time for fun. Back to the grind.", stats: "+15 Stress, -10 Happy" };
                            }
                        }
                    ]
                };
            }
            
            return null;
        }

        // Store last roll for display
        let lastRollData = null;

        function rollD20() {
            return Math.floor(Math.random() * 20) + 1;
        }

        function rollWithModifier(baseStat, difficulty, context = {}) {
            let roll = rollD20();
            
            // Base modifier from stat
            let statModifier = Math.floor((baseStat - 50) / 10);
            
            // Stress penalty (high stress impairs performance)
            let stressPenalty = 0;
            if (state.stress >= 80) stressPenalty = -4;       // Severe: barely functioning
            else if (state.stress >= 60) stressPenalty = -2;  // High: noticeably impaired
            else if (state.stress >= 40) stressPenalty = -1;  // Moderate: slightly off
            // Low stress = no penalty
            
            // Energy penalty (exhaustion hurts)
            let energyPenalty = 0;
            if (state.energy <= 20) energyPenalty = -2;
            else if (state.energy <= 40) energyPenalty = -1;
            
            // Combine all modifiers
            let totalModifier = statModifier + stressPenalty + energyPenalty;
            let total = roll + totalModifier;
            
            let result = { 
                roll, 
                modifier: totalModifier,
                statMod: statModifier,
                stressMod: stressPenalty,
                energyMod: energyPenalty,
                total, 
                success: total >= difficulty, 
                nat20: roll === 20, 
                nat1: roll === 1, 
                dc: difficulty,
                context: context
            };
            lastRollData = result; // Store for animation
            return result;
        }
        
        function buildModifierBreakdown(rollData) {
            let parts = [];
            
            // Start with the roll
            parts.push(`<span class="text-white font-mono">${rollData.roll}</span>`);
            
            // Stat modifier
            if (rollData.statMod !== 0) {
                let color = rollData.statMod > 0 ? 'text-cyan-400' : 'text-orange-400';
                let sign = rollData.statMod > 0 ? '+' : '';
                parts.push(`<span class="${color}">${sign}${rollData.statMod} skill</span>`);
            }
            
            // Stress penalty
            if (rollData.stressMod && rollData.stressMod !== 0) {
                parts.push(`<span class="text-purple-400">${rollData.stressMod} stress</span>`);
            }
            
            // Energy penalty
            if (rollData.energyMod && rollData.energyMod !== 0) {
                parts.push(`<span class="text-yellow-600">${rollData.energyMod} fatigue</span>`);
            }
            
            // Build the breakdown string
            let breakdown = `<div class="text-gray-300 mt-1">`;
            breakdown += parts.join(' <span class="text-gray-500">→</span> ');
            breakdown += ` <span class="text-gray-500">=</span> <span class="font-bold text-white">${rollData.total}</span>`;
            breakdown += `</div>`;
            
            // Target DC
            breakdown += `<div class="text-gray-400">Need: <span class="font-bold">${rollData.dc}</span>`;
            let margin = rollData.total - rollData.dc;
            if (!rollData.nat1 && !rollData.nat20) {
                if (margin >= 0) {
                    breakdown += ` <span class="text-green-400">(+${margin})</span>`;
                } else {
                    breakdown += ` <span class="text-red-400">(${margin})</span>`;
                }
            }
            breakdown += `</div>`;
            
            return breakdown;
        }
        
        function showDiceRoll(rollData) {
            return new Promise((resolve) => {
                let diceDisplay = document.getElementById('diceDisplay');
                let diceRoller = document.getElementById('diceRoller');
                let diceResult = document.getElementById('diceResult');
                let diceValue = document.getElementById('diceValue');
                let diceLabel = document.getElementById('diceLabel');
                
                // Reset and show
                diceRoller.innerHTML = '<div class="dice">🎲</div>';
                diceResult.classList.add('hidden');
                diceDisplay.classList.remove('hidden');
                
                // Animate through random numbers (SLOWER)
                let animDuration = 1200; // Slower roll
                let startTime = Date.now();
                let animInterval = setInterval(() => {
                    let elapsed = Date.now() - startTime;
                    if (elapsed < animDuration) {
                        let randomNum = Math.floor(Math.random() * 20) + 1;
                        // Slow down animation as it progresses
                        diceRoller.innerHTML = `<div class="dice" style="animation: none; font-size: 3rem;">${randomNum}</div>`;
                    }
                }, 80); // Slower interval
                
                // Show final result
                setTimeout(() => {
                    clearInterval(animInterval);
                    diceRoller.classList.add('hidden');
                    diceResult.classList.remove('hidden');
                    
                    // Set the value and styling
                    diceValue.innerText = rollData.roll;
                    diceValue.className = 'text-5xl font-bold';
                    
                    // Build detailed modifier breakdown
                    let modBreakdown = buildModifierBreakdown(rollData);
                    
                    if (rollData.nat20) {
                        diceValue.classList.add('dice-nat20');
                        diceLabel.innerHTML = `<div class="text-lg font-bold">✨ NATURAL 20! ✨</div>${modBreakdown}<div class="text-yellow-400 font-bold mt-1">AUTO SUCCESS!</div>`;
                        diceLabel.className = 'text-sm mt-2';
                    } else if (rollData.nat1) {
                        diceValue.classList.add('dice-nat1');
                        diceLabel.innerHTML = `<div class="text-lg font-bold">💀 CRITICAL FAIL!</div>${modBreakdown}<div class="text-red-400 font-bold mt-1">AUTO FAIL!</div>`;
                        diceLabel.className = 'text-sm mt-2';
                    } else if (rollData.success) {
                        diceValue.classList.add('dice-success');
                        diceLabel.innerHTML = `<div class="text-lg font-bold text-green-400">✓ Success!</div>${modBreakdown}`;
                        diceLabel.className = 'text-sm mt-2';
                    } else {
                        diceValue.classList.add('dice-fail');
                        diceLabel.innerHTML = `<div class="text-lg font-bold text-red-400">✗ Failed</div>${modBreakdown}`;
                        diceLabel.className = 'text-sm mt-2';
                    }
                    
                    // Hide after showing result (longer to read breakdown)
                    setTimeout(() => {
                        diceDisplay.classList.add('hidden');
                        diceRoller.classList.remove('hidden');
                        resolve();
                    }, 2000); // 2 seconds to read the result
                }, animDuration);
            });
        }

        function getMilitaryRank() {
            return RANKS[state.military.rank];
        }

        // ============ HOUSING ============
        const HOUSING = {
            parents: { name: "Parents' House", icon: "🏠", rent: 0, happiness: -2, stress: 5, appeal: -15, desc: "Free but cramped", upgradeReq: { money: 400 } },
            room: { name: "Rented Room", icon: "🚪", rent: 100, happiness: 0, stress: 2, appeal: 0, desc: "$100/week", upgradeReq: { money: 800, creditScore: 550 } },
            apartment: { name: "Studio Apartment", icon: "🏢", rent: 200, happiness: 5, stress: 0, appeal: 5, desc: "$200/week", upgradeReq: { money: 1500, creditScore: 600 } },
            nice_apartment: { name: "1BR Apartment", icon: "🏢", rent: 350, happiness: 10, stress: -3, appeal: 12, desc: "$350/week", upgradeReq: { money: 3000, creditScore: 650 } },
            house: { name: "Small House", icon: "🏡", rent: 500, happiness: 15, stress: -5, appeal: 20, desc: "$500/week", upgradeReq: null }
        };
        
        const HOUSING_ORDER = ['parents', 'room', 'apartment', 'nice_apartment', 'house'];

        // ============ TRANSPORT ============
        const TRANSPORT = {
            walk: { name: "Walking", icon: "🚶", cost: 0, stress: 8, appeal: -10, desc: "Free but slow", upgradeReq: { money: 50 } },
            bus: { name: "Bus Pass", icon: "🚌", cost: 20, stress: 5, appeal: -5, desc: "$20/week", upgradeReq: { money: 100 } },
            bike: { name: "Bicycle", icon: "🚲", cost: 5, stress: 3, appeal: 0, desc: "$5/week upkeep", upgradeReq: { money: 800, creditScore: 500 } },
            beater: { name: "Old Car", icon: "🚗", cost: 50, stress: 2, appeal: 8, desc: "$50/week (gas+insurance)", upgradeReq: { money: 3000, creditScore: 600 } },
            car: { name: "Reliable Car", icon: "🚙", cost: 100, stress: 0, appeal: 15, desc: "$100/week", upgradeReq: null }
        };
        
        const TRANSPORT_ORDER = ['walk', 'bus', 'bike', 'beater', 'car'];

        // ============ FISHING MINI-GAME ============
        const FISH_TYPES = {
            // Common fish (DC 8-10)
            bluegill: { name: "Bluegill", icon: "🐟", dc: 8, value: 5, xp: 1, rarity: "common" },
            perch: { name: "Perch", icon: "🐟", dc: 9, value: 8, xp: 1, rarity: "common" },
            catfish: { name: "Catfish", icon: "🐱", dc: 10, value: 12, xp: 2, rarity: "common" },
            carp: { name: "Carp", icon: "🐟", dc: 9, value: 6, xp: 1, rarity: "common" },
            
            // Uncommon fish (DC 12-14)
            bass: { name: "Largemouth Bass", icon: "🐟", dc: 12, value: 25, xp: 3, rarity: "uncommon" },
            trout: { name: "Rainbow Trout", icon: "🌈", dc: 13, value: 30, xp: 3, rarity: "uncommon" },
            pike: { name: "Northern Pike", icon: "🦈", dc: 14, value: 35, xp: 4, rarity: "uncommon" },
            walleye: { name: "Walleye", icon: "👁️", dc: 13, value: 40, xp: 4, rarity: "uncommon" },
            
            // Rare fish (DC 16-18)
            salmon: { name: "Atlantic Salmon", icon: "🐠", dc: 16, value: 60, xp: 6, rarity: "rare" },
            muskie: { name: "Muskie", icon: "🦈", dc: 17, value: 80, xp: 7, rarity: "rare" },
            sturgeon: { name: "Sturgeon", icon: "🐋", dc: 18, value: 100, xp: 8, rarity: "rare" },
            
            // Legendary fish (DC 20+)
            goldenTrout: { name: "Golden Trout", icon: "✨", dc: 20, value: 200, xp: 15, rarity: "legendary" },
            giantCatfish: { name: "Giant Catfish", icon: "👑", dc: 22, value: 300, xp: 20, rarity: "legendary" },
            lochNess: { name: "???", icon: "🦕", dc: 25, value: 1000, xp: 50, rarity: "mythical" },
            
            // Junk (always catchable)
            boot: { name: "Old Boot", icon: "👢", dc: 0, value: 0, xp: 0, rarity: "junk" },
            tire: { name: "Tire", icon: "⭕", dc: 0, value: 0, xp: 0, rarity: "junk" },
            can: { name: "Tin Can", icon: "🥫", dc: 0, value: 0, xp: 0, rarity: "junk" }
        };
        
        const FISHING_LOCATIONS = {
            pond: { name: "Local Pond", icon: "🏞️", fish: ['bluegill', 'perch', 'catfish', 'carp', 'boot', 'can'], cost: 0, bonus: 0 },
            lake: { name: "Lake", icon: "🌊", fish: ['bass', 'trout', 'pike', 'walleye', 'catfish', 'bluegill', 'tire'], cost: 10, bonus: 2 },
            river: { name: "River", icon: "🏞️", fish: ['salmon', 'trout', 'bass', 'pike', 'sturgeon', 'boot'], cost: 15, bonus: 3 },
            ocean: { name: "Deep Sea", icon: "🌊", fish: ['muskie', 'sturgeon', 'salmon', 'goldenTrout', 'giantCatfish'], cost: 50, bonus: 5 },
            secret: { name: "Secret Spot", icon: "🗺️", fish: ['goldenTrout', 'giantCatfish', 'lochNess', 'sturgeon'], cost: 100, bonus: 8, unlock: 50 }
        };

        // ============ HABITS ============
        const HABITS = {
            // GOOD HABITS (cost willpower to maintain)
            earlyRiser: {
                name: "Early Riser",
                icon: "🌅",
                type: "good",
                desc: "Wake up at 6am consistently",
                baseCost: 15,
                effects: {
                    energy: 3,
                    happiness: 1,
                    desc: "+3 Energy, +1 Happy/week"
                }
            },
            exercise: {
                name: "Daily Exercise",
                icon: "🏃",
                type: "good",
                desc: "30 min exercise daily",
                baseCost: 18,
                requires: () => true,
                effects: {
                    health: 2,
                    physical: 0.3,
                    stress: -2,
                    desc: "+2 Health, +0.3 Physical, -2 Stress/week"
                }
            },
            healthyEating: {
                name: "Healthy Eating",
                icon: "🥗",
                type: "good",
                desc: "Meal prep, avoid junk food",
                baseCost: 12,
                moneyCost: 30,
                effects: {
                    health: 3,
                    energy: 2,
                    attractiveness: 0.02,
                    desc: "+3 Health, +2 Energy, slight looks boost"
                }
            },
            meditation: {
                name: "Daily Meditation",
                icon: "🧘",
                type: "good",
                desc: "15 min mindfulness practice",
                baseCost: 10,
                effects: {
                    stress: -5,
                    happiness: 2,
                    willpowerRegen: 3,
                    desc: "-5 Stress, +2 Happy, +3 Willpower regen"
                }
            },
            reading: {
                name: "Daily Reading",
                icon: "📖",
                type: "good",
                desc: "Read for 30 min before bed",
                baseCost: 8,
                effects: {
                    technical: 0.2,
                    creativity: 0.2,
                    stress: -1,
                    desc: "+0.2 Technical, +0.2 Creativity"
                }
            },
            noPhone: {
                name: "Phone-Free Mornings",
                icon: "📵",
                type: "good",
                desc: "No phone for first hour",
                baseCost: 14,
                effects: {
                    stress: -3,
                    energy: 2,
                    happiness: 1,
                    desc: "-3 Stress, +2 Energy, +1 Happy"
                }
            },
            budgeting: {
                name: "Track Spending",
                icon: "📊",
                type: "good",
                desc: "Review finances weekly",
                baseCost: 6,
                effects: {
                    moneySave: 0.05,
                    desc: "Save 5% on weekly expenses"
                }
            },
            
            // BAD HABITS (give willpower BACK but have negative effects)
            smoking: {
                name: "Smoking",
                icon: "🚬",
                type: "bad",
                desc: "A pack a day keeps the stress away... temporarily",
                willpowerGain: 8,
                moneyCost: 50,
                effects: {
                    health: -3,
                    stress: -4,
                    attractiveness: -0.05,
                    desc: "-3 Health, -4 Stress, costs $50/week"
                }
            },
            drinking: {
                name: "Heavy Drinking",
                icon: "🍺",
                type: "bad",
                desc: "Several drinks most nights",
                willpowerGain: 10,
                moneyCost: 60,
                effects: {
                    health: -2,
                    energy: -3,
                    stress: -5,
                    social: 0.2,
                    desc: "-2 Health, -3 Energy, -5 Stress, $60/week"
                }
            },
            junkFood: {
                name: "Junk Food Diet",
                icon: "🍔",
                type: "bad",
                desc: "Fast food and snacks",
                willpowerGain: 6,
                moneyCost: 40,
                effects: {
                    health: -2,
                    happiness: 3,
                    attractiveness: -0.03,
                    desc: "-2 Health, +3 Happy, -looks, $40/week"
                }
            },
            doomScrolling: {
                name: "Doom Scrolling",
                icon: "📱",
                type: "bad",
                desc: "Hours on social media daily",
                willpowerGain: 7,
                effects: {
                    energy: -2,
                    happiness: -2,
                    stress: 2,
                    social: 0.1,
                    desc: "-2 Energy, -2 Happy, +2 Stress"
                }
            },
            gambling: {
                name: "Gambling",
                icon: "🎰",
                type: "bad",
                desc: "Regular betting/casino visits",
                willpowerGain: 12,
                moneyCost: 100,
                effects: {
                    stress: -3,
                    happiness: 2,
                    moneyRisk: true,
                    desc: "Stress relief but $100+/week risk"
                }
            },
            lateSleeper: {
                name: "Night Owl",
                icon: "🦉",
                type: "bad",
                desc: "Stay up past 2am regularly",
                willpowerGain: 5,
                effects: {
                    energy: -4,
                    creativity: 0.3,
                    health: -1,
                    desc: "-4 Energy, -1 Health, +0.3 Creativity"
                }
            },
            procrastination: {
                name: "Procrastinator",
                icon: "⏰",
                type: "bad",
                desc: "Put everything off until last minute",
                willpowerGain: 8,
                effects: {
                    stress: 3,
                    technical: -0.2,
                    happiness: 2,
                    desc: "+3 Stress, -0.2 Technical, +2 Happy (short-term)"
                }
            }
        };

        // ============ SUBSCRIPTIONS ============
        const SUBSCRIPTIONS = {
            gym: {
                name: "Gym Membership",
                icon: "🏋️",
                desc: "Access to fitness equipment",
                cost: 50,
                effects: { 
                    desc: "Enables gym in free time, +Physical, +Attractiveness over time",
                    onSubscribe: () => { state.fitness.gymMember = true; },
                    onCancel: () => { state.fitness.gymMember = false; state.freeTime.gym = 0; }
                }
            },
            streaming: {
                name: "Streaming Services",
                icon: "📺",
                desc: "Netflix, etc.",
                cost: 15,
                effects: { 
                    desc: "+2 Happiness/week, cheaper Rest activity",
                    weekly: () => { state.happiness = Math.min(100, state.happiness + 2); }
                }
            },
            music: {
                name: "Music Streaming",
                icon: "🎵",
                desc: "Spotify, etc.",
                cost: 10,
                effects: { 
                    desc: "+1 Happiness/week, -1 Stress/week",
                    weekly: () => { 
                        state.happiness = Math.min(100, state.happiness + 1);
                        state.stress = Math.max(0, state.stress - 1);
                    }
                }
            },
            mealKit: {
                name: "Meal Kit Delivery",
                icon: "🥗",
                desc: "Hello Fresh, etc.",
                cost: 60,
                effects: { 
                    desc: "+2 Health/week, enables healthy eating bonus",
                    onSubscribe: () => { state.fitness.healthyEating = true; },
                    onCancel: () => { state.fitness.healthyEating = false; },
                    weekly: () => { state.health = Math.min(100, state.health + 2); }
                }
            },
            cloud: {
                name: "Cloud Storage",
                icon: "☁️",
                desc: "Backup & productivity",
                cost: 10,
                effects: { 
                    desc: "+0.2 Technical/week",
                    weekly: () => { state.skills.technical = Math.min(100, state.skills.technical + 0.2); }
                }
            },
            news: {
                name: "News Subscription",
                icon: "📰",
                desc: "Stay informed",
                cost: 15,
                effects: { 
                    desc: "+0.1 Social/week, better interview performance",
                    weekly: () => { state.skills.social = Math.min(100, state.skills.social + 0.1); }
                }
            },
            gaming: {
                name: "Game Pass",
                icon: "🎮",
                desc: "Xbox/PlayStation",
                cost: 15,
                effects: { 
                    desc: "+3 Happiness/week, but +1 Stress (addictive)",
                    weekly: () => { 
                        state.happiness = Math.min(100, state.happiness + 3);
                        state.stress = Math.min(100, state.stress + 1);
                    }
                }
            },
            meditation: {
                name: "Meditation App",
                icon: "🧘",
                desc: "Calm, Headspace",
                cost: 12,
                effects: { 
                    desc: "-3 Stress/week, +1 Energy/week",
                    weekly: () => { 
                        state.stress = Math.max(0, state.stress - 3);
                        state.energy = Math.min(100, state.energy + 1);
                    }
                }
            },
            learning: {
                name: "Online Learning",
                icon: "🎓",
                desc: "Coursera, Skillshare",
                cost: 25,
                effects: { 
                    desc: "+0.3 Technical/week, +0.2 Creativity/week",
                    weekly: () => { 
                        state.skills.technical = Math.min(100, state.skills.technical + 0.3);
                        state.skills.creativity = Math.min(100, state.skills.creativity + 0.2);
                    }
                }
            },
            dating: {
                name: "Dating Apps Premium",
                icon: "💕",
                desc: "Tinder Gold, etc.",
                cost: 30,
                effects: { 
                    desc: "+5% chance to meet someone",
                    condition: () => !state.married
                }
            }
        };

        // ============ FREE TIME ACTIVITIES ============
        const FREE_TIME_ACTIVITIES = {
            gym: {
                name: "Gym",
                icon: "🏋️",
                desc: "Build fitness & looks",
                costPerHour: 0, // Free if member
                requires: () => state.fitness.gymMember,
                requiresText: "Need gym membership",
                effects: {
                    physical: 0.3,      // per hour
                    attractiveness: 0.05,
                    health: 0.5,
                    energy: -2,
                    stress: -0.5        // Stress relief once routine established
                }
            },
            hobbies: {
                name: "Hobbies (Basic)",
                icon: "🎨",
                desc: "Practice at home (free)",
                costPerHour: 0, // Free - just practicing
                requires: () => state.hobbies.active.length > 0,
                requiresText: "Pick a hobby first (click Hobbies card)",
                effects: {
                    happiness: 0.8,
                    stress: -1,
                    energy: -0.5
                },
                customProcess: (hours) => {
                    let activeHobbies = state.hobbies.active;
                    if (activeHobbies.length === 0) return;
                    let hoursEach = hours / activeHobbies.length;
                    activeHobbies.forEach(hobbyKey => {
                        practiceHobby(hobbyKey, hoursEach * 0.7); // 70% skill gain
                    });
                }
            },
            hobbies_premium: {
                name: "Hobbies (Classes)",
                icon: "🎓",
                desc: "Lessons, workshops, gear",
                costPerHour: 15,
                requires: () => state.hobbies.active.length > 0,
                requiresText: "Pick a hobby first (click Hobbies card)",
                effects: {
                    happiness: 1.5,
                    stress: -2,
                    energy: -1
                },
                customProcess: (hours) => {
                    let activeHobbies = state.hobbies.active;
                    if (activeHobbies.length === 0) return;
                    let hoursEach = hours / activeHobbies.length;
                    activeHobbies.forEach(hobbyKey => {
                        practiceHobby(hobbyKey, hoursEach * 1.3); // 130% skill gain
                    });
                }
            },
            socialize: {
                name: "Hang Out",
                icon: "👥",
                desc: "Free time with friends",
                costPerHour: 0, // Free - just hanging out
                requires: () => true,
                effects: {
                    social: 0.2,
                    happiness: 0.5,
                    stress: -0.5,
                    meetingBonus: 0.01,
                    networkBonus: 0.05
                }
            },
            socialize_premium: {
                name: "Night Out",
                icon: "🍻",
                desc: "Bars, events, dining out",
                costPerHour: 20,
                requires: () => true,
                effects: {
                    social: 0.5,
                    happiness: 1.2,
                    stress: -1.5,
                    meetingBonus: 0.04, // Better chance to meet people
                    networkBonus: 0.15  // Better networking
                }
            },
            overtime: {
                name: "Work Overtime",
                icon: "💼",
                desc: "Extra hours at work",
                costPerHour: 0, // Actually earns money
                earningsPerHour: () => {
                    if (!state.employed || !state.job) return 0;
                    // Use BASE job salary, not weeklyIncome (which includes overtime!)
                    let baseSalary = 0;
                    if (state.job === 'military') {
                        baseSalary = 400; // Military doesn't really do overtime
                    } else if (state.job === 'part_time') {
                        baseSalary = 150;
                    } else if (JOBS[state.job]) {
                        baseSalary = state.baseSalary || JOBS[state.job].salary;
                    }
                    // Time and a half for overtime
                    return Math.floor(baseSalary / 40 * 1.5);
                },
                requires: () => state.employed && state.job !== 'military', // Military can't do overtime
                requiresText: "Need a job",
                effects: {
                    stress: 2,
                    energy: -3,
                    careerXP: 0.5,      // Career advancement
                    happiness: -0.5
                }
            },
            study: {
                name: "Self-Study",
                icon: "📖",
                desc: "Study alone (free)",
                costPerHour: 0, // Free - just reading/practicing
                requires: () => true,
                effects: {
                    technical: 0.2,
                    creativity: 0.05,
                    energy: -1.5,
                    stress: 0.3,
                    gpaBonus: 0.015,    // Modest GPA boost
                    examBonus: 0.3
                }
            },
            study_premium: {
                name: "Tutoring",
                icon: "👨‍🏫",
                desc: "Study with a tutor",
                costPerHour: 25,
                requires: () => true,
                effects: {
                    technical: 0.5,
                    creativity: 0.15,
                    energy: -2,
                    stress: 0.2,        // Less stressful with guidance
                    gpaBonus: 0.04,     // Much better GPA gains
                    examBonus: 1.0      // Great exam prep
                }
            },
            rest: {
                name: "Rest & Relax",
                icon: "🛋️",
                desc: "Recharge your batteries",
                costPerHour: 0, // Free - just staying home
                requires: () => true,
                effects: {
                    energy: 3,
                    stress: -2,
                    health: 0.3,
                    happiness: 0.5
                }
            },
            relationship: {
                name: "Time at Home",
                icon: "🏠",
                desc: "Quality time together (free)",
                costPerHour: 0, // Free - just being together
                requires: () => state.hasPartner,
                requiresText: "Need a partner",
                effects: {
                    happiness: 1,
                    stress: -1,
                    bondBonus: 1.5,      // Decent bond growth
                    neglectReset: true
                }
            },
            relationship_premium: {
                name: "Date Night",
                icon: "💕",
                desc: "Go out together",
                costPerHour: 30,
                requires: () => state.hasPartner,
                requiresText: "Need a partner",
                effects: {
                    happiness: 2.5,
                    stress: -2,
                    bondBonus: 3,        // Much better bonding
                    neglectReset: true,
                    attractivenessBonus: 0.05 // Dressing up, feeling good
                }
            },
            fishing: {
                name: "Fishing",
                icon: "🎣",
                desc: () => state.hobbies.active.includes('fishing') ? `Fishing skill: ${Math.floor(getHobbySkill('fishing'))}%` : "Go fishing (starts hobby)",
                costPerHour: 5, // Bait and supplies
                requires: () => true,
                effects: {
                    happiness: 1.5,
                    stress: -2,
                    energy: -0.5
                },
                customProcess: (hours) => {
                    // Auto-start fishing hobby if not active
                    if (!state.hobbies.active.includes('fishing')) {
                        if (state.hobbies.active.length < 3) {
                            state.hobbies.active.push('fishing');
                            state.hobbies.skills['fishing'] = state.hobbies.skills['fishing'] || 0;
                            state.hobbies.equipment['fishing'] = state.hobbies.equipment['fishing'] || [];
                            addLog("Started fishing as a hobby!");
                        }
                    }
                    practiceHobby('fishing', hours);
                    
                    // Chance to catch fish based on hours and skill
                    let skill = getHobbySkill('fishing');
                    let catchChance = 0.15 + (skill / 200); // 15-65% per hour
                    for (let i = 0; i < hours; i++) {
                        if (Math.random() < catchChance) {
                            // Catch something
                            let fishKeys = Object.keys(FISH_TYPES);
                            let randomFish = fishKeys[Math.floor(Math.random() * fishKeys.length)];
                            let fish = FISH_TYPES[randomFish];
                            
                            // Success based on DC vs skill
                            if (Math.random() * 20 + skill/5 >= fish.dc) {
                                let value = Math.floor(fish.value * (0.8 + Math.random() * 0.4));
                                state.money += value;
                                // Already logged by hobby practice
                            }
                        }
                    }
                }
            }
        };
        
        // Base free time, modified by situation
        const BASE_FREE_TIME = 25; // Hours per week base
        
        // Time costs that reduce free time
        const TIME_MODIFIERS = {
            transport: {
                walk: -6,      // Walking everywhere takes time
                bus: -4,       // Bus commutes
                bike: -2,      // Biking is faster
                beater: 0,     // Car is baseline
                car: 0         // Good car = baseline
            },
            job: {
                military: -8,  // Military has very limited free time
                fast_food: -2, // Long/variable shifts
                retail: -2,
                warehouse: -3, // Physical exhaustion
                default: 0
            },
            education: {
                university: -4,      // Classes + homework
                community_college: -3,
                trade_school: -2,
                military_training: -10, // Boot camp = no free time
                default: 0
            },
            housing: {
                parents: 2,    // Mom does laundry, etc.
                default: 0
            }
        };
        
        function getAvailableFreeTime() {
            let time = BASE_FREE_TIME;
            
            // Transport modifier
            time += TIME_MODIFIERS.transport[state.car] || 0;
            
            // Job modifier
            if (state.employed) {
                time += TIME_MODIFIERS.job[state.job] || TIME_MODIFIERS.job.default;
                
                // NEW JOB penalty - first 8 weeks at a job are hectic
                if (state.weeksAtJob < 8) {
                    time -= 4; // Learning the ropes takes time
                }
                
                // Looking for new job while employed takes time
                if (state.lookingForNewJob) {
                    time -= 3;
                }
            }
            
            // Education modifier
            if (state.phase === 'education' || state.phase === 'military_training') {
                let eduType = state.educationType || state.phase;
                time += TIME_MODIFIERS.education[eduType] || TIME_MODIFIERS.education.default;
                
                // MIDTERMS/FINALS - check if it's exam season (weeks 6-8 or 14-16 of semester)
                let semesterWeek = (state.phaseWeek || 0) % 18;
                if ((semesterWeek >= 6 && semesterWeek <= 8) || (semesterWeek >= 14 && semesterWeek <= 17)) {
                    time -= 6; // Midterms/finals crunch
                }
            }
            
            // Housing modifier
            time += TIME_MODIFIERS.housing[state.home] || TIME_MODIFIERS.housing.default;
            
            // KIDS take LOTS of time!
            if (state.relationship?.children > 0) {
                let childCount = state.relationship.children;
                // First child: -8 hours, each additional: -5 hours
                time -= 8 + (childCount - 1) * 5;
                
                // Babies (assume kids under age 3) take even more time
                // For simplicity, assume youngest child based on when they were born
                if (state.relationship.youngestChildAge !== undefined && state.relationship.youngestChildAge < 3) {
                    time -= 4; // Infants/toddlers are exhausting
                }
            }
            
            // Health issues reduce available time
            if (state.health < 40) {
                time -= Math.floor((40 - state.health) / 10); // -1 to -4 hours for poor health
            }
            
            // Very low energy means less productive time
            if (state.energy < 30) {
                time -= 2;
            }
            
            return Math.max(4, time); // Minimum 4 hours (you need SOME time)
        }

        // ============ JOBS DATABASE ============
        const JOBS = {
            // No education required
            fast_food: { title: "Fast Food Worker", icon: "🍔", salary: 320, req: {}, stress: 30 },
            retail: { title: "Retail Associate", icon: "🛒", salary: 340, req: {}, stress: 25 },
            warehouse: { title: "Warehouse Worker", icon: "📦", salary: 400, req: { physical: 30 }, stress: 35 },
            server: { title: "Restaurant Server", icon: "🍽️", salary: 380, req: { social: 25 }, stress: 30 },
            
            // Trait-based jobs (no education required)
            model: { title: "Model", icon: "📸", salary: 600, req: { minAttr: 8 }, stress: 20 },
            bouncer: { title: "Bouncer", icon: "🚪", salary: 450, req: { physical: 50, minHeight: 7 }, stress: 35 },
            personal_trainer: { title: "Personal Trainer", icon: "💪", salary: 500, req: { physical: 60, minAttr: 6 }, stress: 20 },
            sales_rep: { title: "Sales Representative", icon: "🤝", salary: 550, req: { social: 40, minAttr: 6 }, stress: 35 },
            
            // Trade school
            electrician_apprentice: { title: "Electrician Apprentice", icon: "⚡", salary: 500, req: { education: 'trade_school', technical: 30 }, stress: 25 },
            plumber_apprentice: { title: "Plumber Apprentice", icon: "🔧", salary: 480, req: { education: 'trade_school', technical: 30 }, stress: 25 },
            mechanic: { title: "Auto Mechanic", icon: "🔧", salary: 520, req: { education: 'trade_school', technical: 35 }, stress: 20 },
            
            // Community college
            admin_assistant: { title: "Admin Assistant", icon: "📋", salary: 450, req: { education: 'community_college' }, stress: 20 },
            dental_hygienist: { title: "Dental Hygienist", icon: "🦷", salary: 600, req: { education: 'community_college', technical: 30 }, stress: 15 },
            it_support: { title: "IT Support", icon: "💻", salary: 550, req: { education: 'community_college', technical: 40, minIntel: 5 }, stress: 25 },
            
            // University - requires intelligence
            junior_analyst: { title: "Junior Analyst", icon: "📊", salary: 700, req: { education: 'university', minIntel: 5 }, stress: 30 },
            software_dev: { title: "Software Developer", icon: "💻", salary: 900, req: { education: 'university', technical: 50, minIntel: 6 }, stress: 35 },
            accountant: { title: "Accountant", icon: "🧮", salary: 750, req: { education: 'university', technical: 40, minIntel: 6 }, stress: 25 },
            marketing: { title: "Marketing Associate", icon: "📣", salary: 650, req: { education: 'university', social: 40 }, stress: 30 },
            data_scientist: { title: "Data Scientist", icon: "📈", salary: 1100, req: { education: 'university', technical: 55, minIntel: 8 }, stress: 30 },
            
            // PRESTIGIOUS ENTRY-LEVEL (requires high GPA)
            investment_banking: { title: "Investment Banking Analyst", icon: "🏦", salary: 1400, req: { education: 'university', minIntel: 7, minGPA: 3.7 }, stress: 60, prestigious: true },
            consulting: { title: "Management Consultant", icon: "📋", salary: 1300, req: { education: 'university', minIntel: 7, social: 45, minGPA: 3.5 }, stress: 55, prestigious: true },
            big_tech: { title: "Big Tech Engineer", icon: "🚀", salary: 1500, req: { education: 'university', technical: 60, minIntel: 8, minGPA: 3.5 }, stress: 45, prestigious: true },
            corporate_law_clerk: { title: "Law Firm Clerk", icon: "⚖️", salary: 1100, req: { education: 'university', minIntel: 7, minGPA: 3.6 }, stress: 50, prestigious: true },
            research_scientist: { title: "Research Scientist", icon: "🔬", salary: 1000, req: { education: 'university', technical: 55, minIntel: 8, minGPA: 3.8 }, stress: 35, prestigious: true },
            
            // Military
            military: { title: "Military Service", icon: "🎖️", salary: 450, req: { education: 'military' }, stress: 40 },
            
            // Senior positions (promotions) - often require higher intelligence
            senior_analyst: { title: "Senior Analyst", icon: "📊", salary: 1100, req: { education: 'university', technical: 60, minIntel: 6 }, stress: 35 },
            senior_dev: { title: "Senior Developer", icon: "💻", salary: 1400, req: { education: 'university', technical: 70, minIntel: 7 }, stress: 40 },
            manager: { title: "Manager", icon: "👔", salary: 1200, req: { social: 50, minIntel: 5 }, stress: 45 },
            executive: { title: "Executive", icon: "🏢", salary: 2000, req: { social: 70, minIntel: 7, minAttr: 6 }, stress: 50 },
            master_electrician: { title: "Master Electrician", icon: "⚡", salary: 900, req: { education: 'trade_school', technical: 70 }, stress: 20 }
        };

        // ============ PARTNER GENERATION ============
        const MALE_NAMES = ["James", "Michael", "David", "Chris", "Daniel", "Matthew", "Andrew", "Ryan", "Brandon", "Justin", "Tyler", "Jake", "Kevin", "Brian", "Eric", "Nick", "Mark", "Jason", "Scott", "Adam"];
        const FEMALE_NAMES = ["Sarah", "Emily", "Jessica", "Ashley", "Amanda", "Jennifer", "Stephanie", "Lauren", "Megan", "Rachel", "Nicole", "Michelle", "Brittany", "Samantha", "Christina", "Rebecca", "Elizabeth", "Katherine", "Heather", "Amber"];
        
        // Partner icons for variety
        const FEMALE_ICONS = ['👩', '👩‍🦰', '👩‍🦱', '👩‍🦳', '👧', '💃', '👱‍♀️'];
        const MALE_ICONS = ['👨', '👨‍🦰', '👨‍🦱', '👨‍🦳', '🧔', '🕺', '👱‍♂️'];
        
        function generatePartner() {
            let appeal = calculateAppeal();
            let quality = Math.max(20, Math.min(90, appeal + (Math.random() - 0.5) * 40));
            
            // Heterosexual partners - opposite gender names
            let partnerNames = state.gender === 'male' ? FEMALE_NAMES : MALE_NAMES;
            let partnerGender = state.gender === 'male' ? 'female' : 'male';
            let partnerIcons = state.gender === 'male' ? FEMALE_ICONS : MALE_ICONS;
            
            // Calculate age - minimum 18, roughly around player's age
            let playerAge = getAge();
            let ageVariance = Math.floor(Math.random() * 8) - 3; // -3 to +4 years
            let partnerAge = Math.max(18, playerAge + ageVariance); // NEVER below 18
            
            // Generate hidden traits - these will be revealed over time
            let personality = getRandomPersonality();
            
            return {
                name: partnerNames[Math.floor(Math.random() * partnerNames.length)],
                gender: partnerGender,
                icon: partnerIcons[Math.floor(Math.random() * partnerIcons.length)],
                age: partnerAge,
                quality: quality,
                supportiveness: Math.floor(Math.random() * 40 + 30 + (100 - quality) * 0.3),
                attractiveness: Math.floor(quality * 0.7 + Math.random() * 30),
                income: Math.floor(quality * 8 + Math.random() * 200),
                job: getRandomPartnerJob(quality),
                personality: personality,
                // Trait revelation tracking - traits discovered over time
                traitsRevealed: {
                    job: false,          // Revealed after 1-2 weeks
                    income: false,       // Revealed after 4-8 weeks
                    trait: false,        // Revealed after 8-12 weeks  
                    flaw: false,         // Revealed after 12-20 weeks
                    attractiveness: true // First impression - always visible
                },
                datingStartWeek: state.totalWeeks
            };
        }
        
        // Check and reveal partner traits based on time together
        function revealPartnerTraits() {
            if (!state.hasPartner || !state.partnerStats) return;
            
            let weeksTogther = state.totalWeeks - (state.partnerStats.datingStartWeek || 0);
            let traits = state.partnerStats.traitsRevealed || {};
            let revealed = false;
            
            // Job - revealed quickly (1-2 weeks)
            if (!traits.job && weeksTogther >= 1 + Math.floor(Math.random() * 2)) {
                traits.job = true;
                revealed = true;
                addLog(`Learned that ${state.partnerName} works as a ${state.partnerStats.job}`);
            }
            
            // Income level - takes a bit longer (4-8 weeks)
            if (!traits.income && weeksTogther >= 4 + Math.floor(Math.random() * 5)) {
                traits.income = true;
                revealed = true;
                let incomeLevel = state.partnerStats.income >= 500 ? 'well off' : 
                                 state.partnerStats.income >= 200 ? 'comfortable' : 'struggling a bit';
                addLog(`Getting to know ${state.partnerName} better - they seem ${incomeLevel} financially`);
            }
            
            // Positive trait - medium time (8-12 weeks)
            if (!traits.trait && weeksTogther >= 8 + Math.floor(Math.random() * 5)) {
                traits.trait = true;
                revealed = true;
                let traitName = state.partnerStats.personality?.trait || 'Kind';
                addLog(`Discovered ${state.partnerName} is ${traitName.toLowerCase()}! 💕`);
            }
            
            // Flaw - takes longest (12-20 weeks)
            if (!traits.flaw && weeksTogther >= 12 + Math.floor(Math.random() * 9)) {
                traits.flaw = true;
                revealed = true;
                let flawName = state.partnerStats.personality?.flaw || 'Imperfect';
                addLog(`Realized ${state.partnerName} can be ${flawName.toLowerCase()}... nobody's perfect`);
            }
            
            state.partnerStats.traitsRevealed = traits;
            return revealed;
        }
        
        // Get revealed trait or hidden placeholder
        function getRevealedTrait(partner, traitKey, hiddenText = '???') {
            if (!partner.traitsRevealed) return partner[traitKey]; // Old partners show everything
            if (partner.traitsRevealed[traitKey]) return partner[traitKey];
            return hiddenText;
        }
        
        function getRandomPartnerJob(quality) {
            let jobs = quality >= 70 ? 
                ['Doctor', 'Lawyer', 'Engineer', 'Executive', 'Professor', 'Business Owner'] :
                quality >= 50 ?
                ['Teacher', 'Nurse', 'Accountant', 'Designer', 'Manager', 'Sales Rep'] :
                ['Retail Worker', 'Server', 'Student', 'Unemployed', 'Freelancer', 'Barista'];
            return jobs[Math.floor(Math.random() * jobs.length)];
        }
        
        // Partner personality traits with actual effects
        const PARTNER_TRAITS = {
            // Positive traits
            'Supportive': { happiness: 3, stress: -4, desc: "Always there for you" },
            'Funny': { happiness: 4, stress: -2, desc: "Makes you laugh daily" },
            'Caring': { health: 2, happiness: 2, stress: -2, desc: "Takes care of you" },
            'Ambitious': { technical: 0.5, money: 50, stress: 1, desc: "Pushes you to succeed" },
            'Creative': { creativity: 0.5, happiness: 2, desc: "Inspires your creativity" },
            'Adventurous': { happiness: 3, energy: -1, desc: "Keeps life exciting" },
            'Calm': { stress: -5, happiness: 1, desc: "A peaceful presence" },
            'Passionate': { happiness: 3, stress: 1, energy: -1, desc: "Intense connection" },
            'Intellectual': { technical: 0.5, creativity: 0.3, desc: "Stimulating conversations" },
            'Spontaneous': { happiness: 2, stress: 1, money: -20, desc: "Keeps you on your toes" }
        };
        
        const PARTNER_FLAWS = {
            // Negative traits
            'Jealous': { stress: 4, happiness: -2, social: -0.3, desc: "Gets upset when you socialize" },
            'Messy': { stress: 2, happiness: -1, desc: "Never cleans up" },
            'Workaholic': { money: 100, happiness: -2, stress: 2, desc: "Always working, rarely present" },
            'Stubborn': { stress: 3, happiness: -1, desc: "Never admits being wrong" },
            'Moody': { stress: 3, happiness: -3, desc: "Unpredictable emotional swings" },
            'Clingy': { stress: 3, energy: -2, social: -0.2, desc: "Needs constant attention" },
            'Distant': { happiness: -3, stress: 2, desc: "Emotionally unavailable" },
            'Spender': { money: -150, stress: 3, desc: "Burns through money fast" },
            'Critical': { happiness: -3, stress: 4, desc: "Always finding faults" },
            'Lazy': { stress: 2, money: -50, desc: "Doesn't contribute much" }
        };
        
        function getRandomPersonality() {
            let traits = Object.keys(PARTNER_TRAITS);
            let flaws = Object.keys(PARTNER_FLAWS);
            return {
                trait: traits[Math.floor(Math.random() * traits.length)],
                flaw: flaws[Math.floor(Math.random() * flaws.length)]
            };
        }
        
        function getPartnerWeeklyEffects() {
            // Returns the weekly stat effects from partner's personality
            let effects = { happiness: 0, stress: 0, health: 0, energy: 0, money: 0, technical: 0, social: 0, creativity: 0 };
            
            if (!state.hasPartner || !state.partnerStats?.personality) return effects;
            
            let personality = state.partnerStats.personality;
            let traitEffects = PARTNER_TRAITS[personality.trait] || {};
            let flawEffects = PARTNER_FLAWS[personality.flaw] || {};
            
            // Bond level modifies effects - high bond amplifies positives, low bond amplifies negatives
            let bond = state.partnerStats.supportiveness || 50;
            let bondMod = bond / 50; // 0-2 multiplier
            
            // Apply trait effects (amplified by high bond)
            Object.keys(traitEffects).forEach(stat => {
                if (stat !== 'desc') {
                    let val = traitEffects[stat];
                    effects[stat] = (effects[stat] || 0) + val * (val > 0 ? bondMod : 1);
                }
            });
            
            // Apply flaw effects (reduced by high bond, amplified by low bond)
            let flawMod = bond > 70 ? 0.5 : bond > 40 ? 1 : 1.5;
            Object.keys(flawEffects).forEach(stat => {
                if (stat !== 'desc') {
                    effects[stat] = (effects[stat] || 0) + flawEffects[stat] * flawMod;
                }
            });
            
            // Marriage bonus - commitment provides stability
            if (state.married) {
                effects.happiness += 2;
                effects.stress -= 2;
                
                // Dual income benefit (if partner has income)
                let partnerIncome = state.partnerStats.income || 0;
                effects.money += partnerIncome * 0.5; // Share of partner's income
            }
            
            return effects;
        }
        
        function processRelationshipEffects() {
            if (!state.hasPartner) return;
            
            let effects = getPartnerWeeklyEffects();
            
            // Apply stat effects
            if (effects.happiness) state.happiness = Math.max(0, Math.min(100, state.happiness + effects.happiness));
            if (effects.stress) state.stress = Math.max(0, Math.min(100, state.stress + effects.stress));
            if (effects.health) state.health = Math.max(0, Math.min(100, state.health + effects.health));
            if (effects.energy) state.energy = Math.max(0, Math.min(100, state.energy + effects.energy));
            if (effects.money) state.money += Math.floor(effects.money);
            
            // Apply skill effects
            if (effects.technical) state.skills.technical = Math.min(100, state.skills.technical + effects.technical);
            if (effects.social) state.skills.social = Math.max(0, Math.min(100, state.skills.social + effects.social));
            if (effects.creativity) state.skills.creativity = Math.min(100, state.skills.creativity + effects.creativity);
            
            // Reset loneliness when in relationship
            state.weeksWithoutPartner = 0;
            state.loneliness = Math.max(0, state.loneliness - 5);
        }
        
        function processLoneliness() {
            // Only process if adult age (18+) and single
            let age = getAge();
            if (age < 20 || state.hasPartner) {
                // Reset loneliness counters when in relationship
                if (state.hasPartner) {
                    state.weeksWithoutPartner = 0;
                    state.loneliness = Math.max(0, state.loneliness - 3);
                }
                return;
            }
            
            state.weeksWithoutPartner++;
            
            // Friends reduce loneliness impact
            let friendCount = state.friends?.length || 0;
            let friendMitigation = Math.min(0.5, friendCount * 0.1); // Up to 50% reduction
            
            // Loneliness builds up over time
            let lonelinessBuildRate = 1;
            
            // Age affects loneliness (more pressure as you get older)
            if (age >= 30) lonelinessBuildRate += 0.5;
            if (age >= 35) lonelinessBuildRate += 0.5;
            if (age >= 40) lonelinessBuildRate += 1;
            
            // Recently ended relationship is harder
            let weeksSinceBreakup = state.week - (state.lastRelationshipWeek || 0);
            if (weeksSinceBreakup < 12 && state.lastRelationshipWeek > 0) {
                lonelinessBuildRate += 1; // Post-breakup period
            }
            
            // Apply friend mitigation
            lonelinessBuildRate *= (1 - friendMitigation);
            
            // Build loneliness
            if (state.weeksWithoutPartner > 8) { // Grace period of ~2 months
                state.loneliness = Math.min(100, state.loneliness + lonelinessBuildRate);
            }
            
            // Apply loneliness effects
            if (state.loneliness >= 20) {
                state.happiness = Math.max(0, state.happiness - 1);
            }
            if (state.loneliness >= 40) {
                state.happiness = Math.max(0, state.happiness - 1);
                state.stress = Math.min(100, state.stress + 1);
            }
            if (state.loneliness >= 60) {
                state.happiness = Math.max(0, state.happiness - 2);
                state.health = Math.max(0, state.health - 0.5);
            }
            if (state.loneliness >= 80) {
                state.happiness = Math.max(0, state.happiness - 2);
                state.stress = Math.min(100, state.stress + 2);
                state.energy = Math.max(0, state.energy - 1);
            }
        }
        
        function getLonelinessDescription() {
            if (state.loneliness >= 80) return { text: "Deeply Lonely", color: "red", icon: "💔" };
            if (state.loneliness >= 60) return { text: "Very Lonely", color: "orange", icon: "😢" };
            if (state.loneliness >= 40) return { text: "Lonely", color: "yellow", icon: "😔" };
            if (state.loneliness >= 20) return { text: "A Bit Lonely", color: "gray", icon: "😐" };
            return { text: "Content", color: "green", icon: "😊" };
        }

        function calculateAppeal(forDatingApp = false) {
            let appeal = 15; // Lower base
            let age = getAge();
            
            // ============ AGE-BASED APPEAL MODIFIERS ============
            // Men peak ~35, women peak ~22
            let ageAppeal = 0;
            if (state.gender === 'male') {
                // Men: young men are undervalued, peak 32-38, slow decline after
                if (age < 22) ageAppeal = -8;      // Very young, not established
                else if (age < 25) ageAppeal = -4; // Still young
                else if (age < 28) ageAppeal = 0;  // Getting there
                else if (age < 32) ageAppeal = 3;  // Good age
                else if (age <= 38) ageAppeal = 5; // Peak attractiveness for men
                else if (age <= 45) ageAppeal = 2; // Still good
                else if (age <= 55) ageAppeal = -2;
                else ageAppeal = -6;
            } else {
                // Women: peak early 20s, gradual then rapid decline after 30
                if (age < 20) ageAppeal = 2;       // Young
                else if (age <= 24) ageAppeal = 6; // Peak attractiveness for women
                else if (age <= 27) ageAppeal = 4; // Still very good
                else if (age <= 30) ageAppeal = 2; // Good
                else if (age <= 33) ageAppeal = 0; // Average
                else if (age <= 36) ageAppeal = -3;
                else if (age <= 40) ageAppeal = -6;
                else if (age <= 45) ageAppeal = -10;
                else ageAppeal = -15;              // Rapid decline
            }
            appeal += ageAppeal;
            
            // Attractiveness is the PRIMARY factor (0-30 points)
            // currentAttractiveness is already modified by fitness in processFitnessWeek
            let currentAttr = state.currentAttractiveness || state.characterTraits?.attractiveness || 5;
            let baseAttr = state.characterTraits?.attractiveness || 5;
            appeal += currentAttr * 3;
            
            // Fitness DIRECTLY impacts appeal (separate from attractiveness modifier)
            // More impactful for women unfortunately (society's standards)
            let fitness = state.fitness?.fitnessLevel || 50;
            let fitnessAppeal = 0;
            if (fitness >= 80) {
                fitnessAppeal = state.gender === 'female' ? 8 : 5;
            } else if (fitness >= 60) {
                fitnessAppeal = state.gender === 'female' ? 4 : 2;
            } else if (fitness >= 40) {
                fitnessAppeal = 0; // Average, no bonus/penalty
            } else if (fitness >= 20) {
                fitnessAppeal = state.gender === 'female' ? -6 : -2;
            } else {
                fitnessAppeal = state.gender === 'female' ? -10 : -4; // Very unfit
            }
            appeal += fitnessAppeal;
            
            // Health and stress matter but less
            appeal += state.health / 15;  // 0-6.6 points
            appeal += (100 - state.stress) / 20;  // 0-5 points
            
            // Employment helps
            if (state.employed) appeal += 6;
            if (state.education === 'university') appeal += 2;
            
            // Money helps but with SEVERE diminishing returns (logarithmic)
            if (state.money > 100) {
                let moneyBonus = Math.min(10, Math.log10(state.money) * 2.5 - 4.5);
                appeal += Math.max(0, moneyBonus);
            }
            
            // Housing and Transport matter more for males (provider status)
            let housingAppeal = HOUSING[state.home]?.appeal || 0;
            let transportAppeal = TRANSPORT[state.car]?.appeal || 0;
            
            if (state.gender === 'male') {
                appeal += Math.min(5, housingAppeal * 0.6);
                appeal += Math.min(4, transportAppeal * 0.5);
            } else {
                appeal += Math.min(2, housingAppeal * 0.2);
                appeal += Math.min(1, transportAppeal * 0.1);
            }
            
            // ============ DATING APP SPECIFIC PENALTIES FOR MEN ============
            // Men need to be exceptional on apps - height + wealth + looks
            if (forDatingApp && state.gender === 'male') {
            let height = state.characterTraits?.height || 5;
                let isRich = state.money >= 50000 || (state.employed && JOBS[state.job]?.pay >= 1500);
                let isAttractive = currentAttr >= 8;
                let isTall = height >= 7;
                
                // Count advantages
                let advantages = 0;
                if (isRich) advantages++;
                if (isAttractive) advantages++;
                if (isTall) advantages++;
                
                // Harsh reality of dating apps for men
                if (advantages === 0) {
                    appeal *= 0.4; // 60% penalty - very hard to get matches
                } else if (advantages === 1) {
                    appeal *= 0.65; // 35% penalty - still tough
                } else if (advantages === 2) {
                    appeal *= 0.85; // 15% penalty - decent
                }
                // 3 advantages = no penalty, the algorithm favors you
            }
            
            // Physical trait matters slightly (height for men, build for women)
            if (state.gender === 'female') {
                // Build for women - middle ranges are broadly appealing
                let build = state.characterTraits?.build || 5;
                if (build >= 5 && build <= 7) appeal += 2; // Fit/athletic is a bonus
                if (build <= 2) appeal -= 2; // Very petite - some find it less appealing
                if (build >= 9) appeal -= 2; // Full-figured - dating apps show less matches statistically
            } else {
                // Height for men - tall is bonus, short is penalty
            let height = state.characterTraits?.height || 5;
                if (height >= 7) appeal += 2;
                if (height <= 3) appeal -= 4;
            }
            
            // Being unattractive is VERY hard to overcome - use BASE attractiveness for cap
            if (baseAttr <= 3) {
                appeal = Math.min(appeal, 32 + baseAttr * 8);
            } else if (baseAttr <= 5) {
                appeal = Math.min(appeal, 56 + baseAttr * 4);
            }
            
            return Math.min(100, Math.max(5, appeal));
        }
        
        // Calculate credit card APR based on credit score (better score = lower rate)
        function getCreditCardAPR(creditScore) {
            if (creditScore >= 800) return 0.129;  // 12.9% - Excellent
            if (creditScore >= 750) return 0.159;  // 15.9% - Very Good
            if (creditScore >= 700) return 0.189;  // 18.9% - Good
            if (creditScore >= 650) return 0.229;  // 22.9% - Fair
            if (creditScore >= 600) return 0.259;  // 25.9% - Poor
            return 0.299;                           // 29.9% - Bad
        }
        
        // Calculate credit card limit based on credit score and income
        function getCreditCardLimit(creditScore, weeklyIncome) {
            let annualIncome = weeklyIncome * 52;
            let baseLimit;
            
            if (creditScore >= 800) {
                baseLimit = Math.min(25000, annualIncome * 0.5);
            } else if (creditScore >= 750) {
                baseLimit = Math.min(15000, annualIncome * 0.4);
            } else if (creditScore >= 700) {
                baseLimit = Math.min(10000, annualIncome * 0.3);
            } else if (creditScore >= 650) {
                baseLimit = Math.min(5000, annualIncome * 0.25);
            } else if (creditScore >= 600) {
                baseLimit = Math.min(2000, annualIncome * 0.15);
            } else {
                baseLimit = Math.min(500, annualIncome * 0.1);
            }
            
            // Minimum limit of $300
            return Math.max(300, Math.floor(baseLimit / 100) * 100);
        }
        
        // Process weekly fitness effects
        function processFitnessWeek() {
            let gymHours = state.freeTime.gym || 0;
            let fitnessGain = 0;
            let fitnessLoss = 0;
            let age = getAge();
            
            // ============ AGE MODIFIERS ============
            // Young people gain fitness easily and lose it slowly
            // Older people struggle to gain and lose it quickly
            
            let gainMultiplier = 1.0;
            let lossMultiplier = 1.0;
            
            if (age <= 22) {
                // Prime youth - easy to stay fit
                gainMultiplier = 1.5;  // 50% easier to gain
                lossMultiplier = 0.5;  // 50% slower to lose
            } else if (age <= 25) {
                // Still young
                gainMultiplier = 1.3;
                lossMultiplier = 0.7;
            } else if (age <= 30) {
                // Young adult - normal
                gainMultiplier = 1.1;
                lossMultiplier = 0.9;
            } else if (age <= 35) {
                // Starting to slow down
                gainMultiplier = 0.9;
                lossMultiplier = 1.1;
            } else if (age <= 40) {
                // Metabolism slowing
                gainMultiplier = 0.75;
                lossMultiplier = 1.3;
            } else if (age <= 50) {
                // Middle age - takes real work
                gainMultiplier = 0.6;
                lossMultiplier = 1.5;
            } else if (age <= 60) {
                // Getting harder
                gainMultiplier = 0.45;
                lossMultiplier = 1.7;
            } else {
                // Senior - very hard to gain, easy to lose
                gainMultiplier = 0.3;
                lossMultiplier = 2.0;
            }
            
            // ============ FITNESS GAINS ============
            
            // Gym workout gains (must have membership)
            if (state.fitness.gymMember && gymHours > 0) {
                state.fitness.workoutStreak++;
                state.skills.physical = Math.min(100, state.skills.physical + 0.5 * gainMultiplier);
                
                // Fitness gain from gym (2-5 points/week depending on hours)
                // Modified by age
                fitnessGain += Math.min(5, gymHours * 0.5) * gainMultiplier;
                
                // First 8 weeks are hard, then it gets easier
                // Takes longer to establish routine when older
                let routineWeeks = age >= 40 ? 12 : age >= 30 ? 10 : 8;
                if (state.fitness.workoutStreak < routineWeeks) {
                    state.stress += age >= 40 ? 3 : 2;
                } else {
                    state.fitness.routineEstablished = true;
                    state.stress = Math.max(0, state.stress - 1);
                }
            } else {
                // Break workout streak if not going to gym
                if (state.fitness.workoutStreak > 0) {
                    // Older people lose their routine faster
                    let streakLoss = age >= 40 ? 3 : 2;
                    state.fitness.workoutStreak = Math.max(0, state.fitness.workoutStreak - streakLoss);
                }
                if (!state.fitness.routineEstablished) {
                    state.fitness.workoutStreak = 0; // Reset completely if routine not established
                }
            }
            
            // Healthy eating helps fitness (more important as you age)
            if (state.fitness.healthyEating) {
                let dietBonus = age >= 40 ? 1.5 : 1; // Diet matters more when older
                fitnessGain += dietBonus * gainMultiplier;
                state.health = Math.min(100, state.health + 1);
            }
            
            // Youth bonus: Natural baseline fitness (under 25, even without trying)
            if (age < 25 && !state.fitness.gymMember) {
                // Young bodies maintain a baseline without much effort
                if (state.fitness.fitnessLevel < 45) {
                    fitnessGain += 0.5; // Drift toward average
                }
            }
            
            // ============ FITNESS LOSSES ============
            
            // Natural fitness decay (use it or lose it)
            if (!state.fitness.gymMember || gymHours === 0) {
                fitnessLoss += 1.5 * lossMultiplier;
            }
            
            // Unhealthy lifestyle accelerates fitness loss (worse when older)
            if (!state.fitness.healthyEating) {
                fitnessLoss += 0.5 * lossMultiplier;
            }
            
            // Additional age-related fitness decline (compounding)
            if (age >= 35) {
                fitnessLoss += (age - 35) * 0.03; // +0.03/week per year over 35
            }
            
            // Apply fitness changes
            let netChange = fitnessGain - fitnessLoss;
            state.fitness.fitnessLevel = Math.max(0, Math.min(100, state.fitness.fitnessLevel + netChange));
            
            // Track peak fitness
            if (state.fitness.fitnessLevel > state.fitness.peakFitness) {
                state.fitness.peakFitness = state.fitness.fitnessLevel;
            }
            
            // ============ FITNESS CONSEQUENCES ============
            
            let fitness = state.fitness.fitnessLevel;
            
            // Attractiveness modifier based on fitness
            // More impactful for women (society's double standard, unfortunately realistic)
                let baseAttr = state.characterTraits?.attractiveness || 5;
            let fitnessAttrBonus = 0;
            
            if (fitness >= 80) {
                fitnessAttrBonus = state.gender === 'female' ? 2.5 : 1.5; // Very fit
            } else if (fitness >= 60) {
                fitnessAttrBonus = state.gender === 'female' ? 1.5 : 1; // Fit
            } else if (fitness >= 40) {
                fitnessAttrBonus = 0; // Average
            } else if (fitness >= 20) {
                fitnessAttrBonus = state.gender === 'female' ? -1.5 : -0.5; // Out of shape
            } else {
                fitnessAttrBonus = state.gender === 'female' ? -2.5 : -1; // Very unfit
            }
            
            state.currentAttractiveness = Math.max(1, Math.min(10, baseAttr + fitnessAttrBonus));
            
            // Health effects from fitness
            if (fitness < 30) {
                // Very unfit - health problems
                state.health = Math.max(0, state.health - 1);
                state.energy = Math.max(0, state.energy - 3); // Low energy
                
                // Chance of illness
                if (Math.random() < 0.05) { // 5% weekly chance of getting sick
                    state.health -= 10;
                    state.energy -= 15;
                    addLog("Feeling unwell - low fitness catching up");
                }
            } else if (fitness >= 70) {
                // Very fit - health bonuses
                state.health = Math.min(100, state.health + 0.5);
                state.energy = Math.min(100, state.energy + 2); // More energy
            }
            
            // Energy modifier from fitness (applied weekly)
            if (fitness < 40) {
                state.energy = Math.max(0, state.energy - 2); // Low fitness = tire easily
            } else if (fitness >= 60) {
                state.energy = Math.min(100, state.energy + 1); // Good fitness = more stamina
            }
        }
        
        // Get fitness level description
        function getFitnessDescription(level) {
            if (level >= 90) return "Elite Athlete";
            if (level >= 75) return "Very Fit";
            if (level >= 60) return "Fit";
            if (level >= 45) return "Average";
            if (level >= 30) return "Out of Shape";
            if (level >= 15) return "Unfit";
            return "Very Unfit";
        }
        
        // Attractiveness bonus events for highly attractive people
        function getAttractivenessBonusEvent() {
            let attractiveness = state.currentAttractiveness || 5;
            let events = [];
            
            // Different opportunities based on context
            if (getAge() < 30) {
                events.push({
                    category: "✨ Opportunity",
                    title: "Noticed",
                    desc: "Someone approaches you at a coffee shop. Turns out they're a talent scout for a modeling agency.",
                    choices: [
                        {
                            text: "Hear them out",
                            effect: () => {
                                let bonus = attractiveness >= 9 ? 800 : 400;
                                state.money += bonus;
                                state.skills.social += 3;
                                state.happiness += 10;
                                return { icon: "📸", text: "A few photoshoots later, you've got some extra cash and confidence.", stats: `+$${bonus}, +3 Social, +10 Happy` };
                            }
                        },
                        {
                            text: "Not interested",
                            effect: () => {
                                return { icon: "🙅", text: "Flattering, but not your thing.", stats: "" };
                            }
                        }
                    ]
                });
            }
            
            events.push({
                category: "✨ Opportunity",
                title: "Networking Advantage",
                desc: "At a professional event, people seem eager to talk to you. Your appearance opens doors.",
                choices: [
                    {
                        text: "Work the room",
                        effect: () => {
                            state.career.networkContacts += attractiveness >= 9 ? 8 : 5;
                            state.skills.social += 2;
                            return { icon: "🤝", text: "Business cards exchanged, LinkedIn requests sent. Connections made.", stats: `+${attractiveness >= 9 ? 8 : 5} Network` };
                        }
                    },
                    {
                        text: "Keep a low profile",
                        effect: () => {
                            state.career.networkContacts += 1;
                            return { icon: "👀", text: "You observe from the sidelines.", stats: "+1 Network" };
                        }
                    }
                ]
            });
            
            events.push({
                category: "✨ Opportunity", 
                title: "Better Service",
                desc: "You notice you tend to get better treatment at restaurants, stores, everywhere really.",
                choices: [
                    {
                        text: "Use it to your advantage",
                        effect: () => {
                            state.money += 100; // Freebies, discounts
                            state.happiness += 5;
                            return { icon: "🎁", text: "Free upgrades, comped drinks, preferential treatment. Life's a bit easier.", stats: "+$100 in perks, +5 Happy" };
                        }
                    },
                    {
                        text: "Feel conflicted about it",
                        effect: () => {
                            state.happiness -= 3;
                            return { icon: "🤔", text: "Is this really fair? The privilege weighs on you.", stats: "-3 Happy (introspection)" };
                        }
                    }
                ]
            });
            
            return events[Math.floor(Math.random() * events.length)];
        }
        
        // Family help event for wealthy families
        function getFamilyHelpEvent() {
            let wealth = state.characterTraits?.familyWealth || 5;
            if (wealth < 7 || state.money > 500) return null;
            
            // Can only ask once per year
            if (state.lastFamilyHelpWeek && (state.totalWeeks - state.lastFamilyHelpWeek) < 52) return null;
            
            let helpAmount = wealth >= 9 ? 5000 : wealth >= 8 ? 2500 : 1500;
            
            return {
                category: "👨‍👩‍👧 Family",
                title: "Reaching Out to Family",
                desc: `Things are tight. Your ${wealth >= 9 ? 'wealthy' : 'well-off'} family could probably help...`,
                choices: [
                    {
                        text: `Ask for help (they'd give ~$${helpAmount.toLocaleString()})`,
                        effect: () => {
                            state.money += helpAmount;
                            state.lastFamilyHelpWeek = state.totalWeeks;
                            state.happiness += 5;
                            state.stress -= 15;
                            return { icon: "💝", text: "Family came through. No strings attached... mostly.", stats: `+$${helpAmount.toLocaleString()}` };
                        }
                    },
                    {
                        text: "Figure it out yourself",
                        effect: () => {
                            state.happiness += 3;
                            return { icon: "💪", text: "Independence has its own value.", stats: "+3 Happiness (pride)" };
                        }
                    }
                ]
            };
        }

        // ============ HELPER FUNCTIONS ============
        
        // Intelligence modifier for learning/academic tasks
        function getIntelligenceModifier() {
            let intel = state.characterTraits?.intelligence || 5;
            // Returns multiplier: 0.7 (intel 1) to 1.5 (intel 10)
            return 0.6 + (intel * 0.1);
        }
        
        // Intelligence bonus for DC rolls (reduces difficulty for smart characters)
        function getIntelligenceDCBonus() {
            let intel = state.characterTraits?.intelligence || 5;
            // Returns -3 to +5 based on intelligence
            return Math.floor((intel - 5) * 1);
        }
        
        // Apply intelligence to skill gains
        function gainSkill(skillName, baseAmount) {
            let modifier = getIntelligenceModifier();
            let actualGain = baseAmount * modifier;
            state.skills[skillName] = Math.min(100, state.skills[skillName] + actualGain);
            return actualGain;
        }
        
        // Apply intelligence to GPA gains
        function gainGPA(baseAmount) {
            let modifier = getIntelligenceModifier();
            let actualGain = baseAmount * modifier;
            state.gpa = Math.min(4.0, state.gpa + actualGain);
            return actualGain;
        }
        
        function getAge() {
            return Math.floor(18 + state.totalWeeks / 52);
        }

        function getMonth() {
            return Math.floor((state.totalWeeks % 52) / 4) + 1;
        }

        function meetsRequirements(jobKey) {
            let job = JOBS[jobKey];
            if (!job.req) return true;
            
            // Education requirements
            if (job.req.education) {
                if (job.req.education === 'university' && state.education !== 'university') return false;
                if (job.req.education === 'community_college' && !['community_college', 'university'].includes(state.education)) return false;
                if (job.req.education === 'trade_school' && state.education !== 'trade_school') return false;
                if (job.req.education === 'military' && state.education !== 'military') return false;
            }
            
            // GPA requirements (for prestigious positions)
            if (job.req.minGPA && (state.gpa || 0) < job.req.minGPA) return false;
            
            // Trait requirements
            let traits = state.characterTraits || {};
            if (job.req.minIntel && (traits.intelligence || 5) < job.req.minIntel) return false;
            if (job.req.minAttr && (state.currentAttractiveness || traits.attractiveness || 5) < job.req.minAttr) return false;
            // Height requirement only applies to males; females use build differently
            if (job.req.minHeight && state.gender !== 'female' && (traits.height || 5) < job.req.minHeight) return false;
            // For females, translate height-based jobs to build (athletic/fit build can substitute for height)
            if (job.req.minHeight && state.gender === 'female' && (traits.build || 5) < 6) return false; // Need at least "fit" build
            
            // Skill requirements
            for (let skill in job.req) {
                if (!['education', 'minIntel', 'minAttr', 'minHeight', 'minGPA'].includes(skill)) {
                    if (state.skills[skill] < job.req[skill]) return false;
                }
            }
            return true;
        }
        
        // Get GPA bonus/penalty for job hunting
        function getGPAHiringModifier() {
            if (state.education !== 'university' && state.education !== 'community_college') return 0;
            
            let gpa = state.gpa || 2.5;
            
            // GPA bonuses/penalties for interview rolls
            if (gpa >= 3.9) return 6;      // Summa Cum Laude - huge advantage
            if (gpa >= 3.7) return 4;      // Magna Cum Laude
            if (gpa >= 3.5) return 3;      // Cum Laude
            if (gpa >= 3.2) return 1;      // Above average
            if (gpa >= 2.8) return 0;      // Average - no bonus
            if (gpa >= 2.5) return -1;     // Below average
            if (gpa >= 2.0) return -3;     // Poor grades
            return -5;                      // Barely graduated
        }
        
        // Get GPA salary modifier (percentage bonus/penalty)
        function getGPASalaryModifier() {
            if (state.education !== 'university' && state.education !== 'community_college') return 1.0;
            
            let gpa = state.gpa || 2.5;
            
            if (gpa >= 3.9) return 1.15;   // +15% starting salary
            if (gpa >= 3.7) return 1.10;   // +10%
            if (gpa >= 3.5) return 1.05;   // +5%
            if (gpa >= 3.0) return 1.0;    // Standard
            if (gpa >= 2.5) return 0.95;   // -5%
            return 0.90;                    // -10% for poor grades
        }

        function getAvailableJobs() {
            return Object.keys(JOBS)
                .filter(j => meetsRequirements(j))
                .sort((a, b) => JOBS[b].salary - JOBS[a].salary); // Sort by salary, highest first
        }

        function calculateWeeklyFinances() {
            let income = 0;
            let expenses = 0;
            
            if (state.employed && state.job) {
                // Military uses rank-based pay
                if (state.job === 'military') {
                    income = getMilitaryRank().pay;
                    // Combat/deployment bonus
                    if (state.military.deployed) {
                        income += 150;
                    }
                } else if (state.job === 'part_time') {
                    // Part-time student job
                    income = state.weeklyIncome || 150;
                } else if (JOBS[state.job]) {
                    income = JOBS[state.job].salary;
                }
            }
            
            expenses += HOUSING[state.home].rent;
            expenses += TRANSPORT[state.car].cost;
            expenses += 50; // Base living expenses
            
            if (state.debt > 0) {
                expenses += Math.ceil(state.debt / 200); // Loan payments
            }
            
            // Free time activity costs
            let freeTimeCost = 0;
            let overtimeEarnings = 0;
            Object.keys(state.freeTime).forEach(key => {
                let hours = state.freeTime[key] || 0;
                if (hours === 0) return;
                let activity = FREE_TIME_ACTIVITIES[key];
                let costPerHour = typeof activity.costPerHour === 'function' ? activity.costPerHour() : activity.costPerHour;
                freeTimeCost += hours * costPerHour;
                if (activity.earningsPerHour && state.employed) {
                    overtimeEarnings += hours * activity.earningsPerHour();
                }
            });
            
            expenses += freeTimeCost;
            income += overtimeEarnings;
            state.freeTimeExpenses = freeTimeCost;
            state.overtimeEarnings = overtimeEarnings;
            
            // Subscription costs
            let subCost = 0;
            Object.keys(state.subscriptions).forEach(key => {
                if (state.subscriptions[key] && SUBSCRIPTIONS[key]) {
                    subCost += SUBSCRIPTIONS[key].cost;
                }
            });
            expenses += subCost;
            state.subscriptionCost = subCost;
            
            // Habit costs (smoking, drinking, junk food, gambling, etc.)
            let habitCost = 0;
            Object.keys(state.habits || {}).forEach(key => {
                if (state.habits[key]?.active && HABITS[key]?.moneyCost) {
                    habitCost += HABITS[key].moneyCost;
                }
            });
            expenses += habitCost;
            state.habitMoneyCost = habitCost;
            
            state.weeklyIncome = income;
            state.weeklyExpenses = expenses;
            
            return income - expenses;
        }

        function addLog(text) {
            let age = getAge();
            let entry = document.createElement('div');
            entry.className = 'border-l-2 border-gray-700 pl-2';
            entry.innerText = `Age ${age}: ${text}`;
            document.getElementById('eventLog').prepend(entry);
        }

        // ============ EVENT SYSTEM ============
        function getPhaseEvents() {
            // Priority: Check for pending bad habit event first
            if (pendingBadHabitEvent) {
                let badHabitEvent = showBadHabitEvent();
                if (badHabitEvent) return [badHabitEvent];
            }
            
            switch(state.phase) {
                case 'character_creation': return getCharacterCreationEvents();
                case 'deciding': return getDecidingEvents();
                case 'education': return getEducationEvents();
                case 'job_hunting': return getJobHuntingEvents();
                case 'employed': return getEmployedEvents();
                default: return getRandomLifeEvents();
            }
        }

        // Helper to roll a trait (weighted toward middle values)
        function rollTrait() {
            // Roll 2d6-1 for range 1-11, clamped to 1-10 (bell curve favoring 5-6)
            let roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 1;
            return Math.max(1, Math.min(10, roll - 1));
        }
        
        function rollAllTraits() {
            return {
                height: rollTrait(),
                build: rollTrait(),
                familyWealth: rollTrait(),
                intelligence: rollTrait(),
                attractiveness: rollTrait(),
                selfControl: rollTrait()
            };
        }
        
        let rerollsRemaining = 3;
        let pendingTraits = null;
        
        function getCharacterCreationEvents() {
            // Step 1: Gender selection
            if (!state.gender) {
            return [{
                    category: "👤 Character Creation",
                    title: "Who Are You?",
                    desc: "Before your story begins, let's establish who you are.",
                choices: [
                    {
                            text: "I'm a young man",
                            effect: () => {
                                state.gender = 'male';
                                pendingTraits = rollAllTraits();
                                return { icon: "👨", text: "Your story begins...", stats: "" };
                            }
                        },
                        {
                            text: "I'm a young woman",
                            effect: () => {
                                state.gender = 'female';
                                pendingTraits = rollAllTraits();
                                return { icon: "👩", text: "Your story begins...", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // Step 2: Show traits and allow reroll
            if (!pendingTraits) {
                pendingTraits = rollAllTraits();
            }
            
            // Show height for males, build for females
            let physicalTraitLabel = state.gender === 'female' ? 'Build' : 'Height';
            let physicalTraitValue = state.gender === 'female' ? pendingTraits.build : pendingTraits.height;
            let physicalTraitDesc = state.gender === 'female' 
                ? TRAIT_DESCRIPTORS.build[pendingTraits.build]
                : TRAIT_DESCRIPTORS.height[pendingTraits.height];
            
            let traitDesc = `
${physicalTraitLabel}: ${physicalTraitValue}/10 - ${physicalTraitDesc}
Family Wealth: ${pendingTraits.familyWealth}/10 - ${TRAIT_DESCRIPTORS.familyWealth[pendingTraits.familyWealth]}
Intelligence: ${pendingTraits.intelligence}/10 - ${TRAIT_DESCRIPTORS.intelligence[pendingTraits.intelligence]}
Attractiveness: ${pendingTraits.attractiveness}/10 - ${TRAIT_DESCRIPTORS.attractiveness[pendingTraits.attractiveness]}
Self-Control: ${pendingTraits.selfControl}/10 - ${TRAIT_DESCRIPTORS.selfControl[pendingTraits.selfControl]}
            `.trim();
            
            let choices = [
                {
                    text: "Accept these traits and begin my story",
                    effect: () => {
                        // Apply traits
                        state.characterTraits = { ...pendingTraits };
                        state.currentAttractiveness = pendingTraits.attractiveness;
                        
                        // Initialize willpower based on self-control
                        state.maxWillpower = 30 + (pendingTraits.selfControl * 5);
                        state.willpower = state.maxWillpower;
                        
                        // Apply family wealth effects
                        let wealth = pendingTraits.familyWealth;
                        state.money = 500 + (wealth * 200); // $700 to $2,500
                        
                        // Very poor families start with some debt
                        if (wealth <= 2) {
                            state.debt = (3 - wealth) * 500; // $500-$1000 debt
                        }
                        
                        // Intelligence affects starting skills slightly
                        let intBonus = Math.floor((pendingTraits.intelligence - 5) * 2);
                        state.skills.technical = Math.max(5, state.skills.technical + intBonus);
                        
                        // High attractiveness gives slight social boost
                        if (pendingTraits.attractiveness >= 7) {
                            state.skills.social += (pendingTraits.attractiveness - 6) * 3;
                        }
                        
                        // Move to deciding phase
                        state.phase = 'deciding';
                        pendingTraits = null;
                        rerollsRemaining = 3;
                        
                        // Trigger tutorial after a short delay
                        setTimeout(() => checkTutorial(), 500);
                        
                        let wealthMsg = wealth >= 7 ? "Your family's wealth opens doors." : 
                                       wealth <= 3 ? "Money's always been tight." : "A typical upbringing.";
                        
                        return { icon: "🎭", text: `Your character is set. ${wealthMsg}`, stats: `Starting with $${state.money}` };
                    }
                }
            ];
            
            if (rerollsRemaining > 0) {
                choices.push({
                    text: `Reroll traits (${rerollsRemaining} remaining)`,
                    effect: () => {
                        rerollsRemaining--;
                        pendingTraits = rollAllTraits();
                        return { icon: "🎲", text: "The dice are cast again...", stats: `${rerollsRemaining} rerolls left` };
                    }
                });
            }
            
            return [{
                category: "🎲 Your Traits",
                title: "The Hand You're Dealt",
                desc: `Life isn't fair. Some are born with advantages, others with challenges. Here's what fate has given you:\n\n${traitDesc}`,
                choices: choices
            }];
        }

        function getDecidingEvents() {
            let intel = state.characterTraits?.intelligence || 5;
            let wealth = state.characterTraits?.familyWealth || 5;
            let physical = state.skills?.physical || 40;
            let height = state.characterTraits?.height || 5;
            
            let choices = [];
            
            // UNIVERSITY OPTIONS - requires intelligence 4+ 
            if (intel >= 4) {
                // Academic Scholarship for high intelligence
                if (intel >= 8) {
                    choices.push({
                        text: "🌟 University with Academic Scholarship (Intelligence 8+)",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'university';
                            state.phaseTarget = EDUCATION_DURATION.university;
                            state.phaseWeek = 0;
                            state.debt = 5000; // Much less debt!
                            state.home = 'room';
                            state.money -= 500;
                            state.gpa = 3.5; // Start with better GPA
                            addLog("Received academic scholarship");
                            return { icon: "🎓", text: "Your grades earned you a scholarship! University with minimal debt.", stats: "Scholarship! Only +$5,000 debt, +0.5 GPA" };
                        }
                    });
                }
                
                // Family pays for wealthy families
                if (wealth >= 8) {
                    choices.push({
                        text: "🏛️ University (Family Pays) - Wealth 8+",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'university';
                            state.phaseTarget = EDUCATION_DURATION.university;
                            state.phaseWeek = 0;
                            state.debt = 0; // No debt!
                            state.home = 'room';
                            state.money += 500; // Spending money from parents
                            addLog("Family paying for university");
                            return { icon: "🎓", text: "Your family is covering tuition. Focus on learning, not loans.", stats: "Family pays! No debt, +$500 spending money" };
                        }
                    });
                }
                
                // Standard university option
                choices.push({
                    text: "University — 4 years, ~$60,000 debt",
                    effect: () => {
                        state.phase = 'education';
                        state.educationType = 'university';
                        state.phaseTarget = EDUCATION_DURATION.university;
                        state.phaseWeek = 0;
                        state.debt = 15000;
                        state.home = 'room';
                        state.money -= 500;
                            return { icon: "🎓", text: "You pack your bags for university. Four years of learning await.", stats: "Started university, +$15,000 debt" };
                        }
                });
            }
            
            // COMMUNITY COLLEGE - always available
            choices.push({
                        text: "Community College — 2 years, ~$8,000",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'community_college';
                            state.phaseTarget = EDUCATION_DURATION.community_college;
                            state.phaseWeek = 0;
                    state.debt = wealth >= 7 ? 0 : 4000; // Wealthy families cover it
                    let debtMsg = wealth >= 7 ? "Family covered it!" : "+$4,000 debt";
                    return { icon: "📚", text: "Smart choice. Same foundation, less debt. You stay local and commute.", stats: `Started community college, ${debtMsg}` };
                }
            });
            
            // TRADE SCHOOL - always available, bonus for good physical stats
            choices.push({
                        text: "Trade School — 1.5 years, ~$15,000",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'trade_school';
                            state.phaseTarget = EDUCATION_DURATION.trade_school;
                            state.phaseWeek = 0;
                    state.debt = wealth >= 7 ? 3000 : 8000;
                    let techBonus = physical >= 50 ? 15 : 10; // Better physical = better start
                    state.skills.technical += techBonus;
                    return { icon: "🔧", text: "You enroll in trade school. Learn a real skill, earn real money.", stats: `Started trade school, +${techBonus} Technical` };
                }
            });
            
            // MILITARY OPTIONS
            // Standard enlistment - needs minimum physical
            // Height req for males, build doesn't matter much for females in military
            let meetsPhysicalReq = state.gender === 'female' ? true : height >= 3;
            if (physical >= 30 && meetsPhysicalReq) {
                choices.push({
                        text: "Enlist in the Military",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'military_training';
                            state.phaseTarget = EDUCATION_DURATION.military_training;
                            state.phaseWeek = 0;
                        state.money += 2000;
                        state.home = 'room';
                            state.skills.physical += 15;
                            state.traits.push('Enlisted');
                            return { icon: "🎖️", text: "You sign the papers. Boot camp starts next week. Your country thanks you.", stats: "+$2,000 bonus, +15 Physical" };
                        }
                });
                
                // Special forces track for exceptional physical specimens
                // For females, athletic build (7+) substitutes for height requirement
                let meetsSpecOpsPhysical = state.gender === 'female' 
                    ? (state.characterTraits?.build || 5) >= 7 
                    : height >= 6;
                if (physical >= 60 && meetsSpecOpsPhysical && intel >= 5) {
                    choices.push({
                        text: "⭐ Military - Special Forces Track (Elite Physical)",
                        effect: () => {
                            state.phase = 'education';
                            state.educationType = 'military_training';
                            state.phaseTarget = EDUCATION_DURATION.military_training;
                            state.phaseWeek = 0;
                            state.money += 5000; // Better bonus
                            state.home = 'room';
                            state.skills.physical += 20;
                            state.military.combatXP = 10; // Start with some XP
                            state.traits.push('Enlisted');
                            state.traits.push('SF Candidate');
                            addLog("Enlisted on Special Forces track");
                            return { icon: "🦅", text: "Your physical abilities caught a recruiter's eye. Special Forces pipeline awaits.", stats: "+$5,000 bonus, +20 Physical, SF Track" };
                        }
                    });
                }
            }
            
            // WORK - always available
            choices.push({
                        text: "Start Working Now",
                        effect: () => {
                            state.phase = 'job_hunting';
                            state.education = 'high_school';
                            state.phaseWeek = 0;
                            return { icon: "💼", text: "No time or money for more school. You need a job.", stats: "Now job hunting" };
                        }
            });
            
            // Build description based on traits
            let desc = "High school graduation is around the corner. Everyone keeps asking about your plans.";
            if (intel <= 3) {
                desc += " Your grades weren't great - university isn't really an option.";
            } else if (intel >= 8) {
                desc += " Your excellent grades have opened some doors.";
            }
            if (wealth >= 8) {
                desc += " Your family has offered to help financially.";
            } else if (wealth <= 3) {
                desc += " Money is tight - you'll need to be practical.";
            }
            
            return [{
                category: "Crossroads",
                title: "What's Next?",
                desc: desc,
                choices: choices
            }];
        }

        function getEducationEvents() {
            let events = [];
            let progress = state.phaseWeek / state.phaseTarget;
            let type = state.educationType;
            
            // Check for graduation
            if (state.phaseWeek >= state.phaseTarget) {
                return [getGraduationEvent()];
            }
            
            // Tuition due events (every semester for college)
            // Use a unique ID based on phase week to prevent duplicate tuition events
            let tuitionDueWeek = Math.floor(state.phaseWeek / 20) * 20;
            let tuitionEventId = `tuition_due_week_${tuitionDueWeek}`;
            
            if ((type === 'university' || type === 'community_college') && 
                state.phaseWeek % 20 === 0 && state.phaseWeek > 0 &&
                !isEventOnCooldown(tuitionEventId, 15)) {
                let cost = type === 'university' ? 3000 : 1500;
                let wealth = state.characterTraits?.familyWealth || 5;
                let tuitionChoices = [
                    {
                        text: `Pay from savings ($${cost.toLocaleString()})`,
                        condition: () => state.money >= cost,
                            effect: () => {
                                state.money -= cost;
                                state.happiness += 5;
                                return { icon: "✅", text: "Paid in full. No new debt.", stats: `-$${cost.toLocaleString()}` };
                            }
                        },
                        {
                            text: "Take out more student loans",
                            effect: () => {
                                let loan = type === 'university' ? 4000 : 2000;
                                state.studentLoans += loan;
                                return { icon: "📝", text: `Signed for another student loan. Debt is growing.`, stats: `+$${loan.toLocaleString()} student loans` };
                            }
                        }
                ];
                
                // Wealthy families help with tuition
                if (wealth >= 8) {
                    let familyHelp = wealth >= 9 ? cost : Math.floor(cost * 0.7);
                    tuitionChoices.unshift({
                        text: `Family pays (they cover $${familyHelp.toLocaleString()})`,
                        effect: () => {
                            let remaining = cost - familyHelp;
                            if (remaining > 0) state.money -= remaining;
                            state.happiness += 8;
                            return { icon: "💝", text: "The benefits of a supportive family.", stats: remaining > 0 ? `-$${remaining} (family covered rest)` : "Fully covered!" };
                        }
                    });
                }
                
                events.push({
                    id: tuitionEventId,
                    cooldown: true,
                    category: "Finance",
                    title: "Tuition Due",
                    desc: `Another semester, another bill. Tuition is due.`,
                    choices: tuitionChoices
                });
            }
            
            // Regular education events
            if (type === 'university' || type === 'community_college') {
                events.push(...getCollegeEvents());
            } else if (type === 'trade_school') {
                events.push(...getTradeSchoolEvents());
            } else if (type === 'military_training') {
                events.push(...getMilitaryTrainingEvents());
            } else if (type === 'military_service') {
                events.push(...getMilitaryServiceEvents());
            }
            
            if (events.length === 0) {
                events.push(getRoutineEducationEvent());
            }
            
            return events;
        }

        function getCollegeEvents() {
            let events = [];
            let roll = Math.random();
            let semester = Math.floor(state.phaseWeek / 26) + 1; // 26 weeks per semester
            state.university.semester = semester;
            
            // FINANCIAL AID OFFICE - Available when money is low or at semester boundaries
            let semesterStart = (state.phaseWeek % 26) < 4;
            let moneyTight = state.money < 800;
            let financialAidChance = moneyTight ? 0.3 : (semesterStart ? 0.2 : 0.05);
            
            // Check cooldown - don't show financial aid too often
            let financialAidId = 'financial_aid_' + semester;
            if (!isEventOnCooldown(financialAidId, 12) && Math.random() < financialAidChance) {
                return [{
                    id: financialAidId,
                    cooldown: true, // This event will be tracked with cooldown
                    category: "💰 Financial Aid",
                    title: moneyTight ? "Financial Aid Check-In" : "Financial Aid Office",
                    desc: moneyTight 
                        ? "Your bank account is looking thin. The financial aid office reaches out about additional funding options."
                        : "The financial aid office has some options available if you need extra funds.",
                    choices: [
                        {
                            text: "Take out an extra $2,000 in student loans",
                            effect: () => {
                                state.money += 2000;
                                state.studentLoans += 2000;
                                return { icon: "💵", text: "Money now, payments later. That's future you's problem.", stats: "+$2,000, +$2,000 Student Loans" };
                            }
                        },
                        {
                            text: "Take out $5,000 - live a little more comfortably",
                            effect: () => {
                                state.money += 5000;
                                state.debt += 5000;
                                state.happiness += 10;
                                return { icon: "💰", text: "Breathing room. Maybe even some fun money.", stats: "+$5,000, +$5,000 Debt, +10 Happy" };
                            }
                        },
                        {
                            text: "Take out $10,000 - max it out",
                            effect: () => {
                                state.money += 10000;
                                state.debt += 10000;
                                state.happiness += 15;
                                state.stress -= 10;
                                return { icon: "🤑", text: "Go big or go home. You'll worry about this after graduation.", stats: "+$10,000, +$10,000 Debt" };
                            }
                        },
                        {
                            text: "Decline - keep debt low",
                            effect: () => {
                                state.skills.creativity += 1; // Resourcefulness
                                return { icon: "🙅", text: "You'll make it work somehow. Ramen isn't that bad.", stats: "No new debt" };
                            }
                        }
                    ]
                }];
            }
            
            // MAJOR SELECTION (Week 1-4 of university)
            if (!state.university.majorSelected && state.phaseWeek < 4) {
                return [{
                    category: "Academic",
                    title: "Choose Your Major",
                    desc: "Freshman orientation. Time to declare what you'll study for the next four years. Choose wisely.",
                    choices: Object.entries(MAJORS).map(([key, major]) => ({
                        text: `${major.icon} ${major.name} - ${major.desc}`,
                        effect: () => {
                            state.university.major = key;
                            state.university.majorSelected = true;
                            state.skills[major.statBonus] += 5;
                            if (major.stressBonus) state.stress += major.stressBonus;
                            addLog(`Declared ${major.name} major`);
                            return { icon: major.icon, text: `You're now a ${major.name} major. Your journey begins.`, stats: `+5 ${major.statBonus}` };
                        }
                    }))
                }];
            }
            
            // STUDY BUDDY ASSIGNMENT (Week 4-6)
            if (!state.university.studyBuddy && state.phaseWeek >= 4 && state.phaseWeek < 8) {
                let buddyName = STUDY_BUDDY_NAMES[Math.floor(Math.random() * STUDY_BUDDY_NAMES.length)];
                return [{
                    category: "Social",
                    title: "Study Group Formation",
                    desc: `In your intro class, ${buddyName} asks if you want to form a study group.`,
                    choices: [
                        {
                            text: `Partner up with ${buddyName}`,
                            effect: () => {
                                state.university.studyBuddy = buddyName;
                                state.university.studyBuddyRelationship = 50;
                                state.skills.social += 2;
                                return { icon: "📚", text: `You and ${buddyName} start meeting weekly. Could be helpful.`, stats: "+2 Social, Study buddy gained" };
                            }
                        },
                        {
                            text: "Prefer to study alone",
                            effect: () => {
                                state.skills.technical += 2;
                                return { icon: "🧠", text: "Solo studying builds discipline.", stats: "+2 Technical" };
                            }
                        }
                    ]
                }];
            }
            
            // CLUB RECRUITMENT (Week 8-12, Semester 1)
            if (!state.university.club && state.phaseWeek >= 8 && state.phaseWeek < 14) {
                return [{
                    category: "Campus Life",
                    title: "Club Fair",
                    desc: "The quad is packed with booths. Every organization wants fresh blood. What catches your eye?",
                    choices: [
                        ...Object.entries(CLUBS).slice(0, 3).map(([key, club]) => ({
                            text: `${club.icon} ${club.name} ($${club.cost}/semester)`,
                            condition: () => state.money >= club.cost,
                            effect: () => {
                                state.university.club = key;
                                state.university.clubWeeks = 0;
                                state.money -= club.cost;
                                if (club.social) state.skills.social += club.social;
                                if (club.physical) state.skills.physical += club.physical;
                                if (club.networkBonus) state.career.networkContacts += club.networkBonus;
                                addLog(`Joined ${club.name}`);
                                return { icon: club.icon, text: `Welcome to ${club.name}! The activities begin.`, stats: `-$${club.cost}, +${club.social || club.physical || 0} skills` };
                            }
                        })),
                        {
                            text: "Not interested in clubs",
                            effect: () => {
                                state.energy += 10;
                                return { icon: "😎", text: "More time for yourself.", stats: "+10 Energy" };
                            }
                        }
                    ]
                }];
            }
            
            // PROFESSOR MENTOR (Semester 2-3)
            if (!state.university.professorMentor && semester >= 2 && semester <= 3 && roll < 0.25) {
                let profs = PROFESSOR_TYPES.filter(p => p.field === state.university.major || Math.random() > 0.7);
                let prof = profs[Math.floor(Math.random() * profs.length)] || PROFESSOR_TYPES[0];
                return [{
                    category: "Academic",
                    title: "Office Hours",
                    desc: `${prof.name} notices your work in class. "Have you considered research opportunities?"`,
                    choices: [
                        {
                            text: `Become ${prof.name}'s research assistant`,
                            effect: () => {
                                state.university.professorMentor = prof;
                                state.university.professorRelationship = 40;
                                Object.entries(prof.bonus).forEach(([stat, val]) => {
                                    if (stat === 'technical') state.skills.technical += val;
                                    if (stat === 'creativity') state.skills.creativity += val;
                                    if (stat === 'social') state.skills.social += val;
                                    if (stat === 'stress') state.stress += val;
                                    if (stat === 'happiness') state.happiness += val;
                                });
                                addLog(`Became research assistant to ${prof.name}`);
                                return { icon: "🔬", text: `${prof.name} takes you under their wing. This could open doors.`, stats: `Professor mentor gained` };
                            }
                        },
                        {
                            text: "Too busy right now",
                            effect: () => {
                                return { icon: "⏰", text: "You politely decline. Maybe next semester.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // GPA CHECK - ACADEMIC PROBATION (Every semester end)
            if (state.phaseWeek % 26 === 25 && state.gpa < 2.0) {
                if (!state.university.onProbation) {
                    state.university.onProbation = true;
                    return [{
                        category: "⚠️ WARNING",
                        title: "Academic Probation",
                        desc: `Your GPA of ${state.gpa.toFixed(2)} is below 2.0. One more bad semester and you're out.`,
                        choices: [
                            {
                                text: "Promise to do better",
                                effect: () => {
                                    state.stress += 25;
                                    state.happiness -= 15;
                                    addLog("Placed on academic probation");
                                    return { icon: "😰", text: "The dean's letter is clear: shape up or ship out.", stats: "+25 Stress, -15 Happiness" };
                                }
                            }
                        ]
                    }];
                } else {
                    // Already on probation with bad GPA - expelled
                    return [{
                        category: "💔 EXPELLED",
                        title: "Academic Dismissal",
                        desc: "Your GPA remained below 2.0. The university has no choice.",
                        choices: [
                            {
                                text: "Pack your things",
                                effect: () => {
                                    state.phase = 'job_hunting';
                                    state.education = 'some_college';
                                    state.happiness -= 30;
                                    state.stress += 30;
                                    addLog("Expelled from university");
                                    return { icon: "📦", text: "Four years of dreams, gone. Time to figure out what's next.", stats: "-30 Happiness, +30 Stress" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // DEAN'S LIST CHECK (Every semester end)
            if (state.phaseWeek % 26 === 25 && state.gpa >= 3.5) {
                state.university.honorsList = true;
                events.push({
                    category: "🌟 Achievement",
                    title: "Dean's List!",
                    desc: `Your ${state.gpa.toFixed(2)} GPA earns you a spot on the Dean's List.`,
                    choices: [
                        {
                            text: "Accept the recognition",
                            effect: () => {
                                state.happiness += 15;
                                state.career.networkContacts += 5;
                                if (!state.achievements.includes("Dean's List")) state.achievements.push("Dean's List");
                                return { icon: "🏆", text: "Your name on the wall. Parents are proud.", stats: "+15 Happiness, +5 Network" };
                            }
                        }
                    ]
                });
                return events;
            }
            
            // STUDY ABROAD OPPORTUNITY (Semester 4-5)
            if (!state.university.studyAbroadDone && semester >= 4 && semester <= 5 && roll < 0.2) {
                return [{
                    category: "Opportunity",
                    title: "Study Abroad Program",
                    desc: "A semester in Europe. Different culture, new perspectives. But it's expensive.",
                    choices: [
                        {
                            text: "Go abroad ($5,000 extra)",
                            condition: () => state.money >= 5000 || state.debt < 50000,
                            effect: () => {
                                if (state.money >= 5000) state.money -= 5000;
                                else state.debt += 5000;
                                state.university.studyAbroadDone = true;
                                state.skills.social += 10;
                                state.skills.creativity += 5;
                                state.happiness += 20;
                                if (!state.hasPartner && Math.random() > 0.6) {
                                    let partner = generatePartner();
                                    state.hasPartner = true;
                                    state.partnerName = partner.name;
                                    state.partnerStats = partner;
                                    addLog(`Met ${partner.name} abroad`);
                                }
                                state.achievements.push("Study Abroad");
                                addLog("Studied abroad in Europe");
                                return { icon: "✈️", text: "Three months that changed your worldview forever.", stats: "+10 Social, +5 Creativity, +20 Happiness" };
                            }
                        },
                        {
                            text: "Can't afford it",
                            effect: () => {
                                state.happiness -= 5;
                                return { icon: "😔", text: "Maybe someday you'll travel.", stats: "-5 Happiness" };
                            }
                        }
                    ]
                }];
            }
            
            // INTERNSHIP (Semester 5-6)
            if (!state.university.internshipCompleted && semester >= 5 && semester <= 6 && roll < 0.3) {
                let major = MAJORS[state.university.major] || MAJORS.business;
                return [{
                    category: "Career",
                    title: "Summer Internship Offer",
                    desc: `A company wants a ${major.name} intern. Unpaid, but looks great on a resume.`,
                    choices: [
                        {
                            text: "Take the internship",
                            effect: () => {
                                let check = rollWithModifier(state.skills.technical + state.skills.social, 12);
                                state.university.internshipCompleted = true;
                                state.energy -= 20;
                                
                                if (check.nat20) {
                                    state.career.networkContacts += 20;
                                    state.money += 2000; // They liked you so much they paid you
                                    addLog("Stellar internship - job offer secured");
                                    return { icon: "🌟", text: "[NAT 20!] You impressed everyone. They offer you a job after graduation!", stats: "+20 Network, +$2,000 bonus" };
                                }
                                if (check.success) {
                                    state.career.networkContacts += 10;
                                    state.skills.technical += 5;
                                    addLog("Completed summer internship");
                                    return { icon: "💼", text: `[Rolled ${check.total} vs DC 12] Great learning experience. You have references now.`, stats: "+10 Network, +5 Technical" };
                                }
                                state.stress += 10;
                                return { icon: "😐", text: `[Rolled ${check.total} vs DC 12] Survived it. Not sure they'll remember you.`, stats: "+10 Stress" };
                            }
                        },
                        {
                            text: "Enjoy the summer off",
                            effect: () => {
                                state.happiness += 10;
                                state.energy += 20;
                                return { icon: "🏖️", text: "Summer vibes. You'll get a job eventually.", stats: "+10 Happiness, +20 Energy" };
                            }
                        }
                    ]
                }];
            }
            
            // THESIS/CAPSTONE (Semester 7-8)
            if (!state.university.thesisStarted && semester >= 7) {
                return [{
                    category: "Senior Year",
                    title: "Capstone Project",
                    desc: "Time to prove what you've learned. Your thesis advisor wants a topic by next week.",
                    choices: [
                        {
                            text: "Ambitious original research",
                            effect: () => {
                                state.university.thesisStarted = true;
                                state.university.thesisProgress = 0;
                                state.stress += 20;
                                return { icon: "🔬", text: "You're going big. High risk, high reward.", stats: "+20 Stress, Thesis started (Hard mode)" };
                            }
                        },
                        {
                            text: "Safe, well-defined project",
                            effect: () => {
                                state.university.thesisStarted = true;
                                state.university.thesisProgress = 20;
                                return { icon: "📝", text: "Smart choice. Known territory.", stats: "Thesis started (Normal mode)" };
                            }
                        }
                    ]
                }];
            }
            
            // THESIS WORK EVENTS
            if (state.university.thesisStarted && state.university.thesisProgress < 100) {
                if (roll < 0.3) {
                    return [{
                        category: "Thesis",
                        title: "Research Progress",
                        desc: `Thesis is ${state.university.thesisProgress}% complete. The deadline looms.`,
                        choices: [
                            {
                                text: "All-nighter work session",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.technical, 13);
                                    state.university.allNighters++;
                                    state.energy -= 30;
                                    state.health -= 5;
                                    
                                    if (check.nat20) {
                                        state.university.thesisProgress += 35;
                                        return { icon: "⭐", text: "[NAT 20!] BREAKTHROUGH! Everything clicks into place.", stats: "+35% thesis, -30 Energy, -5 Health" };
                                    }
                                    if (check.success) {
                                        state.university.thesisProgress += 20;
                                        return { icon: "📊", text: `[Rolled ${check.total} vs DC 13] Good progress. Seeing the light.`, stats: "+20% thesis, -30 Energy" };
                                    }
                                    state.university.thesisProgress += 10;
                                    state.stress += 15;
                                    return { icon: "😫", text: `[Rolled ${check.total} vs DC 13] Spinning wheels. Some progress at least.`, stats: "+10% thesis, +15 Stress" };
                                }
                            },
                            {
                                text: "Steady, sustainable pace",
                                effect: () => {
                                    state.university.thesisProgress += 12;
                                    state.energy -= 10;
                                    return { icon: "📝", text: "Slow and steady. It adds up.", stats: "+12% thesis" };
                                }
                            },
                            {
                                text: "Ask professor for guidance",
                                condition: () => state.university.professorMentor,
                                effect: () => {
                                    state.university.thesisProgress += 18;
                                    state.university.professorRelationship += 5;
                                    return { icon: "🎓", text: `${state.university.professorMentor.name} points you in the right direction.`, stats: "+18% thesis, +5 Professor relationship" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // REGULAR COLLEGE EVENTS - Academic challenges with dice rolls
            if (roll < 0.35) { // Increased from 15% to 35%
                let intelBonus = getIntelligenceDCBonus();
                let intelMod = getIntelligenceModifier();
                let intelDesc = intelBonus > 0 ? " (your intelligence helps)" : intelBonus < -1 ? " (this is harder for you)" : "";
                
                events.push({
                    category: "Academic",
                    title: "Big Exam Coming",
                    desc: `Midterms are next week. How do you prepare?${intelDesc}`,
                    choices: [
                        {
                            text: "Pull an all-nighter. Coffee and desperation.",
                            effect: () => {
                                let dc = Math.max(5, 12 - intelBonus);
                                let check = rollWithModifier(state.skills.technical, dc);
                                state.energy -= 20;
                                state.health -= 10;
                                state.stress += 15;
                                state.university.allNighters++;
                                
                                if (check.nat20) {
                                    let gpaGain = gainGPA(0.4);
                                    gainSkill('technical', 5);
                                    return { icon: "🌟", text: "[NAT 20!] Perfect score! The all-nighter paid off.", stats: `+${gpaGain.toFixed(2)} GPA` };
                                }
                                if (check.success) {
                                    let gpaGain = gainGPA(0.25);
                                    gainSkill('technical', 3);
                                    return { icon: "📚", text: `[Rolled ${check.total} vs DC ${dc}] Aced it!`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                }
                                if (check.nat1) {
                                    state.gpa = Math.max(0, state.gpa - 0.4);
                                    state.happiness -= 15;
                                    return { icon: "💀", text: "[NAT 1!] Fell asleep during the exam. Complete failure.", stats: "-0.4 GPA, -15 Happy" };
                                }
                                // Failed the exam - GPA hit
                                state.gpa = Math.max(0, state.gpa - 0.15);
                                state.happiness -= 8;
                                return { icon: "😫", text: `[Rolled ${check.total} vs DC ${dc}] Failed the exam. Sleep-deprived brain couldn't handle it.`, stats: "-0.15 GPA, -8 Happy" };
                            }
                        },
                        {
                            text: "Hire a tutor. Money can solve this problem.",
                            condition: () => state.money >= 150,
                            effect: () => {
                                state.money -= 150;
                                let dc = Math.max(4, 8 - intelBonus);
                                let check = rollWithModifier(state.skills.technical + 10, dc);
                                state.energy -= 10;
                                
                                if (check.nat20) {
                                    let gpaGain = gainGPA(0.35);
                                    return { icon: "🌟", text: "[NAT 20!] Tutor was amazing.", stats: `-$150, +${gpaGain.toFixed(2)} GPA` };
                                }
                                let gpaGain = gainGPA(0.2);
                                return { icon: "📖", text: `[Rolled ${check.total} vs DC ${dc}] Money well spent.`, stats: `-$150, +${gpaGain.toFixed(2)} GPA` };
                            }
                        },
                        {
                            text: "Study at a reasonable pace. Balance is key.",
                            effect: () => {
                                let dc = Math.max(8, 11 - intelBonus);
                                let check = rollWithModifier(state.skills.technical, dc);
                                state.energy -= 10;
                                state.stress += 5;
                                
                                if (check.nat20) {
                                    let gpaGain = gainGPA(0.25);
                                    state.skills.technical += 2;
                                    return { icon: "🌟", text: "[NAT 20!] Perfect balance. Aced it effortlessly.", stats: `+${gpaGain.toFixed(2)} GPA, +2 Technical` };
                                }
                                if (check.success) {
                                    state.gpa = Math.min(4.0, state.gpa + 0.15);
                                    state.skills.technical += 1;
                                    return { icon: "📚", text: `[Rolled ${check.total} vs DC ${dc}] Healthy approach. Good grade.`, stats: "+0.15 GPA, +1 Technical" };
                                }
                                if (check.nat1) {
                                    state.gpa = Math.max(0, state.gpa - 0.25);
                                    state.happiness -= 10;
                                    return { icon: "💀", text: "[NAT 1!] Studied the wrong chapter entirely.", stats: "-0.25 GPA, -10 Happy" };
                                }
                                // Failed but studied - smaller penalty
                                state.gpa = Math.max(0, state.gpa - 0.08);
                                return { icon: "😐", text: `[Rolled ${check.total} vs DC ${dc}] The exam was harder than expected. Below average grade.`, stats: "-0.08 GPA" };
                            }
                        },
                        {
                            text: "Wing it. You're smart enough, right?",
                            effect: () => {
                                let check = rollWithModifier(state.skills.technical - 10, 15);
                                if (check.nat20) {
                                    state.gpa = Math.min(4.0, state.gpa + 0.4);
                                    state.happiness += 10;
                                    return { icon: "😎", text: "[NAT 20!] Pure genius. Didn't study, still crushed it.", stats: "+0.4 GPA, +10 Happy" };
                                }
                                if (check.success) {
                                    state.gpa = Math.min(4.0, state.gpa + 0.15);
                                    return { icon: "😅", text: `[Rolled ${check.total} vs DC 15] Scraped by on intuition.`, stats: "+0.15 GPA" };
                                }
                                if (check.nat1) {
                                    state.gpa = Math.max(0, state.gpa - 0.5);
                                    state.happiness -= 20;
                                    return { icon: "💀", text: "[NAT 1!] Complete disaster. What were you thinking?", stats: "-0.5 GPA, -20 Happy" };
                                }
                                state.gpa = Math.max(0, state.gpa - 0.2);
                                    state.happiness -= 10;
                                return { icon: "😰", text: `[Rolled ${check.total}] Failed. Should have studied.`, stats: "-0.2 GPA, -10 Happy" };
                            }
                        },
                        {
                            text: `Study with ${state.university.studyBuddy || 'your study group'}. Strength in numbers.`,
                            condition: () => state.university.studyBuddy,
                            effect: () => {
                                state.gpa = Math.min(4.0, state.gpa + 0.15);
                                state.university.studyBuddyRelationship += 5;
                                state.energy -= 15;
                                return { icon: "👥", text: `${state.university.studyBuddy} helps you nail the tricky parts.`, stats: "+0.15 GPA, +5 Buddy relationship" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.50) {
                // More academic events with dice rolls
                let academicEventType = Math.random();
                
                if (academicEventType < 0.33) {
                    // CLASS PRESENTATION
                events.push({
                        category: "Academic",
                        title: "Class Presentation",
                        desc: `You have to present your research to the class. Public speaking isn't for everyone.${intelDesc}`,
                    choices: [
                        {
                                text: "🎲 Wing it with confidence",
                            effect: () => {
                                    let dc = Math.max(8, 14 - intelBonus);
                                    let check = rollWithModifier(state.skills.social, dc);
                                    
                                    if (check.nat20) {
                                        let gpaGain = gainGPA(0.3);
                                        gainSkill('social', 4);
                                        return { icon: "🌟", text: "[NAT 20!] Standing ovation! Professor asks you to present at a conference.", stats: `+${gpaGain.toFixed(2)} GPA, +4 Social` };
                                    }
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.15);
                                        gainSkill('social', 2);
                                        return { icon: "🎤", text: `[Rolled ${check.total} vs DC ${dc}] Smooth delivery. Class is impressed.`, stats: `+${gpaGain.toFixed(2)} GPA, +2 Social` };
                                    }
                                    if (check.nat1) {
                                        state.gpa = Math.max(0, state.gpa - 0.2);
                                        state.stress += 20;
                                        return { icon: "💀", text: "[NAT 1!] Complete meltdown. You froze up and ran out.", stats: "-0.2 GPA, +20 Stress" };
                                    }
                                    state.stress += 10;
                                    return { icon: "😬", text: `[Rolled ${check.total}] Stumbled through it. At least it's over.`, stats: "+10 Stress" };
                                }
                            },
                            {
                                text: "🎲 Prepare extensively (costs energy)",
                                effect: () => {
                                    state.energy -= 20;
                                    let dc = Math.max(6, 10 - intelBonus);
                                    let check = rollWithModifier(state.skills.technical + 5, dc);
                                    
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.2);
                                        gainSkill('social', 1);
                                        gainSkill('technical', 1);
                                        return { icon: "📊", text: `[Rolled ${check.total} vs DC ${dc}] Preparation paid off. Solid presentation.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    state.gpa = Math.min(4.0, state.gpa + 0.05);
                                    return { icon: "😐", text: `[Rolled ${check.total}] All that prep and still nervous. Passing grade.`, stats: "+0.05 GPA" };
                                }
                            },
                            {
                                text: "Fake being sick",
                                effect: () => {
                                    state.stress -= 10;
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    return { icon: "🤒", text: "Bought yourself time, but you'll have to do it eventually.", stats: "-0.1 GPA, -10 Stress" };
                                }
                            }
                        ]
                    });
                } else if (academicEventType < 0.66) {
                    // LAB EXPERIMENT
                    events.push({
                        category: "Academic",
                        title: "Lab Experiment",
                        desc: `Time to put theory into practice. One wrong move could ruin the whole thing.${intelDesc}`,
                        choices: [
                            {
                                text: "🎲 Follow the instructions carefully",
                                effect: () => {
                                    let dc = Math.max(7, 12 - intelBonus);
                                    let check = rollWithModifier(state.skills.technical, dc);
                                    
                                    if (check.nat20) {
                                        let gpaGain = gainGPA(0.25);
                                        gainSkill('technical', 5);
                                        return { icon: "🌟", text: "[NAT 20!] Perfect execution! TA asks if you want to assist in research.", stats: `+${gpaGain.toFixed(2)} GPA, +5 Technical` };
                                    }
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.15);
                                        gainSkill('technical', 2);
                                        return { icon: "🔬", text: `[Rolled ${check.total} vs DC ${dc}] Experiment successful!`, stats: `+${gpaGain.toFixed(2)} GPA, +2 Technical` };
                                    }
                                    if (check.nat1) {
                                        state.gpa = Math.max(0, state.gpa - 0.15);
                                        state.health -= 5;
                                        return { icon: "💥", text: "[NAT 1!] Something exploded. Safety goggles saved your eyes.", stats: "-0.15 GPA, -5 Health" };
                                    }
                                    return { icon: "😕", text: `[Rolled ${check.total}] Results inconclusive. Partial credit.`, stats: "+0.05 GPA" };
                                }
                            },
                            {
                                text: "🎲 Try an innovative approach",
                                effect: () => {
                                    let dc = Math.max(10, 16 - intelBonus);
                                    let check = rollWithModifier(state.skills.creativity + state.skills.technical/2, dc);
                                    
                                    if (check.nat20) {
                                        let gpaGain = gainGPA(0.4);
                                        gainSkill('creativity', 5);
                                        gainSkill('technical', 3);
                                        return { icon: "🏆", text: "[NAT 20!] You discovered something new! Professor wants to publish with you!", stats: `+${gpaGain.toFixed(2)} GPA, +5 Creativity` };
                                    }
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.25);
                                        gainSkill('creativity', 3);
                                        return { icon: "💡", text: `[Rolled ${check.total} vs DC ${dc}] Your approach worked! Extra credit.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    return { icon: "🤷", text: `[Rolled ${check.total}] Your 'innovation' just made a mess.`, stats: "-0.1 GPA" };
                                }
                            },
                            {
                                text: "Partner with someone smart",
                                condition: () => state.university.studyBuddy,
                                effect: () => {
                                    let gpaGain = gainGPA(0.12);
                                    state.university.studyBuddyRelationship += 3;
                                    return { icon: "🤝", text: `${state.university.studyBuddy} carries you through. Teamwork!`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                }
                            }
                        ]
                    });
                } else {
                    // RESEARCH PAPER
                    events.push({
                        category: "Academic",
                        title: "Research Paper Due",
                        desc: `A major paper is due. Your thesis needs to be solid.${intelDesc}`,
                        choices: [
                            {
                                text: "🎲 Write it properly over several days",
                                effect: () => {
                                state.energy -= 15;
                                    let dc = Math.max(8, 13 - intelBonus);
                                    let check = rollWithModifier(state.skills.technical + state.skills.creativity/2, dc);
                                    
                                    if (check.nat20) {
                                        let gpaGain = gainGPA(0.3);
                                        gainSkill('technical', 3);
                                        gainSkill('creativity', 2);
                                        return { icon: "🌟", text: "[NAT 20!] Professor reads it aloud as an example. Perfect score.", stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.18);
                                        gainSkill('technical', 1);
                                        return { icon: "📝", text: `[Rolled ${check.total} vs DC ${dc}] Well-researched paper. Good grade.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    let gpaGain = gainGPA(0.08);
                                    return { icon: "😐", text: `[Rolled ${check.total}] Decent effort. Average grade.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                }
                            },
                            {
                                text: "🎲 Last-minute all-nighter",
                                effect: () => {
                                    state.energy -= 25;
                                    state.health -= 5;
                                    state.stress += 15;
                                    let dc = Math.max(10, 15 - intelBonus);
                                    let check = rollWithModifier(state.skills.technical, dc);
                                    
                                    if (check.nat20) {
                                        let gpaGain = gainGPA(0.35);
                                        return { icon: "🌟", text: "[NAT 20!] Somehow your sleep-deprived brain produced genius.", stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    if (check.success) {
                                        let gpaGain = gainGPA(0.15);
                                        return { icon: "😵", text: `[Rolled ${check.total} vs DC ${dc}] Barely coherent, but it passed.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    if (check.nat1) {
                                        state.gpa = Math.max(0, state.gpa - 0.3);
                                        return { icon: "💀", text: "[NAT 1!] You fell asleep and submitted gibberish.", stats: "-0.3 GPA" };
                                    }
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    return { icon: "😫", text: `[Rolled ${check.total}] Professor saw right through it.`, stats: "-0.1 GPA" };
                                }
                            },
                            {
                                text: "Use AI to help (risky)",
                                effect: () => {
                                    let check = rollWithModifier(0, 12); // Pure luck
                                    
                                    if (check.roll >= 15) {
                                        let gpaGain = gainGPA(0.2);
                                        return { icon: "🤖", text: `[Rolled ${check.roll}] Got away with it. Paper turned out decent.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                    }
                                    if (check.roll <= 5) {
                                        state.gpa = Math.max(0, state.gpa - 0.5);
                                        state.stress += 30;
                                        return { icon: "🚨", text: `[Rolled ${check.roll}] CAUGHT! Academic integrity violation.`, stats: "-0.5 GPA, +30 Stress" };
                                    }
                                    let gpaGain = gainGPA(0.1);
                                    return { icon: "😅", text: `[Rolled ${check.roll}] It worked, but the writing felt off.`, stats: `+${gpaGain.toFixed(2)} GPA` };
                                }
                            }
                        ]
                    });
                }
            } else if (roll < 0.60) {
                events.push({
                    category: "Social",
                    title: state.university.club === 'greek' ? "Frat/Sorority Party" : "Campus Party",
                    desc: state.university.club === 'greek' ? "Your house is throwing a massive party. You're expected to be there." : "There's a big party this weekend. Everyone's going.",
                    choices: [
                        {
                            text: "Go hard 🎉",
                            effect: () => {
                                state.happiness += 20;
                                state.energy -= 25;
                                state.skills.social += 3;
                                state.money -= 50;
                                state.university.partiesAttended++;
                                
                                if (Math.random() < 0.15) {
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    state.health -= 10;
                                    return { icon: "🤮", text: "You don't remember half of it. Missed Monday's class.", stats: "+20 Happiness, -0.1 GPA, -10 Health" };
                                }
                                if (!state.hasPartner && Math.random() > 0.6) {
                                    let partner = generatePartner();
                                    state.hasPartner = true;
                                    state.partnerName = partner.name;
                                    state.partnerStats = partner;
                                    state.relationshipWeeks = 0;
                                    addLog(`Met ${partner.name} at a party`);
                                    return { icon: "🎉", text: `Epic night! And you met someone named ${partner.name}.`, stats: "+20 Happiness, +3 Social, Romance!" };
                                }
                                return { icon: "🎉", text: "What a night! These are the memories.", stats: "+20 Happiness, +3 Social, -$50" };
                            }
                        },
                        {
                            text: "Make an appearance, leave early",
                            effect: () => {
                                state.happiness += 8;
                                state.skills.social += 1;
                                state.money -= 15;
                                return { icon: "🙂", text: "Said hi, showed face, went home. Balance.", stats: "+8 Happiness, +1 Social" };
                            }
                        },
                        {
                            text: "Stay in and study",
                            effect: () => {
                                state.gpa = Math.min(4.0, state.gpa + 0.05);
                                state.skills.technical += 1;
                                state.happiness -= 5;
                                return { icon: "📚", text: "FOMO hits hard, but your GPA thanks you.", stats: "+0.05 GPA, -5 Happiness" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.68 && !state.employed) {
                events.push({
                    category: "Work",
                    title: "Part-Time Job Opportunity",
                    desc: "The campus coffee shop is hiring. Flexible hours, but it'll cut into study time.",
                    choices: [
                        {
                            text: "Take the job ($150/week)",
                            effect: () => {
                                state.employed = true;
                                state.job = 'part_time';
                                state.jobTitle = 'Campus Barista';
                                state.weeklyIncome = 150;
                                state.skills.social += 3;
                                addLog("Started part-time job");
                                return { icon: "☕", text: "You start next week. Work-study life begins.", stats: "+$150/week income, +3 Social" };
                            }
                        },
                        {
                            text: "Focus on studies",
                            effect: () => {
                                state.gpa = Math.min(4.0, state.gpa + 0.05);
                                return { icon: "📚", text: "School is your job right now.", stats: "+0.05 GPA" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.75 && state.university.professorMentor) {
                // Professor relationship events
                events.push({
                    category: "Academic",
                    title: `Meeting with ${state.university.professorMentor.name}`,
                    desc: "Your mentor wants to discuss your progress and future plans.",
                    choices: [
                        {
                            text: "Ask for a recommendation letter",
                            effect: () => {
                                let check = rollWithModifier(state.university.professorRelationship, 12);
                                if (check.success) {
                                    state.career.networkContacts += 15;
                                    state.university.professorRelationship += 10;
                                    return { icon: "📜", text: `[Rolled ${check.total} vs DC 12] "${state.university.professorMentor.name} speaks highly of you" - that letter will open doors.`, stats: "+15 Network, +10 Prof relationship" };
                                }
                                state.stress += 5;
                                return { icon: "😬", text: `[Rolled ${check.total} vs DC 12] "Perhaps after you improve your work..." Ouch.`, stats: "+5 Stress" };
                            }
                        },
                        {
                            text: "Discuss research ideas",
                            effect: () => {
                                state.skills.technical += 3;
                                state.university.professorRelationship += 5;
                                state.energy -= 10;
                                return { icon: "💡", text: `${state.university.professorMentor.name} shares insights you won't find in textbooks.`, stats: "+3 Technical, +5 Prof relationship" };
                            }
                        },
                        {
                            text: "Ask about career paths",
                            effect: () => {
                                state.skills.social += 2;
                                state.career.networkContacts += 5;
                                return { icon: "🗺️", text: "Real talk about what comes after graduation.", stats: "+2 Social, +5 Network" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.82) {
                // VARIED CAMPUS LIFE EVENTS - All with tradeoffs
                let campusEventType = Math.random();
                
                if (campusEventType < 0.12 && state.university.studyBuddy) {
                    // FRIEND VS EXAM - Classic college dilemma
                    events.push({
                        category: "⚖️ Dilemma",
                        title: "Night Before the Exam",
                        desc: `You have a big test tomorrow. ${state.university.studyBuddy} texts: "Everyone's going to this party, last one before finals. You in?"`,
                        choices: [
                            {
                                text: "Go to the party - you only live once",
                                effect: () => {
                                    state.happiness += 15;
                                    state.university.studyBuddyRelationship += 10;
                                    state.skills.social += 2;
                                    state.energy -= 20;
                                    state.gpa = Math.max(0, state.gpa - 0.15);
                                    return { icon: "🎉", text: `Amazing night. Worth it? Ask yourself tomorrow during the exam.`, stats: "+15 Happy, +10 Bond, -0.15 GPA" };
                                }
                            },
                            {
                                text: "Study instead - grades matter",
                                effect: () => {
                                    state.university.studyBuddyRelationship -= 5;
                                    state.gpa = Math.min(4.0, state.gpa + 0.1);
                                    state.stress += 5;
                                    state.happiness -= 5;
                                    return { icon: "📚", text: `FOMO is real, but you feel prepared. ${state.university.studyBuddy} sends pics of what you're missing.`, stats: "+0.1 GPA, -5 Bond, -5 Happy" };
                                }
                            },
                            {
                                text: "Go for an hour, then study",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social, 12);
                                    if (check.success) {
                                        state.happiness += 8;
                                        state.university.studyBuddyRelationship += 3;
                                        return { icon: "🎯", text: `[Rolled ${check.total}] Balanced it perfectly. Quick appearance, then home to study.`, stats: "+8 Happy, +3 Bond" };
                                    }
                                    state.energy -= 25;
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    return { icon: "😵", text: `[Rolled ${check.total}] "One hour" became four. You stumble home at 2am.`, stats: "-0.1 GPA, -25 Energy" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.24 && (state.stress > 50 || state.energy < 40)) {
                    // BURNOUT CHECK - only triggers if actually stressed/tired
                    events.push({
                        category: "🧠 Mental Health",
                        title: "Hitting a Wall",
                        desc: `Stress: ${Math.round(state.stress)}%, Energy: ${Math.round(state.energy)}%. Everything feels overwhelming. Your body is screaming for a break.`,
                        choices: [
                            {
                                text: "Take a mental health day",
                                effect: () => {
                                    state.stress -= 20;
                                    state.energy += 25;
                                    state.happiness += 10;
                                    state.gpa = Math.max(0, state.gpa - 0.05);
                                    return { icon: "🛌", text: "Skip class. Sleep in. Watch movies. Sometimes you need to recharge.", stats: "-20 Stress, +25 Energy, -0.05 GPA" };
                                }
                            },
                            {
                                text: "Push through - finals are coming",
                                effect: () => {
                                    state.stress += 15;
                                    state.energy -= 15;
                                    state.health -= 5;
                                    state.gpa = Math.min(4.0, state.gpa + 0.08);
                                    return { icon: "😤", text: "Coffee. More coffee. You're running on fumes but keeping up.", stats: "+0.08 GPA, +15 Stress, -5 Health" };
                                }
                            },
                            {
                                text: "Hit the gym - exercise helps",
                                condition: () => state.fitness.gymMember,
                                effect: () => {
                                    state.stress -= 10;
                                    state.energy -= 10;
                                    state.health += 5;
                                    state.skills.physical += 1;
                                    return { icon: "💪", text: "Endorphins kick in. You feel human again.", stats: "-10 Stress, +5 Health" };
                                }
                            },
                            {
                                text: "Call home - need to hear a familiar voice",
                                effect: () => {
                                    state.stress -= 12;
                                    state.happiness += 8;
                                    if (state.characterTraits.familyWealth >= 7) {
                                        state.money += 100;
                                        return { icon: "📱", text: "Mom sends a care package and some 'emergency' money.", stats: "-12 Stress, +8 Happy, +$100" };
                                    }
                                    return { icon: "📱", text: "Sometimes you just need to hear 'I'm proud of you.'", stats: "-12 Stress, +8 Happy" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.36) {
                    // SLEEP VS STUDY
                    events.push({
                        category: "⚖️ Dilemma",
                        title: "2 AM Decision",
                        desc: "You've been studying for hours. The material isn't sticking. Your bed looks so inviting.",
                        choices: [
                            {
                                text: "Keep studying - sleep when you're dead",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.technical, 14);
                                    state.energy -= 20;
                                    state.health -= 5;
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.12);
                                        return { icon: "🌙", text: `[Rolled ${check.total}] Something clicks at 3am. You finally get it!`, stats: "+0.12 GPA, -20 Energy, -5 Health" };
                                    }
                                    state.stress += 10;
                                    return { icon: "😵", text: `[Rolled ${check.total}] Stared at the same page for an hour. Wasted effort.`, stats: "-20 Energy, +10 Stress" };
                                }
                            },
                            {
                                text: "Sleep now, wake up early",
                                effect: () => {
                                    let check = rollWithModifier(0, 10); // Pure willpower
                                    if (check.roll >= 12) {
                                        state.energy += 15;
                                        state.gpa = Math.min(4.0, state.gpa + 0.05);
                                        return { icon: "⏰", text: `[Rolled ${check.roll}] Actually woke up at 6am. Morning study session!`, stats: "+15 Energy, +0.05 GPA" };
                                    }
                                    state.energy += 20;
                                    state.gpa = Math.max(0, state.gpa - 0.05);
                                    return { icon: "😴", text: `[Rolled ${check.roll}] Slept through all your alarms. Classic.`, stats: "+20 Energy, -0.05 GPA" };
                                }
                            },
                            {
                                text: "Power nap (20 minutes)",
                                effect: () => {
                                    state.energy += 10;
                                    state.gpa = Math.min(4.0, state.gpa + 0.03);
                                    return { icon: "😌", text: "Science says this works. Feels like it might have helped.", stats: "+10 Energy, +0.03 GPA" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.48) {
                    // WORK VS CLASS
                    events.push({
                        category: "⚖️ Dilemma",
                        title: "Schedule Conflict",
                        desc: state.employed ? 
                            "Your boss wants you to pick up extra shifts this week. But you have a group project meeting." :
                            "A tutoring opportunity pays $30/hour. But it conflicts with a class you're struggling in.",
                        choices: [
                            {
                                text: "Prioritize money",
                                effect: () => {
                                    state.money += state.employed ? 150 : 90;
                                    state.gpa = Math.max(0, state.gpa - 0.1);
                                    state.stress += 8;
                                    return { icon: "💵", text: "Bills don't pay themselves. You'll catch up on the material later... probably.", stats: `+$${state.employed ? 150 : 90}, -0.1 GPA, +8 Stress` };
                                }
                            },
                            {
                                text: "Prioritize school",
                                effect: () => {
                                    state.gpa = Math.min(4.0, state.gpa + 0.08);
                                    state.stress += 5;
                                    if (state.employed) {
                                        state.career.performanceRating = Math.max(0, (state.career.performanceRating || 50) - 5);
                                    }
                                    return { icon: "📚", text: "School comes first. That's what you're here for.", stats: "+0.08 GPA, +5 Stress" };
                                }
                            },
                            {
                                text: "Try to do both (exhausting)",
                                effect: () => {
                                    let check = rollWithModifier(state.energy, 50);
                                    if (check.success) {
                                        state.money += state.employed ? 100 : 60;
                                        state.gpa = Math.min(4.0, state.gpa + 0.03);
                                        state.energy -= 30;
                                        return { icon: "😤", text: `[Rolled ${check.total}] Somehow pulled it off. Barely.`, stats: `+$${state.employed ? 100 : 60}, +0.03 GPA, -30 Energy` };
                                    }
                                    state.energy -= 25;
                                    state.stress += 15;
                                    return { icon: "💀", text: `[Rolled ${check.total}] Overcommitted. Both suffered.`, stats: "-25 Energy, +15 Stress" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.60) {
                    // DATING VS STUDYING
                    let crushName = state.gender === 'male' ? 
                        ['Emma', 'Sofia', 'Olivia', 'Mia', 'Ava'][Math.floor(Math.random() * 5)] :
                        ['Jake', 'Ryan', 'Tyler', 'Alex', 'Chris'][Math.floor(Math.random() * 5)];
                    events.push({
                        category: "💕 Romance",
                        title: "Cute Classmate",
                        desc: `${crushName} from your study group keeps finding excuses to talk to you. They just asked if you want to grab coffee.`,
                        choices: [
                            {
                                text: "Yes! Finally some fun",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social + calculateAppeal(), 12);
                                    state.happiness += 10;
                                    state.energy -= 10;
                                    state.gpa = Math.max(0, state.gpa - 0.03);
                                    
                                    if (check.nat20) {
                                        if (!state.hasPartner) {
                                            state.hasPartner = true;
                                            state.partnerName = crushName;
                                            state.partnerStats = generatePartner();
                                            state.relationshipWeeks = 0;
                                            return { icon: "💘", text: `[NAT 20!] Coffee turned into dinner turned into... you're dating ${crushName} now!`, stats: "+10 Happy, New relationship!" };
                                        }
                                    }
                                    if (check.success) {
                                        state.skills.social += 2;
                                        return { icon: "☕", text: `[Rolled ${check.total}] Great conversation! ${crushName} wants to hang out again.`, stats: "+10 Happy, +2 Social" };
                                    }
                                    return { icon: "😅", text: `[Rolled ${check.total}] Awkward silence. You both made excuses to leave.`, stats: "+5 Happy, -0.03 GPA" };
                                }
                            },
                            {
                                text: "Rain check - midterms are killing me",
                                effect: () => {
                                    state.gpa = Math.min(4.0, state.gpa + 0.05);
                                    state.happiness -= 5;
                                    return { icon: "📱", text: `${crushName} says "sure" but looks disappointed. Focus on grades.`, stats: "+0.05 GPA, -5 Happy" };
                                }
                            },
                            {
                                text: "Study date? Best of both worlds",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social, 11);
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.05);
                                        state.happiness += 8;
                                        state.skills.social += 1;
                                        return { icon: "📚💕", text: `[Rolled ${check.total}] Actually got work done AND had fun. ${crushName} is impressed.`, stats: "+0.05 GPA, +8 Happy" };
                                    }
                                    state.happiness += 5;
                                    return { icon: "😊", text: `[Rolled ${check.total}] More flirting than studying, but worth it.`, stats: "+5 Happy" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.72) {
                    // HEALTH VS ACADEMICS
                    events.push({
                        category: "🏥 Health",
                        title: "Feeling Sick",
                        desc: "You wake up feeling terrible. Sore throat, headache, the works. But you have class today.",
                        choices: [
                            {
                                text: "Power through it",
                                effect: () => {
                                    state.health -= 10;
                                    state.energy -= 15;
                                    let check = rollWithModifier(state.health, 40);
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.03);
                                        return { icon: "🤧", text: `[Rolled ${check.total}] Survived. Didn't miss anything important.`, stats: "+0.03 GPA, -10 Health" };
                                    }
                                    state.health -= 10;
                                    return { icon: "🤮", text: `[Rolled ${check.total}] Made it worse. Now you're really sick.`, stats: "-20 Health, -15 Energy" };
                                }
                            },
                            {
                                text: "Stay in bed - health first",
                                effect: () => {
                                    state.health += 10;
                                    state.energy += 20;
                                    state.gpa = Math.max(0, state.gpa - 0.05);
                                    return { icon: "🛌", text: "Rest, fluids, Netflix. You'll recover faster this way.", stats: "+10 Health, +20 Energy, -0.05 GPA" };
                                }
                            },
                            {
                                text: "Email professor, attend virtually",
                                effect: () => {
                                    state.health += 5;
                                    let check = rollWithModifier(state.skills.technical, 10);
                                    if (check.success) {
                                        return { icon: "💻", text: `[Rolled ${check.total}] Zoom from bed. Professor appreciates your dedication.`, stats: "+5 Health" };
                                    }
                                    state.gpa = Math.max(0, state.gpa - 0.02);
                                    return { icon: "📵", text: `[Rolled ${check.total}] WiFi issues. Missed half the lecture anyway.`, stats: "+5 Health, -0.02 GPA" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.84) {
                    // SPRING BREAK DILEMMA
                    events.push({
                        category: "🏖️ Break Time",
                        title: "Spring Break Plans",
                        desc: "Everyone's talking about spring break. Your friends are planning a trip. But it's not cheap.",
                        choices: [
                            {
                                text: "Join the trip ($400)",
                                condition: () => state.money >= 400,
                                effect: () => {
                                    state.money -= 400;
                                    state.happiness += 25;
                                    state.stress -= 20;
                                    state.skills.social += 3;
                                    state.energy -= 15; // Exhausting but fun
                                    return { icon: "🏖️", text: "Best week ever. Memories that'll last a lifetime.", stats: "-$400, +25 Happy, -20 Stress, +3 Social" };
                                }
                            },
                            {
                                text: "Put it on credit card",
                                condition: () => state.finances.hasCreditCard && (state.finances.creditLimit - state.finances.creditBalance) >= 400,
                                effect: () => {
                                    state.finances.creditBalance += 400;
                                    state.happiness += 25;
                                    state.stress -= 15; // Less stress relief knowing you owe money
                                    state.skills.social += 3;
                                    return { icon: "💳", text: "YOLO. You'll figure out the bill later.", stats: "+$400 CC debt, +25 Happy, +3 Social" };
                                }
                            },
                            {
                                text: "Stay on campus and study",
                                effect: () => {
                                    state.gpa = Math.min(4.0, state.gpa + 0.15);
                                    state.skills.technical += 2;
                                    state.happiness -= 10;
                                    state.stress += 5;
                                    return { icon: "📚", text: "Empty campus. Perfect for catching up. But the FOMO is real.", stats: "+0.15 GPA, +2 Technical, -10 Happy" };
                                }
                            },
                            {
                                text: "Go home and work",
                                effect: () => {
                                    state.money += 300;
                                    state.stress -= 10;
                                    state.happiness += 5;
                                    return { icon: "🏠", text: "Mom's cooking, your old room, and some shifts at a local job. Not bad.", stats: "+$300, -10 Stress, +5 Happy" };
                                }
                            }
                        ]
                    });
                } else if (campusEventType < 0.92 && state.university.studyBuddy) {
                    // FRIEND IN TROUBLE
                    events.push({
                        category: "👥 Friendship",
                        title: `${state.university.studyBuddy}'s Crisis`,
                        desc: `${state.university.studyBuddy} texts at midnight: "Can we talk? It's important." You have an 8am class.`,
                        choices: [
                            {
                                text: "Go be there for them",
                                effect: () => {
                                    state.university.studyBuddyRelationship += 25;
                                    state.skills.social += 3;
                                    state.energy -= 25;
                                    state.happiness += 5;
                                    state.gpa = Math.max(0, state.gpa - 0.05);
                                    return { icon: "🤝", text: `You stayed up until 4am talking. ${state.university.studyBuddy} really needed someone.`, stats: "+25 Bond, +3 Social, -0.05 GPA" };
                                }
                            },
                            {
                                text: "Call but keep it short",
                                effect: () => {
                                    state.university.studyBuddyRelationship += 8;
                                    state.energy -= 10;
                                    return { icon: "📱", text: "Quick check-in. They understand you have class.", stats: "+8 Bond, -10 Energy" };
                                }
                            },
                            {
                                text: "Text that you'll talk tomorrow",
                                effect: () => {
                                    state.university.studyBuddyRelationship -= 10;
                                    return { icon: "💤", text: "\"Sure, tomorrow.\" They seem a bit hurt but say it's fine.", stats: "-10 Bond" };
                                }
                            }
                        ]
                    });
                } else {
                    // GROUP PROJECT DRAMA
                    events.push({
                        category: "📋 Teamwork",
                        title: "Group Project Disaster",
                        desc: "Your group project partner ghosted. Deadline is in 3 days. You have their half unfinished.",
                        choices: [
                            {
                                text: "Do their part yourself",
                                effect: () => {
                                    state.energy -= 30;
                                    state.stress += 20;
                                    let check = rollWithModifier(state.skills.technical, 13);
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.2);
                                        state.skills.technical += 2;
                                        return { icon: "💪", text: `[Rolled ${check.total}] Did it all yourself. Actually learned a lot.`, stats: "+0.2 GPA, +2 Technical, -30 Energy" };
                                    }
                                    state.gpa = Math.min(4.0, state.gpa + 0.1);
                                    return { icon: "😫", text: `[Rolled ${check.total}] Pulled it off, barely. Never again.`, stats: "+0.1 GPA, +20 Stress" };
                                }
                            },
                            {
                                text: "Tell the professor what happened",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social, 11);
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.15);
                                        return { icon: "🎓", text: `[Rolled ${check.total}] Professor understands. You get graded individually.`, stats: "+0.15 GPA" };
                                    }
                                    state.gpa = Math.min(4.0, state.gpa + 0.05);
                                    return { icon: "😐", text: `[Rolled ${check.total}] "That's between you and your partner." Still have to finish it.`, stats: "+0.05 GPA" };
                                }
                            },
                            {
                                text: "Hunt down your partner and confront them",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social, 14);
                                    if (check.nat20) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.15);
                                        state.skills.social += 2;
                                        return { icon: "🌟", text: "[NAT 20!] They had a family emergency. They apologize and finish their part overnight.", stats: "+0.15 GPA, +2 Social" };
                                    }
                                    if (check.success) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.1);
                                        return { icon: "😤", text: `[Rolled ${check.total}] Guilt-tripped them into doing half. Team tension but it's done.`, stats: "+0.1 GPA" };
                                    }
                                    state.stress += 15;
                                    return { icon: "🙄", text: `[Rolled ${check.total}] They made excuses. You're doing it yourself anyway.`, stats: "+15 Stress" };
                                }
                            }
                        ]
                    });
                }
            } else if (roll < 0.90 && state.university.club) {
                // Club activity events
                let club = CLUBS[state.university.club];
                events.push({
                    category: "Club",
                    title: `${club.name} Event`,
                    desc: state.university.club === 'greek' ? "Philanthropy event this weekend. Attendance is mandatory." :
                          state.university.club === 'sports' ? "Big game coming up. Time to represent." :
                          state.university.club === 'academic' ? "Honor society meeting - discussing grad school prep." :
                          "Club activity this week.",
                    choices: [
                        {
                            text: "Participate actively",
                            effect: () => {
                                state.university.clubWeeks++;
                                state.happiness += club.happiness || 5;
                                state.energy -= club.energy || 10;
                                if (club.physical) state.skills.physical += 2;
                                if (club.social) state.skills.social += 2;
                                if (club.gpaBonus) state.gpa = Math.min(4.0, state.gpa + club.gpaBonus);
                                return { icon: club.icon, text: "Active member. Building memories and resume lines.", stats: `+${club.happiness || 5} Happiness` };
                            }
                        },
                        {
                            text: "Skip it this time",
                            effect: () => {
                                state.energy += 10;
                                if (state.university.club === 'greek') {
                                    state.skills.social -= 3;
                                    return { icon: "😬", text: "People noticed you weren't there. Politics.", stats: "-3 Social" };
                                }
                                return { icon: "🛋️", text: "Sometimes you need a break.", stats: "+10 Energy" };
                            }
                        }
                    ]
                });
            }
            
            return events;
        }

        function getTradeSchoolEvents() {
            let events = [];
            let roll = Math.random();
            let weekProgress = state.phaseWeek;
            
            // TRADE SELECTION (Week 1)
            if (!state.tradeSchool.trade && weekProgress < 2) {
                return [{
                    category: "Choose Your Trade",
                    title: "What Will You Master?",
                    desc: "Trade school orientation. Time to pick a career path. Each has its own rewards and risks.",
                    choices: Object.entries(TRADES).map(([key, trade]) => ({
                        text: `${trade.icon} ${trade.name} - ${trade.desc}`,
                        effect: () => {
                            state.tradeSchool.trade = key;
                            state.skills[trade.statBonus] += 5;
                            addLog(`Started ${trade.name} training`);
                            return { icon: trade.icon, text: `You're going to be a ${trade.name}. Hard work ahead.`, stats: `+5 ${trade.statBonus}` };
                        }
                    }))
                }];
            }
            
            let trade = TRADES[state.tradeSchool.trade] || TRADES.electrician;
            let certLevel = TRADE_CERT_LEVELS[state.tradeSchool.certLevel];
            
            // MENTOR ASSIGNMENT (Week 2-4)
            if (!state.tradeSchool.mentorName && weekProgress >= 2 && weekProgress < 6) {
                let mentorName = TRADE_MENTOR_NAMES[Math.floor(Math.random() * TRADE_MENTOR_NAMES.length)];
                return [{
                    category: "Apprenticeship",
                    title: "Meet Your Mentor",
                    desc: `${mentorName} has been in the trade for 30 years. Rough hands, rougher attitude. But he knows everything.`,
                    choices: [
                        {
                            text: `Learn from ${mentorName}`,
                            effect: () => {
                                state.tradeSchool.mentorName = mentorName;
                                state.tradeSchool.mentorRelationship = 40;
                                state.skills.technical += 3;
                                return { icon: "👷", text: `"Don't touch anything until I say so." ${mentorName} will teach you the RIGHT way.`, stats: "+3 Technical, Mentor gained" };
                            }
                        }
                    ]
                }];
            }
            
            // TOOL QUALITY UPGRADE OPPORTUNITY (Every 20 weeks)
            if (state.tradeSchool.toolQuality < 3 && weekProgress % 20 === 15 && weekProgress > 10) {
                let upgradeCost = state.tradeSchool.toolQuality === 1 ? 500 : 1500;
                let newLevel = state.tradeSchool.toolQuality === 1 ? "Professional" : "Premium";
                return [{
                    category: "Equipment",
                    title: "Tool Upgrade Available",
                    desc: `Your ${state.tradeSchool.toolQuality === 1 ? 'basic' : 'professional'} tools are holding you back. ${newLevel} gear would make the work easier and safer.`,
                    choices: [
                        {
                            text: `Buy ${newLevel} tools ($${upgradeCost})`,
                            condition: () => state.money >= upgradeCost,
                            effect: () => {
                                state.money -= upgradeCost;
                                state.tradeSchool.toolQuality++;
                                state.skills.technical += 5;
                                return { icon: "🧰", text: `Quality tools make quality work. ${state.tradeSchool.mentorName} approves.`, stats: `-$${upgradeCost}, +5 Technical, Better safety` };
                            }
                        },
                        {
                            text: "Make do with what you have",
                            effect: () => {
                                return { icon: "🔧", text: "A bad workman blames his tools... but good tools help.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // UNION OPPORTUNITY (Week 30+)
            if (!state.tradeSchool.unionMember && weekProgress >= 30 && roll < 0.15) {
                return [{
                    category: "Career",
                    title: "Union Recruitment",
                    desc: `The ${trade.name}s Union wants you. Better pay, job protection, but dues and politics.`,
                    choices: [
                        {
                            text: "Join the union ($50/month dues)",
                            effect: () => {
                                state.tradeSchool.unionMember = true;
                                state.weeklyExpenses += 12;
                                state.career.networkContacts += 15;
                                addLog(`Joined ${trade.name}s Union`);
                                return { icon: "✊", text: "Welcome, brother/sister. Solidarity. Better contracts, better protection.", stats: "+$12/week expenses, +15 Network, Union benefits" };
                            }
                        },
                        {
                            text: "Stay independent",
                            effect: () => {
                                state.skills.social -= 3;
                                return { icon: "🚶", text: "Not for you. Some call it stubborn. You call it freedom.", stats: "-3 Social (with union workers)" };
                            }
                        }
                    ]
                }];
            }
            
            // CERTIFICATION EXAM (At milestones)
            let examWeek = state.tradeSchool.certLevel === 0 ? 40 : 
                          state.tradeSchool.certLevel === 1 ? 65 : 
                          state.tradeSchool.certLevel === 2 ? 78 : -1;
            
            if (weekProgress === examWeek && state.tradeSchool.certLevel < 3) {
                let nextCert = TRADE_CERT_LEVELS[state.tradeSchool.certLevel + 1];
                return [{
                    category: "⭐ CERTIFICATION",
                    title: `${nextCert.name} Exam`,
                    desc: `Time to prove you've earned the ${nextCert.name} certification. Written test AND practical demonstration.`,
                    choices: [
                        {
                            text: "🎲 Take the exam (Technical check)",
                            effect: () => {
                                let dc = 12 + (state.tradeSchool.certLevel * 2);
                                let bonus = state.tradeSchool.toolQuality * 2 + (state.tradeSchool.mentorRelationship > 60 ? 3 : 0);
                                let check = rollWithModifier(state.skills.technical + bonus, dc);
                                
                                if (check.nat20) {
                                    state.tradeSchool.certLevel++;
                                    state.skills.technical += 10;
                                    state.happiness += 20;
                                    state.money += 500;
                                    addLog(`Achieved ${nextCert.name} certification with top marks`);
                                    return { icon: "🏆", text: `[NAT 20!] PERFECT SCORE! You're the best they've seen in years.`, stats: `Now ${nextCert.name}, +10 Technical, +$500 bonus` };
                                }
                                if (check.success) {
                                    state.tradeSchool.certLevel++;
                                    state.skills.technical += 5;
                                    state.happiness += 15;
                                    addLog(`Achieved ${nextCert.name} certification`);
                                    return { icon: "📜", text: `[Rolled ${check.total} vs DC ${dc}] You passed! ${nextCert.name} certified.`, stats: `Now ${nextCert.name}, +5 Technical` };
                                }
                                if (check.nat1) {
                                    state.stress += 25;
                                    state.happiness -= 20;
                                    state.tradeSchool.mentorRelationship -= 10;
                                    return { icon: "💀", text: `[NAT 1!] Complete disaster. You damaged the testing equipment.`, stats: "+25 Stress, -20 Happiness, Retry in 4 weeks" };
                                }
                                state.stress += 15;
                                return { icon: "😔", text: `[Rolled ${check.total} vs DC ${dc}] Not this time. Try again in 4 weeks.`, stats: "+15 Stress" };
                            }
                        }
                    ]
                }];
            }
            
            // JOB SITE ACCIDENT EVENT
            if (roll < 0.03 * trade.dangerLevel && weekProgress > 10) {
                let safetyBonus = state.tradeSchool.toolQuality * 3 + (state.tradeSchool.mentorRelationship > 50 ? 5 : 0);
                return [{
                    category: "⚠️ DANGER",
                    title: "Workplace Accident!",
                    desc: trade.name === "Electrician" ? "Live wire where it shouldn't be. Your hand is inches away." :
                          trade.name === "Welder" ? "Sparks catch your sleeve. Fire!" :
                          trade.name === "Plumber" ? "Pipe burst. Scalding water everywhere." :
                          trade.name === "HVAC Technician" ? "Refrigerant leak. Can't breathe." :
                          "Something went wrong. Fast.",
                    choices: [
                        {
                            text: "🎲 React fast (Physical + Safety check)",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical + safetyBonus, 14);
                                
                                if (check.nat20) {
                                    state.skills.technical += 5;
                                    state.tradeSchool.safetyIncidents++;
                                    if (state.tradeSchool.mentorName) state.tradeSchool.mentorRelationship += 10;
                                    return { icon: "⚡", text: `[NAT 20!] Superhuman reflexes! Crisis averted brilliantly.`, stats: "+5 Technical, +10 Mentor respect" };
                                }
                                if (check.success) {
                                    state.tradeSchool.safetyIncidents++;
                                    state.stress += 15;
                                    return { icon: "😅", text: `[Rolled ${check.total} vs DC 14] Close call! Heart pounding, but you're okay.`, stats: "+15 Stress" };
                                }
                                if (check.nat1) {
                                    state.health -= 30;
                                    state.tradeSchool.injuries++;
                                    state.money -= 500;
                                    state.stress += 30;
                                    addLog("Serious workplace injury");
                                    return { icon: "🏥", text: `[NAT 1!] CRITICAL INJURY! Hospital. Weeks of recovery ahead.`, stats: "-30 Health, -$500 medical, +30 Stress" };
                                }
                                state.health -= 15;
                                state.tradeSchool.injuries++;
                                state.stress += 20;
                                return { icon: "🩹", text: `[Rolled ${check.total} vs DC 14] Got hurt. Not critical, but painful.`, stats: "-15 Health, +20 Stress" };
                            }
                        }
                    ]
                }];
            }
            
            // CLIENT WORK (After becoming apprentice)
            if (state.tradeSchool.certLevel >= 1 && roll < 0.25) {
                let client = TRADE_CLIENT_TYPES[Math.floor(Math.random() * TRADE_CLIENT_TYPES.length)];
                let basePay = trade.baseHourlyPay * 40 * TRADE_CERT_LEVELS[state.tradeSchool.certLevel].hourlyMultiplier;
                let jobPay = Math.floor(basePay * client.pay);
                
                return [{
                    category: "Job",
                    title: `${client.type} Job`,
                    desc: client.type === "Emergency" ? `3 AM call. ${trade.name === 'Plumber' ? 'Flooded basement' : 'System failure'}. They're desperate.` :
                          client.type === "Industrial" ? `Big factory contract. Complex work, tight deadline.` :
                          client.type === "Commercial" ? `Office building needs work. Professional environment.` :
                          `Homeowner needs ${trade.name.toLowerCase()} work done.`,
                    choices: [
                        {
                            text: `🎲 Do the job ($${jobPay})`,
                            effect: () => {
                                let dc = client.difficulty;
                                let toolBonus = state.tradeSchool.toolQuality * 2;
                                let check = rollWithModifier(state.skills.technical + toolBonus, dc);
                                
                                state.tradeSchool.projectsCompleted++;
                                state.energy -= 20;
                                state.stress += client.stressBonus;
                                
                                if (check.nat20) {
                                    let bonus = Math.floor(jobPay * 0.5);
                                    state.money += jobPay + bonus;
                                    state.tradeSchool.clientRating = Math.min(100, state.tradeSchool.clientRating + 15);
                                    state.skills.technical += 3;
                                    state.tradeSchool.hoursLogged += 50;
                                    return { icon: "🌟", text: `[NAT 20!] PERFECT JOB! Client tips big and promises referrals.`, stats: `+$${jobPay + bonus}, +15 Rating, +3 Technical` };
                                }
                                if (check.success) {
                                    state.money += jobPay;
                                    state.tradeSchool.clientRating = Math.min(100, state.tradeSchool.clientRating + 5);
                                    state.skills.technical += 1;
                                    state.tradeSchool.hoursLogged += 40;
                                    return { icon: "✅", text: `[Rolled ${check.total} vs DC ${dc}] Job done right. Client satisfied.`, stats: `+$${jobPay}, +5 Rating` };
                                }
                                if (check.nat1) {
                                    state.tradeSchool.clientRating = Math.max(0, state.tradeSchool.clientRating - 20);
                                    state.money += Math.floor(jobPay * 0.3);
                                    state.happiness -= 15;
                                    return { icon: "😱", text: `[NAT 1!] DISASTER! Made it worse. Reputation hit.`, stats: `+$${Math.floor(jobPay * 0.3)}, -20 Rating` };
                                }
                                state.money += Math.floor(jobPay * 0.7);
                                state.tradeSchool.clientRating = Math.max(0, state.tradeSchool.clientRating - 5);
                                return { icon: "😐", text: `[Rolled ${check.total} vs DC ${dc}] Had to fix issues. Partial pay.`, stats: `+$${Math.floor(jobPay * 0.7)}, -5 Rating` };
                            }
                        },
                        {
                            text: "Pass on this one",
                            effect: () => {
                                if (client.type === "Emergency") {
                                    state.tradeSchool.clientRating = Math.max(0, state.tradeSchool.clientRating - 10);
                                    return { icon: "📵", text: "Emergency calls build reputation. Missed opportunity.", stats: "-10 Rating" };
                                }
                                return { icon: "🤷", text: "There'll be other jobs.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // MENTOR RELATIONSHIP EVENTS
            if (state.tradeSchool.mentorName && roll < 0.35) {
                let mentorEvent = Math.random();
                
                if (mentorEvent < 0.3) {
                    return [{
                        category: "Training",
                        title: `${state.tradeSchool.mentorName}'s Secret`,
                        desc: `"Come here, kid. Let me show you something they don't teach in books."`,
                        choices: [
                            {
                                text: "Watch and learn",
                                effect: () => {
                                    state.skills.technical += 4;
                                    state.tradeSchool.mentorRelationship += 8;
                                    state.tradeSchool.hoursLogged += 10;
                                    return { icon: "💡", text: `${state.tradeSchool.mentorName} shares a trick from 30 years in the trade.`, stats: "+4 Technical, +8 Mentor bond" };
                                }
                            }
                        ]
                    }];
                } else if (mentorEvent < 0.5 && state.tradeSchool.mentorRelationship > 60) {
                    return [{
                        category: "Opportunity",
                        title: "Moonlight Job",
                        desc: `${state.tradeSchool.mentorName}: "I got a side job this weekend. Good money. You in?"`,
                        choices: [
                            {
                                text: "Let's do it ($300)",
                                effect: () => {
                                    state.money += 300;
                                    state.energy -= 25;
                                    state.skills.technical += 3;
                                    state.tradeSchool.hoursLogged += 20;
                                    state.tradeSchool.mentorRelationship += 5;
                                    return { icon: "💰", text: "Working alongside the master. Learning and earning.", stats: "+$300, +3 Technical, +5 Mentor bond" };
                                }
                            },
                            {
                                text: "Need the rest",
                                effect: () => {
                                    state.tradeSchool.mentorRelationship -= 5;
                                    state.energy += 15;
                                    return { icon: "😴", text: `${state.tradeSchool.mentorName} shrugs. "Your loss, kid."`, stats: "-5 Mentor bond, +15 Energy" };
                                }
                            }
                        ]
                    }];
                } else if (mentorEvent < 0.7) {
                    return [{
                        category: "Training",
                        title: "Harsh Feedback",
                        desc: `${state.tradeSchool.mentorName} examines your work. Shakes his head. "This is garbage. Do it again."`,
                        choices: [
                            {
                                text: "Accept it and redo",
                                effect: () => {
                                    state.skills.technical += 2;
                                    state.energy -= 15;
                                    state.tradeSchool.mentorRelationship += 5;
                                    return { icon: "😤", text: "Swallow your pride. He's right. Better this time.", stats: "+2 Technical, +5 Mentor bond" };
                                }
                            },
                            {
                                text: "Push back",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social, 14);
                                    if (check.success) {
                                        state.tradeSchool.mentorRelationship += 3;
                                        return { icon: "🤝", text: `[Rolled ${check.total}] You defend your work. ${state.tradeSchool.mentorName} respects the backbone.`, stats: "+3 Mentor bond" };
                                    }
                                    state.tradeSchool.mentorRelationship -= 15;
                                    state.stress += 10;
                                    return { icon: "😠", text: `[Rolled ${check.total}] "Don't talk back to me." Tension.`, stats: "-15 Mentor bond, +10 Stress" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // REGULAR TRAINING EVENTS
            if (roll < 0.2) {
                events.push({
                    category: "Training",
                    title: "Hands-On Test",
                    desc: `Practical exam. ${state.tradeSchool.mentorName || 'The instructor'} is evaluating.`,
                    choices: [
                        {
                            text: "🎲 Focus and execute",
                            effect: () => {
                                let check = rollWithModifier(state.skills.technical, 11);
                                state.energy -= 15;
                                state.tradeSchool.hoursLogged += 8;
                                
                                if (check.nat20) {
                                    state.skills.technical += 6;
                                    return { icon: "⭐", text: "[NAT 20!] Flawless execution. Even the old-timers are impressed.", stats: "+6 Technical" };
                                }
                                if (check.success) {
                                    state.skills.technical += 4;
                                    return { icon: "✅", text: `[Rolled ${check.total}] Clean work. Passing grade.`, stats: "+4 Technical" };
                                }
                                state.skills.technical += 1;
                                return { icon: "📝", text: `[Rolled ${check.total}] Some mistakes. Notes for improvement.`, stats: "+1 Technical" };
                            }
                        },
                        {
                            text: "Ask mentor for help",
                            condition: () => state.tradeSchool.mentorName && state.tradeSchool.mentorRelationship > 30,
                            effect: () => {
                                state.skills.technical += 4;
                                state.tradeSchool.mentorRelationship += 3;
                                return { icon: "👷", text: `${state.tradeSchool.mentorName} walks you through it.`, stats: "+4 Technical, +3 Mentor bond" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.35) {
                events.push({
                    category: "Opportunity",
                    title: "Side Job Offer",
                    desc: "A local contractor needs help this weekend. Cash under the table.",
                    choices: [
                        {
                            text: "Take the gig ($200)",
                            effect: () => {
                                state.money += 200;
                                state.energy -= 25;
                                state.skills.technical += 3;
                                state.skills.physical += 2;
                                state.tradeSchool.hoursLogged += 16;
                                return { icon: "💰", text: "Hard work but good money. Real experience.", stats: "+$200, +3 Technical, +2 Physical" };
                            }
                        },
                        {
                            text: "Rest up instead",
                            effect: () => {
                                state.energy += 20;
                                state.happiness += 5;
                                return { icon: "😴", text: "Sometimes you need a weekend off.", stats: "+20 Energy, +5 Happiness" };
                            }
                        }
                    ]
                });
            }
            
            return events;
        }

        function getMilitaryTrainingEvents() {
            let events = [];
            let week = state.phaseWeek;
            
            // Week 0: Arrival
            if (week === 0) {
                return [{
                    category: "Boot Camp",
                    title: "Welcome to Hell",
                    desc: "The bus stops. A drill sergeant boards, screaming. \"GET OFF MY BUS! MOVE MOVE MOVE!\" A recruit next to you is frozen in terror.",
                    choices: [
                        {
                            text: "Sprint off first - every man for himself",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical, 10);
                                state.stress += 20;
                                state.energy -= 25;
                                if (check.success) {
                                    state.skills.physical += 3;
                                    state.military.combatXP += 2;
                                    return { icon: "🏃", text: `[Rolled ${check.total} vs DC 10] First off the bus. The drill sergeant nods. "At least ONE of you isn't useless."`, stats: "+3 Physical, +2 XP" };
                                }
                                state.happiness -= 5;
                                return { icon: "😰", text: `[Rolled ${check.total}] You tried but stumbled. "PUSHUPS! NOW!"`, stats: "-5 Happiness" };
                            }
                        },
                        {
                            text: "Grab the frozen recruit and drag them with you",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical + state.skills.social, 12);
                                state.stress += 25;
                                state.energy -= 30;
                                if (check.success) {
                                    state.skills.social += 3;
                                    state.military.squadMorale += 10;
                                    return { icon: "🤝", text: `[Rolled ${check.total} vs DC 12] You pull them along. Later, they find you: "Thanks. I'm ${BUDDY_NAMES[Math.floor(Math.random() * BUDDY_NAMES.length)]}." You've made a friend.`, stats: "+3 Social, +Squad Morale" };
                                }
                                state.happiness -= 10;
                                return { icon: "😤", text: `[Rolled ${check.total}] You both end up last. Double punishment. But they remember you tried.`, stats: "-10 Happiness, But earned respect" };
                            }
                        },
                        {
                            text: "Stay calm, move efficiently - don't panic",
                            effect: () => {
                                state.stress += 15;
                                state.energy -= 20;
                                state.skills.technical += 2;
                                return { icon: "🧠", text: "While others scramble, you move with purpose. The drill sergeant's eyes track you. Noted.", stats: "+2 Technical, Less stress than panicking" };
                            }
                        }
                    ]
                }];
            }
            
            // Week 1: Red Phase - Basic Discipline
            if (week === 1) {
                state.military.buddyName = BUDDY_NAMES[Math.floor(Math.random() * BUDDY_NAMES.length)];
                return [{
                    category: "Red Phase",
                    title: "Breaking You Down",
                    desc: `5 AM wake-ups. Inspections. PT until you puke. ${state.military.buddyName} is in your platoon - you've been helping each other. The drill sergeant announces a 5-mile run. Your body is already broken.`,
                    choices: [
                        {
                            text: "Push yourself to the absolute limit",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical, 13);
                                state.energy -= 35;
                                state.health -= 5;
                                if (check.success) {
                                    state.skills.physical += 6;
                                    state.military.combatXP += 5;
                                    return { icon: "🏃", text: `[Rolled ${check.total} vs DC 13] You finish in the top 10. The pain was worth it. Drill sergeant knows your name now.`, stats: "+6 Physical, +5 XP, -5 Health" };
                                }
                                state.stress += 20;
                                return { icon: "🤮", text: `[Rolled ${check.total}] You push too hard, vomit, keep running. Finish mid-pack. Body is screaming.`, stats: "+3 Physical, +20 Stress, -5 Health" };
                            }
                        },
                        {
                            text: "Pace yourself - survive, don't shine",
                            effect: () => {
                                state.skills.physical += 4;
                                state.stress += 10;
                                state.energy -= 20;
                                return { icon: "🏃‍♂️", text: `Steady pace. You finish middle of the pack. ${state.military.buddyName} matches your stride. "Smart."`, stats: "+4 Physical, +10 Stress" };
                            }
                        },
                        {
                            text: "Help a struggling recruit keep up",
                            effect: () => {
                                state.skills.physical += 3;
                                state.skills.social += 3;
                                state.energy -= 30;
                                state.military.squadMorale += 15;
                                return { icon: "🤝", text: "You grab a struggling recruit's arm. \"We finish together.\" The platoon notices. Leadership material.", stats: "+3 Physical, +3 Social, +Squad Morale" };
                            }
                        },
                        {
                            text: "Fake a minor injury to get out of it",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 15);
                                if (check.success) {
                                    state.energy += 10;
                                    state.stress -= 5;
                                    return { icon: "🤕", text: `[Rolled ${check.total} vs DC 15] Medic buys it. You rest while others run. But you know you cheated.`, stats: "+10 Energy, -5 Stress, No gains" };
                                }
                                state.stress += 25;
                                state.military.combatXP -= 3;
                                return { icon: "😠", text: `[Rolled ${check.total}] "MALINGERER! You think I'm stupid?!" Extra PT for a week. Everyone knows.`, stats: "+25 Stress, -3 XP, Reputation damaged" };
                            }
                        }
                    ]
                }];
            }
            
            // Week 2-3: White Phase - Rifle Training
            if (week >= 2 && week <= 3) {
                let intelBonus = getIntelligenceDCBonus();
                return [{
                    category: "White Phase",
                    title: "Rifle Qualification",
                    desc: `Week ${week + 1}. You're on the range. The M4 is heavy. 40 targets, 40 rounds. How do you approach it?`,
                    choices: [
                        {
                            text: "Stay up late practicing dry-fire drills",
                            effect: () => {
                                let dc = Math.max(8, 11 - intelBonus);
                                let check = rollWithModifier(state.skills.technical + state.skills.physical, dc);
                                state.skills.technical += 4;
                                state.energy -= 20;
                                
                                if (check.nat20) {
                                    state.military.medals.push("Expert Marksmanship");
                                    state.skills.technical += 4;
                                    return { icon: "🎯", text: `[NAT 20!] EXPERT! 39/40. Your preparation paid off. Badge earned.`, stats: "+8 Technical, Expert Badge!" };
                                }
                                if (check.success) {
                                    return { icon: "🎯", text: `[Rolled ${check.total} vs DC ${dc}] Qualified with a solid score. The extra practice showed.`, stats: "+4 Technical" };
                                }
                                state.stress += 10;
                                return { icon: "😤", text: `[Rolled ${check.total}] Close but not enough. At least you learned something.`, stats: "+4 Technical, +10 Stress" };
                            }
                        },
                        {
                            text: "Trust your natural ability - get sleep instead",
                            effect: () => {
                                let dc = 13;
                                let check = rollWithModifier(state.skills.physical, dc);
                                state.energy += 10;
                                
                                if (check.nat20) {
                                    state.military.medals.push("Expert Marksmanship");
                                    state.skills.technical += 5;
                                    return { icon: "🎯", text: `[NAT 20!] Natural talent! You're a born shooter. Expert qualification.`, stats: "+5 Technical, Expert Badge!" };
                                }
                                if (check.success) {
                                    state.skills.technical += 2;
                                    return { icon: "🎯", text: `[Rolled ${check.total} vs DC ${dc}] Qualified. Could've been better with practice, but you passed.`, stats: "+2 Technical, Well rested" };
                                }
                                state.stress += 20;
                                return { icon: "❌", text: `[Rolled ${check.total}] Failed. "Should've practiced, recruit!" Remedial training.`, stats: "+20 Stress, Must retry" };
                            }
                        },
                        {
                            text: "Ask the range instructor for extra coaching",
                            effect: () => {
                                let dc = Math.max(7, 10 - intelBonus);
                                let check = rollWithModifier(state.skills.technical + state.skills.social, dc);
                                state.skills.technical += 3;
                                state.skills.social += 1;
                                
                                if (check.success) {
                                    state.military.combatXP += 3;
                                    return { icon: "🎯", text: `[Rolled ${check.total} vs DC ${dc}] The instructor's tips clicked. Solid qualification. "Good initiative, recruit."`, stats: "+3 Technical, +1 Social, +3 XP" };
                                }
                                return { icon: "😐", text: `[Rolled ${check.total}] The coaching helped but not enough. Barely qualified.`, stats: "+3 Technical, +1 Social" };
                            }
                        }
                    ]
                }];
            }
            
            // Week 4-5: Blue Phase - Field Training
            if (week >= 4 && week <= 5) {
                let roll = Math.random();
                
                if (roll < 0.4) {
                    return [{
                        category: "Blue Phase",
                        title: "Night Land Navigation",
                        desc: "2 AM. Just a compass, a map, and the dark. Find 5 checkpoints before dawn or fail.",
                        choices: [
                            {
                                text: "Trust your training",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.technical, 13);
                                    state.energy -= 20;
                                    
                                    if (check.nat1) {
                                        state.health -= 10;
                                        state.stress += 20;
                                        return { icon: "🌲", text: `[NAT 1!] Completely lost. Fell into a ravine. Medics had to find you. Humiliating.`, stats: "-10 Health, +20 Stress" };
                                    }
                                    if (check.success) {
                                        state.skills.technical += 4;
                                        return { icon: "🧭", text: `[Rolled ${check.total} vs DC 13] All checkpoints found. You emerge from the woods as the sun rises.`, stats: "+4 Technical" };
                                    }
                                    state.stress += 10;
                                    return { icon: "🌙", text: `[Rolled ${check.total} vs DC 13] Only found 3 checkpoints. Have to redo it next week.`, stats: "+10 Stress" };
                                }
                            },
                            {
                                text: "Follow another recruit",
                                effect: () => {
                                    if (Math.random() > 0.5) {
                                        state.skills.technical += 2;
                                        return { icon: "👥", text: "They knew what they were doing. You both passed.", stats: "+2 Technical" };
                                    }
                                    state.stress += 20;
                                    state.skills.social -= 5;
                                    return { icon: "😬", text: "They were just as lost. Both of you failed. Drill sergeant is FURIOUS.", stats: "+20 Stress, -5 Social" };
                                }
                            }
                        ]
                    }];
                } else {
                    return [{
                        category: "Blue Phase",
                        title: "The Gas Chamber",
                        desc: "They line you up outside a small building. CS gas inside. \"To build confidence in your mask.\" Everyone dreads this.",
                        choices: [
                            {
                                text: "Focus on your breathing, stay calm",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.physical, 11);
                                    
                                    if (check.success) {
                                        state.skills.physical += 3;
                                        state.happiness += 5;
                                        return { icon: "😷", text: `[Rolled ${check.total} vs DC 11] Mask sealed. You watch others panic. You're fine. Confidence surges.`, stats: "+3 Physical, +5 Happiness" };
                                    }
                                    state.health -= 5;
                                    state.stress += 15;
                                    return { icon: "🤮", text: `[Rolled ${check.total}] Mask leaked. Lungs on fire. Snot everywhere. But you survived.`, stats: "-5 Health, +15 Stress" };
                                }
                            },
                            {
                                text: "Help a panicking recruit adjust their mask",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.social + state.skills.technical, 13);
                                    state.military.squadMorale += 10;
                                    
                                    if (check.success) {
                                        state.skills.social += 3;
                                        state.health -= 3; // Some exposure while helping
                                        return { icon: "🤝", text: `[Rolled ${check.total} vs DC 13] You fixed their seal. Drill sergeant saw. "That's what soldiers do."`, stats: "+3 Social, -3 Health, +Squad Morale" };
                                    }
                                    state.health -= 10;
                                    state.stress += 10;
                                    return { icon: "😵", text: `[Rolled ${check.total}] Your own mask came loose helping them. Both of you suffered. But they remember.`, stats: "-10 Health, +10 Stress, +Squad Morale" };
                                }
                            },
                            {
                                text: "Volunteer to go first and get it over with",
                                effect: () => {
                                    state.stress -= 10; // Less anticipation anxiety
                                    state.skills.physical += 2;
                                    state.military.combatXP += 3;
                                    if (Math.random() > 0.4) {
                                        state.health -= 3;
                                        return { icon: "💪", text: "First in, first out. It burned, but the waiting was worse. Drill sergeant notes your initiative.", stats: "+2 Physical, +3 XP, -3 Health" };
                                    }
                                    state.health -= 8;
                                    return { icon: "🤮", text: "First in. Your mask leaked. But at least you weren't dreading it all day.", stats: "+2 Physical, +3 XP, -8 Health" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // Week 6-7: Final Phase
            if (week >= 6 && week <= 7) {
                return [{
                    category: "Final Phase",
                    title: "The Forge",
                    desc: `48-hour field exercise. Everything you've learned. Simulated combat, minimal sleep, full gear. ${state.military.buddyName} is by your side. This is the final test.`,
                    choices: [
                        {
                            text: "Lead from the front - push the pace",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical + state.skills.social, 15);
                                state.energy = 5;
                                state.skills.physical += 4;
                                
                                if (check.nat20) {
                                    state.military.combatXP += 15;
                                    state.happiness += 25;
                                    state.stress = Math.max(0, state.stress - 25);
                                    return { icon: "🌟", text: `[NAT 20!] You became the rally point. Others followed your lead. Drill sergeant pulls you aside: "Leadership material."`, stats: "+4 Physical, +15 XP, Distinguished Graduate!" };
                                }
                                if (check.success) {
                                    state.military.combatXP += 8;
                                    state.happiness += 15;
                                    return { icon: "⭐", text: `[Rolled ${check.total} vs DC 15] You pushed hard and others rose to match. Strong finish.`, stats: "+4 Physical, +8 XP, +15 Happy" };
                                }
                                state.health -= 10;
                                state.stress += 15;
                                return { icon: "😤", text: `[Rolled ${check.total}] You pushed too hard, hit the wall. Finished, but barely. Lesson learned.`, stats: "+4 Physical, -10 Health" };
                            }
                        },
                        {
                            text: "Stay with your buddy - finish together",
                            effect: () => {
                                let check = rollWithModifier(state.skills.physical, 12);
                                state.energy = 15;
                                state.skills.physical += 3;
                                state.skills.social += 3;
                                state.military.squadMorale += 15;
                                
                                if (check.success) {
                                    state.happiness += 20;
                                    return { icon: "🤝", text: `[Rolled ${check.total} vs DC 12] You and ${state.military.buddyName} cross the finish line together. "We made it." Battle buddies for life.`, stats: "+3 Physical, +3 Social, +Squad Bond" };
                                }
                                state.stress += 10;
                                return { icon: "💪", text: `[Rolled ${check.total}] Tough, but you had each other. ${state.military.buddyName} carried you the last mile. You'll return the favor someday.`, stats: "+3 Physical, +3 Social" };
                            }
                        },
                        {
                            text: "Conserve energy - smart pace, guaranteed finish",
                            effect: () => {
                                state.energy = 25;
                                state.skills.physical += 2;
                                state.skills.technical += 2;
                                state.military.combatXP += 3;
                                
                                return { icon: "🎯", text: "You paced yourself perfectly. Not the fastest, not the slowest. Efficient. Professional.", stats: "+2 Physical, +2 Technical, +3 XP, Energy preserved" };
                            }
                        },
                        {
                            text: "Help struggling recruits - even if it costs you",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social + state.skills.physical, 14);
                                state.energy = 5;
                                state.skills.social += 4;
                                state.military.squadMorale += 20;
                                
                                if (check.success) {
                                    state.military.combatXP += 10;
                                    state.happiness += 15;
                                    return { icon: "🦸", text: `[Rolled ${check.total} vs DC 14] You carried packs, gave water, kept morale up. Everyone finished. Drill sergeant: "THAT is a soldier."`, stats: "+4 Social, +10 XP, Squad Hero" };
                                }
                                state.health -= 8;
                                state.stress += 10;
                                return { icon: "😫", text: `[Rolled ${check.total}] You gave everything to help others. Barely finished yourself. But they'll never forget.`, stats: "+4 Social, -8 Health, Squad remembers" };
                            }
                        }
                    ]
                }];
            }
            
            // Week 8-9: MOS Selection and Graduation prep
            if (week === 8) {
                let intel = state.characterTraits?.intelligence || 5;
                let physical = state.skills?.physical || 40;
                let height = state.characterTraits?.height || 5;
                let build = state.characterTraits?.build || 5;
                
                // Helper to check physical size requirements (height for males, build for females)
                function checkSizeReq(mos) {
                    if (!mos.reqHeight) return true;
                    if (state.gender === 'female') {
                        // For females, large build (9+) = too big for armor
                        if (mos.reqHeight.max && build >= 9) return false;
                    } else {
                        if (mos.reqHeight.max && height > mos.reqHeight.max) return false;
                        if (mos.reqHeight.min && height < mos.reqHeight.min) return false;
                    }
                    return true;
                }
                
                // Filter MOS options based on requirements
                let availableMOS = Object.entries(MOS_OPTIONS).filter(([key, mos]) => {
                    if (mos.reqPhysical && physical < mos.reqPhysical) return false;
                    if (mos.reqIntel && intel < mos.reqIntel) return false;
                    if (!checkSizeReq(mos)) return false;
                    return true;
                });
                
                // Always have at least logistics as fallback
                if (availableMOS.length === 0) {
                    availableMOS = [['logistics', MOS_OPTIONS.logistics]];
                }
                
                // Build description based on what's locked
                let lockedMOS = Object.entries(MOS_OPTIONS).filter(([key, mos]) => {
                    if (mos.reqPhysical && physical < mos.reqPhysical) return true;
                    if (mos.reqIntel && intel < mos.reqIntel) return true;
                    if (!checkSizeReq(mos)) return true;
                    return false;
                });
                
                let desc = "You've proven yourself. Now choose your MOS - your job for the next 3 years.";
                if (lockedMOS.length > 0) {
                    let lockedNames = lockedMOS.map(([k, m]) => m.name.split(' ')[0]).slice(0, 3).join(', ');
                    desc += ` Some specialties (${lockedNames}${lockedMOS.length > 3 ? '...' : ''}) aren't available based on your qualifications.`;
                }
                if (availableMOS.some(([k]) => k === 'special_ops')) {
                    desc += " Your exceptional abilities have opened the Special Forces pipeline.";
                }
                
                return [{
                    category: "Final Week",
                    title: "Choose Your Path",
                    desc: desc,
                    choices: availableMOS.map(([key, mos]) => ({
                        text: `${mos.icon} ${mos.name} - ${mos.desc}`,
                        effect: () => {
                            state.military.mos = key;
                            state.military.rank = 1; // Private
                            let skillBonus = key === 'special_ops' ? 15 : 10;
                            state.skills[mos.statBonus] += skillBonus;
                            if (key === 'special_ops') {
                                state.military.combatXP += 10;
                                return { icon: mos.icon, text: `You're selected for Special Forces training. The hardest path. The most elite.`, stats: `+${skillBonus} ${mos.statBonus}, +10 XP, SF Candidate` };
                            }
                            return { icon: mos.icon, text: `You're now ${mos.name}. ${mos.desc}. This defines your service.`, stats: `+${skillBonus} ${mos.statBonus.charAt(0).toUpperCase() + mos.statBonus.slice(1)}, Now: Private (PVT)` };
                        }
                    }))
                }];
            }
            
            // Default boot camp week
            return [{
                category: "Boot Camp",
                title: `Week ${week + 1} Training`,
                desc: "PT, drills, classes. The grind continues. Your body adapts. Your mind sharpens.",
                choices: [
                    {
                        text: "Give it 100%",
                        effect: () => {
                            state.skills.physical += 2;
                            state.skills.technical += 1;
                            state.energy -= 20;
                            return { icon: "💪", text: "Another week down. Getting stronger.", stats: "+2 Physical, +1 Technical" };
                        }
                    },
                    {
                        text: "Pace yourself",
                        effect: () => {
                            state.skills.physical += 1;
                            state.energy -= 10;
                            state.stress -= 5;
                            return { icon: "🎖️", text: "Conserving energy. Smart.", stats: "+1 Physical, -5 Stress" };
                        }
                    }
                ]
            }];
        }

        function getMilitaryServiceEvents() {
            let events = [];
            let mos = MOS_OPTIONS[state.military.mos] || MOS_OPTIONS.infantry;
            let rank = getMilitaryRank();
            let week = state.phaseWeek;
            
            // Check for deployment cycles (deploy every ~26 weeks for 12 weeks)
            let deploymentCycle = Math.floor(week / 26);
            let weekInCycle = week % 26;
            
            // Start deployment - give player agency
            if (weekInCycle === 0 && deploymentCycle > 0 && !state.military.deployed) {
                let hasPartner = state.hasPartner && state.partnerName;
                let volunteerAvailable = !state.military.lastVolunteerWeek || (week - state.military.lastVolunteerWeek) > 26;
                
                return [{
                    category: "Orders",
                    title: "Deployment Orders",
                    desc: `${rank.abbr}, the orders are read. Your unit is slated for deployment.${hasPartner ? ` ${state.partnerName}'s face goes pale.` : ''} You have 48 hours.`,
                    choices: [
                        {
                            text: "Accept orders - do your duty",
                            effect: () => {
                                state.military.deployed = true;
                                state.military.deploymentWeek = 0;
                                state.stress += 20;
                                state.money += 200;
                                if (hasPartner) state.partnerStats.supportiveness -= 5;
                                addLog("Deployed overseas");
                                return { icon: "✈️", text: `Deployment #${deploymentCycle}. The plane lifts off. Home shrinks below.`, stats: "+$200 bonus, +20 Stress" };
                            }
                        },
                        {
                            text: "Volunteer eagerly - lead from the front",
                            condition: () => volunteerAvailable,
                            effect: () => {
                                state.military.deployed = true;
                                state.military.deploymentWeek = 0;
                                state.stress += 15;
                                state.money += 350; // Extra volunteer bonus
                                state.military.combatXP += 5;
                                state.military.lastVolunteerWeek = week;
                                if (hasPartner) state.partnerStats.supportiveness -= 10;
                                addLog("Volunteered for deployment");
                                return { icon: "🦅", text: `"I'll go." NCOs notice the enthusiasm. Better assignments, better pay.${hasPartner ? ` ${state.partnerName} says nothing.` : ''}`, stats: "+$350 bonus, +5 XP, +Leadership rep" };
                            }
                        },
                        {
                            text: "Request deferment - personal reasons",
                            condition: () => hasPartner || state.characterTraits?.familyWealth <= 3,
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 14);
                                
                                if (check.success) {
                                    state.military.combatXP -= 5;
                                    state.stress -= 10;
                                    if (hasPartner) state.partnerStats.supportiveness += 15;
                                    return { icon: "📋", text: `[Rolled ${check.total} vs DC 14] Request approved. You stay stateside this rotation. Some look at you differently now.`, stats: "Deployment deferred, -5 XP, Reputation cost" };
                                }
                                state.military.deployed = true;
                                state.military.deploymentWeek = 0;
                                state.stress += 30;
                                state.money += 200;
                                return { icon: "❌", text: `[Rolled ${check.total}] Request denied. "We need bodies, ${rank.abbr}." You're going anyway, and now they're watching you.`, stats: "+$200, +30 Stress, Under scrutiny" };
                            }
                        },
                        {
                            text: "Talk to the chaplain first",
                            effect: () => {
                                state.stress -= 5;
                                state.military.deployed = true;
                                state.military.deploymentWeek = 0;
                                state.money += 200;
                                state.happiness += 5;
                                return { icon: "🙏", text: "An hour with the chaplain. Whatever your beliefs, the conversation helps. You're ready.", stats: "+$200, -5 Stress, +5 Happy" };
                            }
                        }
                    ]
                }];
            }
            
            // During deployment
            if (state.military.deployed) {
                state.military.deploymentWeek++;
                
                // End deployment after 12 weeks
                if (state.military.deploymentWeek >= 12) {
                    let hasPartner = state.hasPartner && state.partnerName;
                    let lostBuddy = state.military.buddyName && !state.military.buddyAlive;
                    let wasWounded = state.military.wounded;
                    
                    let descText = `12 weeks. ${state.military.missionsCompleted} missions. `;
                    if (lostBuddy) descText += `You lost ${state.military.buddyName}. `;
                    if (wasWounded) descText += `You carry new scars. `;
                    descText += `The plane touches down. How do you handle coming home?`;
                    
                    return [{
                        category: "Homecoming",
                        title: "Coming Home",
                        desc: descText,
                        choices: [
                            {
                                text: "Celebrate with the squad - you earned it",
                                effect: () => {
                                    state.military.deployed = false;
                                    state.military.deploymentWeek = 0;
                                    state.happiness += 35;
                                    state.stress -= 15;
                                    state.money -= 200;
                                    state.military.squadMorale += 15;
                                    state.skills.social += 2;
                                    
                                    if (state.military.combatXP >= 50 && state.military.rank < 5) {
                                        state.military.rank++;
                                        state.military.combatXP = 0;
                                        let newRank = getMilitaryRank();
                                        return { icon: "🎉", text: `Party with the unit. Stories, drinks, brotherhood. Oh - and you made ${newRank.name}.`, stats: "-$200, +35 Happy, PROMOTED!" };
                                    }
                                    
                                    return { icon: "🎉", text: "Bars, stories, laughing until it hurts. These are your people.", stats: "-$200, +35 Happy, +Squad Bond" };
                                }
                            },
                            {
                                text: hasPartner ? `Go straight to ${state.partnerName}` : "Take leave - see family",
                                effect: () => {
                                    state.military.deployed = false;
                                    state.military.deploymentWeek = 0;
                                    state.happiness += 30;
                                    state.stress -= 25;
                                    
                                    if (hasPartner) {
                                        state.partnerStats.supportiveness += 20;
                                        state.neglect.relationship = 0;
                                    }
                                    
                                    if (state.military.combatXP >= 50 && state.military.rank < 5) {
                                        state.military.rank++;
                                        state.military.combatXP = 0;
                                        let newRank = getMilitaryRank();
                                        return { icon: "💕", text: `${hasPartner ? state.partnerName + " is waiting." : "Family embraces you."} Best feeling. Also: ${newRank.name} now.`, stats: "-25 Stress, PROMOTED!" };
                                    }
                                    
                                    return { icon: "💕", text: hasPartner ? `${state.partnerName} holds you and doesn't let go. You're home.` : "Family. Real food. Your own bed. Home.", stats: "+30 Happy, -25 Stress" };
                                }
                            },
                            {
                                text: lostBuddy || wasWounded ? "Seek counseling - talk to someone" : "Decompress alone - need space",
                                effect: () => {
                                    state.military.deployed = false;
                                    state.military.deploymentWeek = 0;
                                    
                                    if (lostBuddy || wasWounded) {
                                        state.stress -= 30;
                                        state.happiness += 15;
                                        state.health += 5;
                                        return { icon: "🧠", text: "The counselor doesn't judge. They've heard it all. Talking helps more than you expected.", stats: "-30 Stress, +15 Happy, Processing trauma" };
                                    }
                                    
                                    state.happiness += 20;
                                    state.stress -= 10;
                                    state.energy += 30;
                                    return { icon: "🏠", text: "Quiet. Space. Time to process. The silence feels strange after months of chaos.", stats: "+20 Happy, +30 Energy" };
                                }
                            },
                            {
                                text: "Volunteer for another deployment immediately",
                                effect: () => {
                                    state.military.deployed = false;
                                    state.military.deploymentWeek = 0;
                                    state.military.combatXP += 10;
                                    state.stress += 10;
                                    
                                    if (hasPartner) {
                                        state.partnerStats.supportiveness -= 25;
                                    }
                                    
                                    if (state.military.combatXP >= 50 && state.military.rank < 5) {
                                        state.military.rank++;
                                        state.military.combatXP = 0;
                                        let newRank = getMilitaryRank();
                                        return { icon: "🦅", text: `"Send me back." Command respects the commitment. Promoted to ${newRank.name}. ${hasPartner ? state.partnerName + " is devastated." : ""}`, stats: "+10 XP, PROMOTED, Fast-tracked" };
                                    }
                                    
                                    return { icon: "🦅", text: `"I'll go again." Some call it brave. Some call it running.${hasPartner ? " " + state.partnerName + " calls it abandonment." : ""}`, stats: "+10 XP, +10 Stress" };
                                }
                            }
                        ]
                    }];
                }
                
                // Combat mission chance based on MOS
                let combatRoll = Math.random();
                
                if (combatRoll < mos.combatChance) {
                    return [getMissionEvent()];
                } else {
                    return [getBaseEvent()];
                }
            }
            
            // Garrison duty (not deployed)
            let roll = Math.random();
            
            // RE-ENLISTMENT DECISION (near end of contract)
            if (week >= 140 && week <= 145 && !state.military.reEnlistmentOffered) {
                state.military.reEnlistmentOffered = true;
                let hasPartner = state.hasPartner && state.partnerName;
                let bonus = 5000 + (state.military.rank * 2000);
                
                return [{
                    category: "⚖️ Career Decision",
                    title: "Re-Enlistment Decision",
                    desc: `Your contract is up in ${156 - week} weeks. The Army wants you back. $${bonus.toLocaleString()} signing bonus on the table.${hasPartner ? ` ${state.partnerName} has opinions about this.` : ''}`,
                    choices: [
                        {
                            text: "Re-enlist - this is my life now",
                            effect: () => {
                                state.phaseTarget += 156; // Another 3 years
                                state.money += bonus;
                                state.military.combatXP += 10;
                                state.happiness += 10;
                                if (hasPartner) state.partnerStats.supportiveness -= 15;
                                addLog("Re-enlisted in the Army");
                                return { icon: "🦅", text: `Signed for another 3 years. The bonus hits your account. ${hasPartner ? state.partnerName + " sighs but supports you." : "No regrets."}`, stats: `+$${bonus.toLocaleString()}, +10 XP` };
                            }
                        },
                        {
                            text: "Take a bigger bonus - 6 year commitment",
                            effect: () => {
                                let bigBonus = bonus * 2.5;
                                state.phaseTarget += 312; // 6 years
                                state.money += bigBonus;
                                state.military.combatXP += 20;
                                if (hasPartner) state.partnerStats.supportiveness -= 30;
                                addLog("Re-enlisted for 6 years");
                                return { icon: "💰", text: `Go big. $${bigBonus.toLocaleString()} bonus. Six more years. ${hasPartner ? state.partnerName + " is NOT happy." : "Long road ahead."}`, stats: `+$${bigBonus.toLocaleString()}, +20 XP` };
                            }
                        },
                        {
                            text: "Get out - time for civilian life",
                            effect: () => {
                                // Will transition to job hunting when contract ends
                                state.military.gettingOut = true;
                                if (hasPartner) state.partnerStats.supportiveness += 20;
                                state.stress -= 10;
                                return { icon: "🚪", text: `Decision made. When the contract ends, you're out. ${hasPartner ? state.partnerName + " is relieved." : "New chapter ahead."}`, stats: "-10 Stress, Transitioning soon" };
                            }
                        },
                        {
                            text: "Ask for time to think about it",
                            effect: () => {
                                state.military.reEnlistmentOffered = false; // Will ask again
                                state.stress += 5;
                                return { icon: "🤔", text: "You have a few weeks. The recruiter will be back.", stats: "+5 Stress, Decision delayed" };
                            }
                        }
                    ]
                }];
            }
            
            // SPECIALTY SCHOOL OPPORTUNITY (if performing well)
            if (roll < 0.08 && state.military.rank >= 2 && state.military.combatXP >= 40 && !state.military.specialtySchool) {
                let schools = [
                    { name: "Airborne School", icon: "🪂", stat: "physical", dc: 14, bonus: "Airborne qualified, +$50/week jump pay" },
                    { name: "Ranger School", icon: "⚔️", stat: "physical", dc: 17, bonus: "Ranger Tab, elite status" },
                    { name: "Sniper School", icon: "🎯", stat: "technical", dc: 16, bonus: "Scout Sniper qualified" },
                    { name: "Leadership Course", icon: "📋", stat: "social", dc: 13, bonus: "Fast track to NCO" }
                ];
                let school = schools[Math.floor(Math.random() * schools.length)];
                
                return [{
                    category: "🎓 Opportunity",
                    title: `${school.name} Slot Available`,
                    desc: `A slot opened up for ${school.name}. Tough course, but it'll advance your career. Do you want it?`,
                    choices: [
                        {
                            text: `Accept the challenge`,
                            effect: () => {
                                let check = rollWithModifier(state.skills[school.stat], school.dc);
                                state.energy -= 30;
                                
                                if (check.nat20) {
                                    state.military.specialtySchool = school.name;
                                    state.military.combatXP += 25;
                                    state.skills[school.stat] += 10;
                                    state.military.medals.push(school.name + " Graduate");
                                    return { icon: "🌟", text: `[NAT 20!] Honor Graduate! Top of your class at ${school.name}. ${school.bonus}.`, stats: `+25 XP, +10 ${school.stat}, Elite status!` };
                                }
                                if (check.success) {
                                    state.military.specialtySchool = school.name;
                                    state.military.combatXP += 15;
                                    state.skills[school.stat] += 5;
                                    return { icon: "✓", text: `[Rolled ${check.total} vs DC ${school.dc}] Graduated ${school.name}. ${school.bonus}.`, stats: `+15 XP, +5 ${school.stat}` };
                                }
                                state.stress += 20;
                                state.happiness -= 10;
                                return { icon: "❌", text: `[Rolled ${check.total}] Washed out of ${school.name}. Sent back to your unit. Humiliating.`, stats: "+20 Stress, -10 Happy" };
                            }
                        },
                        {
                            text: "Decline - not ready yet",
                            effect: () => {
                                return { icon: "🤷", text: "You pass on the opportunity. Maybe next time.", stats: "Slot given to someone else" };
                            }
                        }
                    ]
                }];
            }
            
            if (roll < 0.2 && state.military.rank < 5 && state.military.combatXP >= 30) {
                // Promotion board - now with choices
                return [{
                    category: "Career",
                    title: "Promotion Board",
                    desc: `You've been recommended for ${RANKS[state.military.rank + 1].name}. Time to face the board. How do you approach it?`,
                    choices: [
                        {
                            text: "Present yourself with confidence",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 13);
                                
                                if (check.success) {
                                    state.military.rank++;
                                    state.military.combatXP = 0;
                                    let newRank = getMilitaryRank();
                                    state.happiness += 20;
                                    addLog(`Promoted to ${newRank.name}`);
                                    return { icon: "⬆️", text: `[Rolled ${check.total} vs DC 13] "Congratulations, ${newRank.name}." Pay: $${newRank.pay}/week`, stats: `PROMOTED to ${newRank.name}!` };
                                }
                                state.stress += 10;
                                return { icon: "😔", text: `[Rolled ${check.total} vs DC 13] Not this time. "We'll see you next quarter."`, stats: "+10 Stress" };
                            }
                        },
                        {
                            text: "Let your record speak for itself",
                            effect: () => {
                                let check = rollWithModifier(state.military.combatXP, 25);
                                
                                if (check.success) {
                                    state.military.rank++;
                                    state.military.combatXP = 0;
                                    let newRank = getMilitaryRank();
                                    state.happiness += 25;
                                    addLog(`Promoted to ${newRank.name}`);
                                    return { icon: "⬆️", text: `[XP Check passed] Your service record says it all. Promoted to ${newRank.name}.`, stats: `PROMOTED to ${newRank.name}!` };
                                }
                                state.stress += 5;
                                return { icon: "📋", text: "The board wanted to see more initiative. Keep building that record.", stats: "+5 Stress" };
                            }
                        },
                        {
                            text: "Decline the board - not ready",
                            effect: () => {
                                state.military.combatXP += 5; // Keep building
                                return { icon: "🤚", text: "You request to wait for the next board. Some respect the humility, others wonder why.", stats: "+5 XP (keep building)" };
                            }
                        }
                    ]
                }];
            }
            
            if (roll < 0.35 && state.military.buddyName && state.military.buddyAlive) {
                // Buddy hangout
                return [{
                    category: "Downtime",
                    title: `Liberty with ${state.military.buddyName}`,
                    desc: `Weekend pass. ${state.military.buddyName} wants to hit the town.`,
                    choices: [
                        {
                            text: "Hit the bars",
                            effect: () => {
                                state.happiness += 15;
                                state.money -= 100;
                                state.military.squadMorale += 5;
                                state.skills.social += 2;
                                if (Math.random() < 0.1) {
                                    state.health -= 5;
                                    return { icon: "🍺", text: `Great night. ${state.military.buddyName} had to carry you back. Worth it.`, stats: "+15 Happiness, -$100, -5 Health" };
                                }
                                return { icon: "🍺", text: `Good times with ${state.military.buddyName}. "I got your back out there, you know."`, stats: "+15 Happiness, -$100, +2 Social" };
                            }
                        },
                        {
                            text: "Stay on base, save money",
                            effect: () => {
                                state.energy += 20;
                                state.money += 50;
                                return { icon: "💤", text: "Rest and relaxation. Boring but responsible.", stats: "+20 Energy, +$50 saved" };
                            }
                        }
                    ]
                }];
            }
            
            // Regular garrison duty
            return [{
                category: "Garrison",
                title: "Base Duty",
                desc: `Another week on base. PT, maintenance, training exercises. The routine of peacetime service.`,
                choices: [
                    {
                        text: "Excel at your duties",
                        effect: () => {
                            state.skills[mos.statBonus] += 2;
                            state.military.combatXP += 3;
                            state.energy -= 15;
                            return { icon: "⭐", text: "Good week. NCOs are noticing your performance.", stats: `+2 ${mos.statBonus}, +3 XP` };
                        }
                    },
                    {
                        text: "Volunteer for extra training",
                        effect: () => {
                            state.skills.physical += 2;
                            state.skills.technical += 2;
                            state.military.combatXP += 5;
                            state.energy -= 25;
                            return { icon: "💪", text: "Additional range time, PT, classes. Making yourself better.", stats: "+2 Physical, +2 Technical, +5 XP" };
                        }
                    },
                    {
                        text: "Coast through",
                        effect: () => {
                            state.energy += 10;
                            state.stress -= 5;
                            return { icon: "😎", text: "Did the minimum. Saved your energy.", stats: "+10 Energy, -5 Stress" };
                        }
                    }
                ]
            }];
        }

        function getMissionEvent() {
            let mos = MOS_OPTIONS[state.military.mos] || MOS_OPTIONS.infantry;
            let missionRoll = Math.random();
            
            // Different mission types based on MOS
            if (state.military.mos === 'medic') {
                return getMedicMission();
            } else if (state.military.mos === 'engineer') {
                return getEngineerMission();
            } else if (state.military.mos === 'intel') {
                return getIntelMission();
            } else {
                return getCombatMission();
            }
        }

        function getCombatMission() {
            let missionTypes = [
                { name: "Patrol", dc: 12, desc: "Routine patrol through hostile territory. Stay alert." },
                { name: "Convoy Escort", dc: 13, desc: "Protect the supply convoy. Ambush likely." },
                { name: "Building Clearance", dc: 15, desc: "Clear a suspected enemy position room by room." },
                { name: "QRF Response", dc: 16, desc: "Quick Reaction Force. Another unit is pinned down. Go NOW." },
                { name: "Night Raid", dc: 17, desc: "High-value target. Strike fast, extract faster." }
            ];
            
            let mission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
            
            return {
                category: "⚔️ MISSION",
                title: mission.name,
                desc: `${mission.desc} How do you approach?`,
                choices: [
                    {
                        text: "Aggressive - move fast, hit hard",
                        effect: () => {
                            let dc = mission.dc - 1; // Slightly easier to succeed
                            let combatStat = state.skills.physical + Math.floor(state.skills.technical / 2);
                            let check = rollWithModifier(combatStat, dc);
                            
                            return resolveCombat(check, mission, 'aggressive');
                        }
                    },
                    {
                        text: "By the book - standard tactics",
                        effect: () => {
                            let combatStat = state.skills.physical + Math.floor(state.skills.technical / 2);
                            let check = rollWithModifier(combatStat, mission.dc);
                            
                            return resolveCombat(check, mission, 'standard');
                        }
                    },
                    {
                        text: "Cautious - protect the squad first",
                        effect: () => {
                            let dc = mission.dc + 2; // Harder to achieve objective
                            let combatStat = state.skills.physical + Math.floor(state.skills.technical / 2);
                            let check = rollWithModifier(combatStat, dc);
                            
                            return resolveCombat(check, mission, 'cautious');
                        }
                    },
                    {
                        text: "Creative - try something unexpected",
                        effect: () => {
                            let dc = mission.dc;
                            let combatStat = state.skills.technical + state.skills.creativity; // Different stats
                            let check = rollWithModifier(combatStat, dc);
                            
                            return resolveCombat(check, mission, 'creative');
                        }
                    }
                ]
            };
        }
        
        function resolveCombat(check, mission, approach) {
            let xpMultiplier = approach === 'aggressive' ? 1.5 : approach === 'cautious' ? 0.7 : approach === 'creative' ? 1.3 : 1;
            let injuryRisk = approach === 'aggressive' ? 0.5 : approach === 'cautious' ? 0.2 : 0.35;
            let buddyRisk = approach === 'aggressive' ? 0.4 : approach === 'cautious' ? 0.1 : 0.25;
                            
                            // Natural 20 - Heroic success
                            if (check.nat20) {
                let xp = Math.floor(20 * xpMultiplier);
                state.military.combatXP += xp;
                                state.military.missionsCompleted++;
                                state.military.killCount += Math.floor(Math.random() * 3) + 2;
                                state.happiness += 10;
                                
                if (approach === 'creative' && Math.random() < 0.4) {
                    state.military.medals.push("Commendation Medal");
                    return { icon: "🌟", text: `[NAT 20!] Your unconventional approach worked brilliantly. Commended for tactical innovation.`, stats: `+${xp} XP, Commendation Medal!` };
                }
                                if (Math.random() < 0.3) {
                                    state.military.medals.push("Bronze Star");
                                    addLog("Awarded Bronze Star");
                    return { icon: "🌟", text: `[NAT 20!] HEROIC ACTION! Lives saved. Bronze Star recommended.`, stats: `+${xp} XP, Bronze Star!` };
                                }
                return { icon: "💥", text: `[NAT 20!] Flawless execution. Mission complete, zero friendly casualties.`, stats: `+${xp} XP, +10 Happy` };
                            }
                            
            // Natural 1 - Disaster (approach affects severity)
                            if (check.nat1) {
                                state.military.missionsCompleted++;
                                let disaster = Math.random();
                                
                if (disaster < buddyRisk && state.military.buddyAlive && state.military.buddyName) {
                                    state.military.buddyAlive = false;
                                    state.happiness -= 40;
                                    state.stress += 40;
                                    addLog(`${state.military.buddyName} KIA`);
                    return { icon: "💀", text: `[NAT 1!] Everything went wrong. ${state.military.buddyName} didn't make it.`, stats: "-40 Happy, +40 Stress, BUDDY KIA" };
                                }
                                
                if (disaster < injuryRisk) {
                                    state.health -= 25;
                                    state.military.wounded = true;
                                    state.military.medals.push("Purple Heart");
                    addLog("Wounded in action");
                    return { icon: "💜", text: `[NAT 1!] ${approach === 'aggressive' ? 'Pushed too hard.' : 'Wrong place, wrong time.'} Field hospital. Purple Heart.`, stats: "-25 Health, Purple Heart" };
                                }
                                
                                state.stress += 30;
                                state.happiness -= 20;
                return { icon: "💥", text: `[NAT 1!] ${approach === 'cautious' ? 'Despite caution, ambushed.' : 'Chaos. Mission failed.'} Debrief will be brutal.`, stats: "+30 Stress, -20 Happy" };
                            }
                            
                            // Success
                            if (check.success) {
                let xp = Math.floor(10 * xpMultiplier);
                state.military.combatXP += xp;
                                state.military.missionsCompleted++;
                                state.military.killCount += Math.floor(Math.random() * 2);
                                
                let successMsg = {
                    'aggressive': "Fast and violent. Objective secured before they knew what hit them.",
                    'standard': "Textbook operation. Mission accomplished.",
                    'cautious': "Slow and methodical. Everyone made it back.",
                    'creative': "They never saw it coming. Your plan worked perfectly."
                };
                
                return { icon: "✓", text: `[Rolled ${check.total}] ${successMsg[approach]}`, stats: `+${xp} XP` };
            }
            
            // Failure (but not nat 1) - cautious approach reduces consequences
            let failXp = Math.floor(3 * xpMultiplier);
            state.military.combatXP += failXp;
                            state.military.missionsCompleted++;
            state.stress += approach === 'cautious' ? 10 : 15;
            
            if (Math.random() < (approach === 'cautious' ? 0.15 : 0.3)) {
                state.health -= approach === 'cautious' ? 5 : 10;
                return { icon: "🩹", text: `[Rolled ${check.total}] ${approach === 'cautious' ? 'Withdrew safely, minor scrapes.' : 'Objective not achieved. Minor injuries.'}`, stats: `+${failXp} XP, -Health` };
            }
            
            return { icon: "😤", text: `[Rolled ${check.total}] ${approach === 'aggressive' ? 'Pushed too hard, had to pull back.' : 'Had to fall back. The enemy got away.'}`, stats: `+${failXp} XP, +Stress` };
        }

        function getMedicMission() {
            let scenarios = [
                { title: "Mass Casualty Event", desc: "Multiple wounded. Triage fast. Save who you can.", dc: 14 },
                { title: "Under Fire Rescue", desc: "Wounded soldier in the open. Bullets flying. Your move.", dc: 16 },
                { title: "Field Surgery", desc: "No medevac available. You have to operate here. Now.", dc: 17 }
            ];
            
            let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            return {
                category: "🏥 MEDICAL",
                title: scenario.title,
                desc: scenario.desc,
                choices: [
                    {
                        text: "🎲 Save them (Technical check)",
                        effect: () => {
                            let check = rollWithModifier(state.skills.technical, scenario.dc);
                            
                            if (check.nat20) {
                                state.military.combatXP += 25;
                                state.military.missionsCompleted++;
                                state.happiness += 20;
                                if (Math.random() < 0.4) {
                                    state.military.medals.push("Combat Medical Badge");
                                    return { icon: "⭐", text: `[NAT 20!] MIRACLE SAVE! Against all odds, everyone lived. Combat Medical Badge awarded.`, stats: "+25 XP, +20 Happiness, Combat Medical Badge!" };
                                }
                                return { icon: "❤️", text: `[NAT 20!] Perfect triage. Perfect care. Everyone who could be saved, was saved.`, stats: "+25 XP, +20 Happiness" };
                            }
                            
                            if (check.nat1) {
                                state.military.missionsCompleted++;
                                state.stress += 35;
                                state.happiness -= 25;
                                return { icon: "💀", text: `[NAT 1!] You did everything right but they died anyway. You'll see their faces forever.`, stats: "+35 Stress, -25 Happiness" };
                            }
                            
                            if (check.success) {
                                state.military.combatXP += 12;
                                state.military.missionsCompleted++;
                                state.skills.technical += 3;
                                return { icon: "🏥", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Lives saved. This is why you're here.`, stats: "+12 XP, +3 Technical" };
                            }
                            
                            state.military.combatXP += 5;
                            state.military.missionsCompleted++;
                            state.stress += 20;
                            return { icon: "😔", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Lost one. Did your best. Sometimes that's not enough.`, stats: "+5 XP, +20 Stress" };
                        }
                    }
                ]
            };
        }

        function getEngineerMission() {
            let scenarios = [
                { title: "IED Disposal", desc: "Roadside bomb. Everyone's watching. Steady hands.", dc: 15 },
                { title: "Breach Operation", desc: "Blow the door. Don't kill the guys behind you.", dc: 13 },
                { title: "Bridge Under Fire", desc: "Build a crossing while they shoot at you.", dc: 16 }
            ];
            
            let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            return {
                category: "💣 ENGINEERING",
                title: scenario.title,
                desc: scenario.desc,
                choices: [
                    {
                        text: "🎲 Execute (Technical check)",
                        effect: () => {
                            let check = rollWithModifier(state.skills.technical, scenario.dc);
                            
                            if (check.nat20) {
                                state.military.combatXP += 20;
                                state.military.missionsCompleted++;
                                state.skills.technical += 5;
                                return { icon: "💥", text: `[NAT 20!] Perfect execution. Textbook will be rewritten based on this.`, stats: "+20 XP, +5 Technical" };
                            }
                            
                            if (check.nat1) {
                                state.military.missionsCompleted++;
                                let result = Math.random();
                                if (result < 0.4) {
                                    state.health -= 30;
                                    state.military.medals.push("Purple Heart");
                                    return { icon: "💜", text: `[NAT 1!] Premature detonation. You're alive but badly wounded. Purple Heart.`, stats: "-30 Health, Purple Heart" };
                                }
                                state.stress += 30;
                                return { icon: "😱", text: `[NAT 1!] Wire snapped. Timer started. You ran. Barely made it.`, stats: "+30 Stress" };
                            }
                            
                            if (check.success) {
                                state.military.combatXP += 12;
                                state.military.missionsCompleted++;
                                return { icon: "✂️", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Clean work. Device neutralized.`, stats: "+12 XP" };
                            }
                            
                            state.military.combatXP += 4;
                            state.stress += 15;
                            return { icon: "😰", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Had to fall back. EOD robot took over.`, stats: "+4 XP, +15 Stress" };
                        }
                    }
                ]
            };
        }

        function getIntelMission() {
            let scenarios = [
                { title: "Interrogation", desc: "Captured insurgent. Time-sensitive intel. Clock is ticking.", dc: 14 },
                { title: "Signal Intercept", desc: "Enemy communications. Find the pattern.", dc: 13 },
                { title: "Asset Meeting", desc: "Your informant is nervous. Build trust fast.", dc: 15 }
            ];
            
            let scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
            
            return {
                category: "🔍 INTEL",
                title: scenario.title,
                desc: scenario.desc,
                choices: [
                    {
                        text: "🎲 Work the problem (Technical + Social)",
                        effect: () => {
                            let stat = Math.floor((state.skills.technical + state.skills.social) / 2);
                            let check = rollWithModifier(stat, scenario.dc);
                            
                            if (check.nat20) {
                                state.military.combatXP += 25;
                                state.military.missionsCompleted++;
                                state.skills.technical += 3;
                                state.skills.social += 3;
                                return { icon: "🎯", text: `[NAT 20!] JACKPOT! Intel leads to high-value target capture. Command is thrilled.`, stats: "+25 XP, +3 Technical, +3 Social" };
                            }
                            
                            if (check.nat1) {
                                state.military.missionsCompleted++;
                                state.stress += 25;
                                if (Math.random() < 0.3) {
                                    state.happiness -= 20;
                                    return { icon: "💀", text: `[NAT 1!] Your asset was compromised. They found the body. This is on you.`, stats: "+25 Stress, -20 Happiness" };
                                }
                                return { icon: "😬", text: `[NAT 1!] Bad intel. The raid hit a civilian wedding. International incident.`, stats: "+25 Stress" };
                            }
                            
                            if (check.success) {
                                state.military.combatXP += 15;
                                state.military.missionsCompleted++;
                                return { icon: "📋", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Good intel extracted. Lives will be saved.`, stats: "+15 XP" };
                            }
                            
                            state.military.combatXP += 5;
                            return { icon: "🤷", text: `[Rolled ${check.total} vs DC ${scenario.dc}] Inconclusive. Back to the drawing board.`, stats: "+5 XP" };
                        }
                    }
                ]
            };
        }

        function getBaseEvent() {
            let events = [
                {
                    title: "Care Package",
                    desc: "Mail call. Your name is on a box.",
                    effect: () => {
                        state.happiness += 15;
                        state.stress -= 10;
                        return { icon: "📦", text: "Cookies from home. Letters. Feels like a lifeline.", stats: "+15 Happiness, -10 Stress" };
                    }
                },
                {
                    title: "FOB Maintenance",
                    desc: "Filling sandbags. Building walls. Endless.",
                    effect: () => {
                        state.skills.physical += 2;
                        state.energy -= 15;
                        return { icon: "🏗️", text: "Grunt work, but the base is stronger.", stats: "+2 Physical" };
                    }
                },
                {
                    title: "Downtime",
                    desc: "Few hours off. What do you do?",
                    choices: [
                        { text: "Call home", effect: () => { state.happiness += 10; state.stress -= 15; return { icon: "📱", text: "Hearing familiar voices helps.", stats: "+10 Happiness, -15 Stress" }; }},
                        { text: "Work out", effect: () => { state.skills.physical += 3; state.energy -= 10; return { icon: "💪", text: "Iron therapy.", stats: "+3 Physical" }; }},
                        { text: "Play cards with the squad", effect: () => { state.military.squadMorale += 5; state.happiness += 8; return { icon: "🃏", text: "Laughing with your squad. Best medicine.", stats: "+8 Happiness" }; }}
                    ]
                },
                {
                    title: "Mortar Attack",
                    desc: "INCOMING! Sirens blare. Get to the bunker!",
                    effect: () => {
                        let check = rollWithModifier(state.skills.physical, 10);
                        if (check.nat1) {
                            state.health -= 15;
                            state.military.medals.push("Purple Heart");
                            return { icon: "💜", text: `[NAT 1!] Shrapnel caught you before you made cover. Purple Heart.`, stats: "-15 Health, Purple Heart" };
                        }
                        state.stress += 20;
                        return { icon: "💥", text: `[Rolled ${check.total}] Made it to the bunker. That was close.`, stats: "+20 Stress" };
                    }
                }
            ];
            
            let event = events[Math.floor(Math.random() * events.length)];
            
            if (event.choices) {
                return {
                    category: "Deployment",
                    title: event.title,
                    desc: event.desc,
                    choices: event.choices.map(c => ({ text: c.text, effect: c.effect }))
                };
            }
            
            return {
                category: "Deployment",
                title: event.title,
                desc: event.desc,
                choices: [{ text: "Continue", effect: event.effect }]
            };
        }

        function getRoutineEducationEvent() {
            let type = state.educationType;
            let week = state.phaseWeek + 1;
            let total = state.phaseTarget;
            
            return {
                category: "Education",
                title: `Week ${week} of ${total}`,
                desc: type === 'university' ? "Lectures, assignments, the rhythm of college life." :
                      type === 'community_college' ? "Classes and studying. Staying focused." :
                      type === 'trade_school' ? "Learning the craft. Hands-on and theory." :
                      "Training continues.",
                choices: [
                    {
                        text: "Study hard",
                        effect: () => {
                            state.energy -= 15;
                            state.skills.technical += 1;
                            if (type === 'university' || type === 'community_college') {
                                state.gpa = Math.min(4.0, state.gpa + 0.02);
                            }
                            return { icon: "📚", text: "Productive week.", stats: "+1 Technical" };
                        }
                    },
                    {
                        text: "Coast through",
                        effect: () => {
                            state.energy += 5;
                            state.happiness += 3;
                            return { icon: "😎", text: "Taking it easy.", stats: "+3 Happiness" };
                        }
                    },
                    {
                        text: "Socialize more",
                        effect: () => {
                            state.skills.social += 2;
                            state.happiness += 5;
                            state.energy -= 10;
                            return { icon: "👥", text: "Making connections.", stats: "+2 Social, +5 Happiness" };
                        }
                    }
                ]
            };
        }

        function getGraduationEvent() {
            let type = state.educationType;
            
            if (type === 'military_training') {
                return {
                    category: "Military",
                    title: "Boot Camp Complete!",
                    desc: "You made it through. Now the real service begins.",
                    choices: [
                        {
                            text: "Begin active duty",
                            effect: () => {
                                state.education = 'military';
                                state.educationType = 'military_service';
                                state.phaseTarget = EDUCATION_DURATION.military_service;
                                state.phaseWeek = 0;
                                state.employed = true;
                                state.job = 'military';
                                state.jobTitle = 'Military Service';
                                state.traits.push('Veteran');
                                addLog("Completed boot camp");
                                return { icon: "🎖️", text: "Private First Class. Your service begins.", stats: "Now in active duty" };
                            }
                        }
                    ]
                };
            }
            
            if (type === 'military_service') {
                return {
                    category: "Military",
                    title: "Service Complete",
                    desc: "Your commitment is fulfilled. The GI Bill is yours.",
                    choices: [
                        {
                            text: "Use GI Bill for college (free)",
                            effect: () => {
                                state.phase = 'education';
                                state.educationType = 'university';
                                state.phaseTarget = EDUCATION_DURATION.university;
                                state.phaseWeek = 0;
                                state.employed = false;
                                state.job = null;
                                state.home = 'room';
                                state.achievements.push('GI Bill');
                                addLog("Started university on GI Bill");
                                return { icon: "🎓", text: "Free education. You earned it.", stats: "Starting university (free)" };
                            }
                        },
                        {
                            text: "Enter civilian workforce",
                            effect: () => {
                                state.phase = 'job_hunting';
                                state.education = 'military';
                                state.employed = false;
                                state.job = null;
                                state.achievements.push('Honorable Discharge');
                                addLog("Honorably discharged");
                                return { icon: "🏠", text: "Back to civilian life. Time to find work.", stats: "Now job hunting" };
                            }
                        }
                    ]
                };
            }
            
            // College/trade school graduation
            let eduName = type === 'university' ? 'University' : 
                          type === 'community_college' ? 'Community College' : 'Trade School';
            
            // Calculate graduation honors for university
            let honors = '';
            let bonusStats = '';
            if (type === 'university') {
                if (state.gpa >= 3.9) {
                    honors = ' Summa Cum Laude';
                    state.career.networkContacts += 20;
                    bonusStats = ', +20 Network (Summa Cum Laude)';
                } else if (state.gpa >= 3.7) {
                    honors = ' Magna Cum Laude';
                    state.career.networkContacts += 15;
                    bonusStats = ', +15 Network (Magna Cum Laude)';
                } else if (state.gpa >= 3.5) {
                    honors = ' Cum Laude';
                    state.career.networkContacts += 10;
                    bonusStats = ', +10 Network (Cum Laude)';
                }
            }
            
            let majorName = state.university.major ? MAJORS[state.university.major].name : 'General Studies';
            
            // Career prospects based on GPA
            let careerProspects = "";
            if (type === 'university') {
                if (state.gpa >= 3.7) {
                    careerProspects = " Top firms are recruiting you. Prestigious positions await!";
                } else if (state.gpa >= 3.5) {
                    careerProspects = " Your grades open doors to great opportunities.";
                } else if (state.gpa >= 3.0) {
                    careerProspects = " Solid grades - you'll find something good.";
                } else if (state.gpa >= 2.5) {
                    careerProspects = " Your grades are... fine. The job hunt may be tougher.";
                } else {
                    careerProspects = " Your transcript isn't doing you any favors. Better lean on skills and networking.";
                }
            }
            
            return {
                category: "🎓 Milestone",
                title: `Graduation Day!${honors}`,
                desc: type === 'university' ? 
                    `Four years of ${majorName}. GPA: ${state.gpa.toFixed(2)}. ${state.university.thesisProgress >= 100 ? 'Thesis complete. ' : ''}${state.university.internshipCompleted ? 'Internship done. ' : ''}${careerProspects}` :
                    `${type === 'community_college' ? 'Two years' : 'One and a half years'} of work. You did it. ${eduName} graduate.`,
                choices: [
                    {
                        text: "Time to find a real job",
                        effect: () => {
                            state.education = type;
                            state.phase = 'job_hunting';
                            state.phaseWeek = 0;
                            state.employed = false;
                            state.job = null;
                            
                            // Add achievements
                            state.achievements.push(`${eduName} Graduate${honors}`);
                            if (type === 'university' && state.university.major) {
                                state.achievements.push(`${majorName} Degree`);
                            }
                            if (state.university.studyAbroadDone) state.achievements.push('World Traveler');
                            if (state.university.thesisProgress >= 100) state.achievements.push('Thesis Completed');
                            
                            // GPA salary modifier note
                            let salaryMod = getGPASalaryModifier();
                            let salaryNote = salaryMod > 1.0 ? ` (+${Math.round((salaryMod-1)*100)}% starting salary)` : 
                                            salaryMod < 1.0 ? ` (${Math.round((salaryMod-1)*100)}% starting salary)` : '';
                            
                            addLog(`Graduated from ${eduName.toLowerCase()}${honors} (GPA: ${state.gpa.toFixed(2)})`);
                            return { icon: "🎓", text: `You're officially a ${eduName.toLowerCase()} graduate!${honors ? ` ${honors}!` : ''}${salaryNote}`, stats: `Now job hunting${bonusStats}` };
                        }
                    }
                ]
            };
        }

        function getJobHuntingEvents() {
            let events = [];
            let available = getAvailableJobs();
            
            // Check if we have an interview scheduled
            if (state.interviews > 0) {
                // Use the specific job they applied for, or fall back to best available
                let bestJob = state.interviewJob || available[0];
                if (!JOBS[bestJob]) bestJob = available[0]; // Fallback if job not found
                let job = JOBS[bestJob];
                
                // Attractiveness can help in interviews
                let attrBonus = Math.floor(((state.currentAttractiveness || 5) - 5) * 2);
                let attrNote = attrBonus > 0 ? " (Your appearance helps)" : attrBonus < -2 ? " (First impressions are tough)" : "";
                
                // GPA affects hiring for college grads
                let gpaBonus = getGPAHiringModifier();
                let gpaSalaryMod = getGPASalaryModifier();
                let gpaNote = "";
                if (state.education === 'university' || state.education === 'community_college') {
                    if (gpaBonus >= 4) gpaNote = ` Your ${state.gpa.toFixed(2)} GPA impresses them.`;
                    else if (gpaBonus >= 2) gpaNote = ` Your academic record helps.`;
                    else if (gpaBonus <= -3) gpaNote = ` They noticed your poor grades...`;
                    else if (gpaBonus <= -1) gpaNote = ` Your GPA isn't doing you favors.`;
                }
                
                // Calculate adjusted salary based on GPA
                let adjustedSalary = Math.round(job.salary * gpaSalaryMod);
                let salaryNote = gpaSalaryMod > 1.0 ? ` (GPA bonus: +${Math.round((gpaSalaryMod-1)*100)}%)` : 
                                gpaSalaryMod < 1.0 ? ` (GPA penalty: ${Math.round((gpaSalaryMod-1)*100)}%)` : '';
                
                // Clear the interview job after starting the interview
                state.interviewJob = null;
                
                // Prestigious jobs are harder to get
                let baseDC = job.prestigious ? 16 : 14;
                
                return [{
                    category: "Interview",
                    title: `Interview: ${job.title}`,
                    desc: `Big day. Interview for ${job.title}.${attrNote}${gpaNote}${job.prestigious ? ' This is a competitive position.' : ''}`,
                    choices: [
                        {
                            text: "Just be yourself. Confidence is key.",
                            effect: () => {
                                state.interviews--;
                                let totalBonus = state.skills.social + attrBonus + gpaBonus;
                                let check = rollWithModifier(totalBonus, baseDC);
                                
                                if (check.nat20) {
                                    hireAtJob(bestJob, adjustedSalary, 60);
                                    state.happiness += 25;
                                    state.career.boss.relationship = 60; // Great first impression
                                    return { icon: "🌟", text: `[NAT 20!] Crushed it! They loved your authenticity.`, stats: `Hired! +$${adjustedSalary}/wk${salaryNote}` };
                                }
                                if (check.success) {
                                    hireAtJob(bestJob, adjustedSalary, 50);
                                    state.happiness += 20;
                                    return { icon: "🎉", text: `[Rolled ${check.total} vs DC ${baseDC}] You got the job!`, stats: `Hired! +$${adjustedSalary}/wk${salaryNote}` };
                                }
                                state.happiness -= 10;
                                state.jobApplications++;
                                return { icon: "😔", text: `[Rolled ${check.total} vs DC ${baseDC}] Too casual. They went with someone else.`, stats: "-10 Happiness" };
                            }
                        },
                        {
                            text: "Stay up all night researching the company.",
                            effect: () => {
                                state.interviews--;
                                state.energy -= 20;
                                state.health -= 5;
                                let totalBonus = state.skills.social + 5 + gpaBonus;
                                let check = rollWithModifier(totalBonus, baseDC - 4);
                                
                                if (check.success) {
                                    hireAtJob(bestJob, adjustedSalary, 55);
                                    state.happiness += 20;
                                    return { icon: "🎉", text: `[Rolled ${check.total} vs DC ${baseDC - 4}] Preparation paid off!`, stats: `Hired! +$${adjustedSalary}/wk${salaryNote}` };
                                }
                                state.happiness -= 8;
                                return { icon: "😴", text: `[Rolled ${check.total}] Exhausted and it showed. No offer.`, stats: "-20 Energy, -5 Health, -8 Happy" };
                            }
                        },
                        {
                            text: "Hire an interview coach. Worth the investment?",
                            condition: () => state.money >= 200,
                            effect: () => {
                                state.interviews--;
                                state.money -= 200;
                                let totalBonus = state.skills.social + 10 + gpaBonus;
                                let check = rollWithModifier(totalBonus, baseDC - 6);
                                
                                if (check.success) {
                                    hireAtJob(bestJob, adjustedSalary, 55);
                                    state.happiness += 20;
                                    state.skills.social += 2;
                                    return { icon: "🎉", text: `[Rolled ${check.total} vs DC ${baseDC - 6}] Coach knew exactly what they'd ask!`, stats: `Hired! +$${adjustedSalary}/wk${salaryNote}` };
                                }
                                state.happiness -= 5;
                                state.skills.social += 1;
                                return { icon: "😐", text: `[Rolled ${check.total}] Coaching helped but wasn't enough.`, stats: "-$200, +1 Social (learned something)" };
                            }
                        },
                        {
                            text: "Call in a favor. Someone you know might have inside info.",
                            condition: () => state.career.networkContacts >= 5,
                            effect: () => {
                                state.interviews--;
                                state.career.networkContacts -= 2;
                                let totalBonus = state.skills.social + 8 + gpaBonus;
                                let check = rollWithModifier(totalBonus, baseDC - 5);
                                
                                if (check.success) {
                                    hireAtJob(bestJob, adjustedSalary, 55);
                                    state.happiness += 22;
                                    return { icon: "🎉", text: `[Rolled ${check.total} vs DC ${baseDC - 5}] Your contact's tips were gold!`, stats: `Hired! +$${adjustedSalary}/wk${salaryNote}` };
                                }
                                return { icon: "🤷", text: `[Rolled ${check.total}] Inside info wasn't enough.`, stats: "-2 Network contacts" };
                            }
                        }
                    ]
                }];
            }
            
            // Build GPA note for job hunting
            let gpaHuntingNote = "";
            if (state.education === 'university' || state.education === 'community_college') {
                let gpa = state.gpa || 2.5;
                if (gpa >= 3.7) gpaHuntingNote = ` Your stellar ${gpa.toFixed(2)} GPA opens doors.`;
                else if (gpa >= 3.3) gpaHuntingNote = ` Your ${gpa.toFixed(2)} GPA is a solid selling point.`;
                else if (gpa < 2.5) gpaHuntingNote = ` Your ${gpa.toFixed(2)} GPA is making this harder.`;
            }
            
            // Get top 4 available jobs for the player to choose from
            let topJobs = available.slice(0, 4);
                            let gpaBonus = getGPAHiringModifier();
            
            // Build job application choices
            let jobChoices = topJobs.map(jobKey => {
                let job = JOBS[jobKey];
                let gpaSalaryMod = getGPASalaryModifier();
                let adjustedSalary = Math.round(job.salary * gpaSalaryMod);
                let salaryNote = gpaSalaryMod !== 1.0 ? ` (${gpaSalaryMod > 1 ? '+' : ''}${Math.round((gpaSalaryMod-1)*100)}% GPA)` : '';
                let difficulty = job.prestigious ? '⭐ Competitive' : job.req.education === 'university' ? '📊 Professional' : '';
                
                return {
                    text: `${job.icon} Apply for ${job.title} ($${adjustedSalary}/wk${salaryNote})`,
                    effect: () => {
                        state.jobApplications++;
                        state.energy -= 5;
                        state.targetJob = jobKey; // Store which job they're applying for
                        
                        // Callback chance based on qualifications + GPA
                        let baseRate = 0.35 + (gpaBonus * 0.05);
                        if (job.prestigious) baseRate -= 0.15; // Harder to get callbacks for prestigious jobs
                        
                        // Criminal record penalty
                        let criminalPenalty = getCriminalRecordPenalty();
                        baseRate *= criminalPenalty;
                        
                        if (Math.random() < baseRate) {
                                state.interviews++;
                            state.interviewJob = jobKey; // Remember which job the interview is for
                            return { icon: "📞", text: `${job.title} wants to interview you!`, stats: "Interview scheduled!" };
                        }
                        return { icon: "📧", text: `Application sent to ${job.title}. Waiting to hear back...`, stats: "-5 Energy" };
                    }
                };
            });
            
            // Add other options
            jobChoices.push({
                text: "🤝 Network instead (build connections)",
                        effect: () => {
                            state.skills.social += 2;
                            state.money -= 20;
                    state.career = state.career || {};
                    state.career.networkContacts = (state.career.networkContacts || 0) + 1;
                    if (Math.random() < 0.2) {
                                state.interviews++;
                        // Pick a random good job for network referral
                        state.interviewJob = topJobs[Math.floor(Math.random() * Math.min(3, topJobs.length))];
                        return { icon: "🤝", text: "A contact referred you! Interview lined up.", stats: "+2 Social, +1 Contact, Interview!" };
                    }
                    return { icon: "🤝", text: "Making connections. Building your network.", stats: "+2 Social, +1 Contact, -$20" };
                }
            });
            
            jobChoices.push({
                text: "☕ Take a break (recover energy)",
                        effect: () => {
                            state.energy += 20;
                            state.happiness += 5;
                            state.stress -= 10;
                    return { icon: "☕", text: "Job hunting is exhausting. You needed this.", stats: "+20 Energy, +5 Happy, -10 Stress" };
                }
            });
            
            // Job hunting activities
            events.push({
                category: "Job Hunt",
                title: "Job Search",
                desc: `Week ${state.phaseWeek + 1} of job hunting. ${state.jobApplications || 0} applications sent, ${state.interviews || 0} interviews pending.${gpaHuntingNote}`,
                choices: jobChoices
            });
            
            return events;
        }

        function getEmployedEvents() {
            let events = [];
            let job = JOBS[state.job];
            if (!job) return getRandomLifeEvents();
            let roll = Math.random();
            
            // JOB SEARCHING WHILE EMPLOYED
            if (state.lookingForNewJob && Math.random() < 0.4) {
                let available = getAvailableJobs().filter(j => j !== state.job); // Exclude current job
                let betterJobs = available.filter(j => JOBS[j].salary > (state.baseSalary || job.salary));
                
                if (betterJobs.length > 0) {
                    let targetJob = betterJobs[Math.floor(Math.random() * Math.min(3, betterJobs.length))];
                    let targetJobData = JOBS[targetJob];
                    let salaryIncrease = targetJobData.salary - (state.baseSalary || job.salary);
                    
                    return [{
                        category: "Career",
                        title: "Job Opportunity",
                        desc: `While job searching, you found an opening for ${targetJobData.title} ($${targetJobData.salary}/wk). That's +$${salaryIncrease}/wk more than now!`,
                        choices: [
                            {
                                text: `Apply for ${targetJobData.title}`,
                                effect: () => {
                                    state.interviewJob = targetJob;
                                    if (Math.random() < 0.5) {
                                        state.interviews++;
                                        return { icon: "📞", text: "They want to interview you!", stats: "Interview scheduled!" };
                                    }
                                    return { icon: "📧", text: "Application sent. Fingers crossed.", stats: "Applied" };
                                }
                            },
                            {
                                text: "Not worth the risk right now",
                                effect: () => {
                                    return { icon: "🤔", text: "You decide to stay put for now.", stats: "" };
                                }
                            },
                            {
                                text: "Stop job searching",
                                effect: () => {
                                    state.lookingForNewJob = false;
                                    return { icon: "✋", text: "You decide to commit to your current job.", stats: "No longer job searching" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // Handle pending interviews while employed
            if (state.lookingForNewJob && state.interviews > 0) {
                let interviewJob = state.interviewJob || getAvailableJobs().filter(j => j !== state.job)[0];
                if (interviewJob && JOBS[interviewJob]) {
                    let targetJob = JOBS[interviewJob];
                    let gpaSalaryMod = getGPASalaryModifier();
                    let adjustedSalary = Math.round(targetJob.salary * gpaSalaryMod);
                    
                    return [{
                        category: "Career",
                        title: `Interview: ${targetJob.title}`,
                        desc: `You have an interview scheduled for ${targetJob.title}. You'll need to sneak away from work...`,
                        choices: [
                            {
                                text: "Call in sick to go to the interview",
                                effect: () => {
                                    state.interviews--;
                                    state.interviewJob = null;
                                    
                                    // Boss might find out
                                    let bossFindsOut = Math.random() < 0.2;
                                    if (bossFindsOut && state.career.boss) {
                                        state.career.boss.relationship -= 15;
                                    }
                                    
                                    let check = rollWithModifier(state.skills.social, 12);
                                    if (check.success) {
                                        // Got the new job!
                                        let oldJob = state.jobTitle;
                                        hireAtJob(interviewJob, adjustedSalary, 50);
                                        state.happiness += 15;
                                        let result = { icon: "🎉", text: `You got the job! Moving on from ${oldJob}.`, stats: `New job: +$${adjustedSalary}/wk` };
                                        if (bossFindsOut) result.text += " (Your old boss found out you were interviewing)";
                                        return result;
                                    }
                                    state.performance = Math.max(0, state.performance - 5);
                                    return { icon: "😔", text: "Didn't get the offer. Back to the grind." + (bossFindsOut ? " Your boss seems suspicious..." : ""), stats: "-5 Performance" };
                                }
                            },
                            {
                                text: "Reschedule - too risky right now",
                                effect: () => {
                                    // Interview stays pending
                                    return { icon: "📅", text: "You ask to reschedule. They'll get back to you.", stats: "" };
                                }
                            },
                            {
                                text: "Decline the interview",
                                effect: () => {
                                    state.interviews--;
                                    state.interviewJob = null;
                                    return { icon: "✋", text: "You decline. Maybe now isn't the right time.", stats: "-1 Interview" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // Determine job category
            let jobCategory = null;
            for (let [cat, data] of Object.entries(JOB_CATEGORIES)) {
                if (data.jobs.includes(state.job)) {
                    jobCategory = cat;
                    break;
                }
            }
            
            // COWORKER ASSIGNMENT (First few weeks at job)
            if (!state.career.coworkerAlly && state.weeksAtJob >= 2 && state.weeksAtJob < 6) {
                let allyName = COWORKER_NAMES[Math.floor(Math.random() * COWORKER_NAMES.length)];
                return [{
                    category: "Workplace",
                    title: "Making Friends at Work",
                    desc: `${allyName} from your department seems friendly. They offer to show you the ropes.`,
                    choices: [
                        {
                            text: `Befriend ${allyName}`,
                            effect: () => {
                                state.career.coworkerAlly = allyName;
                                state.skills.social += 3;
                                return { icon: "🤝", text: `${allyName} becomes your work buddy. Good to have allies.`, stats: "+3 Social, Work ally gained" };
                            }
                        },
                        {
                            text: "Keep it professional",
                            effect: () => {
                                state.performance += 2;
                                return { icon: "💼", text: "Focus on work, not friendships.", stats: "+2 Performance" };
                            }
                        }
                    ]
                }];
            }
            
            // RIVAL EMERGENCE (After week 10)
            if (!state.career.coworkerRival && state.weeksAtJob >= 10 && roll < 0.1) {
                let rivalName = COWORKER_NAMES.filter(n => n !== state.career.coworkerAlly)[Math.floor(Math.random() * (COWORKER_NAMES.length - 1))];
                return [{
                    category: "Office Politics",
                    title: "Competition Emerges",
                    desc: `${rivalName} seems to be gunning for the same opportunities as you. They've been talking to your boss a lot lately.`,
                    choices: [
                        {
                            text: "Challenge accepted",
                            effect: () => {
                                state.career.coworkerRival = rivalName;
                                state.stress += 10;
                                state.performance += 5;
                                return { icon: "⚔️", text: `${rivalName} wants competition? They'll get it.`, stats: "+10 Stress, +5 Performance, Rival gained" };
                            }
                        },
                        {
                            text: "Try to make peace",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 13);
                                if (check.success) {
                                    state.skills.social += 3;
                                    return { icon: "☮️", text: `[Rolled ${check.total}] You extend an olive branch. ${rivalName} seems to back off.`, stats: "+3 Social" };
                                }
                                state.career.coworkerRival = rivalName;
                                return { icon: "😒", text: `[Rolled ${check.total}] ${rivalName} sees it as weakness. You've made an enemy.`, stats: "Rival gained" };
                            }
                        }
                    ]
                }];
            }
            
            // PROJECT ASSIGNMENT (Periodic)
            if (!state.career.projectActive && state.weeksAtJob >= 8 && roll < 0.15 && jobCategory) {
                let projectKeys = JOB_CATEGORIES[jobCategory].projects;
                let projectKey = projectKeys[Math.floor(Math.random() * projectKeys.length)];
                let project = PROJECT_TYPES[projectKey] || PROJECT_TYPES.quarterly_report;
                
                return [{
                    category: "🎯 Assignment",
                    title: `New Project: ${project.name}`,
                    desc: `Boss assigns you to ${project.name}. It'll take about ${project.duration} weeks. Big visibility.`,
                    choices: [
                        {
                            text: "Take the lead",
                            effect: () => {
                                state.career.projectActive = true;
                                state.career.projectWeek = 0;
                                state.career.projectSuccess = 50;
                                state.career.currentProject = projectKey;
                                state.stress += 10;
                                return { icon: "📋", text: `You're on ${project.name}. Time to deliver.`, stats: "+10 Stress, Project started" };
                            }
                        },
                        {
                            text: "Suggest someone else",
                            effect: () => {
                                state.career.bossRelationship -= 10;
                                state.stress -= 5;
                                return { icon: "🤷", text: "Not your time, you say. Boss doesn't seem pleased.", stats: "-10 Boss relationship, -5 Stress" };
                            }
                        }
                    ]
                }];
            }
            
            // PROJECT PROGRESS EVENTS
            if (state.career.projectActive) {
                state.career.projectWeek++;
                let project = PROJECT_TYPES[state.career.currentProject] || PROJECT_TYPES.quarterly_report;
                
                // Project completion check
                if (state.career.projectWeek >= project.duration) {
                    return [{
                        category: "📊 Deadline",
                        title: `${project.name} Due!`,
                        desc: `Time's up. Success probability: ${state.career.projectSuccess}%`,
                        choices: [
                            {
                                text: "🎲 Submit your work",
                                effect: () => {
                                    let check = rollWithModifier(state.career.projectSuccess - 50 + state.skills.technical, project.difficulty);
                                    state.career.projectActive = false;
                                    state.career.projectWeek = 0;
                                    
                                    if (check.nat20) {
                                        let bonus = Math.floor(job.salary * project.reward * 2);
                                        state.money += bonus;
                                        state.performance += 20;
                                        state.career.bossRelationship += 15;
                                        state.happiness += 15;
                                        addLog(`Stellar work on ${project.name}`);
                                        return { icon: "🌟", text: `[NAT 20!] EXCEPTIONAL WORK! Everyone's talking about it.`, stats: `+$${bonus} bonus, +20 Performance, +15 Boss rel` };
                                    }
                                    if (check.success) {
                                        let bonus = Math.floor(job.salary * project.reward);
                                        state.money += bonus;
                                        state.performance += 10;
                                        state.career.bossRelationship += 5;
                                        return { icon: "✅", text: `[Rolled ${check.total} vs DC ${project.difficulty}] Project delivered successfully.`, stats: `+$${bonus} bonus, +10 Performance` };
                                    }
                                    if (check.nat1) {
                                        state.performance -= 15;
                                        state.career.bossRelationship -= 15;
                                        state.stress += 20;
                                        state.career.promotionsDenied++;
                                        addLog(`Failed ${project.name} project`);
                                        return { icon: "💀", text: `[NAT 1!] DISASTER. Major mistakes found. Blame falls on you.`, stats: "-15 Performance, -15 Boss rel, +20 Stress" };
                                    }
                                    state.performance -= 5;
                                    state.career.bossRelationship -= 5;
                                    return { icon: "😔", text: `[Rolled ${check.total} vs DC ${project.difficulty}] Didn't meet expectations.`, stats: "-5 Performance, -5 Boss relationship" };
                                }
                            }
                        ]
                    }];
                }
                
                // Mid-project events
                if (roll < 0.4) {
                    return [{
                        category: "Project",
                        title: `${project.name} Progress`,
                        desc: `Week ${state.career.projectWeek}/${project.duration}. Current progress: ${state.career.projectSuccess}%`,
                        choices: [
                            {
                                text: "🎲 Put in extra effort",
                                effect: () => {
                                    let check = rollWithModifier(state.skills.technical, 12);
                                    state.energy -= 20;
                                    
                                    if (check.nat20) {
                                        state.career.projectSuccess += 30;
                                        state.skills.technical += 3;
                                        return { icon: "💡", text: "[NAT 20!] Breakthrough! Everything clicks.", stats: "+30% Success, +3 Technical" };
                                    }
                                    if (check.success) {
                                        state.career.projectSuccess += 15;
                                        return { icon: "📈", text: `[Rolled ${check.total}] Good progress this week.`, stats: "+15% Success" };
                                    }
                                    state.career.projectSuccess += 5;
                                    state.stress += 10;
                                    return { icon: "😓", text: `[Rolled ${check.total}] Struggling, but moving forward.`, stats: "+5% Success, +10 Stress" };
                                }
                            },
                            {
                                text: "Ask ally for help",
                                condition: () => state.career.coworkerAlly,
                                effect: () => {
                                    state.career.projectSuccess += 12;
                                    state.skills.social += 1;
                                    return { icon: "🤝", text: `${state.career.coworkerAlly} helps out. Teamwork.`, stats: "+12% Success, +1 Social" };
                                }
                            },
                            {
                                text: "Standard effort",
                                effect: () => {
                                    state.career.projectSuccess += 8;
                                    return { icon: "💼", text: "Steady work. On track.", stats: "+8% Success" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // RIVAL INTERFERENCE
            if (state.career.coworkerRival && roll < 0.12) {
                return [{
                    category: "Office Politics",
                    title: `${state.career.coworkerRival}'s Move`,
                    desc: `${state.career.coworkerRival} is spreading rumors about your work quality to the boss.`,
                    choices: [
                        {
                            text: "🎲 Confront them directly",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 13);
                                
                                if (check.nat20) {
                                    state.career.coworkerRival = null;
                                    state.career.bossRelationship += 10;
                                    return { icon: "👊", text: `[NAT 20!] You expose their scheme publicly. ${state.career.coworkerRival} is humiliated. They back off.`, stats: "+10 Boss rel, Rival neutralized" };
                                }
                                if (check.success) {
                                    state.career.bossRelationship += 5;
                                    state.stress += 10;
                                    return { icon: "😤", text: `[Rolled ${check.total}] You call them out. Tension, but the truth is known.`, stats: "+5 Boss rel, +10 Stress" };
                                }
                                state.career.bossRelationship -= 10;
                                state.stress += 15;
                                return { icon: "😠", text: `[Rolled ${check.total}] You look petty. Boss doesn't want drama.`, stats: "-10 Boss rel, +15 Stress" };
                            }
                        },
                        {
                            text: "Let your work speak",
                            effect: () => {
                                state.performance += 5;
                                state.stress += 10;
                                return { icon: "💪", text: "Rise above. Double down on excellence.", stats: "+5 Performance, +10 Stress" };
                            }
                        },
                        {
                            text: "Report to HR",
                            effect: () => {
                                if (Math.random() > 0.4) {
                                    state.career.coworkerRival = null;
                                    return { icon: "📋", text: "HR investigates. The behavior stops.", stats: "Rival neutralized" };
                                }
                                state.skills.social -= 5;
                                return { icon: "😬", text: "HR finds 'no evidence.' You look like a tattletale.", stats: "-5 Social" };
                            }
                        }
                    ]
                }];
            }
            
            // ALLY SUPPORT EVENT
            if (state.career.coworkerAlly && roll < 0.18) {
                return [{
                    category: "Workplace",
                    title: `${state.career.coworkerAlly} Has Your Back`,
                    desc: `${state.career.coworkerAlly} wants to grab lunch and chat about a opportunity.`,
                    choices: [
                        {
                            text: "Join them",
                            effect: () => {
                                state.happiness += 8;
                                state.career.networkContacts += 3;
                                state.money -= 15;
                                if (Math.random() < 0.3) {
                                    state.career.bossRelationship += 5;
                                    return { icon: "💡", text: `${state.career.coworkerAlly} shares insider info about what the boss values.`, stats: "+8 Happiness, +5 Boss rel, +3 Network" };
                                }
                                return { icon: "🍜", text: "Good lunch. Good talk. Workplace feels friendlier.", stats: "+8 Happiness, +3 Network, -$15" };
                            }
                        },
                        {
                            text: "Too busy",
                            effect: () => {
                                state.performance += 2;
                                return { icon: "💼", text: "Work comes first.", stats: "+2 Performance" };
                            }
                        }
                    ]
                }];
            }
            
            // SIDE HUSTLE OPPORTUNITY
            if (!state.career.sideHustle && state.weeksAtJob >= 20 && roll < 0.08) {
                let availableHustles = Object.entries(SIDE_HUSTLES).filter(([k, h]) => 
                    !h.skillReq || state.skills[h.skillReq] >= h.minSkill
                );
                if (availableHustles.length > 0) {
                    let [hustleKey, hustle] = availableHustles[Math.floor(Math.random() * availableHustles.length)];
                    return [{
                        category: "Opportunity",
                        title: "Side Hustle Idea",
                        desc: `You've been thinking about ${hustle.name.toLowerCase()} on the side. Extra income, but it'll take time.`,
                        choices: [
                            {
                                text: `Start ${hustle.name} (${hustle.icon} ~$${hustle.income}/week)`,
                                effect: () => {
                                    state.career.sideHustle = hustleKey;
                                    state.energy -= 10;
                                    addLog(`Started ${hustle.name} side hustle`);
                                    return { icon: hustle.icon, text: `You start ${hustle.name.toLowerCase()}. The grind begins.`, stats: `Side hustle active, +~$${hustle.income}/week, -${hustle.timeReq} Energy/week` };
                                }
                            },
                            {
                                text: "Focus on main job",
                                effect: () => {
                                    state.performance += 3;
                                    return { icon: "💼", text: "One job is enough stress.", stats: "+3 Performance" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // LAYOFF/RECESSION EVENT (Random, rare)
            if (roll < 0.02 && state.weeksAtJob >= 26) {
                return [{
                    category: "⚠️ Crisis",
                    title: "Company Downsizing",
                    desc: "Economy's rough. Your department is being 'restructured.' Your job is on the line.",
                    choices: [
                        {
                            text: "🎲 Fight for your position",
                            effect: () => {
                                let check = rollWithModifier(state.performance + state.career.bossRelationship - 50, 14);
                                
                                if (check.success) {
                                    state.stress += 20;
                                    state.career.bossRelationship += 10;
                                    return { icon: "💪", text: `[Rolled ${check.total} vs DC 14] You made the cut. Survivors guilt hits different.`, stats: "+20 Stress, +10 Boss rel, Still employed" };
                                }
                                state.employed = false;
                                state.job = null;
                                state.phase = 'job_hunting';
                                state.money += job.salary * 4; // Severance
                                state.happiness -= 20;
                                state.career.companiesWorked++;
                                addLog("Laid off in downsizing");
                                return { icon: "📦", text: `[Rolled ${check.total} vs DC 14] You're let go. Severance helps, but still stings.`, stats: `+$${job.salary * 4} severance, -20 Happiness` };
                            }
                        },
                        {
                            text: "Take voluntary severance",
                            effect: () => {
                                state.employed = false;
                                state.job = null;
                                state.phase = 'job_hunting';
                                state.money += job.salary * 8; // Better severance for volunteers
                                state.career.companiesWorked++;
                                addLog("Took voluntary severance");
                                return { icon: "💰", text: "Better package for going quietly. Time for something new.", stats: `+$${job.salary * 8} severance` };
                            }
                        }
                    ]
                }];
            }
            
            // Promotion check
            if (state.performance > 80 && state.weeksAtJob > 52 && roll < 0.12) {
                events.push(getPromotionEvent());
                return events;
            }
            
            // Standard work events
            if (roll < 0.18) {
                events.push({
                    category: "Work",
                    title: "Crunch Time",
                    desc: "Big deadline. The boss is watching. Everyone's stressed.",
                    choices: [
                        {
                            text: "Work overtime",
                            effect: () => {
                                state.performance = Math.min(100, state.performance + 10);
                                state.energy -= 25;
                                state.stress += 15;
                                state.money += Math.floor(job.salary * 0.3);
                                state.career.bossRelationship += 5;
                                return { icon: "💪", text: "Crushed it. Boss noticed the dedication.", stats: `+10 Perf, +30% bonus, +5 Boss rel` };
                            }
                        },
                        {
                            text: "Do your part, go home on time",
                            effect: () => {
                                state.performance = Math.min(100, state.performance + 3);
                                return { icon: "⏰", text: "Did the job. Nothing more.", stats: "+3 Performance" };
                            }
                        },
                        {
                            text: "Coast through it",
                            effect: () => {
                                state.performance = Math.max(0, state.performance - 5);
                                state.energy += 10;
                                if (state.career.coworkerRival) state.career.bossRelationship -= 3;
                                return { icon: "😎", text: "Not your problem. Others pick up the slack.", stats: "-5 Performance, +10 Energy" };
                            }
                        }
                    ]
                });
            } else if (roll < 0.28 && state.performance < 30) {
                events.push({
                    category: "Work",
                    title: "Performance Review",
                    desc: "HR wants to see you. This doesn't look good.",
                    choices: [
                        {
                            text: "🎲 Promise to do better",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 12);
                                if (check.success) {
                                    state.stress += 20;
                                    state.performance += 10;
                                    return { icon: "😰", text: `[Rolled ${check.total}] Final warning. You're on a PIP. Shape up.`, stats: "+20 Stress, +10 Performance (pressure)" };
                                }
                                state.employed = false;
                                state.job = null;
                                state.phase = 'job_hunting';
                                state.happiness -= 25;
                                state.career.companiesWorked++;
                                addLog("Got fired");
                                return { icon: "📦", text: `[Rolled ${check.total}] You're terminated. Pack your things.`, stats: "-25 Happiness, Job lost" };
                            }
                        }
                    ]
                });
            } else {
                events.push(getRoutineWorkEvent());
            }
            
            // Process side hustle income
            if (state.career.sideHustle) {
                let hustle = SIDE_HUSTLES[state.career.sideHustle];
                let income = hustle.income + (hustle.variance ? Math.floor(Math.random() * hustle.variance) - hustle.variance/2 : 0);
                state.money += Math.max(0, income);
                state.energy -= hustle.timeReq;
            }
            
            // Random life events can happen while employed
            let lifeEvent = getRandomLifeEvent();
            if (lifeEvent && Math.random() < 0.25) {
                events.push(lifeEvent);
            }
            
            return events;
        }

        function getRoutineWorkEvent() {
            let job = JOBS[state.job];
            if (!job) return { category: "Life", title: "Taking It Easy", desc: "No job, no stress.", choices: [{ text: "Continue", effect: () => ({ icon: "🤷", text: "Another day.", stats: "" }) }] };
            
            let jobCategory = null;
            for (let [cat, data] of Object.entries(JOB_CATEGORIES)) {
                if (data.jobs.includes(state.job)) {
                    jobCategory = cat;
                    break;
                }
            }
            
            // Job-specific routine events
            let routineText = jobCategory === 'retail' ? "Customers, inventory, the usual retail grind." :
                             jobCategory === 'tech' ? "Meetings, code, tickets, standup. Tech life." :
                             jobCategory === 'office' ? "Emails, meetings, spreadsheets. Corporate life." :
                             jobCategory === 'trades' ? "Tools, clients, physical work. Blue collar life." :
                             `Another week at ${state.jobTitle}.`;
            
            return {
                category: "Work",
                title: "Work Week",
                desc: routineText,
                choices: [
                    {
                        text: "🎲 Work hard",
                        effect: () => {
                            let check = rollWithModifier(state.skills.technical, 10);
                            state.energy -= 15;
                            
                            if (check.nat20) {
                                state.performance = Math.min(100, state.performance + 8);
                                state.career.bossRelationship += 5;
                                state.skills.technical += 2;
                                return { icon: "⭐", text: "[NAT 20!] Outstanding week. Boss mentions it.", stats: "+8 Perf, +5 Boss rel, +2 Technical" };
                            }
                            if (check.success) {
                                state.performance = Math.min(100, state.performance + 4);
                            state.skills.technical += 1;
                                return { icon: "💼", text: `[Rolled ${check.total}] Solid work. Building reputation.`, stats: "+4 Perf, +1 Technical" };
                            }
                            state.performance = Math.min(100, state.performance + 2);
                            return { icon: "📊", text: `[Rolled ${check.total}] Average week.`, stats: "+2 Performance" };
                        }
                    },
                    {
                        text: "Just get by",
                        effect: () => {
                            state.performance = Math.max(0, state.performance - 1);
                            state.energy += 5;
                            return { icon: "😐", text: "Paycheck earned.", stats: "-1 Perf, +5 Energy" };
                        }
                    },
                    {
                        text: "Focus on networking",
                        effect: () => {
                            state.skills.social += 2;
                            state.career.networkContacts += 2;
                            state.energy -= 10;
                            return { icon: "🤝", text: "Making connections.", stats: "+2 Social, +2 Network" };
                        }
                    }
                ]
            };
        }

        function getPromotionEvent() {
            let job = JOBS[state.job];
            let allyHelp = state.career.coworkerAlly ? 5 : 0;
            let rivalPenalty = state.career.coworkerRival ? -5 : 0;
            
            return {
                category: "🎉 Career",
                title: "Promotion Opportunity!",
                desc: `Your performance (${state.performance}%) and boss relationship (${state.career.bossRelationship}%) have been noticed. Position opening up.`,
                choices: [
                    {
                        text: "🎲 Go for the promotion",
                        effect: () => {
                            let bonus = Math.floor((state.performance - 50) / 5) + Math.floor((state.career.bossRelationship - 50) / 5) + allyHelp + rivalPenalty;
                            let check = rollWithModifier(state.skills.social + bonus, 13);
                            
                            if (check.nat20 || check.success) {
                                let currentSalary = job.salary;
                                let better = Object.entries(JOBS).find(([k, j]) => 
                                    j.salary > currentSalary && meetsRequirements(k)
                                );
                                if (better) {
                                    state.job = better[0];
                                    state.jobTitle = better[1].title;
                                    state.performance = 50;
                                    state.weeksAtJob = 0;
                                    state.happiness += check.nat20 ? 35 : 25;
                                    state.career.companiesWorked;
                                    state.career.bossRelationship = 50;
                                    addLog(`Promoted to ${better[1].title}`);
                                    let raise = better[1].salary - currentSalary;
                                    return { icon: check.nat20 ? "🌟" : "🎉", text: `${check.nat20 ? '[NAT 20!] ' : ''}Promoted to ${better[1].title}!`, stats: `+$${raise}/week, +${check.nat20 ? 35 : 25} Happiness` };
                                }
                            }
                            if (check.nat1) {
                                state.happiness -= 15;
                                state.career.promotionsDenied++;
                                state.career.bossRelationship -= 10;
                                return { icon: "💀", text: "[NAT 1!] You bombed the interview. Embarrassing.", stats: "-15 Happiness, -10 Boss rel" };
                            }
                            state.happiness -= 10;
                            state.career.promotionsDenied++;
                            return { icon: "😔", text: `[Rolled ${check.total} vs DC 13] Passed over. ${state.career.coworkerRival ? state.career.coworkerRival + ' got it.' : 'Not your time.'}`, stats: "-10 Happiness" };
                        }
                    },
                    {
                        text: "Negotiate a raise instead",
                        effect: () => {
                            let check = rollWithModifier(state.skills.social, 11);
                            if (check.success) {
                                let raise = Math.floor(job.salary * 0.15);
                                state.weeklyIncome += raise;
                                state.career.bossRelationship -= 3;
                                return { icon: "💵", text: `[Rolled ${check.total}] Raise negotiated!`, stats: `+$${raise}/week ongoing` };
                            }
                            return { icon: "🤷", text: `[Rolled ${check.total}] "Budget's tight." No raise.`, stats: "" };
                        }
                    }
                ]
            };
        }

        function getRandomLifeEvent() {
            let roll = Math.random();
            
            // ============ FAMILY HELP (when broke with wealthy family) ============
            if (state.money < 200 && Math.random() < 0.3) {
                let familyHelp = getFamilyHelpEvent();
                if (familyHelp) return familyHelp;
            }
            
            // ============ ATTRACTIVENESS "DOORS OPEN" EVENTS ============
            let attractiveness = state.currentAttractiveness || state.characterTraits?.attractiveness || 5;
            if (attractiveness >= 8 && Math.random() < 0.08) {
                return getAttractivenessBonusEvent();
            }
            
            // ============ RELATIONSHIP EVENTS ============
            
            // Meeting someone new (when single) - chance increases with social skills, attractiveness, and socializing
            let meetChance = 0.08; // Base 8% chance
            meetChance += (state.skills.social / 200); // +0-50% from social skills (up to +25% at 50 social)
            meetChance += ((state.currentAttractiveness || 5) - 5) * 0.02; // +/- up to 10% from attractiveness
            meetChance += (state.freeTimeMeetingBonus || 0); // Bonus from socializing in free time
            if (state.subscriptions.dating) meetChance += 0.05; // Dating apps premium bonus
            meetChance = Math.max(0.05, Math.min(0.50, meetChance)); // Clamp between 5% and 50%
            
            if (!state.hasPartner && roll < meetChance) {
                // Different meeting scenarios based on social level
                let meetingScenarios = [
                    { place: "at a coffee shop", social: 0 },
                    { place: "at the grocery store", social: 0 },
                    { place: "at a friend's party", social: 30 },
                    { place: "at a networking event", social: 40 },
                    { place: "through mutual friends", social: 35 },
                    { place: "at the gym", social: 20, req: () => state.fitness.gymMember },
                    { place: "at a work event", social: 25, req: () => state.employed },
                    { place: "at a bar with friends", social: 30 }
                ];
                
                let availableScenarios = meetingScenarios.filter(s => 
                    state.skills.social >= s.social && (!s.req || s.req())
                );
                let scenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
                
                return {
                    category: "Social",
                    title: "Someone Catches Your Eye",
                    desc: `You're ${scenario.place}—and you notice someone. They notice you back.`,
                    choices: [
                        {
                            text: "🎲 Say hello",
                            effect: () => {
                                let partner = generatePartner();
                                let check = rollWithModifier(state.skills.social + calculateAppeal(), 12);
                                
                                if (check.nat20) {
                                    state.hasPartner = true;
                                    state.partnerName = partner.name;
                                    state.partnerStats = partner;
                                    state.partnerStats.quality += 15;
                                    state.relationshipWeeks = 0;
                                    state.happiness += 20;
                                    state.relationship.datesCount = 0;
                                    addLog(`Started dating ${partner.name}`);
                                    return { icon: "💘", text: `[NAT 20!] Instant connection with ${partner.name}. This feels different.`, stats: "+20 Happiness, Great partner!" };
                                }
                                if (check.success) {
                                    state.hasPartner = true;
                                    state.partnerName = partner.name;
                                    state.partnerStats = partner;
                                    state.relationshipWeeks = 0;
                                    state.happiness += 15;
                                    state.relationship.datesCount = 0;
                                    addLog(`Started dating ${partner.name}`);
                                    return { icon: "💕", text: `[Rolled ${check.total}] You exchange numbers with ${partner.name}.`, stats: "+15 Happiness" };
                                }
                                if (check.nat1) {
                                    state.happiness -= 5;
                                    state.skills.social -= 1;
                                    return { icon: "😰", text: "[NAT 1!] You trip, spill coffee on them. Mortifying.", stats: "-5 Happiness, -1 Social" };
                                }
                                return { icon: "😅", text: `[Rolled ${check.total}] Awkward. They were just looking at their phone.`, stats: "" };
                            }
                        },
                        {
                            text: "Keep to yourself",
                            effect: () => {
                                return { icon: "😶", text: "The moment passes. Maybe next time.", stats: "" };
                            }
                        }
                    ]
                };
            }
            
            // DATE NIGHT (When dating, not recently dated)
            if (state.hasPartner && state.totalWeeks - state.relationship.lastDateWeek >= 3 && roll < 0.2) {
                let availableDates = Object.entries(DATE_ACTIVITIES).filter(([k, d]) => state.money >= d.cost);
                if (availableDates.length > 0) {
                    return {
                        category: "💕 Romance",
                        title: "Date Night",
                        desc: `${state.partnerName} wants to spend quality time together. What should you do?`,
                        choices: availableDates.slice(0, 4).map(([key, date]) => ({
                            text: `${date.icon} ${date.name} ($${date.cost})`,
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, date.dc);
                                state.money -= date.cost;
                                state.relationship.lastDateWeek = state.totalWeeks;
                                state.relationship.datesCount++;
                                
                                if (check.nat20) {
                                    state.partnerStats.supportiveness = Math.min(100, state.partnerStats.supportiveness + date.bondGain * 2);
                                    state.happiness += date.happinessGain * 1.5;
                                    return { icon: "💘", text: `[NAT 20!] Perfect ${date.name.toLowerCase()}! ${state.partnerName} says it's the best date ever.`, stats: `+${date.bondGain * 2} Bond, +${Math.floor(date.happinessGain * 1.5)} Happiness` };
                                }
                                if (check.success) {
                                    state.partnerStats.supportiveness = Math.min(100, state.partnerStats.supportiveness + date.bondGain);
                                    state.happiness += date.happinessGain;
                                    return { icon: date.icon, text: `[Rolled ${check.total}] Great ${date.name.toLowerCase()} with ${state.partnerName}.`, stats: `+${date.bondGain} Bond, +${date.happinessGain} Happiness` };
                                }
                                if (check.nat1) {
                                    state.partnerStats.supportiveness = Math.max(0, state.partnerStats.supportiveness - 5);
                                    state.relationship.arguments++;
                                    return { icon: "😬", text: `[NAT 1!] Everything went wrong. ${state.partnerName} seems frustrated.`, stats: "-5 Bond, Argument" };
                                }
                                state.partnerStats.supportiveness = Math.min(100, state.partnerStats.supportiveness + Math.floor(date.bondGain / 2));
                                state.happiness += Math.floor(date.happinessGain / 2);
                                return { icon: "🙂", text: `[Rolled ${check.total}] Decent date. Could've been better.`, stats: `+${Math.floor(date.bondGain / 2)} Bond` };
                            }
                        }))
                    };
                }
            }
            
            // MEET THE FAMILY (After 6 months dating)
            if (state.hasPartner && !state.relationship.metFamily && state.relationshipWeeks >= 26 && roll < 0.15) {
                return {
                    category: "Milestone",
                    title: "Meet the Parents",
                    desc: `${state.partnerName} wants you to meet their family. This is big.`,
                    choices: [
                        {
                            text: "🎲 Make a good impression",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 13);
                                state.relationship.metFamily = true;
                                state.stress += 10;
                                
                                if (check.nat20) {
                                    state.relationship.familyApproval = 90;
                                    state.partnerStats.supportiveness += 15;
                                    state.happiness += 15;
                                    return { icon: "🌟", text: `[NAT 20!] They LOVE you. "${state.partnerName} found a keeper."`, stats: "+90 Family approval, +15 Bond" };
                                }
                                if (check.success) {
                                    state.relationship.familyApproval = 70;
                                    state.partnerStats.supportiveness += 8;
                                    state.happiness += 10;
                                    return { icon: "😊", text: `[Rolled ${check.total}] Dinner went well. They seem to like you.`, stats: "+70 Family approval, +8 Bond" };
                                }
                                if (check.nat1) {
                                    state.relationship.familyApproval = 20;
                                    state.partnerStats.supportiveness -= 5;
                                    state.happiness -= 10;
                                    return { icon: "💀", text: `[NAT 1!] You spilled wine, told a bad joke, and called their mom by the wrong name.`, stats: "+20 Family approval (ouch), -5 Bond" };
                                }
                                state.relationship.familyApproval = 50;
                                return { icon: "😐", text: `[Rolled ${check.total}] Mixed reactions. They're "reserving judgment."`, stats: "+50 Family approval" };
                            }
                        },
                        {
                            text: "Not ready for this",
                            effect: () => {
                                state.partnerStats.supportiveness -= 8;
                                state.stress -= 10;
                                return { icon: "😬", text: `${state.partnerName} is disappointed but understands.`, stats: "-8 Bond" };
                            }
                        }
                    ]
                };
            }
            
            // MOVE IN TOGETHER (After 1 year, not living together)
            if (state.hasPartner && !state.relationship.livingTogether && state.relationshipWeeks >= 52 && roll < 0.12) {
                return {
                    category: "💕 Milestone",
                    title: "Move In Together?",
                    desc: `${state.partnerName} suggests getting a place together. Split rent, share space, take the plunge.`,
                    choices: [
                        {
                            text: "Yes, let's do it!",
                            effect: () => {
                                state.relationship.livingTogether = true;
                                state.home = 'apartment';
                                state.weeklyExpenses -= 75; // Shared costs
                                state.partnerStats.supportiveness += 15;
                                state.happiness += 20;
                                addLog(`Moved in with ${state.partnerName}`);
                                return { icon: "🏠", text: `You and ${state.partnerName} find a place. New chapter begins.`, stats: "+15 Bond, +20 Happiness, -$75/week expenses" };
                            }
                        },
                        {
                            text: "Too soon",
                            effect: () => {
                                state.partnerStats.supportiveness -= 10;
                                return { icon: "🤔", text: `${state.partnerName} tries to hide their disappointment.`, stats: "-10 Bond" };
                            }
                        }
                    ]
                };
            }
            
            // RELATIONSHIP CRISIS (Random when in relationship)
            if (state.hasPartner && state.relationshipWeeks >= 20 && roll < 0.05) {
                let crisis = RELATIONSHIP_CRISES[Math.floor(Math.random() * RELATIONSHIP_CRISES.length)];
                return {
                    category: "💔 Crisis",
                    title: crisis.name,
                    desc: crisis.desc,
                    choices: [
                        {
                            text: "🎲 Work through it together",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social + Math.floor(state.partnerStats.supportiveness / 5), crisis.dc);
                                
                                if (check.nat20) {
                                    state.partnerStats.supportiveness += 10;
                                    state.happiness += 10;
                                    state.relationship.arguments++;
                                    return { icon: "💪", text: `[NAT 20!] You both come out stronger. This was a turning point.`, stats: "+10 Bond, +10 Happiness" };
                                }
                                if (check.success) {
                                    state.partnerStats.supportiveness -= Math.floor(crisis.bondLoss / 3);
                                    state.stress += 10;
                                    state.relationship.arguments++;
                                    return { icon: "🤝", text: `[Rolled ${check.total} vs DC ${crisis.dc}] You talked it out. Things are better.`, stats: `-${Math.floor(crisis.bondLoss / 3)} Bond, +10 Stress` };
                                }
                                if (check.nat1) {
                                    if (state.partnerStats.supportiveness < 30) {
                                        state.hasPartner = false;
                                        state.partnerName = null;
                                        state.happiness -= 35;
                                        addLog("Relationship ended in crisis");
                                        return { icon: "💔", text: `[NAT 1!] The fight escalated. They're gone.`, stats: "Relationship ended, -35 Happiness" };
                                    }
                                    state.partnerStats.supportiveness -= crisis.bondLoss * 1.5;
                                    state.stress += 25;
                                    return { icon: "😢", text: `[NAT 1!] Made it worse. Things are really bad now.`, stats: `-${Math.floor(crisis.bondLoss * 1.5)} Bond, +25 Stress` };
                                }
                                state.partnerStats.supportiveness -= crisis.bondLoss;
                                state.stress += 15;
                                state.relationship.arguments++;
                                return { icon: "😔", text: `[Rolled ${check.total} vs DC ${crisis.dc}] Unresolved tension. This might come up again.`, stats: `-${crisis.bondLoss} Bond, +15 Stress` };
                            }
                        },
                        {
                            text: "Suggest couples counseling ($200)",
                            condition: () => state.money >= 200,
                            effect: () => {
                                state.money -= 200;
                                state.partnerStats.supportiveness += 5;
                                state.stress -= 10;
                                state.relationship.arguments++;
                                return { icon: "🛋️", text: "Professional help. Smart move. Things improve gradually.", stats: "-$200, +5 Bond, -10 Stress" };
                            }
                        }
                    ]
                };
            }
            
            // PROPOSAL EVENT (After 1.5 years, not married)
            if (state.hasPartner && !state.married && state.relationshipWeeks >= 78 && roll < 0.1) {
                let bondLevel = state.partnerStats.supportiveness;
                return {
                    category: "💍 Romance",
                        title: "Getting Serious",
                    desc: `You and ${state.partnerName} have been together ${Math.floor(state.relationshipWeeks / 52)} years. Maybe it's time?`,
                        choices: [
                            {
                            text: "💍 Propose! ($2,000 ring)",
                                condition: () => state.money >= 2000,
                                effect: () => {
                                    state.money -= 2000;
                                let successChance = bondLevel / 100 + (state.relationship.familyApproval > 60 ? 0.1 : 0);
                                
                                if (Math.random() < successChance) {
                                        state.married = true;
                                    state.happiness += 35;
                                    state.partnerStats.supportiveness += 20;
                                        state.achievements.push('Married');
                                        addLog(`Married ${state.partnerName}`);
                                    return { icon: "💒", text: `${state.partnerName} said YES! Wedding planning begins!`, stats: "-$2,000, +35 Happiness, +20 Bond, MARRIED!" };
                                }
                                state.partnerStats.supportiveness -= 25;
                                state.happiness -= 25;
                                return { icon: "💔", text: `They said no. "I'm not ready." Devastating.`, stats: "-$2,000, -25 Bond, -25 Happiness" };
                            }
                        },
                        {
                            text: "💎 Propose big ($5,000 ring)",
                            condition: () => state.money >= 5000,
                            effect: () => {
                                state.money -= 5000;
                                let successChance = Math.min(0.95, bondLevel / 100 + 0.2);
                                
                                if (Math.random() < successChance) {
                                    state.married = true;
                                    state.happiness += 40;
                                    state.partnerStats.supportiveness += 25;
                                    state.achievements.push('Married');
                                    addLog(`Married ${state.partnerName}`);
                                    return { icon: "💒", text: `${state.partnerName} is overwhelmed! YES! The ring is perfect!`, stats: "-$5,000, +40 Happiness, MARRIED!" };
                                }
                                state.partnerStats.supportiveness -= 20;
                                    state.happiness -= 30;
                                return { icon: "💔", text: `Even the big ring wasn't enough. "I need time."`, stats: "-$5,000, -20 Bond, -30 Happiness" };
                                }
                            },
                            {
                            text: "Not yet",
                                effect: () => {
                                return { icon: "🤔", text: "No rush. When it's right, it's right.", stats: "" };
                                }
                            }
                        ]
                    };
                }
            
            // HAVING CHILDREN (Married, no kids or wanting more)
            if (state.married && state.relationship.children < 3 && getAge() >= 25 && getAge() <= 42 && roll < 0.08) {
                return {
                    category: "👶 Family",
                    title: state.relationship.children === 0 ? "Starting a Family?" : "Another Child?",
                    desc: state.relationship.children === 0 ? 
                        `${state.partnerName} brings up having kids. "Are we ready?"` :
                        `${state.partnerName} mentions giving your ${state.relationship.children === 1 ? 'child' : 'kids'} a sibling.`,
                    choices: [
                        {
                            text: "Let's try!",
                            effect: () => {
                                if (Math.random() < 0.7) {
                                    let childName = CHILD_NAMES[Math.floor(Math.random() * CHILD_NAMES.length)];
                                    state.relationship.children++;
                                    state.relationship.childrenAges.push(0);
                                    state.happiness += 30;
                                    state.stress += 20;
                                    state.weeklyExpenses += 100; // Child costs
                                    state.partnerStats.supportiveness += 15;
                                    addLog(`Baby ${childName} born!`);
                                    state.achievements.push(state.relationship.children === 1 ? 'Parent' : `Parent of ${state.relationship.children}`);
                                    return { icon: "👶", text: `Months later... Baby ${childName} arrives! Everything changes.`, stats: `+30 Happiness, +20 Stress, +$100/week expenses, +15 Bond` };
                                }
                                state.stress += 10;
                                return { icon: "😔", text: "Tried for a while. Not this time. You'll keep trying.", stats: "+10 Stress" };
                            }
                        },
                        {
                            text: "Not now",
                            effect: () => {
                                if (state.relationship.children === 0) {
                                    state.partnerStats.supportiveness -= 5;
                                }
                                return { icon: "🤔", text: "Maybe later. Focus on other things for now.", stats: state.relationship.children === 0 ? "-5 Bond" : "" };
                            }
                        }
                    ]
                };
            }
            
            // PARENTING EVENTS (When have children)
            if (state.relationship.children > 0 && roll < 0.12) {
                // Age up children annually
                state.relationship.childrenAges = state.relationship.childrenAges.map(age => {
                    if (state.totalWeeks % 52 === 0) return age + 1;
                    return age;
                });
                
                // Find applicable parenting event
                let childAge = state.relationship.childrenAges[0] || 0;
                let events = PARENTING_EVENTS.filter(e => childAge >= e.age && childAge < e.age + 3);
                
                if (events.length > 0) {
                    let event = events[Math.floor(Math.random() * events.length)];
                    return {
                        category: "👨‍👩‍👧 Parenting",
                        title: event.title,
                        desc: event.desc,
                        choices: [
                            {
                                text: "Be fully present. Put everything else aside.",
                                effect: () => {
                                    state.energy += event.energy;
                                    state.stress += event.stress;
                                    state.happiness += event.happiness + 5;
                                    if (state.partnerStats) state.partnerStats.supportiveness += event.bond + 3;
                                    state.neglect.relationship = 0;
                                    
                                    return { icon: "❤️", text: `You're there. Really there. These moments matter.`, stats: `+${event.happiness + 5} Happiness` };
                                }
                            },
                            {
                                text: "Be there, but keep one eye on your phone.",
                                effect: () => {
                                    state.energy += Math.floor(event.energy / 2);
                                    state.stress += Math.floor(event.stress / 2);
                                    state.happiness += Math.floor(event.happiness / 2);
                                    if (state.partnerStats) state.partnerStats.supportiveness += Math.floor(event.bond / 2);
                                    
                                    return { icon: "📱", text: `You were there... mostly. Phone in hand.`, stats: `` };
                                }
                            },
                            {
                                text: `Let ${state.partnerName || 'your partner'} handle this one.`,
                                condition: () => state.hasPartner,
                                effect: () => {
                                    state.energy += 15;
                                    state.partnerStats.supportiveness -= 8;
                                    state.stress -= 5;
                                    state.neglect.relationship += 1;
                                    
                                    return { icon: "🚪", text: `${state.partnerName} gives you a look. "I've got it. Again."`, stats: `` };
                                }
                            },
                            {
                                text: "Throw some money at the problem.",
                                condition: () => state.money >= 100,
                                effect: () => {
                                    state.money -= 100;
                                    state.energy += event.energy + 10;
                                    state.stress += Math.max(0, event.stress - 10);
                                    state.happiness += event.happiness;
                                    if (state.partnerStats) state.partnerStats.supportiveness += event.bond;
                                    
                                    return { icon: "💳", text: `Hired help, bought the thing, made it easier.`, stats: `-$100` };
                                }
                            }
                        ]
                    };
                }
            }
            
            // ============ OTHER LIFE EVENTS ============
            
            // Health events
            if (roll < 0.35 && state.health < 70) {
                return {
                    category: "Health",
                    title: "Feeling Run Down",
                    desc: "Your body is telling you to slow down. Headaches, fatigue, the works.",
                    choices: [
                        {
                            text: "See a doctor ($100)",
                            condition: () => state.money >= 100,
                            effect: () => {
                                state.money -= 100;
                                state.health = Math.min(100, state.health + 15);
                                return { icon: "🏥", text: "Doctor says rest and vitamins. You feel better.", stats: "-$100, +15 Health" };
                            }
                        },
                        {
                            text: "Push through it",
                            effect: () => {
                                state.health -= 5;
                                return { icon: "😤", text: "No time to be sick. You'll be fine.", stats: "-5 Health" };
                            }
                        },
                        {
                            text: "Take a sick day",
                            effect: () => {
                                state.health += 10;
                                state.energy += 20;
                                if (state.employed) state.performance -= 3;
                                return { icon: "🛏️", text: "Rest does wonders.", stats: "+10 Health, +20 Energy" };
                            }
                        }
                    ]
                };
            }
            
            // Housing upgrade
            if (roll < 0.4 && state.home === 'parents' && (state.employed || getAge() > 22)) {
                return {
                    category: "Independence",
                    title: "Time to Move Out?",
                    desc: "Living at home has its perks, but maybe it's time for your own space.",
                    choices: [
                        {
                            text: "Rent a room ($100/week)",
                            condition: () => state.money >= 400,
                            effect: () => {
                                state.money -= 400;
                                state.home = 'room';
                                state.happiness += 10;
                                addLog("Moved out of parents' house");
                                return { icon: "🚪", text: "Small room, but it's YOURS.", stats: "-$400, +10 Happiness" };
                            }
                        },
                        {
                            text: "Get an apartment ($200/week)",
                            condition: () => state.money >= 1000 && state.weeklyIncome >= 400,
                            effect: () => {
                                state.money -= 1000;
                                state.home = 'apartment';
                                state.happiness += 20;
                                addLog("Got own apartment");
                                return { icon: "🏢", text: "Your own apartment! Real adult stuff.", stats: "-$1,000, +20 Happiness" };
                            }
                        },
                        {
                            text: "Stay home a bit longer",
                            effect: () => {
                                state.happiness -= 3;
                                return { icon: "🏠", text: "Saving money is smart. Even if it's embarrassing.", stats: "-3 Happiness" };
                            }
                        }
                    ]
                };
            }
            
            // ============ PARTNER SUPPORT/BURDEN EVENTS ============
            if (state.hasPartner && state.partnerStats?.personality && Math.random() < 0.06) {
                let trait = state.partnerStats.personality.trait;
                let flaw = state.partnerStats.personality.flaw;
                let bond = state.partnerStats.supportiveness || 50;
                let partnerName = state.partnerName;
                
                // High stress = partner trait matters more
                if (state.stress > 60 && bond >= 50) {
                    // Supportive partner helps
                    let supportBonus = PARTNER_TRAITS[trait]?.stress || 0;
                    if (supportBonus < 0 || trait === 'Supportive' || trait === 'Caring' || trait === 'Calm') {
                        return {
                            category: "💕 Support",
                            title: `${partnerName} Notices`,
                            desc: `${partnerName} can tell you've been stressed. "${trait === 'Supportive' ? "Hey, talk to me. What's going on?" : trait === 'Caring' ? "I made your favorite dinner. You look like you need it." : "Let's just relax tonight, okay?"}"`,
                            choices: [
                                {
                                    text: "Open up to them",
                                    effect: () => {
                                        state.stress -= 15;
                                        state.happiness += 10;
                                        state.partnerStats.supportiveness = Math.min(100, bond + 5);
                                        return { icon: "💕", text: `Talking it out helps. ${partnerName} really understands you.`, stats: "-15 Stress, +10 Happy, +5 Bond" };
                                    }
                                },
                                {
                                    text: "Appreciate their support silently",
                                    effect: () => {
                                        state.stress -= 8;
                                        state.happiness += 5;
                                        return { icon: "🫂", text: `Just their presence helps.`, stats: "-8 Stress, +5 Happy" };
                                    }
                                }
                            ]
                        };
                    }
                }
                
                // Partner's flaw causing problems
                if (Math.random() < 0.5 && bond < 70) {
                    let flawEffect = PARTNER_FLAWS[flaw];
                    if (flawEffect && (flawEffect.stress > 0 || flawEffect.happiness < 0)) {
                        let scenarios = {
                            'Jealous': { 
                                desc: `${partnerName} gets upset because you were talking to a coworker. "Who was that? Why were you smiling so much?"`,
                                apologize: { stress: 10, text: "You try to reassure them. It's exhausting." },
                                standup: { stress: 5, bond: -10, text: "This is getting old. You push back." }
                            },
                            'Moody': {
                                desc: `${partnerName} comes home in a terrible mood and takes it out on you over nothing.`,
                                apologize: { stress: 12, text: "You walk on eggshells, trying not to make it worse." },
                                standup: { stress: 8, bond: -8, text: "You're not their punching bag. You say so." }
                            },
                            'Critical': {
                                desc: `${partnerName} criticizes how you handled something at work. Again. "You should have done it differently."`,
                                apologize: { happiness: -8, text: "Maybe they're right? Your confidence takes a hit." },
                                standup: { stress: 5, bond: -5, text: "You don't need constant criticism from your partner." }
                            },
                            'Spender': {
                                desc: `${partnerName} bought something expensive. Again. "But it was on sale!"`,
                                apologize: { money: -200, stress: 8, text: "You let it go, but the bank account suffers." },
                                standup: { stress: 10, bond: -10, text: "A fight about money. Fun." }
                            },
                            'Clingy': {
                                desc: `${partnerName} is upset you want to see friends without them. "Why can't I come?"`,
                                apologize: { social: -1, stress: 5, text: "You cancel plans to keep the peace." },
                                standup: { stress: 8, bond: -5, text: "You need space sometimes. They don't get it." }
                            }
                        };
                        
                        let scenario = scenarios[flaw];
                        if (scenario) {
                            return {
                                category: "😤 Relationship Tension",
                                title: `${flaw} Partner Moment`,
                                desc: scenario.desc,
                                choices: [
                                    {
                                        text: "Try to keep the peace",
                                        effect: () => {
                                            let eff = scenario.apologize;
                                            if (eff.stress) state.stress += eff.stress;
                                            if (eff.happiness) state.happiness += eff.happiness;
                                            if (eff.money) state.money += eff.money;
                                            if (eff.social) state.skills.social = Math.max(0, state.skills.social + eff.social);
                                            return { icon: "😔", text: eff.text, stats: Object.keys(eff).filter(k => k !== 'text').map(k => k === 'money' ? `$${eff[k]}` : `${eff[k] > 0 ? '+' : ''}${eff[k]} ${k}`).join(', ') };
                                        }
                                    },
                                    {
                                        text: "Stand up for yourself",
                                        effect: () => {
                                            let eff = scenario.standup;
                                            if (eff.stress) state.stress += eff.stress;
                                            if (eff.bond) state.partnerStats.supportiveness = Math.max(10, bond + eff.bond);
                                            return { icon: "💪", text: eff.text, stats: Object.keys(eff).filter(k => k !== 'text').map(k => k === 'bond' ? `${eff[k]} Bond` : `${eff[k] > 0 ? '+' : ''}${eff[k]} ${k}`).join(', ') };
                                        }
                                    }
                                ]
                            };
                        }
                    }
                }
            }
            
            // ============ LONELINESS EVENT ============
            if (!state.hasPartner && state.loneliness >= 40 && Math.random() < 0.08) {
                let lonelyDesc = getLonelinessDescription();
                let age = getAge();
                
                if (state.loneliness >= 70) {
                    return {
                        category: "💔 Loneliness",
                        title: "The Weight of Solitude",
                        desc: `Another weekend alone. ${age >= 30 ? "Your friends are all married with kids. " : ""}The silence in your home is deafening. You wonder if you'll ever find someone.`,
                        choices: [
                            {
                                text: "Download a dating app",
                                effect: () => {
                                    state.loneliness -= 10;
                                    openDatingModal();
                                    return null;
                                }
                            },
                            {
                                text: "Call a friend",
                                condition: () => state.friends?.length > 0,
                                effect: () => {
                                    state.loneliness -= 15;
                                    state.happiness += 5;
                                    if (state.friends[0]) state.friends[0].lastContact = state.week;
                                    return { icon: "📞", text: "Talking helps. You're not completely alone.", stats: "-15 Loneliness, +5 Happy" };
                                }
                            },
                            {
                                text: "Distract yourself with work",
                                effect: () => {
                                    state.skills.technical += 2;
                                    state.stress += 10;
                                    return { icon: "💻", text: "Bury the feelings in productivity.", stats: "+2 Technical, +10 Stress" };
                                }
                            },
                            {
                                text: "Wallow in self-pity",
                                effect: () => {
                                    state.happiness -= 10;
                                    state.stress += 5;
                                    state.loneliness += 5;
                                    return { icon: "😭", text: "Sometimes you need to feel it.", stats: "-10 Happy, +5 Stress, +5 Loneliness" };
                                }
                            }
                        ]
                    };
                } else {
                    return {
                        category: "💭 Reflection",
                        title: "Single Life",
                        desc: `You catch yourself ${age >= 25 ? "scrolling through happy couples on social media" : "feeling envious of couples at the coffee shop"}. Being single has its freedoms, but sometimes you wish you had someone.`,
                        choices: [
                            {
                                text: "Put yourself out there",
                                effect: () => {
                                    state.skills.social += 2;
                                    state.loneliness -= 5;
                                    return { icon: "🌟", text: "Time to be more social. Someone's out there.", stats: "+2 Social, -5 Loneliness" };
                                }
                            },
                            {
                                text: "Focus on self-improvement",
                                effect: () => {
                                    state.happiness += 3;
                                    state.skills.physical += 1;
                                    return { icon: "💪", text: "Work on yourself first. Love will come.", stats: "+3 Happy, +1 Physical" };
                                }
                            },
                            {
                                text: "It's fine, I like being alone",
                                effect: () => {
                                    if (state.loneliness < 50) {
                                        state.stress -= 5;
                                        return { icon: "🧘", text: "Independence has its benefits.", stats: "-5 Stress" };
                                    }
                                    state.loneliness += 5;
                                    return { icon: "🤷", text: "Are you convincing yourself?", stats: "+5 Loneliness" };
                                }
                            }
                        ]
                    };
                }
            }
            
            // ============ BUSINESS OPPORTUNITY ============
            if (!state.business.active && !state.criminal.inJail && (state.employed || state.money > 5000) && Math.random() < 0.05) {
                return {
                    category: "💼 Entrepreneurship",
                    title: "Business Opportunity",
                    desc: "You've been thinking about starting your own business. Maybe it's time to take the leap?",
                    choices: [
                        {
                            text: "🏢 Explore business options",
                            effect: () => {
                                openBusinessModal();
                                return null;
                            }
                        },
                        {
                            text: "Not ready yet",
                            effect: () => {
                                return { icon: "🤔", text: "Maybe someday. For now, the steady paycheck is fine.", stats: "" };
                            }
                        }
                    ]
                };
            }
            
            // ============ CRIME OPPORTUNITY ============
            if (!state.criminal.inJail && Math.random() < 0.04) {
                return {
                    category: "🌙 Shady Opportunity",
                    title: "The Underground",
                    desc: state.criminal.connections > 0 ? 
                        "Your criminal contacts reach out. There might be work available if you're interested." :
                        "A sketchy character approaches you. 'Looking to make some easy money?' They could introduce you to... opportunities.",
                    choices: [
                        {
                            text: "🔥 Explore criminal activities",
                            effect: () => {
                                openCrimeModal();
                                return null;
                            }
                        },
                        {
                            text: "Walk away",
                            effect: () => {
                                state.criminal.heatLevel = Math.max(0, state.criminal.heatLevel - 5);
                                return { icon: "🚶", text: "You keep your nose clean. Smart.", stats: "-5 Heat" };
                            }
                        }
                    ]
                };
            }
            
            // ============ MAKE A NEW FRIEND ============
            if (state.friends.length < state.maxFriends && Math.random() < 0.08) {
                let location = state.employed ? 'work' : 
                              state.phase === 'education' ? 'school' : 
                              Math.random() < 0.5 ? 'the gym' : 'a local event';
                let potentialFriend = generateFriend(location);
                
                return {
                    category: "👥 Social",
                    title: "New Connection",
                    desc: `You hit it off with ${potentialFriend.name} at ${location}. They seem ${potentialFriend.trait}. Want to exchange numbers?`,
                    choices: [
                        {
                            text: `Add ${potentialFriend.name} as a friend`,
                            effect: () => {
                                if (addFriend(potentialFriend)) {
                                    state.happiness += 5;
                                    state.skills.social += 1;
                                    addLog(`Made a new friend: ${potentialFriend.name}`);
                                    return { icon: "👋", text: `${potentialFriend.name} is now your friend! Stay in touch.`, stats: "+1 Friend, +5 Happy, +1 Social" };
                                }
                                return { icon: "😕", text: "Your social circle is full. Maybe later.", stats: "" };
                            }
                        },
                        {
                            text: "Politely decline",
                            effect: () => {
                                return { icon: "🤷", text: "Nice meeting them, but you're not looking for new friends.", stats: "" };
                            }
                        }
                    ]
                };
            }
            
            // ============ FISHING OPPORTUNITY ============
            if (Math.random() < 0.06) {
                return {
                    category: "🌳 Recreation",
                    title: "Perfect Day for Fishing",
                    desc: "The weather is beautiful - ideal for a relaxing fishing trip. Where would you like to go?",
                    choices: [
                        {
                            text: "🏞️ Local Pond (Free)",
                            effect: () => {
                                goFishing('pond');
                                return null;
                            }
                        },
                        {
                            text: "🌊 Lake ($10)",
                            condition: () => state.money >= 10,
                            effect: () => {
                                goFishing('lake');
                                return null;
                            }
                        },
                        {
                            text: "🏞️ River ($15)",
                            condition: () => state.money >= 15,
                            effect: () => {
                                goFishing('river');
                                return null;
                            }
                        },
                        {
                            text: "Maybe another time",
                            effect: () => {
                                return { icon: "🤷", text: "There's always next weekend.", stats: "" };
                            }
                        }
                    ]
                };
            }
            
            return null;
        }

        function getRandomLifeEvents() {
            let event = getRandomLifeEvent();
            if (event) return [event];
            
            let roll = Math.random();
            
            // GYM MEMBERSHIP OPPORTUNITY
            if (!state.fitness.gymMember && roll < 0.05 && !isEventOnCooldown('gym_membership_offer', 20)) {
                return [{
                    id: 'gym_membership_offer',
                    cooldown: true,
                    category: "💪 Self-Improvement",
                    title: "Gym Membership Offer",
                    desc: "A new gym opened nearby with a special offer. $50/week gets you full access.",
                    choices: [
                        {
                            text: "Sign up for the gym",
                            condition: () => state.money >= 50,
                            effect: () => {
                                state.fitness.gymMember = true;
                                state.weeklyExpenses += 50;
                                state.stress += 10; // Starting is hard
                                state.happiness += 5;
                                return { icon: "🏋️", text: "New gym member! The first few weeks will be tough, but it'll pay off.", stats: "+$50/week expense, +10 Stress (temporary)" };
                            }
                        },
                        {
                            text: "Not right now",
                            effect: () => {
                                return { icon: "🤷", text: "Maybe someday. Just not today.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // CANCEL GYM (if paying but not going)
            if (state.fitness.gymMember && state.fitness.workoutStreak < 2 && roll < 0.03 && !isEventOnCooldown('gym_review', 12)) {
                return [{
                    id: 'gym_review',
                    cooldown: true,
                    category: "💪 Fitness",
                    title: "Gym Review",
                    desc: "You've been paying for the gym but haven't really been going. Keep the membership?",
                    choices: [
                        {
                            text: "Keep it, recommit to going",
                            effect: () => {
                                state.stress += 5;
                                return { icon: "💪", text: "Renewed commitment. This time you'll stick with it.", stats: "+5 Stress (guilt)" };
                            }
                        },
                        {
                            text: "Cancel the membership",
                            effect: () => {
                                state.fitness.gymMember = false;
                                state.weeklyExpenses -= 50;
                                state.money += 50; // Refund for this week
                                return { icon: "🚪", text: "Cancelled. At least you're not wasting money anymore.", stats: "-$50/week expense" };
                            }
                        }
                    ]
                }];
            }
            
            // HEALTHY EATING OPPORTUNITY
            if (!state.fitness.healthyEating && roll < 0.04) {
                return [{
                    category: "🥗 Self-Improvement",
                    title: "Clean Eating Challenge",
                    desc: "A friend is doing a 'clean eating' challenge. Meal prep, no junk food, the works. Join them? Costs about $30 extra per week for better groceries.",
                    choices: [
                        {
                            text: "Start eating healthier",
                            effect: () => {
                                state.fitness.healthyEating = true;
                                state.weeklyExpenses += 30;
                                state.health += 3;
                                return { icon: "🥬", text: "Week one: kale smoothies and lean proteins. This better be worth it.", stats: "+$30/week expense, +3 Health" };
                            }
                        },
                        {
                            text: "Pizza is a vegetable, right?",
                            effect: () => {
                                state.happiness += 3;
                                return { icon: "🍕", text: "Life's too short for sad salads.", stats: "+3 Happy" };
                            }
                        }
                    ]
                }];
            }
            
            // QUIT HEALTHY EATING
            if (state.fitness.healthyEating && Math.random() < 0.03) {
                return [{
                    category: "🍔 Temptation",
                    title: "Craving Junk Food",
                    desc: "The smell of fresh pizza, burgers, fries... Your healthy eating streak is being tested.",
                    choices: [
                        {
                            text: "Stay strong. Eat the salad.",
                            effect: () => {
                                state.health += 2;
                                state.stress += 3;
                                return { icon: "💪", text: "Discipline. The cravings will pass.", stats: "+2 Health, +3 Stress" };
                            }
                        },
                        {
                            text: "Give in just this once",
                            effect: () => {
                                state.happiness += 8;
                                state.health -= 2;
                                return { icon: "🍔", text: "SO good. Worth it? Maybe. Probably.", stats: "+8 Happy, -2 Health" };
                            }
                        },
                        {
                            text: "Quit healthy eating entirely",
                            effect: () => {
                                state.fitness.healthyEating = false;
                                state.weeklyExpenses -= 30;
                                state.happiness += 5;
                                return { icon: "🎉", text: "Freedom! Back to normal food.", stats: "-$30/week expense, +5 Happy" };
                            }
                        }
                    ]
                }];
            }
            
            // GYM SESSION EVENT (when member)
            if (state.fitness.gymMember && Math.random() < 0.15) {
                return [{
                    category: "🏋️ Fitness",
                    title: "Gym Time",
                    desc: state.fitness.routineEstablished 
                        ? "Time for your regular workout. It's become part of your routine now."
                        : "Time to hit the gym. It's still hard to motivate yourself.",
                    choices: [
                        {
                            text: "Get a solid workout in",
                            effect: () => {
                                state.energy -= 15;
                                state.skills.physical += 1;
                                state.health += 2;
                                if (state.fitness.routineEstablished) {
                                    state.stress -= 5;
                                    state.happiness += 3;
                                    return { icon: "💪", text: "Great session! Working out feels good now.", stats: "+1 Physical, +2 Health, -5 Stress" };
                                } else {
                                    state.stress += 3;
                                    return { icon: "😤", text: "Ugh. Done. Everything hurts.", stats: "+1 Physical, +2 Health, +3 Stress" };
                                }
                            }
                        },
                        {
                            text: "Skip it today",
                            effect: () => {
                                state.fitness.workoutStreak = Math.max(0, state.fitness.workoutStreak - 1);
                                state.energy += 10;
                                if (state.fitness.workoutStreak === 0) {
                                    return { icon: "🛋️", text: "Rest day. Again. The streak is broken.", stats: "+10 Energy, Lost workout streak" };
                                }
                                return { icon: "🛋️", text: "Taking it easy today.", stats: "+10 Energy" };
                            }
                        }
                    ]
                }];
            }
            
            // ============ CREDIT CARD EVENTS ============
            
            // CREDIT CARD OFFER (when you don't have one)
            if (!state.finances.hasCreditCard && state.employed && Math.random() < 0.06) {
                // APR based on credit score (higher score = lower rate)
                let apr = getCreditCardAPR(state.finances.creditScore);
                let limit = getCreditCardLimit(state.finances.creditScore, state.weeklyIncome || 0);
                let aprPercent = (apr * 100).toFixed(1);
                
                let cardQuality = state.finances.creditScore >= 750 ? "Premium" : 
                                 state.finances.creditScore >= 650 ? "Standard" : "Basic";
                
                return [{
                    category: "💳 Finance",
                    title: "Credit Card Offer",
                    desc: `You've been pre-approved for a ${cardQuality} credit card! Limit: $${limit.toLocaleString()}, APR: ${aprPercent}%.`,
                    choices: [
                        {
                            text: "Accept the card - could be useful",
                            effect: () => {
                                state.finances.hasCreditCard = true;
                                state.finances.creditLimit = limit;
                                state.finances.creditAPR = apr;
                                state.finances.creditBalance = 0;
                                addLog(`Got credit card: $${limit} limit at ${aprPercent}% APR`);
                                return { icon: "💳", text: `New credit card! $${limit.toLocaleString()} limit. Use wisely—that ${aprPercent}% APR adds up fast.`, stats: `Credit Limit: $${limit.toLocaleString()}` };
                            }
                        },
                        {
                            text: "No thanks - too risky",
                            effect: () => {
                                return { icon: "✋", text: "Credit cards can be a trap. Better to stick with what you have.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // USE CREDIT CARD (when broke but have a card)
            if (state.finances.hasCreditCard && state.money < 50 && state.finances.creditBalance < state.finances.creditLimit * 0.9 && Math.random() < 0.25) {
                let availableCredit = state.finances.creditLimit - state.finances.creditBalance;
                let suggestedAmount = Math.min(availableCredit, 500);
                
                return [{
                    category: "💳 Finance",
                    title: "Running Low on Cash",
                    desc: `Your wallet is nearly empty, but you have $${availableCredit.toLocaleString()} available on your credit card. The ${(state.finances.creditAPR * 100).toFixed(1)}% interest rate looms...`,
                    choices: [
                        {
                            text: "Put some expenses on the card ($200)",
                            condition: () => availableCredit >= 200,
                            effect: () => {
                                state.finances.creditBalance += 200;
                                state.money += 200;
                                state.stress -= 5;
                                return { icon: "💳", text: "Swiped. That's future-you's problem.", stats: "+$200 cash, +$200 credit card debt, -5 Stress" };
                            }
                        },
                        {
                            text: "Max it out - desperate times ($" + Math.min(500, availableCredit) + ")",
                            condition: () => availableCredit >= 300,
                            effect: () => {
                                let amount = Math.min(500, availableCredit);
                                state.finances.creditBalance += amount;
                                state.money += amount;
                                state.stress -= 8;
                                return { icon: "💳", text: "Big swipe. The interest is going to hurt later.", stats: `+$${amount} cash, +$${amount} credit card debt, -8 Stress` };
                            }
                        },
                        {
                            text: "Resist the temptation",
                            effect: () => {
                                state.stress += 5;
                                return { icon: "😤", text: "Stay disciplined. Don't dig deeper into debt.", stats: "+5 Stress" };
                            }
                        }
                    ]
                }];
            }
            
            // CREDIT CARD PAYMENT DUE (monthly when you have a balance)
            if (state.finances.hasCreditCard && state.finances.creditBalance > 0 && state.totalWeeks % 4 === 0 && Math.random() < 0.8) {
                let balance = state.finances.creditBalance;
                let minPayment = Math.max(25, Math.ceil(balance * 0.02));
                let apr = (state.finances.creditAPR * 100).toFixed(1);
                
                return [{
                    category: "💳 Finance",
                    title: "Credit Card Statement",
                    desc: `Your credit card bill arrived. Balance: $${balance.toLocaleString()}. Minimum payment: $${minPayment}. APR: ${apr}%`,
                    choices: [
                        {
                            text: `Pay in full ($${balance.toLocaleString()})`,
                            condition: () => state.money >= balance,
                            effect: () => {
                                state.money -= balance;
                                state.finances.creditBalance = 0;
                                state.finances.missedPayments = 0;
                                state.finances.creditScore = Math.min(850, state.finances.creditScore + 2);
                                return { icon: "✅", text: "Paid in full! No interest this month. Your credit score improves.", stats: `-$${balance.toLocaleString()}, +2 Credit Score` };
                            }
                        },
                        {
                            text: `Pay half ($${Math.ceil(balance/2).toLocaleString()})`,
                            condition: () => state.money >= Math.ceil(balance/2) && balance > 100,
                            effect: () => {
                                let payment = Math.ceil(balance/2);
                                state.money -= payment;
                                state.finances.creditBalance -= payment;
                                state.finances.missedPayments = 0;
                                return { icon: "💵", text: `Paid $${payment}. Still carrying a balance—interest will accrue.`, stats: `-$${payment}` };
                            }
                        },
                        {
                            text: `Minimum payment only ($${minPayment})`,
                            condition: () => state.money >= minPayment,
                            effect: () => {
                                state.money -= minPayment;
                                state.finances.creditBalance -= minPayment;
                                state.finances.missedPayments = 0;
                                let monthlyInterest = Math.ceil(state.finances.creditBalance * (state.finances.creditAPR / 12));
                                return { icon: "😬", text: `Minimum payment made. You'll pay about $${monthlyInterest} in interest this month. The debt trap deepens.`, stats: `-$${minPayment}` };
                            }
                        },
                        {
                            text: "Skip payment this month",
                            effect: () => {
                                state.finances.missedPayments++;
                                state.finances.creditScore = Math.max(300, state.finances.creditScore - 25);
                                state.stress += 15;
                                let lateFee = 35;
                                state.finances.creditBalance += lateFee;
                                return { icon: "❌", text: `Payment missed! $${lateFee} late fee added. Your credit score tanks.`, stats: `-25 Credit Score, +$${lateFee} late fee, +15 Stress` };
                            }
                        }
                    ]
                }];
            }
            
            // CRISIS EVENTS (Rare but impactful)
            if (roll < 0.02) {
                let availableCrises = CRISIS_EVENTS.filter(c => c.condition());
                if (availableCrises.length > 0) {
                    let crisis = availableCrises[Math.floor(Math.random() * availableCrises.length)];
                    return [{
                        category: "⚠️ CRISIS",
                        title: crisis.title,
                        desc: crisis.desc,
                        choices: [
                            {
                                text: "Handle it yourself. You've got this.",
                                effect: () => {
                                    let outcome;
                                    let dc = crisis.dc || 12;
                                    let check = rollWithModifier(state.skills.physical, dc);
                                    if (check.nat1) {
                                        outcome = crisis.critFailOutcome;
                                    } else if (check.success) {
                                        outcome = crisis.successOutcome;
                                    } else {
                                        outcome = crisis.failOutcome;
                                    }
                                    
                                    if (outcome.health) state.health += outcome.health;
                                    if (outcome.stress) state.stress += outcome.stress;
                                    if (outcome.money) state.money += outcome.money;
                                    if (outcome.happiness) state.happiness += outcome.happiness;
                                    
                                    addLog(crisis.title);
                                    
                                    let statsList = [];
                                    if (outcome.health) statsList.push(`${outcome.health > 0 ? '+' : ''}${outcome.health} Health`);
                                    if (outcome.money) statsList.push(`${outcome.money > 0 ? '+' : ''}$${Math.abs(outcome.money)}`);
                                    if (outcome.stress) statsList.push(`+${outcome.stress} Stress`);
                                    
                                    return { icon: outcome.health < -30 ? "🚨" : "😰", text: `[Rolled ${check.total} vs DC ${dc}] ${outcome.text}`, stats: statsList.join(', ') };
                                }
                            },
                            {
                                text: "Throw money at the problem. Pay for professionals.",
                                condition: () => state.money >= Math.abs(crisis.failOutcome.money || 1000) * 1.5,
                                effect: () => {
                                    let cost = Math.abs(crisis.failOutcome.money || 1000) * 1.5;
                                    state.money -= cost;
                                    state.stress += 10;
                                    addLog(`${crisis.title} - paid to resolve`);
                                    return { icon: "💸", text: `Money solves problems. Crisis handled professionally.`, stats: `-$${cost.toLocaleString()}, +10 Stress` };
                                }
                            },
                            {
                                text: "💳 Put it on the credit card",
                                condition: () => {
                                    if (!state.finances.hasCreditCard) return false;
                                    let cost = Math.abs(crisis.failOutcome.money || 1000) * 1.5;
                                    let available = state.finances.creditLimit - state.finances.creditBalance;
                                    return available >= cost;
                                },
                                effect: () => {
                                    let cost = Math.abs(crisis.failOutcome.money || 1000) * 1.5;
                                    state.finances.creditBalance += cost;
                                    state.stress += 15;
                                    addLog(`${crisis.title} - charged to credit card`);
                                    return { icon: "💳", text: `Swiped. That's $${cost.toLocaleString()} in high-interest debt now. But the crisis is handled.`, stats: `+$${cost.toLocaleString()} credit card debt, +15 Stress` };
                                }
                            },
                            {
                                text: "Call someone for help. You don't have to do this alone.",
                                effect: () => {
                                    let cost = Math.floor(Math.abs(crisis.successOutcome.money || 500) * 0.8);
                                    state.money -= cost;
                                    state.stress += 10;
                                    if (crisis.successOutcome.health) state.health += Math.floor(crisis.successOutcome.health * 0.5);
                                    addLog(crisis.title);
                                    return { icon: "📱", text: `Help arrived. Could have been worse.`, stats: `-$${cost}, +10 Stress` };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // PAY OFF CREDIT CARD PROMPT (when you have money and a balance)
            if (state.finances.hasCreditCard && state.finances.creditBalance > 100 && state.money > state.finances.creditBalance + 500 && Math.random() < 0.08) {
                let balance = state.finances.creditBalance;
                let apr = (state.finances.creditAPR * 100).toFixed(1);
                
                return [{
                    category: "💳 Finance",
                    title: "Extra Cash on Hand",
                    desc: `You have some extra money. That $${balance.toLocaleString()} credit card balance at ${apr}% is eating away at you. Pay it off?`,
                    choices: [
                        {
                            text: `Pay it all off ($${balance.toLocaleString()})`,
                            effect: () => {
                                state.money -= balance;
                                state.finances.creditBalance = 0;
                                state.stress -= 10;
                                state.finances.creditScore = Math.min(850, state.finances.creditScore + 3);
                                return { icon: "🎉", text: "Debt-free on the card! That's a weight off your shoulders.", stats: `-$${balance.toLocaleString()}, -10 Stress, +3 Credit Score` };
                            }
                        },
                        {
                            text: `Pay half ($${Math.ceil(balance/2).toLocaleString()})`,
                            effect: () => {
                                let payment = Math.ceil(balance/2);
                                state.money -= payment;
                                state.finances.creditBalance -= payment;
                                state.stress -= 5;
                                return { icon: "💵", text: "Halfway there. Every bit helps against that interest.", stats: `-$${payment.toLocaleString()}, -5 Stress` };
                            }
                        },
                        {
                            text: "Keep the cash - might need it",
                            effect: () => {
                                return { icon: "🤔", text: "Cash on hand is important too. You'll deal with the card later.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // WINDFALL EVENTS (Lucky breaks)
            if (roll < 0.04) {
                let availableWindfalls = WINDFALL_EVENTS.filter(w => w.condition() && Math.random() < w.rarity * 10);
                if (availableWindfalls.length > 0) {
                    let windfall = availableWindfalls[Math.floor(Math.random() * availableWindfalls.length)];
                    let amount = Math.floor(Math.random() * (windfall.maxAmount - windfall.minAmount)) + windfall.minAmount;
                    
                    return [{
                        category: "🎉 Lucky Break",
                        title: windfall.title,
                        desc: `${windfall.desc} You've got $${amount.toLocaleString()} coming your way.`,
                        choices: [
                            {
                                text: "Treat yourself! You've earned some fun.",
                                effect: () => {
                                    let kept = Math.floor(amount * 0.3);
                                    state.money += kept;
                                    state.happiness += 25;
                                    addLog(`${windfall.title}: spent most, kept $${kept.toLocaleString()}`);
                                    return { icon: "🎉", text: `You splurge a bit. Life's short!`, stats: `+$${kept.toLocaleString()}` };
                                }
                            },
                            {
                                text: "Save every penny. Be responsible.",
                                effect: () => {
                                    state.money += amount;
                                    state.happiness += 5;
                                    state.finances.emergencyFund += Math.floor(amount * 0.2);
                                    addLog(`${windfall.title}: +$${amount.toLocaleString()}`);
                                    return { icon: "🏦", text: `Straight to savings. Responsible.`, stats: `+$${amount.toLocaleString()}` };
                                }
                            },
                            {
                                text: "Invest it. Make money work for you.",
                                condition: () => state.finances.investmentType || amount >= 1000,
                                effect: () => {
                                    if (state.finances.investmentType) {
                                        state.finances.investments += amount;
                                    } else {
                                        state.finances.investmentType = 'moderate';
                                        state.finances.investments = amount;
                                    }
                                    state.happiness += 8;
                                    addLog(`${windfall.title}: invested $${amount.toLocaleString()}`);
                                    return { icon: "📈", text: `Put it to work. Let's see it grow.`, stats: `Invested $${amount.toLocaleString()}` };
                                }
                            },
                            {
                                text: "Share the wealth with people you care about.",
                                condition: () => state.hasPartner || getAge() >= 25,
                                effect: () => {
                                    let kept = Math.floor(amount * 0.5);
                                    state.money += kept;
                                    state.happiness += 15;
                                    if (state.hasPartner) state.partnerStats.supportiveness += 10;
                                    state.neglect.relationship = 0;
                                    addLog(`${windfall.title}: shared, kept $${kept.toLocaleString()}`);
                                    return { icon: "💕", text: `Generosity strengthens bonds.`, stats: `+$${kept.toLocaleString()}` };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // FAMILY EVENTS
            if (roll < 0.08) {
                let availableFamily = FAMILY_EVENTS.filter(f => f.condition());
                if (availableFamily.length > 0) {
                    let familyEvent = availableFamily[Math.floor(Math.random() * availableFamily.length)];
                    
                    if (familyEvent.choices) {
                        // Events with choices
                        if (familyEvent.title === "Parent Health Scare") {
                            return [{
                                category: "👨‍👩‍👧 Family",
                                title: familyEvent.title,
                                desc: familyEvent.desc,
                                choices: [
                                    {
                                        text: "Rush to be there",
                                        effect: () => {
                                            state.stress += 30;
                                            state.happiness -= 15;
                                            state.money -= 500;
                                            if (state.employed) state.performance -= 5;
                                            addLog("Parent hospitalized");
                                            return { icon: "🏥", text: "You drop everything. Family first. They pull through.", stats: "+30 Stress, -15 Happiness, -$500" };
                                        }
                                    },
                                    {
                                        text: "Send support, can't go",
                                        effect: () => {
                                            state.stress += 20;
                                            state.happiness -= 25;
                                            state.money -= 200;
                                            return { icon: "😔", text: "You can't be there in person. The guilt is real.", stats: "+20 Stress, -25 Happiness, -$200" };
                                        }
                                    }
                                ]
                            }];
                        }
                        if (familyEvent.title === "Parent Needs Help") {
                            return [{
                                category: "👨‍👩‍👧 Family",
                                title: familyEvent.title,
                                desc: familyEvent.desc,
                                choices: [
                                    {
                                        text: "Provide financial help ($500/month)",
                                        condition: () => state.weeklyIncome >= 300,
                                        effect: () => {
                                            state.weeklyExpenses += 125; // $500/month
                                            state.happiness += 5;
                                            state.stress += 10;
                                            return { icon: "💵", text: "You start sending money monthly. It's the right thing.", stats: "+$125/week expenses, +5 Happiness" };
                                        }
                                    },
                                    {
                                        text: "Help with time, not money",
                                        effect: () => {
                                            state.energy -= 15;
                                            state.stress += 15;
                                            state.happiness += 10;
                                            if (state.employed) state.performance -= 3;
                                            return { icon: "🤝", text: "Weekly visits. Help with errands. It's exhausting but important.", stats: "-15 Energy, +10 Happiness" };
                                        }
                                    },
                                    {
                                        text: "Can't help right now",
                                        effect: () => {
                                            state.happiness -= 20;
                                            state.stress += 15;
                                            return { icon: "😔", text: "You feel terrible, but you're barely keeping yourself afloat.", stats: "-20 Happiness, +15 Stress (guilt)" };
                                        }
                                    }
                                ]
                            }];
                        }
                    }
                    
                    // Events with meaningful choices about how to engage
                    let effects = familyEvent.effects;
                    return [{
                        category: "👨‍👩‍👧 Family",
                        title: familyEvent.title,
                        desc: familyEvent.desc,
                        choices: [
                            {
                                text: "Go all in. Family matters.",
                                effect: () => {
                                    if (effects.stress) state.stress += effects.stress;
                                    state.happiness += (effects.happiness || 0) + 5;
                                    state.money -= Math.abs(effects.money || 100);
                                    if (effects.social) state.skills.social += effects.social + 2;
                                    state.neglect.relationship = Math.max(0, state.neglect.relationship - 2);
                                    
                                    return { icon: "👨‍👩‍👧", text: `You're fully present. Family bonds strengthen.`, stats: `` };
                                }
                            },
                            {
                                text: "Make an appearance, but don't overcommit.",
                                effect: () => {
                                    if (effects.stress) state.stress += Math.floor(effects.stress / 2);
                                    if (effects.happiness) state.happiness += Math.floor(effects.happiness / 2);
                                    state.money -= Math.floor(Math.abs(effects.money || 50) / 2);
                                    
                                    return { icon: "😐", text: `You were there, but not really there.`, stats: `` };
                                }
                            },
                            {
                                text: "Send your regrets. You've got too much going on.",
                                condition: () => familyEvent.title !== "Parent Health Scare",
                                effect: () => {
                                    state.energy += 15;
                                    state.happiness -= 10;
                                    state.neglect.relationship += 2;
                                    if (state.hasPartner) state.partnerStats.supportiveness -= 5;
                                    
                                    return { icon: "📵", text: `You sent your regrets. Family is disappointed.`, stats: `` };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // INVESTMENT OPPORTUNITY
            if (roll < 0.12 && !state.finances.investmentType && state.money > 2000 && state.employed) {
                return [{
                    category: "💰 Finance",
                    title: "Investment Opportunity",
                    desc: "You've saved some money. Time to make it work for you?",
                    choices: Object.entries(INVESTMENT_TYPES).map(([key, inv]) => ({
                        text: `${inv.icon} ${inv.name} (Start with $1,000)`,
                        condition: () => state.money >= 1000,
                        effect: () => {
                            state.finances.investmentType = key;
                            state.finances.investments = 1000;
                            state.money -= 1000;
                            addLog(`Started ${inv.name} investing`);
                            return { icon: inv.icon, text: `You open a ${inv.name.toLowerCase()} investment account. Let's see how it grows.`, stats: "-$1,000 (invested)" };
                        }
                    })).concat([{
                        text: "Not interested in investing",
                        effect: () => {
                            return { icon: "🤷", text: "Keeping it liquid for now.", stats: "" };
                        }
                    }])
                }];
            }
            
            // ADD TO INVESTMENTS
            if (roll < 0.1 && state.finances.investmentType && state.money > 500) {
                let inv = INVESTMENT_TYPES[state.finances.investmentType];
                return [{
                    category: "💰 Finance",
                    title: "Add to Investments?",
                    desc: `Your ${inv.name.toLowerCase()} portfolio is at $${state.finances.investments.toLocaleString()}. Add more?`,
                    choices: [
                        {
                            text: "Add $500",
                            condition: () => state.money >= 500,
                            effect: () => {
                                state.finances.investments += 500;
                                state.money -= 500;
                                return { icon: "📈", text: "Consistent investing builds wealth.", stats: "-$500 (invested)" };
                            }
                        },
                        {
                            text: "Add $1,000",
                            condition: () => state.money >= 1000,
                            effect: () => {
                                state.finances.investments += 1000;
                                state.money -= 1000;
                                return { icon: "📈", text: "Bigger investments, bigger potential.", stats: "-$1,000 (invested)" };
                            }
                        },
                        {
                            text: "Withdraw everything",
                            effect: () => {
                                let amount = state.finances.investments;
                                state.money += amount;
                                state.finances.investments = 0;
                                state.finances.investmentType = null;
                                return { icon: "💵", text: `Cashed out $${amount.toLocaleString()}.`, stats: `+$${amount.toLocaleString()}` };
                            }
                        },
                        {
                            text: "Leave it alone",
                            effect: () => {
                                return { icon: "📊", text: "Let it grow.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // HOME PURCHASE OPPORTUNITY
            if (roll < 0.08 && !state.finances.homeOwned && state.employed && state.weeklyIncome >= 500 && state.money >= 10000) {
                let creditTier = getCreditTier();
                let affordableHomes = Object.entries(HOMES_FOR_SALE).filter(([k, h]) => 
                    state.money >= h.downPayment * 0.5 && state.weeklyIncome >= h.mortgage * 0.4
                );
                
                if (affordableHomes.length > 0) {
                    return [{
                        category: "🏠 Real Estate",
                        title: "Ready to Buy a Home?",
                        desc: `Your credit score (${state.finances.creditScore}) qualifies you for a mortgage. Down payment required.`,
                        choices: affordableHomes.slice(0, 3).map(([key, home]) => {
                            let adjustedMortgage = Math.floor(home.mortgage * creditTier.loanMultiplier);
                            return {
                                text: `${home.icon} ${home.name} - $${home.downPayment.toLocaleString()} down, $${adjustedMortgage}/week`,
                                condition: () => state.money >= home.downPayment,
                                effect: () => {
                                    state.money -= home.downPayment;
                                    state.finances.homeOwned = true;
                                    state.finances.homeValue = home.price;
                                    state.finances.mortgage = adjustedMortgage;
                                    state.home = 'house';
                                    state.weeklyExpenses += adjustedMortgage - HOUSING.house.rent;
                                    state.happiness += home.happiness;
                                    state.finances.creditScore += 20;
                                    addLog(`Bought ${home.name}`);
                                    state.achievements.push('Homeowner');
                                    return { icon: "🏠", text: `You're a homeowner! ${home.name} is yours.`, stats: `-$${home.downPayment.toLocaleString()}, +${home.happiness} Happiness, Building equity!` };
                                }
                            };
                        }).concat([{
                            text: "Keep renting",
                            effect: () => {
                                return { icon: "🏢", text: "Not ready to commit to a mortgage.", stats: "" };
                            }
                        }])
                    }];
                }
            }
            
            // CAR PURCHASE OPPORTUNITY
            if (roll < 0.1 && (state.car === 'bus' || state.car === 'walk' || state.car === 'beater') && state.employed && state.money >= 5000) {
                let creditTier = getCreditTier();
                let affordableCars = Object.entries(CARS_FOR_SALE).filter(([k, c]) => 
                    state.money >= c.price * 0.2 || state.money >= c.price
                );
                
                if (affordableCars.length > 0) {
                    return [{
                        category: "🚗 Transportation",
                        title: "Time for a New Car?",
                        desc: `Your current transport (${TRANSPORT[state.car].name}) is limiting. Upgrade?`,
                        choices: affordableCars.slice(0, 3).map(([key, car]) => {
                            let canPayCash = state.money >= car.price;
                            let loanPayment = Math.floor(car.loan * creditTier.loanMultiplier);
                            return {
                                text: canPayCash ? 
                                    `${car.icon} ${car.name} - Pay cash $${car.price.toLocaleString()}` :
                                    `${car.icon} ${car.name} - $${Math.floor(car.price * 0.2).toLocaleString()} down + $${loanPayment}/week`,
                                condition: () => state.money >= (canPayCash ? car.price : car.price * 0.2),
                                effect: () => {
                                    if (canPayCash) {
                                        state.money -= car.price;
                                        state.finances.carOwned = key;
                                        state.finances.carValue = car.price;
                                        state.finances.carPayment = 0;
                                    } else {
                                        state.money -= Math.floor(car.price * 0.2);
                                        state.finances.carOwned = key;
                                        state.finances.carValue = car.price;
                                        state.finances.carPayment = loanPayment;
                                        state.weeklyExpenses += loanPayment;
                                    }
                                    state.car = 'car';
                                    state.happiness += 10;
                                    state.finances.creditScore += 10;
                                    addLog(`Bought ${car.name}`);
                                    return { icon: car.icon, text: `New ${car.name}! Freedom on wheels.`, stats: canPayCash ? `-$${car.price.toLocaleString()}` : `Down payment + $${loanPayment}/week loan` };
                                }
                            };
                        }).concat([{
                            text: "Not now",
                            effect: () => {
                                return { icon: "🚌", text: "Current transport is fine for now.", stats: "" };
                            }
                        }])
                    }];
                }
            }
            
            // CREDIT SCORE EVENT
            if (roll < 0.05 && state.employed) {
                let change = Math.random() > 0.6 ? Math.floor(Math.random() * 20) + 5 : -(Math.floor(Math.random() * 15) + 5);
                let reason = change > 0 ? 
                    (Math.random() > 0.5 ? "On-time payments reported." : "Credit utilization improved.") :
                    (Math.random() > 0.5 ? "Hard inquiry on your credit." : "Slight increase in debt ratio.");
                
                // Credit events should have choices about how to respond
                if (change < 0) {
                    return [{
                        category: "📊 Credit",
                        title: "Credit Score Dropped",
                        desc: `Your credit score decreased. ${reason} How do you respond?`,
                        choices: [
                            {
                                text: `Pay down debt aggressively [-$300, +15 Credit]`,
                                condition: () => state.money >= 300,
                                effect: () => {
                                    state.money -= 300;
                                    state.finances.creditScore = Math.min(850, state.finances.creditScore + 15);
                                    state.debt = Math.max(0, state.debt - 300);
                                    return { icon: "📈", text: `Aggressive debt paydown. Credit recovering.`, stats: `-$300, +15 Credit Score` };
                                }
                            },
                            {
                                text: `Dispute the report [50% chance to reverse, costs time]`,
                                effect: () => {
                                    state.energy -= 15;
                                    if (Math.random() > 0.5) {
                                        return { icon: "✅", text: `Dispute successful! Score unchanged.`, stats: `-15 Energy` };
                                    }
                                    state.finances.creditScore = Math.max(300, state.finances.creditScore + change);
                                    return { icon: "❌", text: `Dispute rejected. Score drops.`, stats: `${change} Credit Score, -15 Energy` };
                                }
                            },
                            {
                                text: `Accept it and move on`,
                                effect: () => {
                                    state.finances.creditScore = Math.max(300, state.finances.creditScore + change);
                                    return { icon: "📉", text: `Credit score now: ${state.finances.creditScore}`, stats: `${change} Credit Score` };
                                }
                            }
                        ]
                    }];
                } else {
                    // Positive change - choice of how to leverage it
                    return [{
                        category: "📊 Credit",
                        title: "Credit Score Improved!",
                        desc: `Your credit score increased! ${reason} Take advantage?`,
                        choices: [
                            {
                                text: `Apply for better credit card [+Rewards, Risk of hard inquiry]`,
                                effect: () => {
                                    state.finances.creditScore = Math.min(850, state.finances.creditScore + change);
                                    if (Math.random() > 0.3) {
                                        state.weeklyIncome += 10; // Cashback rewards
                                        return { icon: "💳", text: `Approved! Better rewards card. +$10/week cashback.`, stats: `+${change} Credit, +$10/week` };
                                    }
                                    state.finances.creditScore -= 5; // Hard inquiry
                                    return { icon: "❌", text: `Denied. Hard inquiry hurts score slightly.`, stats: `+${change - 5} Credit net` };
                                }
                            },
                            {
                                text: `Keep building steadily`,
                                effect: () => {
                                    state.finances.creditScore = Math.min(850, state.finances.creditScore + change + 3);
                                    return { icon: "📈", text: `Playing it safe. Steady growth.`, stats: `+${change + 3} Credit Score` };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // ============ RELATIONSHIP EVENTS ============
            
            // PARTNER WANTS QUALITY TIME (work/study vs relationship tradeoff)
            if (state.hasPartner && Math.random() < 0.15) {
                let partnerName = state.partnerName;
                let neglectLevel = state.neglect.relationship || 0;
                let isStudent = ['university', 'community_college', 'trade_school'].includes(state.phase);
                let isWorking = state.employed;
                
                // Higher neglect = more urgent events
                if (neglectLevel >= 3) {
                    return [{
                        category: "💔 Relationship",
                        title: "We Need to Talk",
                        desc: `${partnerName} says you've been distant lately. "I feel like I'm not a priority anymore."`,
                        choices: [
                            {
                                text: `Take the day off for ${partnerName}. Work can wait.`,
                                condition: () => isWorking,
                                effect: () => {
                                    state.neglect.relationship = 0;
                                    state.partnerStats.supportiveness += 15;
                                    state.happiness += 10;
                                    state.performance = Math.max(0, state.performance - 8);
                                    if (state.career.boss) state.career.boss.relationship -= 5;
                                    return { icon: "💕", text: `Quality time with ${partnerName}. Your bond strengthens. Work suffered a bit.`, stats: "+15 Bond, -8 Performance" };
                                }
                            },
                            {
                                text: `Skip class/studying for a date`,
                                condition: () => isStudent,
                                effect: () => {
                                    state.neglect.relationship = 0;
                                    state.partnerStats.supportiveness += 15;
                                    state.happiness += 12;
                                    state.gpa = Math.max(0, state.gpa - 0.08);
                                    return { icon: "💕", text: `${partnerName} appreciates you being there. Grades slipped a bit.`, stats: "+15 Bond, -0.08 GPA" };
                                }
                            },
                            {
                                text: "Plan something special this weekend",
                                effect: () => {
                                    state.money -= 100;
                                    state.neglect.relationship = Math.max(0, state.neglect.relationship - 2);
                                    state.partnerStats.supportiveness += 8;
                                    state.happiness += 5;
                                    return { icon: "🌹", text: `A nice dinner smooths things over. ${partnerName} feels a bit better.`, stats: "+8 Bond, -$100" };
                                }
                            },
                            {
                                text: "You're being dramatic. I'm busy.",
                                effect: () => {
                                    state.partnerStats.supportiveness -= 20;
                                    state.neglect.relationship += 3;
                                    if (state.partnerStats.supportiveness < 20) {
                                        state.hasPartner = false;
                                        state.happiness -= 25;
                                        addLog(`${partnerName} broke up with you`);
                                        return { icon: "💔", text: `${partnerName}: "I can't do this anymore." They leave.`, stats: "Relationship ended!" };
                                    }
                                    return { icon: "😤", text: `${partnerName} storms off. Things are tense.`, stats: "-20 Bond" };
                                }
                            }
                        ]
                    }];
                }
                
                // Normal relationship events
                let eventType = Math.floor(Math.random() * 4);
                
                if (eventType === 0) {
                    // Date night vs work/study
                    return [{
                        category: "💕 Relationship",
                        title: `Date Night with ${partnerName}`,
                        desc: `${partnerName} wants to go out tonight. But you have ${isStudent ? 'a paper due tomorrow' : 'an early meeting'}.`,
                        choices: [
                            {
                                text: `Go out - ${partnerName} matters more`,
                                effect: () => {
                                    state.money -= 80;
                                    state.happiness += 15;
                                    state.partnerStats.supportiveness += 5;
                                    state.neglect.relationship = Math.max(0, state.neglect.relationship - 1);
                                    if (isStudent) {
                                        state.gpa = Math.max(0, state.gpa - 0.03);
                                        return { icon: "🍷", text: `Great evening! The paper was... fine.`, stats: "+5 Bond, -$80, -0.03 GPA" };
                                    } else {
                                        state.energy -= 15;
                                        return { icon: "🍷", text: `Wonderful date. You'll be tired tomorrow.`, stats: "+5 Bond, -$80, -15 Energy" };
                                    }
                                }
                            },
                            {
                                text: `Rain check - need to ${isStudent ? 'study' : 'prepare'}`,
                                effect: () => {
                                    state.neglect.relationship++;
                                    state.partnerStats.supportiveness -= 3;
                                    if (isStudent) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.02);
                                        return { icon: "📚", text: `${partnerName} understands... mostly. Paper turned out well.`, stats: "-3 Bond, +0.02 GPA" };
                                    } else {
                                        state.performance = Math.min(100, state.performance + 3);
                                        return { icon: "💼", text: `${partnerName} is disappointed but you're ready for tomorrow.`, stats: "-3 Bond, +3 Performance" };
                                    }
                                }
                            },
                            {
                                text: "Quick dinner, then back to work",
                                effect: () => {
                                    state.money -= 40;
                                    state.partnerStats.supportiveness += 2;
                                    state.energy -= 10;
                                    return { icon: "🍕", text: `Compromise. Not ideal but ${partnerName} appreciates the effort.`, stats: "+2 Bond, -$40" };
                                }
                            }
                        ]
                    }];
                } else if (eventType === 1) {
                    // Meet the parents/family
                    return [{
                        category: "💕 Relationship",
                        title: `Meet ${partnerName}'s Family`,
                        desc: `${partnerName}'s parents are in town and want to have dinner with you. You have ${isStudent ? 'midterms next week' : 'a big deadline'}.`,
                        choices: [
                            {
                                text: "Go - this is important for the relationship",
                                effect: () => {
                                    state.money -= 60;
                                    let check = rollWithModifier(state.skills.social, 12);
                                    if (check.success) {
                                        state.partnerStats.supportiveness += 12;
                                        state.happiness += 10;
                                        return { icon: "👨‍👩‍👧", text: `[Rolled ${check.total}] Great impression! ${partnerName}'s parents love you.`, stats: "+12 Bond, -$60" };
                                    }
                                    state.partnerStats.supportiveness += 5;
                                    state.stress += 5;
                                    return { icon: "😅", text: `[Rolled ${check.total}] Awkward moments, but you showed up.`, stats: "+5 Bond, +5 Stress" };
                                }
                            },
                            {
                                text: `Can't - ${isStudent ? 'need to study' : 'work crisis'}`,
                                effect: () => {
                                    state.partnerStats.supportiveness -= 8;
                                    state.neglect.relationship += 2;
                                    if (isStudent) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.05);
                                        return { icon: "📚", text: `${partnerName} is hurt. "My parents were really looking forward to meeting you."`, stats: "-8 Bond, +0.05 GPA" };
                                    }
                                    state.performance = Math.min(100, state.performance + 5);
                                    return { icon: "💼", text: `${partnerName} is disappointed. Family is important to them.`, stats: "-8 Bond, +5 Performance" };
                                }
                            }
                        ]
                    }];
                } else if (eventType === 2) {
                    // Partner needs support vs your goals
                    return [{
                        category: "💕 Relationship",
                        title: `${partnerName} Needs You`,
                        desc: `${partnerName} had a rough day and is feeling down. You have ${isStudent ? 'a study group' : 'overtime available'}.`,
                        choices: [
                            {
                                text: "Be there for them",
                                effect: () => {
                                    state.partnerStats.supportiveness += 8;
                                    state.happiness += 5;
                                    state.neglect.relationship = Math.max(0, state.neglect.relationship - 1);
                                    return { icon: "🤗", text: `You stayed and listened. ${partnerName} feels supported.`, stats: "+8 Bond, +5 Happy" };
                                }
                            },
                            {
                                text: isStudent ? "Study group is important" : "Take the overtime ($150)",
                                effect: () => {
                                    state.partnerStats.supportiveness -= 5;
                                    state.neglect.relationship++;
                                    if (isStudent) {
                                        state.skills.technical += 2;
                                        return { icon: "📚", text: `${partnerName} says it's fine... but seems distant.`, stats: "-5 Bond, +2 Technical" };
                                    }
                                    state.money += 150;
                                    return { icon: "💵", text: `The money helps but ${partnerName} noticed your absence.`, stats: "-5 Bond, +$150" };
                                }
                            },
                            {
                                text: "Check in briefly, then go",
                                effect: () => {
                                    state.partnerStats.supportiveness += 2;
                                    if (isStudent) state.skills.technical += 1;
                                    else state.money += 75;
                                    return { icon: "💬", text: `You showed you care, even if briefly.`, stats: isStudent ? "+2 Bond, +1 Technical" : "+2 Bond, +$75" };
                                }
                            }
                        ]
                    }];
                } else {
                    // Weekend plans conflict
                    return [{
                        category: "💕 Relationship",
                        title: "Weekend Plans",
                        desc: `${partnerName} wants to spend the weekend together. But ${isStudent ? 'finals are in two weeks' : 'there\'s a work project you could get ahead on'}.`,
                        choices: [
                            {
                                text: "Full weekend with partner",
                                effect: () => {
                                    state.money -= 120;
                                    state.happiness += 15;
                                    state.partnerStats.supportiveness += 10;
                                    state.neglect.relationship = 0;
                                    state.energy = Math.min(100, state.energy + 10);
                                    return { icon: "💑", text: `Perfect weekend together. Memories made.`, stats: "+10 Bond, -$120, +15 Happy" };
                                }
                            },
                            {
                                text: isStudent ? "Need to study all weekend" : "Need to work all weekend",
                                effect: () => {
                                    state.partnerStats.supportiveness -= 10;
                                    state.neglect.relationship += 2;
                                    if (isStudent) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.08);
                                        state.skills.technical += 2;
                                        return { icon: "📚", text: `${partnerName} spent the weekend alone. You aced your studying.`, stats: "-10 Bond, +0.08 GPA" };
                                    }
                                    state.performance = Math.min(100, state.performance + 8);
                                    return { icon: "💼", text: `${partnerName} is frustrated. But you're ahead at work now.`, stats: "-10 Bond, +8 Performance" };
                                }
                            },
                            {
                                text: "Compromise - Saturday together, Sunday productive",
                                effect: () => {
                                    state.money -= 60;
                                    state.partnerStats.supportiveness += 3;
                                    state.happiness += 5;
                                    if (isStudent) {
                                        state.gpa = Math.min(4.0, state.gpa + 0.03);
                                        return { icon: "⚖️", text: `Balance. ${partnerName} got quality time, you got study time.`, stats: "+3 Bond, +0.03 GPA, -$60" };
                                    }
                                    state.performance = Math.min(100, state.performance + 3);
                                    return { icon: "⚖️", text: `Balance. Neither perfect but both acceptable.`, stats: "+3 Bond, +3 Performance, -$60" };
                                }
                            }
                        ]
                    }];
                }
            }
            
            // RELATIONSHIP NEGLECT WARNING
            if (state.hasPartner && state.neglect.relationship >= 5 && Math.random() < 0.3) {
                let partnerName = state.partnerName;
                return [{
                    category: "⚠️ Relationship Crisis",
                    title: "Growing Apart",
                    desc: `${partnerName} seems distant. "We never spend time together anymore. Are we even still together?"`,
                    choices: [
                        {
                            text: "Plan a big romantic gesture ($200)",
                            condition: () => state.money >= 200,
                            effect: () => {
                                state.money -= 200;
                                state.neglect.relationship = 2;
                                state.partnerStats.supportiveness += 15;
                                state.happiness += 10;
                                return { icon: "💐", text: `You planned something special. ${partnerName} is touched.`, stats: "+15 Bond, -$200" };
                            }
                        },
                        {
                            text: "Have an honest conversation",
                            effect: () => {
                                let check = rollWithModifier(state.skills.social, 14);
                                if (check.success) {
                                    state.neglect.relationship = 3;
                                    state.partnerStats.supportiveness += 8;
                                    return { icon: "💬", text: `[Rolled ${check.total}] A heart-to-heart. You're both committed to trying harder.`, stats: "+8 Bond" };
                                }
                                state.partnerStats.supportiveness -= 5;
                                return { icon: "😔", text: `[Rolled ${check.total}] The conversation got heated. Things are still tense.`, stats: "-5 Bond" };
                            }
                        },
                        {
                            text: "Maybe we should take a break...",
                            effect: () => {
                                state.hasPartner = false;
                                state.happiness -= 20;
                                state.stress += 15;
                                addLog(`Broke up with ${partnerName}`);
                                return { icon: "💔", text: `You ended things. It hurts, but maybe it's for the best.`, stats: "Relationship ended, -20 Happy, +15 Stress" };
                            }
                        }
                    ]
                }];
            }
            
            // RETIREMENT CONTRIBUTION PROMPT (periodically)
            if (roll < 0.06 && state.employed && state.totalWeeks % 26 === 0) {
                return [{
                    category: "💰 Finance",
                    title: "401k Contribution",
                    desc: "Open enrollment. How much should go to retirement?",
                    choices: [
                        {
                            text: "Contribute 3% of salary",
                            effect: () => {
                                let contribution = Math.floor(state.weeklyIncome * 0.03 * 26);
                                state.finances.retirementAccount += contribution;
                                state.money -= contribution;
                                return { icon: "👴", text: "Building for the future.", stats: `+$${contribution} to 401k` };
                            }
                        },
                        {
                            text: "Max it out (10%)",
                            condition: () => state.weeklyIncome >= 400,
                            effect: () => {
                                let contribution = Math.floor(state.weeklyIncome * 0.10 * 26);
                                state.finances.retirementAccount += contribution;
                                state.money -= contribution;
                                return { icon: "💰", text: "Aggressive retirement saving. Future you thanks you.", stats: `+$${contribution} to 401k` };
                            }
                        },
                        {
                            text: "Skip for now",
                            effect: () => {
                                return { icon: "🤷", text: "Need the cash now.", stats: "" };
                            }
                        }
                    ]
                }];
            }
            
            // Ordinary week fallback
            return [{
                category: "Life",
                title: "An Ordinary Week",
                desc: "Sometimes life is just... life. Nothing dramatic. And that's okay.",
                choices: [
                    {
                        text: "Relax and recharge",
                        effect: () => {
                            state.energy = Math.min(100, state.energy + 20);
                            state.stress = Math.max(0, state.stress - 10);
                            return { icon: "😌", text: "Some quiet time.", stats: "+20 Energy, -10 Stress" };
                        }
                    },
                    {
                        text: "Work on yourself",
                        effect: () => {
                            state.skills.physical += 2;
                            state.health = Math.min(100, state.health + 5);
                            return { icon: "🏃", text: "Hit the gym. Feeling good.", stats: "+2 Physical, +5 Health" };
                        }
                    },
                    {
                        text: "Be social",
                        effect: () => {
                            state.skills.social += 2;
                            state.happiness += 5;
                            state.money -= 30;
                            return { icon: "👥", text: "Hung out with friends.", stats: "+2 Social, +5 Happiness, -$30" };
                        }
                    },
                    {
                        text: "Manage finances",
                        effect: () => {
                            state.finances.emergencyFund += 50;
                            state.stress -= 5;
                            return { icon: "💰", text: "Budgeting, planning. Responsible adult stuff.", stats: "+$50 emergency fund, -5 Stress" };
                        }
                    }
                ]
            }];
        }

        // ============ CORE GAME LOOP ============
        function advanceWeek() {
            playSound('advance');
            
            // Check if free time is unallocated
            let maxFreeTime = getAvailableFreeTime();
            let usedFreeTime = Object.values(state.freeTime).reduce((a, b) => a + b, 0);
            let unallocatedTime = maxFreeTime - usedFreeTime;
            
            if (unallocatedTime > 2) {
                let shouldContinue = confirm(
                    `⚠️ Unallocated Free Time!\n\n` +
                    `You have ${unallocatedTime} hours of free time not allocated to any activity.\n\n` +
                    `Unallocated time = wasted potential for skill growth!\n\n` +
                    `Click "Cancel" to allocate your time, or "OK" to proceed anyway.`
                );
                if (!shouldContinue) {
                    openFreeTimeModal();
                    return; // Don't advance the week
                }
            }
            
            state.totalWeeks++;
            state.week++;
            state.phaseWeek++;
            if (state.hasPartner) state.relationshipWeeks++;
            if (state.employed) state.weeksAtJob++;
            
            // Naturally drift toward neglect over time (player choices will counter this)
            if (state.employed && Math.random() < 0.3) state.neglect.work++;
            if (Math.random() < 0.25) state.neglect.health++;
            if (state.hasPartner && Math.random() < 0.35) state.neglect.relationship++;
            if (Math.random() < 0.2) state.neglect.fun++;
            
            // Process friend bond decay (friends drift apart if not contacted)
            processFriendDecay();
            
            // Process criminal heat decay
            processHeatDecay();
            
            // Process jail time if incarcerated
            if (state.criminal.inJail) {
                processJailWeek();
                if (state.criminal.inJail) {
                    // Still in jail - skip normal week processing
                    updateUI();
                    displayEvent(getJailEvent());
                    return;
                }
            }
            
            // Process business weekly
            if (state.business.active) {
                processBusinessWeek();
            }
            
            // Apply weekly home decoration effects
            if (state.homeDecor?.furniture?.length > 0) {
                let effects = getFurnitureEffects();
                if (effects.happiness) state.happiness = Math.min(100, state.happiness + effects.happiness);
                if (effects.stress) state.stress = Math.max(0, state.stress + effects.stress);
                if (effects.health) state.health = Math.min(100, state.health + effects.health);
                if (effects.energy) state.energy = Math.min(100, state.energy + effects.energy);
            }
            
            // Apply weekly partner/relationship effects
            processRelationshipEffects();
            
            // Reveal partner traits over time
            if (state.hasPartner) {
                revealPartnerTraits();
            }
            
            // Process loneliness if single
            processLoneliness();
            
            // Validate free time allocation (in case circumstances changed)
            validateFreeTimeAllocation();
            
            // Weekly finances
            let net = calculateWeeklyFinances();
            state.money += net;
            
            // Pay down debt slowly
            if (state.debt > 0 && state.money > 0) {
                let payment = Math.min(state.debt, Math.ceil(state.debt / 200));
                // Debt payment already in expenses
            }
            
            // CREDIT CARD INTEREST (Monthly - every 4 weeks)
            if (state.creditCardDebt > 0 && state.totalWeeks % 4 === 0) {
                let monthlyRate = (state.creditAPR || 22) / 12 / 100;
                let interest = Math.ceil(state.creditCardDebt * monthlyRate);
                state.creditCardDebt += interest;
                if (interest > 50) {
                    addLog(`Credit card interest: +$${interest}`);
                }
            }
            
            // STUDENT LOAN INTEREST (accrues weekly whether in school or not)
            if (state.studentLoans > 0) {
                let apr = state.studentLoanAPR || 6.5;
                let weeklyRate = apr / 100 / 52; // Convert annual rate to weekly
                let interest = Math.ceil(state.studentLoans * weeklyRate);
                state.studentLoans += interest;
                
                // Log interest quarterly so player notices
                if (state.totalWeeks % 13 === 0 && interest > 0) {
                    let quarterlyInterest = interest * 13;
                    addLog(`Student loan interest: +$${quarterlyInterest} this quarter`);
                }
            }
            
            // STUDENT LOAN PAYMENTS (if employed and have loans, and not in school)
            let inSchool = state.phase === 'education' && ['university', 'community_college', 'trade_school'].includes(state.educationType);
            if (state.studentLoans > 0 && state.employed && !inSchool && state.totalWeeks % 4 === 0) {
                let payment = Math.min(state.studentLoans, Math.ceil(state.studentLoans / 120)); // ~10 year payoff
                payment = Math.max(50, payment); // Minimum $50/month payment
                if (state.money >= payment) {
                    state.money -= payment;
                    state.studentLoans -= payment;
                }
            }
            
            // Reset annual student loan borrowing limit each year
            if (state.totalWeeks - (state.studentLoansLastYearReset || 0) >= 52) {
                state.studentLoansBorrowedThisYear = 0;
                state.studentLoansLastYearReset = state.totalWeeks;
            }
            
            // INVESTMENT RETURNS (Weekly)
            if (state.finances.investments > 0 && state.finances.investmentType) {
                let inv = INVESTMENT_TYPES[state.finances.investmentType];
                let randomFactor = Math.random();
                let returnRate;
                
                if (randomFactor < inv.risk) {
                    // Bad week - loss
                    returnRate = inv.minLoss * (Math.random() * 0.5 + 0.5);
                } else if (randomFactor > 0.95) {
                    // Great week - big gain
                    returnRate = inv.maxGain * (Math.random() * 0.5 + 0.5);
                } else {
                    // Normal week - average return
                    returnRate = inv.weeklyReturn * (Math.random() * 2);
                }
                
                let returnAmount = Math.floor(state.finances.investments * returnRate);
                state.finances.investments = Math.max(0, state.finances.investments + returnAmount);
                
                // Clear investment if it crashes to zero
                if (state.finances.investments <= 0) {
                    state.finances.investmentType = null;
                }
            }
            
            // HOME EQUITY GROWTH (Annually)
            if (state.finances.homeOwned && state.totalWeeks % 52 === 0) {
                let appreciation = state.finances.homeValue * (0.02 + Math.random() * 0.03); // 2-5% annual
                state.finances.homeValue += appreciation;
            }
            
            // CAR DEPRECIATION (Annually)
            if (state.finances.carOwned && state.totalWeeks % 52 === 0) {
                state.finances.carValue = Math.floor(state.finances.carValue * 0.85); // 15% annual depreciation
            }
            
            // CREDIT SCORE MAINTENANCE
            if (state.totalWeeks % 4 === 0) { // Monthly
                // Positive factors
                if (state.employed) state.finances.creditScore = Math.min(850, state.finances.creditScore + 1);
                if (state.debt < 1000) state.finances.creditScore = Math.min(850, state.finances.creditScore + 1);
                if (state.finances.homeOwned) state.finances.creditScore = Math.min(850, state.finances.creditScore + 0.5);
                // Good credit card behavior
                if (state.finances.hasCreditCard && state.finances.creditBalance === 0) {
                    state.finances.creditScore = Math.min(850, state.finances.creditScore + 1);
                }
                
                // Negative factors
                if (state.debt > 20000) state.finances.creditScore = Math.max(300, state.finances.creditScore - 2);
                if (state.money < 0) state.finances.creditScore = Math.max(300, state.finances.creditScore - 5);
                // High credit utilization hurts score
                if (state.finances.hasCreditCard && state.finances.creditBalance > state.finances.creditLimit * 0.3) {
                    state.finances.creditScore = Math.max(300, state.finances.creditScore - 2);
                }
                // Missed credit card payments tank score
                if (state.finances.missedPayments > 0) {
                    state.finances.creditScore = Math.max(300, state.finances.creditScore - (state.finances.missedPayments * 10));
                }
            }
            
            // CREDIT CARD INTEREST (Monthly)
            if (state.finances.hasCreditCard && state.finances.creditBalance > 0 && state.totalWeeks % 4 === 0) {
                // Apply monthly interest (APR / 12)
                let monthlyRate = state.finances.creditAPR / 12;
                let interest = Math.ceil(state.finances.creditBalance * monthlyRate);
                state.finances.creditBalance += interest;
                
                // Calculate minimum payment (usually 2% of balance or $25, whichever is greater)
                state.finances.minPaymentDue = Math.max(25, Math.ceil(state.finances.creditBalance * 0.02));
                
                // Cap balance at limit (over-limit fees simplified)
                if (state.finances.creditBalance > state.finances.creditLimit) {
                    state.finances.creditBalance = Math.ceil(state.finances.creditLimit * 1.1); // 10% over-limit allowed
                    state.stress += 5;
                }
            }
            
            // LOW MONEY STRESS
            if (state.money < 0) {
                state.stress += 8; // Severe stress when in the red
                state.happiness -= 3;
            } else if (state.money < 100) {
                state.stress += 5; // High stress when almost broke
                state.happiness -= 1;
            } else if (state.money < 300) {
                state.stress += 2; // Moderate stress when tight
            }
            
            // Credit card debt stress
            if (state.finances.creditBalance > 1000) {
                state.stress += Math.floor(state.finances.creditBalance / 2000); // +1 stress per $2000 in CC debt
            }
            
            // LIFESTYLE STRESS (from housing and transport)
            let housingStress = HOUSING[state.home]?.stress || 0;
            let transportStress = TRANSPORT[state.car]?.stress || 0;
            
            // Apply lifestyle stress (weekly, so divide by 4 for monthly-ish effect)
            if (state.totalWeeks % 2 === 0) { // Every 2 weeks
                state.stress += Math.max(0, housingStress);
                state.stress += Math.max(0, transportStress);
                
                // Nice housing/transport can REDUCE stress
                if (housingStress < 0) state.stress = Math.max(0, state.stress + housingStress);
                if (transportStress < 0) state.stress = Math.max(0, state.stress + transportStress);
            }
            
            // BOSS STRESS MODIFIER (weekly)
            if (state.employed && state.career.boss && BOSS_PERSONALITIES[state.career.boss.personality]) {
                let bossType = BOSS_PERSONALITIES[state.career.boss.personality];
                if (bossType.stressMod) {
                    state.stress = Math.max(0, state.stress + Math.floor(bossType.stressMod / 2)); // Half weekly
                }
                // Demanding bosses give extra skill gains
                if (bossType.skillMod && state.totalWeeks % 2 === 0) {
                    let skillBoost = Math.floor((bossType.skillMod - 1) * 2); // +1 skill every 2 weeks
                    if (skillBoost > 0 && state.job && JOBS[state.job]) {
                        // Boost relevant job skill
                        if (JOBS[state.job].req.technical) state.skills.technical = Math.min(100, state.skills.technical + skillBoost);
                        if (JOBS[state.job].req.social) state.skills.social = Math.min(100, state.skills.social + skillBoost);
                    }
                }
            }
            
            // Exhaustion collapse check
            if (state.energy <= 0) {
                state.exhaustionCollapse = true;
            }
            
            // SUBSCRIPTION EFFECTS (weekly)
            processSubscriptionEffects();
            
            // HABIT EFFECTS (weekly)
            processHabitEffects();
            
            // Check for bad habit development from poor stat management
            checkBadHabitDevelopment();
            
            // Update willpower
            state.maxWillpower = calculateMaxWillpower();
            state.willpower = Math.max(0, state.maxWillpower - getTotalHabitCost());
            
            // FREE TIME EFFECTS (weekly)
            let freeTimeEffects = calculateFreeTimeEffects(state.freeTime);
            
            // Apply skill gains
            if (freeTimeEffects.physical) state.skills.physical = Math.min(100, state.skills.physical + freeTimeEffects.physical);
            if (freeTimeEffects.social) state.skills.social = Math.min(100, state.skills.social + freeTimeEffects.social);
            if (freeTimeEffects.technical) state.skills.technical = Math.min(100, state.skills.technical + freeTimeEffects.technical);
            if (freeTimeEffects.creativity) state.skills.creativity = Math.min(100, state.skills.creativity + freeTimeEffects.creativity);
            
            // Apply stat changes
            if (freeTimeEffects.stress) state.stress = Math.max(0, state.stress + freeTimeEffects.stress);
            if (freeTimeEffects.energy) state.energy = Math.min(100, state.energy + freeTimeEffects.energy);
            if (freeTimeEffects.happiness) state.happiness = Math.min(100, state.happiness + freeTimeEffects.happiness);
            if (freeTimeEffects.health) state.health = Math.min(100, state.health + freeTimeEffects.health);
            
            // Career XP from overtime
            if (freeTimeEffects.careerXP && state.employed) {
                state.career.performanceRating = Math.min(100, (state.career.performanceRating || 50) + freeTimeEffects.careerXP);
            }
            
            // GPA bonus from studying (if in education)
            if (freeTimeEffects.gpaBonus && state.phase === 'education') {
                state.gpa = Math.min(4.0, (state.gpa || 2.5) + freeTimeEffects.gpaBonus);
            }
            
            // Attractiveness from gym (gradual improvement)
            if (freeTimeEffects.attractiveness) {
                let baseAttr = state.characterTraits?.attractiveness || 5;
                let maxBonus = 2; // Max +2 from fitness
                let currentBonus = (state.currentAttractiveness || baseAttr) - baseAttr;
                let newBonus = Math.min(maxBonus, currentBonus + freeTimeEffects.attractiveness);
                state.currentAttractiveness = baseAttr + newBonus;
            }
            
            // Age-based attractiveness decline (annually)
            if (state.totalWeeks % 52 === 0) {
                let age = getAge();
                let baseAttr = state.characterTraits?.attractiveness || 5;
                let currentAttr = state.currentAttractiveness || baseAttr;
                let gymHours = state.freeTime.gym || 0;
                
                if (age >= 30) {
                    // After 30, attractiveness slowly declines without maintenance
                    let decline = 0.1; // Base annual decline
                    if (age >= 40) decline = 0.15;
                    if (age >= 50) decline = 0.2;
                    
                    // Gym time can offset the decline
                    let gymOffset = gymHours * 0.03; // Each gym hour offsets some decline
                    let netDecline = Math.max(0, decline - gymOffset);
                    
                    state.currentAttractiveness = Math.max(baseAttr - 2, currentAttr - netDecline);
                }
            }
            
            // Store meeting bonus for dating calculations
            state.freeTimeMeetingBonus = freeTimeEffects.meetingBonus || 0;
            state.freeTimeNetworkBonus = freeTimeEffects.networkBonus || 0;
            
            // RELATIONSHIP TIME EFFECTS
            if (state.hasPartner && freeTimeEffects.bondBonus) {
                state.partnerStats.supportiveness = Math.min(100, state.partnerStats.supportiveness + freeTimeEffects.bondBonus);
                state.neglect.relationship = Math.max(0, state.neglect.relationship - 2);
            }
            
            // Natural stat changes
            state.energy = Math.min(100, state.energy + 5);
            state.stress = Math.max(0, state.stress - 2);
            if (state.stress > 70) state.happiness -= 1;
            if (state.energy < 30) state.health -= 1;
            
            // Relationship maintenance
            if (state.hasPartner) {
                // Neglect chance reduced by spending relationship time
                let relationshipHours = state.freeTime.relationship || 0;
                let neglectChance = relationshipHours >= 6 ? 0.02 : relationshipHours >= 3 ? 0.05 : 0.12;
                
                if (Math.random() < neglectChance) {
                    state.partnerStats.supportiveness -= 2;
                    if (state.partnerStats.supportiveness < 20) {
                        state.hasPartner = false;
                        state.partnerName = null;
                        state.partnerStats = null;
                        state.happiness -= 20;
                        addLog("Relationship ended");
                    }
                }
            }
            
            // Age-related health decline (after 40)
            if (getAge() > 40 && state.totalWeeks % 52 === 0) {
                state.health -= 2;
            }
            
            // Death checks
            if (state.health <= 0) {
                endGame("health");
                return false;
            }
            if (state.happiness <= 0) {
                endGame("despair");
                return false;
            }
            if (getAge() > 85 && Math.random() < 0.02) {
                endGame("age");
                return false;
            }
            
            // Clamp stats
            state.health = Math.max(0, Math.min(100, state.health));
            state.energy = Math.max(0, Math.min(100, state.energy));
            state.happiness = Math.max(0, Math.min(100, state.happiness));
            state.stress = Math.max(0, Math.min(100, state.stress));
            
            return true;
        }

        function getExhaustionCollapseEvent() {
            return {
                category: "⚠️ Collapse",
                title: "You've Hit the Wall",
                desc: "Your body simply refused to go any further. You collapsed from exhaustion.",
                choices: [
                    {
                        text: "Sleep it off at home (lose a week)",
                        effect: () => {
                            state.energy = 40;
                            state.health -= 10;
                            state.stress += 15;
                            if (state.employed) state.performance -= 15;
                            addLog("Collapsed from exhaustion");
                            return { icon: "😴", text: "You sleep for two days straight. Your body needed it desperately.", stats: "Energy restored, -10 Health" };
                        }
                    },
                    {
                        text: "Go to the hospital (costs money but safer)",
                        condition: () => state.money >= 500,
                        effect: () => {
                            state.money -= 500;
                            state.energy = 60;
                            state.health -= 5;
                            state.stress += 10;
                            if (state.employed) state.performance -= 10;
                            addLog("Hospitalized for exhaustion");
                            return { icon: "🏥", text: "IV fluids, rest, and stern warnings from doctors about self-care.", stats: "-$500, Energy restored, -5 Health" };
                        }
                    },
                    {
                        text: "Push through anyway (dangerous)",
                        effect: () => {
                            state.energy = 15;
                            state.health -= 25;
                            state.stress += 25;
                            let chance = Math.random();
                            if (chance < 0.3) {
                                state.health -= 15;
                                addLog("Collapsed and hit head");
                                return { icon: "🚨", text: "You tried to stand up and blacked out. Hit your head on the way down.", stats: "-40 Health total, Critical!" };
                            }
                            return { icon: "😤", text: "Somehow you're still moving. But your body won't forget this.", stats: "-25 Health, +25 Stress" };
                        }
                    }
                ]
            };
        }

        function nextEvent() {
            // Skip week advancement during character creation
            if (state.phase !== 'character_creation') {
            if (!advanceWeek()) return;
                
                // Check for exhaustion collapse first
                if (state.exhaustionCollapse) {
                    state.exhaustionCollapse = false;
                    displayEvent(getExhaustionCollapseEvent());
                    updateUI();
                    return;
                }
                
                // Check for neglect warnings (consequences of your choices)
                if (Math.random() < 0.15) {
                    let neglectWarning = getNeglectWarningEvent();
                    if (neglectWarning) {
                        displayEvent(neglectWarning);
                        updateUI();
                        return;
                    }
                }
                
                // Process fitness benefits
                if (state.fitness.gymMember || state.fitness.healthyEating) {
                    processFitnessWeek();
                }
            }
            
            let events = getPhaseEvents();
            
            // Filter out events that were recently shown (have IDs and are in lastEventIds)
            let filteredEvents = events.filter(e => {
                if (!e.id) return true; // Events without IDs are always allowed
                return !state.lastEventIds || !state.lastEventIds.includes(e.id);
            });
            
            // If all events were filtered out, use original list
            if (filteredEvents.length === 0) filteredEvents = events;
            
            let event = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
            
            displayEvent(event);
            updateUI();
        }

        function displayEvent(event) {
            // Track this event to prevent immediate repeats
            let eventId = event.id || (event.category + '_' + (typeof event.title === 'function' ? event.title() : event.title));
            
            // Record this event was shown
            state.lastEventIds = state.lastEventIds || [];
            state.lastEventIds.push(eventId);
            if (state.lastEventIds.length > 5) state.lastEventIds.shift(); // Keep last 5
            
            // Record cooldown for events that have one
            if (event.cooldown) {
                state.eventCooldowns = state.eventCooldowns || {};
                state.eventCooldowns[eventId] = state.totalWeeks;
            }
            
            document.getElementById('eventCategory').innerText = event.category;
            document.getElementById('eventTitle').innerText = typeof event.title === 'function' ? event.title() : event.title;
            document.getElementById('eventDesc').innerText = typeof event.desc === 'function' ? event.desc() : event.desc;
            document.getElementById('eventDate').innerText = `Age ${getAge()}, Month ${getMonth()}`;
            
            let container = document.getElementById('choicesContainer');
            container.innerHTML = '';
            
            event.choices.forEach(choice => {
                let btn = document.createElement('button');
                btn.className = 'choice-btn w-full text-left px-4 py-3 rounded-lg text-sm';
                btn.innerText = typeof choice.text === 'function' ? choice.text() : choice.text;
                
                if (choice.condition && !choice.condition()) {
                    btn.disabled = true;
                }
                
                btn.onclick = () => {
                    if (!btn.disabled) makeChoice(choice);
                };
                container.appendChild(btn);
            });
        }
        
        // Check if an event is on cooldown or was recently shown
        function isEventOnCooldown(eventId, cooldownWeeks = 8) {
            // Check if in last few events
            if (state.lastEventIds && state.lastEventIds.includes(eventId)) {
                return true;
            }
            
            // Check cooldown timer
            if (state.eventCooldowns && state.eventCooldowns[eventId]) {
                let weeksSince = state.totalWeeks - state.eventCooldowns[eventId];
                if (weeksSince < cooldownWeeks) {
                    return true;
                }
            }
            
            return false;
        }

        async function makeChoice(choice) {
            playSound('select');
            
            // Clear any previous roll data
            lastRollData = null;
            
            let outcome = choice.effect();
            
            // If outcome is null, no sound needed (modal was opened)
            if (outcome === null) return;
            
            // If a roll was made, show the dice animation first
            if (lastRollData) {
                await showDiceRoll(lastRollData);
                lastRollData = null;
            }
            
            // Play sound based on outcome
            let icon = outcome.icon || '';
            let stats = outcome.stats || '';
            if (['🎉', '✨', '🌟', '💰', '💵', '🤑', '💕', '💘', '🎊', '👏', '💪', '🏆'].includes(icon) ||
                stats.includes('+$') || stats.includes('+1') || stats.includes('Hired') || stats.includes('Success')) {
                playSound('success');
            } else if (['💔', '😢', '😭', '💀', '🚔', '😵', '🤮', '😠'].includes(icon) ||
                stats.includes('-$') || stats.includes('Fired') || stats.includes('ended') || stats.includes('Jail')) {
                playSound('hurt');
            } else if (icon === '💵' || icon === '💰' || stats.includes('+$')) {
                playSound('coin');
            }
            
            // Show outcome
            document.getElementById('outcomeIcon').innerText = outcome.icon;
            document.getElementById('outcomeText').innerText = outcome.text;
            document.getElementById('outcomeStats').innerText = outcome.stats || '';
            document.getElementById('outcomeDisplay').classList.remove('hidden');
            
            setTimeout(() => {
                document.getElementById('outcomeDisplay').classList.add('hidden');
                nextEvent();
            }, 1500);
        }

        function updateUI() {
            // Stats
            document.getElementById('healthBar').style.width = state.health + '%';
            document.getElementById('healthVal').innerText = Math.floor(state.health);
            
            // Energy with penalty indicator
            document.getElementById('energyBar').style.width = state.energy + '%';
            let energyPenalty = 0;
            if (state.energy <= 20) energyPenalty = -2;
            else if (state.energy <= 40) energyPenalty = -1;
            
            let energyText = Math.floor(state.energy);
            if (energyPenalty !== 0) {
                energyText += ` (${energyPenalty})`;
                document.getElementById('energyVal').className = 'text-xs text-red-400';
            } else {
                document.getElementById('energyVal').className = 'text-xs text-gray-500';
            }
            document.getElementById('energyVal').innerText = energyText;
            document.getElementById('energyVal').title = energyPenalty !== 0 ? `${energyPenalty} penalty to all rolls` : 'No roll penalty';
            
            document.getElementById('happyBar').style.width = state.happiness + '%';
            document.getElementById('happyVal').innerText = Math.floor(state.happiness);
            document.getElementById('stressBar').style.width = Math.min(100, state.stress) + '%';
            // Show stress value with penalty indicator
            let stressPenalty = 0;
            if (state.stress >= 80) stressPenalty = -4;
            else if (state.stress >= 60) stressPenalty = -2;
            else if (state.stress >= 40) stressPenalty = -1;
            
            let stressText = Math.floor(state.stress);
            if (stressPenalty !== 0) {
                stressText += ` (${stressPenalty})`;
            }
            document.getElementById('stressVal').innerText = stressText;
            document.getElementById('stressVal').title = stressPenalty !== 0 ? `${stressPenalty} penalty to all rolls` : 'No roll penalty';
            
            // Color stress bar based on level
            let stressBar = document.getElementById('stressBar');
            if (state.stress >= 80) {
                stressBar.className = 'stat-fill h-full bg-red-500 rounded-full animate-pulse';
                document.getElementById('stressVal').className = 'text-xs text-red-400';
            } else if (state.stress >= 60) {
                stressBar.className = 'stat-fill h-full bg-orange-500 rounded-full';
                document.getElementById('stressVal').className = 'text-xs text-orange-400';
            } else if (state.stress >= 40) {
                stressBar.className = 'stat-fill h-full bg-yellow-500 rounded-full';
                document.getElementById('stressVal').className = 'text-xs text-yellow-400';
            } else {
                stressBar.className = 'stat-fill h-full bg-purple-500 rounded-full';
                document.getElementById('stressVal').className = 'text-xs text-gray-500';
            }
            
            // Time
            document.getElementById('ageDisplay').innerText = getAge();
            document.getElementById('monthDisplay').innerText = getMonth();
            
            // Money
            let moneyEl = document.getElementById('moneyDisplay');
            moneyEl.innerText = '$' + state.money.toLocaleString();
            
            // Visual stress indicator for money levels
            moneyEl.classList.remove('text-red-400', 'text-orange-400', 'text-yellow-400', 'animate-pulse');
            
            if (state.money < 0) {
                moneyEl.classList.add('text-red-400', 'animate-pulse');
                moneyEl.innerText = '$' + state.money.toLocaleString() + ' ⚠️';
            } else if (state.money < 100) {
                moneyEl.classList.add('text-red-400');
                moneyEl.innerText = '$' + state.money.toLocaleString() + ' (BROKE)';
            } else if (state.money < 300) {
                moneyEl.classList.add('text-orange-400');
                moneyEl.innerText = '$' + state.money.toLocaleString() + ' (tight)';
            } else if (state.money < 500) {
                moneyEl.classList.add('text-yellow-400');
            }
            
            if (state.debt > 0) {
                document.getElementById('debtDisplay').classList.remove('hidden');
                document.getElementById('debtDisplay').innerText = `Debt: $${state.debt.toLocaleString()}`;
            } else {
                document.getElementById('debtDisplay').classList.add('hidden');
            }
            
            // Phase
            let phaseText = {
                'character_creation': 'Creating Character',
                'deciding': 'Deciding Future',
                'education': state.educationType === 'university' ? 'University' :
                             state.educationType === 'community_college' ? 'Community College' :
                             state.educationType === 'trade_school' ? 'Trade School' :
                             state.educationType === 'military_training' ? 'Boot Camp' :
                             state.educationType === 'military_service' ? 'Military Service' : 'Education',
                'job_hunting': 'Job Hunting',
                'employed': 'Employed',
                'retired': 'Retired'
            };
            document.getElementById('phaseBadge').innerText = phaseText[state.phase] || state.phase;
            
            // Phase progress
            if (state.phaseTarget > 0) {
                let progress = (state.phaseWeek / state.phaseTarget) * 100;
                document.getElementById('phaseProgress').style.width = progress + '%';
                document.getElementById('phaseLabel').innerText = `Week ${state.phaseWeek}`;
                document.getElementById('phaseTarget').innerText = `of ${state.phaseTarget}`;
            } else {
                document.getElementById('phaseProgress').style.width = '0%';
                document.getElementById('phaseLabel').innerText = `Week ${state.totalWeeks}`;
                document.getElementById('phaseTarget').innerText = '';
            }
            
            // Status - handle military specially
            if (state.job === 'military' && state.military.mos) {
                let rank = getMilitaryRank();
                let mos = MOS_OPTIONS[state.military.mos];
                document.getElementById('statusIcon').innerText = mos.icon;
                document.getElementById('statusTitle').innerText = `${rank.abbr} - ${mos.name.split(' ')[0]}`;
                document.getElementById('statusDesc').innerText = state.military.deployed ? 
                    `DEPLOYED (Week ${state.military.deploymentWeek}/12)` : 
                    `Garrison | ${state.military.missionsCompleted} missions`;
            } else {
                document.getElementById('statusIcon').innerText = state.employed ? '💼' : 
                    state.phase === 'education' ? '📚' : 
                    state.phase === 'job_hunting' ? '🔍' : '❓';
                document.getElementById('statusTitle').innerText = state.employed ? state.jobTitle :
                    state.phase === 'education' ? (state.educationType || 'Student').replace(/_/g, ' ') :
                    state.phase === 'job_hunting' ? 'Job Hunting' : 'Figuring it out';
                document.getElementById('statusDesc').innerText = state.employed ? `Week ${state.weeksAtJob}` :
                    state.phase === 'education' ? `Week ${state.phaseWeek} of ${state.phaseTarget}` :
                    state.phase === 'job_hunting' ? `${state.jobApplications} applications sent` : '';
            }
            
            // GPA display on status card (during education)
            let gpaDisplay = document.getElementById('gpaDisplay');
            let statusViewIcon = document.getElementById('statusViewIcon');
            if (state.phase === 'education' && (state.educationType === 'university' || state.educationType === 'community_college')) {
                gpaDisplay.classList.remove('hidden');
                let gpa = state.gpa || 0;
                let gpaColor = gpa >= 3.5 ? 'text-green-400' : gpa >= 3.0 ? 'text-cyan-400' : gpa >= 2.5 ? 'text-yellow-400' : gpa >= 2.0 ? 'text-orange-400' : 'text-red-400';
                document.getElementById('gpaValue').innerText = gpa.toFixed(2);
                document.getElementById('gpaValue').className = gpaColor;
                document.getElementById('gpaBar').style.width = (gpa / 4 * 100) + '%';
                document.getElementById('gpaBar').className = `h-full rounded-full ${gpa >= 3.5 ? 'bg-green-500' : gpa >= 3.0 ? 'bg-cyan-500' : gpa >= 2.5 ? 'bg-yellow-500' : gpa >= 2.0 ? 'bg-orange-500' : 'bg-red-500'}`;
                statusViewIcon.style.display = '';
            } else {
                gpaDisplay.classList.add('hidden');
                // Still show view icon for employed/job hunting phases
                statusViewIcon.style.display = state.phase === 'employed' || state.phase === 'job_hunting' || state.phase === 'education' ? '' : 'none';
            }
            
            // Housing
            let home = HOUSING[state.home];
            document.getElementById('homeIcon').innerText = home.icon;
            document.getElementById('homeName').innerText = home.name;
            let homeStressIndicator = home.stress > 0 ? ` 😰+${home.stress}` : home.stress < 0 ? ` 😌${home.stress}` : '';
            let homeAppealIndicator = (state.gender === 'male' && home.appeal !== 0) ? ` 💕${home.appeal > 0 ? '+' : ''}${home.appeal}` : '';
            document.getElementById('homeDesc').innerText = home.desc + homeStressIndicator + homeAppealIndicator;
            
            // Transport
            let car = TRANSPORT[state.car];
            document.getElementById('carIcon').innerText = car.icon;
            document.getElementById('carName').innerText = car.name;
            let carStressIndicator = car.stress > 0 ? ` 😰+${car.stress}` : car.stress < 0 ? ` 😌${car.stress}` : '';
            let carAppealIndicator = (state.gender === 'male' && car.appeal !== 0) ? ` 💕${car.appeal > 0 ? '+' : ''}${car.appeal}` : '';
            document.getElementById('carDesc').innerText = car.desc + carStressIndicator + carAppealIndicator;
            
            // Job
            if (state.employed && state.job) {
                document.getElementById('jobCard').style.display = 'block';
                
                if (state.job === 'military' && state.military.mos) {
                    let rank = getMilitaryRank();
                    let mos = MOS_OPTIONS[state.military.mos];
                    document.getElementById('jobIcon').innerText = '🎖️';
                    document.getElementById('jobName').innerText = `${rank.name}`;
                    let pay = rank.pay + (state.military.deployed ? 150 : 0);
                    document.getElementById('jobPay').innerText = `$${pay}/week${state.military.deployed ? ' (combat)' : ''}`;
                    document.getElementById('jobPerfVal').innerText = `${state.military.combatXP} XP`;
                    document.getElementById('jobPerfBar').style.width = Math.min(100, state.military.combatXP * 2) + '%';
                    document.getElementById('bossStatus').innerText = 'Military Chain';
                } else if (state.job === 'part_time') {
                    document.getElementById('jobIcon').innerText = '☕';
                    document.getElementById('jobName').innerText = state.jobTitle || 'Part-Time';
                    document.getElementById('jobPay').innerText = `$${state.weeklyIncome || 150}/week`;
                    document.getElementById('jobPerfVal').innerText = 'Student';
                    document.getElementById('jobPerfBar').style.width = '100%';
                    document.getElementById('bossStatus').innerText = 'Student Job';
                } else if (JOBS[state.job]) {
                    document.getElementById('jobIcon').innerText = JOBS[state.job].icon;
                    document.getElementById('jobName').innerText = state.jobTitle;
                    document.getElementById('jobPay').innerText = `$${state.baseSalary || JOBS[state.job].salary}/week`;
                    document.getElementById('jobPerfVal').innerText = state.performance + '%';
                    document.getElementById('jobPerfBar').style.width = state.performance + '%';
                    
                    // Show boss status
                    if (state.career.boss) {
                        let bossType = BOSS_PERSONALITIES[state.career.boss.personality];
                        document.getElementById('bossStatus').innerHTML = `${bossType.icon} ${bossType.name}`;
                    } else {
                        document.getElementById('bossStatus').innerText = '--';
                    }
                }
            } else {
                document.getElementById('jobCard').style.display = 'none';
            }
            
            // Business card
            if (state.business?.active) {
                document.getElementById('businessCard').style.display = 'block';
                let biz = BUSINESS_TYPES[state.business.type];
                document.getElementById('bizIcon').innerText = biz?.icon || '🏢';
                document.getElementById('bizName').innerText = state.business.name || 'Business';
                let profit = state.business.revenue - state.business.expenses;
                document.getElementById('bizProfit').innerText = `${profit >= 0 ? '+' : ''}$${profit}/wk`;
                document.getElementById('bizProfit').className = `text-[10px] ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`;
                document.getElementById('bizRepVal').innerText = state.business.reputation + '%';
                document.getElementById('bizRepBar').style.width = state.business.reputation + '%';
            } else {
                document.getElementById('businessCard').style.display = 'none';
            }
            
            // Partner / Dating
            document.getElementById('partnerCard').style.display = 'block'; // Always visible now
            if (state.hasPartner) {
                document.getElementById('partnerName').innerText = state.partnerName;
                document.getElementById('partnerStatus').innerText = state.married ? 'Married' : 'Dating';
                document.getElementById('partnerBondVal').innerText = (state.partnerStats?.supportiveness || 50) + '%';
                document.getElementById('partnerBondBar').style.width = (state.partnerStats?.supportiveness || 50) + '%';
                // Use partner's icon or default based on relationship status
                let partnerIcon = state.partnerStats?.icon || (state.partnerStats?.gender === 'female' ? '👩' : '👨');
                if (state.married) partnerIcon = '💍';
                document.getElementById('partnerContent').querySelector('.text-xl').innerText = partnerIcon;
            } else {
                let lonelyInfo = getLonelinessDescription();
                document.getElementById('partnerName').innerText = 'Single';
                document.getElementById('partnerStatus').innerText = state.loneliness >= 40 ? lonelyInfo.text : 'Browse matches';
                document.getElementById('partnerStatus').className = `text-[10px] text-${state.loneliness >= 40 ? lonelyInfo.color + '-400' : 'gray-500'}`;
                document.getElementById('partnerBondVal').innerText = state.loneliness >= 20 ? `${state.loneliness}% lonely` : calculateAppeal() + '% appeal';
                document.getElementById('partnerBondBar').style.width = (state.loneliness >= 20 ? state.loneliness : calculateAppeal()) + '%';
                document.getElementById('partnerBondBar').className = `h-full ${state.loneliness >= 60 ? 'bg-red-500' : state.loneliness >= 40 ? 'bg-orange-500' : state.loneliness >= 20 ? 'bg-yellow-500' : 'bg-pink-500'} rounded-full`;
                document.getElementById('partnerContent').querySelector('.text-xl').innerText = lonelyInfo.icon;
            }
            
            // Update relationships summary
            updateRelationshipsSummary();
            
            // Character Traits display
            if (state.gender && state.characterTraits) {
                document.getElementById('traitsCard').style.display = 'block';
                let traits = state.characterTraits;
                
                // Height (male) or Build (female)
                if (state.gender === 'female') {
                    let buildDesc = TRAIT_DESCRIPTORS.build[traits.build];
                    document.getElementById('traitPhysicalLabel').innerHTML = '👗 Build';
                    document.getElementById('traitPhysical').innerText = buildDesc;
                    document.getElementById('traitPhysicalBar').style.width = (traits.build * 10) + '%';
                    // Middle ranges (fit/athletic) are highlighted positively
                    document.getElementById('traitPhysicalBar').className = `h-full rounded-full transition-all ${traits.build >= 5 && traits.build <= 7 ? 'bg-green-500' : 'bg-gray-400'}`;
                } else {
                    let heightDesc = TRAIT_DESCRIPTORS.height[traits.height];
                    document.getElementById('traitPhysicalLabel').innerHTML = '📏 Height';
                    document.getElementById('traitPhysical').innerText = heightDesc;
                    document.getElementById('traitPhysicalBar').style.width = (traits.height * 10) + '%';
                    document.getElementById('traitPhysicalBar').className = `h-full rounded-full transition-all ${traits.height >= 7 ? 'bg-green-500' : traits.height >= 4 ? 'bg-gray-400' : 'bg-orange-400'}`;
                }
                
                // Family Wealth
                let wealthDesc = TRAIT_DESCRIPTORS.familyWealth[traits.familyWealth];
                document.getElementById('traitWealth').innerText = wealthDesc;
                document.getElementById('traitWealthBar').style.width = (traits.familyWealth * 10) + '%';
                document.getElementById('traitWealthBar').className = `h-full rounded-full transition-all ${traits.familyWealth >= 7 ? 'bg-yellow-400' : traits.familyWealth >= 4 ? 'bg-yellow-600' : 'bg-orange-600'}`;
                
                // Intelligence
                let intelDesc = TRAIT_DESCRIPTORS.intelligence[traits.intelligence];
                document.getElementById('traitIntel').innerText = intelDesc;
                document.getElementById('traitIntelBar').style.width = (traits.intelligence * 10) + '%';
                document.getElementById('traitIntelBar').className = `h-full rounded-full transition-all ${traits.intelligence >= 7 ? 'bg-blue-400' : traits.intelligence >= 4 ? 'bg-blue-600' : 'bg-blue-800'}`;
                
                // Attractiveness (can change over time)
                let attrVal = state.currentAttractiveness || traits.attractiveness;
                let attrDisplay = Math.round(attrVal * 10) / 10;
                let baseAttr = traits.attractiveness;
                let bonus = attrVal > baseAttr ? ` ↑` : attrVal < baseAttr ? ` ↓` : '';
                let attrDesc = TRAIT_DESCRIPTORS.attractiveness[Math.round(attrVal)];
                document.getElementById('traitAttr').innerText = attrDesc + bonus;
                document.getElementById('traitAttrBar').style.width = (attrVal * 10) + '%';
                document.getElementById('traitAttrBar').className = `h-full rounded-full transition-all ${attrVal >= 7 ? 'bg-pink-400' : attrVal >= 4 ? 'bg-pink-600' : 'bg-pink-800'}`;
                
                // Self-control
                let selfCtrl = traits.selfControl || 5;
                let selfCtrlDesc = TRAIT_DESCRIPTORS.selfControl[selfCtrl];
                document.getElementById('traitSelfControl').innerText = selfCtrlDesc;
                document.getElementById('traitSelfControlBar').style.width = (selfCtrl * 10) + '%';
                document.getElementById('traitSelfControlBar').className = `h-full rounded-full transition-all ${selfCtrl >= 7 ? 'bg-purple-400' : selfCtrl >= 4 ? 'bg-purple-600' : 'bg-purple-800'}`;
                
                // Dating appeal breakdown
                let appeal = calculateAppeal();
                let appealEl = document.getElementById('datingAppeal');
                appealEl.innerText = Math.round(appeal);
                document.getElementById('datingAppealBar').style.width = Math.min(100, appeal) + '%';
                
                // Color based on appeal level
                if (appeal >= 60) {
                    appealEl.className = 'text-green-400';
                    document.getElementById('datingAppealBar').className = 'h-full rounded-full transition-all bg-gradient-to-r from-green-500 to-emerald-400';
                } else if (appeal >= 45) {
                    appealEl.className = 'text-cyan-400';
                    document.getElementById('datingAppealBar').className = 'h-full rounded-full transition-all bg-gradient-to-r from-cyan-500 to-blue-400';
                } else if (appeal >= 30) {
                    appealEl.className = 'text-yellow-400';
                    document.getElementById('datingAppealBar').className = 'h-full rounded-full transition-all bg-gradient-to-r from-yellow-500 to-orange-400';
                } else {
                    appealEl.className = 'text-red-400';
                    document.getElementById('datingAppealBar').className = 'h-full rounded-full transition-all bg-gradient-to-r from-red-600 to-red-400';
                }
            }
            
            // Fitness display (always visible now)
            let fitness = state.fitness.fitnessLevel || 50;
            let fitnessDesc = getFitnessDescription(fitness);
            
            document.getElementById('fitnessLevel').innerText = `${fitnessDesc} (${Math.round(fitness)})`;
            document.getElementById('fitnessBar').style.width = `${fitness}%`;
            
            // Color coding for fitness bar
            if (fitness >= 70) {
                document.getElementById('fitnessBar').className = 'h-full rounded-full transition-all bg-green-500';
                document.getElementById('fitnessLevel').className = 'text-green-400';
            } else if (fitness >= 50) {
                document.getElementById('fitnessBar').className = 'h-full rounded-full transition-all bg-cyan-500';
                document.getElementById('fitnessLevel').className = 'text-cyan-400';
            } else if (fitness >= 30) {
                document.getElementById('fitnessBar').className = 'h-full rounded-full transition-all bg-yellow-500';
                document.getElementById('fitnessLevel').className = 'text-yellow-400';
            } else {
                document.getElementById('fitnessBar').className = 'h-full rounded-full transition-all bg-red-500';
                document.getElementById('fitnessLevel').className = 'text-red-400';
            }
            
            // Gym and eating status
            document.getElementById('fitnessGym').innerText = state.fitness.gymMember ? '🏋️ Gym' : '❌ No gym';
            document.getElementById('fitnessGym').className = state.fitness.gymMember ? 'text-green-400 text-[9px]' : 'text-gray-500 text-[9px]';
            document.getElementById('fitnessEating').innerText = state.fitness.healthyEating ? '🥗 Healthy' : '🍔 Normal';
            document.getElementById('fitnessEating').className = state.fitness.healthyEating ? 'text-green-400 text-[9px]' : 'text-gray-500 text-[9px]';
            
            // Streak display
                if (state.fitness.workoutStreak > 0) {
                    document.getElementById('fitnessStreak').innerText = state.fitness.routineEstablished 
                        ? `✨ ${state.fitness.workoutStreak} week streak!`
                        : `${state.fitness.workoutStreak}/8 weeks to routine`;
                document.getElementById('fitnessStreak').className = 'text-[9px] text-cyan-400';
                } else {
                    document.getElementById('fitnessStreak').innerText = '';
                }
            
            // Warning for low fitness
            let fitnessWarning = document.getElementById('fitnessWarning');
            if (fitness < 30) {
                fitnessWarning.classList.remove('hidden');
                fitnessWarning.innerText = '⚠️ Low fitness! Energy & health at risk';
            } else if (fitness < 40 && !state.fitness.gymMember) {
                fitnessWarning.classList.remove('hidden');
                fitnessWarning.innerText = '📉 Fitness declining - consider gym';
            } else {
                fitnessWarning.classList.add('hidden');
            }
            
            // Free Time display
            let maxFreeTime = getAvailableFreeTime();
            let usedFreeTime = Object.values(state.freeTime).reduce((a, b) => a + b, 0);
            let unallocatedTime = maxFreeTime - usedFreeTime;
            
            document.getElementById('freeTimeUsed').innerText = `${usedFreeTime}/${maxFreeTime} hrs`;
            // Highlight unallocated time in orange/red
            if (unallocatedTime > 2) {
                document.getElementById('freeTimeUsed').className = 'text-orange-400';
                document.getElementById('freeTimeUsed').innerText = `${usedFreeTime}/${maxFreeTime} hrs ⚠️`;
            } else {
                document.getElementById('freeTimeUsed').className = 'text-cyan-400';
            }
            
            let freeTimeCost = state.freeTimeExpenses || 0;
            let overtimeEarnings = state.overtimeEarnings || 0;
            let netCost = freeTimeCost - overtimeEarnings;
            document.getElementById('freeTimeCost').innerText = netCost >= 0 ? `$${netCost}` : `+$${Math.abs(netCost)}`;
            document.getElementById('freeTimeCost').className = netCost > 0 ? 'text-yellow-400' : netCost < 0 ? 'text-green-400' : 'text-gray-400';
            
            // Summary of activities
            let summaryParts = [];
            Object.keys(state.freeTime).forEach(key => {
                let hours = state.freeTime[key] || 0;
                if (hours > 0) {
                    summaryParts.push(`${FREE_TIME_ACTIVITIES[key].icon}${hours}h`);
                }
            });
            document.getElementById('freeTimeSummary').innerText = summaryParts.length > 0 ? summaryParts.join(' ') : 'Click to allocate time';
            
            // Subscriptions display
            let activeSubsCount = Object.keys(state.subscriptions).filter(k => state.subscriptions[k]).length;
            let subsCost = 0;
            let subsIcons = [];
            Object.keys(state.subscriptions).forEach(key => {
                if (state.subscriptions[key] && SUBSCRIPTIONS[key]) {
                    subsCost += SUBSCRIPTIONS[key].cost;
                    subsIcons.push(SUBSCRIPTIONS[key].icon);
                }
            });
            document.getElementById('subsCount').innerText = activeSubsCount;
            document.getElementById('subsCost').innerText = `$${subsCost}/week`;
            document.getElementById('subsCost').className = subsCost > 0 ? 'text-yellow-400' : 'text-gray-400';
            document.getElementById('subsSummary').innerText = subsIcons.length > 0 ? subsIcons.join(' ') : 'Click to subscribe';
            
            // Hobbies display
            let activeHobbies = state.hobbies.active || [];
            document.getElementById('hobbiesCount').innerText = `${activeHobbies.length}/3`;
            
            // Find top hobby skill
            let topHobby = '';
            let topSkill = 0;
            activeHobbies.forEach(hKey => {
                let skill = state.hobbies.skills[hKey] || 0;
                if (skill > topSkill) {
                    topSkill = skill;
                    topHobby = HOBBIES[hKey]?.name || hKey;
                }
            });
            document.getElementById('topHobbySkill').innerText = topSkill > 0 ? `${topHobby} ${Math.floor(topSkill)}%` : '-';
            
            // Hobbies summary icons
            let hobbyIcons = activeHobbies.map(h => HOBBIES[h]?.icon || '🎨').join(' ');
            document.getElementById('hobbiesSummary').innerText = hobbyIcons || 'Click to pick hobbies';
            
            // Habits display
            let maxWP = calculateMaxWillpower();
            let habitWPCost = getTotalHabitCost();
            let availableWP = maxWP - habitWPCost;
            
            document.getElementById('willpowerDisplay').innerText = `${Math.max(0, availableWP)}/${maxWP}`;
            document.getElementById('willpowerDisplay').className = availableWP < 0 ? 'text-red-400 animate-pulse' : 
                                                                    availableWP < maxWP * 0.3 ? 'text-orange-400' : 'text-purple-400';
            document.getElementById('habitCostDisplay').innerText = habitWPCost > 0 ? habitWPCost : habitWPCost < 0 ? `+${Math.abs(habitWPCost)}` : '0';
            document.getElementById('habitCostDisplay').className = habitWPCost > 0 ? 'text-cyan-400' : habitWPCost < 0 ? 'text-green-400' : 'text-gray-400';
            
            let habitIcons = [];
            Object.keys(state.habits || {}).forEach(key => {
                if (state.habits[key]?.active && HABITS[key]) {
                    habitIcons.push(HABITS[key].icon);
                }
            });
            document.getElementById('habitsSummary').innerText = habitIcons.length > 0 ? habitIcons.join(' ') : 'Click to set habits';
            
            // Skill bars
            document.getElementById('techBar').style.width = state.skills.technical + '%';
            document.getElementById('techVal').innerText = Math.floor(state.skills.technical);
            document.getElementById('socialBar').style.width = state.skills.social + '%';
            document.getElementById('socialVal').innerText = Math.floor(state.skills.social);
            document.getElementById('physicalBar').style.width = state.skills.physical + '%';
            document.getElementById('physicalVal').innerText = Math.floor(state.skills.physical);
            document.getElementById('creativeBar').style.width = state.skills.creativity + '%';
            document.getElementById('creativeVal').innerText = Math.floor(state.skills.creativity);
            
            // Network & connections
            document.getElementById('networkContacts').innerText = state.career.networkContacts || 0;
            document.getElementById('creditScoreDisplay').innerText = state.finances.creditScore || 650;
            
            // Color the credit score based on value
            let creditScoreEl = document.getElementById('creditScoreDisplay');
            if (state.finances.creditScore >= 750) {
                creditScoreEl.className = 'text-green-400';
            } else if (state.finances.creditScore >= 650) {
                creditScoreEl.className = 'text-yellow-400';
            } else if (state.finances.creditScore >= 550) {
                creditScoreEl.className = 'text-orange-400';
            } else {
                creditScoreEl.className = 'text-red-400';
            }
            
            // Credit Card display
            let creditCardCard = document.getElementById('creditCardCard');
            if (state.finances.hasCreditCard) {
                creditCardCard.style.display = 'block';
                document.getElementById('creditBalance').innerText = '$' + (state.finances.creditBalance || 0).toLocaleString();
                document.getElementById('creditLimit').innerText = '$' + (state.finances.creditLimit || 0).toLocaleString();
                document.getElementById('creditAPR').innerText = ((state.finances.creditAPR || 0) * 100).toFixed(1) + '%';
                document.getElementById('creditAvailable').innerText = '$' + Math.max(0, (state.finances.creditLimit - state.finances.creditBalance)).toLocaleString();
                
                // Color balance based on utilization
                let utilization = state.finances.creditBalance / state.finances.creditLimit;
                let balanceEl = document.getElementById('creditBalance');
                if (utilization === 0) {
                    balanceEl.className = 'text-green-400';
                } else if (utilization < 0.3) {
                    balanceEl.className = 'text-yellow-400';
                } else if (utilization < 0.7) {
                    balanceEl.className = 'text-orange-400';
                } else {
                    balanceEl.className = 'text-red-400';
                }
            } else {
                creditCardCard.style.display = 'none';
            }
            
            // Education & Traits
            let traits = [];
            if (state.education === 'university') traits.push('🎓 Bachelor\'s Degree');
            else if (state.education === 'community_college') traits.push('📚 Associate\'s Degree');
            else if (state.education === 'trade_school') traits.push('🔧 Trade Certificate');
            else if (state.education === 'military') traits.push('🎖️ Military Training');
            else if (state.education === 'high_school') traits.push('📜 High School Diploma');
            else traits.push('📖 High School (in progress)');
            
            // Add major if applicable
            if (state.university && state.university.major && MAJORS[state.university.major]) {
                traits.push(MAJORS[state.university.major].icon + ' ' + MAJORS[state.university.major].name);
            }
            
            // Add trade if applicable
            if (state.tradeSchool && state.tradeSchool.trade && TRADES[state.tradeSchool.trade]) {
                let cert = TRADE_CERT_LEVELS[state.tradeSchool.certLevel];
                traits.push(TRADES[state.tradeSchool.trade].icon + ' ' + cert.name + ' ' + TRADES[state.tradeSchool.trade].name);
            }
            
            // Personality traits from choices
            if (state.skills.technical >= 60) traits.push('🧠 Tech-Savvy');
            if (state.skills.social >= 60) traits.push('🗣️ People Person');
            if (state.skills.physical >= 60) traits.push('💪 Fit');
            if (state.skills.creativity >= 60) traits.push('🎨 Creative');
            
            // Life achievements
            if (state.finances.homeOwned) traits.push('🏠 Homeowner');
            if (state.relationship.children > 0) traits.push('👶 Parent');
            if (state.finances.investments > 10000) traits.push('📈 Investor');
            
            // Military medals
            if (state.military.medals && state.military.medals.length > 0) {
                state.military.medals.forEach(m => traits.push('🏅 ' + m));
            }
            
            document.getElementById('skillsList').innerText = traits.join('\n');
            
            // Monthly budget (weekly * 4)
            calculateWeeklyFinances();
            let monthlyIncome = state.weeklyIncome * 4;
            let monthlyExpenses = state.weeklyExpenses * 4;
            let monthlyNet = monthlyIncome - monthlyExpenses;
            
            document.getElementById('monthlyIncome').innerText = '+$' + monthlyIncome.toLocaleString();
            document.getElementById('monthlyExpenses').innerText = '-$' + monthlyExpenses.toLocaleString();
            document.getElementById('monthlyNet').innerText = (monthlyNet >= 0 ? '+' : '') + '$' + monthlyNet.toLocaleString();
            document.getElementById('monthlyNet').className = monthlyNet >= 0 ? 'text-green-400' : 'text-red-400';
            
            // Debt warning
            let debtWarning = document.getElementById('debtWarning');
            if (state.debt > 0 || state.creditCardDebt > 0 || state.money < -1000) {
                debtWarning.classList.remove('hidden');
                let totalDebt = (state.debt || 0) + (state.creditCardDebt || 0) + (state.money < 0 ? Math.abs(state.money) : 0);
                debtWarning.innerText = `⚠️ $${totalDebt.toLocaleString()} in debt`;
            } else {
                debtWarning.classList.add('hidden');
            }
        }

        function endGame(cause) {
            document.getElementById('gameOverScreen').classList.remove('hidden');
            
            let icon, title, desc;
            switch(cause) {
                case "health": icon = "💔"; title = "Health Failed"; desc = "Your body gave out."; break;
                case "despair": icon = "🌑"; title = "Lost Hope"; desc = "The weight was too much."; break;
                case "early": icon = "📖"; title = "Chapter Closed"; desc = "You decided to see how your story turned out."; break;
                default: icon = "🌅"; title = "A Full Life"; desc = "You lived to a ripe old age.";
            }
            
            // Calculate total net worth
            let netWorth = state.money - state.debt;
            netWorth += state.finances.investments || 0;
            netWorth += state.finances.homeOwned ? (state.finances.homeValue - (state.finances.homeValue * 0.3)) : 0;
            netWorth += state.finances.carValue || 0;
            netWorth += state.finances.retirementAccount || 0;
            netWorth += state.finances.emergencyFund || 0;
            
            document.getElementById('endIcon').innerText = icon;
            document.getElementById('endTitle').innerText = title;
            document.getElementById('endDesc').innerText = desc;
            document.getElementById('finalAge').innerText = getAge() + ' years';
            document.getElementById('finalCareer').innerText = state.jobTitle || 'Never employed';
            document.getElementById('finalWealth').innerText = '$' + Math.floor(netWorth).toLocaleString();
            
            // Family status
            let familyStatus = state.married ? `Married to ${state.partnerName}` : 
                                                               state.hasPartner ? `Dating ${state.partnerName}` : 'Single';
            if (state.relationship.children > 0) {
                familyStatus += `, ${state.relationship.children} ${state.relationship.children === 1 ? 'child' : 'children'}`;
            }
            document.getElementById('finalFamily').innerText = familyStatus;
            
            // Calculate life score and tier
            let lifeAssessment = calculateLifeAssessment(cause, netWorth);
            
            // Set life tier banner
            let tierBanner = document.getElementById('lifeTierBanner');
            tierBanner.className = `mb-6 py-4 px-6 rounded-xl border-2 ${lifeAssessment.tierClass}`;
            document.getElementById('lifeTierLabel').innerText = 'Life Assessment';
            document.getElementById('lifeTierTitle').innerText = lifeAssessment.tierTitle;
            document.getElementById('lifeTierSubtitle').innerText = lifeAssessment.tierSubtitle;
            
            // Generate obituary
            let obituary = generateObituary(cause, netWorth, lifeAssessment);
            document.getElementById('obituaryText').innerHTML = obituary;
            
            // Build achievements list
            let achievements = [];
            if (state.achievements.length > 0) achievements.push(...state.achievements.slice(0, 5));
            if (state.finances.homeOwned) achievements.push('🏠 Homeowner');
            if (netWorth > 100000) achievements.push('💎 Wealthy');
            else if (netWorth > 50000) achievements.push('💰 Comfortable');
            if (state.career.promotions > 3) achievements.push('📈 Career Climber');
            if (state.relationship.children >= 3) achievements.push('👨‍👩‍👧‍👦 Big Family');
            if (state.married && state.relationshipWeeks > 520) achievements.push('💍 Lasting Marriage');
            if (state.university && state.university.studyAbroadDone) achievements.push('🌍 World Traveler');
            if (state.military.medals && state.military.medals.length > 0) achievements.push('🎖️ Decorated Veteran');
            if (state.skills.technical >= 80) achievements.push('🧠 Technical Master');
            if (state.skills.social >= 80) achievements.push('🤝 Social Butterfly');
            if (state.skills.physical >= 80) achievements.push('💪 Peak Fitness');
            if (state.skills.creativity >= 80) achievements.push('🎨 Creative Soul');
            if (state.education === 'university' && state.gpa >= 3.5) achievements.push('🎓 Honors Graduate');
            if (state.finances.creditScore >= 800) achievements.push('📊 Perfect Credit');
            if (getAge() >= 80) achievements.push('🎂 Long Life');
            
            document.getElementById('finalEpitaph').innerText = achievements.length > 0 ? achievements.join(' • ') : 'Lived quietly';
        }
        
        function calculateLifeAssessment(cause, netWorth) {
            let score = 0;
            
            // Longevity (0-20 points)
            let age = getAge();
            if (age >= 85) score += 20;
            else if (age >= 75) score += 15;
            else if (age >= 65) score += 10;
            else if (age >= 50) score += 5;
            else if (age < 30) score -= 10;
            
            // Cause of death modifier
            if (cause === 'health') score -= 5;
            if (cause === 'despair') score -= 15;
            
            // Relationships (0-25 points)
            if (state.married) score += 10;
            else if (state.hasPartner) score += 5;
            if (state.relationship.children > 0) score += 5;
            if (state.relationship.children >= 2) score += 3;
            if (state.relationshipWeeks > 260) score += 5; // 5+ year relationship
            if (state.relationship.marriageWeeks > 520) score += 7; // 10+ year marriage
            
            // Wealth (0-20 points)
            if (netWorth > 500000) score += 20;
            else if (netWorth > 200000) score += 15;
            else if (netWorth > 100000) score += 10;
            else if (netWorth > 50000) score += 5;
            else if (netWorth < 0) score -= 10;
            
            // Career (0-15 points)
            if (state.jobTitle) score += 5;
            if (state.career.promotions > 2) score += 5;
            if (state.career.promotions > 5) score += 5;
            
            // Skills & Growth (0-10 points)
            let avgSkill = (state.skills.technical + state.skills.social + state.skills.physical + state.skills.creativity) / 4;
            if (avgSkill >= 60) score += 5;
            if (avgSkill >= 80) score += 5;
            
            // Final happiness matters (0-10 points)
            if (state.happiness >= 80) score += 10;
            else if (state.happiness >= 60) score += 5;
            else if (state.happiness < 30) score -= 5;
            
            // Determine tier
            let tierTitle, tierSubtitle, tierClass;
            
            if (score >= 80) {
                tierTitle = "🌟 An Extraordinary Life";
                tierSubtitle = "A life of purpose, love, and remarkable achievement";
                tierClass = "border-yellow-500 bg-yellow-900/30 text-yellow-300";
            } else if (score >= 65) {
                tierTitle = "✨ A Wonderful Life";
                tierSubtitle = "Blessed with happiness, success, and meaningful connections";
                tierClass = "border-green-500 bg-green-900/30 text-green-300";
            } else if (score >= 50) {
                tierTitle = "☀️ A Good Life";
                tierSubtitle = "A solid life with its share of joy and accomplishment";
                tierClass = "border-cyan-500 bg-cyan-900/30 text-cyan-300";
            } else if (score >= 35) {
                tierTitle = "🌤️ An Ordinary Life";
                tierSubtitle = "A modest existence with ups and downs";
                tierClass = "border-gray-500 bg-gray-900/30 text-gray-300";
            } else if (score >= 20) {
                tierTitle = "🌧️ A Difficult Life";
                tierSubtitle = "Marked by struggle and hardship";
                tierClass = "border-orange-500 bg-orange-900/30 text-orange-300";
            } else if (score >= 5) {
                tierTitle = "⛈️ A Hard Life";
                tierSubtitle = "A life filled with challenge and disappointment";
                tierClass = "border-red-500 bg-red-900/30 text-red-300";
            } else {
                tierTitle = "🌑 A Tragic Life";
                tierSubtitle = "Cut short, unfulfilled, and full of sorrow";
                tierClass = "border-gray-700 bg-gray-900/50 text-gray-400";
            }
            
            return { score, tierTitle, tierSubtitle, tierClass };
        }
        
        function generateObituary(cause, netWorth, assessment) {
            let name = state.gender === 'male' ? 'He' : 'She';
            let name2 = state.gender === 'male' ? 'his' : 'her';
            let age = getAge();
            
            let parts = [];
            
            // Opening based on cause
            if (cause === 'despair') {
                parts.push(`${name} departed this world too soon, at the age of ${age}, leaving behind unfinished dreams.`);
            } else if (cause === 'health') {
                parts.push(`${name} passed away at ${age} years of age, ${name2} body finally giving out.`);
            } else {
                parts.push(`${name} lived a full ${age} years before peacefully passing on.`);
            }
            
            // Education
            if (state.education === 'university') {
                parts.push(`${name} graduated from university${state.gpa >= 3.5 ? ' with honors' : ''}.`);
            } else if (state.education === 'military') {
                parts.push(`${name} served ${name2} country proudly in the military.`);
            } else if (state.education === 'trade_school') {
                parts.push(`${name} learned a valuable trade and built things with ${name2} hands.`);
            }
            
            // Career
            if (state.jobTitle) {
                if (state.career.promotions > 3) {
                    parts.push(`${name} had a successful career, rising through the ranks to become a ${state.jobTitle}.`);
                } else {
                    parts.push(`${name} worked as a ${state.jobTitle}.`);
                }
            }
            
            // Family
            if (state.married && state.relationship.children > 0) {
                let years = Math.floor((state.relationship.marriageWeeks || 0) / 52);
                parts.push(`${name} was married to ${state.partnerName}${years > 5 ? ` for ${years} wonderful years` : ''} and raised ${state.relationship.children} ${state.relationship.children === 1 ? 'child' : 'children'}.`);
            } else if (state.married) {
                parts.push(`${name} found love and was married to ${state.partnerName}.`);
            } else if (state.relationship.children > 0) {
                parts.push(`${name} raised ${state.relationship.children} ${state.relationship.children === 1 ? 'child' : 'children'}.`);
            } else if (cause !== 'despair') {
                parts.push(`${name} walked ${name2} own path in life.`);
            }
            
            // Wealth summary
            if (netWorth > 200000) {
                parts.push(`${name} built considerable wealth, leaving behind a legacy of financial security.`);
            } else if (netWorth < 0) {
                parts.push(`${name} struggled financially throughout life.`);
            }
            
            // Special achievements
            if (state.military.medals && state.military.medals.length > 0) {
                parts.push(`${name} was decorated for ${name2} military service.`);
            }
            if (state.finances.homeOwned) {
                parts.push(`${name} achieved the dream of homeownership.`);
            }
            
            // Closing based on assessment
            if (assessment.score >= 65) {
                parts.push(`${name} will be remembered fondly by all who knew ${name2 === 'his' ? 'him' : 'her'}.`);
            } else if (assessment.score >= 35) {
                parts.push(`${name} lived ${name2} life on ${name2} own terms.`);
            } else if (assessment.score >= 10) {
                parts.push(`Despite the hardships, ${name.toLowerCase()} persevered.`);
            } else {
                parts.push(`May ${name.toLowerCase()} find peace at last.`);
            }
            
            return parts.join(' ');
        }

        // ============ HOUSING & TRANSPORT MODALS ============
        function openHousingModal() {
            let modal = document.getElementById('housingModal');
            let optionsDiv = document.getElementById('housingOptions');
            optionsDiv.innerHTML = '';
            
            let currentIndex = HOUSING_ORDER.indexOf(state.home);
            
            HOUSING_ORDER.forEach((key, index) => {
                let housing = HOUSING[key];
                let isCurrent = key === state.home;
                let canAfford = state.money >= housing.rent * 4; // Need 4 weeks rent
                let meetsCredit = !housing.upgradeReq?.creditScore || state.finances.creditScore >= housing.upgradeReq.creditScore;
                let isDowngrade = index < currentIndex;
                let isUpgrade = index > currentIndex;
                
                let statusText = '';
                let canSelect = false;
                
                if (isCurrent) {
                    statusText = '<span class="text-cyan-400">✓ Current</span>';
                } else if (isUpgrade) {
                    if (!canAfford) {
                        statusText = `<span class="text-red-400">Need $${(housing.rent * 4).toLocaleString()}</span>`;
                    } else if (!meetsCredit) {
                        statusText = `<span class="text-red-400">Need ${housing.upgradeReq.creditScore} credit</span>`;
                    } else {
                        statusText = '<span class="text-green-400">Available</span>';
                        canSelect = true;
                    }
                } else if (isDowngrade) {
                    statusText = '<span class="text-yellow-400">Downgrade</span>';
                    canSelect = true;
                }
                
                // Appeal display (for males)
                let appealText = '';
                if (state.gender === 'male') {
                    let appealDiff = housing.appeal - HOUSING[state.home].appeal;
                    if (appealDiff > 0) appealText = `<span class="text-pink-400">+${appealDiff} dating appeal</span>`;
                    else if (appealDiff < 0) appealText = `<span class="text-gray-500">${appealDiff} dating appeal</span>`;
                }
                
                let stressDiff = housing.stress - HOUSING[state.home].stress;
                let stressText = stressDiff < 0 ? `<span class="text-green-400">${stressDiff} stress</span>` : 
                                 stressDiff > 0 ? `<span class="text-red-400">+${stressDiff} stress</span>` : '';
                
                let div = document.createElement('div');
                div.className = `p-3 rounded border ${isCurrent ? 'border-cyan-500 bg-cyan-900/20' : canSelect ? 'border-gray-600 hover:border-gray-500 cursor-pointer' : 'border-gray-700 opacity-50'} transition-colors`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${housing.icon}</span>
                            <div>
                                <div class="text-white font-medium">${housing.name}</div>
                                <div class="text-xs text-gray-400">${housing.desc}</div>
                            </div>
                        </div>
                        <div class="text-right text-xs">
                            ${statusText}
                            ${stressText ? '<br>' + stressText : ''}
                            ${appealText ? '<br>' + appealText : ''}
                        </div>
                    </div>
                `;
                
                if (canSelect) {
                    div.onclick = () => changeHousing(key, isUpgrade);
                }
                
                optionsDiv.appendChild(div);
            });
            
            // Add decoration button if player has their own place
            if (state.home !== 'parents' && state.home !== 'homeless') {
                let decorDiv = document.createElement('div');
                decorDiv.className = 'mt-4 pt-4 border-t border-gray-700';
                decorDiv.innerHTML = `
                    <button onclick="closeHousingModal(); openDecorationModal();" class="w-full py-2 bg-purple-600/50 hover:bg-purple-600 text-white rounded transition-colors">
                        🛋️ Decorate Your Home
                    </button>
                    <div class="text-xs text-gray-500 mt-1 text-center">
                        Home Quality: ${state.homeDecor?.quality || 0}% (${state.homeDecor?.style || 'basic'})
                    </div>
                `;
                optionsDiv.appendChild(decorDiv);
            }
            
            modal.classList.remove('hidden');
        }
        
        function closeHousingModal() {
            document.getElementById('housingModal').classList.add('hidden');
        }
        
        function changeHousing(newHousing, isUpgrade) {
            let oldHousing = HOUSING[state.home];
            let newHousingData = HOUSING[newHousing];
            
            // Moving costs
            let movingCost = isUpgrade ? newHousingData.rent * 4 : newHousingData.rent * 2;
            
            if (state.money < movingCost) {
                alert(`Not enough money! Need $${movingCost} for moving costs.`);
                return;
            }
            
            state.money -= movingCost;
            state.home = newHousing;
            state.weeklyExpenses = state.weeklyExpenses - oldHousing.rent + newHousingData.rent;
            
            addLog(`Moved to ${newHousingData.name}`);
            closeHousingModal();
            updateUI();
        }
        
        function openTransportModal() {
            let modal = document.getElementById('transportModal');
            let optionsDiv = document.getElementById('transportOptions');
            optionsDiv.innerHTML = '';
            
            let currentIndex = TRANSPORT_ORDER.indexOf(state.car);
            
            TRANSPORT_ORDER.forEach((key, index) => {
                let transport = TRANSPORT[key];
                let isCurrent = key === state.car;
                let isDowngrade = index < currentIndex;
                let isUpgrade = index > currentIndex;
                
                // Upfront costs for vehicles
                let upfrontCost = 0;
                if (key === 'bike') upfrontCost = 200;
                else if (key === 'beater') upfrontCost = 2000;
                else if (key === 'car') upfrontCost = 8000;
                
                let canAfford = state.money >= upfrontCost;
                let meetsCredit = !transport.upgradeReq?.creditScore || state.finances.creditScore >= transport.upgradeReq.creditScore;
                
                let statusText = '';
                let canSelect = false;
                
                if (isCurrent) {
                    statusText = '<span class="text-cyan-400">✓ Current</span>';
                } else if (isUpgrade) {
                    if (upfrontCost > 0 && !canAfford) {
                        statusText = `<span class="text-red-400">Need $${upfrontCost.toLocaleString()}</span>`;
                    } else if (!meetsCredit) {
                        statusText = `<span class="text-red-400">Need ${transport.upgradeReq.creditScore} credit</span>`;
                    } else {
                        statusText = upfrontCost > 0 ? `<span class="text-green-400">$${upfrontCost.toLocaleString()}</span>` : '<span class="text-green-400">Available</span>';
                        canSelect = true;
                    }
                } else if (isDowngrade) {
                    // Can sell vehicle when downgrading
                    let sellValue = 0;
                    if (state.car === 'bike') sellValue = 50;
                    else if (state.car === 'beater') sellValue = 500;
                    else if (state.car === 'car') sellValue = 3000;
                    statusText = sellValue > 0 ? `<span class="text-yellow-400">Sell +$${sellValue}</span>` : '<span class="text-yellow-400">Downgrade</span>';
                    canSelect = true;
                }
                
                // Appeal display (for males)
                let appealText = '';
                if (state.gender === 'male') {
                    let appealDiff = transport.appeal - TRANSPORT[state.car].appeal;
                    if (appealDiff > 0) appealText = `<span class="text-pink-400">+${appealDiff} dating appeal</span>`;
                    else if (appealDiff < 0) appealText = `<span class="text-gray-500">${appealDiff} dating appeal</span>`;
                }
                
                let stressDiff = transport.stress - TRANSPORT[state.car].stress;
                let stressText = stressDiff < 0 ? `<span class="text-green-400">${stressDiff} stress</span>` : 
                                 stressDiff > 0 ? `<span class="text-red-400">+${stressDiff} stress</span>` : '';
                
                let div = document.createElement('div');
                div.className = `p-3 rounded border ${isCurrent ? 'border-cyan-500 bg-cyan-900/20' : canSelect ? 'border-gray-600 hover:border-gray-500 cursor-pointer' : 'border-gray-700 opacity-50'} transition-colors`;
                div.innerHTML = `
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${transport.icon}</span>
                            <div>
                                <div class="text-white font-medium">${transport.name}</div>
                                <div class="text-xs text-gray-400">${transport.desc}</div>
                            </div>
                        </div>
                        <div class="text-right text-xs">
                            ${statusText}
                            ${stressText ? '<br>' + stressText : ''}
                            ${appealText ? '<br>' + appealText : ''}
                        </div>
                    </div>
                `;
                
                if (canSelect) {
                    div.onclick = () => changeTransport(key, isUpgrade);
                }
                
                optionsDiv.appendChild(div);
            });
            
            modal.classList.remove('hidden');
        }
        
        function closeTransportModal() {
            document.getElementById('transportModal').classList.add('hidden');
        }
        
        function changeTransport(newTransport, isUpgrade) {
            let oldTransport = TRANSPORT[state.car];
            let newTransportData = TRANSPORT[newTransport];
            
            // Calculate costs/gains
            let cost = 0;
            if (isUpgrade) {
                if (newTransport === 'bike') cost = 200;
                else if (newTransport === 'beater') cost = 2000;
                else if (newTransport === 'car') cost = 8000;
            } else {
                // Selling current vehicle
                if (state.car === 'bike') cost = -50;
                else if (state.car === 'beater') cost = -500;
                else if (state.car === 'car') cost = -3000;
            }
            
            if (cost > 0 && state.money < cost) {
                alert(`Not enough money! Need $${cost}.`);
                return;
            }
            
            state.money -= cost;
            state.car = newTransport;
            state.weeklyExpenses = state.weeklyExpenses - oldTransport.cost + newTransportData.cost;
            
            addLog(`${cost > 0 ? 'Bought' : cost < 0 ? 'Sold vehicle, now using' : 'Switched to'} ${newTransportData.name}`);
            closeTransportModal();
            updateUI();
        }
        
        // ============ TUTORIAL SYSTEM ============
        let tutorialStep = 0;
        const TUTORIAL_STEPS = [
            {
                icon: "🎮",
                title: "Welcome to Life Game!",
                content: `
                    <p>You're about to live an entire life - from 18 to whatever fate has in store.</p>
                    <p class="mt-2">Every week, you'll face <span class="text-cyan-400">choices</span> that shape your character's future.</p>
                    <p class="mt-2">Let's show you around the interface!</p>
                `
            },
            {
                icon: "📊",
                title: "Your Stats",
                content: `
                    <p>At the top, you'll see your vital stats:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><span class="text-red-400">❤️ Health</span> - Hit 0 and it's game over</li>
                        <li><span class="text-yellow-400">⚡ Energy</span> - Low energy = penalties on dice rolls</li>
                        <li><span class="text-blue-400">☺️ Happiness</span> - Keep it up to avoid despair</li>
                        <li><span class="text-purple-400">😰 Stress</span> - High stress hurts your dice rolls!</li>
                    </ul>
                    <p class="mt-2 text-gray-400">Hover over the numbers to see any roll penalties.</p>
                `
            },
            {
                icon: "⏰",
                title: "Weekly Schedule",
                content: `
                    <p>Click the <span class="text-cyan-400">⏰ Weekly Schedule</span> card on the left to allocate your free time.</p>
                    <p class="mt-2">You have limited hours to spend on:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>🏋️ <span class="text-cyan-400">Gym</span> - Build fitness & looks (needs membership)</li>
                        <li>🍻 <span class="text-cyan-400">Socialize</span> - Meet people, reduce stress</li>
                        <li>💼 <span class="text-cyan-400">Overtime</span> - Extra money but more stress</li>
                        <li>📚 <span class="text-cyan-400">Study</span> - Boost skills (free in school!)</li>
                    </ul>
                    <p class="mt-2 text-yellow-400">Your transport & situation affect how much free time you have!</p>
                `
            },
            {
                icon: "🏠",
                title: "Living Situation & Transport",
                content: `
                    <p>Click <span class="text-cyan-400">Living Situation</span> or <span class="text-cyan-400">Transportation</span> to upgrade or downgrade.</p>
                    <p class="mt-2">These affect:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>💵 <span class="text-yellow-400">Weekly costs</span></li>
                        <li>😰 <span class="text-purple-400">Stress levels</span> (nice apartment = less stress)</li>
                        <li>💕 <span class="text-pink-400">Dating appeal</span> (especially for guys)</li>
                        <li>⏰ <span class="text-cyan-400">Free time</span> (walking everywhere takes time!)</li>
                    </ul>
                `
            },
            {
                icon: "📱",
                title: "Subscriptions",
                content: `
                    <p>Click <span class="text-cyan-400">📱 Subscriptions</span> to sign up for services like:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>🏋️ Gym membership (enables gym workouts)</li>
                        <li>📺 Streaming (happiness boost)</li>
                        <li>🧘 Meditation app (stress relief)</li>
                        <li>💕 Dating apps (better chance to meet someone)</li>
                    </ul>
                    <p class="mt-2 text-yellow-400">Each has a weekly cost - don't overcommit!</p>
                `
            },
            {
                icon: "🧠",
                title: "Habits & Willpower",
                content: `
                    <p>Click <span class="text-cyan-400">🧠 Habits</span> to manage your habits.</p>
                    <p class="mt-2"><span class="text-purple-400">Willpower</span> is your budget for maintaining habits:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><span class="text-green-400">Good habits</span> (exercise, reading) cost willpower to maintain</li>
                        <li><span class="text-red-400">Bad habits</span> give willpower but hurt your stats</li>
                        <li><span class="text-cyan-400">Streaks</span> make habits easier over time</li>
                    </ul>
                    <p class="mt-2 text-red-400">⚠️ Watch out! If stress, unhappiness, or exhaustion get too high, you may develop bad habits automatically!</p>
                    <p class="mt-1 text-gray-400 text-sm">High Self-Control helps resist these urges.</p>
                `
            },
            {
                icon: "👥",
                title: "Relationships",
                content: `
                    <p>Click <span class="text-cyan-400">👥 People in Your Life</span> to see your relationships.</p>
                    <p class="mt-2">You'll build connections with:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><span class="text-pink-400">💕 Romantic partners</span> - Dating, marriage, family</li>
                        <li><span class="text-cyan-400">📚 Study buddies</span> - Boost your education</li>
                        <li><span class="text-blue-400">🎓 Mentors</span> - Professors & career guides</li>
                        <li><span class="text-purple-400">💼 Professional network</span> - Career opportunities</li>
                        <li><span class="text-yellow-400">🏠 Family</span> - Always there for you</li>
                    </ul>
                    <p class="mt-2 text-gray-400">Strong relationships help in tough times!</p>
                `
            },
            {
                icon: "🎣",
                title: "Recreation & Minigames",
                content: `
                    <p>Sometimes you'll get chances to relax with fun activities!</p>
                    <p class="mt-2">Look out for events like:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><span class="text-blue-400">🎣 Fishing</span> - Catch fish for money & stress relief</li>
                        <li><span class="text-green-400">🌳 Outdoor activities</span> - Nature is healing</li>
                        <li><span class="text-yellow-400">🎮 Games & hobbies</span> - Build skills & unwind</li>
                    </ul>
                    <p class="mt-2 text-cyan-400">Balance work and play for a happy life!</p>
                `
            },
            {
                icon: "🎲",
                title: "Dice Rolls & Choices",
                content: `
                    <p>Many choices involve <span class="text-cyan-400">dice rolls</span> (D20 system).</p>
                    <p class="mt-2">Your roll is modified by:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li><span class="text-cyan-400">+ Skills</span> (relevant to the task)</li>
                        <li><span class="text-purple-400">- Stress</span> (high stress = penalty)</li>
                        <li><span class="text-yellow-400">- Fatigue</span> (low energy = penalty)</li>
                        <li><span class="text-blue-400">+ Intelligence</span> (for academic tasks)</li>
                    </ul>
                    <p class="mt-2"><span class="text-yellow-400">NAT 20</span> = Critical success! <span class="text-red-400">NAT 1</span> = Critical fail!</p>
                `
            },
            {
                icon: "🌟",
                title: "You're Ready!",
                content: `
                    <p>Remember:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>Every choice has <span class="text-yellow-400">tradeoffs</span></li>
                        <li>Balance work, health, relationships, and fun</li>
                        <li>Your traits affect what paths are available</li>
                        <li>Use the <span class="text-gray-400">⚙️</span> menu to save your game</li>
                    </ul>
                    <p class="mt-3 text-cyan-400 font-bold">Good luck living your best life!</p>
                `
            }
        ];
        
        function showTutorial() {
            tutorialStep = 0;
            closeGameMenu();
            updateTutorialDisplay();
            document.getElementById('tutorialModal').classList.remove('hidden');
        }
        
        function updateTutorialDisplay() {
            let step = TUTORIAL_STEPS[tutorialStep];
            document.getElementById('tutorialIcon').innerText = step.icon;
            document.getElementById('tutorialTitle').innerText = step.title;
            document.getElementById('tutorialContent').innerHTML = step.content;
            document.getElementById('tutorialProgress').innerText = `Step ${tutorialStep + 1} of ${TUTORIAL_STEPS.length}`;
            document.getElementById('tutorialNextBtn').innerText = tutorialStep === TUTORIAL_STEPS.length - 1 ? "Let's Go! 🎮" : "Next →";
        }
        
        function nextTutorialStep() {
            tutorialStep++;
            if (tutorialStep >= TUTORIAL_STEPS.length) {
                closeTutorial();
                return;
            }
            updateTutorialDisplay();
        }
        
        function skipTutorial() {
            closeTutorial();
        }
        
        function closeTutorial() {
            document.getElementById('tutorialModal').classList.add('hidden');
            state.tutorialComplete = true;
        }
        
        // ============ GAME MENU ============
        function openGameMenu() {
            document.getElementById('gameMenuModal').classList.remove('hidden');
        }
        
        function closeGameMenu() {
            document.getElementById('gameMenuModal').classList.add('hidden');
        }
        
        function saveGame() {
            try {
                let saveData = JSON.stringify(state);
                localStorage.setItem('lifeGameSave', saveData);
                localStorage.setItem('lifeGameSaveDate', new Date().toISOString());
                closeGameMenu();
                alert('Game saved! ✅');
            } catch (e) {
                alert('Failed to save game: ' + e.message);
            }
        }
        
        function loadGame() {
            try {
                let saveData = localStorage.getItem('lifeGameSave');
                if (!saveData) {
                    alert('No saved game found!');
                    return;
                }
                
                let loadedState = JSON.parse(saveData);
                let saveDate = localStorage.getItem('lifeGameSaveDate');
                let dateStr = saveDate ? new Date(saveDate).toLocaleDateString() : 'Unknown';
                
                if (confirm(`Load saved game from ${dateStr}?\n(Age: ${Math.floor(18 + loadedState.totalWeeks / 52)}, $${loadedState.money?.toLocaleString() || 0})\n\nThis will overwrite your current game!`)) {
                    Object.assign(state, loadedState);
                    closeGameMenu();
                    updateUI();
                    nextEvent();
                    alert('Game loaded! ✅');
                }
            } catch (e) {
                alert('Failed to load game: ' + e.message);
            }
        }
        
        function confirmEndGame() {
            closeGameMenu();
            document.getElementById('confirmEndModal').classList.remove('hidden');
        }
        
        function closeConfirmEnd() {
            document.getElementById('confirmEndModal').classList.add('hidden');
        }
        
        function endGameEarly() {
            closeConfirmEnd();
            endGame('early');
        }
        
        // Auto-trigger tutorial after character creation
        function checkTutorial() {
            if (!state.tutorialComplete && state.phase === 'deciding') {
                showTutorial();
            }
        }

        // ============ RELATIONSHIPS SYSTEM ============
        function openRelationshipsModal() {
            let modal = document.getElementById('relationshipsModal');
            let listDiv = document.getElementById('relationshipsList');
            listDiv.innerHTML = '';
            
            let relationships = [];
            
            // Partner
            if (state.hasPartner && state.partnerName) {
                let bond = state.partnerStats?.supportiveness || 50;
                let status = state.married ? '💍 Married' : '💕 Dating';
                let weeks = state.relationshipWeeks || 0;
                let years = Math.floor(weeks / 52);
                let timeStr = years > 0 ? `${years}+ years` : `${weeks} weeks`;
                relationships.push({
                    name: state.partnerName,
                    icon: '💕',
                    type: status,
                    bond: bond,
                    details: `Together ${timeStr}`,
                    color: 'pink'
                });
            }
            
            // Family
            let familyBond = 50 + (state.characterTraits?.familyWealth || 5) * 3;
            if (state.money > 10000) familyBond += 10; // Success impresses family
            relationships.push({
                name: 'Family',
                icon: '👨‍👩‍👧',
                type: 'Family',
                bond: Math.min(100, familyBond),
                details: state.characterTraits?.familyWealth >= 7 ? 'Wealthy & supportive' : 
                         state.characterTraits?.familyWealth <= 3 ? 'Struggling but loving' : 'Close',
                color: 'yellow'
            });
            
            // Children
            if (state.relationship?.children > 0) {
                relationships.push({
                    name: `Your ${state.relationship.children === 1 ? 'Child' : 'Children'}`,
                    icon: '👶',
                    type: `${state.relationship.children} ${state.relationship.children === 1 ? 'kid' : 'kids'}`,
                    bond: 100,
                    details: 'The light of your life',
                    color: 'blue'
                });
            }
            
            // Study buddy (university)
            if (state.university?.studyBuddy) {
                let bond = state.university.studyBuddyRelationship || 50;
                relationships.push({
                    name: state.university.studyBuddy,
                    icon: '📚',
                    type: 'Study Buddy',
                    bond: bond,
                    details: bond > 70 ? 'Close friend' : bond > 40 ? 'Good study partner' : 'Acquaintance',
                    color: 'cyan'
                });
            }
            
            // Professor mentor
            if (state.university?.professorMentor) {
                let bond = state.university.professorRelationship || 50;
                relationships.push({
                    name: state.university.professorMentor.name,
                    icon: '🎓',
                    type: 'Professor Mentor',
                    bond: bond,
                    details: state.university.professorMentor.field || 'Academic mentor',
                    color: 'purple'
                });
            }
            
            // Trade school mentor
            if (state.tradeSchool?.mentorName) {
                let bond = state.tradeSchool.mentorRelationship || 50;
                relationships.push({
                    name: state.tradeSchool.mentorName,
                    icon: '🔧',
                    type: 'Trade Mentor',
                    bond: bond,
                    details: bond > 60 ? 'Respects your work' : 'Teaching you the trade',
                    color: 'orange'
                });
            }
            
            // Military relationships
            if (state.military?.squad) {
                relationships.push({
                    name: 'Your Squad',
                    icon: '🎖️',
                    type: 'Battle Brothers/Sisters',
                    bond: 70 + (state.military.combatXP || 0) / 5,
                    details: `${state.military.missionsCompleted || 0} missions together`,
                    color: 'green'
                });
            }
            
            // Boss (if employed)
            if (state.employed && state.job !== 'military') {
                let perf = state.career?.performanceRating || 50;
                relationships.push({
                    name: 'Your Boss',
                    icon: '💼',
                    type: 'Employer',
                    bond: perf,
                    details: perf > 70 ? 'Values you highly' : perf > 40 ? 'Professional relationship' : 'On thin ice',
                    color: 'gray'
                });
            }
            
            // Network contacts
            if (state.career?.networkContacts > 5) {
                relationships.push({
                    name: 'Professional Network',
                    icon: '🤝',
                    type: `${state.career.networkContacts} contacts`,
                    bond: Math.min(100, state.career.networkContacts * 2),
                    details: 'Career connections',
                    color: 'blue'
                });
            }
            
            // Friends
            if (state.friends && state.friends.length > 0) {
                state.friends.forEach((friend, idx) => {
                    let bondDesc = friend.bond >= 80 ? 'Best friend' : 
                                   friend.bond >= 60 ? 'Close friend' : 
                                   friend.bond >= 40 ? 'Good friend' : 
                                   friend.bond >= 20 ? 'Acquaintance' : 'Drifting apart';
                    let neglectWeeks = state.week - (friend.lastContact || state.week);
                    let neglectWarning = neglectWeeks > 3 ? ' ⚠️' : '';
                    
                    relationships.push({
                        name: friend.name,
                        icon: friend.icon || '👤',
                        type: `Friend • ${friend.trait || 'Friendly'}`,
                        bond: friend.bond,
                        details: `Met at ${friend.metAt}${neglectWarning}`,
                        color: friend.bond >= 60 ? 'green' : friend.bond >= 30 ? 'yellow' : 'red',
                        isFriend: true,
                        friendIndex: idx
                    });
                });
            }
            
            // Render relationships
            if (relationships.length === 0) {
                listDiv.innerHTML = '<div class="text-gray-500 text-center py-4">No close relationships yet. Get out there!</div>';
            } else {
                relationships.forEach(rel => {
                    let div = document.createElement('div');
                    div.className = `p-3 rounded border border-${rel.color}-500/30 bg-${rel.color}-900/10`;
                    
                    let actionButton = '';
                    if (rel.isFriend) {
                        actionButton = `
                            <div class="mt-2 flex gap-2">
                                <button onclick="hangOutWithFriend(${rel.friendIndex})" class="flex-1 py-1 bg-green-600/50 hover:bg-green-600 text-white text-xs rounded transition-colors">
                                    🍻 Hang Out
                                </button>
                                <button onclick="askFriendForHelp(${rel.friendIndex})" class="flex-1 py-1 bg-blue-600/50 hover:bg-blue-600 text-white text-xs rounded transition-colors">
                                    🤝 Ask for Help
                                </button>
                            </div>
                        `;
                    }
                    
                    div.innerHTML = `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">${rel.icon}</span>
                                <div>
                                    <div class="text-white font-medium">${rel.name}</div>
                                    <div class="text-xs text-gray-400">${rel.type}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm text-${rel.color}-400">${Math.round(rel.bond)}%</div>
                                <div class="text-xs text-gray-500">${rel.details}</div>
                            </div>
                        </div>
                        <div class="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div class="h-full bg-${rel.color}-500 rounded-full" style="width: ${rel.bond}%"></div>
                        </div>
                        ${actionButton}
                    `;
                    listDiv.appendChild(div);
                });
            }
            
            // Add "Make New Friends" hint if space available
            if (state.friends.length < state.maxFriends) {
                let hintDiv = document.createElement('div');
                hintDiv.className = 'mt-3 p-2 bg-gray-800/50 rounded text-center text-xs text-gray-500';
                hintDiv.innerHTML = `💡 You can make up to ${state.maxFriends} close friends. Socialize and look for opportunities!`;
                listDiv.appendChild(hintDiv);
            }
            
            modal.classList.remove('hidden');
        }
        
        function closeRelationshipsModal() {
            document.getElementById('relationshipsModal').classList.add('hidden');
        }
        
        // ============ FRIENDS SYSTEM ============
        const FRIEND_TRAITS = ['supportive', 'fun', 'ambitious', 'chill', 'loyal', 'adventurous', 'nerdy', 'creative'];
        const FRIEND_ICONS = ['👤', '🧑', '👱', '🧔', '👩', '👨‍🦱', '👩‍🦰', '🧑‍🦱', '😎', '🤓', '😊', '🙂'];
        
        function generateFriend(metAt) {
            let names = state.gender === 'male' ? 
                [...MALE_NAMES, ...FEMALE_NAMES] : [...FEMALE_NAMES, ...MALE_NAMES];
            
            return {
                name: names[Math.floor(Math.random() * names.length)],
                metAt: metAt,
                bond: 30 + Math.floor(Math.random() * 20), // Start with 30-50 bond
                lastContact: state.week,
                trait: FRIEND_TRAITS[Math.floor(Math.random() * FRIEND_TRAITS.length)],
                icon: FRIEND_ICONS[Math.floor(Math.random() * FRIEND_ICONS.length)]
            };
        }
        
        function addFriend(friend) {
            if (state.friends.length >= state.maxFriends) {
                // Can't add more, but might replace a weak bond
                let weakest = state.friends.reduce((min, f, idx) => 
                    f.bond < min.bond ? {bond: f.bond, idx: idx} : min, 
                    {bond: 100, idx: -1}
                );
                if (weakest.bond < 20 && friend.bond > weakest.bond) {
                    state.friends[weakest.idx] = friend;
                    return true;
                }
                return false;
            }
            state.friends.push(friend);
            return true;
        }
        
        function hangOutWithFriend(friendIndex) {
            let friend = state.friends[friendIndex];
            if (!friend) return;
            
            closeRelationshipsModal();
            
            // Costs time and possibly money
            state.energy -= 10;
            state.money -= 20;
            friend.bond = Math.min(100, friend.bond + 15);
            friend.lastContact = state.week;
            state.happiness += 10;
            state.stress -= 10;
            state.skills.social += 1;
            
            addLog(`Hung out with ${friend.name}`);
            updateUI();
            
            // Random bonus based on friend trait
            let bonusText = '';
            if (friend.trait === 'supportive') {
                state.stress -= 5;
                bonusText = ' They really listened to your problems.';
            } else if (friend.trait === 'fun') {
                state.happiness += 5;
                bonusText = ' You laughed until you cried!';
            } else if (friend.trait === 'ambitious') {
                state.skills.technical += 1;
                bonusText = ' They motivated you to work on your skills.';
            } else if (friend.trait === 'nerdy') {
                state.skills.technical += 2;
                bonusText = ' You geeked out together.';
            } else if (friend.trait === 'adventurous') {
                state.energy -= 5;
                state.happiness += 5;
                bonusText = ' What an adventure!';
            }
            
            alert(`Had a great time with ${friend.name}!${bonusText}\n\n+15 Bond, +10 Happy, -10 Stress, +1 Social, -$20`);
        }
        
        function askFriendForHelp(friendIndex) {
            let friend = state.friends[friendIndex];
            if (!friend) return;
            
            if (friend.bond < 40) {
                alert(`${friend.name} isn't close enough to ask for help (need 40+ bond, have ${friend.bond}).`);
                return;
            }
            
            closeRelationshipsModal();
            
            let helpOptions = [];
            
            // Job referral (if employed friend)
            if (state.phase === 'job_hunting') {
                helpOptions.push({
                    text: "Help me find a job",
                    effect: () => {
                        friend.bond -= 10;
                        friend.lastContact = state.week;
                        if (Math.random() < 0.4 + (friend.bond / 200)) {
                            state.interviews++;
                            addLog(`${friend.name} got you a job interview!`);
                            return { icon: "🤝", text: `${friend.name} pulled some strings. You have an interview!`, stats: "Interview scheduled!" };
                        }
                        return { icon: "😕", text: `${friend.name} asked around but no luck yet.`, stats: "-10 Bond" };
                    }
                });
            }
            
            // Small loan
            if (state.money < 100) {
                helpOptions.push({
                    text: "Borrow some money",
                    effect: () => {
                        let loanAmount = Math.min(200, friend.bond * 3);
                        friend.bond -= 15;
                        friend.lastContact = state.week;
                        state.money += loanAmount;
                        state.friendLoan = (state.friendLoan || 0) + loanAmount;
                        addLog(`Borrowed $${loanAmount} from ${friend.name}`);
                        return { icon: "💵", text: `${friend.name} spotted you $${loanAmount}. Pay them back when you can.`, stats: `+$${loanAmount}, -15 Bond` };
                    }
                });
            }
            
            // Emotional support
            helpOptions.push({
                text: "Just need someone to talk to",
                effect: () => {
                    friend.bond += 5;
                    friend.lastContact = state.week;
                    state.stress -= 20;
                    state.happiness += 10;
                    return { icon: "💚", text: `${friend.name} was there for you. True friend.`, stats: "+5 Bond, -20 Stress, +10 Happy" };
                }
            });
            
            helpOptions.push({
                text: "Never mind",
                effect: () => {
                    return { icon: "👍", text: "Maybe another time.", stats: "" };
                }
            });
            
            displayEvent({
                category: "👥 Friendship",
                title: `Ask ${friend.name} for Help`,
                desc: `${friend.name} is a ${friend.trait} friend (Bond: ${friend.bond}%). What do you need?`,
                choices: helpOptions
            });
        }
        
        function processFriendDecay() {
            // Called weekly - friends drift apart if not contacted
            if (!state.friends) return;
            
            state.friends.forEach((friend, idx) => {
                let weeksSinceContact = state.week - (friend.lastContact || state.week);
                
                if (weeksSinceContact > 3) {
                    // Start losing bond after 3 weeks
                    let decay = Math.min(5, weeksSinceContact - 2);
                    friend.bond = Math.max(0, friend.bond - decay);
                }
            });
            
            // Remove friends with 0 bond
            state.friends = state.friends.filter(f => f.bond > 0);
        }
        
        // ============ CRIME SYSTEM ============
        const CRIME_TYPES = {
            shoplifting: { 
                name: "Shoplifting", 
                icon: "🛒", 
                minPayout: 50, 
                maxPayout: 200, 
                baseCatchChance: 0.25,
                heatGain: 5,
                jailTime: { min: 0, max: 4 },  // Weeks (usually fine, not jail)
                fineRange: { min: 200, max: 500 },
                requirements: {},
                desc: "Pocket some merchandise from a store"
            },
            selling_drugs: { 
                name: "Selling Drugs", 
                icon: "💊", 
                minPayout: 200, 
                maxPayout: 500, 
                baseCatchChance: 0.15,
                heatGain: 15,
                jailTime: { min: 52, max: 260 },  // 1-5 years
                fineRange: { min: 5000, max: 20000 },
                requirements: { connections: 1 },
                desc: "Deal drugs on the street"
            },
            fraud: { 
                name: "Fraud/Scams", 
                icon: "💳", 
                minPayout: 1000, 
                maxPayout: 5000, 
                baseCatchChance: 0.20,
                heatGain: 25,
                jailTime: { min: 104, max: 520 },  // 2-10 years
                fineRange: { min: 10000, max: 50000 },
                requirements: { technical: 30 },
                desc: "Identity theft, credit card fraud, scams"
            },
            armed_robbery: { 
                name: "Armed Robbery", 
                icon: "🔫", 
                minPayout: 5000, 
                maxPayout: 20000, 
                baseCatchChance: 0.35,
                heatGain: 50,
                jailTime: { min: 260, max: 1040 },  // 5-20 years
                fineRange: { min: 0, max: 0 },  // Just jail time
                requirements: { connections: 3 },
                desc: "Rob a store or person at gunpoint"
            },
            bank_heist: { 
                name: "Bank Heist", 
                icon: "🏦", 
                minPayout: 50000, 
                maxPayout: 200000, 
                baseCatchChance: 0.50,
                heatGain: 100,
                jailTime: { min: 520, max: 1300 },  // 10-25 years
                fineRange: { min: 0, max: 0 },
                requirements: { connections: 10, technical: 40 },
                desc: "The big score - rob a bank"
            }
        };
        
        function canCommitCrime(crimeKey) {
            let crime = CRIME_TYPES[crimeKey];
            if (!crime) return false;
            if (state.criminal.inJail) return false;
            
            // Check requirements
            if (crime.requirements.connections && (state.criminal.connections || 0) < crime.requirements.connections) return false;
            if (crime.requirements.technical && (state.skills.technical || 0) < crime.requirements.technical) return false;
            
            return true;
        }
        
        function commitCrime(crimeKey) {
            let crime = CRIME_TYPES[crimeKey];
            if (!crime || !canCommitCrime(crimeKey)) return;
            
            // Calculate catch chance (modified by heat level and skill)
            let catchChance = crime.baseCatchChance;
            catchChance += state.criminal.heatLevel / 200;  // Heat makes it riskier
            catchChance -= state.skills.social / 200;  // Social skills help avoid detection
            if (state.criminal.lawyerRetained) catchChance *= 0.8;  // Lawyer helps
            catchChance = Math.max(0.05, Math.min(0.90, catchChance));  // Clamp 5-90%
            
            // Calculate payout
            let payout = Math.floor(crime.minPayout + Math.random() * (crime.maxPayout - crime.minPayout));
            
            // Roll for success
            let caught = Math.random() < catchChance;
            
            // Always gain some heat
            state.criminal.heatLevel = Math.min(100, state.criminal.heatLevel + crime.heatGain);
            
            // Gain criminal connections on success
            if (!caught) {
                state.criminal.connections = Math.min(15, state.criminal.connections + 1);
            }
            
            if (caught) {
                // CAUGHT!
                let jailWeeks = Math.floor(crime.jailTime.min + Math.random() * (crime.jailTime.max - crime.jailTime.min));
                let fine = Math.floor(crime.fineRange.min + Math.random() * (crime.fineRange.max - crime.fineRange.min));
                
                // Lawyer can reduce sentence
                if (state.criminal.lawyerRetained) {
                    jailWeeks = Math.floor(jailWeeks * 0.6);
                    fine = Math.floor(fine * 0.7);
                }
                
                // Add to criminal record
                state.criminal.record.push({
                    crime: crime.name,
                    week: state.week,
                    caught: true,
                    sentence: jailWeeks,
                    fine: fine
                });
                
                // Apply consequences
                if (jailWeeks > 0) {
                    goToJail(jailWeeks, crime.name);
                    return { 
                        caught: true, 
                        jailTime: jailWeeks, 
                        fine: fine,
                        message: `BUSTED! Caught for ${crime.name}. Sentenced to ${Math.floor(jailWeeks/52)} years, ${jailWeeks%52} weeks.`
                    };
                } else {
                    // Just a fine
                    state.money -= fine;
                    state.stress += 30;
                    state.criminal.heatLevel += 20;
                    addLog(`Caught ${crime.name.toLowerCase()}: $${fine} fine`);
                    return { 
                        caught: true, 
                        jailTime: 0, 
                        fine: fine,
                        message: `Caught! Charged with ${crime.name}. Fined $${fine}.`
                    };
                }
            } else {
                // SUCCESS!
                state.money += payout;
                state.stress += 10;  // Crime is stressful even when successful
                
                // Track for record (not caught version)
                state.criminal.record.push({
                    crime: crime.name,
                    week: state.week,
                    caught: false,
                    payout: payout
                });
                
                addLog(`${crime.name}: +$${payout}`);
                return { 
                    caught: false, 
                    payout: payout,
                    message: `${crime.name} successful! Made $${payout.toLocaleString()}.`
                };
            }
        }
        
        function goToJail(weeks, crime) {
            playSound('jail');
            state.criminal.inJail = true;
            state.criminal.jailWeeksRemaining = weeks;
            state.criminal.totalJailTime += weeks;
            
            // Lose job
            if (state.employed) {
                let oldJob = state.jobTitle;
                state.employed = false;
                state.job = null;
                state.jobTitle = '';
                addLog(`Lost job (${oldJob}) due to incarceration`);
            }
            
            // Relationship strain
            if (state.hasPartner) {
                state.partnerStats.supportiveness -= 30;
                if (state.partnerStats.supportiveness <= 0) {
                    state.hasPartner = false;
                    state.partnerName = null;
                    addLog("Partner left during incarceration");
                }
            }
            
            state.happiness -= 40;
            state.stress += 30;
            state.phase = 'incarcerated';
            
            addLog(`Incarcerated for ${crime}: ${Math.floor(weeks/52)}y ${weeks%52}w`);
        }
        
        function processJailWeek() {
            if (!state.criminal.inJail) return;
            
            state.criminal.jailWeeksRemaining--;
            
            // Jail effects
            state.happiness -= 2;
            state.stress += 1;
            state.health -= 1;
            state.skills.physical += 0.5;  // Working out in prison
            
            // Heat decays faster in jail (you're already caught)
            state.criminal.heatLevel = Math.max(0, state.criminal.heatLevel - 2);
            
            // Released?
            if (state.criminal.jailWeeksRemaining <= 0) {
                releaseFromJail();
            }
        }
        
        function releaseFromJail() {
            state.criminal.inJail = false;
            state.criminal.jailWeeksRemaining = 0;
            state.phase = 'job_hunting';
            state.phaseWeek = 0;
            
            state.happiness += 20;
            state.stress -= 20;
            
            addLog("Released from prison");
            
            // Show release event
            displayEvent({
                category: "🔓 Freedom",
                title: "Released from Prison",
                desc: "You've served your time. The gates open and you walk out into the sunlight. What now?",
                choices: [
                    {
                        text: "Go straight - never again",
                        effect: () => {
                            state.stress -= 20;
                            state.happiness += 10;
                            return { icon: "🌅", text: "Time to rebuild your life the right way.", stats: "-20 Stress, +10 Happy" };
                        }
                    },
                    {
                        text: "Back to the hustle",
                        effect: () => {
                            state.criminal.connections += 3;  // Prison connections
                            state.stress += 10;
                            return { icon: "😈", text: "You learned a lot inside. Time to use it.", stats: "+3 Criminal Connections" };
                        }
                    },
                    {
                        text: "Just survive for now",
                        effect: () => {
                            state.energy += 20;
                            return { icon: "😐", text: "One day at a time. Focus on basics.", stats: "+20 Energy" };
                        }
                    }
                ]
            });
        }
        
        function getCriminalRecordPenalty() {
            // Returns a penalty multiplier for job applications (1.0 = no penalty)
            if (!state.criminal.record || state.criminal.record.length === 0) return 1.0;
            
            let caughtCrimes = state.criminal.record.filter(r => r.caught).length;
            if (caughtCrimes === 0) return 1.0;
            
            // Each conviction reduces job chances
            return Math.max(0.3, 1.0 - (caughtCrimes * 0.15));
        }
        
        function openCrimeModal() {
            playSound('crime');
            let modal = document.getElementById('crimeModal');
            if (!modal) {
                // Create crime modal
                modal = document.createElement('div');
                modal.id = 'crimeModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-red-500/30 rounded-lg p-4 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-red-400">🔥 The Underground</h3>
                            <button onclick="closeCrimeModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="crimeContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let content = document.getElementById('crimeContent');
            
            // Heat level display
            let heatColor = state.criminal.heatLevel >= 70 ? 'red' : 
                           state.criminal.heatLevel >= 40 ? 'orange' : 
                           state.criminal.heatLevel >= 20 ? 'yellow' : 'green';
            let heatWarning = state.criminal.heatLevel >= 70 ? '🚨 EXTREMELY HOT - Lay low!' :
                             state.criminal.heatLevel >= 40 ? '⚠️ Police are watching' : '';
            
            let crimesHtml = Object.keys(CRIME_TYPES).map(key => {
                let crime = CRIME_TYPES[key];
                let canDo = canCommitCrime(key);
                let requirements = [];
                
                if (crime.requirements.connections && (state.criminal.connections || 0) < crime.requirements.connections) {
                    requirements.push(`Need ${crime.requirements.connections} connections (have ${state.criminal.connections || 0})`);
                }
                if (crime.requirements.technical && (state.skills.technical || 0) < crime.requirements.technical) {
                    requirements.push(`Need ${crime.requirements.technical} tech skill (have ${state.skills.technical || 0})`);
                }
                
                let riskLevel = crime.baseCatchChance < 0.2 ? 'Low' : 
                               crime.baseCatchChance < 0.35 ? 'Medium' : 
                               crime.baseCatchChance < 0.5 ? 'High' : 'Extreme';
                let riskColor = crime.baseCatchChance < 0.2 ? 'green' : 
                               crime.baseCatchChance < 0.35 ? 'yellow' : 
                               crime.baseCatchChance < 0.5 ? 'orange' : 'red';
                
                return `
                    <div class="p-3 bg-gray-800 rounded-lg ${!canDo ? 'opacity-50' : ''}">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${crime.icon}</span>
                                <div>
                                    <div class="text-white font-medium">${crime.name}</div>
                                    <div class="text-xs text-gray-400">${crime.desc}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 text-sm">$${crime.minPayout.toLocaleString()}-${crime.maxPayout.toLocaleString()}</div>
                                <div class="text-xs text-${riskColor}-400">${riskLevel} Risk</div>
                            </div>
                        </div>
                        ${requirements.length > 0 ? `
                            <div class="text-xs text-red-400 mt-2">${requirements.join(', ')}</div>
                        ` : ''}
                        ${canDo ? `
                            <button onclick="attemptCrime('${key}')" class="w-full mt-2 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded text-sm transition-colors">
                                Do It
                            </button>
                        ` : ''}
                    </div>
                `;
            }).join('');
            
            // Criminal record summary
            let recordHtml = '';
            let caughtCount = state.criminal.record.filter(r => r.caught).length;
            if (caughtCount > 0) {
                recordHtml = `
                    <div class="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg">
                        <div class="text-red-400 text-sm font-medium">📋 Criminal Record: ${caughtCount} conviction${caughtCount > 1 ? 's' : ''}</div>
                        <div class="text-xs text-gray-400 mt-1">This affects job applications (-${Math.round((1-getCriminalRecordPenalty())*100)}% hire chance)</div>
                    </div>
                `;
            }
            
            content.innerHTML = `
                <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Heat Level</span>
                        <span class="text-${heatColor}-400">${state.criminal.heatLevel}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-${heatColor}-500 rounded-full transition-all" style="width: ${state.criminal.heatLevel}%"></div>
                    </div>
                    ${heatWarning ? `<div class="text-xs text-${heatColor}-400 mt-1">${heatWarning}</div>` : ''}
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <div class="p-2 bg-gray-800 rounded text-center">
                        <div class="text-gray-400 text-xs">Connections</div>
                        <div class="text-white">${state.criminal.connections || 0}</div>
                    </div>
                    <div class="p-2 bg-gray-800 rounded text-center">
                        <div class="text-gray-400 text-xs">Total Jail Time</div>
                        <div class="text-white">${state.criminal.totalJailTime || 0} weeks</div>
                    </div>
                </div>
                
                <div class="space-y-3">
                    ${crimesHtml}
                </div>
                
                ${recordHtml}
                
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <button onclick="closeCrimeModal()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                        Leave
                    </button>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeCrimeModal() {
            document.getElementById('crimeModal')?.classList.add('hidden');
        }
        
        function attemptCrime(crimeKey) {
            let crime = CRIME_TYPES[crimeKey];
            if (!crime) return;
            
            if (!confirm(`⚠️ COMMIT ${crime.name.toUpperCase()}?\n\nPotential payout: $${crime.minPayout.toLocaleString()}-$${crime.maxPayout.toLocaleString()}\nRisk of getting caught: ~${Math.round(crime.baseCatchChance * 100)}%\nIf caught: ${crime.jailTime.max > 0 ? `${Math.floor(crime.jailTime.min/52)}-${Math.floor(crime.jailTime.max/52)} years in prison` : `$${crime.fineRange.min}-$${crime.fineRange.max} fine`}\n\nThis cannot be undone.`)) {
                return;
            }
            
            closeCrimeModal();
            
            let result = commitCrime(crimeKey);
            
            updateUI();
            
            if (result.caught && result.jailTime > 0) {
                // Going to jail - show jail event
                displayEvent({
                    category: "🚔 Busted",
                    title: "You're Under Arrest",
                    desc: result.message + "\n\nThe cuffs click shut. Your life is about to change.",
                    choices: [
                        {
                            text: "Accept your fate",
                            effect: () => {
                                return { icon: "😔", text: "The cell door slams shut behind you.", stats: `${Math.floor(result.jailTime/52)}y ${result.jailTime%52}w sentence` };
                            }
                        }
                    ]
                });
            } else if (result.caught) {
                // Just a fine
                displayEvent({
                    category: "🚔 Caught",
                    title: "Busted!",
                    desc: result.message,
                    choices: [
                        {
                            text: "Pay the fine and leave",
                            effect: () => {
                                return { icon: "💸", text: "Expensive lesson learned. Or not.", stats: `-$${result.fine}` };
                            }
                        }
                    ]
                });
            } else {
                // Success!
                displayEvent({
                    category: "💰 Score",
                    title: "Clean Getaway",
                    desc: result.message + " The adrenaline is pumping.",
                    choices: [
                        {
                            text: "Count your money",
                            effect: () => {
                                state.happiness += 10;
                                return { icon: "🤑", text: `$${result.payout.toLocaleString()} richer. Crime pays... for now.`, stats: `+$${result.payout.toLocaleString()}, +10 Happy` };
                            }
                        }
                    ]
                });
            }
        }
        
        function processHeatDecay() {
            // Heat naturally decays over time
            if (state.criminal.heatLevel > 0) {
                state.criminal.heatLevel = Math.max(0, state.criminal.heatLevel - 1);
            }
        }
        
        function getJailEvent() {
            let weeksLeft = state.criminal.jailWeeksRemaining;
            let yearsLeft = Math.floor(weeksLeft / 52);
            let monthsLeft = Math.floor((weeksLeft % 52) / 4);
            let timeStr = yearsLeft > 0 ? `${yearsLeft} year${yearsLeft > 1 ? 's' : ''}, ${monthsLeft} months` : `${monthsLeft} months`;
            
            let events = [
                {
                    title: "Another Day Inside",
                    desc: `Time moves slowly in here. ${timeStr} remaining on your sentence.`,
                    choices: [
                        { text: "Work out", effect: () => { state.skills.physical += 2; state.energy -= 10; return { icon: "💪", text: "Building strength.", stats: "+2 Physical" }; }},
                        { text: "Read books", effect: () => { state.skills.technical += 1; state.happiness += 3; return { icon: "📚", text: "Self-improvement.", stats: "+1 Technical, +3 Happy" }; }},
                        { text: "Make connections", effect: () => { state.criminal.connections += 1; state.stress += 5; return { icon: "🤝", text: "Networking with criminals.", stats: "+1 Connection, +5 Stress" }; }}
                    ]
                },
                {
                    title: "Prison Yard",
                    desc: `${timeStr} to go. The yard is where reputations are made.`,
                    choices: [
                        { text: "Keep to yourself", effect: () => { state.stress += 5; return { icon: "😐", text: "Staying out of trouble.", stats: "+5 Stress" }; }},
                        { text: "Join a workout group", effect: () => { state.skills.physical += 3; state.criminal.connections += 1; return { icon: "🏋️", text: "Gains and connections.", stats: "+3 Physical, +1 Connection" }; }},
                        { text: "Get in a fight", effect: () => {
                            if (Math.random() < 0.5) {
                                state.health -= 15; state.criminal.jailWeeksRemaining += 8;
                                return { icon: "😵", text: "Lost the fight. Time added.", stats: "-15 Health, +8 weeks" };
                            }
                            state.health -= 5; state.criminal.connections += 2;
                            return { icon: "👊", text: "Won respect.", stats: "-5 Health, +2 Connections" };
                        }}
                    ]
                }
            ];
            
            let event = events[Math.floor(Math.random() * events.length)];
            return {
                category: "🔒 Prison",
                title: event.title,
                desc: event.desc,
                choices: event.choices
            };
        }
        
        // ============ BUSINESS SYSTEM ============
        const BUSINESS_TYPES = {
            food_truck: {
                name: "Food Truck",
                icon: "🚚",
                startupCost: 15000,
                weeklyExpenses: 200,
                minRevenue: 300,
                maxRevenue: 1200,
                maxEmployees: 3,
                riskLevel: 0.15,       // Chance of bad week
                reputationGrowth: 2,   // How fast reputation builds
                customerGrowthRate: 5,
                skillBonus: 'creativity',
                desc: "Serve food from a mobile kitchen"
            },
            consulting: {
                name: "Consulting Firm",
                icon: "💼",
                startupCost: 5000,
                weeklyExpenses: 100,
                minRevenue: 200,
                maxRevenue: 1000,
                maxEmployees: 5,
                riskLevel: 0.10,
                reputationGrowth: 3,
                customerGrowthRate: 3,
                skillBonus: 'technical',
                desc: "Offer professional consulting services"
            },
            online_store: {
                name: "Online Store",
                icon: "🛒",
                startupCost: 3000,
                weeklyExpenses: 50,
                minRevenue: 100,
                maxRevenue: 2000,
                maxEmployees: 4,
                riskLevel: 0.20,
                reputationGrowth: 1,
                customerGrowthRate: 8,
                skillBonus: 'technical',
                desc: "E-commerce business selling products online"
            },
            app_startup: {
                name: "App Startup",
                icon: "📱",
                startupCost: 20000,
                weeklyExpenses: 500,
                minRevenue: 0,
                maxRevenue: 5000,
                maxEmployees: 10,
                riskLevel: 0.35,
                reputationGrowth: 5,
                customerGrowthRate: 15,
                skillBonus: 'technical',
                desc: "Build the next big app"
            }
        };
        
        function canStartBusiness(typeKey) {
            let biz = BUSINESS_TYPES[typeKey];
            if (!biz) return { can: false, reason: "Invalid business type" };
            if (state.business.active) return { can: false, reason: "Already own a business" };
            if (state.criminal.inJail) return { can: false, reason: "Currently incarcerated" };
            
            // Check if can afford or get a loan
            if (state.money < biz.startupCost && state.creditScore < 600) {
                return { can: false, reason: `Need $${biz.startupCost.toLocaleString()} or 600+ credit score for loan` };
            }
            
            return { can: true };
        }
        
        function startBusiness(typeKey, useLoan) {
            let biz = BUSINESS_TYPES[typeKey];
            if (!biz) return;
            
            let check = canStartBusiness(typeKey);
            if (!check.can) {
                alert(check.reason);
                return;
            }
            
            if (useLoan) {
                // Take business loan
                let loanAmount = biz.startupCost;
                let interestRate = 0.08 + (0.02 * (10 - Math.floor(state.creditScore / 100)));
                let weeklyPayment = Math.ceil((loanAmount * (1 + interestRate)) / 104); // 2-year payoff
                
                state.business.loan = loanAmount;
                state.business.loanPayment = weeklyPayment;
                state.creditScore = Math.max(300, state.creditScore - 20); // Taking loan affects credit
                addLog(`Business loan: $${loanAmount} at ${Math.round(interestRate*100)}%`);
            } else {
                state.money -= biz.startupCost;
            }
            
            // Prompt for business name
            let bizName = prompt(`What would you like to name your ${biz.name}?`, `My ${biz.name}`) || `${biz.name}`;
            
            state.business.active = true;
            state.business.type = typeKey;
            state.business.name = bizName;
            state.business.employees = 0;
            state.business.maxEmployees = biz.maxEmployees;
            state.business.revenue = 0;
            state.business.expenses = biz.weeklyExpenses;
            state.business.reputation = 30;
            state.business.weeksActive = 0;
            state.business.customerBase = 10;
            
            state.stress += 20;
            state.happiness += 15;
            
            addLog(`Started business: ${bizName}`);
        }
        
        function processBusinessWeek() {
            if (!state.business.active) return;
            
            let biz = BUSINESS_TYPES[state.business.type];
            if (!biz) return;
            
            state.business.weeksActive++;
            
            // Calculate weekly revenue
            let baseRevenue = biz.minRevenue + (biz.maxRevenue - biz.minRevenue) * (state.business.reputation / 100);
            
            // Skill bonus
            let skillLevel = state.skills[biz.skillBonus] || 0;
            let skillBonus = 1 + (skillLevel / 200);
            
            // Employee bonus (each employee adds ~20% productivity)
            let employeeBonus = 1 + (state.business.employees * 0.2);
            
            // Customer base effect
            let customerMultiplier = Math.min(3, 1 + state.business.customerBase / 100);
            
            // Bad week chance
            let isBadWeek = Math.random() < biz.riskLevel;
            let weekMultiplier = isBadWeek ? 0.3 : (Math.random() * 0.4 + 0.8);
            
            let revenue = Math.floor(baseRevenue * skillBonus * employeeBonus * customerMultiplier * weekMultiplier);
            
            // Expenses
            let employeeCost = state.business.employees * 150; // $150/week per employee
            let totalExpenses = biz.weeklyExpenses + employeeCost + state.business.loanPayment;
            
            // Net profit
            let profit = revenue - totalExpenses;
            state.money += profit;
            state.business.revenue = revenue;
            state.business.expenses = totalExpenses;
            
            // Pay down loan
            if (state.business.loan > 0) {
                state.business.loan = Math.max(0, state.business.loan - state.business.loanPayment);
                if (state.business.loan === 0) {
                    state.business.loanPayment = 0;
                    addLog("Business loan paid off!");
                }
            }
            
            // Reputation change
            if (isBadWeek) {
                state.business.reputation = Math.max(0, state.business.reputation - 5);
            } else {
                state.business.reputation = Math.min(100, state.business.reputation + biz.reputationGrowth * (revenue > totalExpenses ? 1 : 0.5));
            }
            
            // Customer base growth
            if (revenue > totalExpenses) {
                state.business.customerBase += biz.customerGrowthRate;
            } else {
                state.business.customerBase = Math.max(5, state.business.customerBase - 2);
            }
            
            // Stress from running business
            state.stress += 5;
            if (profit < 0) state.stress += 10;
        }
        
        function hireEmployee() {
            if (!state.business.active) return;
            if (state.business.employees >= state.business.maxEmployees) {
                alert("Maximum employees reached!");
                return;
            }
            
            state.business.employees++;
            state.stress -= 5;
            addLog(`Hired employee #${state.business.employees}`);
            openBusinessModal();
        }
        
        function fireEmployee() {
            if (!state.business.active || state.business.employees <= 0) return;
            
            state.business.employees--;
            state.stress += 5;
            addLog(`Let go of an employee`);
            openBusinessModal();
        }
        
        function closeBusiness() {
            if (!state.business.active) return;
            
            let bizName = state.business.name;
            let remainingLoan = state.business.loan;
            
            if (!confirm(`Close ${bizName}?\n\n${remainingLoan > 0 ? `⚠️ You still owe $${remainingLoan.toLocaleString()} on your business loan!\n\n` : ''}This cannot be undone.`)) {
                return;
            }
            
            // If loan remains, it becomes personal debt
            if (remainingLoan > 0) {
                state.debt += remainingLoan;
                state.creditScore = Math.max(300, state.creditScore - 50);
                addLog(`Business closed with $${remainingLoan} debt`);
            } else {
                addLog(`Closed business: ${bizName}`);
            }
            
            state.business.active = false;
            state.business.type = null;
            state.business.name = '';
            state.business.employees = 0;
            state.business.loan = 0;
            state.business.loanPayment = 0;
            
            state.happiness -= 20;
            state.stress += 15;
            
            closeBusinessModal();
            updateUI();
        }
        
        function openBusinessModal() {
            playSound('click');
            let modal = document.getElementById('businessModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'businessModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-green-500/30 rounded-lg p-4 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-green-400" id="bizModalTitle">🏢 Business</h3>
                            <button onclick="closeBusinessModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="businessContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let content = document.getElementById('businessContent');
            let title = document.getElementById('bizModalTitle');
            
            if (state.business.active) {
                // Show existing business
                let biz = BUSINESS_TYPES[state.business.type];
                title.innerText = `${biz.icon} ${state.business.name}`;
                
                let profit = state.business.revenue - state.business.expenses;
                let profitColor = profit >= 0 ? 'green' : 'red';
                
                content.innerHTML = `
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">${biz.icon}</div>
                        <div class="text-gray-400 text-sm">${biz.name} • Week ${state.business.weeksActive}</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mb-4">
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-400">Weekly Revenue</div>
                            <div class="text-lg text-green-400">$${state.business.revenue.toLocaleString()}</div>
                        </div>
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-400">Weekly Expenses</div>
                            <div class="text-lg text-red-400">$${state.business.expenses.toLocaleString()}</div>
                        </div>
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-400">Net Profit</div>
                            <div class="text-lg text-${profitColor}-400">${profit >= 0 ? '+' : ''}$${profit.toLocaleString()}/wk</div>
                        </div>
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-400">Customer Base</div>
                            <div class="text-lg text-cyan-400">${state.business.customerBase}</div>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-gray-800 rounded-lg mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-400">Business Reputation</span>
                            <span class="text-yellow-400">${state.business.reputation}%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-yellow-500 rounded-full" style="width: ${state.business.reputation}%"></div>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-gray-800 rounded-lg mb-4">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-400">Employees</span>
                            <span class="text-white">${state.business.employees} / ${state.business.maxEmployees}</span>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <button onclick="hireEmployee()" class="flex-1 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded text-sm ${state.business.employees >= state.business.maxEmployees ? 'opacity-50' : ''}" ${state.business.employees >= state.business.maxEmployees ? 'disabled' : ''}>
                                ➕ Hire ($150/wk)
                            </button>
                            <button onclick="fireEmployee()" class="flex-1 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded text-sm ${state.business.employees <= 0 ? 'opacity-50' : ''}" ${state.business.employees <= 0 ? 'disabled' : ''}>
                                ➖ Fire
                            </button>
                        </div>
                    </div>
                    
                    ${state.business.loan > 0 ? `
                    <div class="p-3 bg-orange-900/30 border border-orange-500/30 rounded-lg mb-4">
                        <div class="text-orange-400 text-sm">📋 Business Loan</div>
                        <div class="text-white">$${state.business.loan.toLocaleString()} remaining</div>
                        <div class="text-xs text-gray-400">$${state.business.loanPayment}/week payment</div>
                    </div>
                    ` : ''}
                    
                    <div class="mt-4 pt-4 border-t border-gray-700 space-y-2">
                        <button onclick="investInMarketing()" class="w-full py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded transition-colors">
                            📢 Marketing Campaign ($500 → +Reputation)
                        </button>
                        <button onclick="closeBusiness()" class="w-full py-2 bg-red-900/50 hover:bg-red-800 text-red-400 rounded transition-colors">
                            🚪 Close Business
                        </button>
                    </div>
                `;
            } else {
                // Show options to start a business
                title.innerText = '🏢 Start a Business';
                
                let bizOptionsHtml = Object.keys(BUSINESS_TYPES).map(key => {
                    let biz = BUSINESS_TYPES[key];
                    let check = canStartBusiness(key);
                    let canAfford = state.money >= biz.startupCost;
                    let canLoan = state.creditScore >= 600;
                    
                    return `
                        <div class="p-3 bg-gray-800 rounded-lg ${!check.can ? 'opacity-50' : ''}">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">${biz.icon}</span>
                                    <div>
                                        <div class="text-white font-medium">${biz.name}</div>
                                        <div class="text-xs text-gray-400">${biz.desc}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div class="text-gray-400">Startup: <span class="text-green-400">$${biz.startupCost.toLocaleString()}</span></div>
                                <div class="text-gray-400">Weekly: <span class="text-red-400">$${biz.weeklyExpenses}</span></div>
                                <div class="text-gray-400">Potential: <span class="text-cyan-400">$${biz.minRevenue}-${biz.maxRevenue}/wk</span></div>
                                <div class="text-gray-400">Risk: <span class="${biz.riskLevel < 0.15 ? 'text-green-400' : biz.riskLevel < 0.25 ? 'text-yellow-400' : 'text-red-400'}">${biz.riskLevel < 0.15 ? 'Low' : biz.riskLevel < 0.25 ? 'Medium' : 'High'}</span></div>
                            </div>
                            ${check.can ? `
                            <div class="flex gap-2 mt-3">
                                ${canAfford ? `
                                <button onclick="startBusinessWithCash('${key}')" class="flex-1 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded text-xs transition-colors">
                                    💵 Pay Cash
                                </button>
                                ` : ''}
                                ${canLoan ? `
                                <button onclick="startBusinessWithLoan('${key}')" class="flex-1 py-2 bg-blue-600/50 hover:bg-blue-600 text-white rounded text-xs transition-colors">
                                    🏦 Get Loan
                                </button>
                                ` : ''}
                            </div>
                            ` : `<div class="text-xs text-red-400 mt-2">${check.reason}</div>`}
                        </div>
                    `;
                }).join('');
                
                content.innerHTML = `
                    <div class="text-gray-400 text-sm mb-4">
                        Start your own business! You'll need either enough savings or good credit (600+) for a business loan.
                    </div>
                    
                    <div class="grid grid-cols-1 gap-3">
                        ${bizOptionsHtml}
                    </div>
                    
                    <div class="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                        <div class="text-blue-400 text-sm">💡 Tips</div>
                        <ul class="text-xs text-gray-400 mt-1 space-y-1">
                            <li>• Employees increase productivity but cost $150/week each</li>
                            <li>• Higher skills in the business's specialty help revenue</li>
                            <li>• Reputation builds over time and attracts customers</li>
                            <li>• Bad weeks happen - keep cash reserves!</li>
                        </ul>
                    </div>
                `;
            }
            
            modal.classList.remove('hidden');
        }
        
        function closeBusinessModal() {
            document.getElementById('businessModal')?.classList.add('hidden');
        }
        
        function startBusinessWithCash(typeKey) {
            closeBusinessModal();
            startBusiness(typeKey, false);
            updateUI();
        }
        
        function startBusinessWithLoan(typeKey) {
            closeBusinessModal();
            startBusiness(typeKey, true);
            updateUI();
        }
        
        function investInMarketing() {
            if (state.money < 500) {
                alert("Need $500 for marketing campaign!");
                return;
            }
            
            state.money -= 500;
            state.business.reputation = Math.min(100, state.business.reputation + 10);
            state.business.customerBase += 20;
            addLog("Marketing campaign: +10 reputation");
            openBusinessModal();
        }
        
        // ============ HOME DECORATION SYSTEM ============
        const FURNITURE_ITEMS = {
            // Basics
            basic_bed: { name: "Basic Bed", icon: "🛏️", price: 200, category: "basic", quality: 5, effects: { energy: 2 }, desc: "A simple bed for sleeping" },
            nice_bed: { name: "Quality Mattress", icon: "🛏️", price: 800, category: "basic", quality: 15, effects: { energy: 5, health: 1 }, desc: "Memory foam for better sleep" },
            couch: { name: "Couch", icon: "🛋️", price: 400, category: "basic", quality: 8, effects: { happiness: 2, stress: -1 }, desc: "Somewhere to relax" },
            dining_table: { name: "Dining Table", icon: "🪑", price: 300, category: "basic", quality: 6, effects: { happiness: 1 }, desc: "For proper meals" },
            
            // Entertainment
            tv: { name: "TV", icon: "📺", price: 500, category: "entertainment", quality: 10, effects: { happiness: 3, stress: -2 }, desc: "Entertainment at home" },
            gaming_setup: { name: "Gaming Setup", icon: "🎮", price: 1500, category: "entertainment", quality: 20, effects: { happiness: 5, stress: -3, social: 1 }, desc: "PC/console for gaming" },
            sound_system: { name: "Sound System", icon: "🔊", price: 800, category: "entertainment", quality: 12, effects: { happiness: 3, creativity: 1 }, desc: "Quality audio" },
            
            // Fitness
            home_gym: { name: "Home Gym", icon: "🏋️", price: 2000, category: "fitness", quality: 25, effects: { health: 3, energy: 2, physical: 2 }, desc: "Workout at home" },
            yoga_mat: { name: "Yoga Mat & Weights", icon: "🧘", price: 200, category: "fitness", quality: 8, effects: { health: 1, stress: -2 }, desc: "Basic home fitness" },
            
            // Office
            desk: { name: "Work Desk", icon: "🖥️", price: 400, category: "office", quality: 10, effects: { technical: 1 }, desc: "For work from home" },
            ergonomic_chair: { name: "Ergonomic Chair", icon: "💺", price: 600, category: "office", quality: 12, effects: { health: 1, technical: 1 }, desc: "Good posture = productivity" },
            bookshelf: { name: "Bookshelf", icon: "📚", price: 300, category: "office", quality: 8, effects: { technical: 1, creativity: 1 }, desc: "Knowledge at your fingertips" },
            
            // Decor
            plants: { name: "House Plants", icon: "🪴", price: 100, category: "decor", quality: 5, effects: { happiness: 2, health: 1 }, desc: "Bring nature inside" },
            art: { name: "Wall Art", icon: "🖼️", price: 500, category: "decor", quality: 10, effects: { happiness: 2, creativity: 2 }, desc: "Express yourself" },
            nice_lighting: { name: "Ambient Lighting", icon: "💡", price: 300, category: "decor", quality: 8, effects: { happiness: 2, stress: -1 }, desc: "Set the mood" },
            
            // Luxury
            hot_tub: { name: "Hot Tub", icon: "🛁", price: 5000, category: "luxury", quality: 40, effects: { happiness: 5, stress: -5, health: 2 }, desc: "The ultimate relaxation" },
            home_theater: { name: "Home Theater", icon: "🎬", price: 8000, category: "luxury", quality: 50, effects: { happiness: 8, stress: -4, social: 2 }, desc: "Cinema at home" },
            smart_home: { name: "Smart Home System", icon: "🏠", price: 3000, category: "luxury", quality: 30, effects: { happiness: 3, energy: 2 }, desc: "Automate your life" }
        };
        
        function getFurnitureEffects() {
            // Calculate total effects from all owned furniture
            let effects = { happiness: 0, stress: 0, health: 0, energy: 0, technical: 0, social: 0, creativity: 0, physical: 0 };
            
            if (!state.homeDecor?.furniture) return effects;
            
            state.homeDecor.furniture.forEach(itemKey => {
                let item = FURNITURE_ITEMS[itemKey];
                if (item && item.effects) {
                    Object.keys(item.effects).forEach(stat => {
                        effects[stat] = (effects[stat] || 0) + item.effects[stat];
                    });
                }
            });
            
            return effects;
        }
        
        function updateHomeQuality() {
            if (!state.homeDecor) state.homeDecor = { furniture: [], quality: 0, style: 'basic' };
            
            let totalQuality = 0;
            state.homeDecor.furniture.forEach(itemKey => {
                let item = FURNITURE_ITEMS[itemKey];
                if (item) totalQuality += item.quality;
            });
            
            state.homeDecor.quality = Math.min(100, totalQuality);
            
            // Determine style based on furniture
            if (totalQuality >= 80) state.homeDecor.style = 'luxury';
            else if (totalQuality >= 50) state.homeDecor.style = 'modern';
            else if (totalQuality >= 25) state.homeDecor.style = 'cozy';
            else state.homeDecor.style = 'basic';
        }
        
        function buyFurniture(itemKey) {
            let item = FURNITURE_ITEMS[itemKey];
            if (!item) return;
            
            if (state.money < item.price) {
                alert(`Not enough money! Need $${item.price}`);
                return;
            }
            
            if (state.homeDecor.furniture.includes(itemKey)) {
                alert("You already own this item!");
                return;
            }
            
            // Check if player owns/rents a place (not living with parents)
            if (state.home === 'parents' || state.home === 'homeless') {
                alert("You need your own place to buy furniture!");
                return;
            }
            
            state.money -= item.price;
            state.homeDecor.furniture.push(itemKey);
            updateHomeQuality();
            
            addLog(`Bought ${item.name} for $${item.price}`);
            openDecorationModal();
        }
        
        function sellFurniture(itemKey) {
            let item = FURNITURE_ITEMS[itemKey];
            if (!item) return;
            
            let idx = state.homeDecor.furniture.indexOf(itemKey);
            if (idx === -1) {
                alert("You don't own this item!");
                return;
            }
            
            let sellPrice = Math.floor(item.price * 0.5);
            state.money += sellPrice;
            state.homeDecor.furniture.splice(idx, 1);
            updateHomeQuality();
            
            addLog(`Sold ${item.name} for $${sellPrice}`);
            openDecorationModal();
        }
        
        function openDecorationModal() {
            // Check if player can decorate
            if (state.home === 'parents' || state.home === 'homeless') {
                alert("You need your own place before you can decorate!");
                return;
            }
            
            let modal = document.getElementById('decorModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'decorModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-purple-500/30 rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-purple-400" id="decorModalTitle">🏠 Home Decoration</h3>
                            <button onclick="closeDecorationModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="decorContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let content = document.getElementById('decorContent');
            
            // Current effects
            let effects = getFurnitureEffects();
            let effectsList = Object.keys(effects).filter(k => effects[k] !== 0).map(k => {
                let val = effects[k];
                let name = k.charAt(0).toUpperCase() + k.slice(1);
                return `<span class="${val > 0 ? 'text-green-400' : 'text-red-400'}">${val > 0 ? '+' : ''}${val} ${name}</span>`;
            }).join(', ') || 'None';
            
            // Owned items
            let ownedHtml = state.homeDecor.furniture.length > 0 ? 
                state.homeDecor.furniture.map(itemKey => {
                    let item = FURNITURE_ITEMS[itemKey];
                    if (!item) return '';
                    let sellPrice = Math.floor(item.price * 0.5);
                    return `
                        <div class="flex justify-between items-center p-2 bg-gray-800 rounded">
                            <div class="flex items-center gap-2">
                                <span>${item.icon}</span>
                                <span class="text-white text-sm">${item.name}</span>
                            </div>
                            <button onclick="sellFurniture('${itemKey}')" class="px-2 py-1 bg-red-600/50 hover:bg-red-600 text-xs text-white rounded">
                                Sell $${sellPrice}
                            </button>
                        </div>
                    `;
                }).join('') : '<div class="text-gray-500 text-center py-2">No furniture yet</div>';
            
            // Shop by category
            let categories = ['basic', 'entertainment', 'fitness', 'office', 'decor', 'luxury'];
            let shopHtml = categories.map(cat => {
                let items = Object.keys(FURNITURE_ITEMS).filter(k => FURNITURE_ITEMS[k].category === cat);
                let catName = cat.charAt(0).toUpperCase() + cat.slice(1);
                
                let itemsHtml = items.map(itemKey => {
                    let item = FURNITURE_ITEMS[itemKey];
                    let owned = state.homeDecor.furniture.includes(itemKey);
                    let canAfford = state.money >= item.price;
                    
                    let effectsStr = Object.keys(item.effects).map(k => {
                        let v = item.effects[k];
                        return `${v > 0 ? '+' : ''}${v} ${k.slice(0,3)}`;
                    }).join(', ');
                    
                    return `
                        <div class="p-2 bg-gray-800/50 rounded ${owned ? 'border border-green-500/30' : ''}">
                            <div class="flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">${item.icon}</span>
                                    <div>
                                        <div class="text-white text-sm">${item.name}</div>
                                        <div class="text-xs text-gray-400">${item.desc}</div>
                                        <div class="text-xs text-cyan-400">${effectsStr}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    ${owned ? 
                                        '<span class="text-green-400 text-xs">✓ Owned</span>' :
                                        `<button onclick="buyFurniture('${itemKey}')" class="px-3 py-1 ${canAfford ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-600 opacity-50'} text-white text-sm rounded" ${!canAfford ? 'disabled' : ''}>
                                            $${item.price}
                                        </button>`
                                    }
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                return `
                    <div class="mb-4">
                        <div class="text-gray-400 text-sm font-medium mb-2">${catName}</div>
                        <div class="space-y-2">
                            ${itemsHtml}
                        </div>
                    </div>
                `;
            }).join('');
            
            content.innerHTML = `
                <div class="mb-4 p-3 bg-gray-800 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Home Quality</span>
                        <span class="text-purple-400">${state.homeDecor.quality}% (${state.homeDecor.style})</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-purple-500 rounded-full" style="width: ${state.homeDecor.quality}%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">Weekly bonuses: ${effectsList}</div>
                </div>
                
                <div class="mb-4">
                    <div class="text-gray-400 text-sm font-medium mb-2">Your Furniture</div>
                    <div class="space-y-1">
                        ${ownedHtml}
                    </div>
                </div>
                
                <div class="border-t border-gray-700 pt-4">
                    <div class="text-gray-400 text-sm font-medium mb-3">Furniture Shop</div>
                    ${shopHtml}
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeDecorationModal() {
            document.getElementById('decorModal')?.classList.add('hidden');
        }
        
        // ============ HOBBIES SYSTEM ============
        const HOBBIES = {
            fishing: {
                name: "Fishing",
                icon: "🎣",
                desc: "Relax by the water and catch fish",
                category: "outdoor",
                unlockCost: 0, // Already available
                weeklyEffects: { stress: -3, happiness: 2 },
                skillEffects: { patience: 0.2 }, // Custom skill
                social: false,
                physical: false
            },
            golf: {
                name: "Golf",
                icon: "⛳",
                desc: "Hit the links and network",
                category: "sport",
                unlockCost: 200, // Club membership intro
                weeklyEffects: { stress: -2, happiness: 2, health: 1 },
                skillEffects: { social: 0.3, physical: 0.1 },
                social: true,
                physical: true
            },
            reading: {
                name: "Reading",
                icon: "📚",
                desc: "Expand your mind with books",
                category: "intellectual",
                unlockCost: 0,
                weeklyEffects: { stress: -2, happiness: 1 },
                skillEffects: { technical: 0.3, creativity: 0.2 },
                social: false,
                physical: false
            },
            gaming: {
                name: "Video Games",
                icon: "🎮",
                desc: "Escape into virtual worlds",
                category: "entertainment",
                unlockCost: 0,
                weeklyEffects: { stress: -4, happiness: 3 },
                skillEffects: { technical: 0.1 },
                social: false, // Can be social with equipment
                physical: false
            },
            cooking: {
                name: "Cooking",
                icon: "👨‍🍳",
                desc: "Master the culinary arts",
                category: "creative",
                unlockCost: 0,
                weeklyEffects: { happiness: 2, health: 1 },
                skillEffects: { creativity: 0.3 },
                social: false,
                physical: false
            },
            gardening: {
                name: "Gardening",
                icon: "🌱",
                desc: "Grow plants and find peace",
                category: "outdoor",
                unlockCost: 50,
                weeklyEffects: { stress: -4, happiness: 2, health: 1 },
                skillEffects: { creativity: 0.1 },
                social: false,
                physical: true
            },
            photography: {
                name: "Photography",
                icon: "📷",
                desc: "Capture moments in time",
                category: "creative",
                unlockCost: 100,
                weeklyEffects: { happiness: 2, stress: -1 },
                skillEffects: { creativity: 0.4 },
                social: true,
                physical: false
            },
            music: {
                name: "Playing Music",
                icon: "🎸",
                desc: "Express yourself through music",
                category: "creative",
                unlockCost: 150,
                weeklyEffects: { happiness: 3, stress: -3 },
                skillEffects: { creativity: 0.5, social: 0.1 },
                social: true,
                physical: false
            },
            hiking: {
                name: "Hiking",
                icon: "🥾",
                desc: "Explore nature on foot",
                category: "outdoor",
                unlockCost: 0,
                weeklyEffects: { stress: -3, health: 2, happiness: 2 },
                skillEffects: { physical: 0.3 },
                social: true,
                physical: true
            },
            woodworking: {
                name: "Woodworking",
                icon: "🪚",
                desc: "Create with your hands",
                category: "creative",
                unlockCost: 200,
                weeklyEffects: { stress: -2, happiness: 2 },
                skillEffects: { creativity: 0.3, physical: 0.1 },
                social: false,
                physical: true
            },
            yoga: {
                name: "Yoga",
                icon: "🧘",
                desc: "Mind and body balance",
                category: "fitness",
                unlockCost: 0,
                weeklyEffects: { stress: -5, health: 2, energy: 2 },
                skillEffects: { physical: 0.2 },
                social: true,
                physical: true
            },
            cycling: {
                name: "Cycling",
                icon: "🚴",
                desc: "Ride for fitness and fun",
                category: "fitness",
                unlockCost: 0,
                weeklyEffects: { stress: -2, health: 3, energy: -1 },
                skillEffects: { physical: 0.4 },
                social: true,
                physical: true
            }
        };
        
        const HOBBY_EQUIPMENT = {
            // Fishing equipment
            fishing_basic_rod: { hobby: "fishing", name: "Basic Rod", icon: "🎣", price: 50, tier: 1, bonus: { skillGain: 1.0, happiness: 0 }, desc: "A simple fishing rod" },
            fishing_spinning_reel: { hobby: "fishing", name: "Spinning Reel", icon: "🎣", price: 150, tier: 2, bonus: { skillGain: 1.3, happiness: 1 }, desc: "Better casting distance" },
            fishing_tackle_box: { hobby: "fishing", name: "Tackle Box", icon: "🧰", price: 100, tier: 1, bonus: { skillGain: 1.2, money: 10 }, desc: "Organized lures and bait" },
            fishing_pro_setup: { hobby: "fishing", name: "Pro Fishing Setup", icon: "⭐", price: 500, tier: 3, bonus: { skillGain: 1.5, happiness: 2, money: 25 }, desc: "Tournament-grade equipment" },
            
            // Golf equipment
            golf_starter_clubs: { hobby: "golf", name: "Starter Clubs", icon: "🏌️", price: 200, tier: 1, bonus: { skillGain: 1.0, happiness: 0 }, desc: "Basic club set" },
            golf_nice_clubs: { hobby: "golf", name: "Quality Clubs", icon: "🏌️", price: 800, tier: 2, bonus: { skillGain: 1.3, happiness: 1, social: 0.2 }, desc: "Mid-range club set" },
            golf_pro_clubs: { hobby: "golf", name: "Pro Clubs", icon: "⭐", price: 2500, tier: 3, bonus: { skillGain: 1.5, happiness: 2, social: 0.4 }, desc: "Professional grade clubs" },
            golf_membership: { hobby: "golf", name: "Country Club Pass", icon: "🏆", price: 1000, tier: 2, bonus: { social: 0.5, networkContacts: 2 }, desc: "Access to exclusive courses" },
            
            // Reading equipment
            reading_library_card: { hobby: "reading", name: "Library Card", icon: "📖", price: 0, tier: 1, bonus: { skillGain: 1.0 }, desc: "Free books from the library" },
            reading_kindle: { hobby: "reading", name: "E-Reader", icon: "📱", price: 150, tier: 2, bonus: { skillGain: 1.2, happiness: 1 }, desc: "Thousands of books in your pocket" },
            reading_collection: { hobby: "reading", name: "Book Collection", icon: "📚", price: 300, tier: 2, bonus: { skillGain: 1.3, technical: 0.2 }, desc: "Curated home library" },
            reading_first_editions: { hobby: "reading", name: "First Editions", icon: "⭐", price: 1000, tier: 3, bonus: { skillGain: 1.5, happiness: 2, creativity: 0.3 }, desc: "Collector's items" },
            
            // Gaming equipment
            gaming_console: { hobby: "gaming", name: "Game Console", icon: "🎮", price: 400, tier: 1, bonus: { skillGain: 1.0, happiness: 1 }, desc: "Current gen console" },
            gaming_pc: { hobby: "gaming", name: "Gaming PC", icon: "💻", price: 1200, tier: 2, bonus: { skillGain: 1.3, happiness: 2, technical: 0.2 }, desc: "High-performance rig" },
            gaming_vr: { hobby: "gaming", name: "VR Headset", icon: "🥽", price: 500, tier: 2, bonus: { skillGain: 1.2, happiness: 2, physical: 0.1 }, desc: "Immersive virtual reality" },
            gaming_streaming: { hobby: "gaming", name: "Streaming Setup", icon: "📺", price: 800, tier: 3, bonus: { skillGain: 1.4, social: 0.3, money: 20 }, desc: "Stream your gameplay" },
            
            // Cooking equipment
            cooking_basics: { hobby: "cooking", name: "Basic Cookware", icon: "🍳", price: 100, tier: 1, bonus: { skillGain: 1.0, health: 0.5 }, desc: "Pots, pans, basics" },
            cooking_knives: { hobby: "cooking", name: "Chef's Knives", icon: "🔪", price: 250, tier: 2, bonus: { skillGain: 1.3, happiness: 1 }, desc: "Professional knife set" },
            cooking_appliances: { hobby: "cooking", name: "Fancy Appliances", icon: "🍽️", price: 600, tier: 2, bonus: { skillGain: 1.4, happiness: 1, health: 1 }, desc: "Stand mixer, sous vide, etc" },
            cooking_classes: { hobby: "cooking", name: "Cooking Classes", icon: "👨‍🍳", price: 400, tier: 3, bonus: { skillGain: 1.6, social: 0.3, creativity: 0.3 }, desc: "Learn from professionals" },
            
            // Gardening equipment
            gardening_basic_tools: { hobby: "gardening", name: "Garden Tools", icon: "🌱", price: 75, tier: 1, bonus: { skillGain: 1.0 }, desc: "Shovel, trowel, gloves" },
            gardening_seeds: { hobby: "gardening", name: "Seed Collection", icon: "🌻", price: 50, tier: 1, bonus: { skillGain: 1.1, happiness: 1 }, desc: "Variety of plants" },
            gardening_greenhouse: { hobby: "gardening", name: "Small Greenhouse", icon: "🏡", price: 500, tier: 2, bonus: { skillGain: 1.4, happiness: 2, health: 1 }, desc: "Year-round growing" },
            
            // Photography equipment
            photo_phone: { hobby: "photography", name: "Phone Camera", icon: "📱", price: 0, tier: 1, bonus: { skillGain: 1.0 }, desc: "Use your smartphone" },
            photo_dslr: { hobby: "photography", name: "DSLR Camera", icon: "📷", price: 800, tier: 2, bonus: { skillGain: 1.4, happiness: 1, creativity: 0.3 }, desc: "Professional camera body" },
            photo_lenses: { hobby: "photography", name: "Lens Kit", icon: "🔭", price: 1200, tier: 2, bonus: { skillGain: 1.3, creativity: 0.4 }, desc: "Multiple focal lengths" },
            photo_studio: { hobby: "photography", name: "Home Studio", icon: "⭐", price: 2000, tier: 3, bonus: { skillGain: 1.6, happiness: 2, money: 30, social: 0.2 }, desc: "Lights, backdrops, props" },
            
            // Music equipment
            music_beginner: { hobby: "music", name: "Beginner Instrument", icon: "🎸", price: 200, tier: 1, bonus: { skillGain: 1.0 }, desc: "Entry-level instrument" },
            music_quality: { hobby: "music", name: "Quality Instrument", icon: "🎸", price: 800, tier: 2, bonus: { skillGain: 1.4, happiness: 2 }, desc: "Professional grade" },
            music_lessons: { hobby: "music", name: "Music Lessons", icon: "🎵", price: 300, tier: 2, bonus: { skillGain: 1.5, social: 0.2 }, desc: "Learn from a teacher" },
            music_recording: { hobby: "music", name: "Recording Setup", icon: "🎙️", price: 1500, tier: 3, bonus: { skillGain: 1.6, happiness: 2, money: 25, creativity: 0.4 }, desc: "Home recording studio" },
            
            // Hiking equipment
            hiking_boots: { hobby: "hiking", name: "Hiking Boots", icon: "🥾", price: 150, tier: 1, bonus: { skillGain: 1.0, health: 0.5 }, desc: "Sturdy footwear" },
            hiking_gear: { hobby: "hiking", name: "Hiking Pack", icon: "🎒", price: 200, tier: 2, bonus: { skillGain: 1.2, health: 1 }, desc: "Backpack and supplies" },
            hiking_camping: { hobby: "hiking", name: "Camping Gear", icon: "⛺", price: 500, tier: 2, bonus: { skillGain: 1.4, happiness: 2, stress: -2 }, desc: "Tent, sleeping bag, etc" },
            
            // Woodworking equipment
            wood_hand_tools: { hobby: "woodworking", name: "Hand Tools", icon: "🔨", price: 200, tier: 1, bonus: { skillGain: 1.0 }, desc: "Basic hand tools" },
            wood_power_tools: { hobby: "woodworking", name: "Power Tools", icon: "🪚", price: 600, tier: 2, bonus: { skillGain: 1.4, happiness: 1 }, desc: "Saw, drill, sander" },
            wood_workshop: { hobby: "woodworking", name: "Workshop Setup", icon: "🏭", price: 2000, tier: 3, bonus: { skillGain: 1.6, happiness: 2, money: 40, creativity: 0.4 }, desc: "Full workshop" },
            
            // Yoga equipment
            yoga_mat: { hobby: "yoga", name: "Yoga Mat", icon: "🧘", price: 50, tier: 1, bonus: { skillGain: 1.0 }, desc: "Basic yoga mat" },
            yoga_props: { hobby: "yoga", name: "Yoga Props", icon: "🧱", price: 100, tier: 1, bonus: { skillGain: 1.2, health: 0.5 }, desc: "Blocks, straps, bolster" },
            yoga_membership: { hobby: "yoga", name: "Studio Membership", icon: "🏠", price: 400, tier: 2, bonus: { skillGain: 1.5, social: 0.3, health: 1 }, desc: "Unlimited classes" },
            
            // Cycling equipment
            cycling_basic_bike: { hobby: "cycling", name: "Basic Bike", icon: "🚲", price: 300, tier: 1, bonus: { skillGain: 1.0, health: 1 }, desc: "Entry-level bike" },
            cycling_road_bike: { hobby: "cycling", name: "Road Bike", icon: "🚴", price: 1000, tier: 2, bonus: { skillGain: 1.3, health: 2, happiness: 1 }, desc: "Lightweight road bike" },
            cycling_gear: { hobby: "cycling", name: "Cycling Gear", icon: "🦺", price: 300, tier: 2, bonus: { skillGain: 1.2, health: 1 }, desc: "Helmet, jersey, shorts" },
            cycling_peloton: { hobby: "cycling", name: "Smart Trainer", icon: "📺", price: 1500, tier: 3, bonus: { skillGain: 1.5, health: 2, social: 0.2 }, desc: "Indoor smart trainer" }
        };
        
        function getHobbySkill(hobbyKey) {
            return state.hobbies.skills[hobbyKey] || 0;
        }
        
        function getHobbyEquipmentBonus(hobbyKey) {
            let bonus = { skillGain: 1.0, happiness: 0, health: 0, social: 0, technical: 0, creativity: 0, physical: 0, money: 0, stress: 0, networkContacts: 0 };
            let owned = state.hobbies.equipment[hobbyKey] || [];
            
            owned.forEach(equipKey => {
                let equip = HOBBY_EQUIPMENT[equipKey];
                if (equip && equip.bonus) {
                    Object.keys(equip.bonus).forEach(key => {
                        if (key === 'skillGain') {
                            bonus.skillGain = Math.max(bonus.skillGain, equip.bonus.skillGain);
                        } else {
                            bonus[key] = (bonus[key] || 0) + equip.bonus[key];
                        }
                    });
                }
            });
            
            return bonus;
        }
        
        function practiceHobby(hobbyKey, hours) {
            let hobby = HOBBIES[hobbyKey];
            if (!hobby) return;
            
            let equipBonus = getHobbyEquipmentBonus(hobbyKey);
            let currentSkill = getHobbySkill(hobbyKey);
            
            // Skill gain (diminishing returns at higher levels)
            let baseGain = hours * 0.5 * equipBonus.skillGain;
            let diminishingFactor = 1 - (currentSkill / 150); // Slower gains at high skill
            let skillGain = baseGain * Math.max(0.2, diminishingFactor);
            
            state.hobbies.skills[hobbyKey] = Math.min(100, currentSkill + skillGain);
            state.hobbies.totalHours[hobbyKey] = (state.hobbies.totalHours[hobbyKey] || 0) + hours;
            
            // Apply weekly effects (scaled by hours)
            let hourScale = hours / 5; // 5 hours = full effect
            Object.keys(hobby.weeklyEffects).forEach(stat => {
                let effect = hobby.weeklyEffects[stat] * hourScale;
                if (stat === 'stress') state.stress = Math.max(0, state.stress + effect);
                else if (stat === 'happiness') state.happiness = Math.min(100, state.happiness + effect);
                else if (stat === 'health') state.health = Math.min(100, state.health + effect);
                else if (stat === 'energy') state.energy = Math.min(100, state.energy + effect);
            });
            
            // Apply equipment bonuses
            if (equipBonus.happiness) state.happiness = Math.min(100, state.happiness + equipBonus.happiness * hourScale);
            if (equipBonus.health) state.health = Math.min(100, state.health + equipBonus.health * hourScale);
            if (equipBonus.stress) state.stress = Math.max(0, state.stress + equipBonus.stress * hourScale);
            if (equipBonus.money) state.money += Math.floor(equipBonus.money * hourScale * (currentSkill / 50));
            
            // Apply skill effects
            Object.keys(hobby.skillEffects).forEach(skill => {
                let gain = hobby.skillEffects[skill] * hourScale * equipBonus.skillGain;
                if (state.skills[skill] !== undefined) {
                    state.skills[skill] = Math.min(100, state.skills[skill] + gain);
                }
            });
            
            // Network contacts from social hobbies with equipment
            if (equipBonus.networkContacts && hobby.social) {
                state.career = state.career || {};
                state.career.networkContacts = (state.career.networkContacts || 0) + Math.floor(equipBonus.networkContacts * hourScale * Math.random());
            }
        }
        
        function buyHobbyEquipment(equipKey) {
            let equip = HOBBY_EQUIPMENT[equipKey];
            if (!equip) return;
            
            if (state.money < equip.price) {
                alert(`Not enough money! Need $${equip.price}`);
                return;
            }
            
            // Check if hobby is active
            if (!state.hobbies.active.includes(equip.hobby)) {
                alert(`You need to pick up ${HOBBIES[equip.hobby].name} as a hobby first!`);
                return;
            }
            
            // Check if already owned
            state.hobbies.equipment[equip.hobby] = state.hobbies.equipment[equip.hobby] || [];
            if (state.hobbies.equipment[equip.hobby].includes(equipKey)) {
                alert("You already own this!");
                return;
            }
            
            state.money -= equip.price;
            state.hobbies.equipment[equip.hobby].push(equipKey);
            state.happiness = Math.min(100, state.happiness + 5); // Buying things makes you happy!
            playSound('coin');
            
            addLog(`Bought ${equip.name} for ${HOBBIES[equip.hobby].name}`);
            openHobbiesModal();
        }
        
        function startHobby(hobbyKey) {
            let hobby = HOBBIES[hobbyKey];
            if (!hobby) return;
            
            if (state.hobbies.active.includes(hobbyKey)) {
                alert("You already have this hobby!");
                return;
            }
            
            if (state.hobbies.active.length >= 3) {
                alert("You can only have 3 active hobbies! Drop one first.");
                return;
            }
            
            if (state.money < hobby.unlockCost) {
                alert(`Need $${hobby.unlockCost} to start this hobby!`);
                return;
            }
            
            state.money -= hobby.unlockCost;
            state.hobbies.active.push(hobbyKey);
            state.hobbies.skills[hobbyKey] = state.hobbies.skills[hobbyKey] || 0;
            state.hobbies.equipment[hobbyKey] = state.hobbies.equipment[hobbyKey] || [];
            state.hobbies.weeklyHours[hobbyKey] = 0;
            state.happiness = Math.min(100, state.happiness + 10);
            playSound('success');
            
            addLog(`Started new hobby: ${hobby.name}`);
            openHobbiesModal();
        }
        
        function dropHobby(hobbyKey) {
            let hobby = HOBBIES[hobbyKey];
            if (!confirm(`Drop ${hobby.name}?\n\nYou'll keep your skill level and equipment if you pick it up again.`)) {
                return;
            }
            
            state.hobbies.active = state.hobbies.active.filter(h => h !== hobbyKey);
            state.hobbies.weeklyHours[hobbyKey] = 0;
            state.happiness = Math.max(0, state.happiness - 5);
            
            addLog(`Dropped hobby: ${hobby.name}`);
            openHobbiesModal();
        }
        
        function openHobbiesModal() {
            let modal = document.getElementById('hobbiesModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'hobbiesModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-purple-500/30 rounded-lg p-4 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-purple-400">🎨 Hobbies & Interests</h3>
                            <button onclick="closeHobbiesModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="hobbiesContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let content = document.getElementById('hobbiesContent');
            
            // Active hobbies section
            let activeHtml = state.hobbies.active.length > 0 ? state.hobbies.active.map(hobbyKey => {
                let hobby = HOBBIES[hobbyKey];
                let skill = getHobbySkill(hobbyKey);
                let equipBonus = getHobbyEquipmentBonus(hobbyKey);
                let ownedEquip = state.hobbies.equipment[hobbyKey] || [];
                let totalHours = state.hobbies.totalHours[hobbyKey] || 0;
                
                let skillLevel = skill >= 80 ? 'Master' : skill >= 60 ? 'Expert' : skill >= 40 ? 'Skilled' : skill >= 20 ? 'Intermediate' : 'Beginner';
                
                return `
                    <div class="p-3 bg-gray-800 rounded-lg mb-2">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${hobby.icon}</span>
                                <div>
                                    <div class="text-white font-medium">${hobby.name}</div>
                                    <div class="text-xs text-gray-400">${skillLevel} • ${Math.floor(totalHours)} total hours</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-purple-400">${Math.floor(skill)}%</div>
                                <button onclick="dropHobby('${hobbyKey}')" class="text-xs text-red-400 hover:text-red-300">Drop</button>
                            </div>
                        </div>
                        <div class="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-purple-500 rounded-full" style="width: ${skill}%"></div>
                        </div>
                        <div class="mt-2 text-xs text-gray-500">
                            Equipment bonus: ${equipBonus.skillGain > 1 ? `+${Math.round((equipBonus.skillGain-1)*100)}% skill gain` : 'None'}
                            ${ownedEquip.length > 0 ? ` • ${ownedEquip.length} items` : ''}
                        </div>
                        <button onclick="openHobbyShop('${hobbyKey}')" class="mt-2 w-full py-1 bg-purple-600/50 hover:bg-purple-600 text-white text-xs rounded transition-colors">
                            🛒 Equipment Shop
                        </button>
                    </div>
                `;
            }).join('') : '<div class="text-gray-500 text-center py-4">No active hobbies. Pick one below!</div>';
            
            // Available hobbies section
            let availableHtml = Object.keys(HOBBIES).filter(k => !state.hobbies.active.includes(k)).map(hobbyKey => {
                let hobby = HOBBIES[hobbyKey];
                let prevSkill = state.hobbies.skills[hobbyKey] || 0;
                let canAfford = state.money >= hobby.unlockCost;
                let atMax = state.hobbies.active.length >= 3;
                
                let tags = [];
                if (hobby.social) tags.push('👥 Social');
                if (hobby.physical) tags.push('💪 Physical');
                
                return `
                    <button onclick="startHobby('${hobbyKey}')" 
                        class="p-2 bg-gray-800 rounded-lg text-left transition-colors ${canAfford && !atMax ? 'hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'}"
                        ${!canAfford || atMax ? 'disabled' : ''}>
                        <div class="flex items-center gap-2">
                            <span class="text-xl">${hobby.icon}</span>
                            <div class="flex-grow">
                                <div class="text-white text-sm">${hobby.name}</div>
                                <div class="text-xs text-gray-500">${hobby.desc}</div>
                                <div class="text-xs text-gray-600 mt-1">${tags.join(' • ')}</div>
                            </div>
                            <div class="text-right">
                                ${hobby.unlockCost > 0 ? `<div class="text-green-400 text-sm">$${hobby.unlockCost}</div>` : '<div class="text-green-400 text-sm">Free</div>'}
                                ${prevSkill > 0 ? `<div class="text-xs text-purple-400">${Math.floor(prevSkill)}% skill</div>` : ''}
                            </div>
                        </div>
                    </button>
                `;
            }).join('');
            
            content.innerHTML = `
                <div class="mb-4">
                    <div class="text-gray-400 text-sm font-medium mb-2">Your Hobbies (${state.hobbies.active.length}/3)</div>
                    ${activeHtml}
                </div>
                
                <div class="border-t border-gray-700 pt-4">
                    <div class="text-gray-400 text-sm font-medium mb-2">Available Hobbies</div>
                    <div class="grid grid-cols-2 gap-2">
                        ${availableHtml}
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <div class="text-blue-400 text-sm">💡 Tips</div>
                    <div class="text-xs text-gray-400 mt-1">
                        • Hobbies provide weekly bonuses to happiness, stress, and skills<br>
                        • Buy equipment to boost skill gain and unlock extra benefits<br>
                        • Allocate time to hobbies in the Free Time menu<br>
                        • Social hobbies can help you make friends and network
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeHobbiesModal() {
            document.getElementById('hobbiesModal')?.classList.add('hidden');
        }
        
        function openHobbyShop(hobbyKey) {
            let hobby = HOBBIES[hobbyKey];
            let owned = state.hobbies.equipment[hobbyKey] || [];
            
            let availableEquip = Object.keys(HOBBY_EQUIPMENT).filter(k => 
                HOBBY_EQUIPMENT[k].hobby === hobbyKey
            );
            
            let shopHtml = availableEquip.map(equipKey => {
                let equip = HOBBY_EQUIPMENT[equipKey];
                let isOwned = owned.includes(equipKey);
                let canAfford = state.money >= equip.price;
                
                let bonusText = Object.keys(equip.bonus).map(k => {
                    let v = equip.bonus[k];
                    if (k === 'skillGain') return v > 1 ? `+${Math.round((v-1)*100)}% skill` : '';
                    return `+${v} ${k}`;
                }).filter(b => b).join(', ');
                
                return `
                    <div class="p-2 bg-gray-800 rounded ${isOwned ? 'border border-green-500/30' : ''}">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">${equip.icon}</span>
                                <div>
                                    <div class="text-white text-sm">${equip.name}</div>
                                    <div class="text-xs text-gray-500">${equip.desc}</div>
                                    <div class="text-xs text-cyan-400">${bonusText}</div>
                                </div>
                            </div>
                            ${isOwned ? 
                                '<span class="text-green-400 text-xs">✓ Owned</span>' :
                                `<button onclick="buyHobbyEquipment('${equipKey}')" 
                                    class="px-3 py-1 ${canAfford ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 opacity-50'} text-white text-sm rounded"
                                    ${!canAfford ? 'disabled' : ''}>
                                    $${equip.price}
                                </button>`
                            }
                        </div>
                    </div>
                `;
            }).join('');
            
            // Replace hobbies content with shop
            let content = document.getElementById('hobbiesContent');
            content.innerHTML = `
                <button onclick="openHobbiesModal()" class="text-gray-400 hover:text-white text-sm mb-3">← Back to Hobbies</button>
                
                <div class="text-center mb-4">
                    <span class="text-3xl">${hobby.icon}</span>
                    <div class="text-white font-medium">${hobby.name} Equipment</div>
                </div>
                
                <div class="space-y-2">
                    ${shopHtml}
                </div>
            `;
        }
        
        // ============ EDUCATION MODAL ============
        function openEducationModal() {
            let modal = document.getElementById('educationModal');
            let content = document.getElementById('educationContent');
            let title = document.getElementById('eduModalTitle');
            
            content.innerHTML = '';
            
            // Different content based on phase
            if (state.phase === 'education') {
                title.innerText = '📚 Academic Progress';
                
                let eduType = state.educationType;
                let eduName = eduType === 'university' ? 'University' : 
                             eduType === 'community_college' ? 'Community College' : 
                             eduType === 'trade_school' ? 'Trade School' : 
                             eduType === 'military_training' ? 'Boot Camp' : 'Education';
                
                let progress = Math.round((state.phaseWeek / state.phaseTarget) * 100);
                let weeksLeft = state.phaseTarget - state.phaseWeek;
                let yearsLeft = Math.floor(weeksLeft / 52);
                let monthsLeft = Math.floor((weeksLeft % 52) / 4);
                let timeLeft = yearsLeft > 0 ? `${yearsLeft} year${yearsLeft > 1 ? 's' : ''} ${monthsLeft} months` : `${monthsLeft} months`;
                
                // GPA color based on performance
                let gpa = state.gpa || 0;
                let gpaColor = gpa >= 3.5 ? 'text-green-400' : gpa >= 3.0 ? 'text-cyan-400' : gpa >= 2.5 ? 'text-yellow-400' : gpa >= 2.0 ? 'text-orange-400' : 'text-red-400';
                let gpaStatus = gpa >= 3.9 ? 'Summa Cum Laude track!' : gpa >= 3.7 ? 'Magna Cum Laude track!' : gpa >= 3.5 ? "Dean's List!" : gpa >= 3.0 ? 'Solid performance' : gpa >= 2.5 ? 'Room for improvement' : gpa >= 2.0 ? '⚠️ Struggling' : '🚨 Academic probation risk!';
                
                // Career prospects preview
                let careerProspects = "";
                if (eduType === 'university') {
                    if (gpa >= 3.7) careerProspects = "🏦 Prestigious positions available (Investment Banking, Big Tech, Consulting)";
                    else if (gpa >= 3.5) careerProspects = "📊 Good career options with salary bonuses";
                    else if (gpa >= 3.0) careerProspects = "💼 Standard career path";
                    else if (gpa >= 2.5) careerProspects = "📉 Limited options, -5% starting salary";
                    else careerProspects = "⚠️ Very limited options, -10% starting salary";
                }
                
                content.innerHTML = `
                    <div class="text-center mb-4">
                        <div class="text-3xl mb-2">🎓</div>
                        <div class="text-xl text-white">${eduName}</div>
                        ${state.university?.major ? `<div class="text-sm text-gray-400">${MAJORS[state.university.major]?.name || 'Undeclared'}</div>` : ''}
                    </div>
                    
                    <div class="p-3 bg-gray-800 rounded-lg">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-400">Current GPA</span>
                            <span class="${gpaColor} text-xl font-bold">${gpa.toFixed(2)}</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" style="width: ${(gpa / 4) * 100}%"></div>
                        </div>
                        <div class="text-xs text-center mt-1 ${gpaColor}">${gpaStatus}</div>
                    </div>
                    
                    <div class="p-3 bg-gray-800 rounded-lg mt-3">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-400">Progress to Graduation</span>
                            <span class="text-cyan-400">${progress}%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-cyan-500 rounded-full" style="width: ${progress}%"></div>
                        </div>
                        <div class="text-xs text-gray-500 mt-1">Week ${state.phaseWeek} of ${state.phaseTarget} • ~${timeLeft} remaining</div>
                    </div>
                    
                    ${careerProspects ? `
                    <div class="p-3 bg-gray-800 rounded-lg mt-3">
                        <div class="text-gray-400 text-sm mb-1">Career Prospects</div>
                        <div class="text-white text-sm">${careerProspects}</div>
                    </div>
                    ` : ''}
                    
                    ${state.university ? `
                    <div class="p-3 bg-gray-800 rounded-lg mt-3">
                        <div class="text-gray-400 text-sm mb-2">Academic Stats</div>
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div class="flex justify-between"><span class="text-gray-500">On Probation:</span><span class="${state.university.onProbation ? 'text-red-400' : 'text-green-400'}">${state.university.onProbation ? 'Yes ⚠️' : 'No ✓'}</span></div>
                            <div class="flex justify-between"><span class="text-gray-500">Dean's List:</span><span class="${state.university.honorsList ? 'text-yellow-400' : 'text-gray-400'}">${state.university.honorsList ? 'Yes ⭐' : 'No'}</span></div>
                            ${state.university.studyBuddy ? `<div class="flex justify-between"><span class="text-gray-500">Study Buddy:</span><span class="text-cyan-400">${state.university.studyBuddy.split(' ')[0]}</span></div>` : ''}
                            ${state.university.professorMentor ? `<div class="flex justify-between"><span class="text-gray-500">Mentor:</span><span class="text-purple-400">${state.university.professorMentor.name?.split(' ')[0] || 'Professor'}</span></div>` : ''}
                            <div class="flex justify-between"><span class="text-gray-500">All-Nighters:</span><span class="text-orange-400">${state.university.allNighters || 0}</span></div>
                            <div class="flex justify-between"><span class="text-gray-500">Internship:</span><span class="${state.university.internshipCompleted ? 'text-green-400' : 'text-gray-400'}">${state.university.internshipCompleted ? 'Done ✓' : 'Not yet'}</span></div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                        <div class="text-blue-400 text-sm font-medium">💡 GPA Tips</div>
                        <ul class="text-xs text-gray-400 mt-1 space-y-1">
                            <li>• Study hard for exams - failed rolls hurt your GPA</li>
                            <li>• Find a study buddy for easier assignments</li>
                            <li>• 3.5+ GPA = honors and better job prospects</li>
                            <li>• Below 2.0 = academic probation risk!</li>
                        </ul>
                    </div>
                    
                    <div class="mt-4 pt-4 border-t border-gray-700">
                        <button onclick="considerDropOut()" class="w-full py-2 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-white rounded transition-colors text-sm">
                            🚪 Consider Dropping Out
                        </button>
                    </div>
                `;
            } else if (state.phase === 'employed' || state.phase === 'job_hunting') {
                // Show job/career info instead
                title.innerText = state.employed ? '💼 Career Status' : '🔍 Job Search';
                
                if (state.employed) {
                    let job = JOBS[state.job];
                    let perf = state.performance || 50;
                    let perfColor = perf >= 80 ? 'text-green-400' : perf >= 60 ? 'text-cyan-400' : perf >= 40 ? 'text-yellow-400' : 'text-red-400';
                    let perfStatus = perf >= 80 ? 'Excellent - Promotion likely!' : perf >= 60 ? 'Good standing' : perf >= 40 ? 'Needs improvement' : 'At risk of termination';
                    
                    content.innerHTML = `
                        <div class="text-center mb-4">
                            <div class="text-3xl mb-2">${job?.icon || '💼'}</div>
                            <div class="text-xl text-white">${state.jobTitle}</div>
                            <div class="text-sm text-gray-400">Week ${state.weeksAtJob} on the job</div>
                        </div>
                        
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="flex justify-between items-center mb-2">
                                <span class="text-gray-400">Performance</span>
                                <span class="${perfColor}">${Math.round(perf)}%</span>
                            </div>
                            <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div class="h-full ${perf >= 60 ? 'bg-green-500' : perf >= 40 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full" style="width: ${perf}%"></div>
                            </div>
                            <div class="text-xs text-center mt-1 ${perfColor}">${perfStatus}</div>
                        </div>
                        
                        <div class="p-3 bg-gray-800 rounded-lg mt-3">
                            <div class="text-gray-400 text-sm mb-2">Compensation</div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Base Salary:</span>
                                <span class="text-green-400">$${job?.salary || 0}/week</span>
                            </div>
                            ${state.baseSalary && state.baseSalary !== job?.salary ? `
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Your Salary:</span>
                                <span class="text-green-400">$${state.baseSalary}/week</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${state.education ? `
                        <div class="p-3 bg-gray-800 rounded-lg mt-3">
                            <div class="text-gray-400 text-sm mb-1">Education</div>
                            <div class="text-white">${state.education.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            ${state.gpa ? `<div class="text-sm text-gray-400">Graduated with ${state.gpa.toFixed(2)} GPA</div>` : ''}
                        </div>
                        ` : ''}
                    `;
                } else {
                    // Job hunting
                    let gpaBonus = getGPAHiringModifier();
                    let gpaSalaryMod = getGPASalaryModifier();
                    
                    content.innerHTML = `
                        <div class="text-center mb-4">
                            <div class="text-3xl mb-2">🔍</div>
                            <div class="text-xl text-white">Job Hunting</div>
                            <div class="text-sm text-gray-400">Week ${state.phaseWeek + 1}</div>
                        </div>
                        
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-500">Applications Sent:</span>
                                <span class="text-cyan-400">${state.jobApplications || 0}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Interviews Pending:</span>
                                <span class="text-green-400">${state.interviews || 0}</span>
                            </div>
                        </div>
                        
                        ${state.education === 'university' || state.education === 'community_college' ? `
                        <div class="p-3 bg-gray-800 rounded-lg mt-3">
                            <div class="text-gray-400 text-sm mb-2">GPA Impact on Job Hunt</div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-500">Your GPA:</span>
                                <span class="${state.gpa >= 3.5 ? 'text-green-400' : state.gpa >= 3.0 ? 'text-cyan-400' : state.gpa >= 2.5 ? 'text-yellow-400' : 'text-red-400'}">${state.gpa?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-500">Interview Bonus:</span>
                                <span class="${gpaBonus >= 0 ? 'text-green-400' : 'text-red-400'}">${gpaBonus >= 0 ? '+' : ''}${gpaBonus}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-500">Salary Modifier:</span>
                                <span class="${gpaSalaryMod >= 1 ? 'text-green-400' : 'text-red-400'}">${gpaSalaryMod >= 1 ? '+' : ''}${Math.round((gpaSalaryMod - 1) * 100)}%</span>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="p-3 bg-gray-800 rounded-lg mt-3">
                            <div class="text-gray-400 text-sm mb-1">Available Positions: ${getAvailableJobs().length}</div>
                            <div class="text-xs text-gray-500">Based on your education, skills, and GPA</div>
                        </div>
                    `;
                }
            } else {
                // Generic status for other phases
                title.innerText = '📋 Current Status';
                content.innerHTML = `
                    <div class="text-center py-4">
                        <div class="text-3xl mb-2">${state.phase === 'deciding' ? '🤔' : '❓'}</div>
                        <div class="text-white">${state.phase === 'deciding' ? 'Deciding Your Future' : 'In Transition'}</div>
                        <div class="text-sm text-gray-400 mt-2">Make choices to shape your path!</div>
                    </div>
                `;
            }
            
            // Add Life Options section to ALL phases
            content.innerHTML += getLifeOptionsHTML();
            
            modal.classList.remove('hidden');
        }
        
        function getLifeOptionsHTML() {
            let options = [];
            let age = getAge();
            
            // No life options available in military (strict commitment)
            let inMilitary = state.educationType === 'military_training' || state.job === 'military';
            if (inMilitary) {
                return `
                    <div class="mt-4 pt-4 border-t border-gray-700">
                        <div class="text-gray-400 text-sm font-medium mb-2">🔄 Life Options</div>
                        <div class="p-3 bg-gray-800/50 rounded-lg text-center">
                            <div class="text-gray-500 text-sm">🎖️ Military Commitment</div>
                            <div class="text-xs text-gray-600 mt-1">You're bound by your service contract. Complete your duty first.</div>
                        </div>
                    </div>
                `;
            }
            
            // No options while in jail
            if (state.criminal?.inJail) {
                return `
                    <div class="mt-4 pt-4 border-t border-gray-700">
                        <div class="text-gray-400 text-sm font-medium mb-2">🔄 Life Options</div>
                        <div class="p-3 bg-gray-800/50 rounded-lg text-center">
                            <div class="text-gray-500 text-sm">🔒 Incarcerated</div>
                            <div class="text-xs text-gray-600 mt-1">${state.criminal.jailWeeksRemaining} weeks remaining on your sentence.</div>
                        </div>
                    </div>
                `;
            }
            
            // Start a Business option
            if (!state.business?.active) {
                let canAfford = state.money >= 3000;
                let canLoan = state.creditScore >= 600;
                options.push({
                    icon: '🏢',
                    title: 'Start a Business',
                    desc: canAfford || canLoan ? 'Be your own boss' : 'Need $3,000 or 600 credit',
                    enabled: canAfford || canLoan,
                    action: 'openBusinessModal()'
                });
            }
            
            // Crime option
            options.push({
                icon: '🔥',
                title: 'The Underground',
                desc: 'Explore... opportunities',
                enabled: true,
                action: 'openCrimeModal()'
            });
            
            // Join Military option (if not already military and under 35)
            if (age < 35) {
                let hasRecord = state.criminal?.record?.filter(r => r.caught).length > 0;
                options.push({
                    icon: '🎖️',
                    title: 'Join the Military',
                    desc: hasRecord ? 'Criminal record may disqualify' : 'Serve your country',
                    enabled: !hasRecord,
                    action: 'joinMilitary()'
                });
            }
            
            // Enroll in Education (if not currently in school)
            if (state.phase !== 'education' && age < 40) {
                options.push({
                    icon: '🎓',
                    title: 'Go Back to School',
                    desc: 'University, trade school, or community college',
                    enabled: true,
                    action: 'openEnrollmentModal()'
                });
            }
            
            // Go Fishing option
            options.push({
                icon: '🎣',
                title: 'Go Fishing',
                desc: `Skill: ${state.skills?.fishing || 0} | Relax & earn money`,
                enabled: true,
                action: 'openFishingLocationModal()'
            });
            
            if (options.length === 0) return '';
            
            return `
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <div class="text-gray-400 text-sm font-medium mb-3">🔄 Life Options</div>
                    <div class="space-y-2">
                        ${options.map(opt => `
                            <button onclick="closeEducationModal(); ${opt.action}" 
                                class="w-full p-2 flex items-center gap-3 rounded transition-colors ${opt.enabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 opacity-50 cursor-not-allowed'}"
                                ${!opt.enabled ? 'disabled' : ''}>
                                <span class="text-xl">${opt.icon}</span>
                                <div class="text-left">
                                    <div class="text-white text-sm">${opt.title}</div>
                                    <div class="text-xs text-gray-500">${opt.desc}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        function joinMilitary() {
            let age = getAge();
            
            if (state.criminal?.record?.filter(r => r.caught).length > 0) {
                alert("Your criminal record disqualifies you from military service.");
                return;
            }
            
            if (age >= 35) {
                alert("You're too old to enlist (max age 35).");
                return;
            }
            
            let isInSchool = state.phase === 'education';
            let warningText = isInSchool ? 
                `Join the Military?\n\nThis will mean dropping out of ${state.educationType === 'university' ? 'University' : state.educationType === 'community_college' ? 'Community College' : 'Trade School'}.\n\n` :
                `Join the Military?\n\n`;
            
            warningText += `You'll enter Boot Camp for basic training.\n\nBenefits:\n• Steady pay and benefits\n• Skills training\n• Education benefits (GI Bill)\n• Housing provided\n\nCommitment: 4+ year service obligation`;
            
            if (!confirm(warningText)) return;
            
            // Drop out if in school
            if (isInSchool) {
                state.happiness -= 10;
                state.previousEducation = {
                    type: state.educationType,
                    progress: Math.round((state.phaseWeek / state.phaseTarget) * 100),
                    gpa: state.gpa,
                    weeksCompleted: state.phaseWeek
                };
            }
            
            // Start military training
            state.phase = 'education';
            state.educationType = 'military_training';
            state.phaseWeek = 0;
            state.phaseTarget = 12; // 12 weeks boot camp
            state.gpa = 0;
            state.home = 'barracks';
            state.stress += 20;
            
            state.military = state.military || {};
            state.military.rank = 0;
            state.military.mos = null;
            state.military.combatXP = 0;
            
            addLog("Enlisted in the military - starting boot camp");
            updateUI();
            
            displayEvent({
                category: "🎖️ Military",
                title: "Welcome to Boot Camp",
                desc: "You've enlisted. The drill sergeant is screaming. Your old life feels very far away.",
                choices: [
                    {
                        text: "Let's do this",
                        effect: () => {
                            state.happiness += 5;
                            return { icon: "💪", text: "This is your new life now. Embrace it.", stats: "+5 Happiness" };
                        }
                    }
                ]
            });
        }
        
        function openEnrollmentModal() {
            let age = getAge();
            let hasCollege = state.education === 'university' || state.education === 'community_college';
            
            let options = [];
            
            // University (if don't already have degree)
            if (!hasCollege) {
                let cost = state.previousEducation?.type === 'university' ? 20000 : 15000;
                options.push({
                    icon: '🎓',
                    title: 'University',
                    desc: `4 years, ~$${cost.toLocaleString()} debt`,
                    cost: cost,
                    duration: '4 years',
                    action: () => enrollInEducation('university', cost)
                });
                
                options.push({
                    icon: '📚',
                    title: 'Community College',
                    desc: '2 years, ~$4,000 debt',
                    cost: 4000,
                    duration: '2 years',
                    action: () => enrollInEducation('community_college', 4000)
                });
            }
            
            // Trade School
            options.push({
                icon: '🔧',
                title: 'Trade School',
                desc: '1.5 years, ~$15,000 debt',
                cost: 15000,
                duration: '1.5 years',
                action: () => enrollInEducation('trade_school', 15000)
            });
            
            let optionsHtml = options.map(opt => `
                <button onclick="${opt.action.toString().slice(6)}" class="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">${opt.icon}</span>
                        <div>
                            <div class="text-white font-medium">${opt.title}</div>
                            <div class="text-xs text-gray-400">${opt.desc}</div>
                        </div>
                    </div>
                </button>
            `).join('');
            
            // Create a simple alert-style choice
            let choice = prompt(`Go Back to School?\n\nOptions:\n1. University (4 years, ~$15,000 debt)\n2. Community College (2 years, ~$4,000 debt)\n3. Trade School (1.5 years, ~$15,000 debt)\n\nEnter 1, 2, or 3 (or cancel):`);
            
            if (choice === '1') enrollInEducation('university', 15000);
            else if (choice === '2') enrollInEducation('community_college', 4000);
            else if (choice === '3') enrollInEducation('trade_school', 15000);
        }
        
        function enrollInEducation(type, debt) {
            let wasEmployed = state.employed;
            
            // Quit job if employed
            if (wasEmployed) {
                state.employed = false;
                state.job = null;
                state.jobTitle = '';
                addLog("Quit job to go back to school");
            }
            
            let durations = {
                'university': 208, // 4 years
                'community_college': 104, // 2 years  
                'trade_school': 78 // 1.5 years
            };
            
            state.phase = 'education';
            state.educationType = type;
            state.phaseWeek = 0;
            state.phaseTarget = durations[type];
            state.debt += debt;
            state.gpa = 3.0;
            
            if (type === 'university') {
                state.home = 'dorm';
                state.university = {
                    major: null,
                    semester: 1,
                    allNighters: 0,
                    professorMentor: null,
                    studyBuddy: null,
                    internshipCompleted: false,
                    onProbation: false,
                    honorsList: false
                };
            }
            
            addLog(`Enrolled in ${type === 'university' ? 'University' : type === 'community_college' ? 'Community College' : 'Trade School'}`);
            updateUI();
        }
        
        function closeEducationModal() {
            document.getElementById('educationModal').classList.add('hidden');
        }
        
        function considerDropOut() {
            let eduType = state.educationType;
            let eduName = eduType === 'university' ? 'University' : 
                         eduType === 'community_college' ? 'Community College' : 
                         eduType === 'trade_school' ? 'Trade School' : 
                         eduType === 'military_training' ? 'Military' : 'School';
            
            let progress = Math.round((state.phaseWeek / state.phaseTarget) * 100);
            let debtInfo = state.debt > 0 ? `\n• Student loans remain: $${state.debt.toLocaleString()} (NOT dischargeable!)` : '';
            
            let consequences = '';
            let canGetPartialCredit = false;
            
            if (eduType === 'university' || eduType === 'community_college') {
                canGetPartialCredit = progress >= 50;
                consequences = `Consequences:\n` +
                    `• No degree earned\n` +
                    `• Lost tuition investment${debtInfo}\n` +
                    `• -20 Happiness\n` +
                    (canGetPartialCredit ? `• Partial credits can transfer if you return later\n` : `• No transferable credits (< 50% complete)\n`) +
                    `• Can re-enroll later (higher cost)`;
            } else if (eduType === 'trade_school') {
                canGetPartialCredit = progress >= 60;
                consequences = `Consequences:\n` +
                    `• No certification\n` +
                    (canGetPartialCredit ? `• Basic skills learned may help in entry-level jobs\n` : `• No usable skills yet\n`) +
                    `• -15 Happiness${debtInfo}`;
            } else if (eduType === 'military_training') {
                consequences = `Consequences:\n` +
                    `• ${progress < 30 ? 'Entry-level separation (no benefits)' : progress < 70 ? 'General discharge (limited benefits)' : 'Honorable early discharge (full benefits)'}\n` +
                    `• -25 Happiness\n` +
                    `• May affect future employment`;
            }
            
            if (!confirm(`Are you sure you want to drop out of ${eduName}?\n\nYou are ${progress}% complete.\n\n${consequences}\n\nThis cannot be undone.`)) {
                return;
            }
            
            closeEducationModal();
            
            // Apply consequences
            let oldEdu = eduType;
            let wasProgress = progress;
            
            if (eduType === 'military_training') {
                // Military has special handling
                state.happiness -= 25;
                if (wasProgress >= 70) {
                    state.education = 'military_partial';
                    addLog("Early military discharge (honorable)");
                } else if (wasProgress >= 30) {
                    state.education = 'high_school';
                    addLog("Left military (general discharge)");
                } else {
                    state.education = 'high_school';
                    addLog("Left military (entry-level separation)");
                }
            } else {
                state.happiness -= eduType === 'trade_school' ? 15 : 20;
                
                // Track partial credits for potential return
                state.previousEducation = {
                    type: eduType,
                    progress: wasProgress,
                    gpa: state.gpa,
                    weeksCompleted: state.phaseWeek
                };
                
                addLog(`Dropped out of ${eduName}`);
            }
            
            // Reset education state
            state.phase = 'job_hunting';
            state.phaseWeek = 0;
            state.phaseTarget = 0;
            state.educationType = null;
            state.gpa = 0;
            state.university = null;
            state.interviews = 0;
            state.jobApplications = 0;
            
            updateUI();
            
            // Show aftermath event
            displayEvent({
                category: "📚 Education",
                title: "New Chapter",
                desc: `You've left ${eduName} behind. The decision weighs on you, but the workforce awaits. Time to figure out what's next.`,
                choices: [
                    {
                        text: "Start job hunting immediately",
                        effect: () => {
                            state.energy += 10;
                            return { icon: "💼", text: "No time to dwell. There's work to find.", stats: "+10 Energy" };
                        }
                    },
                    {
                        text: "Take time to regroup",
                        effect: () => {
                            state.stress -= 20;
                            state.happiness += 5;
                            return { icon: "🌅", text: "A few days to clear your head and plan.", stats: "-20 Stress, +5 Happy" };
                        }
                    },
                    {
                        text: "Question everything",
                        effect: () => {
                            state.happiness -= 10;
                            state.stress += 10;
                            return { icon: "😔", text: "Did you make the right choice? Doubt creeps in.", stats: "-10 Happy, +10 Stress" };
                        }
                    }
                ]
            });
        }
        
        // ============ EMPLOYMENT MODAL ============
        const BOSS_PERSONALITIES = {
            supportive: { name: "Supportive", icon: "😊", desc: "Encouraging and understanding", stressMod: -5, perfMod: 1.1 },
            neutral: { name: "Professional", icon: "😐", desc: "Fair but distant", stressMod: 0, perfMod: 1.0 },
            demanding: { name: "Demanding", icon: "😤", desc: "High expectations, pushes hard", stressMod: 5, perfMod: 1.0, skillMod: 1.2 },
            toxic: { name: "Toxic", icon: "😠", desc: "Micromanager, takes credit", stressMod: 15, perfMod: 0.9 }
        };
        
        // Helper function for hiring - generates boss and sets up job
        function hireAtJob(jobKey, salary, startingPerformance = 50) {
            let job = JOBS[jobKey];
            state.employed = true;
            state.job = jobKey;
            state.jobTitle = job.title;
            state.phase = 'employed';
            state.performance = startingPerformance;
            state.weeksAtJob = 0;
            state.baseSalary = salary;
            state.career.boss = generateBoss();
            state.career.companiesWorked = (state.career.companiesWorked || 0) + 1;
            state.lookingForNewJob = false;
            addLog(`Got hired as ${job.title}`);
        }
        
        function generateBoss() {
            let personalities = Object.keys(BOSS_PERSONALITIES);
            let weights = [0.25, 0.40, 0.25, 0.10]; // supportive, neutral, demanding, toxic
            let roll = Math.random();
            let cumulative = 0;
            let personality = 'neutral';
            
            for (let i = 0; i < personalities.length; i++) {
                cumulative += weights[i];
                if (roll < cumulative) {
                    personality = personalities[i];
                    break;
                }
            }
            
            let names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Anderson'];
            let firstName = state.gender === 'male' ? 
                ['Robert', 'William', 'James', 'Michael', 'David'][Math.floor(Math.random() * 5)] :
                ['Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth'][Math.floor(Math.random() * 5)];
            
            return {
                name: `${firstName} ${names[Math.floor(Math.random() * names.length)]}`,
                personality: personality,
                relationship: 50
            };
        }
        
        function openEmploymentModal() {
            if (!state.employed || !state.job) return;
            
            let modal = document.getElementById('employmentModal');
            let content = document.getElementById('employmentContent');
            let actions = document.getElementById('employmentActions');
            
            let job = JOBS[state.job];
            if (!job) return;
            
            // Initialize boss if not exists
            if (!state.career.boss) {
                state.career.boss = generateBoss();
            }
            
            let boss = state.career.boss;
            let bossType = BOSS_PERSONALITIES[boss.personality];
            let perf = state.performance || 50;
            let perfColor = perf >= 80 ? 'text-green-400' : perf >= 60 ? 'text-cyan-400' : perf >= 40 ? 'text-yellow-400' : 'text-red-400';
            let bossRelColor = boss.relationship >= 70 ? 'text-green-400' : boss.relationship >= 50 ? 'text-cyan-400' : boss.relationship >= 30 ? 'text-yellow-400' : 'text-red-400';
            
            content.innerHTML = `
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">${job.icon}</div>
                    <div class="text-xl text-white">${state.jobTitle}</div>
                    <div class="text-sm text-green-400">$${state.baseSalary || job.salary}/week</div>
                    <div class="text-xs text-gray-500">Week ${state.weeksAtJob} on the job</div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-gray-400">Performance</span>
                        <span class="${perfColor}">${Math.round(perf)}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full ${perf >= 60 ? 'bg-green-500' : perf >= 40 ? 'bg-yellow-500' : 'bg-red-500'} rounded-full" style="width: ${perf}%"></div>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                        ${perf >= 80 ? 'Excellent - promotion likely!' : perf >= 60 ? 'Good standing' : perf >= 40 ? 'Needs improvement' : 'At risk of termination'}
                    </div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-gray-400 text-sm mb-2">Your Boss</div>
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${bossType.icon}</span>
                        <div class="flex-grow">
                            <div class="text-white">${boss.name}</div>
                            <div class="text-xs text-gray-400">${bossType.name} - ${bossType.desc}</div>
                        </div>
                    </div>
                    <div class="mt-2">
                        <div class="flex justify-between text-xs mb-1">
                            <span class="text-gray-500">Relationship</span>
                            <span class="${bossRelColor}">${boss.relationship}%</span>
                        </div>
                        <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-blue-500 rounded-full" style="width: ${boss.relationship}%"></div>
                        </div>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${bossType.stressMod > 0 ? `⚠️ +${bossType.stressMod} weekly stress` : bossType.stressMod < 0 ? `😌 ${bossType.stressMod} weekly stress` : ''}
                        ${bossType.skillMod ? ` | 📈 +${Math.round((bossType.skillMod - 1) * 100)}% skill gains` : ''}
                    </div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-gray-400 text-sm mb-2">Job Effects</div>
                    <div class="text-xs space-y-1">
                        <div class="flex justify-between"><span class="text-gray-500">Base Stress:</span><span class="text-orange-400">+${job.stress}/week</span></div>
                        <div class="flex justify-between"><span class="text-gray-500">Total Stress:</span><span class="text-orange-400">+${job.stress + (bossType.stressMod || 0)}/week</span></div>
                    </div>
                </div>
            `;
            
            actions.innerHTML = `
                <button onclick="lookForNewJob()" class="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors">
                    🔍 Look for Other Jobs
                </button>
                <button onclick="quitJob()" class="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
                    🚪 Quit This Job
                </button>
                <button onclick="closeEmploymentModal()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                    Close
                </button>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeEmploymentModal() {
            document.getElementById('employmentModal').classList.add('hidden');
        }
        
        function lookForNewJob() {
            closeEmploymentModal();
            // Set flag to allow job hunting while employed
            state.lookingForNewJob = true;
            addLog("Started looking for new job opportunities");
            alert("You'll now see job opportunities while still employed. Be careful - your current boss might find out!");
        }
        
        function quitJob() {
            if (!confirm(`Are you sure you want to quit your job as ${state.jobTitle}?\n\nYou'll need to find a new job to pay the bills.`)) {
                return;
            }
            
            closeEmploymentModal();
            
            let oldJob = state.jobTitle;
            state.employed = false;
            state.job = null;
            state.jobTitle = '';
            state.phase = 'job_hunting';
            state.phaseWeek = 0;
            state.weeksAtJob = 0;
            state.performance = 50;
            state.career.boss = null;
            state.interviews = 0;
            state.jobApplications = 0;
            
            addLog(`Quit job as ${oldJob}`);
            updateUI();
            
            // Show the next event
            displayEvent(getPhaseEvents()[0]);
        }
        
        // ============ STATS BREAKDOWN MODAL ============
        function openStatsModal(statType) {
            let modal = document.getElementById('statsModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'statsModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-white" id="statsModalTitle">Stats</h3>
                            <button onclick="closeStatsModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="statsModalContent"></div>
                        <button onclick="closeStatsModal()" class="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                            Close
                        </button>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let title = document.getElementById('statsModalTitle');
            let content = document.getElementById('statsModalContent');
            
            let breakdown = getStatBreakdown(statType);
            
            title.innerHTML = breakdown.title;
            content.innerHTML = breakdown.html;
            
            modal.classList.remove('hidden');
        }
        
        function closeStatsModal() {
            document.getElementById('statsModal')?.classList.add('hidden');
        }
        
        function getStatBreakdown(statType) {
            let title = '';
            let html = '';
            let effects = [];
            
            switch(statType) {
                case 'energy':
                    title = '⚡ Energy Breakdown';
                    let energy = Math.round(state.energy);
                    
                    // Weekly energy effects
                    effects.push({ name: 'Natural Recovery', value: '+5', color: 'green' });
                    
                    // Free time effects
                    let gymHours = state.freeTime.gym || 0;
                    let overtimeHours = state.freeTime.overtime || 0;
                    let studyHours = state.freeTime.study || 0;
                    let restHours = state.freeTime.rest || 0;
                    
                    if (gymHours > 0) effects.push({ name: `Gym (${gymHours}hrs)`, value: `-${gymHours * 2}`, color: 'red' });
                    if (overtimeHours > 0) effects.push({ name: `Overtime (${overtimeHours}hrs)`, value: `-${overtimeHours * 3}`, color: 'red' });
                    if (studyHours > 0) effects.push({ name: `Study (${studyHours}hrs)`, value: `-${studyHours * 2}`, color: 'red' });
                    if (restHours > 0) effects.push({ name: `Rest (${restHours}hrs)`, value: `+${restHours * 3}`, color: 'green' });
                    
                    // Fitness effects
                    let fitness = state.fitness?.fitnessLevel || 50;
                    if (fitness < 30) {
                        effects.push({ name: 'Low Fitness', value: '-5', color: 'red' });
                    } else if (fitness >= 70) {
                        effects.push({ name: 'Good Fitness', value: '+2', color: 'green' });
                    }
                    
                    // Job stress
                    if (state.employed && state.job && JOBS[state.job]) {
                        let jobStress = JOBS[state.job].stress || 0;
                        if (jobStress > 25) effects.push({ name: 'Demanding Job', value: `-${Math.floor(jobStress/10)}`, color: 'red' });
                    }
                    
                    // Low energy warning
                    if (energy < 30) {
                        effects.push({ name: '⚠️ Low Energy Penalty', value: '-2 to all rolls', color: 'orange' });
                    }
                    
                    html = `
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">⚡</div>
                            <div class="text-3xl ${energy < 30 ? 'text-red-400' : energy < 50 ? 'text-yellow-400' : 'text-green-400'}">${energy}%</div>
                            <div class="text-sm text-gray-400">Current Energy</div>
                        </div>
                        <div class="text-sm text-gray-400 mb-2">Weekly Effects:</div>
                    `;
                    break;
                    
                case 'health':
                    title = '♥ Health Breakdown';
                    let health = Math.round(state.health);
                    
                    // Natural effects
                    if (state.stress > 70) effects.push({ name: 'High Stress', value: '-1', color: 'red' });
                    if (state.energy < 30) effects.push({ name: 'Exhaustion', value: '-1', color: 'red' });
                    
                    // Fitness
                    if (fitness < 30) {
                        effects.push({ name: 'Very Unfit', value: '-1', color: 'red' });
                    } else if (fitness >= 70) {
                        effects.push({ name: 'Very Fit', value: '+0.5', color: 'green' });
                    }
                    
                    // Healthy eating
                    if (state.fitness?.healthyEating) effects.push({ name: 'Healthy Eating', value: '+1', color: 'green' });
                    
                    // Gym
                    if (state.fitness?.gymMember && gymHours > 0) effects.push({ name: 'Working Out', value: '+1', color: 'green' });
                    
                    // Bad habits
                    if (state.habits?.smoking?.active) effects.push({ name: 'Smoking', value: '-3', color: 'red' });
                    if (state.habits?.drinking?.active) effects.push({ name: 'Heavy Drinking', value: '-2', color: 'red' });
                    if (state.habits?.junkFood?.active) effects.push({ name: 'Junk Food Habit', value: '-1', color: 'red' });
                    
                    // Age
                    let age = getAge();
                    if (age > 40) effects.push({ name: `Age (${age})`, value: '-2/year', color: 'orange' });
                    
                    html = `
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">♥</div>
                            <div class="text-3xl ${health < 30 ? 'text-red-400' : health < 50 ? 'text-yellow-400' : 'text-green-400'}">${health}%</div>
                            <div class="text-sm text-gray-400">Current Health</div>
                        </div>
                        <div class="text-sm text-gray-400 mb-2">Weekly Effects:</div>
                    `;
                    break;
                    
                case 'happiness':
                    title = '☺ Happiness Breakdown';
                    let happiness = Math.round(state.happiness);
                    
                    // Stress impact
                    if (state.stress > 70) effects.push({ name: 'High Stress', value: '-1', color: 'red' });
                    
                    // Relationship
                    if (state.hasPartner) {
                        let bond = state.partnerStats?.supportiveness || 50;
                        if (bond >= 70) effects.push({ name: 'Happy Relationship', value: '+2', color: 'green' });
                        else if (bond < 30) effects.push({ name: 'Troubled Relationship', value: '-2', color: 'red' });
                    } else {
                        effects.push({ name: 'Single', value: '0', color: 'gray' });
                    }
                    
                    // Free time
                    let hobbyHours = state.freeTime.hobbies || 0;
                    let socializeHours = state.freeTime.socialize || 0;
                    if (hobbyHours > 0) effects.push({ name: `Hobbies (${hobbyHours}hrs)`, value: `+${hobbyHours}`, color: 'green' });
                    if (socializeHours > 0) effects.push({ name: `Socializing (${socializeHours}hrs)`, value: `+${Math.floor(socializeHours * 0.8)}`, color: 'green' });
                    if (overtimeHours > 0) effects.push({ name: `Overtime (${overtimeHours}hrs)`, value: `-${Math.floor(overtimeHours * 0.5)}`, color: 'red' });
                    
                    // Living situation
                    let housing = HOUSING[state.home];
                    if (housing?.happiness) effects.push({ name: housing.name, value: housing.happiness > 0 ? `+${housing.happiness}` : `${housing.happiness}`, color: housing.happiness > 0 ? 'green' : 'red' });
                    
                    html = `
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">☺</div>
                            <div class="text-3xl ${happiness < 30 ? 'text-red-400' : happiness < 50 ? 'text-yellow-400' : 'text-green-400'}">${happiness}%</div>
                            <div class="text-sm text-gray-400">Current Happiness</div>
                        </div>
                        <div class="text-sm text-gray-400 mb-2">Weekly Effects:</div>
                    `;
                    break;
                    
                case 'stress':
                    title = '😰 Stress Breakdown';
                    let stress = Math.round(state.stress);
                    
                    // Natural recovery
                    effects.push({ name: 'Natural Recovery', value: '-2', color: 'green' });
                    
                    // Job stress
                    if (state.employed && state.job && JOBS[state.job]) {
                        let jobStress = JOBS[state.job].stress || 0;
                        effects.push({ name: `Job (${state.jobTitle})`, value: `+${jobStress}`, color: 'red' });
                        
                        // Boss stress
                        if (state.career?.boss) {
                            let bossType = BOSS_PERSONALITIES[state.career.boss.personality];
                            if (bossType?.stressMod) {
                                effects.push({ name: `Boss (${bossType.name})`, value: bossType.stressMod > 0 ? `+${bossType.stressMod}` : `${bossType.stressMod}`, color: bossType.stressMod > 0 ? 'red' : 'green' });
                            }
                        }
                    }
                    
                    // Housing stress
                    let housingStress = HOUSING[state.home]?.stress || 0;
                    if (housingStress !== 0) effects.push({ name: HOUSING[state.home].name, value: housingStress > 0 ? `+${housingStress}` : `${housingStress}`, color: housingStress > 0 ? 'red' : 'green' });
                    
                    // Transport stress
                    let transportStress = TRANSPORT[state.car]?.stress || 0;
                    if (transportStress !== 0) effects.push({ name: TRANSPORT[state.car].name, value: transportStress > 0 ? `+${transportStress}` : `${transportStress}`, color: transportStress > 0 ? 'red' : 'green' });
                    
                    // Free time stress relief
                    if (hobbyHours > 0) effects.push({ name: `Hobbies (${hobbyHours}hrs)`, value: `-${Math.floor(hobbyHours * 1.5)}`, color: 'green' });
                    if (socializeHours > 0) effects.push({ name: `Socializing (${socializeHours}hrs)`, value: `-${socializeHours}`, color: 'green' });
                    if (restHours > 0) effects.push({ name: `Rest (${restHours}hrs)`, value: `-${restHours * 2}`, color: 'green' });
                    if (overtimeHours > 0) effects.push({ name: `Overtime (${overtimeHours}hrs)`, value: `+${overtimeHours * 2}`, color: 'red' });
                    
                    // Money stress
                    if (state.money < 0) effects.push({ name: 'In Debt', value: '+8', color: 'red' });
                    else if (state.money < 100) effects.push({ name: 'Almost Broke', value: '+5', color: 'red' });
                    else if (state.money < 300) effects.push({ name: 'Tight Budget', value: '+2', color: 'orange' });
                    
                    html = `
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-2">😰</div>
                            <div class="text-3xl ${stress > 70 ? 'text-red-400' : stress > 50 ? 'text-yellow-400' : 'text-green-400'}">${stress}%</div>
                            <div class="text-sm text-gray-400">Current Stress</div>
                        </div>
                        <div class="text-sm text-gray-400 mb-2">Weekly Effects:</div>
                    `;
                    break;
            }
            
            // Build effects list
            html += `<div class="space-y-2">`;
            effects.forEach(e => {
                let colorClass = e.color === 'green' ? 'text-green-400' : 
                                e.color === 'red' ? 'text-red-400' : 
                                e.color === 'orange' ? 'text-orange-400' : 'text-gray-400';
                html += `
                    <div class="flex justify-between p-2 bg-gray-800 rounded">
                        <span class="text-gray-300">${e.name}</span>
                        <span class="${colorClass}">${e.value}</span>
                    </div>
                `;
            });
            html += `</div>`;
            
            // Add tips
            html += `
                <div class="mt-4 p-3 bg-gray-800/50 rounded border border-gray-700">
                    <div class="text-xs text-gray-400 font-medium mb-1">💡 Tips:</div>
                    <div class="text-xs text-gray-500">${getStatTips(statType)}</div>
                </div>
            `;
            
            return { title, html };
        }
        
        function getStatTips(statType) {
            switch(statType) {
                case 'energy':
                    return 'Allocate hours to Rest in your free time. Reduce overtime. Stay fit for better stamina.';
                case 'health':
                    return 'Join a gym, eat healthy, avoid bad habits. Keep stress low and energy up.';
                case 'happiness':
                    return 'Spend time on hobbies and socializing. Maintain relationships. Upgrade your living situation.';
                case 'stress':
                    return 'Rest, hobbies, and socializing reduce stress. Consider a less stressful job or better housing.';
                default:
                    return '';
            }
        }
        
        // ============ RELATIONSHIP/DATING MODAL ============
        function openRelationshipModal() {
            if (state.hasPartner) {
                openPartnerModal();
            } else {
                openDatingModal();
            }
        }
        
        // Store current dating matches
        let currentMatches = [];
        
        function generateDatingMatches() {
            let matches = [];
            let appeal = calculateAppeal(true); // Use dating app specific appeal
            
            // Men get fewer matches on dating apps (realistic)
            let baseMatches = state.gender === 'male' ? 2 : 4;
            let appealBonus = Math.floor(appeal / 25);
            let numMatches = Math.max(1, baseMatches + appealBonus + Math.floor(Math.random() * 2));
            
            // Very low appeal men might get 0-1 matches
            if (state.gender === 'male' && appeal < 30) {
                numMatches = Math.random() < 0.4 ? 1 : 0;
            }
            
            for (let i = 0; i < numMatches; i++) {
                let partner = generatePartner();
                
                // Their "pickiness" - higher quality partners are pickier
                // Women on apps are pickier (more options)
                let basePicky = state.gender === 'male' ? 1.0 : 0.7;
                let theirStandards = partner.quality * basePicky + Math.random() * 20;
                
                // Will they match with you?
                let willMatch = appeal >= theirStandards - 15;
                
                // Men have lower match rates even when they "should" match
                if (state.gender === 'male' && willMatch) {
                    willMatch = Math.random() < 0.5; // 50% of potential matches ghost
                }
                
                matches.push({
                    ...partner,
                    willMatch: willMatch,
                    interested: willMatch && Math.random() < (state.gender === 'male' ? 0.5 : 0.8),
                    bio: generateDatingBio(partner)
                });
            }
            
            // For men with very low appeal, they might only see less attractive profiles
            if (state.gender === 'male' && appeal < 40) {
                matches = matches.map(m => {
                    // Algorithm shows you people "in your league"
                    if (m.attractiveness > 60 && Math.random() < 0.7) {
                        m.attractiveness = 30 + Math.random() * 30;
                        m.quality = Math.max(20, m.quality - 20);
                    }
                    return m;
                });
            }
            
            return matches;
        }
        
        function generateDatingBio(partner) {
            let bios = [
                `Love ${partner.personality?.trait?.toLowerCase() || 'good'} vibes. Looking for something real.`,
                `${partner.job}. ${partner.personality?.trait || 'Kind'} soul with a ${partner.personality?.flaw?.toLowerCase() || 'quirky'} side.`,
                `Just here to see what happens. ${partner.age} and figuring it out.`,
                `${partner.personality?.trait || 'Fun'}-loving ${partner.job?.toLowerCase() || 'person'}. Swipe right if you like adventure.`,
                `Looking for my person. ${partner.personality?.trait || 'Loyal'} to a fault.`,
                `${partner.job} by day, Netflix enthusiast by night.`,
                `Not here for games. ${partner.personality?.trait || 'Honest'} and ${partner.personality?.flaw?.toLowerCase() || 'real'}.`
            ];
            return bios[Math.floor(Math.random() * bios.length)];
        }
        
        function openDatingModal() {
            let modal = document.getElementById('datingModal');
            if (!modal) {
                // Create modal if it doesn't exist
                modal = document.createElement('div');
                modal.id = 'datingModal';
                modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center hidden';
                modal.innerHTML = `
                    <div class="bg-gray-900 border border-pink-500/30 rounded-lg p-4 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-white">💕 Dating</h3>
                            <button onclick="closeDatingModal()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                        </div>
                        <div id="datingContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);
            }
            
            let content = document.getElementById('datingContent');
            let appeal = calculateAppeal(true); // Dating app specific appeal
            let generalAppeal = calculateAppeal(false); // General appeal for comparison
            
            // Calculate factors for display
            let age = getAge();
            let height = state.characterTraits?.height || 5;
            let currentAttr = state.currentAttractiveness || state.characterTraits?.attractiveness || 5;
            let isRich = state.money >= 50000 || (state.employed && JOBS[state.job]?.pay >= 1500);
            let isAttractive = currentAttr >= 8;
            let isTall = height >= 7;
            
            // Dating app difficulty message for men
            let difficultyMessage = '';
            if (state.gender === 'male') {
                let advantages = (isRich ? 1 : 0) + (isAttractive ? 1 : 0) + (isTall ? 1 : 0);
                if (advantages === 0) {
                    difficultyMessage = `<div class="text-xs text-red-400 mt-2">⚠️ Dating apps are brutal for average guys. Try meeting people through socializing or hobbies instead.</div>`;
                } else if (advantages === 1) {
                    difficultyMessage = `<div class="text-xs text-yellow-400 mt-2">📉 The algorithm isn't favoring you. Consider meeting people in person.</div>`;
                } else if (advantages === 2) {
                    difficultyMessage = `<div class="text-xs text-green-400 mt-2">📈 You're doing okay on here. Keep swiping!</div>`;
                } else {
                    difficultyMessage = `<div class="text-xs text-green-400 mt-2">🔥 You're in the top tier. The algorithm loves you.</div>`;
                }
            }
            
            // Generate fresh matches
            currentMatches = generateDatingMatches();
            
            let noMatchesMessage = '';
            if (currentMatches.length === 0) {
                noMatchesMessage = `
                    <div class="p-4 bg-gray-800 rounded-lg text-center">
                        <div class="text-3xl mb-2">😔</div>
                        <div class="text-gray-400">No matches right now...</div>
                        <div class="text-xs text-gray-500 mt-2">Try refreshing, or meet people through ${state.freeTime.socialize > 0 || state.freeTime.socialize_premium > 0 ? 'more' : ''} socializing and hobbies!</div>
                    </div>
                `;
            }
            
            let matchesHtml = currentMatches.map((match, index) => {
                let attrDesc = match.attractiveness >= 80 ? 'Very Attractive' : 
                              match.attractiveness >= 60 ? 'Attractive' : 
                              match.attractiveness >= 40 ? 'Average' : 'Below Average';
                let interested = match.interested ? '💚 Interested in you' : '❓ Unknown';
                
                return `
                    <div class="p-3 bg-gray-800 rounded-lg ${match.interested ? 'border border-green-500/30' : ''} cursor-pointer hover:bg-gray-700/50 transition-colors" onclick="viewMatchProfile(${index})">
                        <div class="flex items-center gap-3">
                            <div class="text-3xl">${match.icon || (match.gender === 'female' ? '👩' : '👨')}</div>
                            <div class="flex-grow">
                                <div class="text-white font-medium">${match.name}, ${Math.floor(match.age)}</div>
                                <div class="text-xs text-gray-400">${match.job}</div>
                                <div class="text-xs ${match.interested ? 'text-green-400' : 'text-gray-500'}">${interested}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-xs text-pink-400">${attrDesc}</div>
                                <div class="text-[10px] text-gray-500">tap for profile</div>
                            </div>
                        </div>
                        <div class="text-xs text-gray-400 mt-2 italic">"${match.bio}"</div>
                        <div class="flex gap-2 mt-3" onclick="event.stopPropagation()">
                            <button onclick="swipeLeft(${index})" class="flex-1 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded text-sm transition-colors">
                                ❌ Pass
                            </button>
                            <button onclick="swipeRight(${index})" class="flex-1 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded text-sm transition-colors">
                                💚 Like
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Profile factors breakdown for men
            let factorsHtml = '';
            if (state.gender === 'male') {
                factorsHtml = `
                    <div class="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                        <div class="p-2 rounded ${isTall ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800'}">
                            <div>${isTall ? '✅' : '❌'}</div>
                            <div class="text-gray-400">Tall</div>
                        </div>
                        <div class="p-2 rounded ${isRich ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800'}">
                            <div>${isRich ? '✅' : '❌'}</div>
                            <div class="text-gray-400">Wealthy</div>
                        </div>
                        <div class="p-2 rounded ${isAttractive ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800'}">
                            <div>${isAttractive ? '✅' : '❌'}</div>
                            <div class="text-gray-400">8+ Looks</div>
                        </div>
                    </div>
                `;
            }
            
            content.innerHTML = `
                <div class="text-center mb-4">
                    <div class="text-sm text-gray-400">Your Dating App Score</div>
                    <div class="text-2xl text-pink-400">${Math.round(appeal)}%</div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                        <div class="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full" style="width: ${Math.min(100, appeal)}%"></div>
                    </div>
                    ${state.gender === 'male' && appeal < generalAppeal ? `<div class="text-[10px] text-gray-500 mt-1">IRL Appeal: ${Math.round(generalAppeal)}% (apps are tougher)</div>` : ''}
                    ${factorsHtml}
                    ${difficultyMessage}
                </div>
                
                <div class="text-sm text-gray-400 mb-3">Potential Matches (${currentMatches.length})</div>
                <div class="space-y-3">
                    ${currentMatches.length > 0 ? matchesHtml : noMatchesMessage}
                </div>
                
                <div class="mt-4 space-y-2">
                    <button onclick="refreshMatches()" class="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded transition-colors">
                        🔄 Refresh Matches
                    </button>
                    <button onclick="closeDatingModal()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors">
                        Close
                    </button>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeDatingModal() {
            document.getElementById('datingModal')?.classList.add('hidden');
        }
        
        function refreshMatches() {
            openDatingModal(); // Regenerates matches
        }
        
        function swipeLeft(index) {
            // Remove the match from the list
            let matchEl = document.querySelectorAll('#datingContent .bg-gray-800')[index];
            if (matchEl) {
                matchEl.style.opacity = '0.3';
                matchEl.querySelector('.flex.gap-2').innerHTML = '<div class="text-center text-gray-500 py-2">Passed</div>';
            }
        }
        
        function viewMatchProfile(index) {
            let match = currentMatches[index];
            if (!match) return;
            
            let attrDesc = match.attractiveness >= 80 ? 'Very Attractive' : 
                          match.attractiveness >= 60 ? 'Attractive' : 
                          match.attractiveness >= 40 ? 'Average' : 'Below Average';
            
            // Show a detailed profile modal
            let profileModal = document.getElementById('matchProfileModal');
            if (!profileModal) {
                profileModal = document.createElement('div');
                profileModal.id = 'matchProfileModal';
                profileModal.className = 'fixed inset-0 bg-black/90 z-[60] flex items-center justify-center hidden';
                document.body.appendChild(profileModal);
            }
            
            // Dating profiles show limited info - you don't know their true personality yet!
            profileModal.innerHTML = `
                <div class="bg-gray-900 border border-pink-500/30 rounded-lg p-4 max-w-sm w-full mx-4">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-pink-400">Profile</h3>
                        <button onclick="closeMatchProfile()" class="text-gray-400 hover:text-white text-xl">&times;</button>
                    </div>
                    
                    <div class="text-center mb-4">
                        <div class="text-6xl mb-2">${match.icon || (match.gender === 'female' ? '👩' : '👨')}</div>
                        <div class="text-xl text-white font-bold">${match.name}, ${Math.floor(match.age)}</div>
                        <div class="text-sm text-gray-400">${match.job}</div>
                    </div>
                    
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-500 mb-1">Looks</div>
                            <div class="text-pink-400">${attrDesc}</div>
                        </div>
                        
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-500 mb-1">Bio</div>
                            <div class="text-gray-300 italic">"${match.bio}"</div>
                        </div>
                        
                        <div class="p-3 bg-gray-800 rounded-lg">
                            <div class="text-xs text-gray-500 mb-1">What you can tell...</div>
                            <div class="text-gray-400 text-sm">
                                ${match.quality >= 70 ? '✨ Seems very put-together' : match.quality >= 50 ? '👍 Seems nice' : '🤷 Hard to tell from photos'}
                            </div>
                        </div>
                        
                        <div class="p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                            <div class="text-xs text-yellow-400 mb-1">⚠️ Dating Reality</div>
                            <div class="text-gray-400 text-xs">
                                You won't know their true personality until you've dated for a while. 
                                Their positive traits become clear after ~2 months, but flaws may take longer to show...
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex gap-2 mt-4">
                        <button onclick="closeMatchProfile(); swipeLeft(${index})" class="flex-1 py-2 bg-red-600/50 hover:bg-red-600 text-white rounded text-sm transition-colors">
                            ❌ Pass
                        </button>
                        <button onclick="closeMatchProfile(); swipeRight(${index})" class="flex-1 py-2 bg-green-600/50 hover:bg-green-600 text-white rounded text-sm transition-colors">
                            💚 Like
                        </button>
                    </div>
                </div>
            `;
            
            profileModal.classList.remove('hidden');
        }
        
        function closeMatchProfile() {
            document.getElementById('matchProfileModal')?.classList.add('hidden');
        }
        
        function swipeRight(index) {
            let match = currentMatches[index];
            if (!match) return;
            
            if (match.willMatch && match.interested) {
                // It's a match!
                state.hasPartner = true;
                state.partnerName = match.name;
                state.partnerStats = {
                    ...match,
                    supportiveness: Math.floor(Math.random() * 30 + 40), // Start with 40-70 bond
                    traitsRevealed: { attractiveness: true, job: false, income: false, trait: false, flaw: false },
                    datingStartWeek: state.totalWeeks
                };
                state.relationshipWeeks = 0;
                state.neglect.relationship = 0;
                
                addLog(`Matched with ${match.name} on dating app!`);
                closeDatingModal();
                updateUI();
                
                alert(`💕 It's a Match!\n\nYou and ${match.name} liked each other!\n\nYou've started chatting and decided to meet up. This could be the start of something special!\n\n(You'll learn more about them as you spend time together)`);
            } else if (match.willMatch) {
                // They haven't swiped yet - show pending
                let matchEl = document.querySelectorAll('#datingContent .bg-gray-800')[index];
                if (matchEl) {
                    matchEl.querySelector('.flex.gap-2').innerHTML = '<div class="text-center text-yellow-400 py-2">💛 Liked - waiting for them...</div>';
                }
                
                // Small chance they match back later
                if (Math.random() < 0.3) {
                    setTimeout(() => {
                        if (!state.hasPartner) {
                            state.hasPartner = true;
                            state.partnerName = match.name;
                            state.partnerStats = {
                                ...match,
                                supportiveness: Math.floor(Math.random() * 30 + 35),
                                traitsRevealed: { attractiveness: true, job: false, income: false, trait: false, flaw: false },
                                datingStartWeek: state.totalWeeks
                            };
                            state.relationshipWeeks = 0;
                            addLog(`${match.name} matched with you!`);
                            updateUI();
                            alert(`💕 ${match.name} liked you back!\n\nLooks like they were interested after all!\n\n(You'll learn more about them as you spend time together)`);
                            closeDatingModal();
                        }
                    }, 2000);
                }
            } else {
                // They're not interested
                let matchEl = document.querySelectorAll('#datingContent .bg-gray-800')[index];
                if (matchEl) {
                    matchEl.style.opacity = '0.5';
                    matchEl.querySelector('.flex.gap-2').innerHTML = '<div class="text-center text-gray-500 py-2">No match 😔</div>';
                }
            }
        }
        
        function openPartnerModal() {
            if (!state.hasPartner || !state.partnerStats) return;
            
            let modal = document.getElementById('partnerModal');
            let content = document.getElementById('partnerDetails');
            let partner = state.partnerStats;
            let weeksStr = state.relationshipWeeks > 52 ? 
                `${Math.floor(state.relationshipWeeks / 52)} year${Math.floor(state.relationshipWeeks / 52) > 1 ? 's' : ''}, ${state.relationshipWeeks % 52} weeks` : 
                `${state.relationshipWeeks} weeks`;
            
            let bondLevel = partner.supportiveness >= 80 ? 'Deeply in Love' :
                           partner.supportiveness >= 60 ? 'Strong Bond' :
                           partner.supportiveness >= 40 ? 'Getting Closer' :
                           partner.supportiveness >= 20 ? 'Still Learning Each Other' : 'Rocky';
            
            // Check what traits are revealed
            let traits = partner.traitsRevealed || { job: true, income: true, trait: true, flaw: true, attractiveness: true }; // Old partners show all
            
            // Get revealed or hidden values
            let jobText = traits.job ? (partner.job || 'Unknown') : '❓ Still getting to know...';
            let incomeText = traits.income ? 
                (partner.income >= 500 ? '💰 Well off' : partner.income >= 200 ? '💵 Comfortable' : '💸 Modest') : 
                '❓ Not sure yet...';
            
            let traitText = traits.trait ? (partner.personality?.trait || 'Kind') : '❓ Unknown';
            let traitDesc = traits.trait ? (PARTNER_TRAITS[partner.personality?.trait]?.desc || 'A good quality') : 'Spend more time together to find out';
            
            let flawText = traits.flaw ? (partner.personality?.flaw || 'Quirky') : '❓ Unknown';
            let flawDesc = traits.flaw ? (PARTNER_FLAWS[partner.personality?.flaw]?.desc || 'Nobody is perfect') : 'May take months to discover...';
            
            // Calculate how much is still hidden
            let hiddenCount = Object.values(traits).filter(v => !v).length;
            let revelationHint = hiddenCount > 0 ? 
                `<div class="p-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg mt-3 text-xs text-yellow-400">
                    ⏳ Still ${hiddenCount} thing${hiddenCount > 1 ? 's' : ''} to learn about ${partner.name}. Keep spending time together!
                </div>` : '';
            
            content.innerHTML = `
                <div class="text-center mb-4">
                    <div class="text-4xl mb-2">${state.married ? '💍' : '💕'}</div>
                    <div class="text-xl text-white font-bold">${state.partnerName}</div>
                    <div class="text-sm text-pink-400">${state.married ? 'Spouse' : 'Partner'} • ${weeksStr} together</div>
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-gray-800 rounded-lg text-center">
                        <div class="text-2xl mb-1">${partner.icon || (partner.gender === 'female' ? '👩' : '👨')}</div>
                        <div class="text-xs text-gray-400">Age</div>
                        <div class="text-white">${Math.floor(partner.age || (getAge() + Math.random() * 4 - 2))}</div>
                    </div>
                    <div class="p-3 bg-gray-800 rounded-lg text-center">
                        <div class="text-2xl mb-1">💼</div>
                        <div class="text-xs text-gray-400">Occupation</div>
                        <div class="text-white text-sm ${!traits.job ? 'text-gray-500' : ''}">${jobText}</div>
                    </div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-xs text-gray-500 mb-1">Financial Situation</div>
                    <div class="${!traits.income ? 'text-gray-500' : 'text-white'}">${incomeText}</div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-gray-400 text-sm mb-2">Personality</div>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="px-2 py-1 ${traits.trait ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-500'} rounded text-xs">${traitText}</span>
                            <span class="text-xs text-gray-400">${traitDesc}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="px-2 py-1 ${traits.flaw ? 'bg-orange-900/50 text-orange-400' : 'bg-gray-700 text-gray-500'} rounded text-xs">${flawText}</span>
                            <span class="text-xs text-gray-400">${flawDesc}</span>
                        </div>
                    </div>
                </div>
                
                ${revelationHint}
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-gray-400 text-sm mb-2">Weekly Effects on You</div>
                    <div class="grid grid-cols-2 gap-1 text-xs">
                        ${(() => {
                            let effects = getPartnerWeeklyEffects();
                            let effectsHtml = '';
                            if (effects.happiness) effectsHtml += `<div class="${effects.happiness > 0 ? 'text-green-400' : 'text-red-400'}">${effects.happiness > 0 ? '+' : ''}${effects.happiness.toFixed(1)} Happiness</div>`;
                            if (effects.stress) effectsHtml += `<div class="${effects.stress < 0 ? 'text-green-400' : 'text-red-400'}">${effects.stress > 0 ? '+' : ''}${effects.stress.toFixed(1)} Stress</div>`;
                            if (effects.health) effectsHtml += `<div class="${effects.health > 0 ? 'text-green-400' : 'text-red-400'}">${effects.health > 0 ? '+' : ''}${effects.health.toFixed(1)} Health</div>`;
                            if (effects.energy) effectsHtml += `<div class="${effects.energy > 0 ? 'text-green-400' : 'text-red-400'}">${effects.energy > 0 ? '+' : ''}${effects.energy.toFixed(1)} Energy</div>`;
                            if (effects.money) effectsHtml += `<div class="${effects.money > 0 ? 'text-green-400' : 'text-red-400'}">${effects.money > 0 ? '+' : ''}$${Math.floor(effects.money)}/wk</div>`;
                            return effectsHtml || '<div class="text-gray-500">Balanced relationship</div>';
                        })()}
                    </div>
                    <div class="text-xs text-gray-500 mt-2">Effects modified by bond level (${partner.supportiveness}%)</div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">Relationship Bond</span>
                        <span class="text-pink-400">${partner.supportiveness}%</span>
                    </div>
                    <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-pink-600 to-red-400 rounded-full" style="width: ${partner.supportiveness}%"></div>
                    </div>
                    <div class="text-xs text-center mt-1 text-pink-300">${bondLevel}</div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mt-3">
                    <div class="p-3 bg-gray-800 rounded-lg">
                        <div class="text-xs text-gray-400">Their Attractiveness</div>
                        <div class="text-lg text-pink-400">${partner.attractiveness || 50}/100</div>
                    </div>
                    <div class="p-3 bg-gray-800 rounded-lg">
                        <div class="text-xs text-gray-400">Their Income</div>
                        <div class="text-lg text-green-400">$${(partner.income || 0) * 4}/mo</div>
                    </div>
                </div>
                
                ${state.relationship?.children > 0 ? `
                <div class="p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg mt-3">
                    <div class="text-blue-400 text-sm">👶 Children Together: ${state.relationship.children}</div>
                </div>
                ` : ''}
                
                ${state.married ? '' : `
                <div class="mt-4 p-3 bg-pink-900/20 border border-pink-500/30 rounded-lg">
                    <div class="text-pink-400 text-xs">💡 Keep spending time together and making good choices to strengthen your bond!</div>
                </div>
                `}
                
                <div class="mt-4 pt-4 border-t border-gray-700">
                    <button onclick="initiateBreakup()" class="w-full py-2 bg-red-900/50 hover:bg-red-800 text-red-400 hover:text-white rounded transition-colors text-sm">
                        ${state.married ? '💔 File for Divorce' : '💔 Break Up'}
                    </button>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function initiateBreakup() {
            let isMarried = state.married;
            let hasKids = state.relationship?.children > 0;
            let partnerName = state.partnerName;
            
            let warningText = isMarried ? 
                `Are you sure you want to divorce ${partnerName}?\n\n` +
                `Consequences:\n` +
                `• -40 Happiness\n` +
                `• +30 Stress\n` +
                `• Legal fees: $${hasKids ? '5,000' : '2,000'}\n` +
                (hasKids ? `• Custody arrangements for ${state.relationship.children} child${state.relationship.children > 1 ? 'ren' : ''}\n` : '') +
                `• Asset division (lose 50% of savings)\n\n` +
                `This cannot be undone.` :
                `Are you sure you want to break up with ${partnerName}?\n\n` +
                `Consequences:\n` +
                `• -30 Happiness\n` +
                `• +20 Stress\n\n` +
                `This cannot be undone.`;
            
            if (!confirm(warningText)) return;
            
            closePartnerModal();
            
            if (isMarried) {
                // Divorce process
                let legalFees = hasKids ? 5000 : 2000;
                state.money -= legalFees;
                state.money = Math.floor(state.money * 0.5); // Lose half in divorce
                state.happiness -= 40;
                state.stress += 30;
                
                if (hasKids) {
                    // Custody - 50% chance of primary custody
                    if (Math.random() < 0.5) {
                        addLog(`Divorced ${partnerName}. Got primary custody.`);
                    } else {
                        // Shared custody - kids stay but see other parent
                        addLog(`Divorced ${partnerName}. Shared custody arrangement.`);
                    }
                } else {
                    addLog(`Divorced ${partnerName}`);
                }
                
                state.married = false;
            } else {
                // Simple breakup
                state.happiness -= 30;
                state.stress += 20;
                addLog(`Broke up with ${partnerName}`);
            }
            
            // Reset relationship state
            state.hasPartner = false;
            state.partnerName = null;
            state.partnerStats = null;
            state.relationshipWeeks = 0;
            state.relationship.datesCount = 0;
            state.lastRelationshipWeek = state.week; // Track for loneliness
            
            updateUI();
            
            // Show aftermath event
            displayEvent({
                category: "💔 Heartbreak",
                title: isMarried ? "Divorce Finalized" : "It's Over",
                desc: isMarried ? 
                    `The papers are signed. After everything you've been through with ${partnerName}, it's officially over. The house feels empty.` :
                    `You and ${partnerName} went your separate ways. It hurts, but sometimes things just don't work out.`,
                choices: [
                    {
                        text: "Focus on yourself",
                        effect: () => {
                            state.stress -= 10;
                            return { icon: "💪", text: "Time to focus on your own growth.", stats: "-10 Stress" };
                        }
                    },
                    {
                        text: "Reach out to friends",
                        effect: () => {
                            state.happiness += 10;
                            state.skills.social += 2;
                            return { icon: "👥", text: "Your support network helps you through this.", stats: "+10 Happiness, +2 Social" };
                        }
                    },
                    {
                        text: isMarried ? "Drink away the pain" : "Wallow in sadness",
                        effect: () => {
                            state.happiness -= 10;
                            state.health -= 5;
                            state.stress -= 20;
                            return { icon: "🥃", text: "Not the healthiest coping mechanism...", stats: "-10 Happy, -5 Health, -20 Stress" };
                        }
                    }
                ]
            });
        }
        
        function closePartnerModal() {
            document.getElementById('partnerModal').classList.add('hidden');
        }
        
        // ============ CREDIT/BUDGET MODAL ============
        function openCreditModal() {
            let modal = document.getElementById('creditModal');
            let content = document.getElementById('creditContent');
            
            let monthlyIncome = state.weeklyIncome * 4;
            let monthlyExpenses = state.weeklyExpenses * 4;
            let monthlyNet = monthlyIncome - monthlyExpenses;
            
            let totalDebt = (state.debt || 0) + (state.creditCardDebt || 0);
            let studentLoans = state.studentLoans || 0;
            let studentLoanAPR = state.studentLoanAPR || 6.5;
            let borrowedThisYear = state.studentLoansBorrowedThisYear || 0;
            let maxPerYear = state.maxStudentLoansPerYear || 12500;
            let remainingBorrowable = maxPerYear - borrowedThisYear;
            let inSchool = state.phase === 'education' && ['university', 'community_college', 'trade_school'].includes(state.educationType);
            
            // Calculate monthly interest
            let monthlyInterest = studentLoans > 0 ? Math.ceil(studentLoans * (studentLoanAPR / 100 / 12)) : 0;
            
            content.innerHTML = `
                <div class="p-3 bg-gray-800 rounded-lg">
                    <div class="text-white font-medium mb-2">📊 Monthly Summary</div>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Income:</span>
                            <span class="text-green-400">+$${monthlyIncome.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Expenses:</span>
                            <span class="text-red-400">-$${monthlyExpenses.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between border-t border-gray-700 pt-1 mt-1">
                            <span class="text-white">Net Cash Flow:</span>
                            <span class="${monthlyNet >= 0 ? 'text-green-400' : 'text-red-400'}">${monthlyNet >= 0 ? '+' : ''}$${monthlyNet.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-white font-medium mb-2">💰 Assets & Debts</div>
                    <div class="space-y-1 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Cash:</span>
                            <span class="${state.money >= 0 ? 'text-green-400' : 'text-red-400'}">$${state.money.toLocaleString()}</span>
                        </div>
                        ${state.finances?.investments > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Investments:</span>
                            <span class="text-blue-400">$${state.finances.investments.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        ${studentLoans > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Student Loans:</span>
                            <span class="text-orange-400">-$${studentLoans.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between text-xs">
                            <span class="text-gray-500">└ Interest Rate:</span>
                            <span class="text-orange-300">${studentLoanAPR}% APR (~$${monthlyInterest}/mo)</span>
                        </div>
                        ` : ''}
                        ${state.creditCardDebt > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Credit Card Debt:</span>
                            <span class="text-red-400">-$${state.creditCardDebt.toLocaleString()}</span>
                        </div>
                        ` : ''}
                        ${state.debt > 0 ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Other Debt:</span>
                            <span class="text-red-400">-$${state.debt.toLocaleString()}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                ${inSchool ? `
                <div class="p-3 bg-orange-900/30 border border-orange-500/30 rounded-lg mt-3">
                    <div class="text-orange-400 font-medium mb-2">🎓 Student Loans</div>
                    <div class="text-sm space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Current Balance:</span>
                            <span class="text-orange-400">$${studentLoans.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Interest Rate:</span>
                            <span class="text-yellow-400">${studentLoanAPR}% APR</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Borrowed This Year:</span>
                            <span class="text-gray-300">$${borrowedThisYear.toLocaleString()} / $${maxPerYear.toLocaleString()}</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div class="h-full bg-orange-500 rounded-full" style="width: ${(borrowedThisYear / maxPerYear) * 100}%"></div>
                        </div>
                        <div class="text-xs text-gray-500">
                            ⚠️ Interest accrues while in school. Payments start after graduation.
                        </div>
                        
                        ${remainingBorrowable > 0 ? `
                        <div class="border-t border-orange-500/30 pt-3 mt-3">
                            <div class="text-gray-300 text-sm mb-2">Borrow More (up to $${remainingBorrowable.toLocaleString()} this year)</div>
                            <div class="grid grid-cols-3 gap-2">
                                <button onclick="borrowStudentLoan(1000)" ${remainingBorrowable >= 1000 ? '' : 'disabled'} 
                                    class="py-2 ${remainingBorrowable >= 1000 ? 'bg-orange-600 hover:bg-orange-500' : 'bg-gray-600 opacity-50'} text-white rounded text-sm transition-colors">
                                    $1,000
                                </button>
                                <button onclick="borrowStudentLoan(2500)" ${remainingBorrowable >= 2500 ? '' : 'disabled'}
                                    class="py-2 ${remainingBorrowable >= 2500 ? 'bg-orange-600 hover:bg-orange-500' : 'bg-gray-600 opacity-50'} text-white rounded text-sm transition-colors">
                                    $2,500
                                </button>
                                <button onclick="borrowStudentLoan(5000)" ${remainingBorrowable >= 5000 ? '' : 'disabled'}
                                    class="py-2 ${remainingBorrowable >= 5000 ? 'bg-orange-600 hover:bg-orange-500' : 'bg-gray-600 opacity-50'} text-white rounded text-sm transition-colors">
                                    $5,000
                                </button>
                            </div>
                        </div>
                        ` : `
                        <div class="border-t border-orange-500/30 pt-3 mt-3">
                            <div class="text-red-400 text-sm">⚠️ You've reached your annual borrowing limit ($${maxPerYear.toLocaleString()}/year)</div>
                        </div>
                        `}
                    </div>
                </div>
                ` : studentLoans > 0 ? `
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-orange-400 font-medium mb-2">🎓 Student Loans</div>
                    <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Balance:</span>
                            <span class="text-orange-400">$${studentLoans.toLocaleString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Interest Rate:</span>
                            <span class="text-yellow-400">${studentLoanAPR}% APR</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Monthly Interest:</span>
                            <span class="text-red-400">~$${monthlyInterest}</span>
                        </div>
                        ${state.employed ? `
                        <div class="flex justify-between">
                            <span class="text-gray-400">Monthly Payment:</span>
                            <span class="text-green-400">~$${Math.max(50, Math.ceil(studentLoans / 120)).toLocaleString()}</span>
                        </div>
                        <div class="text-xs text-gray-500 mt-2">Payments auto-deducted monthly while employed.</div>
                        ` : `
                        <div class="text-xs text-yellow-400 mt-2">⚠️ Payments paused - interest still accrues!</div>
                        `}
                    </div>
                </div>
                ` : ''}
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-white font-medium mb-2">💳 Credit Card</div>
                    ${state.hasCreditCard ? `
                        <div class="text-sm">
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-400">Credit Limit:</span>
                                <span class="text-cyan-400">$${(state.creditLimit || 2000).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-400">Balance:</span>
                                <span class="text-red-400">$${(state.creditCardDebt || 0).toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">APR:</span>
                                <span class="text-yellow-400">${state.creditAPR || 22}%</span>
                            </div>
                            <div class="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                                <div class="h-full bg-red-500 rounded-full" style="width: ${((state.creditCardDebt || 0) / (state.creditLimit || 2000)) * 100}%"></div>
                            </div>
                            <div class="text-xs text-gray-500 mt-1">Available: $${((state.creditLimit || 2000) - (state.creditCardDebt || 0)).toLocaleString()}</div>
                        </div>
                    ` : `
                        <div class="text-sm text-gray-400 mb-3">No credit card yet.</div>
                        <button onclick="applyForCreditCard()" class="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors">
                            Apply for Credit Card
                        </button>
                    `}
                </div>
                
                <div class="p-3 bg-gray-800 rounded-lg mt-3">
                    <div class="text-white font-medium mb-2">📈 Investments</div>
                    ${state.finances?.investmentType ? `
                        <div class="text-sm mb-3">
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-400">Portfolio:</span>
                                <span class="text-blue-400">${INVESTMENT_TYPES[state.finances.investmentType].icon} ${INVESTMENT_TYPES[state.finances.investmentType].name}</span>
                            </div>
                            <div class="flex justify-between mb-1">
                                <span class="text-gray-400">Balance:</span>
                                <span class="text-green-400">$${state.finances.investments.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Risk Level:</span>
                                <span class="${state.finances.investmentType === 'conservative' ? 'text-green-400' : state.finances.investmentType === 'moderate' ? 'text-yellow-400' : state.finances.investmentType === 'aggressive' ? 'text-orange-400' : 'text-red-400'}">${state.finances.investmentType === 'conservative' ? 'Low' : state.finances.investmentType === 'moderate' ? 'Medium' : state.finances.investmentType === 'aggressive' ? 'High' : 'Very High'}</span>
                            </div>
                            <div class="text-xs text-gray-500 mt-2">Expected return: ~${(INVESTMENT_TYPES[state.finances.investmentType].weeklyReturn * 52 * 100).toFixed(1)}%/year</div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="investMore()" class="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm transition-colors" ${state.money < 100 ? 'disabled style="opacity:0.5"' : ''}>
                                + Invest More
                            </button>
                            <button onclick="withdrawInvestment()" class="flex-1 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-sm transition-colors">
                                - Withdraw
                            </button>
                        </div>
                        <button onclick="changeInvestmentStrategy()" class="w-full mt-2 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors">
                            Change Strategy
                        </button>
                    ` : `
                        <div class="text-sm text-gray-400 mb-3">No investments yet. ${state.employed ? 'Start building wealth!' : 'Get a job first to start investing.'}</div>
                        ${state.employed ? `
                            <div class="space-y-2">
                                ${Object.entries(INVESTMENT_TYPES).map(([key, inv]) => `
                                    <button onclick="startInvesting('${key}')" class="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex justify-between items-center" ${state.money < 500 ? 'disabled style="opacity:0.5"' : ''}>
                                        <span>${inv.icon} ${inv.name}</span>
                                        <span class="text-xs text-gray-400">~${(inv.weeklyReturn * 52 * 100).toFixed(0)}%/yr</span>
                                    </button>
                                `).join('')}
                            </div>
                            <div class="text-xs text-gray-500 mt-2">Minimum investment: $500</div>
                        ` : ''}
                    `}
                </div>
                
                ${(totalDebt > 5000 || state.money < -5000) && !state.bankruptcyFiled ? `
                <div class="p-3 bg-red-900/30 border border-red-500/30 rounded-lg mt-3">
                    <div class="text-red-400 font-medium mb-2">⚠️ Drowning in Debt?</div>
                    <div class="text-sm text-gray-400 mb-3">
                        Bankruptcy can wipe most debts, but has serious consequences. Student loans cannot be discharged.
                    </div>
                    <button onclick="considerBankruptcy()" class="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
                        Consider Bankruptcy
                    </button>
                </div>
                ` : ''}
                
                ${state.bankruptcyFiled ? `
                <div class="p-3 bg-orange-900/30 border border-orange-500/30 rounded-lg mt-3">
                    <div class="text-orange-400 text-sm">⚠️ Bankruptcy on record (${7 - Math.floor((state.totalWeeks - state.bankruptcyWeek) / 52)} years remaining)</div>
                    <div class="text-xs text-gray-500">Limited credit access, harder to get loans/housing</div>
                </div>
                ` : ''}
            `;
            
            modal.classList.remove('hidden');
        }
        
        function closeCreditModal() {
            document.getElementById('creditModal').classList.add('hidden');
        }
        
        function applyForCreditCard() {
            // Credit score based on financial history
            let creditScore = 600;
            if (state.employed) creditScore += 50;
            if (state.education === 'university') creditScore += 30;
            if (state.money > 5000) creditScore += 40;
            if (state.money < 0) creditScore -= 50;
            if (state.debt > 0) creditScore -= 30;
            if (state.bankruptcyFiled) creditScore -= 200;
            
            creditScore = Math.max(300, Math.min(850, creditScore));
            
            let approved = creditScore >= 550 && !state.bankruptcyFiled;
            let limit = Math.floor((creditScore - 400) * 10);
            limit = Math.max(500, Math.min(10000, limit));
            let apr = Math.max(12, 30 - Math.floor(creditScore / 30));
            
            if (approved) {
                state.hasCreditCard = true;
                state.creditLimit = limit;
                state.creditCardDebt = 0;
                state.creditAPR = apr;
                addLog(`Approved for $${limit} credit card at ${apr}% APR`);
                alert(`✅ Approved!\n\nCredit Limit: $${limit.toLocaleString()}\nAPR: ${apr}%\n\nUse responsibly!`);
            } else {
                addLog("Credit card application denied");
                alert(`❌ Application Denied\n\nCredit Score: ${creditScore}\nReason: ${state.bankruptcyFiled ? 'Recent bankruptcy' : 'Insufficient credit history/income'}\n\nTry improving your financial situation first.`);
            }
            
            openCreditModal(); // Refresh
        }
        
        function borrowStudentLoan(amount) {
            // Check if in school
            let inSchool = state.phase === 'education' && ['university', 'community_college', 'trade_school'].includes(state.educationType);
            if (!inSchool) {
                alert("Student loans are only available while enrolled in school.");
                return;
            }
            
            // Check annual limit
            let borrowedThisYear = state.studentLoansBorrowedThisYear || 0;
            let maxPerYear = state.maxStudentLoansPerYear || 12500;
            let remaining = maxPerYear - borrowedThisYear;
            
            if (amount > remaining) {
                alert(`You can only borrow $${remaining.toLocaleString()} more this academic year.\n\nAnnual limit: $${maxPerYear.toLocaleString()}`);
                return;
            }
            
            // Process the loan
            state.money += amount;
            state.studentLoans += amount;
            state.studentLoansBorrowedThisYear = borrowedThisYear + amount;
            
            let totalLoans = state.studentLoans;
            let apr = state.studentLoanAPR || 6.5;
            
            playSound('coin');
            addLog(`Borrowed $${amount.toLocaleString()} in student loans (Total: $${totalLoans.toLocaleString()})`);
            
            alert(`💵 Student Loan Approved\n\n` +
                  `Amount: $${amount.toLocaleString()}\n` +
                  `Total Student Debt: $${totalLoans.toLocaleString()}\n` +
                  `Interest Rate: ${apr}% APR\n\n` +
                  `⚠️ Remember: Student loans cannot be discharged in bankruptcy and interest accrues while in school!`);
            
            openCreditModal(); // Refresh
            updateUI();
        }
        
        // ============ INVESTMENT FUNCTIONS ============
        function startInvesting(type) {
            if (state.money < 500) {
                alert("You need at least $500 to start investing.");
                return;
            }
            
            let inv = INVESTMENT_TYPES[type];
            let amount = prompt(`How much would you like to invest in ${inv.name}?\n\nYou have: $${state.money.toLocaleString()}\nMinimum: $500`, "500");
            
            if (!amount) return;
            amount = parseInt(amount);
            
            if (isNaN(amount) || amount < 500) {
                alert("Minimum investment is $500.");
                return;
            }
            
            if (amount > state.money) {
                alert("You don't have that much money.");
                return;
            }
            
            state.money -= amount;
            state.finances.investmentType = type;
            state.finances.investments = amount;
            addLog(`Started investing $${amount.toLocaleString()} in ${inv.name}`);
            
            alert(`✅ Investment Started!\n\n${inv.icon} ${inv.name}\nAmount: $${amount.toLocaleString()}\nExpected Return: ~${(inv.weeklyReturn * 52 * 100).toFixed(1)}%/year\nRisk: ${type === 'conservative' ? 'Low' : type === 'moderate' ? 'Medium' : type === 'aggressive' ? 'High' : 'Very High'}`);
            
            openCreditModal(); // Refresh
            updateUI();
        }
        
        function investMore() {
            if (!state.finances.investmentType) return;
            if (state.money < 100) {
                alert("You need at least $100 to add to your investments.");
                return;
            }
            
            let inv = INVESTMENT_TYPES[state.finances.investmentType];
            let amount = prompt(`Add to your ${inv.name} portfolio.\n\nCurrent balance: $${state.finances.investments.toLocaleString()}\nYou have: $${state.money.toLocaleString()}\nMinimum: $100`, "500");
            
            if (!amount) return;
            amount = parseInt(amount);
            
            if (isNaN(amount) || amount < 100) {
                alert("Minimum additional investment is $100.");
                return;
            }
            
            if (amount > state.money) {
                alert("You don't have that much money.");
                return;
            }
            
            state.money -= amount;
            state.finances.investments += amount;
            addLog(`Added $${amount.toLocaleString()} to investments`);
            
            alert(`✅ Investment Added!\n\nNew balance: $${state.finances.investments.toLocaleString()}`);
            
            openCreditModal(); // Refresh
            updateUI();
        }
        
        function withdrawInvestment() {
            if (!state.finances.investmentType || state.finances.investments <= 0) return;
            
            let inv = INVESTMENT_TYPES[state.finances.investmentType];
            let amount = prompt(`Withdraw from your ${inv.name} portfolio.\n\nCurrent balance: $${state.finances.investments.toLocaleString()}\nYou have: $${state.money.toLocaleString()} in cash\n\nEnter amount (or "all" to withdraw everything):`, "1000");
            
            if (!amount) return;
            
            if (amount.toLowerCase() === 'all') {
                amount = state.finances.investments;
            } else {
                amount = parseInt(amount);
            }
            
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            
            if (amount > state.finances.investments) {
                amount = state.finances.investments;
            }
            
            state.finances.investments -= amount;
            state.money += amount;
            addLog(`Withdrew $${amount.toLocaleString()} from investments`);
            
            // Close account if empty
            if (state.finances.investments <= 0) {
                state.finances.investmentType = null;
                state.finances.investments = 0;
                alert(`✅ Withdrawal Complete!\n\nWithdrew: $${amount.toLocaleString()}\nInvestment account closed.`);
            } else {
                alert(`✅ Withdrawal Complete!\n\nWithdrew: $${amount.toLocaleString()}\nRemaining balance: $${state.finances.investments.toLocaleString()}`);
            }
            
            openCreditModal(); // Refresh
            updateUI();
        }
        
        function changeInvestmentStrategy() {
            if (!state.finances.investmentType) return;
            
            let currentType = state.finances.investmentType;
            let currentInv = INVESTMENT_TYPES[currentType];
            
            let options = Object.entries(INVESTMENT_TYPES)
                .filter(([key]) => key !== currentType)
                .map(([key, inv], i) => `${i + 1}. ${inv.icon} ${inv.name} (~${(inv.weeklyReturn * 52 * 100).toFixed(0)}%/yr, ${key === 'conservative' ? 'Low' : key === 'moderate' ? 'Medium' : key === 'aggressive' ? 'High' : 'Very High'} risk)`)
                .join('\n');
            
            let choice = prompt(`Change investment strategy?\n\nCurrent: ${currentInv.icon} ${currentInv.name}\nBalance: $${state.finances.investments.toLocaleString()}\n\nAvailable strategies:\n${options}\n\nEnter number (1-3):`, "");
            
            if (!choice) return;
            choice = parseInt(choice);
            
            let newTypes = Object.keys(INVESTMENT_TYPES).filter(k => k !== currentType);
            if (choice < 1 || choice > newTypes.length) {
                alert("Invalid choice.");
                return;
            }
            
            let newType = newTypes[choice - 1];
            let newInv = INVESTMENT_TYPES[newType];
            
            state.finances.investmentType = newType;
            addLog(`Changed investment strategy to ${newInv.name}`);
            
            alert(`✅ Strategy Changed!\n\n${newInv.icon} ${newInv.name}\nBalance: $${state.finances.investments.toLocaleString()}\nExpected Return: ~${(newInv.weeklyReturn * 52 * 100).toFixed(1)}%/year`);
            
            openCreditModal(); // Refresh
            updateUI();
        }
        
        function considerBankruptcy() {
            let studentLoans = state.studentLoans || 0;
            let otherDebt = (state.debt || 0) + (state.creditCardDebt || 0) + (state.money < 0 ? Math.abs(state.money) : 0);
            
            let message = `⚠️ BANKRUPTCY WARNING ⚠️\n\n`;
            message += `Debts that WILL be discharged:\n`;
            message += `• Credit Card: $${(state.creditCardDebt || 0).toLocaleString()}\n`;
            message += `• Other Debts: $${(state.debt || 0).toLocaleString()}\n`;
            message += `• Negative Balance: $${(state.money < 0 ? Math.abs(state.money) : 0).toLocaleString()}\n\n`;
            
            if (studentLoans > 0) {
                message += `⚠️ Debts that WILL NOT be discharged:\n`;
                message += `• Student Loans: $${studentLoans.toLocaleString()}\n\n`;
            }
            
            message += `CONSEQUENCES:\n`;
            message += `• Bankruptcy stays on record for 7 years\n`;
            message += `• No new credit cards\n`;
            message += `• Harder to rent apartments\n`;
            message += `• Some employers check credit\n`;
            message += `• -30 Happiness, +20 Stress\n\n`;
            message += `Are you sure you want to file for bankruptcy?`;
            
            if (confirm(message)) {
                // File bankruptcy
                state.bankruptcyFiled = true;
                state.bankruptcyWeek = state.totalWeeks;
                
                // Discharge debts (except student loans)
                let discharged = (state.creditCardDebt || 0) + (state.debt || 0);
                if (state.money < 0) {
                    discharged += Math.abs(state.money);
                    state.money = 0;
                }
                
                state.creditCardDebt = 0;
                state.debt = 0;
                state.hasCreditCard = false;
                
                // Consequences
                state.happiness -= 30;
                state.stress += 20;
                
                addLog(`Filed for bankruptcy - $${discharged.toLocaleString()} discharged`);
                alert(`Bankruptcy filed.\n\n$${discharged.toLocaleString()} in debt discharged.\n${studentLoans > 0 ? `\n⚠️ Student loans of $${studentLoans.toLocaleString()} remain.` : ''}\n\nThis will affect your life for the next 7 years.`);
                
                openCreditModal(); // Refresh
                updateUI();
            }
        }
        
        function updateRelationshipsSummary() {
            let summary = [];
            
            // Primary relationships first
            if (state.hasPartner) summary.push(`💕 ${state.partnerName}`);
            if (state.relationship?.children > 0) {
                summary.push(`👶 ${state.relationship.children} ${state.relationship.children === 1 ? 'child' : 'children'}`);
            }
            
            // Friends
            if (state.friends && state.friends.length > 0) {
                let friendCount = state.friends.length;
                let closeFriends = state.friends.filter(f => f.bond >= 60).length;
                if (closeFriends > 0) {
                    summary.push(`👥 ${closeFriends} close friend${closeFriends > 1 ? 's' : ''}`);
                }
                if (friendCount > closeFriends) {
                    summary.push(`🤝 ${friendCount - closeFriends} friend${friendCount - closeFriends > 1 ? 's' : ''}`);
                }
            }
            
            // Education/career mentors
            if (state.university?.studyBuddy) summary.push(`📚 ${state.university.studyBuddy.split(' ')[0]}`);
            if (state.university?.professorMentor) summary.push(`🎓 ${state.university.professorMentor.name?.split(' ')[0] || 'Professor'}`);
            if (state.tradeSchool?.mentorName) summary.push(`🔧 ${state.tradeSchool.mentorName.split(' ')[0]}`);
            if (state.military?.squadMates > 0) summary.push(`🎖️ ${state.military.squadMates} squad mates`);
            
            // Network
            if (state.career?.networkContacts > 0) summary.push(`💼 ${state.career.networkContacts} contacts`);
            
            // Always show family (everyone has one)
            let familyWealth = state.characterTraits?.familyWealth || 5;
            let familyStatus = familyWealth >= 7 ? 'Supportive' : familyWealth >= 4 ? 'Close' : 'Distant';
            summary.push(`🏠 Family (${familyStatus})`);
            
            let el = document.getElementById('relationshipsSummary');
            el.innerHTML = summary.slice(0, 4).map(s => `<div class="text-gray-300">${s}</div>`).join('');
            if (summary.length > 4) {
                el.innerHTML += `<div class="text-gray-500 cursor-pointer hover:text-cyan-400">+${summary.length - 4} more...</div>`;
            }
        }

        // ============ FISHING MINI-GAME ============
        let fishingState = {
            location: null,
            casting: false,
            caught: null
        };
        
        function openFishingLocationModal() {
            let locationsHtml = Object.keys(FISHING_LOCATIONS).map(key => {
                let loc = FISHING_LOCATIONS[key];
                let canAccess = !loc.unlock || state.skills.fishing >= loc.unlock;
                let canAfford = state.money >= loc.cost;
                let enabled = canAccess && canAfford;
                
                let statusText = !canAccess ? `🔒 Need ${loc.unlock} fishing skill` :
                                !canAfford ? `💰 Need $${loc.cost}` : 
                                loc.cost > 0 ? `$${loc.cost}` : 'Free';
                
                return `
                    <button onclick="closeEducationModal(); goFishing('${key}')" 
                        class="w-full p-3 flex items-center justify-between rounded-lg transition-colors ${enabled ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-800/50 opacity-50 cursor-not-allowed'}"
                        ${!enabled ? 'disabled' : ''}>
                        <div class="flex items-center gap-3">
                            <span class="text-2xl">${loc.icon}</span>
                            <div class="text-left">
                                <div class="text-white">${loc.name}</div>
                                <div class="text-xs text-gray-500">Bonus: +${loc.bonus} to catch</div>
                            </div>
                        </div>
                        <div class="text-sm ${enabled ? 'text-green-400' : 'text-gray-500'}">${statusText}</div>
                    </button>
                `;
            }).join('');
            
            // Create modal content
            let modal = document.getElementById('educationModal');
            let content = document.getElementById('educationContent');
            let title = document.getElementById('eduModalTitle');
            
            title.innerText = '🎣 Go Fishing';
            content.innerHTML = `
                <div class="text-center mb-4">
                    <div class="text-gray-400 text-sm">Your Fishing Skill: <span class="text-cyan-400">${state.skills.fishing || 0}</span></div>
                    <div class="text-xs text-gray-500">Total Catches: ${state.fishing?.totalCatches || 0} | Best: ${state.fishing?.bestCatch ? FISH_TYPES[state.fishing.bestCatch]?.name : 'None yet'}</div>
                </div>
                <div class="space-y-2">
                    ${locationsHtml}
                </div>
                <div class="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <div class="text-blue-400 text-sm">💡 Tips</div>
                    <div class="text-xs text-gray-400 mt-1">
                        • Higher skill = bigger catch zone in minigame<br>
                        • Rare fish are worth more but harder to catch<br>
                        • Secret Spot unlocks at 50 fishing skill
                    </div>
                </div>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function goFishing(locationKey) {
            playSound('select');
            let location = FISHING_LOCATIONS[locationKey];
            if (!location) return;
            
            // Check if can afford
            if (state.money < location.cost) {
                alert(`Not enough money! Need $${location.cost} for ${location.name}`);
                return;
            }
            
            // Check if secret spot is unlocked
            if (location.unlock && state.skills.fishing < location.unlock) {
                alert(`Need ${location.unlock} fishing skill to access this spot!`);
                return;
            }
            
            state.money -= location.cost;
            fishingState.location = locationKey;
            fishingState.casting = false;
            fishingState.caught = null;
            
            showFishingScreen();
        }
        
        function showFishingScreen() {
            let modal = document.getElementById('fishingModal');
            let location = FISHING_LOCATIONS[fishingState.location];
            
            document.getElementById('fishingIcon').innerText = '🎣';
            document.getElementById('fishingTitle').innerText = `Fishing at ${location.name}`;
            document.getElementById('fishingContent').innerHTML = `
                <p>Your fishing skill: <span class="text-cyan-400">${state.skills.fishing}</span></p>
                <p class="text-xs text-gray-500 mt-1">Higher skill = better catches!</p>
            `;
            document.getElementById('fishingWater').innerText = '🌊';
            
            document.getElementById('fishingActions').innerHTML = `
                <button onclick="castLine()" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-lg">
                    🎣 Cast Your Line
                </button>
                <button onclick="closeFishing()" class="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors mt-2">
                    Pack Up & Leave
                </button>
            `;
            
            modal.classList.remove('hidden');
        }
        
        function castLine() {
            let location = FISHING_LOCATIONS[fishingState.location];
            
            document.getElementById('fishingWater').innerText = '🎣';
            document.getElementById('fishingContent').innerHTML = '<p class="text-lg">Waiting for a bite...</p>';
            document.getElementById('fishingActions').innerHTML = '<p class="text-gray-500 animate-pulse">...</p>';
            
            // Random wait time
            let waitTime = 1000 + Math.random() * 2000;
            
            setTimeout(() => {
                // Determine what's on the line
                let fishPool = location.fish;
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
        let tempFreeTimePriorities = {}; // Temporary priorities while editing
        
        function openFreeTimeModal() {
            let modal = document.getElementById('freeTimeModal');
            let activitiesDiv = document.getElementById('freeTimeActivities');
            activitiesDiv.innerHTML = '';
            
            // Copy current allocation and priorities to temp
            tempFreeTime = { ...state.freeTime };
            tempFreeTimePriorities = { ...state.freeTimePriorities };
            
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
            
            // Create activity controls - sorted by priority
            let sortedActivities = Object.keys(FREE_TIME_ACTIVITIES).sort((a, b) => {
                return (tempFreeTimePriorities[a] || 99) - (tempFreeTimePriorities[b] || 99);
            });
            
            sortedActivities.forEach(key => {
                let activity = FREE_TIME_ACTIVITIES[key];
                let available = activity.requires();
                let currentHours = tempFreeTime[key] || 0;
                let priority = tempFreeTimePriorities[key] || 99;
                
                let costPerHour = typeof activity.costPerHour === 'function' ? activity.costPerHour() : activity.costPerHour;
                let earningsPerHour = activity.earningsPerHour ? activity.earningsPerHour() : 0;
                let desc = typeof activity.desc === 'function' ? activity.desc() : activity.desc;
                
                // Determine priority color
                let priorityColor = priority <= 3 ? 'text-green-400 bg-green-900/30' : 
                                   priority <= 6 ? 'text-yellow-400 bg-yellow-900/30' : 
                                   priority <= 9 ? 'text-orange-400 bg-orange-900/30' : 
                                   'text-red-400 bg-red-900/30';
                
                let div = document.createElement('div');
                div.className = `p-3 rounded border ${available ? 'border-gray-600' : 'border-gray-700 opacity-50'}`;
                div.id = `activity-row-${key}`;
                div.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-2">
                            <div class="flex flex-col gap-0.5">
                                <button onclick="adjustPriority('${key}', -1)" class="w-5 h-4 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs leading-none" title="Higher priority (cut last)">▲</button>
                                <span id="priority-${key}" class="text-xs font-mono w-5 text-center px-1 rounded ${priorityColor}" title="Priority #${priority}">${priority}</span>
                                <button onclick="adjustPriority('${key}', 1)" class="w-5 h-4 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs leading-none" title="Lower priority (cut first)">▼</button>
                            </div>
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
        
        function adjustPriority(activity, delta) {
            let currentPriority = tempFreeTimePriorities[activity] || 99;
            let newPriority = Math.max(1, Math.min(Object.keys(FREE_TIME_ACTIVITIES).length, currentPriority + delta));
            
            if (newPriority === currentPriority) return;
            
            // Find activity that currently has the target priority and swap
            let swapActivity = Object.keys(tempFreeTimePriorities).find(key => 
                tempFreeTimePriorities[key] === newPriority
            );
            
            if (swapActivity) {
                tempFreeTimePriorities[swapActivity] = currentPriority;
            }
            tempFreeTimePriorities[activity] = newPriority;
            
            // Re-render the modal to show new order
            openFreeTimeModal();
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
            state.freeTimePriorities = { ...tempFreeTimePriorities };
            
            // Save targets (what the user wants when time is available)
            state.freeTimeTargets = { ...tempFreeTime };
            
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
        
        // Adjust free time allocation if max time changes - uses priority system
        function validateFreeTimeAllocation() {
            let maxTime = getAvailableFreeTime();
            let currentTotal = Object.values(state.freeTime).reduce((a, b) => a + b, 0);
            let targetTotal = Object.values(state.freeTimeTargets).reduce((a, b) => a + b, 0);
            
            // If we're over the limit, reduce activities by priority (lowest priority first)
            if (currentTotal > maxTime) {
                let excess = currentTotal - maxTime;
                
                // Sort activities by priority (highest number = lowest priority = cut first)
                let sortedByPriority = Object.keys(state.freeTime)
                    .filter(key => state.freeTime[key] > 0)
                    .sort((a, b) => (state.freeTimePriorities[b] || 99) - (state.freeTimePriorities[a] || 99));
                
                let cutActivities = [];
                
                // Cut from lowest priority activities first
                for (let key of sortedByPriority) {
                    if (excess <= 0) break;
                    
                    let currentHours = state.freeTime[key] || 0;
                    if (currentHours > 0) {
                        let cut = Math.min(currentHours, excess);
                        state.freeTime[key] = currentHours - cut;
                        excess -= cut;
                        
                        if (cut > 0) {
                            cutActivities.push(`${FREE_TIME_ACTIVITIES[key].icon}-${cut}h`);
                        }
                    }
                }
                
                // Notify player with details
                if (cutActivities.length > 0) {
                    addLog(`⏰ Schedule adjusted (${maxTime} hrs available): ${cutActivities.join(', ')}`);
                }
            }
            // If we have more time available, try to restore activities by priority (highest priority first)
            else if (currentTotal < maxTime && targetTotal > currentTotal) {
                let available = maxTime - currentTotal;
                
                // Sort activities by priority (lowest number = highest priority = restore first)
                let sortedByPriority = Object.keys(state.freeTimeTargets)
                    .filter(key => {
                        let target = state.freeTimeTargets[key] || 0;
                        let current = state.freeTime[key] || 0;
                        let activity = FREE_TIME_ACTIVITIES[key];
                        // Only restore if below target and activity is still available
                        return target > current && activity.requires();
                    })
                    .sort((a, b) => (state.freeTimePriorities[a] || 99) - (state.freeTimePriorities[b] || 99));
                
                let restoredActivities = [];
                
                // Restore highest priority activities first
                for (let key of sortedByPriority) {
                    if (available <= 0) break;
                    
                    let currentHours = state.freeTime[key] || 0;
                    let targetHours = state.freeTimeTargets[key] || 0;
                    let deficit = targetHours - currentHours;
                    
                    if (deficit > 0) {
                        let restore = Math.min(deficit, available);
                        state.freeTime[key] = currentHours + restore;
                        available -= restore;
                        
                        if (restore > 0) {
                            restoredActivities.push(`${FREE_TIME_ACTIVITIES[key].icon}+${restore}h`);
                        }
                    }
                }
                
                // Notify player with details
                if (restoredActivities.length > 0) {
                    addLog(`⏰ Time freed up! Restored: ${restoredActivities.join(', ')}`);
                }
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
