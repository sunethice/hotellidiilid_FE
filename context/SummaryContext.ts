import React from 'react'

const SummaryContext = React.createContext(null);

export const SummaryProvider = SummaryContext.Provider;
export const SummaryConsumer = SummaryContext.Consumer;

export default SummaryContext;