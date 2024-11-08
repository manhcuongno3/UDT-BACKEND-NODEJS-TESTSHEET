import { model, property } from '@loopback/repository';
import { UserType } from '../utils/constants';

@model()
export class Credentials {
  @property({
    type: 'string',
    required: true,
    format: 'email',
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    minLength: 6,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    enum: Object.values(UserType),
  })
  userType: UserType;
}
