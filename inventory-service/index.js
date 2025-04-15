import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many inventory requests'
}));

let inventoryStatus = 'Available';

app.get('/status', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 5000)); // Delay 5s
  res.json({ status: inventoryStatus });
});
app.listen(3003, () => console.log('📦 Inventory Service chạy ở cổng 3003'));
