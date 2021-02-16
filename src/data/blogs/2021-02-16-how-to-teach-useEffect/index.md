---
date: "2021-02-16"
title: "How to teach useEffect without componentDidMount"
subtitle: "Introducing beginners to useEffect"
---

Background: As a member of ACM Hack, I teach beginner-friendly workshops on web
or mobile development. During Winter Quarter 2021, we are teaching React Native
(check out the videos
[here](https://www.youtube.com/watch?v=dBVNzSvivow&list=PLPO7_kXilXFbUqE_ywfN65R0afhA8Okk5)).
I was tasked to teach the `useEffect` hook. Again, the audience can be complete
beginners that might not have any React experience or even programming
experience.

It is already hard to teach someone `useEffect` who has pre-hook React
experience in class-based component. I have [tried it
before](https://hack.uclaacm.com/posts/fall2019/js-chats-3/#useeffect-side-effect-in-function-component)
during JavaScript Chats, a events geared towards more advanced users of
JavaScript. We cannot use the same methodology here. We cannot say that
`useEffect(f, [])` is equivalent to `componentDidMount` since the audience has
no idea what is `componentDidMount`. 

Introducing `useEffect` is not as easy as introducing `componentDidMount`. For
`componentDidMount` we can say, "anything you want to do only once after the
component is loaded, you put it in `componentDidMount`. Can we say the same in
a function component? It is easier to see it inside a class component since
`componentDidMount` is a separate function from `render`. But `useEffect` is
put in the same place inside the component. It is even harder to talk about the
concept through the term "side effect" since beginner don't understand it that
well. 

I tried looking at articles online, a lot of them either explains it with
`componentDidMount` or is difficult to understand for beginner. 


In this blog, I outline my approach to teaching `useEffect` without
`componentDidMount`. Luckily, our audience has been introduced to `fetch` and
API Calls. So I base my example off an API call.

## Step 1: Motivation

Say that you want to make an API call and display the result once the
app is loaded. This provides a concrete use case as a motivation for
`useEffect(f, [])`. The component starts off with the following structure.

```jsx
function SomeComponent() {
  const [someState, setSomeState] = useState(null);
  
  // make an API call 

  return <div>{someState}</div>;
}
```


## Step 2: Making mistake

What happens when a side effect is not controlled properly? The component can
possibly fall into an infinite loop in rendering. We want to show the audience
this problem by starting off doing things improperly.

```jsx
function SomeComponent() {
  const [someState, setSomeState] = useState(null);
  
  const callApiAndUpdateState = async () => {
    console.log('calling API...');
    const data = await someApiCall();
    setSomeState(data);
  };
  callApiAndUpdateState();

  return <div>{someState}</div>;
}
```

For this demo, it is best if the API changes on each call (you can possibly
inject randomness through `Math.random`) such that the `data` is different
every time and the state keeps changing. If not, you can still show the problem
by looking at the console. Since `calling API...` will get printed at least
twice. This will cause a waste in bandwidth.


__This mistake is really valuable for learning since let audience see two
important concepts at the same time. First, a state change causes a re-render
of a component. Second, side effect.__ A function that contains a side effect
is a function that modifies data/state/variable that is outside of its scope.
It is clearly visible from this example that `setSomeState` is modifying state
outside of the scope of the function `callApiAndUpdateState`.


## Step 3: Introduce the solution

Now `useEffect` comes in naturally. We can say that `useEffect` is the hook
designed exactly for solving issues like these. 

```jsx
function SomeComponent() {
  const [someState, setSomeState] = useState(null);
  
  const callApiAndUpdateState = async () => {
    console.log('calling API...');
    const data = await someApiCall();
    setSomeState(data);
  };
  useEffect(() => {
    callApiAndUpdateState();
  }, []);

  return <div>{someState}</div>;
}
```


However, at this point we will not explain why we passed in an empty array
`[]`.  We have not yet introduced the dependency array yet. But other than
that, the audience should be able to grasp the first use case of `useEffect`,
which is to execute side effect for only once when the component is loaded.
Now the name of the hook also makes sense. Since it is used to contain a side
`Effect`.


## Step 4. Introduce the dependency array

Then, we can introduce the second use case of `useEffect`, which is to react to
changes of some variables. When the variable is changed, React will call the
function which contains the side effect. In class terms, this is
`componentDidUpdate`.

Now, we can introduce the dependency array as the way to specify which
variables/states we are watching over. The example I used was to perform the
API call again after some number of presses.

```jsx
useEffect(() => {
  if (numPress >= 5) {
    callApiAndUpdateState();
    setNumPress(0);
  }
}, [numPress]);
```

We can give another example by performing different side effects: printing
something, sending an alert/notification, change some styling or whatever.

After we have explained the dependency array, we revisit the use case of the
empty array.  We can say that the empty array has the following change when the
component is loaded for the first time. 

$$
  \text{nothing} \xrightarrow{\text{first render}} {\tt [\ ]}
$$

But the empty array cannot change to anything else. That's why it does not
cause the `useEffect` to be executed. Now we have filled the knowledge gap from
step 3.

I also additionally introduced `useEffect` with `setInterval` to demonstrate an
extreme consequence of mis-managing side effects, and to reinforce the use case
of `useEffect(f, [])`. 


To see the final product, check out [this
video](https://youtu.be/nlu2-xYNkQQ?t=2601) and the
[README](https://github.com/uclaacm/hack-sprint-w21/tree/master/session-5-async-and-life-cycle#useeffect)
that went along with the workshop.

That's it, now you know how to teach `useEffect` without ever appealing to the
knowledge of the class-based lifecycle method `componentDidMount`.



