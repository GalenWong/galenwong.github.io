
import React, { ComponentProps } from 'react';
import { Typography, Theme } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/styles';

const introStr = `
Hi, my name is Galen Wong.
I am a UCLA Computer Science undergrad.
I mostly do work in JavaScript,
especially frontend development with React.
I also works with Go, C/C++ (learnt from school),
and Python (my introductory language).
`;

const lazyUpdate = <>
	{`I don't like to put too much stuff on this page,
	since I know things are going to change and I don't
	want to come back and update it.
	I can't imagine the extend of boredom that it
	takes to get me to update my intro from “I was a UCLA CS…”
	to “I am working for blahblahblah”. `}
	<strong>
	If you are really interested in knowing me,
	contact me through email or facebook or whatever,
	or even better, meet me in real life.
	</strong>
	{` Yes, I do work with computer software, things that are mostly
	virtual. But ultimately they serve what is real and tangible:
	Meat and flesh like me, and like you.`}
</>;

const useStyles = makeStyles((theme: Theme) => createStyles({
	paragraph: {
		marginBottom: theme.spacing(2)
	}
}));

function About() {
	const classes = useStyles();
	const Title = ({ children }: ComponentProps<'h2'>) =>
		<Typography variant="h3" component="h2" classes={{ root: classes.paragraph }}>
			{children}
		</Typography>;

	const Quote = ({ children }: ComponentProps<'h5'>) =>
		<h5><blockquote><i>{ children }</i></blockquote></h5>;

	const Aext = ({ children, ...aProps }: ComponentProps<'a'>) =>
		<a target="_blank" rel="noreferrer noopener" {...aProps}>{children}</a>;

	return (
		<article>
			<Title>
				Disclaimer
			</Title>
			<p>
				Opinions expressed are solely my own and do not express the views or
				opinions of my employer.
			</p>
			<Title>
				About Galen
			</Title>
			<p> {introStr} </p>
			<Quote>
				Meat and Flesh like me, and like you…
			</Quote>
			<p> {lazyUpdate} </p>
			<Title>
				Facts
			</Title>
			<p>
				What I am writing in this section are facts about me
				as of September 12, 2019.
				These are facts about the 2019-09-12 me that I will not
				need to update these in the future.
				However, they might not apply to the current me.
			</p>
			<Quote>
				As of September 12<sup>th</sup>, 2019…
			</Quote>
			<p>
				<strong>Cooking: </strong>
				I like it a lot.
				I specializes in Asian cuisine,
				(Southern Chinese) home cooked style food
				but with a bit of Japanese and Korean twist.
				It is hard to find home cooked style food
				in LA, despite the great food scene in Sawtelle.
				However, my favorite supermarket is the {` `}
				<Aext href="https://www.facebook.com/Nijiya-Market-Sawtelle-West-La-276513139034965/">
					Nijiya
					in Sawtelle
				</Aext>.
			</p>
			<p>
				<strong>Photography: </strong>
				I like it a lot when I feel like it,
				meaning when my schedule is not filled with C/C++
				assignment. You can find me and my work on insta {` `}
				<Aext href="https://www.instagram.com/wonggalen/">@wonggalen</Aext>.
				I actually do free grad photo shoot for people, only
				when I feel like it.
				If you want to model or want some stylish photo, hit me up
				but again only when I feel like it.
			</p>
			<p>
				<strong>Music: </strong>
				My music taste mutates.
				But right now, the Taiwanese indies are my fav.
				A non-exhaustive list includes: {` `}
				<Aext href="https://www.youtube.com/watch?v=kCHMkUSNHKw">
					Sunset Rollercoaster 日落飛車
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=3Y0Ut5ozaKs">
					茄子蛋
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=o5muvc-LOlA">
					吿五人
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=Vf1bAv_ZDAs">
					好樂團
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=NbNPJr_0tqA">
					老王樂隊
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=kZecE9AeELI">
					deca joins
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=HqmpIQ9l-uA">
					草東沒有派對
				</Aext>…
				{` Other than these, there are those that cannot be
				classified in the Taiwanese indie's category: `}
				<Aext href="https://www.youtube.com/watch?v=3ad4NsEy1tg">
					ポルカドットスティングレイ
					polkadot stingray
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=cK3NMZAUKGw">
					Babymetal
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=q2zj74iK1MI">
					房東的貓
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=YJfHuATJYsQ">
					Jay Chou 周杰倫
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=zkNzxsaCunU">
					米津玄師
				</Aext>,{` `}
				<Aext href="https://www.youtube.com/watch?v=Gxdvg5zqjkc">
					萬能青年旅店
				</Aext>…
			</p>
			<p>
				<strong>School: </strong>
				I think the best part about UCLA is probably
				ACM Hack. I got to teach {` `}
				<Aext href="https://github.com/uclaacm/hackschool-f18">
					some web dev
				</Aext>
				,{` `}
				<Aext href="https://github.com/uclaacm/learn.py-s19">
					some Python
				</Aext>
				,{` `}
				<Aext href="https://hoth.splashthat.com">
					organize some hackathons
				</Aext>
				,{` `}
				and meet some amazing people.
			</p>
		</article>
	);
}

export default About;
