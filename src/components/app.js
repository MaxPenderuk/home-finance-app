import React, { Component } from 'react';

import Header                 from './header';
import SwitchCurrencyRow      from '../containers/switch_currency_row';
import AddFinancialRecordForm from '../containers/add_financial_record_form';
import FinancialRecordsList   from '../containers/financial_records_list';

import 'bootstrap/dist/css/bootstrap.css';

export default class App extends Component {
  render() {
    return (
      <div className='pl-2 pr-2'>
        <Header text='Home Finance'/>
        <AddFinancialRecordForm />
        <FinancialRecordsList>
          <SwitchCurrencyRow />
        </FinancialRecordsList>
      </div>
    );
  }
}
