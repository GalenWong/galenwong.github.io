
import React, { ComponentProps } from 'react';
import { Typography, Box } from '@material-ui/core';
import { Link } from 'gatsby';

function NavBar(props: ComponentProps<'header'>) {
	return (
		<header {...props}>
			<Typography variant="h4" color="primary">
				<Box letterSpacing={6} marginBottom={1} fontWeight="h1.fontWeight">
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
