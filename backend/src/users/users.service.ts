import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user_token: string): Promise<{ user: User; isNew: boolean }> {
    const existingUser = await this.userModel.findOne({ user_token }).exec();
    if (existingUser) {
      return { user: existingUser, isNew: false };
    }
    const createdUser = new this.userModel({ user_token });
    return { user: await createdUser.save(), isNew: true };
  }

  async getUserByToken(user_token: string): Promise<User | null> {
    return this.userModel.findOne({ user_token }).exec();
  }

  async getUserById(user_id: string): Promise<User | null> {
    return this.userModel.findOne({ user_id }).exec();
  }
}
