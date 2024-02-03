const express = require('express')
const router = express.Router()
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')
const { get } = require('./reviewRoutes')

router
  .route('/')
  .get(authenticateUser, getAllOrders)
  .post(authenticateUser, authorizePermissions('admin'), createOrder)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrder)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
