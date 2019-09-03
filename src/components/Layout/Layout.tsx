import React, { ComponentProps } from 'react';
import MuiCustomTheme from '../MuiCustomTheme/MuiCustomTheme';
import FixedContainer from '../FixedContainer/FixedContainer';

function Layout({ children }: ComponentProps<'div'>) {
	return (
		<MuiCustomTheme darkMode={false}>
			<FixedContainer>
				{children}
			</FixedContainer>
		</MuiCustomTheme>
	);
}

export default Layout;
