import type { DefaultOptionType } from '@/Cascader';

export const optionsForActiveMenuItems: DefaultOptionType[] = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1',
        label: '1',
      },
      {
        value: '2',
        label: '2',
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '1',
        label: '1',
      },
      {
        value: '2',
        label: '2',
      },
      {
        value: '3',
        label: '3',
      },
    ],
  },
];

export const addressOptions: DefaultOptionType[] = [
  {
    label: '福建',
    value: 'fj',
    children: [
      {
        label: '福州',
        value: 'fuzhou',
        children: [
          {
            label: '马尾',
            value: 'mawei',
          },
        ],
      },
      {
        label: '泉州',
        value: 'quanzhou',
      },
    ],
  },
  {
    label: '浙江',
    value: 'zj',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          {
            label: '余杭',
            value: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    label: '北京',
    value: 'bj',
    children: [
      {
        label: '朝阳区',
        value: 'chaoyang',
      },
      {
        label: '海淀区',
        value: 'haidian',
      },
    ],
  },
];

export const addressOptionsForFieldNames = [
  {
    name: '福建',
    code: 'fj',
    nodes: [
      {
        name: '福州',
        code: 'fuzhou',
        nodes: [
          {
            name: '马尾',
            code: 'mawei',
          },
        ],
      },
      {
        name: '泉州',
        code: 'quanzhou',
      },
    ],
  },
  {
    name: '浙江',
    code: 'zj',
    nodes: [
      {
        name: '杭州',
        code: 'hangzhou',
        nodes: [
          {
            name: '余杭',
            code: 'yuhang',
          },
        ],
      },
    ],
  },
  {
    name: '北京',
    code: 'bj',
    nodes: [
      {
        name: '朝阳区',
        code: 'chaoyang',
      },
      {
        name: '海淀区',
        code: 'haidian',
      },
    ],
  },
];

// Uneven
export const addressOptionsForUneven = [
  ...addressOptions,
  {
    label: '台湾',
    value: 'tw',
    children: [
      {
        label: '台北',
        value: 'taipei',
        children: [
          {
            label: '中正区',
            value: 'zhongzheng',
          },
        ],
      },
      {
        label: '高雄',
        value: 'gaoxiong',
      }
    ]
  },
  {
    label: '香港',
    value: 'xg',
  },
]