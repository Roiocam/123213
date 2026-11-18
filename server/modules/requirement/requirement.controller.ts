import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { NeedLogin } from '@lark-apaas/fullstack-nestjs-core';

import {
  CreateRequirementDto,
  RequirementListQueryDto,
  UpdateRequirementDto,
  UpdateRequirementStatusDto,
} from './dto/requirement.dto';
import { RequirementService } from './requirement.service';

@NeedLogin()
@Controller('api/requirements')
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) {}

  @Post('seed/reset')
  resetSeed() {
    return this.requirementService.resetToSeed();
  }

  @Post('bitable/sync')
  syncBitable() {
    return this.requirementService.syncPending();
  }

  @Get('bitable/sync-info')
  bitableSyncInfo() {
    return this.requirementService.getSyncInfo();
  }

  @Get('bitable/ping')
  bitablePing() {
    return this.requirementService.pingBitable();
  }

  @Get()
  list(@Query() query: RequirementListQueryDto) {
    return this.requirementService.list(query);
  }

  @Post()
  create(@Body() dto: CreateRequirementDto) {
    return this.requirementService.create(dto);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementStatusDto,
    @Req() req: Request,
  ) {
    return this.requirementService.changeStatus(
      id,
      dto.status,
      req.userContext.userId,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRequirementDto,
    @Req() req: Request,
  ) {
    return this.requirementService.update(
      id,
      dto,
      req.userContext.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requirementService.remove(id);
  }
}
