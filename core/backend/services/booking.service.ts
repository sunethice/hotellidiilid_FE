import CacheService from "./cache.service";
import hotelbedsService from "./hotelbeds.service";

class BookingService {

   cacheTemporaryBooking(pBookingReference, pTempBookingDetails) {
      CacheService.set(pBookingReference, pTempBookingDetails, 3600);
   }

   getTemporaryBooking(pBookingReference) {
      return CacheService.get(pBookingReference);
   }

   async runBookingProcess(pBookingReference) {
      let mTempBookingDetails = this.getTemporaryBooking(pBookingReference);

      if (!mTempBookingDetails) {
         throw new Error('Temp booking not found');
      }

      const hbService = new hotelbedsService(mTempBookingDetails.token);
      // valuate booking
      const valuation = await hbService.valuateHotelBooking(pBookingReference);

      if (valuation.data.pSuccess) {
         const inserted = await hbService.insertHotelBooking(mTempBookingDetails.booking);
         const insertData = inserted.data;

         // remove temp booking
         CacheService.remove(pBookingReference);

         // return inserted booking
         return insertData;
      }
      else {
         return valuation.data;
      }


   }
}

export default new BookingService()