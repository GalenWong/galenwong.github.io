---
date: "2019-09-11"
title: "My First Blog, Finally"
subtitle: "Yes, procrastination, but also the lack of skills."
---

This is my first blog. After 
[hackschool](https://github.com/acm-hackschool-f17) 
of Fall 2017, I finally built my own personal blogs
on Summer of 2019. 

> <h4> Yikes ¯\_(ツ)_/¯ </h4>

Yes, it was procrastination.
Every time I tried to start it, I always failed since
there are so much distraction: clubs, schools, and 
life in general. The passion I accumulated for building
the website fades off almost instantly when distraction
hits. My little brain just don't see the value of 
investing so much time into the blog that I know not many
people are going to read. 

But no, procrastination is not the only thing. It was 
also the lack of skills. 
I started off learning web dev with the 3 basic tools: 
HTML, CSS, JavaScript (well, more like jQuery). 
Everybody does. Trying to work with those 
is not exactly very plasant, nor very scalable. 
I was also too aggressive that I wanted the fanciest
animation on my webpage, the most complicated effects,
and the best content (textually).
Turns out I was not really capable of doing any of those. 
I couldn't even figure out the priority of CSS selectors
(probably not even uptil today), not to mention producing
technical contents. 

#### Why Now? 

I vaguely remember an image which describes different 
stages of a programmer, from arrogance to a 
self-realization of ignorance. Hopefully I am at the 
coordinate where I have seen enough to know how much 
I still don't know. But I am also semi-capable of 
quickly build a blog now. 

I am also 
[buddist (佛系, not actually referring to the religion)](https://www.straitstimes.com/asia/east-asia/keep-calm-and-be-average-chinas-unambitious-buddhist-youth) 
enough to acccept an simple design. Being simple does not 
mean lack of aesthetics. My view on design has changed 
drastically with Muji and Uniqlo's simplicity rules
the design world. I wish I can discuss the design of 
this website more in a later post. 
In short, a simple design allows me to build a webpage 
faster without having to worry about fancy 60 fps CSS
or even JavaScript animation. _((￣Д￣)) sigh~_

Apart from the self-realization and a change in taste,
I guess another reason is for recruiting. Notice how this
blog is created at Septempber, when the recruiting season
is about to start. You can always find a job description
for software engineering that includes some line that
resembles:

> $\textit{Having a frequently updated technical blog is a plus.}$


Honestly, I could have written a technical blog on 
Medium or some other platforms that are already set up
and ready to go. But they just lack some $\mathcal{STYLE}$.
Don't get me wrong. They are great at creating a consistent,
user-friendly reading experience, SEO, and ultimately 
exposure. Emotion really beats rationality here. I just really
wants my own customizable blog, with my own styles.

#### Some ~~Bugs~~ Features of this Blog (Semi-technical)

This site is built with [Gatsby](https://www.gatsbyjs.org/).
I learnt it through [a technical project](https://github.com/uclaacm/hack.uclaacm.com)
I am leading which is also a static web site for UCLA 
ACM Hack. It is at a perfect sweet spot, where enough things
are abstracted while a degree of customization is 
offered.
I am not going into this too much since there are 
many resources online about Gatsby already.

I got my inspiration from [overreacted.io](https://overreacted.io).
It struck me that a great blog has nothing to do
with its fancy usage of animation. You can probably 
tell from the layout of the blog but the internal 
between this one and Dan's overreacted.io is quite 
different, especially the styling solution.
More to be covered later. 


__Light and dark mode__: This is a good to have
for reducing eye-strain. You can toggle it with the
button you see on the bottom right.

__Latex support__ (through Katex):
I might want to talk about Math in the future. 
Meanwhile, an inline $\LaTeX$ Euler's identity is nice to
have: 
$e^{i\pi} + 1 = 0$.

Maybe you want a quick proof to the linearity of expectation:

$$
\def\E{{\mathrm E}}
\def\intx{{\int_x}}
\begin{aligned}
\E(aX+b) &= \intx (ax+b)f(x) dx\\
    &= \intx [ axf(x) + bf(x) ] dx\\
    &= a\intx xf(x) dx + b \intx f(x) dx \\
    &= a\E(X) + b &&\square
\end{aligned}
$$

I would love to share all the technical details as to how 
I implements these features, just not in this one post.


#### What should you expect to see in here?

This is not a purely technical blog. If you have been to
my [about](/about) page, I can expect me posting about
photography, cooking, music, languages, (and obviously
code related stuff) in this Blog.

One side note about the language that I will be using: 
I would mostly write content in English (for the purpose
of a greater audience outreach), with occasional
Chinese words. I will try to attach some links or explain
them when they appears. If I feel like it, pure Chinese 
content can also appear.
