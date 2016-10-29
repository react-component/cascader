webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(252);


/***/ },

/***/ 252:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _rcCascader = __webpack_require__(3);
	
	var _rcCascader2 = _interopRequireDefault(_rcCascader);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(79);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var options = [{
	  value: 'zhejiang',
	  label: '浙江',
	  children: [{
	    value: 'hangzhou',
	    label: '杭州',
	    children: [{
	      value: 'xihu',
	      label: '西湖'
	    }]
	  }]
	}, {
	  value: 'jiangsu',
	  label: '江苏',
	  children: [{
	    value: 'nanjing',
	    label: '南京',
	    children: [{
	      value: 'zhonghuamen',
	      label: '中华门'
	    }]
	  }]
	}];
	
	var App = _react2.default.createClass({
	  displayName: 'App',
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: '',
	      value: []
	    };
	  },
	  onChange: function onChange(value, selectedOptions) {
	    var lastSelected = selectedOptions[selectedOptions.length - 1];
	    if (lastSelected.children && lastSelected.children.length === 1) {
	      value.push(lastSelected.children[0].value);
	      this.setState({
	        inputValue: selectedOptions.map(function (o) {
	          return o.label;
	        }).join(', '),
	        value: value
	      });
	      return;
	    }
	    this.setState({
	      inputValue: selectedOptions.map(function (o) {
	        return o.label;
	      }).join(', '),
	      value: value
	    });
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      _rcCascader2.default,
	      { options: options, value: this.state.value, changeOnSelect: true, onChange: this.onChange },
	      _react2.default.createElement('input', { value: this.state.inputValue, readOnly: true })
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=default-expand-single-option.js.map