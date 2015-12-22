webpackJsonp([3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(214);


/***/ },

/***/ 214:
/***/ function(module, exports, __webpack_require__) {

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
	  'value': 'fj',
	  'options': [{
	    'label': '福州',
	    'value': 'fuzhou',
	    'options': [{
	      'label': '马尾',
	      'value': 'mawei'
	    }]
	  }, {
	    'label': '泉州',
	    'value': 'quanzhou'
	  }]
	}, {
	  'label': '浙江',
	  'value': 'zj',
	  'options': [{
	    'label': '杭州',
	    'value': 'hangzhou',
	    'options': [{
	      'label': '余杭',
	      'value': 'yuhang'
	    }]
	  }]
	}, {
	  'label': '北京',
	  'value': 'bj',
	  'options': [{
	    'label': '朝阳区',
	    'value': 'chaoyang'
	  }, {
	    'label': '海淀区',
	    'value': 'haidian'
	  }]
	}];
	
	var Demo = _react2['default'].createClass({
	  displayName: 'Demo',
	
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: '未选择'
	    };
	  },
	  onChange: function onChange(values, labels) {
	    console.log(values, labels);
	    this.setState({
	      inputValue: labels.join(', ')
	    });
	  },
	  render: function render() {
	    return _react2['default'].createElement(
	      'span',
	      null,
	      this.state.inputValue,
	      _react2['default'].createElement(
	        _rcCascader2['default'],
	        { options: addressOptions, onChange: this.onChange },
	        _react2['default'].createElement(
	          'a',
	          { href: '#' },
	          '切换地区'
	        )
	      )
	    );
	  }
	});
	
	_reactDom2['default'].render(_react2['default'].createElement(Demo, null), document.getElementById('__react-content'));

/***/ }

});
//# sourceMappingURL=text-trigger.js.map