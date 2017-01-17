webpackJsonp([6],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(257);


/***/ },

/***/ 257:
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
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-console */
	
	
	var addressOptions = [{
	  label: '福建',
	  isLeaf: false,
	  value: 'fj'
	}, {
	  label: '浙江',
	  isLeaf: false,
	  value: 'zj'
	}];
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: '',
	      options: addressOptions
	    };
	  },
	  onChange: function onChange(value, selectedOptions) {
	    console.log(value, selectedOptions);
	    this.setState({
	      inputValue: selectedOptions.map(function (o) {
	        return o.label;
	      }).join(', ')
	    });
	  },
	  loadData: function loadData(selectedOptions) {
	    var _this = this;
	
	    var targetOption = selectedOptions[selectedOptions.length - 1];
	    targetOption.loading = true;
	    // 动态加载下级数据
	    setTimeout(function () {
	      targetOption.loading = false;
	      targetOption.children = [{
	        label: targetOption.label + '\u52A8\u6001\u52A0\u8F7D1',
	        value: 'dynamic1'
	      }, {
	        label: targetOption.label + '\u52A8\u6001\u52A0\u8F7D2',
	        value: 'dynamic2'
	      }];
	      _this.setState({
	        options: [].concat(_toConsumableArray(_this.state.options))
	      });
	    }, 1000);
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      _rcCascader2.default,
	      {
	        options: this.state.options,
	        loadData: this.loadData,
	        onChange: this.onChange,
	        changeOnSelect: true
	      },
	      _react2.default.createElement('input', { value: this.state.inputValue, readOnly: true })
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=dynamic-options.js.map