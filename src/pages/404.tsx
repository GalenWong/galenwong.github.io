import React from 'react';
import Layout from '../components/Layout/Layout';
import { Link } from 'gatsby';

const NotFoundPage = () =>
	<Layout>
		<h3> This page does not exist in the middle. </h3>
		<p>
			<Link to="/">{`Go back to "the middle"`}</Link>
			{`, before you get too lost…`}
		</p>
	</Layout>;

export default NotFoundPage;
