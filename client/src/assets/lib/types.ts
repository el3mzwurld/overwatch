export type LoginResponse = {
  user: User;
  token: string;
};

export type User = {
  id: string;
  createdAt: string;
  email: string;
  userName: string;
};
