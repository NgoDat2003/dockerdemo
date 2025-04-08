const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3003;

app.use(express.json());

// Kết nối với PostgreSQL
const sequelize = new Sequelize('customerdb', 'postgres', 'password', {
  host: 'customerdb',
  dialect: 'postgres',
});

const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/customers', async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
});

app.post('/customers', async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
});

app.get('/customers/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  res.json(customer);
});

app.put('/customers/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  await customer.update(req.body);
  res.json(customer);
});

app.delete('/customers/:id', async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  await customer.destroy();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Customer Service running on http://localhost:${port}`);
});
