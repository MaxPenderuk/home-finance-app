import {
  LOAD_FINANCIAL_RECORDS,
  FINANCIAL_RECORDS_LOADING,
  ADD_FINANCIAL_RECORD,
  REMOVE_FINANTIAL_RECORD,
  LOAD_FINANCIAL_RECORDS_ERROR,
  ADD_FINANCIAL_RECORD_ERROR,
  REMOVE_FINANTIAL_RECORD_ERROR
} from '../actions/index';

const DEFAULT_STATE = {
  list     : [],
  error    : {},
  isLoading: false
};

export default function financialRecords(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case FINANCIAL_RECORDS_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_FINANCIAL_RECORDS:
      return {
        ...state,
        list: action.payload,
        isLoading: false,
      };
    case ADD_FINANCIAL_RECORD:
      return {
        ...state,
        list: [...state.list, action.payload]
      };
    case REMOVE_FINANTIAL_RECORD:
      return {
        ...state,
        list: state.list.filter(r => r.symbolicId !== action.payload.id)
      };
    case LOAD_FINANCIAL_RECORDS_ERROR:
    case ADD_FINANCIAL_RECORD_ERROR:
    case REMOVE_FINANTIAL_RECORD_ERROR:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
