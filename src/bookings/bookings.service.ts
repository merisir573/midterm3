import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  private bookings: any[] = []; // In-memory storage for bookings
  private reviews: any[] = []; // In-memory storage for reviews

  bookStay(body: { listingId: number; namesOfPeople: string[]; dateFrom: string; dateTo: string }) {
    const booking = {
      id: this.bookings.length + 1,
      listingId: body.listingId,
      namesOfPeople: body.namesOfPeople,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    };
    this.bookings.push(booking); // Store the booking in memory

    return { status: 'Successful', data: booking };
  }

  getBookingsForListing(listingId: number) {
    // Return all bookings that belong to the given listingId
    return this.bookings.filter((booking) => booking.listingId === listingId);
  }

  reviewStay(body: { bookingId: number; rating: number; comment: string }) {
    const booking = this.bookings.find((b) => b.id === body.bookingId);
    if (!booking) {
      return { status: 'Error', message: 'Booking not found' };
    }

    const review = {
      bookingId: body.bookingId,
      listingId: booking.listingId,
      rating: body.rating,
      comment: body.comment,
    };

    this.reviews.push(review); // Store the review in memory

    return { status: 'Successful', data: review };
  }

  getReviewsForListing(listingId: number) {
    // Return all reviews for the given listingId
    return this.reviews.filter((review) => review.listingId === listingId);
  }
}
