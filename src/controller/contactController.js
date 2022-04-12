const Contact = require('../models/contact_model');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.createContact = catchAsync(async (req, res, next) => {
  req.body.organization = req.organization.id;
  const contact = await Contact.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      contact,
    },
  });
});

// exports.getAllIdentifiers = catchAsync(async (req, res, next) => {
//   const identifiers = await Identifier.find({});

//   res.status(200).json({
//     status: 'success',
//     result: identifiers.length,
//     data: {
//       identifiers,
//     },
//   });
// });

// exports.getIdentifier = catchAsync(async (req, res, next) => {
//   const identifier = await Identifier.findById(req.params.id);

//   if (!identifier) return next(new AppError('identifier id not found'));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       identifier,
//     },
//   });
// });

// exports.updateIdentifier = catchAsync(async (req, res, next) => {
//   const updatedIdentifier = await Identifier.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (!updatedIdentifier) return next(new AppError('identifier id not found'));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       updatedIdentifier,
//     },
//   });
// });

// exports.deleteIdentifier = catchAsync(
//     async(req, res, next) => {
//     }
// )
