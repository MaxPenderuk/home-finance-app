import { createSelector } from 'reselect';

const financialRecordsListSelector = state => state.list;
const conversionDataSelector = state => state.conversionData;


export const getFinancialRecordsState = createSelector(
  [ financialRecordsListSelector, conversionDataSelector ],
  (list, conversionData) => list.map(item => {
    let usd = item.amounts.usd || null;
    let eur = item.amounts.eur || null;

    if (conversionData.currency === 'usd' && item.currency === 'eur') {
      usd = Math.round((item.amounts.eur * conversionData.rate) * 1000) / 1000;
    }
    if (conversionData.currency === 'eur' && item.currency === 'usd') {
      eur = Math.round((item.amounts.usd * conversionData.rate) * 1000) / 1000;
    }

    return {
      ...item,
      amounts: { ...item.amounts, eur, usd }
    };
  })
);
