// order-service/index.js
import express from 'express';
import axios from 'axios';
import CircuitBreaker from 'opossum';
import axiosRetry from 'axios-retry';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// Retry config
axiosRetry(axios, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000,
  retryCondition: error => error.response?.status >= 500
});

// Rate limiter
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests to Order Service'
}));

// Timeout logic
function timeoutPromise(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout!')), ms));
}

// Circuit Breakers
const paymentBreaker = new CircuitBreaker(() => axios.post('http://localhost:3002/pay'), {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});
const shippingBreaker = new CircuitBreaker(() => axios.post('http://localhost:3004/ship'), {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});


app.post('/order', async (req, res) => {
  try {
    const paymentResult = await Promise.race([
      paymentBreaker.fire(),
      timeoutPromise(3000)
    ]);

    const shippingResult = await Promise.race([
      shippingBreaker.fire(),
      timeoutPromise(3000)
    ]);

    res.status(201).json({
      message: 'Order created successfully',
      payment: paymentResult.data,
      shipping: shippingResult.data
    });
  } catch (err) {
    res.status(500).json({
      error: 'Order creation failed',
      detail: err.message
    });
  }
});

app.listen(3001, () => {
  console.log('✅ Order Service running on port 3001');
});
