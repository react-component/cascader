webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
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
	
	/* eslint-disable no-console, react/prop-types */
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
	    value: 'haidian',
	    disabled: true
	  }]
	}];
	
	var MyCascader = _react2.default.createClass({
	  displayName: 'MyCascader',
	  getInitialState: function getInitialState() {
	    return {
	      inputValue: ''
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
	    var builtinPlacements = this.props.builtinPlacements;
	
	    return _react2.default.createElement(
	      _rcCascader2.default,
	      {
	        options: addressOptions,
	        builtinPlacements: builtinPlacements,
	        onChange: this.onChange
	      },
	      _react2.default.createElement('input', {
	        placeholder: builtinPlacements ? 'Will not adjust position' : 'Will adjust position',
	        value: this.state.inputValue,
	        style: { width: 170 }
	      })
	    );
	  }
	});
	
	var placements = {
	  bottomLeft: {
	    points: ['tl', 'bl'],
	    offset: [0, 4],
	    overflow: {
	      adjustY: 1
	    }
	  },
	  topLeft: {
	    points: ['bl', 'tl'],
	    offset: [0, -4],
	    overflow: {
	      adjustY: 1
	    }
	  },
	  bottomRight: {
	    points: ['tr', 'br'],
	    offset: [0, 4],
	    overflow: {
	      adjustY: 1
	    }
	  },
	  topRight: {
	    points: ['br', 'tr'],
	    offset: [0, -4],
	    overflow: {
	      adjustY: 1
	    }
	  }
	};
	
	_reactDom2.default.render(_react2.default.createElement(
	  'div',
	  { style: { textAlign: 'right', margin: '0 80px' } },
	  _react2.default.createElement(MyCascader, null),
	  _react2.default.createElement('br', null),
	  _react2.default.createElement('br', null),
	  _react2.default.createElement(MyCascader, { builtinPlacements: placements })
	), document.getElementById('__react-content'));

/***/ }
]);
//# sourceMappingURL=adjust-overflow.js.map