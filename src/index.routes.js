import { Router } from 'express'
import nodeRoutes from './routes/nodeRoutes'
import stickRoutes from './routes/stickRoutes'

const router = new Router()


router.use("/nodes", nodeRoutes)
router.use("/controller", stickRoutes)


export default router