
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

interface SEOProps {
	title?: string;
	description?: string;
	image?: string;
	pathname?: string;
	article?: boolean;
}

function SEO({
	title,
	description,
	// image,
	pathname,
	article = false
}: SEOProps) {
	const { site: { siteMetadata } } = useStaticQuery(graphql`
	{
		site {
			siteMetadata {
				author
				description
				title
				url
				titleTemplate
			}
		}
	}
	`);
	const seo = {
		title: title || siteMetadata.title,
		titleTemplate: title ? siteMetadata.titleTemplate : undefined,
		description: description || siteMetadata.description,
		url: `${siteMetadata.url}${pathname || '/'}`
	};
	return (
		<Helmet title={seo.title} titleTemplate={seo.titleTemplate}>
			<meta name="description" content={seo.description}/>
			{seo.url && <meta property="og:url" content={seo.url} />}
			{(article ? true : null) &&
				<meta property="og:type" content="article" />
			}
			{seo.description &&
				<meta property="og:description" content={seo.description} />
			}
		</Helmet>
	);
}

export default SEO;
