---
title: Measuring Impact of Ajax on a Webpage
subtitle: My attempt to quantify Ajax…
date: "2019-06-26"
---

At the end of my 
[previous blog post](/blog/2019-06-23-ajax-and-the-halting-problem/), 
I briefly mentioned how I plan to measure the amount 
of impact that Ajax has on a page.
In this blog post, I will explain how I did it. 

### Assumption
Before we start measuring the impact of Ajax,
we assume we have 2 html documents available to us. 
1. the DOM without executing any JavaScript
2. the DOM after "finish executing" all JavaScript

The first one is quite easy to obtain. 
We just fetch the document with `curl` or the `requests`
package in Python.
I explained how to get the second one in the last blog post.
There is just no perfect way but to blindly wait for 
some number of seconds.


Assuming we have both, let's see how we can measure the 
impact of Ajax on a page.

### Attempt 1: Counting the Difference in Lines
To any software developer who works with git, 
the first instinct to measure the difference 
between 2 files is to use the program `diff`.
We can simply do `diff file1 file2` and we 
get how many lines are added or deleted.

There is an issue with this. With minified html
files, there can be only a few new lines or even
no newline at all! Consider this valid html
document.

```html
<html><head><script type="javascript/json">{"my data": "blah blah blah"}</script></head><body><h1>Hello World!</h1></body></html>
```

Yes, everything is on the same line. 
It is unfriendly to human but it saves more
memory for the machine.

So this simple attempt just won't work.

### Attempt 2: Attempt 1 + BeautifulSoup
To avoid the above issue, we can prettify the 
html document to make it more human readable 
and therefore `diff` can work with it easily.
When it comes to html parsing, BeautifulSoup
is an excellent library. And it does exactly 
what we want.

```py
html = '<html><head><script type="javascript/json">{"my data": "blah blah blah"}</script></head><body><h1>Hello World!</h1></body></html>'

soup = BeautifulSoup(html, 'html.parser')
print(soup.prettify())
```

The above code should print 
```html
<html>
    <head>
        <script type="javascript/json">
            {"my data": "blah blah blah"}
        </script>
        <body>
            <h1>
                Hello World!
            </h1>
        </body>
    </head>
</html>
```
With the prettified version, we can now
apply `diff` on it. 

#### Issue: Useless Noise
When you look at the above html, 
what is visible to the user is only one line
`Hello World!`. 
Other than that, the user will not see anything 
else on the screen. 
These are extra information that is
neither useful to a user or to a search engine.
HTML tag should not be considered as "part of 
the content of a webpage".

Since we are measuring the percentage change
on content, we need to filter those noise out. 
Otherwise, the number of lines that the tags
take up are marginalize the change in actual
content. 

Interestingly, when I was doing the testing,
html tag actually "amplifies" the impact of 
Ajax. Nowadays, JavaScript controls different
aspect of tags, such as injecting styles by
giving new class name or ID, or putting meta
attributes onto the tag. Regardless of 
whether the tag diminishes or amplifies the
impact of JavaScript, they are noice that
has to be filtered out.

### Attempt 3: Attempt 2 + `get_text()` 

The solution is the noise problem is again
provided by BeautifulSoup. There is a built-in
method named `get_text` which literally returns
the text within HTML.
Continuing from the example above,
```py
html = '<html><head><script type="javascript/json">{"my data": "blah blah blah"}</script></head><body><h1>Hello World!</h1></body></html>'

soup = BeautifulSoup(html, 'html.parser')
soup = BeautifulSoup(soup.prettify(), 'html.parser')

print(soup.get_text())
```
The above code shuold output
```
            {"my data": "blah blah blah"}
                Hello World!
```
You might notice the indentation being 
printed here. Yes, indentation is also
considered as part of the "text". 
Also, this only works when we pass the
prettified version of the html to 
BeautifulSoup, or the content only gets 
printed onto one line, which goes back to
the problem we had in Attempt 1.

Indentations are not useful. 2 lines should
not be considered to be different if the 
indentation is different (at least in our 
context), since they do not make a difference 
to the user viewing the page. 

It is easy to remove any indentation, or more
generically white space around a line, using
the Python built-in method `str.strip()`.

#### Issue: even `script` tag?
You might have also noticed that the content 
within the `script` tag is also being grabbed 
by the `get_text` method. But any content within
the `script` tag is not visible to the user 
as well. Other examples of such tags include 
`link` and `style`. 

### Attempt 4: Attempt 3 + Tag Removal

BeautifulSoup allows us to remove the tag by 
using the method `extract`. We can remove all 
invisible tag. 
```py
[s.extract() for s in soup('script')]
[s.extract() for s in soup('link')]
[s.extract() for s in soup('style')]
```
After running these, our above example will 
only output `Hello World!` without leading
or trailing space.

We can further limits the content to anything
within the `body` tag only. 
Notice that `strip` also removes any lines with
just whitespace.
The complete function to do the extraction
is listed here.

```py
def stripped_text(html_text):
    parser = 'html.parser'
    soup = BeautifulSoup(html_text, parser)
    # remove any script, style, link tags
    [s.extract() for s in soup('script')]
    [s.extract() for s in soup('style')]
    [l.extract() for l in soup('link')]
    b = soup.find('body')
    text_only = b.get_text()
    # remove empty lines
    result = []
    for line in text_only.splitlines():
        trimmed = line.strip()
        if trimmed:
            result.append(trimmed)

    return os.linesep.join(result)
```

### Conclusion

Finally, to measure the impact of Ajax,
we can use the percentage change. 
$$
\def \dnl {\text{dynamic number of lines}}
\def \snl {\text{static number of lines}}
    PC_{ajax} = \frac{\dnl-\snl}{\dnl}
$$

What was this used for? I did a study during my 
internship, in which we looks at the impact of having
Ajax on the ranking of the page in the Baidu search 
engine. A brief result summary can be found 
[here](https://www.chinafy.com/blog/if_baidu_cant_crawl_dynamic_sites_do_pages_heavy_with_ajax_and_js_perform_worse_in_seo).
There wasn't anything astonishing in particular,
but it was a fun study to do.


