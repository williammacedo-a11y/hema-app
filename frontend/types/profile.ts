export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  cpf?: string;
  password?: string;
  settings?: any;
}

export interface SupportRequest {
  subject: string;
  message: string;
}
