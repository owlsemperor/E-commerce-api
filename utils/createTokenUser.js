const createTokenUser = async (user) => {
  return {
    name: user.name,
    userId: user._id.toString(),
    role: user.role,
  }
}
module.exports = createTokenUser
