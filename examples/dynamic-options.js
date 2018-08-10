webpackJsonp([6],{

/***/ 199:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(200);


/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_rc_cascader_assets_index_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rc_cascader__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-console */





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
          options: [].concat(_this.state.options)
        });
      }, 1000);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  Demo.prototype.render = function render() {
    return __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_rc_cascader__["a" /* default */],
      {
        options: this.state.options,
        loadData: this.loadData,
        onChange: this.onChange,
        changeOnSelect: true
      },
      __WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement('input', { value: this.state.inputValue, readOnly: true })
    );
  };

  return Demo;
}(__WEBPACK_IMPORTED_MODULE_2_react___default.a.Component);

__WEBPACK_IMPORTED_MODULE_3_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(Demo, null), document.getElementById('__react-content'));

/***/ })

},[199]);
//# sourceMappingURL=dynamic-options.js.map