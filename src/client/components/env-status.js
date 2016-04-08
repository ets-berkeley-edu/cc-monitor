import React from 'react';

export default class EnvStatus extends React.Component {
  render() {
    return (
      <div>
        {this.generateStatusIcon()}
      </div>
    );
  }

  generateStatusIcon() {
    if (this.props.generalData.overall) {
      return (
        <i className="fa fa-2x fa-header-icon fa-check-circle"></i>
      );
    }
    else {
      return (
        <i className="fa fa-2x fa-header-icon fa-exclamation-circle"></i>
      );
    }
  }
}
