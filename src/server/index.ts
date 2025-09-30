// src/server/index.ts
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { testConnection } from './config/database'
import obrasRoutes from './routes/obrasRoutes'
import tiendasRoutes from './routes/tiendaRoutes'

// ⬇️ IMPORTA DIRECTO EL CONTROLADOR PARA BYPASS TEMPORAL
import { updateObra } from './controllers/obrasController'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use((req, _res, next) => {
  console.log(`[SRV] ${req.method} ${req.originalUrl}`)
  next()
})

// PROBE A (sigue de ayuda)
app.put('/api/obras/__probe/:id', (req, res) => {
  res.json({ ok: true, where: 'index.ts direct PUT', id: req.params.id, body: req.body })
})

// ⬇️ BYPASS: REGISTRAMOS AQUÍ EL PUT REAL (sin router)
app.put('/api/obras/:id', updateObra)

// Resto de routers
app.use('/api/obras', obrasRoutes)
app.use('/api/tiendas', tiendasRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API Galería de Arte funcionando' })
})

// Inspector de rutas
app.get('/__routes', (_req, res) => {
  const routes: { method: string; path: string }[] = []
  // @ts-ignore
  app._router.stack.forEach((m: any) => {
    if (m.route?.path) {
      const methods = Object.keys(m.route.methods)
      methods.forEach((meth) => routes.push({ method: meth.toUpperCase(), path: m.route.path }))
    } else if (m.name === 'router' && m.handle?.stack) {
      m.handle.stack.forEach((h: any) => {
        if (h.route?.path) {
          const methods = Object.keys(h.route.methods)
          methods.forEach((meth) => routes.push({ method: meth.toUpperCase(), path: `/api/obras${h.route.path}` }))
        }
      })
    }
  })
  res.json(routes)
})

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  await testConnection()
})
