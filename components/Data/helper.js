import moment from "moment";
export const addDaysHelper = (pNoDays = 1, pDate = null) => {
   var mDate = pDate === null ? moment() : moment(pDate);
   mDate.add(pNoDays, "days");
   return mDate.toDate();
};;

export const noOfDaysHelper = (pStartDate, pEndDate) => {
   var startDate = moment(pStartDate);
   var endDate = moment(pEndDate);
   return endDate.diff(startDate, "days");
};

export const formatDateHelper = (pDate) => {
   const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
   ];
   let mDatetime = new Date(pDate);
   let formatted_date = mDatetime.getDate() + 1;
   "-" + months[mDatetime.getMonth()] + "-" + mDatetime.getFullYear();
   return formatted_date;
};

export const formatDateHelper2 = (pDate) => {
   let mDatetime = new Date(pDate);
   let formatted_date =
      mDatetime.getFullYear() +
      "-" +
      (mDatetime.getMonth() + 1) +
      "-" +
      mDatetime.getDate();
   return formatted_date;
};

export const formatDateHelper3 = (pDate) => {
   return moment(pDate).format("DD-MM-YYYY");
};

export const formatDateHelper4 = (pDate) => {
   return moment(pDate).format("YYYY-MM-DD");
};

export const formatDateHelper5 = (pDate) => {
   return moment(pDate).format("DD/MM/YYYY");
};

export const getDay = (pDate) => {
   var mDate = moment(pDate, 'YYYY/MM/DD');
   switch(mDate.isoWeekday()){
      case 1:
         return "Monday";
      case 2:
         return "Tuesdat";
      case 3:
         return "Wednesday";
      case 4:
         return "Thursday";
      case 5:
         return "Friday";
      case 6:
         return "Saturday";
      case 7:
         return "Sunday";
   }
}

export const getTwelveHourDateTime = (pStrDateTime) => {
   return moment(pStrDateTime, ["YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD hh:mm:ss");
} 

export const getDuration = (pDateFrom, pDateTo) => {
   var startDate = moment(pDateFrom, 'YYYY-MM-DD hh:mm:ss');//moment(pDateFrom);
   var endDate = moment(pDateTo, 'YYYY-MM-DD hh:mm:ss');
   var duration = moment.duration(endDate.diff(startDate));
   return duration.asMinutes();
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarO } from "@fortawesome/free-regular-svg-icons";
import styles from "../../styles/Common.module.scss";
export const renderReview = (pCategoryCode) => {
   let mJSX = [];
   let mRate = 0;
   let noOfStars = 0;
   if (pCategoryCode === null) return "";
   if (pCategoryCode.includes("EST")) {
      mRate = pCategoryCode.substring(0, 1);
   } else {
      mRate = parseInt(pCategoryCode.substring(1, 2));
      mRate = mRate + parseInt(pCategoryCode.substring(3)) / 10;
   }
   for (let index = 0; index < parseInt(mRate); index++) {
      noOfStars++;
      mJSX.push(
         <FontAwesomeIcon
            icon={faStar}
            className={`${styles.star} ${styles.checked}`}
         />
      );
   }
   if (mRate - parseInt(mRate) > 0) {
      noOfStars++;
      mJSX.push(
         <FontAwesomeIcon
            icon={faStarHalfAlt}
            className={`${styles.star} ${styles.checked}`}
         />
      );
   }
   let noOfHollowStars = 5 - noOfStars;
   for (let index = 0; index < noOfHollowStars; index++) {
      mJSX.push(
         <FontAwesomeIcon
            icon={faStarO}
            className={`${styles.star} ${styles.checked}`}
         />
      );
   }
   return mJSX;
};
