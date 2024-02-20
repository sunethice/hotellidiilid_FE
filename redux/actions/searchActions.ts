import {
   UPDATE_SERCH_OBJ,
   UPDATE_AVAILABILITY_LIST,
   UPDATE_AVAILABILITY_META,
   UPDATE_IS_LOADING,
   UPDATE_SELECTED_HOTEL,
   UPDATE_SELECTED_HOTEL_STATIC,
   UPDATE_SELECTED_BOARDS,
   UPDATE_SELECTED_ROOMS,
   UPDATE_PAX_KEYS,
   UPDATE_PAX
} from '../types';

export const updateSearchObj = (searchObj) =>  ({
     type: UPDATE_SERCH_OBJ,
     payload: searchObj
});

export const updateAvailabilityList = (avalList) =>  ({
     type: UPDATE_AVAILABILITY_LIST,
     payload: avalList
});


export const updateIsLoading = (isLoading) =>  ({
     type: UPDATE_IS_LOADING,
     payload: isLoading
});

export const updateAvailabilityMeta = (avalMeta) =>  ({
     type: UPDATE_AVAILABILITY_META,
     payload: avalMeta
});

export const updateSelectedHotel = (hotel) =>  ({
     type: UPDATE_SELECTED_HOTEL,
     payload: hotel
});

export const updateSelectedHotelStatic = (hotel) => ({
   type: UPDATE_SELECTED_HOTEL_STATIC,
   payload: hotel
})

export const updateSelectedBoards = (boards) => {
   return {
      type: UPDATE_SELECTED_BOARDS,
      payload: boards
   }
};

export const updateSelectedRooms = (rooms) => {
   return {
      type: UPDATE_SELECTED_ROOMS,
      payload:rooms
   }
};

export const updatePaxKeys = (pPaxKeys) => {
   return {
      type: UPDATE_PAX_KEYS,
      payload:pPaxKeys
   }
}

export const updatePaxDetails = (pPax) => {
   return {
      type: UPDATE_PAX,
      payload: pPax
   }
}