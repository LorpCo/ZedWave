import { Router } from 'express'

import ZedNode from '../models/zednode'
import * as nodeServer from '../lib/zwaveServer'
import nodeController from '../controllers/nodeController'



const router = new Router()



router.route('/')
  .get(nodeController.list)

// GET fetch a single node
router.route('/:nodeid')
  .get(nodeController.show)
  .delete(nodeController.remove)

// GET Node Classes
router.route('/:nodeid/classes')
  .get(nodeController.getClasses)

// GET Node Configuration
router.route('/:nodeid/configuration')
  .post(nodeController.getConfig)

// GET Specific config value
router.route('/:nodeid/configValue/:valueId')
  .post(nodeController.getConfigValue)

// POST Send a device command
router.route('/:nodeid/sendCommand/:command')
  .post(nodeController.sendCommand)

//POST to change a class parameter
router.route('/:nodeid/writeValue/:zedId/:commandClass/:instance/:index/:value')
  .post(nodeController.changeClassParam)

//POST set a class param size
router.route('/:nodeid/setConfig/:paramId/:paramValue/:paramSize')
  .post(nodeController.setClassParamSize)

export default router