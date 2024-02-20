import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import ApiResponse from '../../types';
// import secureApi from './secure-api';

/**
 * @module requestHandler
 * @description Global next-connect request handler. use this to manage all API requests
 */
module requestHandler {
    const config = {
        onError : (error, req, res) => {
            const resp: ApiResponse = {
                msg : error.message,
                errors : error.errors
            }
            res.status(500).json(resp);
        },
        onNoMatch : (req: NextApiRequest, res: NextApiResponse) => {
            const resp: ApiResponse = {
                msg : 'Oops! This API is not available'
            }
            res.status(404).json(resp);
        },
        attachParams: true 
    };
    export function handle() {
        return nc(config);
        // .use(secureApi);
    }
}

export default requestHandler;