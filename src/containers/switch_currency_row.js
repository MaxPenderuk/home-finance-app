import React, { Component } from 'react';
import { bindActionCreators }         from 'redux';
import { connect }                    from 'react-redux';
import Select                 from 'react-select';
import PropTypes                      from 'prop-types';
import debounce from 'lodash/debounce';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { setConversionData } from '../actions/index';

import faArrow from '@fortawesome/fontawesome-free-solid/faArrowRight';

import 'react-select/dist/react-select.css';
import './switch_currency_row.css';

const SELECT_OPTIONS = [
  { value: 'usd', label: '$' },
  { value: 'eur', label: '€' }
];

export class SwitchCurrencyRow extends Component {
  static propTypes = {
    conversionData   : PropTypes.object.isRequired,
    setConversionData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = { rate: props.conversionData.rate };
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
    this.props.setConversionData({
      ...this.props.conversionData,
      rate: this.state.rate
    });
  }, 1000)

  handleRateChange = event => {
    this.setState({
      rate: event.target.value
    }, this.setConversionData);
  }

  renderTest = currency => {
    if (currency === 'usd') {
      return (
        <label className='mr-sm-2 ml-sm-2'>
          € <FontAwesomeIcon icon={faArrow} /> $
        </label>
      );
    } else {
      return (
        <label className='mr-sm-2 ml-sm-2'>
          $ <FontAwesomeIcon icon={faArrow} /> €
        </label>
      );
    }
  }


  render() {
    const { currency } = this.props.conversionData;
    const selectedOption = SELECT_OPTIONS.find(item => item.value === currency);
    const renderLabel = this.renderTest.bind(null, currency);

    return (
      <form className='form-inline currency-switch-form'>
        <label
          htmlFor='currency-select'
          className='currency-select-label mr-sm-2'
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
          className='form-control'
          value={this.state.rate}
          onChange={this.handleRateChange}
        />
      </form>
    );
  }
}

function mapStateToProps({ financialRecords: { conversionData } }) {
  return { conversionData };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setConversionData }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchCurrencyRow);
