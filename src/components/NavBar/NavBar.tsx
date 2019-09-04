
import React, { ComponentProps } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Link } from 'gatsby';

function NavBar(props: ComponentProps<'header'>) {
	return (
		<header {...props}>
			<Typography variant="h1" color="primary">
				<Box fontSize="h4.fontSize" letterSpacing={6} marginBottom={1}>
					<Link to="/" style={{ boxShadow: 'none' }}>
						{`In the Middle 站中間。`}
					</Link>
				</Box>
			</Typography>
			<Typography variant="body1">
				Personal Blog by Galen Wong
			</Typography>
		</header>
	);
}

export default NavBar;
