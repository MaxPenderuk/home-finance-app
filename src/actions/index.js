import firebase from '../utils/firebase';

export const LOAD_FINANCIAL_RECORDS        = 'LOAD_FINANCIAL_RECORDS';
export const ADD_FINANCIAL_RECORD          = 'ADD_FINANCIAL_RECORD';
export const FINANCIAL_RECORDS_LOADING     = 'FINANCIAL_RECORDS_LOADING';
export const REMOVE_FINANTIAL_RECORD       = 'REMOVE_FINANTIAL_RECORD';
export const LOAD_FINANCIAL_RECORDS_ERROR  = 'LOAD_FINANCIAL_RECORDS_ERROR';
export const ADD_FINANCIAL_RECORD_ERROR    = 'ADD_FINANCIAL_RECORD_ERROR';
export const REMOVE_FINANTIAL_RECORD_ERROR = 'REMOVE_FINANTIAL_RECORD_ERROR';

export function loadFinancialRecords() {
  return async dispatch => {
    dispatch({
      type: FINANCIAL_RECORDS_LOADING
    });

    const data = await firebase.getFinancialRecords();

    if (data.status) {
      dispatch({
        type: LOAD_FINANCIAL_RECORDS,
        payload: data.financialRecords
      });
    }

    dispatch({
      type: LOAD_FINANCIAL_RECORDS_ERROR,
      error: data.error,
    });
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
    const financialRecord = { type, currency, sum, description, createdAt };
    const data = await firebase.setFinancialRecord(financialRecord);

    if (data.status) {
      dispatch({
        type: ADD_FINANCIAL_RECORD,
        payload: {
          ...financialRecord,
          symbolicId: data.financialRecordId
        }
      });
    }

    dispatch({
      type: ADD_FINANCIAL_RECORD_ERROR,
      error: data.error
    });
  };
}

export function removeFinancialRecord(id) {
  return async dispatch => {
    const data = await firebase.removeFinancialRecord(id);

    if (data.status) {
      dispatch({
        type: REMOVE_FINANTIAL_RECORD,
        payload: { id }
      });
    }

    dispatch({
      type: REMOVE_FINANTIAL_RECORD_ERROR,
      error: data.error
    });
  };
}
