import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('Listings')
@Controller({ path: 'listings', version: '1' }) 
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post('insert')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        noOfPeople: { type: 'number', description: 'Number of people the listing accommodates' },
        country: { type: 'string', description: 'Country of the listing' },
        city: { type: 'string', description: 'City of the listing' },
        price: { type: 'number', description: 'Price per night' },
      },
    },
  })
  insertListing(@Body() body: { noOfPeople: number; country: string; city: string; price: number }) {
    return this.listingsService.insertListing(body);
  }

  @Get('query')
  @ApiQuery({ name: 'country', type: 'string', required: false, description: 'Filter by country' })
  @ApiQuery({ name: 'city', type: 'string', required: false, description: 'Filter by city' })
  @ApiQuery({ name: 'noOfPeople', type: 'number', required: false, description: 'Filter by number of people' })
  @ApiQuery({ name: 'dateFrom', type: 'string', required: false, description: 'Start date of availability', format: 'date' })
  @ApiQuery({ name: 'dateTo', type: 'string', required: false, description: 'End date of availability', format: 'date' })
  queryListings(@Query() query: { country: string; city: string; noOfPeople: number; dateFrom: string; dateTo: string }) {
    return this.listingsService.queryListings(query);
  }

  @Get('report-by-rating')
  @ApiQuery({ name: 'country', type: 'string', required: true, description: 'Country to filter by' })
  @ApiQuery({ name: 'city', type: 'string', required: false, description: 'City to filter by' })
  @ApiQuery({ name: 'rating', type: 'number', required: true, description: 'Minimum rating to filter by' })
  queryListingsByRating(
    @Query('country') country: string,
    @Query('city') city: string,
    @Query('rating') rating: number,
  ) {
    return this.listingsService.queryListingsByRating({ country, city, rating: +rating });
  }
}
