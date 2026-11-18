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

// Тест Telegram с демонстрационными координатами
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
      "Тестовое сообщение от geo-sharing-site.\n\n" +
      "Демонстрационные координаты: 55.7961, 49.1064\n" +
      "https://www.google.com/maps?q=55.7961,49.1064"
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Telegram test error:", error.message);

    res.status(500).json({
      success: false,
      message: "Не удалось отправить тестовое сообщение"
    });
  }
});

// Отправка координат после отдельного подтверждения посетителем
app.post("/send-location", async (req, res) => {
  const { latitude, longitude } = req.body || {};

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 || lat > 90 ||
    lon < -180 || lon > 180
  ) {
    return res.status(400).json({
      success: false,
      message: "Некорректные координаты"
    });
  }

  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      success: false,
      message: "Не настроено подключение к Telegram"
    });
  }

  try {
    const bot = new TelegramBot(token);

    const message =
      "Посетитель подтвердил отправку геопозиции.\n\n" +
      "Широта: " + lat + "\n" +
      "Долгота: " + lon + "\n\n" +
      "Google Maps:\nhttps://www.google.com/maps?q=" + lat + "," + lon + "\n\n" +
      "Яндекс Карты:\nhttps://yandex.ru/maps/?pt=" + lon + "," + lat + "&z=16";

    await bot.sendMessage(chatId, message);

    res.json({ success: true });
  } catch (error) {
    console.error("Telegram location error:", error.message);

    res.status(500).json({
      success: false,
      message: "Не удалось отправить геопозицию"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
