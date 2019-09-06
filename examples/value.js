webpackJsonp([2],{

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(280);


/***/ }),

/***/ 280:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_array_tree_filter__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_array_tree_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_array_tree_filter__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Demo = function (_React$Component) {
  _inherits(Demo, _React$Component);

  function Demo() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Demo);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Demo.__proto__ || Object.getPrototypeOf(Demo)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      value: []
    }, _this.onChange = function (value) {
      console.log(value);
      _this.setState({ value: value });
    }, _this.setValue = function () {
      _this.setState({
        value: ['bj', 'chaoyang']
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Demo, [{
    key: 'getLabel',
    value: function getLabel() {
      var _this2 = this;

      return __WEBPACK_IMPORTED_MODULE_4_array_tree_filter___default()(addressOptions, function (o, level) {
        return o.value === _this2.state.value[level];
      }).map(function (o) {
        return o.label;
      }).join(', ');
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
        'div',
        null,
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
          'button',
          { onClick: this.setValue },
          'set value to \u5317\u4EAC\u671D\u9633\u533A'
        ),
        __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_1_rc_cascader__["a" /* default */],
          { value: this.state.value, options: addressOptions, onChange: this.onChange },
          __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', { value: this.getLabel(), readOnly: true })
        )
      );
    }
  }]);

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[279]);
//# sourceMappingURL=value.js.map