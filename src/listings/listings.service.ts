import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service'; 

@Injectable()
export class ListingsService {
  private listings: any[] = [];

  constructor(private readonly bookingsService: BookingsService) {}

  insertListing(body: { noOfPeople: number; country: string; city: string; price: number }) {
    const listing = {
      id: this.listings.length + 1,
      ...body,
    };
    this.listings.push(listing);

    return { status: 'Successful', data: listing };
  }

  queryListings(query: { 
    country: string; 
    city: string; 
    noOfPeople: number; 
    dateFrom: string; 
    dateTo: string;
    page: number; 
    limit: number;
  }) {
    const filteredListings = this.listings.filter((listing) => {
      const isMatchingLocationAndPeople =
        (listing.country === query.country || !query.country) &&
        (listing.city === query.city || !query.city) &&
        (listing.noOfPeople <= query.noOfPeople || !query.noOfPeople);
  
      const isNotBookedDuringRequestedDates = this.isListingAvailableForBooking(listing.id, query.dateFrom, query.dateTo);
  
      return isMatchingLocationAndPeople && isNotBookedDuringRequestedDates;
    });
  
    const startIndex = (query.page - 1) * query.limit;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + query.limit);
  
    return {
      status: 'Successful',
      listings: paginatedListings,
      totalListings: filteredListings.length,
      totalPages: Math.ceil(filteredListings.length / query.limit),
      currentPage: query.page,
    };
  }
  

  queryListingsByRating(query: { 
    country: string; 
    city?: string; 
    rating: number;
    page: number; 
    limit: number;
  }) {
    const { country, city, rating } = query;
  
    const filteredListings = this.listings
      .filter((listing) => {
        const matchesLocation =
          listing.country === country && (!city || listing.city === city);
  
        const averageRating = this.getAverageRatingForListing(listing.id);
        const matchesRating = averageRating == rating;
  
        return matchesLocation && matchesRating;
      })
      .map((listing) => ({
        ...listing,
        averageRating: this.getAverageRatingForListing(listing.id),
      }));
  
    const startIndex = (query.page - 1) * query.limit;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + query.limit);
  
    return {
      status: 'Successful',
      listings: paginatedListings,
      totalListings: filteredListings.length,
      totalPages: Math.ceil(filteredListings.length / query.limit),
      currentPage: query.page,
    };
  }

  private isListingAvailableForBooking(listingId: number, dateFrom: string, dateTo: string): boolean {
    const bookings = this.bookingsService.getBookingsForListing(listingId);

    for (const booking of bookings) {
      const isDateConflict =
        (new Date(dateFrom) >= new Date(booking.dateFrom) && new Date(dateFrom) <= new Date(booking.dateTo)) ||
        (new Date(dateTo) >= new Date(booking.dateFrom) && new Date(dateTo) <= new Date(booking.dateTo)) ||
        (new Date(dateFrom) <= new Date(booking.dateFrom) && new Date(dateTo) >= new Date(booking.dateTo));

      if (isDateConflict) {
        return false;
      }
    }

    return true;
  }

  private getAverageRatingForListing(listingId: number): number {
    const reviews = this.bookingsService.getReviewsForListing(listingId);
  
    if (!reviews.length) return 0;
  
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}