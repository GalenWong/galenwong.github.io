
import React from 'react';
import About from '../components/About/About';
import Layout from '../components/Layout/Layout';
import SEO from '../components/SEO/SEO';

function AboutPage() {
	return (
		<Layout showTopInfo>
			<SEO title="About Galen" description="Galen is weird..." />
			<About />
		</Layout>
	);
}

export default AboutPage;
