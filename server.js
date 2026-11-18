
const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/healthz", (req, res) => {
  res.send("OK");
});

// Проверка отправки тестового сообщения в Telegram
app.post("/test-telegram", async (req, res) => {
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      success: false,
      message: "Не заданы BOT_TOKEN или CHAT_ID"
    });
  }

  try {
    const bot = new TelegramBot(token);

    await bot.sendMessage(
      chatId,
      "Тестовое сообщение от geo-sharing-site.\n\nДемонстрационные координаты: 55.7961, 49.1064\nhttps://www.google.com/maps?q=55.7961,49.1064"
    );

    res.json({ success: true, message: "Тест отправлен" });
  } catch (error) {
    console.error("Telegram error:", error.message);

    res.status(500).json({
      success: false,
      message: "Не удалось отправить тестовое сообщение"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
