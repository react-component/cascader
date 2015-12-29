import React from 'react';
import Trigger from 'rc-trigger';
import Menus from './Menus';

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
      popupVisible: props.popupVisible,
    };
    [
      'handleChange',
      'handlePopupVisibleChange',
      'getPopupDOMNode',
    ].forEach(method => this[method] = this[method].bind(this));
  }
  componentWillReceiveProps(nextProps) {
    if ('popupVisible' in nextProps) {
      this.setState({
        popupVisible: nextProps.popupVisible,
      });
    }
  }
  getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  }
  handleChange(options) {
    this.props.onChange(
      options.map(o => o.value),
      options,
    );
    this.setState({
      popupVisible: false,
    });
  }
  handlePopupVisibleChange(popupVisible) {
    if (!('popupVisible' in this.props)) {
      this.setState({ popupVisible });
    }
    this.props.onPopupVisibleChange(popupVisible);
  }
  render() {
    const props = this.props;
    const { prefixCls, transitionName, popupClassName } = props;
    const menus = (
      <Menus
        {...props}
        onChange={this.handleChange}
        onSelect={this.props.onSelect}
        visible={this.state.popupVisible} />
    );
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
        {props.children}
      </Trigger>
    );
  }
}

Cascader.defaultProps = {
  options: [],
  onChange() {},
  onSelect() {},
  onPopupVisibleChange() {},
  transitionName: '',
  prefixCls: 'rc-cascader',
  popupClassName: '',
};

Cascader.propTypes = {
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  onPopupVisibleChange: React.PropTypes.func,
  popupVisible: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  popupClassName: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
};

export default Cascader;
