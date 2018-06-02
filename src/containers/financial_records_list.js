import React, { Component, Fragment } from 'react';
import { bindActionCreators }         from 'redux';
import { connect }                    from 'react-redux';
import PropTypes                      from 'prop-types';
import moment                         from 'moment';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faTimes         from '@fortawesome/fontawesome-free-solid/faTimes';

import { loadFinancialRecords, removeFinancialRecord } from '../actions/index';

import './financial_records_list.css';

export class FinancialRecordsList extends Component {
  static propTypes = {
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

  renderDataTable = list => {
    let balance = 0;

    return (
      <Fragment>
      <table className='table table-hover'>
        <tbody>
          {
            list.map(item => {
              balance = item.type === 'expense'
                ? balance - parseFloat(item.sum)
                : balance + parseFloat(item.sum);

              return (
                <tr key={item.symbolicId}>
                  <td style={{ textAlign: 'center' }}>
                    {
                      item.type === 'expense'
                      ? <div className='arrow-down' />
                      : <div className='arrow-up' />
                    }
                  </td>
                  <td>
                    <div>
                      <span>{ item.description }</span>
                      <span>{ moment.unix(item.createdAt).format('MMM DD, YYYY hh:mm a') }</span>
                    </div>
                  </td>
                  <td>
                    {
                      item.type === 'expense'
                      ? (item.currency === 'usd' ? `$ ${item.sum}` : `€${item.sum}`)
                      : '--'
                    }
                  </td>
                  <td>
                    {
                      item.type === 'income'
                      ? (item.currency === 'usd' ? `$ ${item.sum}` : `€${item.sum}`)
                      : '--'
                    }
                  </td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTimes}
                      onClick={this.handleRecordDeleteClick.bind(null, item.symbolicId)}
                    />
                  </td>
                </tr>
              )
            })
          }
          <tr>
            <td></td>
            <td>Balance</td>
            <td>{ Math.sign(balance) < 0 ? `$ ${Math.abs(balance).toFixed(2)}` : '' }</td>
            <td>{ Math.sign(balance) >= 0 ? `$ ${balance.toFixed(2)}` : '' }</td>
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
  return bindActionCreators({ loadFinancialRecords, removeFinancialRecord }, dispatch);
}

function mapStateToProps({ financialRecords }) {
  return { financialRecords };
}

export default connect(mapStateToProps, mapDispatchToProps)(FinancialRecordsList);
