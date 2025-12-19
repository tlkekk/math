let gameState = {
            level: 1,
            blueScore: 0,
            redScore: 0,
            position: 0,
            maxPosition: 5,
            blueCurrentProblem: null,
            redCurrentProblem: null
        };

        function startGame(level) {
            gameState.level = level;
            gameState.blueScore = 0;
            gameState.redScore = 0;
            gameState.position = 0;
            
            document.getElementById('levelSelect').style.display = 'none';
            document.getElementById('gameArea').classList.add('active');
            document.getElementById('currentLevel').textContent = level;
            
            updateDisplay();
            generateProblems();
        }

        function generateProblems() {
            gameState.blueCurrentProblem = generateProblem(gameState.level);
            gameState.redCurrentProblem = generateProblem(gameState.level);
            
            document.getElementById('blueProblem').textContent = gameState.blueCurrentProblem.question;
            document.getElementById('redProblem').textContent = gameState.redCurrentProblem.question;
        }

        function generateProblem(level) {
            if (level === 1) {
                // Multiplication and Division
                const operation = Math.random() > 0.5 ? '*' : '/';
                if (operation === '*') {
                    const a = Math.floor(Math.random() * 12) + 2;
                    const b = Math.floor(Math.random() * 12) + 2;
                    return {
                        question: `${a} × ${b} = ?`,
                        answer: a * b
                    };
                } else {
                    const b = Math.floor(Math.random() * 10) + 2;
                    const answer = Math.floor(Math.random() * 12) + 2;
                    const a = b * answer;
                    return {
                        question: `${a} ÷ ${b} = ?`,
                        answer: answer
                    };
                }
            } else if (level === 2) {
                // Quadratic equations - discriminant
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 10) - 5;
                const c = Math.floor(Math.random() * 10) - 5;
                const discriminant = b * b - 4 * a * c;
                return {
                    question: `D = b² - 4ac, where a=${a}, b=${b}, c=${c}`,
                    answer: discriminant
                };
            } else {
                // Functions - evaluate f(x)
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 10) - 5;
                const x = Math.floor(Math.random() * 10) - 5;
                const result = a * x + b;
                return {
                    question: `f(x) = ${a}x + ${b}, find f(${x})`,
                    answer: result
                };
            }
        }

        function addDigit(team, digit) {
            const input = document.getElementById(`${team}Answer`);
            if (digit === '-' && input.value === '') {
                input.value = '-';
            } else if (digit !== '-') {
                input.value += digit;
            }
        }

        function clearAnswer(team) {
            const input = document.getElementById(`${team}Answer`);
            input.value = input.value.slice(0, -1);
        }

        function submitAnswer(team) {
            const input = document.getElementById(`${team}Answer`);
            const feedback = document.getElementById(`${team}Feedback`);
            const userAnswer = parseInt(input.value);
            const correctAnswer = team === 'blue' ? 
                gameState.blueCurrentProblem.answer : 
                gameState.redCurrentProblem.answer;

            if (isNaN(userAnswer)) {
                feedback.textContent = 'Please enter a valid number';
                feedback.className = 'feedback incorrect';
                return;
            }

            if (userAnswer === correctAnswer) {
                feedback.textContent = '✓ Correct!';
                feedback.className = 'feedback correct';
                
                if (team === 'blue') {
                    gameState.blueScore++;
                    gameState.position--;
                } else {
                    gameState.redScore++;
                    gameState.position++;
                }
                
                updateDisplay();
                
                setTimeout(() => {
                    if (Math.abs(gameState.position) >= gameState.maxPosition) {
                        endGame(team);
                    } else {
                        input.value = '';
                        feedback.textContent = '';
                        feedback.className = 'feedback';
                        if (team === 'blue') {
                            gameState.blueCurrentProblem = generateProblem(gameState.level);
                            document.getElementById('blueProblem').textContent = gameState.blueCurrentProblem.question;
                        } else {
                            gameState.redCurrentProblem = generateProblem(gameState.level);
                            document.getElementById('redProblem').textContent = gameState.redCurrentProblem.question;
                        }
                    }
                }, 1500);
            } else {
                feedback.textContent = `✗ Wrong! Correct answer: ${correctAnswer}`;
                feedback.className = 'feedback incorrect';
                
                setTimeout(() => {
                    input.value = '';
                    feedback.textContent = '';
                    feedback.className = 'feedback';
                }, 2000);
            }
        }

        function updateDisplay() {
            document.getElementById('blueScore').textContent = gameState.blueScore;
            document.getElementById('redScore').textContent = gameState.redScore;
            
            const marker = document.getElementById('marker');
            const percentage = 50 + (gameState.position / gameState.maxPosition) * 40;
            marker.style.left = `${percentage}%`;
            
            const blueChar = document.getElementById('blueChar');
            const redChar = document.getElementById('redChar');
            blueChar.style.left = `${20 + (gameState.position / gameState.maxPosition) * 30}%`;
            redChar.style.right = `${20 - (gameState.position / gameState.maxPosition) * 30}%`;
        }

        function endGame(winner) {
            const gameOver = document.getElementById('gameOver');
            const winnerText = document.getElementById('winnerText');
            const finalScore = document.getElementById('finalScore');
            
            if (winner === 'blue') {
                winnerText.textContent = '🎉 Blue Team Wins! 🎉';
                winnerText.style.color = '#667eea';
            } else {
                winnerText.textContent = '🎉 Red Team Wins! 🎉';
                winnerText.style.color = '#f5576c';
            }
            
            finalScore.textContent = `Blue ${gameState.blueScore} - ${gameState.redScore} Red`;
            gameOver.classList.add('active');
        }

        function restartGame() {
            document.getElementById('gameOver').classList.remove('active');
            document.getElementById('gameArea').classList.remove('active');
            document.getElementById('levelSelect').style.display = 'block';
            
            document.getElementById('blueAnswer').value = '';
            document.getElementById('redAnswer').value = '';
            document.getElementById('blueFeedback').textContent = '';
            document.getElementById('redFeedback').textContent = '';
            document.getElementById('blueFeedback').className = 'feedback';
            document.getElementById('redFeedback').className = 'feedback';
        }