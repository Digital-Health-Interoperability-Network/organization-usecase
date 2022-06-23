const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/Users/user_model');
const Organization = require('../models/organization_model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/mail');
const { createSendToken } = require('../services/authentication');

//signing user up
exports.signup = catchAsync(async (req, res, next) => {
  // 1) Add the user email
  const newUser = await User.create({
    email: req.body.email,
  });

  // 2) Generate the Random confirmation code
  const otp = await newUser.createConfirmationToken();

  //3 Save the otp to db
  await newUser.save({ validateBeforeSave: false });
  console.log(otp);

  //3) Send the otp to the user.
  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new Email(req.body.email).otpVerification(otp);
  res.status(201).json({
    status: 'success',
    data: {
      message: 'Check your mail for the code',
    },
  });
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  //1) hash the otp token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.otp)
    .digest('hex');

  //2) get user using email and hashedToken
  const user = await User.findOne({
    email: req.body.email,
    confirmationCode: hashedToken,
    confirmationCodeExpires: { $gt: Date.now() },
  });

  //3) Check if user exists
  if (!user) return next(new AppError('Wrong OTP or Expired OTP', 401));

  //4) Delete user from db

  res.status(200).json({
    status: 'Success',
    data: {
      message: 'verification successfull',
    },
  });
});

//resend otp to email
exports.resendOTP = catchAsync(async (req, res, next) => {
  //1) find user using email
  const user = await User.findOne({ email: req.body.email });

  //2) verify if user exist
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }

  // 3) Generate the Random confirmation code
  const otp = await user.createConfirmationToken();

  //4) Save the otp to db
  await user.save({ validateBeforeSave: false });

  try {
    // const url = `${req.protocol}://${req.get(
    //   'host'
    // )}/emailverification/${emailCode}`;
    // await new Email(user, url).sendVerificationCode();
    // eslint-disable-next-line no-console
    await new Email(req.body.email).otpVerification(otp);
    res.status(200).json({
      status: 'success',
      message: 'succesfully sent to email',
    });
  } catch (err) {
    return next(
      next(
        new AppError('There was an error sending email, Try again letter'),
        500
      )
    );
  }
});

exports.createOrganization = catchAsync(async (req, res, next) => {
  // req.body = JSON.parse(req.body);
  // req.body.telecom = JSON.parse(req.body.telecom);
  // console.log(req.body, 'afer passing');
  //1) Ensure there is an email in the telecom
  const proof = req.body.telecom.find((e) => e.system === 'email');
  if (!proof) return next(new AppError('Organiztion must have an email'));

  //1) Check through all organizations to ensure this email is unique
  // const org = await Organization.findOne({
  //   'telecom.system': 'email',
  //   'telecom.value': 'posh@gmail.com',
  // });
  const org = await Organization.findOne({
    'locals.telecom': {
      $elemMatch: { value: proof.value, system: 'email' },
    },
  });
  if (org) return next(new AppError('email already in use', 400));

  const newOrg = await Organization.create(req.body);

  // await new Email(proof.value).sendWelcome();
  // res.status(201).json({
  //   status: 'success',
  //   data: {
  //     newOrganization: newOrg,
  //   },
  // });
  createSendToken(newOrg, 201, res);
});

//login organization
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter email or password', 400));
  }

  const organization = await Organization.findOne({
    'telecom.value': email,
  }).select('+password');

  if (
    !organization ||
    !(await organization.correctPassword(password, organization.password))
  ) {
    return next(new AppError('incorrect user or password', 401));
  }

  createSendToken(organization, 201, res);
});

// //Logout organization
exports.logout = (req, res) => {
  res.cookie('jwt', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// //protect routes for signed in organizations
exports.protect = catchAsync(async (req, res, next) => {
  //1) get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('you are not logged in. please login to get access', 401)
    );
  }

  //2) verification of the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if user still exists
  const currentOrganization = await Organization.findById(decoded.id);
  if (!currentOrganization) {
    return next(
      new AppError('The organization with this token do no longer exist', 401)
    );
  }

  //4) check if user Changed password after the token was issued
  if (currentOrganization.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'Organization Recently changed password. please login again',
        401
      )
    );
  }
  //grant access to the protected route
  req.organization = currentOrganization;
  //   res.locals.user = currentUser;
  next();
});

// //restrict access
// exports.restrictTo = (admin) => (req, res, next) => {
//   if (req.user.role !== admin) {
//     return next(
//       new AppError('You do not have the permission to perform this action', 403)
//     );
//   }
//   next();
// };

// //updates organization password
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from the collection
  const organization = await Organization.findById(req.organization.id).select(
    '+password'
  );

  //2) Check if Posted current password is correct
  if (
    !(await organization.correctPassword(
      req.body.currentPassword,
      organization.password
    ))
  )
    return next(new AppError('current Password incorrect', 401));

  //3) If so, update password
  organization.password = req.body.password;
  organization.confirmPassword = req.body.confirmPassword;
  await organization.save();

  //4) log organization in, send Jwt
  createSendToken(organization, 200, res);
});

// //forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get organization based on posted email
  const organization = await Organization.findOne({
    'telecom.value': req.body.email,
  });

  if (!organization) {
    return next(new AppError('There is no user with that address', 404));
  }

  //2) generate the random request token
  // const resetToken = user.createPasswordResetToken();
  const resetToken = await organization.createConfirmationToken();
  await organization.save({ validateBeforeSave: false });

  //3)send it to the users email

  try {
    // const resetURL = `${req.protocol}://${req.get(
    //   'host'
    // )}/api/v1/resetPassword/${resetToken}`;
    // await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token succesfully sent to email',
      resetToken,
    });
  } catch (err) {
    organization.confirmationCode = undefined;
    organization.confirmationCodeExpires = undefined;
    await organization.save({ validateBeforeSave: false });

    return next(
      next(
        new AppError('There was an error sending email, Try again letter'),
        500
      )
    );
  }
});

// //reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get User based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const organization = await Organization.findOne({
    confirmationCode: hashedToken,
    confirmationCodeExpires: { $gt: Date.now() },
  });
  //2) If token has not expired, and there is user, set the new password
  if (!organization) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  organization.password = req.body.password;
  organization.confirmPassword = req.body.confirmPassword;
  organization.confirmationCode = undefined;
  organization.confirmationCodeExpires = undefined;
  await organization.save();

  //3) update changedPasswordAt property for the user

  //4) log the user in, send jwt
  createSendToken(organization, 200, res);
});
