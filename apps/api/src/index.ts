import express = require("express");

const app = express();
app.use(express.json());

app.get("/tasks", (req, res) => {
  res.json([{ id: "1", title: "Test Task", completed: false }]);
});

app.listen(3001, () => {
  console.log("API running on http://localhost:3001");
});
