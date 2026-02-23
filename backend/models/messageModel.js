
import mongoose from 'mongoose';

const { Schema } = mongoose;

const contactSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: { type: String },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value && value.trim().length >= 3 && value.includes('@')
      },
      message: props => {
        return `${props.value} is not a valid email`
      },
    }
  },
  information: {
    type: String,
    required: true,
    minLength: 4
  }
});

export const Message = mongoose.model('Message', contactSchema);