const Practitioner = require('../models/_Personnel/Practitioner/practitioner_model');
const Contact = require('../models/contact_model');
// const HumanName = require('../models/human_name_schema');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createData = async (id, Model, body) => {
  const data = await Model.findById(id);
  data.name = body;
  await data.save();
  return await data.name;
};

exports.createHumanName = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const text = `${req.body.prefix} ${req.body.family} ${req.body.given} ${req.body.suffix}`;
  req.body.text = text;
  let data;
  if (req.baseUrl.startsWith('/api/v1/practitioner')) {
    data = await createData(id, Practitioner, req.body);
  } else if (req.baseUrl.startsWith('/api/v1/contact')) {
    data = await createData(id, Contact, req.body);
  } else {
    return next(new AppError('Invalid url', 405));
  }

  res.status(200).json({
    status: 'success',
    data: {
      humanName: data,
    },
  });
});

// exports.updateHumanName = catchAsync(async (req, res, next) => {
//   const updatedHumanName = await HumanName.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   if (!updatedHumanName) return next(new AppError('Address id not found', 404));

//   res.status(200).json({
//     status: 'success',
//     data: {
//       updatedHumanName,
//     },
//   });
// });

// exports.deleteHumanName = catchAsync(async (req, res, next) => {
//   const deletedHumanName = await HumanName.findByIdAndDelete(req.params.id);

//   if (!deletedHumanName) return next(new AppError('Address id not found', 404));
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
