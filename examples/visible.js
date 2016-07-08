webpackJsonp([11],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(254);


/***/ },

/***/ 254:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(2);
	
	var _rcCascader = __webpack_require__(3);
	
	var _rcCascader2 = _interopRequireDefault(_rcCascader);
	
	var _react = __webpack_require__(6);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(40);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _arrayTreeFilter = __webpack_require__(208);
	
	var _arrayTreeFilter2 = _interopRequireDefault(_arrayTreeFilter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var addressOptions = [{
	  label: '福建',
	  value: 'fj',
	  children: [{
	    label: '福州',
	    value: 'fuzhou',
	    children: [{
	      label: '马尾',
	      value: 'mawei'
	    }]
	  }, {
	    label: '泉州',
	    value: 'quanzhou'
	  }]
	}, {
	  label: '浙江',
	  value: 'zj',
	  children: [{
	    label: '杭州',
	    value: 'hangzhou',
	    children: [{
	      label: '余杭',
	      value: 'yuhang'
	    }]
	  }]
	}, {
	  label: '北京',
	  value: 'bj',
	  children: [{
	    label: '朝阳区',
	    value: 'chaoyang'
	  }, {
	    label: '海淀区',
	    value: 'haidian'
	  }]
	}]; /* eslint-disable no-console */
	
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	  getInitialState: function getInitialState() {
	    return {
	      value: [],
	      popupVisible: false
	    };
	  },
	  onChange: function onChange(value) {
	    this.setState({ value: value });
	  },
	  onPopupVisibleChange: function onPopupVisibleChange(popupVisible) {
	    this.setState({ popupVisible: popupVisible });
	  },
	  getLabel: function getLabel() {
	    var _this = this;
	
	    return (0, _arrayTreeFilter2.default)(addressOptions, function (o, level) {
	      return o.value === _this.state.value[level];
	    }).map(function (o) {
	      return o.label;
	    }).join(', ');
	  },
	  render: function render() {
	    return _react2.default.createElement(
	      _rcCascader2.default,
	      {
	        popupVisible: this.state.popupVisible,
	        value: this.state.value,
	        options: addressOptions,
	        onPopupVisibleChange: this.onPopupVisibleChange,
	        onChange: this.onChange
	      },
	      _react2.default.createElement('input', { value: this.getLabel(), readOnly: true })
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=visible.js.map