const Product = require('../models/Product')
const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { checkPermission } = require('../utils')

const createReview = async (req, res) => {
  const { product: productId } = req.body

  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.BadRequestError(
      `No product found with id matching ${productId}`
    )
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError('Already Existed')
  }
  console.log(req.body)
  req.body.user = req.user.userId
  console.log(req.body)
  const review = await Review.create(req.body)

  res.status(StatusCodes.CREATED).json({ review })
}

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${req.params.id}`)
  }

  res.status(StatusCodes.OK).json({ review })
}

const updateReview = async (req, res) => {
  const reviewId = req.params.id
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: reviewId })

  if (!review) {
    throw new CustomError.NotFoundError(`No review with review id ${reviewId}`)
  }
  checkPermission(req.user, review.user)
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res.status(StatusCodes.OK).json({ review })
}

const deleteReview = async (req, res) => {
  const reviewId = req.params.id
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new CustomError.NotFoundError(`No review with review id ${reviewId}`)
  }
  checkPermission(req.user, review.user)

  await review.remove()
  res.status(StatusCodes.OK).json({ msg: 'Review removed' })
}

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
}
