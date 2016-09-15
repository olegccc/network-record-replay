import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import * as OverrideActions from '../actions/override';

const possibleMethods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE'];

class OverrideEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            method: 'ALL',
            url: ''
        };
    }

    onMethodSelected(event, index, method) {
        this.setState({method});
    }

    onUrlChanged(url) {
        this.setState({url});
    }

    onAddUrl() {
        this.props.dispatch(OverrideActions.overrideAddItem(this.state.method, this.state.url));
        this.setState({
            method: 'ALL',
            url: ''
        })
    }

    render() {

        return (
            <div className="override-editor">
                <SelectField className="method" value={this.state.method} onChange={this.onMethodSelected.bind(this)}>
                    { possibleMethods.map(method => <MenuItem key={method} value={method} primaryText={method}/>)}
                </SelectField>
                <div className="url">
                    <AutoComplete
                        searchText={this.state.url}
                        hintText="Enter URL"
                        dataSource={this.props.pages}
                        onUpdateInput={this.onUrlChanged.bind(this)}
                        onNewRequest={this.onUrlChanged.bind(this)}
                    />
                </div>
                <div>
                    <RaisedButton label="Add" primary={true} onTouchTap={this.onAddUrl.bind(this)} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pages:  state.configuration.get('urls')
    };
};

export default connect(mapStateToProps)(OverrideEditor);
