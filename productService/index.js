const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3001;

app.use(express.json());

// Kết nối với PostgreSQL
const sequelize = new Sequelize('productdb', 'postgres', 'password', {
  host: 'productdb',
  dialect: 'postgres',
});

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

sequelize.sync();

app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.get('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

app.put('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.update(req.body);
  res.json(product);
});

app.delete('/products/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  await product.destroy();
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Product Service running on http://localhost:${port}`);
});
