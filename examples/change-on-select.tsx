/* eslint-disable no-console */
import React from 'react';
import '../assets/index.less';
import Cascader from '../src';

const options = [
  {
    label: "Women Clothing",
    value: "Women Clothing",
    children: [
      {
        label: "Women Tops, Blouses & Tee",
        value: "Women Tops, Blouses & Tee",
        children: [
          {
            label: "Women T-Shirts",
            value: "Women T-Shirts"
          },
          {
            label: "Women Tops",
            value: "Women Tops"
          },
          {
            label: "Women Tank Tops & Camis",
            value: "Women Tank Tops & Camis"
          },
          {
            label: "Women Blouses",
            value: "Women Blouses"
          }
        ]
      },
      {
        label: "Women Suits",
        value: "Women Suits",
        children: [
          {
            label: "Women Suit Pants",
            value: "Women Suit Pants"
          },
          {
            label: "Women Suit Sets",
            value: "Women Suit Sets"
          },
          {
            label: "Women Blazers",
            value: "Women Blazers"
          }
        ]
      },
      {
        label: "Women Co-ords",
        value: "Women Co-ords",
        children: [
          {
            label: "Two-piece Outfits",
            value: "Two-piece Outfits"
          }
        ]
      }
    ]
  }
];

class Demo extends React.Component {
  state = {
    inputValue: '',
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    this.setState({
      inputValue: selectedOptions.map(o => o.label).join(', '),
    });
  };

  render() {
    return (
      <Cascader
        showSearch
        options={options}
        onChange={this.onChange}
        changeOnSelect
        expandTrigger="hover"
        loadData={() => console.log('loadData')}
      />
    );
  }
}

export default Demo;
