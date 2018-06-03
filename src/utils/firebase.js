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
      const financialRecords = [];

      if (data.val() && Object.keys(data.val()).length) {
        const value = data.val();

        for (const key in value) {
          financialRecords.push({ ...value[key], id: key })
        }
      }

      return {
        status: 1,
        financialRecords
      };
    } catch (error) {
      console.error('Firebase getFinancialRecords error: ', error);

      return {
        status: 0,
        error
      };
    }
  }

  setFinancialRecord = financialRecord => {
    try {
      const data = firebase.database().ref('financial_records/').push(financialRecord);

      return {
        status: 1,
        financialRecordId: data.key
      };
    } catch (error) {
      console.error('Firebase setFinancialRecord error: ', error);

      return {
        status: 0,
        error
      };
    }
  }

  removeFinancialRecord = id => {
    try {
      firebase.database().ref('financial_records/').child(id).remove();

      return { status: 1 };
    } catch (error) {
      console.error('Firebase removeFinancialRecord error: ', error);

      return {
        status: 0,
        error
      };
    }
  }
}

export default new Firebase();
