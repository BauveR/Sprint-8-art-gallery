import { Router } from 'express'
import {
  getObras, getObraById, createObra, getObrasConUbicacion,
  deleteObra, getRelaciones,
  vincularTienda, desvincularTienda,
  vincularExposicion, desvincularExposicion,
  updateObra,
} from '../controllers/obrasController'

const router = Router()

// PROBE dentro del router
router.put('/__probe/:id', (req, res) => {
  res.json({ ok: true, where: 'obrasRoutes.ts router PUT', id: req.params.id, body: req.body })
})

router.get('/', getObras)
router.get('/ubicacion', getObrasConUbicacion)
router.get('/:id', getObraById)
router.post('/', createObra)
router.put('/:id', (req, res) => updateObra(req, res))     // 👈 ESTA ES LA REAL
router.delete('/:id', deleteObra)

router.get('/:id/relaciones', getRelaciones)
router.post('/:id/vincular/tienda', vincularTienda)
router.delete('/:id/vincular/tienda', desvincularTienda)
router.post('/:id/vincular/exposicion', vincularExposicion)
router.delete('/:id/vincular/exposicion', desvincularExposicion)

export default router
