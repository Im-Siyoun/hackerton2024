import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './types/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './types/user.model';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async createUser(data: CreateUserDto): Promise<User> {
    const User = await this.UserModel.create(data);

    return User;
  }

  async findAll(): Promise<User[]> {
    const Users = await this.UserModel.find();

    return Users;
  }

  async findOne(id: string): Promise<User> {
    const User = await this.UserModel.findOne({ id: id });

    return User;
  }

  async updateUser(id: string, data: Partial<CreateUserDto>): Promise<User> {
    const User = await this.UserModel.findByIdAndUpdate(id, data);

    return User;
  }

  async deleteUser(id: string): Promise<any> {
    const result = await this.UserModel.findByIdAndDelete(id);

    return result;
  }
}
