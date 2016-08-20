import React from 'react';
import Trigger from 'rc-trigger';
import Menus from './Menus';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'bl'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
  topRight: {
    points: ['br', 'tr'],
    offset: [0, -4],
    overflow: {
      adjustX: 1,
      adjustY: 1,
    },
  },
};

class Cascader extends React.Component {
  constructor(props) {
    super(props);
    let initialValue = [];
    if ('value' in props) {
      initialValue = props.value || [];
    } else if ('defaultValue' in props) {
      initialValue = props.defaultValue || [];
    }

    this.state = {
      popupVisible: props.popupVisible,
      activeValue: initialValue,
      value: initialValue,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && this.props.value !== nextProps.value) {
      const newValues = {
        value: nextProps.value || [],
        activeValue: nextProps.value || [],
      };
      // allow activeValue diff from value
      // https://github.com/ant-design/ant-design/issues/2767
      if ('loadData' in nextProps) {
        delete newValues.activeValue;
      }
      this.setState(newValues);
    }
    if ('popupVisible' in nextProps) {
      this.setState({
        popupVisible: nextProps.popupVisible,
      });
    }
  }
  getPopupDOMNode() {
    return this.refs.trigger.getPopupDomNode();
  }
  setPopupVisible = (popupVisible) => {
    if (!('popupVisible' in this.props)) {
      this.setState({ popupVisible });
    }
    // sync activeValue with value when panel open
    if (popupVisible && !this.state.visible) {
      this.setState({
        activeValue: this.state.value,
      });
    }
    this.props.onPopupVisibleChange(popupVisible);
  }
  handleChange = (options, setProps) => {
    this.props.onChange(options.map(o => o.value), options);
    this.setPopupVisible(setProps.visible);
  }
  handlePopupVisibleChange = (popupVisible) => {
    this.setPopupVisible(popupVisible);
  }
  handleSelect = ({ ...info }) => {
    if ('value' in this.props) {
      delete info.value;
    }
    this.setState(info);
  }
  render() {
    const props = this.props;
    const { prefixCls, transitionName, popupClassName, popupPlacement, ...restProps } = props;
    // Did not show popup when there is no options
    let menus = <div />;
    let emptyMenuClassName = '';
    if (props.options && props.options.length > 0) {
      menus = (
        <Menus
          {...props}
          value={this.state.value}
          activeValue={this.state.activeValue}
          onSelect={this.handleSelect}
          onChange={this.handleChange}
          visible={this.state.popupVisible}
        />
      );
    } else {
      emptyMenuClassName = ` ${prefixCls}-menus-empty`;
    }
    return (
      <Trigger ref="trigger"
        {...restProps}
        popupPlacement={popupPlacement}
        builtinPlacements={BUILT_IN_PLACEMENTS}
        popupTransitionName={transitionName}
        action={props.disabled ? [] : ['click']}
        popupVisible={props.disabled ? false : this.state.popupVisible}
        onPopupVisibleChange={this.handlePopupVisibleChange}
        prefixCls={`${prefixCls}-menus`}
        popupClassName={popupClassName + emptyMenuClassName}
        popup={menus}
      >
        {props.children}
      </Trigger>
    );
  }
}

Cascader.defaultProps = {
  options: [],
  onChange() {},
  onPopupVisibleChange() {},
  disabled: false,
  transitionName: '',
  prefixCls: 'rc-cascader',
  popupClassName: '',
  popupPlacement: 'bottomLeft',
};

Cascader.propTypes = {
  value: React.PropTypes.array,
  defaultValue: React.PropTypes.array,
  options: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  onPopupVisibleChange: React.PropTypes.func,
  popupVisible: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  transitionName: React.PropTypes.string,
  popupClassName: React.PropTypes.string,
  popupPlacement: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  dropdownMenuColumnStyle: React.PropTypes.object,
};

export default Cascader;
