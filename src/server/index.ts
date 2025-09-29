// src/server/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { testConnection } from './config/database';           // 👈 sube un nivel
import obrasRoutes from './routes/obrasRoutes';
import tiendasRoutes from './routes/tiendaRoutes';             // 👈 OJO nombre de archivo

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/obras', obrasRoutes);
app.use('/api/tiendas', tiendasRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API Galería de Arte funcionando' });
});

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await testConnection();
});
