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
      'handlePopupVisibleChange',
    ].forEach(method => this[method] = this[method].bind(this));
  }
  handleSelect(options) {
    this.props.onChange(options);
    this.setState({
      popupVisible: false,
    });
  }
  handlePopupVisibleChange(popupVisible) {
    this.setState({ popupVisible });
    this.props.onVisibleChange(popupVisible);
  }
  render() {
    const { options, prefixCls } = this.props;
    const menus = <Menus prefixCls={prefixCls} options={options} onSelect={this.handleSelect} />;
    return (
      <Trigger ref="trigger"
        popupPlacement="bottomLeft"
        builtinPlacements={BUILT_IN_PLACEMENTS}
        action={['click']}
        popupVisible={this.state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        prefixCls={`${prefixCls}-menus`}
        popup={menus}>
        {this.props.children}
      </Trigger>
    );
  }
};

Cascader.defaultProps = {
  options: [],
  onChange() {},
  onVisibleChange() {},
  prefixCls: prefixCls,
};

Cascader.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  onVisibleChange: React.PropTypes.func,
  prefixCls: React.PropTypes.string,
};

export default Cascader;
