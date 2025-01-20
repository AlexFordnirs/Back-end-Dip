const { OpenAI } = require("openai");
const { v4: uuidv4 } = require("uuid");

// Инициализация клиента OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Временное хранилище сгенерированных тестов в памяти
// Ключ: _id теста, Значение: сам объект теста
const tasksDB = {};

class AIController {
    /**
     * Генерация Reading-задачи
     */
    async generateReadingTask(req, res) {
        try {
            // Получаем нужные параметры из тела
            const { level_name, name_task, instructions, topic, difficulty, genre } = req.body;
            // Генерируем уникальный ID
            const generatedId = uuidv4();

            // Формируем prompt для GPT
            const prompt = `
        Create a Reading task for an English learner.
        Level: ${level_name}.
        Topic: ${topic}.
        Genre: ${genre || "any"}.
        Difficulty: ${difficulty}.

        Task name: ${name_task}.
        Instructions: ${instructions}.
        Format the response as valid JSON with no explanations or additional text, using the following structure:
        {
            "_id": "${generatedId}",
            "type_name": "Reading",
            "level_name": "${level_name}",
            "name_task": "${name_task}",
            "instructions": "${instructions}",
            "text": "reading_text",
            "questions": [
                {
                    "question": "question_text",
                    "query_answer": "correct_answer",
                    "options": ["option_1", "option_2", "option_3", "option_4"],
                    "_id": "unique_id"
                }
            ],
            "__v": 0
        }
        Respond only with valid JSON.
      `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo", // Или другой подходящий модельный идентификатор
                messages: [
                    { role: "system", content: "You are a helpful assistant generating English learning tasks." },
                    { role: "user", content: prompt },
                ],
                max_tokens: 1500,
            });

            const messageContent = response.choices[0].message.content.trim();

            // Проверяем формат JSON
            if (!messageContent.startsWith("{") || !messageContent.endsWith("}")) {
                throw new Error("Invalid JSON format in response from OpenAI.");
            }

            const result = JSON.parse(messageContent);

            // Сохраняем задачу в базе (in-memory)
            tasksDB[result._id] = result;

