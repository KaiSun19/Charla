export const mockMessages = [
  {
    type: "Charla",
    message:
      "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
    // Saved: [
    //   { text: "ayer", text_start: null, text_end: null },
    //   { text: "¿Hiciste algo especial?", text_start: null, text_end: null },
    // ],
  },
  {
    type: "User",
    message:
      "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia tambne. antes yo dormí, lo haré práctico patinaje.",
    // saved: [],
    // errors: [
    //   {
    //     text: "tambne",
    //     error: "The correct word should be también",
    //     correction: "también",
    //     text_start : null,
    //     text_end : null
    //   },
    // ],
  },
  {
    type: "Charla",
    message:
      "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
    // saved: ["suena"],
  },
  {
    type: "User",
    message:
      "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mi amigas",
    // saved: [],
    // errors: [
    //   {
    //     Phrase: "mi",
    //     Error: "The translation for my should be in plural",
    //     Correction: "mis",
    //   },
    //   {
    //     Phrase: "amigas",
    //     Error: "The translation for friends should be masculine",
    //     Correction: "amigos",
    //   },
    // ],
  },
  {
    type: "Charla",
    message:
      "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
    // saved: ["alrededor de tu casa"],
  },
  {
    type: "User",
    message: "Normalmente patinamos en lugares donde no ayer mucha gente.",
    // saved: [],
    // errors: [
    //   {
    //     Phrase: "ayer",
    //     Error: "ayer is yesterday the correct word should be hay",
    //     Correction: "hay",
    //   },
    // ],
  },
  {
    type: "Charla",
    message:
      "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
    // saved: ["ayer", "¿Hiciste algo especial?"],
  },
  {
    type: "User",
    message:
      "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
  },
  {
    type: "Charla",
    message:
      "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
    // saved: ["suena"],
  },
  {
    type: "User",
    message:
      "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
  },
  {
    type: "Charla",
    message:
      "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
    // saved: ["alrededor de tu casa"],
  },
  {
    type: "User",
    message: "Normalmente patinamos en lugares donde no hay mucha gente.",
  },
  {
    type: "User",
    message:
      "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
  },
  {
    type: "Charla",
    message:
      "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
    // saved: ["suena"],
  },
  {
    type: "User",
    message:
      "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
  },
  {
    type: "Charla",
    message:
      "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
  },
];

export const exampleConversations =
  "Cómo está el tiempo hoy?¡Hace un calor tremendo!Ojalá refresque un poco más tarde.Dicen que hay probabilidad de lluvias en la noche.Mejor llevo un paraguas, por si acaso.; ¿Cuál es la mejor ciudad para vivir en España?Depende de lo que busques!A mí me gusta Barcelona, hay playa y mucha cultura.Prefiero algo más tranquilo, ¿qué tal Valencia?Dicen que Madrid es genial si te gusta la vida nocturna.; ¿Puedes decirme cómo llegar a la biblioteca?Sí, claro. Está a dos cuadras de aquí.¿En qué dirección?Camina norte por la calle Mayor. ¡Muchas gracias.De nada.";

export const knownErrors =
  "Me gusta beber mi café con algún pan, ¿qué tipo de pan tienes? - Bueno, tenemos baguette, croissants, pan integral y muffins. ¿Cuál prefieres?, you have included the previous user reply in your response. only include your response to previous user prompt in the response. you should not incluide the correction in the response. you should not correct the phrase based on whether it makes sense but on how to improve the user's spanish. there should only be one correction for every error the user makes ";

export const initialPrompt = `You are a spanish tutor for student of beginner level. Your job is to carry on an imaginary conversation that I will start. I will set the imaginary scenario of the conversation in the first chat as the user and the initial chat I want you to reply to . You will reply in a JSON format as follows: Errors: Phrase : the phrase that is incorrect Error: why the phrase is incorrect . here is a list of mistakes you have made in your response : ${knownErrors} ; Correction: the correct phrase  ; . Phrase , Error, Correction should be properties in an object that is in an array called Errors. Response : your response in basic spanish which should be outside the Errors array . An example is this . My first prompt is 'I want to order a coffee from you. Hola, yo quiero comprar un cafe contigas.' Your reply should be : {Errors : [{Phrase : 'contigas''; Error : 'you should use contigo to say with you instead' ; Correction: 'contigo'}], Response: 'Claro. ¿Qué tipo de café quieres?'}. You have to always reply with the given format even when there is no error, if there is no error then just give Errors as an empty array and the Response. do not reply with line breaks. you have to reply in the format i have shown but here are the types of conversations i want: ${exampleConversations}`;

