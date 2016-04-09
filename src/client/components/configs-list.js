import React from 'react';
import ConfigItem from './config-item';

export default class ConfigsList extends React.Component {
  render() {
    return <div className="row">{this.generateList()}</div>;
  }
  generateList() {
    if (!this.props.data) {
      return;
    }
    var listItems = [];
    for (var entry in this.props.data) {
      if (entry == 'time') {
        continue;
      }
      listItems.push(<ConfigItem key={listItems.length} name={this.props.data[entry].general.name} data={this.props.data[entry]} />);
    }
    return <div>{listItems}</div>;
  }
}
