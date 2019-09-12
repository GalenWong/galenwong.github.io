import React, { ComponentProps } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

function FooterBar(props: ComponentProps<'p'>) {
	const resumes = useStaticQuery(graphql`
		{
			cn: file(ext: {eq: ".pdf"}, name: {regex: "/黄子焕/"}) {
				publicURL
				name
			}
			en: file(ext: {eq: ".pdf"}, name: {regex: "/Galen/"}) {
				publicURL
				name
			}
		}
	`);
	const enResumeURL = resumes.en.publicURL;
	const cnResumeURL = resumes.cn.publicURL;
	const Aext = ({ children, ...aProps }: ComponentProps<'a'>) =>
		<a rel="noreferrer noopener" target="_blank" {...aProps}>{children}</a>;
	return (
		<p {...props}>
			<Aext href={enResumeURL}>resume</Aext>
			{` • `}
			<Aext href={cnResumeURL}>简历</Aext>
			{` • `}
			<Aext href="https://github.com/GalenWong">github</Aext>
			{` • `}
			<Aext href="https://www.instagram.com/wonggalen/">insta</Aext>
			{` • `}
			<a href="mailto:wonggalen1999@gmail.com">wonggalen1999@gmail.com</a>
			{` • `}
			<Link to="/about">about</Link>
		</p>
	);
}

export default FooterBar;
