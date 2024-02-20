import { NextApiRequest, NextApiResponse } from 'next';
import requestHandler  from '../../core/backend/middleware/request-handler';
import BookingService  from '../../core/backend/services/booking.service';
import { serialize } from "cookie";
import ApiResponse from '../../core/types';

const handler = requestHandler.handle()
   .get(async (req: NextApiRequest, res: NextApiResponse) => {
      const resp: ApiResponse = {
         msg: 'cached key successfully.'
      }
      res.status(200).json(resp);
   })
   .post(async (req: NextApiRequest, res: NextApiResponse) => {
      const cacheDetails = {
         token: req.headers.authorization,
         booking: req.body.details
      }
      BookingService.cacheTemporaryBooking(req.body.key, cacheDetails)
      const resp: ApiResponse = {
         msg: 'cached successfully.',
      }
      res.status(200).json(resp);
   });

export default handler;
