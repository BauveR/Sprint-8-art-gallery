// src/routes/obrasRoutes.ts
import { Router } from 'express'
import {
  getObras, getObraById, createObra, getObrasConUbicacion,
  deleteObra, getRelaciones,
  vincularTienda, desvincularTienda,
  vincularExposicion, desvincularExposicion,
  updateObra,
} from '../controllers/obrasController'

const router = Router()

router.get('/', getObras)
router.get('/ubicacion', getObrasConUbicacion)
router.get('/:id', getObraById)
router.post('/', createObra)
router.put('/:id', updateObra)
router.delete('/:id', deleteObra)

router.get('/:id/relaciones', getRelaciones)
router.post('/:id/vincular/tienda', vincularTienda)
router.delete('/:id/vincular/tienda', desvincularTienda)
router.post('/:id/vincular/exposicion', vincularExposicion)
router.delete('/:id/vincular/exposicion', desvincularExposicion)

export default router
