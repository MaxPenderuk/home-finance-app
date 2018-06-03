import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Select                 from 'react-select';
import PropTypes              from 'prop-types';
import LIVR                   from 'livr';
import SweetAlert             from 'sweetalert-react';
import moment                 from 'moment';

import { addFinancialRecord } from '../../actions/index';

import 'react-select/dist/react-select.css';
import './style.css';
import 'sweetalert/dist/sweetalert.css';

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

export class FinancialRecordForm extends Component {
  static propTypes = {
    addFinancialRecord: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      amount          : '100.00',
      description     : '',
      selectedType    : SELECT_OPTIONS.types[0],
      selectedCurrency: SELECT_OPTIONS.currencies[0],
      errorString     : '',
      errors          : {}
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

  handleInputChange = (input, event) => {
    const state = { ...this.state };

    state[input] = event.target.value;
    delete state.errors[input];

    this.setState(state);
  }

  handleFormSubmit = event => {
    event.preventDefault();

    const { selectedType, selectedCurrency, description, amount } = this.state;
    const isValidData = this.validate({
      type       : selectedType.value,
      currency   : selectedCurrency.value,
      createdAt  : moment().unix(),
      description,
      amount
    });

    if (!isValidData) return;

    const financialRecord = {
      type       : selectedType.value,
      currency   : selectedCurrency.value,
      amounts    : {},
      createdAt  : moment().unix(),
      description,
    };

    if (selectedCurrency.value === 'usd') {
      financialRecord.amounts.usd = parseFloat(Math.abs(amount));
    }
    if (selectedCurrency.value === 'eur') {
      financialRecord.amounts.eur = parseFloat(Math.abs(amount));
    }

    this.setState({
      amount          : '100.00',
      description     : ''
    }, () => this.props.addFinancialRecord(financialRecord));
  }

  validate(financialRecord) {
    const rules = {
      type       : ['required', 'string', { 'one_of': ['expense', 'income'] } ],
      currency   : ['required', 'string', { 'one_of': ['usd', 'eur'] }],
      createdAt  : ['required', 'integer'],
      description: ['trim'],
      amount     : ['required', 'decimal']
    };

    const validator = new LIVR.Validator(rules);
    const validatedResult = validator.validate(financialRecord);

    if (!validatedResult) {
      const errorCodes = {
        REQUIRED   : 'required',
        NOT_DECIMAL: 'not a number',
        TOO_LONG   : 'required'
      };
      const errors = validator.getErrors();
      let errorString = '';

      for (const key in errors) {
        const errorCode = errors[key];
        const field = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        
        errorString += `${field} is ${errorCodes[errorCode]}.\n`;
      }
      
      this.setState({ errorString, errors });
    }

    return validatedResult;
  }

  handleAlertClick = () => {
    this.setState({
      errorString: ''
    });
  }

  render() {
    const { errors } = this.state;

    return (
      <Fragment>
        <form className='form-row financial-record-form' onSubmit={this.handleFormSubmit}>
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
              type='text'
              className={`form-control amount ${
                errors.amount
                ? 'is-invalid'
                : ''
              }`}
              placeholder='Amount'
              value={this.state.amount}
              onChange={this.handleInputChange.bind(null, 'amount')}
            />
          </div>
          <div className='form-group col-md-5'>
            <input
              type='text'
              className='form-control'
              placeholder='Description'
              value={this.state.description}
              onChange={this.handleInputChange.bind(null, 'description')}
            />
          </div>
          <div className='form-group col-md-2'>
            <button type='submit' className='btn btn-secondary'>Add</button>
          </div>
        </form>
        <SweetAlert
          show={this.state.errorString ? true : false}
          title='Oops!'
          type='error'
          text={this.state.errorString}
          onConfirm={this.handleAlertClick}
        />
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ addFinancialRecord }, dispatch);
}

export default connect(null, mapDispatchToProps)(FinancialRecordForm);
