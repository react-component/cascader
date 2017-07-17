webpackJsonp([6],{

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(321);


/***/ }),

/***/ 321:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _rcCascader = __webpack_require__(3);
	
	var _rcCascader2 = _interopRequireDefault(_rcCascader);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(83);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); } /* eslint-disable no-console */
	
	
	var addressOptions = [{
	  label: '福建',
	  isLeaf: false,
	  value: 'fj'
	}, {
	  label: '浙江',
	  isLeaf: false,
	  value: 'zj'
	}];
	
	var Demo = function (_React$Component) {
	  _inherits(Demo, _React$Component);
	
	  function Demo() {
	    var _temp, _this, _ret;
	
	    _classCallCheck(this, Demo);
	
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }
	
	    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
	      inputValue: '',
	      options: addressOptions
	    }, _this.onChange = function (value, selectedOptions) {
	      console.log(value, selectedOptions);
	      _this.setState({
	        inputValue: selectedOptions.map(function (o) {
	          return o.label;
	        }).join(', ')
	      });
	    }, _this.loadData = function (selectedOptions) {
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
	    }, _temp), _possibleConstructorReturn(_this, _ret);
	  }
	
	  Demo.prototype.render = function render() {
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
	  };
	
	  return Demo;
	}(_react2.default.Component);
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

});
//# sourceMappingURL=dynamic-options.js.map