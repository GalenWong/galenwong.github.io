---
title: "Why I chose vscode-neovim over VSCodeVim"
subtitle: "A comparison between the two VSCode Vim extensions"
date: "2022-03-22"
---

I like using Vim. I also like using VSCode. But I can't really go back to
typing in insert mode by default anymore. To get the best of both worlds, I
appeal to the extension that provides the Vim keymap. At the time of writing,
the
[VSCodeVim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
extension is the most popular Vim keymap with 2.4 million installs.  The second
most popular one is
[vscode-neovim](https://marketplace.visualstudio.com/items?itemName=asvetliakov.vscode-neovim).

Which one should you use? Which one is "better" (It is always about trade off
in coding. There is no absolute best). ? I have worked with both extension for
a substantially long enough time. I would definitely recommend vscode-neovim
over VSCodeVim. My goal is to tell you why I prefer one over the other.

VSCodeVim and vscode-neovim are implemented differently. VSCodeVim simulated
the Vim controls using JavaScript code and directly manipulated the text buffer
within VSCode. On the other hand, vscode-neovim uses an actual Neovim instance.
The key presses are sent directly to the neovim instance and the text buffer is
manipulated by Neovim instead. This means that vscode-neovim should have a more
accurate and complete functionality mapping from Vim. Here, I show a few
differences of behavior of vscode-neovim and VSCodeVim.

### Visual Block Selection

One of the feature that I love the most about Vim is visual block selection.
It let's you select a 2D block from the two-dimensional plane of the text
editor. Then you can yank (copy) the selected block and move it around. 
This is what it looks like with vscode-neovim. 

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/neovim-visual-block.mp4" type="video/mp4">
</video>

_Visual block mode in vscode-neovim_
</div>

The behavior of visual block in vscode-neovim is exactly the same as in Vim.
However, this feature doesn't work properly within VSCodeVim. Take a look at
the following demo: 

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/vim-visual-block.mp4" type="video/mp4">
</video>

_Broken visual block mode in VSCodeVim_ 
</div>

The reason why I think that did not work is that VSCodeVim probably kept the
block selected text as a string with newline inserted in the buffer.  When it
is pasted somewhere else, it inserts the newline from the buffer as well. This
gives us less flexibility when it comes to text manipulation. 


### Performance

People has claimed that the vscode-neovim is more performant than VSCodeVim.
Here we see a few review under vscode-neovim: 


> _Skye Nygaard_ 20/01/2021: This is so so much faster than the normal vscode vim
> extension, no lag, works like vim should

>
> _Grant Mercer_ 03/12/2020: After spending hours and hours trying to optimize
> VSCodeVIM so it wouldn't lag on my large django codebase I decided to give Neo
> Vim a try.
>
> Night and day difference. Neo Vim is lightning fast and I'm so glad I don't
> have to suffer through huge keypress lag just to have VIM shortcuts.
> Incredible extension
>

I can't easily recreate a performance issue. However, from how the two extensions 
implement macros, we can see why vscode-neovim is faster than VSCodeVim.

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/neovim-macro.mp4" type="video/mp4">
</video>

_Macro in vscode-neovim_
</div>

Let me explain what command I just issued there:
- `qq`: start recording a macro to the buffer `q`:
  - `dw`: delete the next word from the cursor
  - `j`: move down one line
- `q`: stop recording macro
- `10@q`: invoke the macro in the buffer `q` for `10` times

Combined into a sequence of key strokes: `qqdwjq10@q`.

Therefore, the macro simply delete the first word of the line, and move the the
line below. Repeating the macro $n$ times will delete the first word for $n$
lines. Yes, this is the power of Vim. You just gotta admire it.

We can actual do the same thing within VSCodeVim, using the exactly same key
stroke we used above. 

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/vim-macro.mp4" type="video/mp4">
</video>

_Macro in VSCodeVim_
</div>

But this time, notice how we are able to perceive command being executed 10
times serially right in front of us. 10 lines might not be too bad. However,
imagine a super complex macro applied to the entire file of over 200 lines.
200 lines are not uncommon code file size. At the same time, there is a heavy
language server running in the background against the large code base, like a
django code base mentioned by one of the review. All the static analysis and
syntax highlighting everytime the view is updated.  This can be a real pain.
My guess is that VSCodeVim updated the buffer and the view (the DOM since
VSCode runs in electron) everytime the macro is executed. And all these happens
in a blocking manner. Vscode-neovim only updates the view once after all the
macros have been applied, hence its superior perforamnce.

This constantly causes me issue when I am using VSCodeVim.  Sometimes, I forgot
that I hit a number like `100`. Then, I just went ahead to insert mode and type.
(`100ilove`<kbd>ESC</kbd>) After escape, the text I typed got reinputted 100
times. Then, I need to wait for it to finish rendering. Even if I hit undo `u`,
it has to finish the repetition completely before it can undo. 


### Undoing

The next issue with VSCodeVim is undoing. In Vim, the key to undo is `u`.  In
VSCode, or any common software really, the short cut to perform an undo is
<kbd>Ctrl/Cmd</kbd>+<kbd>z</kbd>. In VSCodeVim, the vim `u` undoing and VSCode
control-z undoing has different behavior. Again using the macro example above,
we take a look at the difference in behavior in the `u` undo and control-z undo:

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/vim-u-undo.mp4" type="video/mp4">
</video>

_`u` undo in VSCodeVim_
</div>


<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/vim-z-undo.mp4" type="video/mp4">
</video>

_control-z undo in VSCodeVim_
</div>

In this example, `u` undoes all eleven times of macro. However, the control-z
undoes only one time of the macro. Now imagine what happens if you hit
control-z, and then hit `u`? Is it going to redo the undone macro? If so, what
is the meaning of undo if the behavior is redo? If not, is our buffer being put
into a unpredictable state? This behavior is extremely confusing. My code file
has definitely be put in some state that is broken and unrecoverable. 


The undo stack also causes a lot of problems for other people as well, as
outlined in these two issues on the VSCodeVim GitHub:
- [VSCodeVim Undo stack should be synced with VSCode undo
  stack](https://github.com/VSCodeVim/Vim/issues/1490)
- [Pressing 'u' will undo all the
  stack.](https://github.com/VSCodeVim/Vim/issues/2007)

I quote one user from the GitHub issue:

> [jcjolley commented on 13 Oct
> 2017](https://github.com/VSCodeVim/Vim/issues/2007#issuecomment-336259437)
> FWIW, I also am experiencing this bug. Hitting undo is like rolling the dice.
> 

In vscode-neovim, the behavior is consistent. I didn't have to worry about by
code file being put in a state that is broken.


### `gqip` in markdown list

`gqip` is another feature that I love about Vim once I found out about it.  It
indents the current paragraph of text such that the line width doesn't exceed a
pre-configured maximum line width, defined by the variable `textwidth`.

However, the feature needs to be a little smarter when it comes to markup files
like Markdown. Consider the following example:

```md
- a short line 
- a super long line within a list that is so so so so so so so so so so so so so so so so long
```

Since the two lines are directly next to each other, they are in the same
"paragraph" and performing `gqip` should format both line. But a human knows
that only the second line should be wrapped and the first line should stay
unchanged since we know Markdown relies on newline as a syntax to separate two
list items. Let's see how this is handled within vscode-neovim and VSCodeVim.


<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/neovim-gqip.mp4" type="video/mp4">
</video>

_`gqip` in vscode-neovim_
</div>


<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/vim-gqip.mp4" type="video/mp4">
</video>

_`gqip` in VSCodeVim_
</div>

Hey, vscode-neovim is actually very smart. Well, since it uses an actual Neovim
instance, we should say that Neovim is smart. It knows to only wrap around the
second list item but not the first. It even indented the wrapped line such that
it matches the first character after the marker. However, the VSCodeVim is not
language-aware and treats two adjacent list item as the same paragraph and
performed the line wrap. 

The smart line wrapping matters a lot to me since I takes a lot of my class
notes in Markdown and it makes life easier if it can wrap my line smartly.

### Search and replace

The difference in search and replace boils down to the two regex engine driving
the `:substitute` function within Vim in VSCode. Here, I will explain the
difference with the capture group syntax as an illustrating example on how the
two differs. 

VSCodeVim uses the JavaScript regex engine. Therefore, in the match expression
we can use any regex syntax supported by the JavaScript regex engine (refer to
[this MDN
cheatsheet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet)
for a quick reference for regex syntax support). By default, capture group is
denoted with unescaped parantheses. The expression `(\d+)` is a capture group
that captures a substring with one or more digits. vscode-neovim uses the
program `sed` for its search and replace function. This means whatever is
supported by `sed` is supported by `:s`. To write the same capture group, one
will say instead `\(\d\+\)`. To be fair, the JavaScript one will be easier to
write in this case. 

Another point of difference is referencing capture group in the replace
pattern.  According to the [Visual Studio
documentation](https://docs.microsoft.com/en-us/visualstudio/ide/using-regular-expressions-in-visual-studio?view=vs-2019#capture-groups-and-replacement-patterns),
referencing capture group in VSCode is done with `$1`. `sed` uses `\1`. For the
same search and replace, one will need to write different command in VSCodeVim
and vscode-neovim. 

```
# In VSCodeVim
:s/(\S+\(\))/package.$1/g

# In vscode-neovim
:s/\(\S\+()\)/package.\1/g
```

Let me explain the regex here. We are matching for function calls with no
parameter, where `\S` matches non-whitespace character and it is followed by
`()`. This matches any expression like `error()` or `someGenericThunk()`. We
put this match in a capture group. In the replace pattern, we will prepend
`package.` to the matched group. Therefore, `error()` will turn into
`package.error()` and `someGenericThunk()` will turn into
`package.someGenericThunk()`. The `g` indicate search replace globally across
each line. It will replace all occurences of a matched pattern in a line. 

Choosing which one you like is a matter of habit. Since I am pretty comfortable
with the Vim regex, then I think vscode-neovim is more for me. If you think
that you like the JavaScript regex better, go ahead and try VSCodeVim!

### vscode-neovim is not all perfect

Overall, I think vscode-neovim allows for an smoother adaptation from Vim to
VSCode. It matches actual Vim behavior and has better performance. Even better,
we can make use of the Neovim config file to customize behavior. You get basically
all the power of Vim through vscode-neovim. However, it is not without drawback. 


First, its selection is not actual VSCode selection. What does this mean?  It
means that I will not be able to copy a selected chunk of text using
controll/cmd-c. For instance, if a select a word in visual mode and attempt to copy it with cmd-c. It does not work!

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/neovim-cmd-c.mp4" type="video/mp4">
</video>

_Broken cmd-c copy and paste in vscode-neovim_ 
</div>

Copying with cmd-c copyed the current line where the cursor is located, doesn't
exist out of visual mode. When paste happens, we are still in visual mode and
more chunk of text are selected. If we want something in copied to the system
clipboard buffer, we can invoke the copy command using the command selector.

<div align=center>
<video autoplay loop playsinline style="max-width: 500px; width: 100%">
<source src="media/neovim-csp-copy.mp4" type="video/mp4">
</video>

_cmd-c copy and paste in vscode-neovim through the command picker_
</div>

On the other hand, VSCodeVim support cmd-c copying seemlessly. However, this is
not really a big deal for me since in the terminal Vim, I cannot use cmd-c
copying anyway. 

Another drawback of vscode-neovim is setting up. It requires a system
installation of Neovim. VSCodeVim only requires the extension to be installed
and there are no other dependencies. Setting VSCodeVim is way easier than
vscode-neovim.

There are also other limitations of vscode-neovim that I won't list here.  The
author of the extension seems to know the limitation pretty well and they are
documented in the [README of
vscode-neovim](https://github.com/asvetliakov/vscode-neovim#important). It
gives a good idea to the user of the extension on what to expect.

In conclusion, I like vscode-neovim since it fits I find it more comfortable,
which is the most important. However, if you like how VSCodeVim does things, go
ahead as well! Again, it is all about trade-offs.

