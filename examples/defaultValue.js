webpackJsonp([4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(255);


/***/ },

/***/ 255:
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
	
	/* eslint-disable no-console */
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
	  label: '占位1',
	  value: 'zw1'
	}, {
	  label: '占位2',
	  value: 'zw2'
	}, {
	  label: '占位3',
	  value: 'zw3'
	}, {
	  label: '占位4',
	  value: 'zw4'
	}, {
	  label: '占位5',
	  value: 'zw5'
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
	}];
	
	var defaultOptions = [{
	  label: '浙江',
	  value: 'zj'
	}, {
	  label: '杭州',
	  value: 'hangzhou'
	}, {
	  label: '余杭',
	  value: 'yuhang'
	}];
	
	var Demo = _react2.default.createClass({
	  displayName: 'Demo',
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: defaultOptions.map(function (o) {
	        return o.label;
	      }).join(', ')
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
	  render: function render() {
	    var defaultValue = defaultOptions.map(function (o) {
	      return o.value;
	    });
	    return _react2.default.createElement(
	      _rcCascader2.default,
	      { defaultValue: defaultValue, options: addressOptions, onChange: this.onChange },
	      _react2.default.createElement('input', { value: this.state.inputValue, readOnly: true })
	    );
	  }
	});
	
	_reactDom2.default.render(_react2.default.createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=defaultValue.js.map