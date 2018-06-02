import firebase from '../utils/firebase';

export const LOAD_FINANCIAL_RECORDS    = 'LOAD_FINANCIAL_RECORDS';
export const ADD_FINANCIAL_RECORD      = 'ADD_FINANCIAL_RECORD';
export const FINANCIAL_RECORDS_LOADING = 'FINANCIAL_RECORDS_LOADING';
export const REMOVE_FINANTIAL_RECORD   = 'REMOVE_FINANTIAL_RECORD';

export function loadFinancialRecords() {
  return async dispatch => {
    try {
      dispatch({
        type: FINANCIAL_RECORDS_LOADING
      });

      const data = await firebase.getFinancialRecords();

      dispatch({
        type: LOAD_FINANCIAL_RECORDS,
        payload: data || []
      });
    } catch (err) {
      console.error('loadFinancialData error: ', err);
    }
  };
}

export function addFinancialRecord({
  type,
  currency,
  sum,
  description,
  createdAt
}) {
  return async dispatch => {
    try {
      const financialRecord = {
        type,
        currency,
        sum,
        description,
        createdAt
      };
      const symbolicKey = await firebase.setFinancialRecord(financialRecord);

      dispatch({
        type: ADD_FINANCIAL_RECORD,
        payload: {
          ...financialRecord,
          symbolicId: symbolicKey
        }
      });
    } catch (err) {
      console.error('addFinancialRecord error: ', err);
    }
  };
}

export function removeFinancialRecord(id) {
  return async dispatch => {
    try {
      await firebase.removeFinancialRecord(id);

      dispatch({
        type: REMOVE_FINANTIAL_RECORD,
        payload: { id }
      });
    } catch (err) {
      console.error('removeFinancialRecord error: ', err);
    }
  };
}
