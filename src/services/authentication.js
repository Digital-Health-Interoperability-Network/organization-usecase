const jwt = require('jsonwebtoken');

//sign jwt token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (organization, statusCode, res) => {
  const token = signToken(organization._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  organization.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      organization,
    },
  });
};
