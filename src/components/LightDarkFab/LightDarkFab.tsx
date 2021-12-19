import React, { useContext } from 'react';
import { Fab, NoSsr } from '@mui/material';
import LightDarkContext from '../../../plugins/gatsby-plugin-top-layout/LightDarkContext';

import SunnyIcon from '@mui/icons-material/WbSunny';
import NightIcon from '@mui/icons-material/Brightness3';
import { FabProps } from '@mui/material/Fab';

function LightDarkFab(props: FabProps) {
	const { theme, changeTheme } = useContext(LightDarkContext);

	return (
		<NoSsr>
			<Fab
				color={theme === 'dark' ? 'default' : 'primary'}
				size="medium"
				onClick={() => changeTheme(!(theme === 'dark'))}
				aria-label="Toggle light or dark mode"
				{...props}
			>
				{ theme === 'dark' ? <NightIcon /> : <SunnyIcon /> }
			</Fab>
		</NoSsr>
	);
}

export default LightDarkFab;
