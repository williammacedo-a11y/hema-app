export class UpdateProfileDto {
  name?: string;
  phone?: string;
  cpf?: string;
  password?: string; 
  settings?: any;
  avatar_url?: string;
}

export class SupportTicketDto {
  subject: string;
  message: string;
}
