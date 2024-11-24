import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());

// Permitir solicitudes desde el frontend (en puerto 3000)
app.use(cors({
  origin: 'http://localhost:5173', // Asegúrate de usar el puerto correcto de Vite
}));

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/formDB")
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((error) => console.error("Error conectando a MongoDB:", error));

// Esquema y modelo de Mongoose
const FormDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const FormData = mongoose.model("FormData", FormDataSchema);

// Ruta para recibir datos del formulario
app.post("/api/form", async (req, res) => {
  try {
    const newFormData = new FormData(req.body);
    await newFormData.save();
    res.status(201).json({ message: "Formulario guardado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error guardando formulario", error });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
