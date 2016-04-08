import React from 'react';
import EnvItem from './env-item';
import EnvStatus from './env-status';

export default class ConfigItem extends React.Component {
  render() {
    return (
      <div className="column col-4-lg col-6-md col-12-sm">
        <div className="column-margin">
          <div className="flex flex-vertical-center flex-horizontal-center-mobile">
            <h2>{this.props.name}</h2>
            <EnvStatus generalData={this.props.data.general} />
          </div>
          {this.generateEnvs()}
        </div>
      </div>
    );
  }

  generateEnvs() {
    var envItems = [];
    for (var call in this.props.data.details) {
      envItems.push(<EnvItem key={envItems.length} call_name={call} envs={this.props.data.details[call]} />);
    }
    return (
      <table>
        <tbody>
          {this.generateEnvHeaders()}
          {envItems}
        </tbody>
      </table>
    );
  }

  generateEnvHeaders() {
    var headers = [];
    for (var envName in this.props.data.details[Object.keys(this.props.data.details)[0]]) {
      headers.push(<th key={headers.length}>{envName}</th>);
    }
    return (
      <tr>
        <th></th>
        {headers}
      </tr>
    );
  }
}
