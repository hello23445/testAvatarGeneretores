import express from 'express';
import fetch from 'node-fetch';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';

const app = express();
const upload = multer({ dest: 'uploads/' });

const BOT_TOKEN = '8110009554:AAHHqWor-TEgbvoi7kdeuW7J4da3M24FJGk';
// const PROVIDER_TOKEN = 'ТВОЙ_PROVIDER_TOKEN_ДЛЯ_STARS';
const PORT = 3000;

// Хранилище данных пользователей
let users = {}; // { userId: { attempts: number, paid: boolean } }

// Проверка/получение оставшихся попыток
app.get('/api/attempts', (req, res) => {
  const userId = req.query.userId;
  if (!users[userId]) {
    users[userId] = { attempts: 2, paid: false };
  }
  res.json({ attempts: users[userId].attempts });
});

// Генерация AI-аватарки
app.post('/api/generate', upload.single('photo'), async (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) users[userId] = { attempts: 2, paid: false };

  if (users[userId].attempts <= 0 && !users[userId].paid) {
    return res.json({ error: "Нет попыток. Купите пакет." });
  }

  users[userId].attempts--;

  // Тут можно вставить свой AI API, пока просто вернём ту же картинку
  const imageUrl = `data:image/jpeg;base64,${fs.readFileSync(req.file.path).toString('base64')}`;
  fs.unlinkSync(req.file.path); // удаляем загруженный файл

  res.json({ imageUrl });
});

// Создание счёта на покупку звёзд
app.get('/api/buy', async (req, res) => {
  const userId = req.query.userId;

  const invoiceData = {
    chat_id: userId,
    title: "Пакет генераций",
    description: "10 генераций AI-аватарок",
    payload: "buy_avatars",
    // provider_token: PROVIDER_TOKEN,
    currency: "XTR",
    prices: [{ label: "10 генераций", amount: 5000000 }]
  };

  const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoiceData)
  });

  const data = await resp.json();
  if (data.ok) {
    res.json({ invoiceUrl: data.result });
  } else {
    res.json({ error: "Ошибка создания счёта" });
  }
});

// Обработка успешной оплаты (тут webhook от бота)
app.post('/payment-success', express.json(), (req, res) => {
  const { userId } = req.body;
  if (!users[userId]) users[userId] = { attempts: 2, paid: false };
  users[userId].paid = true;
  users[userId].attempts += 10;
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
