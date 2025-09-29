// src/server/routes/obrasRoutes.ts
import { Router } from 'express'
import {
  getObras,
  getObraById,
  createObra,
  getObrasConUbicacion,
  deleteObra,
  getRelaciones,
  vincularTienda, desvincularTienda,
  vincularExposicion, desvincularExposicion,
  updateObra,
} from '../controllers/obrasController'

const router = Router()

// PROBE 2: ¿entra al router bajo /api/obras?
router.put('/__probe/:id', (req, res) => {
  return res.json({
    ok: true,
    where: 'obrasRoutes.ts router PUT',
    id: req.params.id,
    body: req.body,
  })
})

// Rutas reales
router.get('/', getObras)
router.get('/ubicacion', getObrasConUbicacion)
router.get('/:id', getObraById)
router.post('/', createObra)
router.put('/:id', updateObra)      // ← PUT real
router.delete('/:id', deleteObra)

router.get('/:id/relaciones', getRelaciones)
router.post('/:id/vincular/tienda', vincularTienda)
router.delete('/:id/vincular/tienda', desvincularTienda)
router.post('/:id/vincular/exposicion', vincularExposicion)
router.delete('/:id/vincular/exposicion', desvincularExposicion)

export default router
