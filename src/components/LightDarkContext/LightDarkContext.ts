
import React from 'react';

export type palleteOptions = 'light' | 'dark';

type themeMutation = (isDark: boolean) => void
const LightDarkContext = React.createContext({
	theme: 'light' as palleteOptions,
	// a type def to
	changeTheme: (() => {}) as themeMutation
});

export default LightDarkContext;
