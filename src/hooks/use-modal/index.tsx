import { useContext } from 'react';

import UseModalContext from './context';
import { UseModalProviderContext } from './types';

export default (): UseModalProviderContext => useContext(UseModalContext);
