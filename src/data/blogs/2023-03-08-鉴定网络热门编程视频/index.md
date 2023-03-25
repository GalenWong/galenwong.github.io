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

然而，我觉得作者最重要的观点其实是：

> If you look at the IO operations in the standard library, they seem synchronous. In other words, they just do work and then return a result when they are done. But it’s not that they’re synchronous in the sense that it would mean in JavaScript. Other Go code can run while one of these operations is pending. It’s that Go has eliminated the distinction between synchronous and asynchronous code.

对于Go来说，同步代码和异步代码并没有任何区别，但在JavaScript里，非async函数不能调用async函数（单纯为了副作用除外）。

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

这里就不再重复视频里的代码了，可以去视频里看一遍。 

### 模仿出来的代数效应

模仿出来的代数效应有解决async/await传染性的问题吗？在语法上确实解决了传染性的问题，同步代码和异步代码可以无缝切换，只需要在代码入口用try-catch去捕捉抛出的Promise就可以了。当然，一切都是有代价的，代价就是任何一个`fetch`都需要被抛出并且重新执行，效率肯定是比较低。

那我们就可以理解React中如何使用代数效应实现`Suspense`的功能了，任何异步函数的结果都是以`Promise`的形式存在，只要把`Promise`抛出，让React对`Promise`进行等待，结束后再次渲染，就可以了。

### 对视频评论的回应

在视频的评论区里，有许多有趣的问题，有一些问题我在评论区里做出了回应， 但也想在这里更加详细的回应一下。

#### 是否存在死循环？

在评论区里，有许多同学提出了关于死循环的问题：

评论1:
> ？你这不是死循环？接口不返回无限执行

评论2:
> 感觉像是递归调用，什么时候有结果什么时候递归结束，如果一直调用，不会栈溢出吗

评论3:
> 看了5遍，发现是不是在请求到数据前会疯狂throw？

评论4:
> 这个一直是微任务的执行会卡顿页面吗

大家会出现这样的误解应该是因为对代码运行逻辑的误解，在视频里，对运行逻辑的解释是：

1. 代码路径上遇到异步函数，把Promise抛出
2. 最上层的代码catch到抛出的Promise，重新执行函数
3. 代码路径上再次遇到异步函数，把Promise中缓存下来的的结果返回，不再调用异步函数

这里是相关的代码：

```js

function makeAsyncSync(func) {
  // 此处省略对fetch实现的更改。。。
  try {
    // 调用目标函数
    func();
  } catch(err) {
    // 接住任何抛出的Promise
    if (err instanceof Promise) {
      const reRun = () => {
        i = 0;
        func();
      }
      // 重新执行函数
      err.then(reRun, reRun);
    }
  }
}

```

大家的误区出现在第三步，万一Promise还没有结束，并没有缓存任何结果，不就再次抛出，又重新执行吗？按照这个逻辑，评论1确实是对的，但是
如果试一下，并不会发生这样的事情，为什么呢？重点在第二步：

2. 最上层的代码catch到抛出的Promise，**等到Promise结束，缓存结果后**，再次重新执行函数

在上面的代码里，重新执行`func`的`reRun`是在Promise的`.then`中执行的，也就是要等到Promise结束后再重新调用，并不会出现无限执行的情况，如果Promise永远不结束那就永远不会调用，那自然也不会出现重新throw的情况，也不会有大量的微任务一直执行。

对于栈溢出的问题，当Promise被抛出时，整个调用栈就可以丢弃了，因为JavaScript没有可以从抛出异常的地点继续执行的能力，也就没有对任何调用栈上object的reference，不会出现内存安全问题。

#### 通过阻塞的方式解决问题？

有一条评论提出了另一种解决方法：

> 评论5: wh开头的那个循环卡住，里面不停检查fetch有没有返回数据，返回了就不进循环了然后return(这条评论是我只看了视频开头想到的办法)


如果用代码表达出来，大概是这样的实现：

```js

function syncFetch(...args) {
  let data = undefined;

  fetch(...args).then((resp) => {
    return resp.json();
  }).then((json) => {
    data = json;
  });

  while(data === undefined) {}

  return data;
}
```


这样的解法是会导致死循环的，因为JavaScript的单线程事件循环(event loop)机制，会导致永远卡在循环的执行，不会执行Promise的callback，也就导致`data`变量永远不会被赋值。 所以阻塞的方式并不能解决问题。


