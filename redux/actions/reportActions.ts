import {
    UPDATE_TURNOVER_RESULTS,
    UPDATE_RESERVATION_RESULTS,
    UPDATE_MARKUP_RESULTS
} from '../types';

export const updateTurnoverResultList = (resultsList) =>  ({
    type: UPDATE_TURNOVER_RESULTS,
    payload: resultsList
});

export const updateReservationResultList = (resultsList) =>  ({
    type: UPDATE_RESERVATION_RESULTS,
    payload: resultsList
});

export const updateMarkupResultList = (resultsList) =>  ({
    type: UPDATE_MARKUP_RESULTS,
    payload: resultsList
});