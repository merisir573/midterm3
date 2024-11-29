import { Injectable } from '@nestjs/common';
import { BookingsService } from '../bookings/bookings.service'; // Correct relative path

@Injectable()
export class ListingsService {
  private listings: any[] = []; // In-memory storage for listings

  constructor(private readonly bookingsService: BookingsService) {}

  insertListing(body: { noOfPeople: number; country: string; city: string; price: number }) {
    const listing = {
      id: this.listings.length + 1, // Simple ID generation
      ...body,
    };
    this.listings.push(listing); // Store the listing in memory

    return { status: 'Successful', data: listing };
  }

  queryListings(query: { country: string; city: string; noOfPeople: number; dateFrom: string; dateTo: string }) {
    const filteredListings = this.listings.filter((listing) => {
      // Filter listings by country, city, and noOfPeople
      const isMatchingLocationAndPeople =
        (listing.country === query.country || !query.country) &&
        (listing.city === query.city || !query.city) &&
        (listing.noOfPeople <= query.noOfPeople || !query.noOfPeople);

      // Now we also need to check if the listing is available within the given date range
      const isNotBookedDuringRequestedDates = this.isListingAvailableForBooking(listing.id, query.dateFrom, query.dateTo);

      return isMatchingLocationAndPeople && isNotBookedDuringRequestedDates;
    });

    return {
      status: 'Successful',
      listings: filteredListings,
    };
  }

  queryListingsByRating(query: { country: string; city?: string; rating: number }) {
    const { country, city, rating } = query;
  
    // Filter listings that match the location and have an average rating >= specified rating
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
  
    return { status: 'Successful', listings: filteredListings };
  }
  private isListingAvailableForBooking(listingId: number, dateFrom: string, dateTo: string): boolean {
    // Get all bookings for the listing with `listingId` and check if the dates overlap
    const bookings = this.bookingsService.getBookingsForListing(listingId);

    for (const booking of bookings) {
      const isDateConflict =
        (new Date(dateFrom) >= new Date(booking.dateFrom) && new Date(dateFrom) <= new Date(booking.dateTo)) ||
        (new Date(dateTo) >= new Date(booking.dateFrom) && new Date(dateTo) <= new Date(booking.dateTo)) ||
        (new Date(dateFrom) <= new Date(booking.dateFrom) && new Date(dateTo) >= new Date(booking.dateTo));

      if (isDateConflict) {
        return false; // The listing is already booked for the requested period
      }
    }

    return true; // No conflict, listing is available
  }

  private getAverageRatingForListing(listingId: number): number {
    const reviews = this.bookingsService.getReviewsForListing(listingId);
  
    if (!reviews.length) return 0;
  
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }
}
