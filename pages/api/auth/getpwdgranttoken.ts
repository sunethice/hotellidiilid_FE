import { NextApiRequest, NextApiResponse } from 'next';
import requestHandler  from '../../../core/backend/middleware/request-handler';
import hotelbedsService  from '../../../core/backend/services/hotelbeds.service';
import { serialize } from "cookie";
import ApiResponse from '../../../core/types';

const handler = requestHandler.handle()
   .get(async (req: NextApiRequest, res: NextApiResponse) => {
      const resp: ApiResponse = {
         msg : 'Oops! its not available'
      }
      res.status(404).json(resp);
   })
   .post(async (req: NextApiRequest, res: NextApiResponse) => {
      const mHotelbedsService = new hotelbedsService();
      mHotelbedsService.getPasswordGrantToken(req.body.username,req.body.password,req.body.scope).then((response) => {
         if (response.status == 200) {
            res.setHeader("Set-Cookie", serialize("access_token", response.data.access_token, {
               path: "/",
               httpOnly: false, // no javascript can read
               secure: process.env.ENV !== "development", // only send this cookie over https connections when environment not in development
               maxAge: response.data.expires_in,
                  // expires:new Date(0),
               }));
               const resp: ApiResponse = {
                     msg : 'token retrieved successfully.'
               }
               res.status(200).json(resp);
            }
         }).catch(error =>{
            console.log(error);
         });
   });

export default handler;
