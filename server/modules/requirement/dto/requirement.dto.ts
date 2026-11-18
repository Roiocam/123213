import {
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  PRIORITIES,
  REQUIREMENT_STATUSES,
  REQUIREMENT_TYPES,
  type CreateRequirementRequest,
  type UpdateRequirementRequest,
} from '@shared/api.interface';

export class CreateRequirementDto implements CreateRequirementRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  @IsNotEmpty()
  project!: string;

  @IsIn(REQUIREMENT_TYPES)
  type!: 'feature' | 'improvement' | 'bug' | 'tech';

  @IsIn(PRIORITIES)
  priority!: 'P0' | 'P1' | 'P2' | 'P3';

  @IsIn(REQUIREMENT_STATUSES)
  status!: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

  @IsString()
  @IsNotEmpty()
  owner!: string;

  @IsArray()
  @IsString({ each: true })
  tags!: string[];

  @IsOptional()
  @IsDateString()
  dueDate!: string | null;
}

export class UpdateRequirementDto implements UpdateRequirementRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  project?: string;

  @IsOptional()
  @IsIn(REQUIREMENT_TYPES)
  type?: 'feature' | 'improvement' | 'bug' | 'tech';

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: 'P0' | 'P1' | 'P2' | 'P3';

  @IsOptional()
  @IsIn(REQUIREMENT_STATUSES)
  status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  owner?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  dueDate?: string | null;
}

export class UpdateRequirementStatusDto {
  @IsIn(REQUIREMENT_STATUSES)
  status!: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
}

export class RequirementListQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  project?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  owner?: string;
}
