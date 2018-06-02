import * as firebase from 'firebase';

import config from '../etc/config';

class Firebase {
  constructor() {
    this.init();
  }

  init = () => firebase.initializeApp(config);

  getFinancialRecords = async () => {
    try {
      const data = await firebase.database().ref('financial_records/').once('value');
      const financialDataArr = [];

      if (data.val() && Object.keys(data.val()).length) {
        const value = data.val();

        Object.keys(value).forEach(key =>
          financialDataArr.push({ ...value[key], symbolicId: key })
        );
      }

      return financialDataArr;
    } catch (err) {
      console.error('Firebase getFinancialRecords error: ', err);
    }
  }

  setFinancialRecord = financialRecord => {
    try {
      const data = firebase.database().ref('financial_records/').push(financialRecord);

      return data.key;
    } catch (err) {
      console.error('Firebase setFinancialRecord error: ', err);

      return false;
    }
  }

  removeFinancialRecord = id => {
    try {
      firebase.database().ref('financial_records/').child(id).remove();

      return true;
    } catch (err) {
      console.error('Firebase removeFinancialRecord error: ', err);

      return false;
    }
  }
}

export default new Firebase();
