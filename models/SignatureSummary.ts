import { Moment } from 'moment';
import Role from '@/general/models/Role';
import User from '@/shared/models/User';

export default class SignatureSummary {
  signedOn: Moment | null = null;
  signedBy: User | null = null;
  role = new Role();

  get signed(): boolean {
    return !!this.signedOn;
  }
}

export interface SignatureData {
  role: Role;
  isSigned: boolean;
}