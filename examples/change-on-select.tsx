import React from 'react';
import '../assets/index.less';
import type { CascaderProps } from '../src';
import Cascader from '../src';
import type { Option2 } from './utils';

const options = [
  {
    label: 'Women Clothing',
    value: 'Women Clothing',
    children: [
      {
        label: 'Women Tops, Blouses & Tee',
        value: 'Women Tops, Blouses & Tee',
        children: [
          {
            label: 'Women T-Shirts',
            value: 'Women T-Shirts',
          },
          {
            label: 'Women Tops',
            value: 'Women Tops',
          },
          {
            label: 'Women Tank Tops & Camis',
            value: 'Women Tank Tops & Camis',
          },
          {
            label: 'Women Blouses',
            value: 'Women Blouses',
          },
        ],
      },
      {
        label: 'Women Suits',
        value: 'Women Suits',
        children: [
          {
            label: 'Women Suit Pants',
            value: 'Women Suit Pants',
          },
          {
            label: 'Women Suit Sets',
            value: 'Women Suit Sets',
          },
          {
            label: 'Women Blazers',
            value: 'Women Blazers',
          },
        ],
      },
      {
        label: 'Women Co-ords',
        value: 'Women Co-ords',
        children: [
          {
            label: 'Two-piece Outfits',
            value: 'Two-piece Outfits',
          },
        ],
      },
    ],
  },
];

const onChange: CascaderProps<Option2>['onChange'] = (value, selectedOptions) => {
  console.log(value, selectedOptions);
};

const Demo = () => (
  <Cascader
    showSearch
    options={options}
    onChange={onChange}
    changeOnSelect
    expandTrigger="hover"
    loadData={() => console.log('loadData')}
  />
);

export default Demo;
