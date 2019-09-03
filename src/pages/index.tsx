import React from 'react';
import MuiCustomTheme from '../components/MuiCustomTheme/MuiCustomTheme';
import FixedContainer from '../components/FixedContainer/FixedContainer';
import BlogPost from '../components/BlogPost/BlogPost';

const IndexPage = () =>
	<MuiCustomTheme darkMode={false}>
		<FixedContainer>
			<BlogPost />
		</FixedContainer>
	</MuiCustomTheme>;

export default IndexPage;
