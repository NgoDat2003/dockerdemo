const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Chào mừng bạn đến với ứng dụng Node.js chạy trên Docker!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
