const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3002;

app.use(express.json());

// Kết nối với PostgreSQL
const sequelize = new Sequelize('orderdb', 'postgres', 'password', {
  host: 'orderdb',
  dialect: 'postgres',
});

const Order = sequelize.define('Order', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/orders', async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
});

app.get('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
});

app.put('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  await order.update(req.body);
  res.json(order);
});

app.delete('/orders/:id', async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  await order.destroy();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Order Service running on http://localhost:${port}`);
});
