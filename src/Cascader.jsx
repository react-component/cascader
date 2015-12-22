import React from 'react';
import Trigger from 'rc-trigger';
import Menus from './Menus';

const prefixCls = 'rc-cascader';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

class Cascader extends React.Component {
  constructor(props) {
    super();
    this.state = {
      popupVisible: false,
    };
    [
      'handleSelect',
      'handleChange',
      'handlePopupVisibleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }
  handleChange(options) {
    this.props.onChange(
      options.map(o => o.value),
      options.map(o => o.label),
    );
    this.setState({
      popupVisible: false,
    });
  }
  handleSelect(options) {
    this.props.onSelect(
      options.map(o => o.value),
      options.map(o => o.label),
    );
  }
  handlePopupVisibleChange(popupVisible) {
    this.setState({ popupVisible });
    this.props.onVisibleChange(popupVisible);
  }
  render() {
    const { prefixCls, transitionName, popupClassName } = this.props;
    const menus = <Menus
      {...this.props}
      onSelect={this.handleSelect}
      onChange={this.handleChange} />;
    return (
      <Trigger ref="trigger"
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupTransitionName={transitionName}
        action={['click']}
        popupVisible={this.state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        prefixCls={`${prefixCls}-menus`}
        popupClassName={popupClassName}
        popup={menus}>
        {this.props.children}
      </Trigger>
    );
  }
};

Cascader.defaultProps = {
  options: [],
  onChange() {},
  onSelect() {},
  onVisibleChange() {},
  transitionName: '',
  prefixCls: prefixCls,
  popupClassName: '',
};

Cascader.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onVisibleChange: React.PropTypes.func,
  transitionName: React.PropTypes.string,
  popupClassName: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
};

export default Cascader;
