
import React, { ComponentProps, useState } from 'react';
import LightDarkContext, { palleteOptions } from '../LightDarkContext/LightDarkContext';
import MuiCustomTheme from '../MuiCustomTheme/MuiCustomTheme';

interface ThemeTopLevelProvider extends ComponentProps<'div'> {
	initTheme: palleteOptions;
}

function ThemeTopLevelProvider({ children, initTheme }: ThemeTopLevelProvider) {
	const [mode, setMode] = useState(initTheme);

	const setTheme = (isDark: boolean) => {
		const val = isDark ? 'dark' : 'light';
		localStorage.setItem('theme', val);
		setMode(val);
	};

	return (
		<MuiCustomTheme darkMode={mode === 'dark'}>
			<LightDarkContext.Provider value={{
				theme: mode,
				changeTheme: setTheme
			}}>
				{children}
			</LightDarkContext.Provider>
		</MuiCustomTheme>
	);
}

export default ThemeTopLevelProvider;
