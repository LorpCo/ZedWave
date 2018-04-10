import { Router } from 'express'
import stickController from '../controllers/stickController'


const router = new Router()


// POST to add a node
router.route('/commands/add')
  .post(stickController.include)
// POST to remove a node
router.route('/commands/remove')
  .post(stickController.remove)
// POST Manually remove a dead node
router.route('/commands/removedead/:id')
  .post(stickController.removeDead)


export default router
