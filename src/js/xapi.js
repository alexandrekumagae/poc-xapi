// xAPI Implementation
class XAPI {
    constructor() {
        this.endpoint = null;
        this.auth = null;
        this.actor = null;
        this.verb = null;
        this.object = null;
        this.result = null;
        this.context = null;
        this.timestamp = null;
        this.stored = null;
        this.version = "1.0.3";
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Try to find xAPI endpoint
        this.findEndpoint();
        
        if (this.endpoint) {
            this.initialize();
        } else {
            console.log("xAPI endpoint not found - running in standalone mode");
        }
    }

    findEndpoint() {
        // Look for xAPI endpoint in parent window or global scope
        if (window.parent && window.parent.xAPIEndpoint) {
            this.endpoint = window.parent.xAPIEndpoint;
            this.auth = window.parent.xAPIAuth;
        } else if (window.xAPIEndpoint) {
            this.endpoint = window.xAPIEndpoint;
            this.auth = window.xAPIAuth;
        }
        
        // Set default actor if not provided
        if (!this.actor) {
            this.actor = {
                objectType: "Agent",
                name: "Usuário Teste",
                mbox: "mailto:usuario.teste@exemplo.com"
            };
        }
    }

    initialize() {
        if (!this.endpoint) return false;
        
        try {
            this.isInitialized = true;
            console.log("xAPI initialized successfully");
            
            // Send initialized statement
            this.sendStatement({
                actor: this.actor,
                verb: {
                    id: "http://adlnet.gov/expapi/verbs/initialized",
                    display: { "pt-BR": "iniciou" }
                },
                object: {
                    id: "http://exemplo.com/comunicacao-efetiva",
                    definition: {
                        name: { "pt-BR": "Comunicação Efetiva no Ambiente de Trabalho" },
                        description: { "pt-BR": "Curso sobre comunicação efetiva no ambiente corporativo" }
                    }
                }
            });
            
            return true;
        } catch (error) {
            console.log("Error initializing xAPI:", error);
            return false;
        }
    }

