import { Message, MessageType } from '../types/onboarding';

export const testMessages: Message[] = [
  { 
    id: '1', 
    type: 'ai' as MessageType, 
    content: "¡Hola! Soy Genesis, y estoy aquí para ayudarte a crear tu experiencia perfecta con Arami. En los próximos 3-4 minutos, exploraremos tu personalidad, tus objetivos emocionales y diseñaremos juntos tu ritual diario personalizado. ¿Listo para crear tu compañero emocional ideal?", 
    timestamp: new Date() 
  },
  { 
    id: '2', 
    type: 'user' as MessageType, 
    content: "Sí, estoy listo.", 
    timestamp: new Date() 
  },
  { 
    id: '3', 
    type: 'ai' as MessageType, 
    content: "¡Excelente! Me encanta tu entusiasmo. Para empezar a conocernos un poco mejor y entender cómo Arami puede apoyarte de la mejor manera, me gustaría preguntarte: cuando te enfrentas a un desafío o a una situación estresante, ¿cuál suele ser tu primera reacción o cómo tiendes a abordarlo?", 
    timestamp: new Date() 
  },
  { 
    id: '4', 
    type: 'user' as MessageType, 
    content: "Suelo analizar las cosas.", 
    timestamp: new Date() 
  },
  { 
    id: '5', 
    type: 'ai' as MessageType, 
    content: "Entendido, sueles analizar las cosas. Eso es muy útil para entender cómo abordas los desafíos.\n\nAhora, para comprender mejor tu mundo emocional, me gustaría saber: ¿Hay alguna área en tu vida en la que sientas que podrías usar un poco más de apoyo o en la que te gustaría ver un cambio positivo? Por ejemplo, ¿quizás en el manejo del estrés, en la consecución de metas, en tus relaciones, en la confianza en ti mismo o en la regulación de tus emociones?", 
    timestamp: new Date() 
  },
  { 
    id: '6', 
    type: 'user' as MessageType, 
    content: "Sí, me gustaría dejar de procrastinar mis proyectos personales.", 
    timestamp: new Date() 
  },
  { 
    id: '7', 
    type: 'ai' as MessageType, 
    content: "Entendido, quieres dejar de procrastinar tus proyectos personales. Eso es un objetivo muy claro y Arami puede ser de gran ayuda con eso.", 
    timestamp: new Date() 
  },
  { 
    id: '8', 
    type: 'ai' as MessageType, 
    content: "Para seguir construyendo tu experiencia personalizada, y basándonos en tu tendencia a analizar las cosas, me pregunto: ¿Qué te motiva a la hora de tomar decisiones importantes? ¿Es la búsqueda de la perfección, el deseo de lograr tus metas, o quizás la necesidad de tener toda la información antes de actuar?", 
    timestamp: new Date() 
  },
  { 
    id: '9', 
    type: 'user' as MessageType, 
    content: "el deseo de lograr las metas y la necesidad de tener info antes de actuar.", 
    timestamp: new Date() 
  },
  { 
    id: '10', 
    type: 'ai' as MessageType, 
    content: "¡Excelente! Me queda muy claro. El deseo de lograr tus metas y la necesidad de tener toda la información antes de actuar son indicadores muy valiosos para mí.\n\nAhora que tengo una mejor idea de cómo funcionas, vamos a pasar a la siguiente fase.", 
    timestamp: new Date() 
  },
  { 
    id: '11', 
    type: 'ai' as MessageType, 
    content: "Ahora, hablemos de cómo te gustaría que fuera tu ritual diario con Arami. Pensando en tu estilo y en tu objetivo de dejar de procrastinar, ¿qué tipo de ritual te resultaría más útil?\n\nPodemos considerar el momento del día, si prefieres que sea por la mañana o por la noche. También la duración, si te gustaría algo rápido y enfocado, de dos a tres minutos, o una inmersión más profunda, de cinco a siete minutos. Y finalmente, el estilo: ¿prefieres una estructura guiada o una conversación más abierta?", 
    timestamp: new Date() 
  },
  { 
    id: '12', 
    type: 'user' as MessageType, 
    content: "Bien, algo por la mañana que tenga duración corta y más estructurado.", 
    timestamp: new Date() 
  },
  { 
    id: '13', 
    type: 'ai' as MessageType, 
    content: "Perfecto, un ritual matutino, corto y estructurado. Eso suena como una excelente manera de empezar el día con enfoque.\n\nAhora que tenemos una idea clara de cómo será tu ritual, pasemos a la selección de la voz de Arami. La voz puede influir mucho en cómo te sientes durante tu ritual.\n\nBasado en tu personalidad analítica y orientada a la información, tengo algunas opciones que podrían resonar contigo:\n\nPrimero, tenemos la voz de \"mentor_sabio\", que es reflexiva, estructurada y perspicaz. También está la voz de \"guía_amable\", que es tranquila, paciente y metódica. Y por último, la de \"entrenador_confiado\", que es directa pero considerada.\n\n¿Cuál de estas voces te atrae más para tu compañero Arami?", 
    timestamp: new Date() 
  },
  { 
    id: '14', 
    type: 'user' as MessageType, 
    content: "Mentor sabio.", 
    timestamp: new Date() 
  }
];