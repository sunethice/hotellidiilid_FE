export const selectStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "transparent" }),
  input: (styles) => ({ ...styles, color: "#fff", fontWeight: "600" }),
//   input: (provided) => ({
//    ...provided,
//    input: {
//      opacity: "1 !important",
//    },
//  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#fff",
  }),
};

export const selectWidth175 = {
   control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      // maxWidth: "175px",
   }),
   input: (styles) => ({ ...styles, color: "#fff", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   singleValue: (styles) => ({
      ...styles,
      color: "#fff",
   }),
};

export const smallSelectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
    width: "50px",
  }),
  input: (styles) => ({ ...styles, color: "#fff", fontWeight: "600" }),
  input: (provided) => ({
   ...provided,
   input: {
     opacity: "1 !important",
   },
 }),
  indicatorsContainer: (styles) => ({
    ...styles,
    padding: "2px",
    width: "23px",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    padding: "2px",
    width: "16px",
    // minHeight: "30px",
    // height: "30px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#fff",
  }),
};
export const selectStyles_2 = {
   // control: (styles) => ({ ...styles, backgroundColor: "transparent" }),
   input: (styles) => ({ ...styles, color: "#7e7e7e", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   singleValue: (styles) => ({
      ...styles,
      color: "#7e7e7e",
   }),
   menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};
export const smallSelectStyles_2 = {
   control: (styles) => ({
      ...styles,
      backgroundColor: "transparent",
      width: "50px",
   }),
   input: (styles) => ({ ...styles, color: "#7e7e7e", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   indicatorsContainer: (styles) => ({
      ...styles,
      padding: "2px",
      width: "23px",
   }),
   dropdownIndicator: (styles) => ({
      ...styles,
      padding: "2px",
      width: "16px",
      // minHeight: "30px",
      // height: "30px",
   }),
   singleValue: (styles) => ({
      ...styles,
      color: "#7e7e7e",
   }),
};

export const summarySelectStyles = {
   control: (styles) => ({
      ...styles,
      fontSize: "12px",
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "1px solid #9f9f9f",
      borderRadius: "0",
      boxShadow: "none",
      outline: "0",
      minHeight: "32px",
   }),
   input: (styles) => ({ ...styles, color: "#7e7e7e", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   placeholder: (styles) => ({ ...styles, color: "#9f9f9f" }),
   indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "none",
   }),
   indicatorsContainer: (styles) => ({
      ...styles,
      padding: "2px",
      width: "23px",
   }),
   dropdownIndicator: (styles) => ({
      ...styles,
      padding: "2px",
      width: "16px",
      // minHeight: "30px",
      // height: "30px",
   }),
   singleValue: (styles) => ({
      ...styles,
      color: "#7e7e7e",
   }),
};

export const markupSelectStyles = {
   control: (styles) => ({
      ...styles,
      fontSize: "12px",
      backgroundColor: "transparent",
      border: "none",
      border: "1px solid #9f9f9f",
      borderRadius: "0.25rem",
      boxShadow: "none",
      outline: "0",
      minHeight: "32px",
   }),
   input: (styles) => ({ ...styles, color: "#7e7e7e", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   placeholder: (styles) => ({ ...styles, color: "#9f9f9f" }),
   indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "none",
   }),
   indicatorsContainer: (styles) => ({
      ...styles,
      padding: "2px",
      width: "23px",
   }),
   dropdownIndicator: (styles) => ({
      ...styles,
      padding: "2px",
      width: "16px",
      // minHeight: "30px",
      // height: "30px",
   }),
   singleValue: (styles) => ({
      ...styles,
      color: "#7e7e7e",
   }),
};

export const markupSelectStyles_2 = {
   control: (styles) => ({
      ...styles,
      fontSize: "13px",
      border: "none",
      border: "1px solid #ced4da",
      borderRadius: "0.25rem",
      boxShadow: "none",
      outline: "0",
      minHeight: "32px",
   }),
   input: (styles) => ({ ...styles, color: "#7e7e7e", fontWeight: "600" }),
   input: (provided) => ({
      ...provided,
      input: {
        opacity: "1 !important",
      },
    }),
   placeholder: (styles) => ({ ...styles, color: "#495057" }),
   indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: "none",
   }),
   indicatorsContainer: (styles) => ({
      ...styles,
      padding: "2px",
      width: "23px",
   }),
   dropdownIndicator: (styles) => ({
      ...styles,
      padding: "2px",
      width: "16px",
      // minHeight: "30px",
      // height: "30px",
   }),
   singleValue: (styles) => ({
      ...styles,
      color: "#7e7e7e",
   }),
};