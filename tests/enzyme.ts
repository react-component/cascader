import { mount as originMount } from 'enzyme';
import type { ReactWrapper as OriginReactWrapper } from 'enzyme';

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

interface ReactWrapper extends OriginReactWrapper {
  isOpen: () => boolean;
}

type Mount = ReplaceReturnType<typeof originMount, ReactWrapper>;

export const mount = originMount as Mount;
