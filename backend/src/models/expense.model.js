// const mongoose = require('mongoose');

// const ExpenseSchema = new mongoose.Schema(
//   {
//     name: {
//       type: Number,
//       required: true,
//       maxlength: 60,
//     },
//     description: {
//       type: String,
//       required: true,
//       maxlength: 255,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       minlength: 1,
//     },
//     category: {
//       type: String,
//       enum: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Miscellaneous'],
//       required: true,
//     },
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal'],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
