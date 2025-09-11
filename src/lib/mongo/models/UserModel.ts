import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  spotifyId?: string;
  googleId?: string;
  displayName: string;
  email: string;
  password?: string;
  accessToken: string;
  refreshToken: string;
  profileImageUrl?: string;
  lastLogin: Date;
  localSignup: boolean;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    spotifyId: { type: String, unique: true, sparse: true },
    googleId: { type: String, unique: true, sparse: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: false, sparse: true },
    password: {
      type: String,
      required: function () {
        return this.localSignup;
      },
    },

    accessToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },
    profileImageUrl: { type: String },
    lastLogin: { type: Date, default: Date.now },
    localSignup: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 비밀번호 해싱
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error) {
    const err = error as Error;
    next(err);
  }
});

// localSignup 또는 소셜 ID 하나 필수
userSchema.pre('validate', function (next) {
  if (this.localSignup || this.spotifyId || this.googleId) return next();
  return next(new Error('localSignup 또는 소셜 ID 중 하나는 필수입니다.'));
});

// comparePassword 메서드
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

export const UserModel = models.User || model<IUser>('User', userSchema);
