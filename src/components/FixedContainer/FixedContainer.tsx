
import React from 'react';
import { Container, Box } from '@material-ui/core';
import { ContainerProps } from '@material-ui/core/Container';


function FixedContainer(props: ContainerProps) {
	return (
		<Box mt={4} mb={4}>
			<Container maxWidth="md" {...props} />
		</Box>
	);
}

export default FixedContainer;
