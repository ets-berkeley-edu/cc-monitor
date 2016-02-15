import React from 'react';
import ConfigsList from './configs-list';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <h1>CalCentral Monitor</h1>
                <ConfigsList />
            </div>
        );
    }
}
