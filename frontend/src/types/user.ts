export interface UserBase {
  id: number;
  email: string;
}

export type AuthInfo = {
  email: string;
  password: string;
};
