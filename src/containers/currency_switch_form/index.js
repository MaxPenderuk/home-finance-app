import React, { Component, Fragment }   from 'react';
import { bindActionCreators } from 'redux';
import { connect }            from 'react-redux';
import Select                 from 'react-select';
import PropTypes              from 'prop-types';
import LIVR                   from 'livr';
import SweetAlert             from 'sweetalert-react';
import debounce               from 'lodash/debounce';
import FontAwesomeIcon        from '@fortawesome/react-fontawesome';

import { setConversionData }  from '../../actions/index';

import faArrow from '@fortawesome/fontawesome-free-solid/faArrowRight';

import 'react-select/dist/react-select.css';
import 'sweetalert/dist/sweetalert.css';
import './style.css';

const SELECT_OPTIONS = [
  { value: 'usd', label: '$' },
  { value: 'eur', label: '€' }
];

export class CurrencySwitchForm extends Component {
  static propTypes = {
    conversionData   : PropTypes.object.isRequired,
    setConversionData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      rate       : props.conversionData.rate,
      errors     : {},
      errorString: ''
    };
  }

  handleClick = () => {
    this.props.setConversionData({ rate: 1.114, currency: 'eur' });
  }

  handleCurrencyChange = option => {
    this.props.setConversionData({
      ...this.props.conversionData,
      currency: option.value
    });
  }

  setConversionData = debounce(() => {
    const isValid = this.validate(this.state.rate);

    if (!isValid) return;

    this.props.setConversionData({
      ...this.props.conversionData,
      rate: this.state.rate
    });
  }, 1000)

  handleRateChange = event => {
    this.setState({
      rate: event.target.value,
      errors: {},
      errorString: ''
    }, this.setConversionData);
  }

  getLabel = currency => {
    if (currency === 'usd') {
      return (
        <label className='mr-sm-2 ml-sm-2 mr-2 ml-2'>
          € <FontAwesomeIcon icon={faArrow} /> $
        </label>
      );
    } else {
      return (
        <label className='mr-sm-2 ml-sm-2 mr-2 ml-2'>
          $ <FontAwesomeIcon icon={faArrow} />  €
        </label>
      );
    }
  }

  handleAlertClick = () => {
    this.setState({
      errorString: ''
    });
  }

  validate(currency) {
    const rules = {
      currency: ['required', 'decimal']
    };
    const validator = new LIVR.Validator(rules);
    const validatedResult = validator.validate({ currency });

    if (!validatedResult) {
      const errorCodes = {
        REQUIRED   : 'required',
        NOT_DECIMAL: 'not a number'
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

  render() {
    const { currency } = this.props.conversionData;
    const { errors } = this.state;
    const selectedOption = SELECT_OPTIONS.find(item => item.value === currency);
    const renderLabel = this.getLabel.bind(null, currency);

    return (
      <Fragment>
        <form className='form-inline currency-switch-form'>
          <label
            htmlFor='currency-select'
            className='currency-select-label mr-sm-2 mr-2'
          >
            Display amount in
          </label>
          <Select
            className='currency-select'
            name='currency'
            value={selectedOption}
            options={SELECT_OPTIONS}
            onChange={this.handleCurrencyChange}
            clearable={false}
            searchable={false}
          />
          { renderLabel() }
          <input
            type='text'
            className={`form-control ${
              errors.currency
              ? 'is-invalid'
              : ''
            }`}
            value={this.state.rate}
            onChange={this.handleRateChange}
          />
        </form>
        <SweetAlert
          show={!!this.state.errorString}
          title='Oops!'
          type='error'
          text={this.state.errorString}
          onConfirm={this.handleAlertClick}
        />
      </Fragment>
    );
  }
}

function mapStateToProps({ financialRecords: { conversionData } }) {
  return { conversionData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setConversionData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySwitchForm);