export const coffeeCompletionQuery = {
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: initialPrompt,
    },
    {
      role: "user",
      content: "Hola, como estas?",
    },
    {
      role: "assistant",
      content:
        "Errors: \nPhrase: N/A.\nError: N/A.\nCorrection: N/A.\nResponse: 'Hola, estoy bien, gracias. ¿Qué tipo de café te gustaría?'",
    },
  ],
};

// random replies to mock charla responses

export const randomResponses = [
  "¡De nada! Estoy feliz de poder ayudarte.", // You're welcome! I'm happy to help.
  "Entiendo lo que estás diciendo. ¿Hay algo más en lo que pueda ayudarte?", // I understand what you're saying. Is there anything else I can help you with?
  "¡Eso suena genial! Estoy seguro de que lo lograrás.", // That sounds great! I'm sure you can achieve it.
  "¿Me puedes explicar un poco más sobre eso?", // Can you explain that a little more to me?
  "¡Me alegra que lo pienses! Siempre estoy aprendiendo.", // I'm glad you think so! I'm always learning.
  "No estoy seguro de haber entendido. ¿Puedes intentar reformular tu pregunta?", // I'm not sure I understand. Can you try rephrasing your question?
  "¡Buena pregunta! Déjame ver qué puedo encontrar.", // Good question! Let me see what I can find.
  "¡Feliz de escucharlo! ¿Cómo puedo ayudarte hoy?", // Glad to hear it! How can I help you today?
  "No hay problema. Puedo intentar responder a una pregunta diferente.", // No problem. I can try answering a different question.
  "¡Siempre es un placer charlar contigo!", // It's always a pleasure to chat with you!
];

export const mockUserDetails = {
  datetime_joined: "Sun Apr 21 2024",
  email: "yksun15@gmail.com",
  id: "S2FpIFN1bnlrc3VuMTVAZ21haWwuY29t",
  initials: "YS",
  username: "Kai Sun",
  knows_languages: ["english"],
  learning_languages: ["spanish"],
};

export const interests = [
  "traveling",
  "cooking",
  "reading",
  "hiking",
  "photography",
  "painting",
  "gardening",
  "music",
  "dancing",
  "yoga",
  "movies",
  "gaming",
  "fitness",
  "writing",
  "cycling",
  "swimming",
  "fishing",
  "knitting",
  "baking",
  "running",
  "camping",
  "skiing",
  "surfing",
  "kayaking",
  "scuba diving",
  "bird watching",
  "volunteering",
  "crafting",
  "collecting",
  "astronomy",
];

const extractResponse = (text) => {
  if (!text.includes("Response")) {
    return text;
  }
  let match = text.match(/Response:\s*(.*)/);
  let res;
  if (match && match.length > 1) {
    res = match[1];
    if (res[0] === "'") {
      res = res.slice(1);
    }
    if (res[res.length - 1] === "'") {
      res = res.slice(0, -1);
    }
  } else {
    res = null;
  }
  return res;
};

export const coffeeChat = coffeeCompletionQuery.messages
  .slice(1)
  .map((message) => {
    let response = extractResponse(message.content);
    let type = message.role === "assistant" ? "Charla" : "User";
    return {
      type: type,
      message: response,
      saved: [],
      errors: [],
    };
  });

export const mockConversations = [
  {
    title: "¿Cómo estuvo tu día ayer? ",
    chat: mockMessages,
    chat_details: {
      last_attempted: "07/01/2023",
      average_chat_time: "342",
      average_word_count: "150",
    },
  },
  {
    title: "Un cafe, por favor",
    chat: coffeeChat,
    chat_details: {
      last_attempted: "07/01/2023",
      average_chat_time: "342",
      average_word_count: "150",
    },
  },
];

export const examplePrompts = [
  "¿Cuál es tu comida favorita y por qué?",
  "¿Qué lugares te gustaría visitar en el futuro?",
  "¿Tienes algún pasatiempo o actividad favorita?",
  "¿Cómo fue tu fin de semana?",
  "¿Puedes recomendarme una película o serie que te haya gustado?",
];

export const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1px solid #c8c8c8",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
  width: 700,
};
