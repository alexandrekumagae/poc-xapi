// xAPI Application Controller
class XAPIApp {
    constructor() {
        this.currentLesson = 1;
        this.totalLessons = 4;
        this.completedLessons = new Set();
        this.assessmentAnswers = {};
        this.assessmentSubmitted = false;
        this.lessonTitles = {
            1: "Introdução à Comunicação Efetiva",
            2: "Tipos de Comunicação no Ambiente Corporativo",
            3: "Barreiras da Comunicação e Como Superá-las",
            4: "Avaliação Final"
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateLessonInfo();
        this.xAPI = window.xAPI;
        
        // Send initial lesson access
        this.xAPI.lessonAccessed(this.currentLesson, this.lessonTitles[this.currentLesson]);
    }

    bindEvents() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonNumber = parseInt(e.target.dataset.lesson);
                this.goToLesson(lessonNumber);
            });
        });

        // Previous/Next buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousLesson();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextLesson();
        });

        // Assessment submission
        document.getElementById('submit-assessment').addEventListener('click', () => {
            this.submitAssessment();
        });

        // Retry assessment
        document.getElementById('retry-assessment').addEventListener('click', () => {
            this.retryAssessment();
        });

        // Interactive elements
        this.bindInteractiveElements();
    }

    bindInteractiveElements() {
        // Reflection textarea
        const reflectionTextarea = document.getElementById('reflection-1');
        if (reflectionTextarea) {
            reflectionTextarea.addEventListener('input', () => {
                this.saveUserInput('reflection-1', reflectionTextarea.value);
            });
            
            // Send reflection when user stops typing
            let typingTimer;
            reflectionTextarea.addEventListener('input', () => {
                clearTimeout(typingTimer);
                typingTimer = setTimeout(() => {
                    if (reflectionTextarea.value.trim()) {
                        this.xAPI.reflectionSubmitted('reflection-1', reflectionTextarea.value);
                    }
                }, 2000);
            });
        }

        // Quiz questions
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleQuizAnswer(e);
            });
        });
    }

    goToLesson(lessonNumber) {
        if (lessonNumber < 1 || lessonNumber > this.totalLessons) return;

        // Hide all lessons
        document.querySelectorAll('.lesson').forEach(lesson => {
            lesson.classList.remove('active');
        });

        // Show target lesson
        document.getElementById(`lesson-${lessonNumber}`).classList.add('active');

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lesson="${lessonNumber}"]`).classList.add('active');

        // Update current lesson
        this.currentLesson = lessonNumber;
        this.updateLessonInfo();
        this.updateNavigationButtons();

        // Send xAPI tracking
        this.xAPI.lessonAccessed(lessonNumber, this.lessonTitles[lessonNumber]);

        // Mark lesson as completed if user has interacted
        this.markLessonAsCompleted(lessonNumber);
    }

    previousLesson() {
        if (this.currentLesson > 1) {
            this.goToLesson(this.currentLesson - 1);
        }
    }

    nextLesson() {
        if (this.currentLesson < this.totalLessons) {
            this.goToLesson(this.currentLesson + 1);
        } else {
            // Course completed
            this.xAPI.courseCompleted();
        }
    }

    updateLessonInfo() {
        document.getElementById('current-lesson').textContent = `Lição ${this.currentLesson} de ${this.totalLessons}`;
        
        const completionPercentage = Math.round((this.completedLessons.size / this.totalLessons) * 100);
        document.getElementById('completion-status').textContent = `${completionPercentage}% Concluído`;
    }

    updateProgress() {
        const progressPercentage = (this.completedLessons.size / this.totalLessons) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        prevBtn.disabled = this.currentLesson === 1;
        nextBtn.disabled = this.currentLesson === this.totalLessons;

        if (this.currentLesson === this.totalLessons) {
            nextBtn.textContent = 'Finalizar';
        } else {
            nextBtn.textContent = 'Próximo';
        }
    }

    markLessonAsCompleted(lessonNumber) {
        this.completedLessons.add(lessonNumber);
        this.updateProgress();
        this.updateLessonInfo();
        
        // Send xAPI lesson completed
        this.xAPI.lessonCompleted(lessonNumber, this.lessonTitles[lessonNumber]);
    }

    handleQuizAnswer(event) {
        const questionName = event.target.name;
        const answer = event.target.value;
        
        this.assessmentAnswers[questionName] = answer;
        
        // Provide immediate feedback for lesson 2 quiz
        if (questionName === 'q1') {
            const isCorrect = answer === 'escrita';
            this.xAPI.quizAnswered('q1', answer, isCorrect);
            this.provideQuizFeedback(event.target, isCorrect);
        }
        
        // Provide immediate feedback for lesson 3 scenario
        if (questionName === 'scenario') {
            const isCorrect = answer === 'b';
            this.xAPI.scenarioCompleted('scenario-1', answer, isCorrect);
            this.provideScenarioFeedback(event.target, isCorrect);
        }
    }

    provideQuizFeedback(selectedElement, isCorrect) {
        // Remove previous feedback
        document.querySelectorAll('.quiz-options label').forEach(label => {
            label.classList.remove('correct', 'incorrect');
        });

        // Add feedback
        const label = selectedElement.closest('label');
        label.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Show feedback message
        setTimeout(() => {
            if (isCorrect) {
                this.showMessage('Correto! A comunicação escrita é ideal para informações complexas que precisam ser revisadas.', 'success');
            } else {
                this.showMessage('Tente novamente. Pense sobre qual tipo de comunicação permite revisão e registro permanente.', 'info');
            }
        }, 500);
    }

    provideScenarioFeedback(selectedElement, isCorrect) {
        // Remove previous feedback
        document.querySelectorAll('.scenario-options label').forEach(label => {
            label.classList.remove('correct', 'incorrect');
        });

        // Add feedback
        const label = selectedElement.closest('label');
        label.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Show feedback message
        setTimeout(() => {
            if (isCorrect) {
                this.showMessage('Excelente escolha! Adaptar a linguagem para cada público é fundamental para uma comunicação efetiva.', 'success');
            } else {
                this.showMessage('Tente novamente. Considere qual abordagem seria mais inclusiva e clara para todos os públicos.', 'info');
            }
        }, 500);
    }

    submitAssessment() {
        const questions = ['final-q1', 'final-q2', 'final-q3'];
        const correctAnswers = {
            'final-q1': 'b',
            'final-q2': 'b', 
            'final-q3': 'c'
        };

        let score = 0;
        let totalQuestions = questions.length;

        questions.forEach(questionName => {
            const selectedAnswer = this.assessmentAnswers[questionName];
            if (selectedAnswer === correctAnswers[questionName]) {
                score++;
            }
        });

        const percentage = Math.round((score / totalQuestions) * 100);
        
        this.showResults(score, totalQuestions, percentage);
        this.assessmentSubmitted = true;
        
        // Send xAPI assessment completed
        this.xAPI.assessmentCompleted(score, totalQuestions, percentage);
    }

    showResults(score, total, percentage) {
        const resultsSection = document.getElementById('results-section');
        const scoreDisplay = document.getElementById('score-display');
        const feedback = document.getElementById('feedback');

        scoreDisplay.innerHTML = `${score}/${total} (${percentage}%)`;

        let feedbackText = '';
        if (percentage >= 90) {
            feedbackText = 'Parabéns! Você demonstrou excelente compreensão sobre comunicação efetiva no ambiente de trabalho.';
        } else if (percentage >= 70) {
            feedbackText = 'Muito bem! Você tem uma boa compreensão dos conceitos de comunicação efetiva.';
        } else {
            feedbackText = 'Continue estudando! Revise o conteúdo para melhorar sua compreensão sobre comunicação efetiva.';
        }

        feedback.textContent = feedbackText;
        resultsSection.style.display = 'block';

        // Hide assessment section
        document.querySelector('.assessment-section').style.display = 'none';
    }

    retryAssessment() {
        // Reset assessment
        this.assessmentAnswers = {};
        this.assessmentSubmitted = false;
        
        // Clear all radio button selections
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

        // Show assessment section
        document.querySelector('.assessment-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
    }

    saveUserInput(elementId, value) {
        // Save user input to localStorage for persistence
        localStorage.setItem(`xapi_${elementId}`, value);
    }

    showMessage(message, type = 'info') {
        // Create temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.background = '#27ae60';
                break;
            case 'error':
                messageEl.style.background = '#e74c3c';
                break;
            default:
                messageEl.style.background = '#3498db';
        }

        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }

    // Load saved user inputs
    loadUserInputs() {
        const reflectionTextarea = document.getElementById('reflection-1');
        if (reflectionTextarea) {
            const savedValue = localStorage.getItem('xapi_reflection-1');
            if (savedValue) {
                reflectionTextarea.value = savedValue;
            }
        }
    }
}

// Message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.xapiApp = new XAPIApp();
    window.xapiApp.loadUserInputs();
}); 