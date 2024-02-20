import { NextApiRequest, NextApiResponse } from 'next';
import requestHandler  from '../../core/backend/middleware/request-handler';
import BookingService  from '../../core/backend/services/booking.service';
import ApiResponse from '../../core/types';

const handler = requestHandler.handle()
   .get(async (req: NextApiRequest, res: NextApiResponse) => {
      const resp: ApiResponse = {
         msg : 'Oops! its not available'
      }
      res.status(404).json(resp);
   })
   .post(async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         const inserted = await BookingService.runBookingProcess(req.body.key);
         if (inserted.pSuccess) {
            const resp: ApiResponse = {
               msg: 'Booking processed successfully.',
               data: inserted
            }
            res.status(200).json(resp);
         }
         else {
            const resp: ApiResponse = {
               msg: 'Booking process unsuccessfully.',
               data: inserted
            }
            res.status(200).json(resp);
         }
      } catch (error) {
         const resp: ApiResponse = {
            msg : error.message,
            errors : error.errors,
            data : error
         }
         res.status(404).json(resp);
      }
         // .then((response) => {
         //    console.log("processBooking-then",response);
         //    if (response.status === 200) {
         //       const resp: ApiResponse = {
         //          msg: 'booked successfully.',
         //          data: response
         //       }
         //       res.status(200).json(resp);
         //    }
         // }).catch((error) => {
         //    console.log("processBooking-catch", error);
         //    return error;
         // });
   });

export default handler;
