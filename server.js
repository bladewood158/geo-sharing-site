
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const bot = new TelegramBot(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

app.get("/healthz", (req, res) => {
  res.send("OK");
});

app.post("/location", async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ error: "Invalid coordinates" });
    }

    await bot.sendMessage(
      CHAT_ID,
      `Геопозиция передана с согласия пользователя:\n` +
      `Широта: ${latitude}\n` +
      `Долгота: ${longitude}\n` +
      `Точность: ${accuracy || "не указана"} м\n` +
      `Карта: https://www.google.com/maps?q=${latitude},${longitude}`
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Sending failed" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started on port ${PORT}`);
});
