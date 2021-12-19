
import React from 'react';
import { Container, Box } from '@mui/material';
import { ContainerProps } from '@mui/material/Container';


function FixedContainer(props: ContainerProps) {
	return (
		<Box mt={4} mb={4}>
			<Container maxWidth="md" {...props} />
		</Box>
	);
}

export default FixedContainer;
