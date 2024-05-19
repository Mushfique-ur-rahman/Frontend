const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); 

const app = express();
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "store",
});

app.get("/product", (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
});

app.post("/add", (req, res) => {
    const sql = "INSERT INTO product (name, description, price) VALUES (?, ?, ?)";
    const values = [req.body.name, req.body.description, req.body.price];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error in MySQL:", err);
        res.status(500).json({ error: "Error in database operation", details: err.message });
      } else {
        res.status(201).json({ message: "Product added successfully", result: result });
      }
    });
});

app.delete("/product/:id", (req, res) => {
  const sql = "DELETE FROM product WHERE id = ?";
  const values = [req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error in MySQL:", err);
      res.status(500).json({ error: "Error in database operation", details: err.message });
    } else {
      res.status(200).json({ message: "Product deleted successfully", result: result });
    }
  });
});

app.put("/product/:id", (req, res) => {
  const { name, description, price } = req.body;
  const sql = "UPDATE product SET name = ?, description = ?, price = ? WHERE id = ?";
  const values = [name, description, price, req.params.id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error in MySQL:", err);
      res.status(500).json({ error: "Error in database operation", details: err.message });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.status(200).json({ message: "Product updated successfully", result: result });
      }
    }
  });
});

app.listen(8081, () => {
    console.log("Connected to the server");
});
