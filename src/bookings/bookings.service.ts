import { Injectable } from '@nestjs/common';

@Injectable()
export class BookingsService {
  private bookings: any[] = [];
  private reviews: any[] = []; 

  bookStay(body: { listingId: number; namesOfPeople: string[]; dateFrom: string; dateTo: string }) {
    const booking = {
      id: this.bookings.length + 1,
      listingId: body.listingId,
      namesOfPeople: body.namesOfPeople,
      dateFrom: body.dateFrom,
      dateTo: body.dateTo,
    };
    this.bookings.push(booking);

    return { status: 'Successful', data: booking };
  }

  getBookingsForListing(listingId: number) {
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

    this.reviews.push(review);

    return { status: 'Successful', data: review };
  }

  getReviewsForListing(listingId: number) {
    return this.reviews.filter((review) => review.listingId === listingId);
  }
}
