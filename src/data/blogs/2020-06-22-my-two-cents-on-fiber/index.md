
# My Two Cents on Fiber

I have been trying to understand the "Fiber" thingy in React for a while. Looking at documents 
like [this](https://github.com/acdlite/react-fiber-architecture) and 
[this](https://blog.logrocket.com/deep-dive-into-react-fiber-internals/) helps... like a little
bit, until I saw this [video](https://www.youtube.com/watch?v=ZCuYPiUIONs). This is a really
great watch and I recommend you guys through the whole thing to gain a deeper understanding of the 
Fiber architecture. 

Comprehending the "Fiber" concept is definitely not easy... or is it? I think the existing
articles explain Fiber by showing _how_ it works, by showing the internal data structure. 
As a person who is a big fan of problem-based learning, I like to present a topic by motivating
it with an issue first. The key motivating question here is "what is Fiber trying to solve?" 
We can only grasp the solution only if we grasp the problem well. 

Therefore, I am offering my 2 cents on how **I, myself** understand Fiber, from a perspective
of the scheduling problem, very much like in the OS. Notice that in the title I did not 
mention React at all, since I would like to stress that the **concept is applicable not only
to React**, but to the problem of scheduling in general. 

## Asynchronous Execution Model of JavaScript


Before digging too deep, let's go over a high level overview of the environment where Fiber
will get executed, the JavaScript runtime. First, we start with a world without asynchronicity, 
where everything is synchronous. In the simplest world of C, we have the following 
model of a function stack:

```
+-------+
| func2 |
+-------+
| func1 |
+-------+
| main  |
+-------+
```

The rule is simple: when a function is called, a function frame is added to the stack.
When a function returns, a function frame is removed/popped off the stack.
It grows upwards, shrinks downwards. The program execution is done when the call stack is empty.

One thing at a time, it is simple, easy, but slow. The hardware people came up with the 
multi-core architecture. We would like to leverage that and the OS scheduler to do 
things faster. We introduces process and threads.

```
   T1    		T2
+-------+    +-------+
| func2 |    | func3 |
+-------+    +-------+
| func1 |    | func4 |
+-------+    +-------+
| main  |    | main  |
+-------+    +-------+
```

This is nice, but threads are susceptible to race conditions. T1 and T2 can be accessing
the same variable at the same time. That's nasty. Let's keep things single threaded. No race conditions.
To improve performance, we rethink what is taking so much time.

```
+---------+-----------+----------------------------+---------------------+-------------+-------------+
| program | read file |                            | do things with file | do things 1 | do things 2 |
+---------+-----------+----------------------------+---------------------+-------------+-------------+
| OS      |           |            I/O             |                     |             |             |
+---------+-----------+----------------------------+---------------------+-------------+-------------+
```

Can we make use of the time when the OS is doing I/O to do other things, since during I/O
the CPU is really not doing anything? But how can we do that without using threads?

### Introducing: _**Callbacks**_
> Program: JS engine, help me read a file/make a network call. When you are done, do the following things with the result.

callback = "do the following things"

```
+---------+-----------+-------------+-------------+-----------+--------------------------------+
| program | read file | do things 1 | do things 2 |           | do things with file (callback) |
+---------+-----------+-------------+-------------+-----------+--------------------------------+
| OS      |           |                  I/O                  |                                |
+---------+-----------+---------------------------------------+--------------------------------+
```

Here you go, the JavaScript model. A single-threaded, event-driven asynchronous programming model.

### Introducing: Cooperative Scheduling

Make no assumption about the runtime environment, language feature, hardware architecture,
or anything else. Consider the following code:

```py
p = 10
print(p)
```

Can you guarantee that the output for `print(p)` is 10? No you cannot, the OS might simply
stop this thread from executing, switch to another thread, which might modify the value of `p`.

To make sure that there is no more than 2 "threads" at the same time, or more
accurately, any lines of continuous code in a block need to execute
continuously, JavaScript guarantees that no other event can execute before
the current event finish executing. Again, the end of execution is defined by
the fact that the call stack is empty. That means a chunk of code needs
to "willingly" give up control and let other code execute, instead of having
the runtime/OS take away your control.

This is the famous JavaScript **"run to completion"** guarantee. The event is completed
when the callstack is empty, and no other event/function/callback/whatever can
run while the current event is not done.


### Opposite Side: Preemptive Scheduling

In cooperative scheduling, control of execution/CPU is handled by each unit
of work. Nothing else can take away the control. The work in the CPU currently
is the only one to decide when to give up the control. However, in preemptive
scheduling, there is a main controller/scheduler that decides when to run what. In the
context of OS, the OS scheduler is the boss that decides who gets the
control of execution/CPU. It is the boss therefore it has to power to stop the
execution of a certain execution of unit of work. The code above then might
not print `10`. Since the OS has the power to decide, it can also decide what
process get higher priority of execution.

## Problem with React in DOM

After reviewing some basic scheduling concept and the JavaScript runtime, let's 
look at what problem React is facing that it needs to be solved with Fiber.

React thinks of UI as a function of state:
```
ui = f(s)
```

In a DOM environment, the UI is the DOM tree. React in the DOM is responsible to 
generate a virtual DOM tree. 

```js
function Render() {
   vdom = reactRenderElement(rootOfReactComponent);
   mountVdomOntoDom(vdom);
}
```

How do we generate the virtual dom tree? What is the implementation of `reactRenderElement`?
It might be a recursion:

```js
function reactRenderElement(el) {
   if (el.children.length === 0) 
      return el.render();
   return el.children.map(c => reactRenderElement(c));
}
```

## Problem with Cooperative Scheduling in DOM

If an event takes too long to execute, no other event, including painting (aka drawing
the stuff on the screen so user can see it, which should happen 60 times per second) can happen. 
The rendering frame drops. With React, this can happen when the tree is too big, `Render` takes to long. 
This rendering time complexity scales at least linearly with the number of nodes/components. 

The main problem here, then, is that there is **only one single event to render the whole tree**.
Therefore, it blocks painting and therefore bad for user experience. Now we know the problem
we are solving.

## Solution: `async/await`

JavaScript has now a nice abstraction around the asynchronous callback mechanism,
called `async/await`. We can use this to break our one event into several event.
Each level of function call/recursion is its own event. Each one of them would be so short 
and therefore solves our problem.

```js
async function Render() {
   vdom = await reactRenderElement(rootOfReactComponent);
   mountVdomOntoDom(vdom);
}

async function reactRenderElement(el) {
   if (el.children.length === 0) 
      return await el.render();
   return Promise.All(el.children.map(c => reactRenderElement(c)));
}
```

Easy right? Our recursion is instantly non-blocking anymore. However, we 
are wasting a lot of time creating events (or micro-tasks) and each time we 
return, we need to go to the eventloop to ask for the next task to process. 
Can we make this better?

> The manifestation of inefficiency can be shown with the following code:
> 
> ```js
> let start;
> // synchronous recursion
> function a(n) { 
>    if (n <= 0) 
>       console.log(performance.now() - start); 
>    else 
>       a(n-1); 
> }
> // asynchronous recursion
> async function b(n) { 
>    if (n <= 0) 
>       console.log(performance.now() - start); 
>    else 
>       await b(n-1); 
> }
> 
> function p(f, n) {
>    start = performance.now();
>    f(n);
> }
> 
> p(a, 1500);
> p(b, 1500);
> ```
> The main focus is how much time is spend only on going around the event loop. 
> It takes around 1ms to recurse 1500 times with `async/await`, which means 1/16
> of time per frame (assuming 60fps) is wasted just on the eventloop. That is quite
> a bit of time! I took 1500 since [Google says](https://web.dev/dom-size/) it 
> is the maximum acceptable number of DOM nodes to have before your web page 
> is flagged by Lighthouse as inefficient.


So, it is better to batch computation in one event since using callstack incurs 
low cost, but using event is costly. But we still need to do so without
occupying the event loop too much. In summary, we need to pause work and come
back to it later. However, how can we do so since the callstack will be 
cleared every time we give up the CPU?

Solution: we cannot use recursion. Instead, we manage the execution
ourselves. Instead of recursion, we save the state (both the result of
execution and where we are currently in the execution) and do it next time.

## Fiber 

So what is fiber? 

```
fiber | AmE ˈfaɪbər | noun
   countable (filament, strand of yarn, wood, muscle, nerve)
```

and what is a thread?

```
thread | AmE θrɛd | noun
   uncountable and countable (string)
```

We are all quite familiar with the term "thread". Therefore, we can 
build our understanding of "fiber" from the concept of "thread".
They are very similar concept, the smallest unit of execution that a
scheduler can control. So, Fiber is an abstraction that React uses to
represent a smallest unit of work. But unlike thread, a fiber cannot be
interrupted since JavaScript uses cooperative scheduling.


So how exactly are fiber scheduled in a cooperative scheduling environment
like the DOM that runs with a JavaScript runtime. Let's have an abstract
method called `shouldYieldToHost()` that represents when we need to give the
control back to the main event loop. And each fiber is a function. We do the
following:

```js
function executeReactEvent() {
   while (true) {
      task = getNextFiber()
      if (task === null || shouldYieldToHost()) {
         // before we yield, schedule another run.
         // actually React uses `postMessage`, since it is faster.
         setTimeout(executeReactEvent, 0)
         return
      }
      task()
   }
}
```

> Take a look at how `setTimeout(f, 0)` and `postMessage` differs in 
> performance: https://stackoverflow.com/q/18826570

This means that React essentially implemented their own scheduler. It is
still cooperative scheduling relative to the JavaScript runtime. But it is
preemptive scheduling with respect to the rendering event. It can be
interrupted in the middle, since the rendering event is broken down into
multiple fibers. 

> The source code for this imaginary `executeReactEvent` can be found in
> `workloop` of React Scheduler package.

Now, how does React break down the entire rendering process into single
units of work (fiber)? The job of the rendering process is essentially
to render the virtual DOM tree. Since it is a tree, a very natural 
unit of work is each single node. And yes, it is exactly how each 
unit of fiber correspond to in React.

But now here is the issue, in React we uses a one-way data flow by having
the parent components passing it down to child components. If Fiber were
to separate things into individual functions, how does fiber pass data 
to each other? How does parent pass `props` to children?

Here is where the Fiber node data structure comes in: it tracks several
things: 
- `types` (example: `"div"`, `"span"`, `MyComponent`)
- `props` passed 
- `children` and `siblings`
- `return` (parent component)

This is essentially keeping track of a stack frame! `props` are the
arguments, `return` specifies which fiber it returns to. `children` and
`siblings` are for scheduler to know what is the next fiber to execute. This
is how we traverse through the tree.

Here you go. we have specified how to traverse through the tree, 
order of traversal (`children`, `siblings`), return relationships (who
is the parent function or the caller), and a working scheduler to schedule all these works. 


However, this only generates the vdom, we still haven't actually modified
the DOM. This phase of creating the VDOM is called render phase. Then, 
it updates the DOM by traversing through the VDOM and applying the changes.
This step cannot be broken into fiber. There are 2 reasons:

1. if it is, partial DOM updates happens and create UI inconsistency
2. DOM update in batch of an event is quick

This phase of applying changes to the actual DOM is called commit phase.

This gives us a hint of a 2 phase commit, which means that the first phase
is interruptable, and indeed it is but we are not going into detail of this.

## Visualizing Fiber

We can visualize the difference between using fiber to render and using 
callstack to render. Pay attention to the callstack and how it renders. 
[demo here](https://claudiopro.github.io/react-fiber-vs-stack-demo/).

## Furthermore

There are more interesting things that having control of the scheduler 
that enables React to do, for example, determines which update are of 
higher priority and apply them first. Split work potentially into workers?
(the React core team have actually [tried this](https://github.com/web-perf/react-worker-dom),
and it [gave birth](https://github.com/facebook/react/issues/3092) to Fiber!)
We will not go into the detail here. 

## How does it effect us?

In short, not really, but some APIs have changed due to the new scheduling mechanism.

- `componentWillMount`
- `componentWillReceiveProps`
- `componentWillUpdate`

These APIs have been marked as unsafe. For the reason being that we cannot be 
certain when the mount/update/receive props would happen since the scheduler is 
non-deterministic.

However, this sets up ground for suspense and data fetching. Our render can 
be interrupted, wait until the data is done, and we can come back to it later. 
This will largely change how we write our component and fetch data in the future.

In summary, what Fiber really is is **a balance/compromise between going absolutely crazy
with `async/await` by turing every single function call into a callback and keeping
everything in one single task/event**. 


But it also presents an approach that allows us to preemptively schedule in a
cooperative environment. But fundamentally, it is still the principle of 
splitting up large task into smaller ones. Here, I quote from the book "[JavaScript
Patterns](https://books.google.com.hk/books/about/JavaScript_Patterns.html?id=WTZqecc9olUC&source=kp_book_description&redir_esc=y)": 

> The idea is to split a big amount of work into smaller chunks and perform each chunk
> with a timeout of 1ms. 

Thank you.
