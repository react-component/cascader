/* eslint-disable @typescript-eslint/no-unused-vars */
export interface DefaultOptionType {
  disabled?: boolean;
  value?: string | number | null;
  children?: DefaultOptionType[];
  [name: string]: any;
}

export interface FieldNames<
  OptionType extends DefaultOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> {
  label?: T;
  value?: T;
  children?: T;
}

export interface Props<
  OptionType extends DefaultOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
> {
  fieldNames?: FieldNames<OptionType, T>;
  //   names?: T;
  options?: OptionType[];
  value?: keyof OptionType extends T ? OptionType['value'] : OptionType[T];
  onChange?: (value: any, selectOptions: OptionType[]) => void;
}

function demo<
  OptionType extends DefaultOptionType = DefaultOptionType,
  T extends keyof OptionType = keyof OptionType,
>(props: Props<OptionType, T>) {}

demo({
  options: [{ value: 11, id: 'aa', id2: true }],
  //   names: 'id',
  //   value: '111',
});

demo({ options: [{ value: 11, id: '11' }], value: 111 });

// demo({ options: [{ value: 11 }], value: '111' });

demo({ options: [{ value: 11, id: 'aa' }], value: '111', fieldNames: { value: 'id' } });

demo({ options: [{ value: 11, id: 'aa' }], fieldNames: { value: 'id' }, value: '111' });

demo({
  options: [{ value: 11, id: 'aa', id2: true, children: [{}] }],
  fieldNames: { value: 'id' },
  value: '1111',
});

demo({ options: [{ id: 'aa' }], value: '11', fieldNames: { value: 'id' } });
