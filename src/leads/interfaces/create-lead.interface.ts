import { CreateLeadDto } from '../dto/create-lead.dto';

export interface CreateUserInterface extends CreateLeadDto {
  status: string;
}
