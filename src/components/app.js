import React, { Component } from 'react';

import Header                 from './header';
import CurrencySwitchForm     from '../containers/currency_switch_form/index';
import FinancialRecordForm    from '../containers/financial_record_form/index';
import FinancialRecordsList   from '../containers/financial_records_list/index';

import 'bootstrap/dist/css/bootstrap.css';

export default class App extends Component {
  render() {
    return (
      <div className='pl-2 pr-2'>
        <Header text='Home Finance'/>
        <FinancialRecordForm />
        <FinancialRecordsList>
          <CurrencySwitchForm />
        </FinancialRecordsList>
      </div>
    );
  }
}