            res.json(result);
        } catch (error) {
            console.error("Error generating Reading task:", error.message);
            res.status(500).json({
                message: "Failed to generate Reading task.",
                error: error.message,
            });
        }
    }

    /**
     * Генерация Translate-задачи
     */
    async generateTranslateTask(req, res) {
        try {
            const { level_name, name_task, instructions, topic, difficulty } = req.body;
            const generatedId = uuidv4();

            const prompt = `
        Create a Translate task for an English learner.
        Level: ${level_name}.
        Topic: ${topic}.
        Difficulty: ${difficulty}.

        Task name: ${name_task}.
        Instructions: ${instructions}.
        Format the response as valid JSON with no explanations or additional text, using the following structure:
        {
            "_id": "${generatedId}",
            "type_name": "Translate",
            "level_name": "${level_name}",
            "name_task": "${name_task}",
            "instructions": "${instructions}",
            "questions": [
                {
                    "text": "sentence_to_translate_in_Ukrainian",
                    "query_answer": "correct_translation_in_English",
                    "_id": "unique_id"
                }
            ],
            "__v": 0
        }
        Ensure all sentences in "text" are in Ukrainian, and "query_answer" is their correct English translation.
        Respond only with valid JSON.
      `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant generating English learning tasks." },
                    { role: "user", content: prompt },
                ],
                max_tokens: 1500,
            });

            const messageContent = response.choices[0].message.content.trim();

            if (!messageContent.startsWith("{") || !messageContent.endsWith("}")) {
                throw new Error("Invalid JSON format in response from OpenAI.");
            }

            const result = JSON.parse(messageContent);

            // Сохраняем задачу в памяти
            tasksDB[result._id] = result;

            res.json(result);
        } catch (error) {
            console.error("Error generating Translate task:", error.message);
            res.status(500).json({
                message: "Failed to generate Translate task.",
                error: error.message,
            });
        }
    }

    /**
     * Продолжение диалога (Тренировка в письменном общении)
     * Возвращаем response + feedback.
     */
    async continueDialogue(req, res) {
        try {
            const { userMessage, context, startInfo } = req.body;

            // Если startInfo есть, значит это первое сообщение.
            // Можем сформировать отдельный prompt с учётом темы, характера собеседника, уровня и т.д.
            let systemPrompt = "You are a helpful AI assistant. Provide a short conversation response, plus grammar corrections.";
            let userPrompt = `
        Context: ${context || "Begin a conversation."}
        User: ${userMessage || "Hello!"}
      `;

            // Если есть startInfo => встраиваем в prompt (пример)
            if (startInfo) {
                const { topic, character, difficulty } = startInfo;
                userPrompt += `
          Additional info:
          - Conversation Topic: ${topic}
          - Character of interlocutor: ${character}
          - Difficulty Level: ${difficulty}
        `;
            }

            // Чтобы получить и сообщение, и разбор ошибок, просим GPT вернуть JSON строго с полями response, feedback.
            // feedback — это текст с указанием грамматических, стилистических ошибок, советов и т.п.
            const instruction = `
        Please answer as JSON only in the following structure, with no additional keys:
        {
          "response": "Your main answer to the user",
          "feedback": "Short analysis of grammar/spelling mistakes from the user's last message, with suggestions for improvement."
        }
      `;

            const fullPrompt = `${userPrompt}\n\n${instruction}`;

            const openAiResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: fullPrompt },
                ],
                max_tokens: 1000,
            });

            const content = openAiResponse.choices[0].message.content.trim();

            // Пытаемся распарсить контент как JSON
            if (!content.startsWith("{") || !content.endsWith("}")) {
                // Если GPT не вернул JSON, возвращаем что есть
                return res.json({
                    response: content,
                    feedback: "No structured feedback available. GPT did not provide valid JSON.",
                });
            }

            let parsed;
            try {
                parsed = JSON.parse(content);
            } catch (err) {
                // Если ошибка парсинга JSON
                return res.json({
                    response: content,
                    feedback: "No structured feedback available. JSON parsing failed.",
                });
            }

            // Если всё ок, возвращаем распарсенные поля
            return res.json({
                response: parsed.response || "No response",
                feedback: parsed.feedback || "No feedback",
            });
        } catch (error) {
            console.error("Error continuing dialogue:", error.message);
            res.status(500).json({
                message: "Failed to continue dialogue.",
                error: error.message,
            });
        }
    }

    /**
     * Приём ответов на тест и выдача результатов
     */
    async submitTest(req, res) {
        try {
            const { testId, userAnswers } = req.body;

            // Ищем тест по ID
            const testData = tasksDB[testId];
            if (!testData) {
                return res.status(404).json({ message: "Test not found." });
            }

            // В зависимости от типа (Reading / Translate) логика проверки может немного отличаться,
            // но общий принцип такой: сравнить userAnswers с query_answer.
            const questions = testData.questions || [];
            let score = 0;
            const total = questions.length;
            const details = [];

            // Считаем каждое задание
            questions.forEach((q, index) => {
                const correctAnswer = q.query_answer;
                const userAnswer = userAnswers[q._id];

                // Сравнение можно сделать регистронезависимым, убрать пробелы и т.д.
                if (
                    typeof correctAnswer === "string" &&
                    typeof userAnswer === "string" &&
                    correctAnswer.trim().toLowerCase() === userAnswer.trim().toLowerCase()
                ) {
                    score++;
                    details.push(`Question #${index + 1}: Correct`);
                } else {
                    details.push(
                        `Question #${index + 1}: Incorrect. Your answer: "${userAnswer}". Correct: "${correctAnswer}".`
                    );
                }
            });

            // Формируем ответ
            const result = {
                score,
                total,
                details,
            };

            return res.json(result);
        } catch (error) {
            console.error("Error submitting test:", error.message);
            res.status(500).json({
                message: "Failed to submit test.",
                error: error.message,
            });
        }
    }
}

// Экспортируем экземпляр контроллера
module.exports = new AIController();

// ВАЖНО: tasksDB здесь хранится в памяти, при перезапуске сервера данные пропадут.
// В реальном проекте стоит сохранять данные в БД (например, MongoDB).
