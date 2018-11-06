webpackJsonp([14],{

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(97);


/***/ }),

/***/ 97:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_cascader__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var MyCascader = function (_React$Component) {
  _inherits(MyCascader, _React$Component);

  function MyCascader() {
    var _temp, _this, _ret;

    _classCallCheck(this, MyCascader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
      inputValue: ''
    }, _this.onChange = function (value, selectedOptions) {
      console.log(value, selectedOptions);
      _this.setState({
        inputValue: selectedOptions.map(function (o) {
          return o.label;
        }).join(', ')
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  MyCascader.prototype.render = function render() {
    var builtinPlacements = this.props.builtinPlacements;

    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_rc_cascader__["a" /* default */],
      {
        options: addressOptions,
        builtinPlacements: builtinPlacements,
        onChange: this.onChange
      },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', {
        placeholder: builtinPlacements ? 'Will not adjust position' : 'Will adjust position',
        value: this.state.inputValue,
        style: { width: 170 }
      })
    );
  };

  return MyCascader;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

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

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
  'div',
  { style: { position: 'absolute', right: 10, top: 150 } },
  __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(MyCascader, null),
  __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('br', null),
  __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('br', null),
  __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(MyCascader, { builtinPlacements: placements })
), document.getElementById('__react-content'));

/***/ })

},[96]);
//# sourceMappingURL=adjust-overflow.js.map