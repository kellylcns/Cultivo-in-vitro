const appContainer = document.getElementById('app-container');
const modal = document.getElementById('feedback-modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalBtn = document.getElementById('modal-btn');

let currentView = 'welcome';
let score = 0;
let simulationStep = 0;
let onModalClose = null;

// --- Data Structures ---

const simulationData = [
    {
        title: "Etapa 1: Establecimiento (Asepsia)",
        description: "Acabas de extraer explantes (pequeños fragmentos de tejido) de una planta madre sana. El ambiente natural está lleno de microorganismos. ¿Qué debes hacer antes de introducirlos al medio de cultivo?",
        options: [
            {
                text: "Lavar con agua y jabón, y sembrar en el laboratorio",
                correct: false,
                feedback: "El agua y jabón no eliminan todos los patógenos. Se contaminará rápidamente con hongos y bacterias."
            },
            {
                text: "Desinfectar con hipoclorito de sodio y alcohol en cámara de flujo laminar",
                correct: true,
                feedback: "¡Correcto! La cámara de flujo laminar asegura un ambiente estéril y los agentes químicos eliminan patógenos superficiales."
            }
        ]
    },
    {
        title: "Etapa 2: Multiplicación",
        description: "El explante ha sobrevivido y está estéril. Ahora necesitas que genere múltiples brotes nuevos. ¿Qué balance hormonal agregarías al medio de cultivo?",
        options: [
            {
                text: "Alta concentración de citoquininas y baja de auxinas",
                correct: true,
                feedback: "¡Excelente! Las citoquininas promueven la división celular y la formación de múltiples brotes aéreos."
            },
            {
                text: "Alta concentración de auxinas y baja de citoquininas",
                correct: false,
                feedback: "Incorrecto. Las auxinas en alta concentración promueven la formación de raíces, no de brotes."
            }
        ]
    },
    {
        title: "Etapa 3: Enraizamiento",
        description: "Tienes muchos brotes hermosos, pero no tienen raíces para absorber nutrientes por sí mismos. ¿Cómo procedes?",
        options: [
            {
                text: "Transferir a un medio rico en auxinas y reducir citoquininas",
                correct: true,
                feedback: "¡Bien hecho! Las auxinas estimulan el desarrollo del sistema radicular necesario para la planta."
            },
            {
                text: "Dejarlos en el mismo frasco hasta que las raíces salgan solas",
                correct: false,
                feedback: "Si los dejas en el medio de multiplicación, seguirán generando brotes indefinidamente o agotarán los nutrientes y morirán."
            }
        ]
    },
    {
        title: "Etapa 4: Aclimatación",
        description: "Las plántulas tienen raíces y hojas funcionales. Están en frascos con 100% de humedad. Es hora de llevarlas al mundo real. ¿Qué haces?",
        options: [
            {
                text: "Sacarlas del frasco y plantarlas directamente al sol en el campo",
                correct: false,
                feedback: "¡Cuidado! Las plantas in vitro no tienen cutícula gruesa ni estomas funcionales, morirían deshidratadas en minutos."
            },
            {
                text: "Trasplantar a sustrato estéril y reducir la humedad gradualmente en invernadero",
                correct: true,
                feedback: "¡Correcto! La aclimatación debe ser progresiva para que la planta desarrolle defensas naturales y regule su transpiración."
            }
        ]
    }
];

const finalChallengeData = {
    title: "Reto Final Integrador",
    description: "Te han asignado la misión de rescatar una especie de orquídea en peligro de extinción utilizando cultivo in vitro. Selecciona la secuencia correcta de pasos para garantizar el éxito desde la planta madre hasta el campo.",
    options: [
        {
            text: "Cámara estéril (Asepsia) → Medio con citoquininas (Multiplicar) → Medio con auxinas (Enraizar) → Invernadero húmedo (Aclimatación)",
            correct: true,
            feedback: "¡Perfecto! Has dominado el protocolo completo. Esta es la secuencia biotecnológica correcta para asegurar el éxito del cultivo."
        },
        {
            text: "Medio con auxinas (Enraizar) → Cámara estéril (Asepsia) → Medio con citoquininas (Multiplicar) → Sol directo (Aclimatación)",
            correct: false,
            feedback: "Incorrecto. El orden biológico es vital; no puedes enraizar antes de desinfectar y multiplicar, y el sol directo mataría a la planta."
        },
        {
            text: "Lavar con agua → Invernadero húmedo → Medio con auxinas → Medio con citoquininas",
            correct: false,
            feedback: "Totalmente incorrecto. Has ignorado los principios de asepsia y el orden fisiológico del desarrollo in vitro."
        }
    ]
};

// --- View Renderers ---

const views = {
    welcome: () => `
        <div class="glass-panel text-center">
            <h1>BioTech <span class="text-accent">Edu</span></h1>
            <h2>Laboratorio de Cultivo In Vitro</h2>
            <p class="mb-8">Bienvenido al simulador interactivo de biotecnología vegetal. Hoy serás el investigador encargado de propagar plantas utilizando técnicas avanzadas de laboratorio.</p>
            <div class="mb-8">
                <i class="fa-solid fa-microscope text-accent" style="font-size: 5rem;"></i>
            </div>
            <button class="btn btn-primary" onclick="navigate('learn')">
                Iniciar Experiencia <i class="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    `,
    
    learn: () => `
        <div class="glass-panel">
            <h2 class="text-center text-accent mb-8">Fundamentos Teóricos</h2>
            
            <div class="options-grid mb-8">
                <div class="option-card" style="cursor: default;">
                    <h3><i class="fa-solid fa-dna text-accent"></i> ¿Qué es?</h3>
                    <p>El cultivo in vitro es una técnica de propagación de plantas en un ambiente artificial, aséptico (libre de microorganismos) y bajo condiciones controladas (luz, temperatura).</p>
                </div>
                <div class="option-card" style="cursor: default;">
                    <h3><i class="fa-solid fa-earth-americas text-accent"></i> Importancia</h3>
                    <p>Permite obtener miles de plantas libres de enfermedades en poco tiempo y espacio. Es vital para la conservación, mejora genética y agricultura moderna.</p>
                </div>
                <div class="option-card" style="cursor: default; grid-column: 1 / -1;">
                    <h3><i class="fa-solid fa-list-ol text-accent"></i> Totipotencia Celular</h3>
                    <p>El principio biológico clave: toda célula vegetal viva posee la información genética necesaria para regenerar una planta completa si recibe los estímulos adecuados (hormonas).</p>
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary" onclick="navigate('practice')">
                    Siguiente: Observar <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `,

    practice: () => `
        <div class="glass-panel">
            <h2 class="text-center mb-4">Etapas del Proceso</h2>
            <p class="text-center mb-8">Antes de entrar al laboratorio, observa este material de refuerzo sobre las etapas del cultivo in vitro.</p>
            
            <div class="video-container mb-8">
                <div class="video-overlay">
                    <div class="play-btn">
                        <i class="fa-solid fa-play"></i>
                    </div>
                    <h3>Video Educativo: Etapas In Vitro</h3>
                    <p class="text-secondary">(Simulación de contenido multimedia)</p>
                </div>
            </div>

            <div class="text-center">
                <button class="btn btn-primary" onclick="startSimulation()">
                    Entrar al Laboratorio <i class="fa-solid fa-flask-vial"></i>
                </button>
            </div>
        </div>
    `,

    simulate: () => {
        const stage = simulationData[simulationStep];
        const progress = ((simulationStep) / simulationData.length) * 100;
        
        return `
        <div class="glass-panel">
            <div class="sim-progress">
                <div class="sim-progress-bar" style="width: ${progress}%"></div>
            </div>
            
            <h2 class="text-accent mb-4">${stage.title}</h2>
            <p class="mb-8" style="font-size: 1.2rem;">${stage.description}</p>
            
            <h3 class="mb-4">Toma una decisión:</h3>
            <div class="options-grid">
                ${stage.options.map((opt, idx) => `
                    <div class="option-card" onclick="handleSimulationChoice(${simulationStep}, ${idx})">
                        <p>${opt.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    },

    challenge: () => `
        <div class="glass-panel" style="border-color: var(--accent-color);">
            <div class="text-center mb-4">
                <i class="fa-solid fa-star text-accent" style="font-size: 3rem;"></i>
            </div>
            <h2 class="text-center text-accent mb-4">${finalChallengeData.title}</h2>
            <p class="mb-8 text-center" style="font-size: 1.2rem;">${finalChallengeData.description}</p>
            
            <div class="options-grid" style="grid-template-columns: 1fr;">
                ${finalChallengeData.options.map((opt, idx) => `
                    <div class="option-card" onclick="handleChallengeChoice(${idx})">
                        <p style="font-weight: 600;">${opt.text}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,

    evaluate: () => {
        let level = '';
        let message = '';
        let icon = '';

        if (score === 5) {
            level = "Nivel Alto (Experto)";
            message = "¡Felicidades! Has demostrado un conocimiento excelente de las etapas biológicas y técnicas del cultivo in vitro. Estás listo para dirigir tu propio laboratorio.";
            icon = "fa-trophy";
        } else if (score >= 3) {
            level = "Nivel Medio (Competente)";
            message = "Buen trabajo. Comprendes los conceptos fundamentales, pero aún debes afinar detalles críticos como el balance hormonal o la asepsia. ¡Sigue practicando!";
            icon = "fa-medal";
        } else {
            level = "Nivel Bajo (Principiante)";
            message = "Parece que hubo complicaciones en el laboratorio. El cultivo in vitro requiere precisión exacta. Te sugerimos repasar la sección teórica e intentarlo nuevamente.";
            icon = "fa-seedling";
        }

        return `
        <div class="glass-panel text-center">
            <h2 class="mb-4">Reporte de Laboratorio</h2>
            
            <div class="mb-8">
                <i class="fa-solid ${icon} text-accent" style="font-size: 5rem; margin-bottom: 1rem;"></i>
                <h1 class="text-accent" style="font-size: 2.5rem;">${level}</h1>
                <h3>Puntuación: ${score} / 5</h3>
            </div>
            
            <p class="mb-8" style="font-size: 1.2rem;">${message}</p>
            
            <button class="btn btn-primary" onclick="resetApp()">
                <i class="fa-solid fa-rotate-right"></i> Reiniciar Experiencia
            </button>
        </div>
        `;
    }
};

// --- Logic functions ---

function updateNav(step) {
    const navMapping = {
        'welcome': 'welcome',
        'learn': 'learn',
        'practice': 'practice',
        'simulate': 'evaluate',
        'challenge': 'evaluate',
        'evaluate': 'evaluate'
    };
    
    const activeNav = navMapping[step];
    
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active', 'completed');
        const s = el.getAttribute('data-step');
        
        if (s === activeNav) {
            el.classList.add('active');
        }
        
        // simple logic for 'completed' states based on order
        const order = ['welcome', 'learn', 'practice', 'evaluate'];
        if (order.indexOf(s) < order.indexOf(activeNav)) {
            el.classList.add('completed');
        }
    });
}

