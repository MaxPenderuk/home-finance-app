import React, { Component } from 'react';
import PropTypes            from 'prop-types';

export default class Header extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  render() {
    const { text } = this.props;

    return (
      <div className='mt-2 mb-4'>
        <h1>{text}</h1>
      </div>
    );
  }
}
