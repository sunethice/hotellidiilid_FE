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

const searchReducer = (state = { app: 'init', page: 'init' }, action) => {
   const { type, payload } = action;
   switch (action.type) {
      case 'persist/REHYDRATE': {
            const data = action.payload;
            if (data) {
                return {
                    ...state,
                    ...data.search
                }
            }
        }
      case UPDATE_SERCH_OBJ:
          return { ...state, searchObj: payload };
      case UPDATE_AVAILABILITY_LIST:
         return { ...state, avalList: payload };
      case UPDATE_AVAILABILITY_META:
         return { ...state, avalMeta: payload };
      case UPDATE_IS_LOADING:
         return { ...state, isLoading: payload };
      case UPDATE_SELECTED_HOTEL:
         return { ...state, selectedHotel: payload };
      case UPDATE_SELECTED_HOTEL_STATIC:
         return { ...state, selectedHotelStatic: payload };
      case UPDATE_SELECTED_BOARDS:
         return { ...state, selectedBoards: payload };
      case UPDATE_SELECTED_ROOMS:
         return { ...state, selectedRooms: payload };
      case UPDATE_PAX_KEYS:
         return {...state, paxKeys: payload};
      case UPDATE_PAX:
         return {...state, pax: payload};
      default:
         return { ...state };
   }
};

export default searchReducer;
