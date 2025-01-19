const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      maxlength: 60,
    },
    description: {
      type: String,
      required: true,
      maxlength: 255,
    },
    // category: {
    //   type: String,
    //   enum: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Miscellaneous'],
    //   required: true,
    // },
    user: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);