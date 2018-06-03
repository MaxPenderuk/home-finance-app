import { createSelector } from 'reselect';

const getFinancialRecordsList = state => {
  const newState = { ...state };
  const { conversionData } = newState;

  return newState.list.map(item => {
    if (conversionData.currency === 'usd' && item.currency === 'eur') {
      item.amounts.usd = Math.round((item.amounts.eur * conversionData.rate) * 1000) / 1000;
    }
    if (conversionData.currency === 'usd' && item.currency === 'usd') {
      delete item.amounts.eur;
    }
    if (conversionData.currency === 'eur' && item.currency === 'eur') {
      delete item.amounts.usd;
    }
    if (conversionData.currency === 'eur' && item.currency === 'usd') {
      item.amounts.eur = Math.round((item.amounts.usd * conversionData.rate) * 1000) / 1000;
    }

    return item;
  });
};

export const getFinancialRecordsState = createSelector(
  [ getFinancialRecordsList ],
  list => list
);
