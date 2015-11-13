import React from 'react';
import _ from 'lodash';

export default React.createClass({
  getInitialState: function() {
    let state = {value: '', error: null, hidden: false};
    if (_.contains(['selling_asset_code', 'buying_asset_code', 'destination_asset_code'], this.props.param)) {
      state.hidden = true;
    }
    return state;
  },
  onChange: function(event) {
    let value = event.target.value;
    let error = this.validate(value);
    this.setState({value, error});
    this.props.onUpdate(this.props.param, value, error);
  },
  onValidationContextChange: function() {
    let error = this.validate(this.state.value);
    this.setState(_.extend(this.state, {error}));
  },
  validate: function(value) {
    let error = null;
    if (value && !value.match(/^[a-zA-Z0-9]+$/g)) {
      error = 'Asset code must consist of letters and digits only.';
    } else if (value && (value.length > this.maxLength || value.length < this.minLength)) {
      error = `Asset code must be between ${this.minLength} and ${this.maxLength} characters long.`;
    }
    return error;
  },
  onParameterChange({key, value}) {
    if ((this.props.param === 'selling_asset_code' && key === 'selling_asset_type') ||
        (this.props.param === 'buying_asset_code'  && key === 'buying_asset_type') ||
        (this.props.param === 'destination_asset_code' && key === 'destination_asset_type')) {
      this.minLength = value === 'credit_alphanum4' ? 1 : 5;
      this.maxLength = value === 'credit_alphanum4' ? 4 : 12;
      let hidden = value === 'native';
      this.setState(_.extend(this.state, {hidden}));
      this.onValidationContextChange();
    }
  },
  onExternalError: function({param, error}) {
    if (param === this.props.param && !this.state.error) {
      this.setState(_.extend(this.state, {error}));
    }
  },
  componentDidMount: function() {
    this.props.addParameterChangeListener(this.onParameterChange);
    this.props.addParameterErrorListener(this.onExternalError);
  },
  componentWillUnmount: function() {
    this.props.removeParameterChangeListener(this.onParameterChange);
    this.props.removeParameterErrorListener(this.onExternalError);
  },
  render: function() {
    let {value, error, hidden} = this.state;
    let text;
    switch (this.props.param) {
      case 'selling_asset_code':
        text = 'Selling Asset Code';
        break;
      case 'buying_asset_code':
        text = 'Buying Asset Code';
        break;
      case 'destination_asset_code':
        text = 'Destination Asset Code';
        break;
      default:
        text = 'Asset Code';
    }
    return hidden ?
      null
      :
      <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {text}
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" value={value} onChange={this.onChange}/>
          {error ? <p className="optionsTable__pair__content__alert">
            {error}
          </p> : ''}
        </div>
      </div>;
  }
});
