import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadActionDto } from './create-lead-action.dto';

export class UpdateLeadActionDto extends PartialType(CreateLeadActionDto) {}