function render() {
    appContainer.innerHTML = views[currentView]();
    updateNav(currentView);
}

window.navigate = function(view) {
    currentView = view;
    render();
}

window.startSimulation = function() {
    simulationStep = 0;
    score = 0;
    navigate('simulate');
}

window.handleSimulationChoice = function(stepIdx, optionIdx) {
    const stage = simulationData[stepIdx];
    const choice = stage.options[optionIdx];
    
    if (choice.correct) {
        score++;
        showFeedback(true, "¡Correcto!", choice.feedback, () => {
            simulationStep++;
            if (simulationStep < simulationData.length) {
                render();
            } else {
                navigate('challenge');
            }
        });
    } else {
        showFeedback(false, "Incorrecto", choice.feedback, () => {
            simulationStep++;
            if (simulationStep < simulationData.length) {
                render();
            } else {
                navigate('challenge');
            }
        });
    }
}

window.handleChallengeChoice = function(optionIdx) {
    const choice = finalChallengeData.options[optionIdx];
    
    if (choice.correct) score++;
    
    showFeedback(choice.correct, choice.correct ? "¡Misión Cumplida!" : "Misión Fallida", choice.feedback, () => {
        navigate('evaluate');
    });
}

window.showFeedback = function(isCorrect, title, message, callback) {
    modalIcon.className = `modal-icon fa-solid ${isCorrect ? 'fa-circle-check success' : 'fa-circle-xmark error'}`;
    modalTitle.innerText = title;
    modalTitle.style.color = isCorrect ? 'var(--success-color)' : 'var(--error-color)';
    modalMessage.innerText = message;
    
    onModalClose = callback;
    modal.classList.remove('hidden');
}

modalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    if (onModalClose) {
        onModalClose();
        onModalClose = null;
    }
});

window.resetApp = function() {
    score = 0;
    simulationStep = 0;
    navigate('welcome');
}

// Initialize
render();
