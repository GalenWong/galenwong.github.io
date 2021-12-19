
import React, { ComponentProps } from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'gatsby';

function NavBar(props: ComponentProps<'header'>) {
	return (
		<header {...props}>
			<Typography variant="h4" color="primary">
				<Box letterSpacing={6} marginBottom={1} fontWeight="h1.fontWeight">
					<Link to="/" style={{ boxShadow: 'none' }}>
						<span style={{ whiteSpace: 'nowrap' }}>In the Middle</span>
						{` `}
						<span style={{ whiteSpace: 'nowrap' }}>站中間。</span>
					</Link>
				</Box>
			</Typography>
			<Typography variant="body1">
				Personal Blog
				by <Link to="/about"> Galen Wong </Link>
			</Typography>
		</header>
	);
}

export default NavBar;
