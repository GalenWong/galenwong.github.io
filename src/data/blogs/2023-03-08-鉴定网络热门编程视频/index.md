---
title: "鉴定网络热门编程视频"
subtitle: "代数效应"
date: "2023-03-18"
---


最近在抖音上刷到了这个视频

https://v.douyin.com/SaTRxHY/


我觉得这个视频特别有趣，所以想对视频做一个回应，顺便也回应一下在评论区里的问题。

### 这个视频在说什么？async/await的传染性是什么？

这个视频借助了一道升迁所用的考题（在我看来是奇怪的升迁方法），引出了async/await在JavaScript中的传染性，并提出了一种解决async/await传染性的方法。

这个时候就有家人们要问了，什么是async/await的传染性？这种重复性工作就让ChatGPT帮我们解答：

> async/await的传染性指的是当使用async/await语法编写异步函数时，这种语法的使用可以向调用异步函数的其他函数或方法“传染”。具体来说，如果一个函数是异步函数，那么调用它的函数也必须是异步函数，并且它们的调用者也必须是异步函数，以此类推，直到整个调用栈中的所有函数都是异步函数。
>
> 这种传染性是因为async/await语法是基于Promise的，而Promise是一种表示异步操作结果的对象。当使用async/await语法编写异步函数时，它们返回的是一个Promise对象，而调用这些异步函数的函数必须使用await关键字来等待异步操作完成并获取结果。如果调用异步函数的函数也是异步函数，那么它们必须返回一个Promise对象，并且调用它们的函数也必须使用await来等待结果。
>
> 这种传染性的好处是可以确保整个应用程序的异步操作都被正确地处理，避免了回调地狱和异步操作不同步的问题。但是，如果应用程序中的所有函数都是异步函数，可能会导致过度使用Promise和async/await语法，从而使代码变得难以阅读和维护。因此，需要权衡好使用异步函数的地方，避免滥用。

这里我画出重点：

> 如果一个函数是异步函数，那么调用它的函数也必须是异步函数，并且它们的调用者也必须是异步函数

ChatGPT指出了异步函数的问题是难以阅读和维护，但是async/await语法就是为了解决Promise的维护难度而生的，所以说ChatGPT并没有指出问题所在。那问题究竟在哪？

我第一次接触到传染性的概念是在 ["What Color is Your Function?"](https://journal.stuffwithstuff.com/2015/02/01/what-color-is-your-function/) 这篇博客里，博客里指出async/await传染性的痛点：

> Your function passes the outermost one into the runtime. When the event loop or IO operation is done, it invokes that function and you pick up where you left off. But that means everything above you also has to return. You still have to unwind the whole stack.
>
> This is where the “red functions can only be called by red functions” rule comes from. You have to closurify the entire callstack all the way back to main() or the event handler.


重点是在async/await中，程序运行时需要把整个调用栈保存，从最开始调用async函数的入口（main函数或是event handler函数），一直到目前正在被await的async函数。当await的事件（比如网络请求或者文件操作）结束时，运行时重新回到await语句，在整个调用链路结束的时候，调用栈里的所有栈帧（function frame or stack frame）都要返回。

而在作者眼中，什么是async/await的对立面？

> Threads. Or, more precisely: multiple independent callstacks that can be switched between. It isn’t strictly necessary for them to be operating system threads. Goroutines in Go, coroutines in Lua, and fibers in Ruby are perfectly adequate.
>
> [...] if you have threads (green- or OS-level), you don’t need to do that. You can just suspend the entire thread and hop straight back to the OS or event loop without having to return from all of those functions.

async/await的对立面就是线程，线程拥有独立的调用栈，当一个函数启用一个线程的时候，启用线程的函数可以直接返回，无需保留函数的栈帧。

这篇文章的作者明显偏好线程（不一定是OS线程，运行时进程也可以，例如go routine），但是这里不对作者的意见做出评价，仅仅提取作者对async/await传染性的客观描述。


### 如何解决async/await传染性的问题？代数效应（Algebraic Effects）？

当我看到async/await传染性的关键词的时候，我马上想到了代数效应。ChatGPT对代数效应的描述是：

>代数效应（Algebraic Effects）是一种用于描述程序行为的编程模型，它通过将程序的行为建模为“效应”（effects）的组合来实现。
>
>在代数效应模型中，效应是指程序的一些可观察行为，例如打印输出、读取文件、网络请求等。每个效应都有一组操作（operations）和一组可能的结果（handlers），操作用于描述效应的行为，而处理程序则用于描述当出现该效应时程序该如何响应。
>
>代数效应模型的关键思想是将效应的组合视为代数运算，因此可以使用代数的方式描述和组合效应。例如，将两个效应A和B组合在一起可以形成一个新的效应AB，其行为是先执行A，然后执行B。
>
>代数效应模型的优势在于它提供了一种可组合、可重用、可静态分析的方法来描述程序行为，而不需要将控制流完全交给回调或Promise等异步编程技术。它可以使程序的效应更加明确和可控，从而使程序更加易于理解、测试和维护。

说的事实并没有任何错误，但是说了等于没说，看不懂代数效应的精髓。

我初次接触代数效应是通过React维护者Dan Abramov的一篇文章：["Algebraic Effects for the Rest of Us"](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)，文章有中译版，但是建议阅读英文原文，感觉意思最准确。

如果你不想阅读以上的文章，这里是跟我们这里讨论相关的重点：

1. 代数效应需要编程语言的支持，但是JavaScript并没有对代数效应的支持，在JavaScript中只能模仿代数效应的行为
2. React中有使用模拟的代数效应范式，对`Suspense`等功能进行支持
3. 文章中没有具体指出如何在JavaScript中模仿代数效应的行为

因为第三点的原因，我当时看完这篇文章，并且复读几次后还是云里雾里。知道我看到了今天这条视频，醍醐灌顶，一下就把以上的文章都串联起来。

视频里提出了async/await传染性的具体解决方式，通过改变async函数的实现，在第一次执行时抛出需要被await的Promise，在顶层函数try catch接住，在顶层await Promise并缓存结果，并再次调用顶层函数，在async函数被再次调用时，返回被缓存的结果。具体的实现可以看看视频里的代码实现，个人觉得讲的还是比较清楚，不过对JavaScript基础有一定的要求。

视频里的实现有解决async/await的传染性带来的调用栈返回问题吗？有，当async函数被调用的时候，抛出的Promise结束了整个调用链条，因为错误被抛了出来，函数也就不用结束执行和返回。但是由于这是模拟的代数效应，代价就是要把整个调用链条重新执行。


？你这不是死循环？接口不返回无限执行

感觉像是递归调用，什么时候有结果什么时候递归结束，如果一直调用，不会栈溢出吗

这个一直是微任务的执行会卡顿页面吗

看了5遍，发现是不是在请求到数据前会疯狂throw？
