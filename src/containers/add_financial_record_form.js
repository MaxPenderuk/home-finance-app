import React, { Component }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Select                 from 'react-select';
import PropTypes              from 'prop-types';
import moment                 from 'moment';

import { addFinancialRecord } from '../actions/index';

import 'react-select/dist/react-select.css';
import './add_financial_record_form.css';

const SELECT_OPTIONS = {
  types: [
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' }
  ],
  currencies: [
    { value: 'usd', label: '$' },
    { value: 'eur', label: '€' }
  ]
};

export class AddFinancialRecordFrom extends Component {
  static propTypes = {
    addFinancialRecord: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      sum             : 100.00.toFixed(2),
      description     : '',
      selectedType    : SELECT_OPTIONS.types[0],
      selectedCurrency: SELECT_OPTIONS.currencies[0]
    };
  }

  handleSelectOptionChange = (type, selectedOpt) => {
    if (type === 'type') {
      this.setState({ selectedType: selectedOpt });
    }
    if (type === 'currency') {
      this.setState({ selectedCurrency: selectedOpt });
    }
  }

  handleSumChange = event => {
    this.setState({ sum: Number(event.target.value).toFixed(2) });
  }

  handleDescriptionChange = event => {
    this.setState({ description: event.target.value });
  }

  handleFormSubmit = event => {
    event.preventDefault();

    this.props.addFinancialRecord({
      type       : this.state.selectedType.value,
      currency   : this.state.selectedCurrency.value,
      sum        : this.state.sum,
      description: this.state.description,
      createdAt  : moment().unix()
    });
  }

  render() {
    return (
      <form className='form-row' onSubmit={this.handleFormSubmit}>
        <div className='form-group col-md-2'>
          <Select
            className='finance-type-select'
            name='finance-type'
            value={this.state.selectedType}
            onChange={this.handleSelectOptionChange.bind(null, 'type')}
            options={SELECT_OPTIONS.types}
            clearable={false}
            searchable={false}
          />
        </div>
        <div className='form-group col-md-1'>
          <Select
            className='currency-select'
            name='currency'
            value={this.state.selectedCurrency}
            onChange={this.handleSelectOptionChange.bind(null, 'currency')}
            options={SELECT_OPTIONS.currencies}
            clearable={false}
            searchable={false}
          />
        </div>
        <div className='form-group col-md-2'>
          <input
            type='number'
            className='form-control sum'
            placeholder='Sum'
            value={this.state.sum}
            onChange={this.handleSumChange}
          />
        </div>
        <div className='form-group col-md-5'>
          <input
            type='text'
            className='form-control'
            placeholder='Description'
            value={this.state.description}
            onChange={this.handleDescriptionChange}
          />
        </div>
        <div className='form-group col-md-2'>
          <button type='submit' className='btn btn-secondary'>Add</button>
        </div>
      </form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addFinancialRecord }, dispatch);
}

export default connect(null, mapDispatchToProps)(AddFinancialRecordFrom);
