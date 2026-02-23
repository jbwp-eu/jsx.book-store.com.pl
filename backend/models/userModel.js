import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      // unique: true,
      validate: {
        validator: function (value) {
          return value && value.trim().length >= 3 && value.includes('@')
        },
        message: props => {
          return `${props.value} is not a valid email`
        },
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 4
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
);


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
});


export const User = mongoose.model('User', userSchema);