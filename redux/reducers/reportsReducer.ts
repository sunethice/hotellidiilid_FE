import {
    UPDATE_TURNOVER_RESULTS,
    UPDATE_RESERVATION_RESULTS,
    UPDATE_MARKUP_RESULTS
} from '../types';
 
 const reportsReducer = (state = { app: 'init', page: 'init' }, action) => {
    const { type, payload } = action;
    switch (action.type) {
       case 'persist/REHYDRATE': {
             const data = action.payload;
             if (data) {
                 return {
                     ...state,
                     ...data.reports
                 }
             }
         }
       case UPDATE_TURNOVER_RESULTS:
           return { ...state, turnoverResults: payload };
       case UPDATE_RESERVATION_RESULTS:
           return { ...state, reservationResults: payload };
       case UPDATE_MARKUP_RESULTS:
           return { ...state, markupResults: payload };
       default: 
          return { ...state };
    }
 };
 
 export default reportsReducer;