    // Send xAPI statement
    sendStatement(statement) {
        if (!this.endpoint) {
            // Store locally if no endpoint
            this.storeLocally(statement);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", this.endpoint, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.setRequestHeader("X-Experience-API-Version", this.version);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log("xAPI statement sent successfully");
                    // Send tracking to parent window
                    this.sendTrackingToParent(statement);
                } else {
                    console.log("Error sending xAPI statement:", xhr.status);
                    // Store locally as fallback
                    this.storeLocally(statement);
                }
            }
        };

        xhr.send(JSON.stringify(statement));
    }

    // Store statement locally
    storeLocally(statement) {
        try {
            const statements = JSON.parse(localStorage.getItem('xapi_statements') || '[]');
            statements.push({
                ...statement,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('xapi_statements', JSON.stringify(statements));
            console.log("Statement stored locally");
        } catch (error) {
            console.log("Error storing statement locally:", error);
        }
    }

    // Send tracking data to parent window
    sendTrackingToParent(statement) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'XAPI_TRACKING',
                payload: {
                    statement: statement,
                    timestamp: new Date().toISOString()
                }
            }, '*');
        }
    }

    // Lesson navigation
    lessonAccessed(lessonNumber, lessonTitle) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/accessed",
                display: { "pt-BR": "acessou" }
            },
            object: {
                id: `http://exemplo.com/comunicacao-efetiva/lesson/${lessonNumber}`,
                definition: {
                    name: { "pt-BR": lessonTitle },
                    description: { "pt-BR": `Lição ${lessonNumber} do curso de comunicação efetiva` }
                }
            },
            context: {
                contextActivities: {
                    parent: [{
                        id: "http://exemplo.com/comunicacao-efetiva",
                        definition: {
                            name: { "pt-BR": "Comunicação Efetiva no Ambiente de Trabalho" }
                        }
                    }]
                }
            }
        });
    }

    // Lesson completed
    lessonCompleted(lessonNumber, lessonTitle) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "pt-BR": "completou" }
            },
            object: {
                id: `http://exemplo.com/comunicacao-efetiva/lesson/${lessonNumber}`,
                definition: {
                    name: { "pt-BR": lessonTitle },
                    description: { "pt-BR": `Lição ${lessonNumber} do curso de comunicação efetiva` }
                }
            },
            result: {
                completion: true,
                success: true
            }
        });
    }

    // Quiz answered
    quizAnswered(questionId, answer, isCorrect) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/answered",
                display: { "pt-BR": "respondeu" }
            },
            object: {
                id: `http://exemplo.com/comunicacao-efetiva/question/${questionId}`,
                definition: {
                    name: { "pt-BR": `Questão ${questionId}` },
                    description: { "pt-BR": "Questão do quiz de comunicação efetiva" }
                }
            },
            result: {
                response: answer,
                success: isCorrect,
                score: {
                    raw: isCorrect ? 100 : 0,
                    min: 0,
                    max: 100
                }
            }
        });
    }

    // Reflection submitted
    reflectionSubmitted(reflectionId, content) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/commented",
                display: { "pt-BR": "refletiu" }
            },
            object: {
                id: `http://exemplo.com/comunicacao-efetiva/reflection/${reflectionId}`,
                definition: {
                    name: { "pt-BR": "Reflexão sobre comunicação efetiva" },
                    description: { "pt-BR": "Reflexão pessoal sobre experiências de comunicação" }
                }
            },
            result: {
                response: content,
                completion: true
            }
        });
    }

    // Scenario completed
    scenarioCompleted(scenarioId, choice, isCorrect) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "pt-BR": "completou" }
            },
            object: {
                id: `http://exemplo.com/comunicacao-efetiva/scenario/${scenarioId}`,
                definition: {
                    name: { "pt-BR": "Cenário prático de comunicação" },
                    description: { "pt-BR": "Cenário prático sobre comunicação efetiva" }
                }
            },
            result: {
                response: choice,
                success: isCorrect,
                completion: true
            }
        });
    }

    // Assessment completed
    assessmentCompleted(score, totalQuestions, percentage) {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "pt-BR": "completou" }
            },
            object: {
                id: "http://exemplo.com/comunicacao-efetiva/assessment",
                definition: {
                    name: { "pt-BR": "Avaliação Final" },
                    description: { "pt-BR": "Avaliação final do curso de comunicação efetiva" }
                }
            },
            result: {
                score: {
                    raw: score,
                    min: 0,
                    max: totalQuestions,
                    scaled: percentage / 100
                },
                success: percentage >= 70,
                completion: true
            }
        });
    }

    // Course completed
    courseCompleted() {
        this.sendStatement({
            actor: this.actor,
            verb: {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "pt-BR": "completou" }
            },
            object: {
                id: "http://exemplo.com/comunicacao-efetiva",
                definition: {
                    name: { "pt-BR": "Comunicação Efetiva no Ambiente de Trabalho" },
                    description: { "pt-BR": "Curso completo sobre comunicação efetiva no ambiente corporativo" }
                }
            },
            result: {
                completion: true,
                success: true,
                duration: this.getSessionDuration()
            }
        });
    }

    // Get session duration
    getSessionDuration() {
        const startTime = sessionStorage.getItem('xapi_session_start');
        if (startTime) {
            const duration = new Date() - new Date(startTime);
            return this.formatDuration(duration);
        }
        return "PT0M";
    }

    // Format duration as ISO 8601
    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        return `PT${minutes}M`;
    }

    // Set actor information
    setActor(name, email) {
        this.actor = {
            objectType: "Agent",
            name: name,
            mbox: `mailto:${email}`
        };
    }

    // Get stored statements
    getStoredStatements() {
        try {
            return JSON.parse(localStorage.getItem('xapi_statements') || '[]');
        } catch (error) {
            console.log("Error getting stored statements:", error);
            return [];
        }
    }

    // Clear stored statements
    clearStoredStatements() {
        localStorage.removeItem('xapi_statements');
    }

    // Session management
    startSession() {
        sessionStorage.setItem('xapi_session_start', new Date().toISOString());
    }

    endSession() {
        sessionStorage.removeItem('xapi_session_start');
    }

    // Cleanup
    cleanup() {
        this.endSession();
    }
}

// Auto-initialize xAPI when script loads
window.xAPI = new XAPI();

// Start session when page loads
window.xAPI.startSession();

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.xAPI) {
        window.xAPI.cleanup();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = XAPI;
} 