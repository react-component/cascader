webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(215);


/***/ },

/***/ 215:
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable no-console */
	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	__webpack_require__(2);
	
	var _rcCascader = __webpack_require__(3);
	
	var _rcCascader2 = _interopRequireDefault(_rcCascader);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(165);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var addressOptions = [{
	  'label': '福建',
	  isLeaf: false,
	  'value': 'fj'
	}, {
	  'label': '浙江',
	  isLeaf: false,
	  'value': 'zj'
	}];
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      inputValues: [],
	      options: addressOptions
	    };
	  },
	  onChange: function onChange(value, selectedOptions) {
	    this.setState({
	      inputValue: selectedOptions.map(function (o) {
	        return o.label;
	      }).join(', ')
	    });
	  },
	  loadData: function loadData(selectedOptions) {
	    var _this = this;
	
	    var options = this.state.options;
	    var targetOption = selectedOptions[selectedOptions.length - 1];
	    targetOption.label += ' loading';
	    // 动态加载下级数据
	    setTimeout(function () {
	      targetOption.label = targetOption.label.replace(' loading', '');
	      targetOption.children = [{
	        'label': targetOption.label + '动态加载1',
	        'value': 'dynamic1'
	      }, {
	        'label': targetOption.label + '动态加载2',
	        'value': 'dynamic2'
	      }];
	      _this.setState({ options: options });
	    }, 1000);
	    this.setState({ options: options });
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      _rcCascader2['default'],
	      { options: this.state.options,
	        loadData: this.loadData,
	        onChange: this.onChange },
	      _react2['default'].createElement('input', { value: this.state.inputValue, readOnly: true })
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=dynamic-options.js.map