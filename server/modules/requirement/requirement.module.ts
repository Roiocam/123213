import { Module } from '@nestjs/common';
import { BitableSyncService } from './bitable-sync.service';
import { RequirementController } from './requirement.controller';
import { RequirementService } from './requirement.service';

@Module({
  controllers: [RequirementController],
  providers: [RequirementService, BitableSyncService],
})
export class RequirementModule {}
