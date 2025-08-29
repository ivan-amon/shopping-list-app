const auth = (req, res, next) => {
  if(req.session && req.session.userId) {
    return next()
  }
  return res.redirect('/login')
}

module.exports = { auth }