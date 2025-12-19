 const game = {
            state: {
                level: 1,
                blueScore: 0,
                redScore: 0,
                // Position 0 is center. -5 is Blue Win (left), +5 is Red Win (right)
                position: 0, 
                maxPosition: 5,
                blueProblem: null,
                redProblem: null,
                isProcessing: false
            },

            start: function(level) {
                this.state.level = level;
                this.state.blueScore = 0;
                this.state.redScore = 0;
                this.state.position = 0;
                
                document.getElementById('levelSelect').style.display = 'none';
                document.getElementById('gameArea').classList.add('active');
                
                this.updateDisplay();
                this.generateProblems();
            },

            generateProblems: function() {
                this.state.blueProblem = this.createMathProblem(this.state.level);
                this.state.redProblem = this.createMathProblem(this.state.level);
                
                document.getElementById('blueProblem').textContent = this.state.blueProblem.question;
                document.getElementById('redProblem').textContent = this.state.redProblem.question;
            },

            createMathProblem: function(level) {
                // Helper for random integers
                const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

                if (level === 1) {
                    // Level 1: Mult/Div
                    const isMult = Math.random() > 0.5;
                    if (isMult) {
                        const a = rand(2, 12);
                        const b = rand(2, 12);
                        return { question: `${a} × ${b}`, answer: a * b };
                    } else {
                        const b = rand(2, 10);
                        const ans = rand(2, 12);
                        const a = b * ans; // Ensure clean division
                        return { question: `${a} ÷ ${b}`, answer: ans };
                    }
                } else if (level === 2) {
                    // Level 2: Quadratic D = b^2 - 4ac
                    // Keep numbers small to avoid massive calculations
                    const a = rand(1, 5);
                    const b = rand(-8, 8);
                    const c = rand(-5, 5);
                    const discriminant = (b * b) - (4 * a * c);
                    return { 
                        question: `D = ?\n(a=${a}, b=${b}, c=${c})`, 
                        answer: discriminant 
                    };
                } else {
                    // Level 3: Linear Function f(x)
                    const a = rand(-5, 5);
                    const b = rand(-10, 10);
                    const x = rand(-5, 5);
                    const res = (a * x) + b;
                    // Format signs nicely
                    const sign = b >= 0 ? '+' : '';
                    return { 
                        question: `f(${x}) = ?\nf(x) = ${a}x ${sign} ${b}`, 
                        answer: res 
                    };
                }
            },

            input: function(team, val) {
                const el = document.getElementById(team + 'Answer');
                if (val === 'del') {
                    el.value = el.value.slice(0, -1);
                } else if (val === '-') {
                    if (el.value === '') el.value = '-';
                } else {
                    el.value += val;
                }
            },

            submit: function(team) {
                if (this.state.isProcessing) return; // Prevent double clicks

                const inputEl = document.getElementById(team + 'Answer');
                const feedbackEl = document.getElementById(team + 'Feedback');
                const val = inputEl.value.trim();
                
                if (val === '' || val === '-') return;

                const userAns = parseInt(val);
                const correctAns = team === 'blue' ? this.state.blueProblem.answer : this.state.redProblem.answer;

                if (userAns === correctAns) {
                    // CORRECT
                    feedbackEl.textContent = "Correct! Pulling...";
                    feedbackEl.className = "feedback correct-anim";
                    
                    if (team === 'blue') {
                        this.state.blueScore++;
                        this.state.position--; // Moves Left (Blue side)
                    } else {
                        this.state.redScore++;
                        this.state.position++; // Moves Right (Red side)
                    }

                    this.state.isProcessing = true;
                    this.updateDisplay();

                    // Check win condition or reset
                    setTimeout(() => {
                        if (Math.abs(this.state.position) >= this.state.maxPosition) {
                            this.gameOver(team);
                        } else {
                            // Reset for next round
                            inputEl.value = '';
                            feedbackEl.textContent = '';
                            feedbackEl.className = "feedback";
                            
                            if (team === 'blue') {
                                this.state.blueProblem = this.createMathProblem(this.state.level);
                                document.getElementById('blueProblem').textContent = this.state.blueProblem.question;
                            } else {
                                this.state.redProblem = this.createMathProblem(this.state.level);
                                document.getElementById('redProblem').textContent = this.state.redProblem.question;
                            }
                            this.state.isProcessing = false;
                        }
                    }, 1000);

                } else {
                    // INCORRECT
                    feedbackEl.textContent = "Wrong! Try again.";
                    feedbackEl.className = "feedback wrong-anim";
                    inputEl.value = '';
                    setTimeout(() => {
                        feedbackEl.textContent = '';
                        feedbackEl.className = "feedback";
                    }, 1500);
                }
            },

            updateDisplay: function() {
                document.getElementById('blueScore').textContent = this.state.blueScore;
                document.getElementById('redScore').textContent = this.state.redScore;

                // LOGIC FOR ROPE MOVEMENT
                // Max movement is roughly 45% of container width to keep it visible
                const percentageShift = (this.state.position / this.state.maxPosition) * 45;
                
                const physicsLayer = document.getElementById('physicsLayer');
                physicsLayer.style.transform = `translateX(${percentageShift}%)`;
            },

            gameOver: function(winner) {
                const modal = document.getElementById('gameOver');
                const title = document.getElementById('winnerText');
                const score = document.getElementById('finalScore');

                if (winner === 'blue') {
                    title.textContent = "🎉 Blue Team Wins!";
                    title.style.color = "#4c63d2";
                } else {
                    title.textContent = "🎉 Red Team Wins!";
                    title.style.color = "#f5576c";
                }
                score.textContent = `Blue ${this.state.blueScore} - ${this.state.redScore} Red`;
                modal.classList.add('active');
            },

            reset: function() {
                document.getElementById('gameOver').classList.remove('active');
                document.getElementById('gameArea').classList.remove('active');
                document.getElementById('levelSelect').style.display = 'block';
                
                // Clear inputs
                document.getElementById('blueAnswer').value = '';
                document.getElementById('redAnswer').value = '';
                document.getElementById('blueFeedback').textContent = '';
                document.getElementById('redFeedback').textContent = '';
                this.state.isProcessing = false;
            }
        };