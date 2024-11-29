import { Controller, Post, Body } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('book')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        listingId: { type: 'number', description: 'ID of the listing to book' },
        namesOfPeople: { type: 'array', items: { type: 'string' }, description: 'Names of people staying' },
        dateFrom: { type: 'string', description: 'Start date of stay', format: 'date' },
        dateTo: { type: 'string', description: 'End date of stay', format: 'date' },
      },
    },
  })
  bookStay(@Body() body: { listingId: number; namesOfPeople: string[]; dateFrom: string; dateTo: string }) {
    return this.bookingsService.bookStay(body);
  }

  @Post('review')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bookingId: { type: 'number', description: 'ID of the booking to review' },
        rating: { type: 'number', description: 'Rating given to the stay' },
        comment: { type: 'string', description: 'Optional comment about the stay' },
      },
    },
  })
  reviewStay(@Body() body: { bookingId: number; rating: number; comment: string }) {
    return this.bookingsService.reviewStay(body);
  }
}
