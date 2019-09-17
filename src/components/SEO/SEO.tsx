
import React from 'react';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import bannerURL from './banner.png';

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
	image,
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
		url: `${siteMetadata.url}${pathname || '/'}`,
		image: `${siteMetadata.url}${image || bannerURL}`
	};
	return (
		<Helmet title={seo.title} titleTemplate={seo.titleTemplate}>
			<meta name="description" content={seo.description} />
			<meta name="image" content={seo.image} />
			{seo.url && <meta property="og:url" content={seo.url} />}
			<meta property="og:image" content={seo.image} />
			{(article ? true : null) &&
				<meta property="og:type" content="article" />
			}
			{seo.description &&
				<meta property="og:description" content={seo.description} />
			}
			<html lang="en" />
		</Helmet>
	);
}

export default SEO;
