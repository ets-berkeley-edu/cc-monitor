import React from 'react';

export default class EnvItem extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.call_name}</td>
        {this.generateEnvs()}
      </tr>
    );
  }

  generateEnvs() {
    var envs= [];
    for (var entry in this.props.envs) {
      envs.push(
        <td key={envs.length}>
          <div className={'circle ' + (this.props.envs[entry] ? 'green' : 'red')}></div>
        </td>
      );
    }
    return envs;
  }
}
