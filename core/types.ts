/**
 * TS Types for both frontend and backend
 */
 export default interface ApiResponse {
   data ?: any
   msg : string,
   errors ?: [string]
 }

  export interface SelectReturnObj {
   value: string
   label : string
}

export interface BannerProps {
    noOfResults : number
}

export interface SearchWidgetState{
   location: object,
   selectedlocation: string,
   checkinDate: Date,
   checkoutDate: Date,
   minCheckIn: Date,
   minCheckOut: Date,
   noNights: number,
   noRooms: number,
   occupancies:
   {
      room_no: number,
      adults:number,
      children: number,
      children_age: []
    }[],
   hasChildren: boolean,
}

export interface RoomObj {
   room_no: number,
   adults:number,
   children: number,
   children_age: Array<string>
}