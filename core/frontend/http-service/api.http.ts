import { api } from './api';

/**
 * @function getClientToken
 * @description
 */
export function getClientToken() {
   return api.post('/api/auth/gettoken');
}

export function getPWDGrantToken(pData) {
   return api.post('/api/auth/getpwdgranttoken', pData);
}

export function onProceedToBooking(pKey, pGuestDetails) {
   return api.post('/api/cacheguests', {
      key: pKey,
      details:pGuestDetails
   });
}

export function onBookNow(pKey) {
   return api.post('/api/booknow',{
      key:pKey
   });
}