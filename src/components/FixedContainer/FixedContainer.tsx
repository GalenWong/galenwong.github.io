
import React from 'react';
import { Container } from '@material-ui/core';
import { ContainerProps } from '@material-ui/core/Container';

function FixedContainer(props: ContainerProps) {
	return (
		<Container maxWidth="md" {...props} />
	);
}

export default FixedContainer;
