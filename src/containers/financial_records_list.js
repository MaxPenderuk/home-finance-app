import React, { Component, Fragment } from 'react';
import { bindActionCreators }         from 'redux';
import { connect }                    from 'react-redux';
import PropTypes                      from 'prop-types';
import moment                         from 'moment';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTimes         from '@fortawesome/fontawesome-free-solid/faTimes';

import { getFinancialRecordsState } from '../selectors/index';

import {
  loadFinancialRecords,
  removeFinancialRecord
} from '../actions/index';

import './financial_records_list.css';

export class FinancialRecordsList extends Component {
  static propTypes = {
    children             : PropTypes.node.isRequired,
    financialRecords     : PropTypes.object.isRequired,
    loadFinancialRecords : PropTypes.func.isRequired,
    removeFinancialRecord: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadFinancialRecords();
  }

  handleRecordDeleteClick = id => {
    this.props.removeFinancialRecord(id);
  }

  renderAmounts = item => {
    const { currency } = this.props.financialRecords.conversionData;

    return (
      <div className='prices'>
        <span>
          {
            currency === 'usd'
            ? `$ ${Number(item.amounts.usd).toFixed(2)}`
            : `€ ${Number(item.amounts.eur).toFixed(2)}`
          }
        </span>
        <span>
          {
            currency === 'usd' && item.amounts.eur
            ? `€ ${Number(item.amounts.eur).toFixed(2)}`
            : null
          }
          {
            currency === 'eur' && item.amounts.usd
            ? `$ ${Number(item.amounts.usd).toFixed(2)}`
            : null
          }
        </span>
      </div>
    );
  }

  renderDataTable = list => {
    const { currency } = this.props.financialRecords.conversionData;
    const currencySign = { usd: '$', eur: '€' };
    let balance = 0;

    return (
      <Fragment>
      { this.props.children }
      <table className='table table-hover mt-3'>
        <tbody>
          {
            list.map(item => {
              const getAmountsBlock = this.renderAmounts.bind(null, item);
              balance = item.type === 'expense'
                ? balance - parseFloat(item.amounts[currency])
                : balance + parseFloat(item.amounts[currency]);

              return (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center' }}>
                    {
                      item.type === 'expense'
                      ? <div className='arrow-down' />
                      : <div className='arrow-up' />
                    }
                  </td>
                  <td>
                    <div className='description'>
                      <span>{ item.description }</span>
                      <span>{ moment.unix(item.createdAt).format('MMM DD, YYYY hh:mm a') }</span>
                    </div>
                  </td>
                  <td>
                    {
                      item.type === 'expense'
                      ? getAmountsBlock()
                      : <div className='no-amounts'>{'--'}</div>
                    }
                  </td>
                  <td>
                    {
                      item.type === 'income'
                      ? getAmountsBlock()
                      : <div className='no-amounts'>{'--'}</div>
                    }
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTimes}
                      onClick={this.handleRecordDeleteClick.bind(null, item.id)}
                    />
                  </td>
                </tr>
              )
            })
          }
          <tr>
            <td></td>
            <td>Balance</td>
            <td>{ Math.sign(balance) < 0 ? `${currencySign[currency]} ${Math.abs(balance).toFixed(2)}` : '' }</td>
            <td>{ Math.sign(balance) >= 0 ? `${currencySign[currency]} ${balance.toFixed(2)}` : '' }</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      </Fragment>
    );
  }

  renderNoRecordsBlock = () => {
    return (
      <div className='no-records pt-4 pb-4'>Add Some Financial Records</div>
    );
  }

  render() {
    const { list, isLoading } = this.props.financialRecords;

    return (
      <Fragment>
        {
          isLoading
          ? <div className='spinner-wrap'><div className='spinner'/></div>
          : list.length ? this.renderDataTable(list) : this.renderNoRecordsBlock()
        }
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadFinancialRecords,
    removeFinancialRecord
  }, dispatch);
}

function mapStateToProps({ financialRecords }) {
  return {
    financialRecords: {
      ...financialRecords,
      list: getFinancialRecordsState(financialRecords)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FinancialRecordsList);
