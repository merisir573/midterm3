// listings.module.ts
import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { BookingsModule } from 'src/bookings/bookings.module';

@Module({
  imports: [BookingsModule],
  controllers: [ListingsController],
  providers: [ListingsService],
})
export class ListingsModule {}
