import { PartialType } from '@nestjs/mapped-types';
import { CreateTricycleDto } from './create-tricycle.dto';

export class UpdateTricycleDto extends PartialType(CreateTricycleDto) {}
