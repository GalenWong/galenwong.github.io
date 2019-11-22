---
date: "2019-09-25"
title: "How to randomly permutate an Array? Part 1"
subtitle: "The Dark Art, the Black Magic, the Forbidden Spell"
---

This is going to be a blog series of __me__ discussing how
to permutate a random Array in JavaScript. *I am aware
of the proven and working methods that is called 
[Knuth shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
method.* I stress the "me" since it is more about 
presenting __my__ thought and learning process. 
If you are here for a quick method for permutating 
an array, go [here](https://www.rosettacode.org/wiki/Knuth_shuffle).

### Laying out the Problem

In an interview, I got asked the following problem.

> Given a number $n$, return an array containing a 
> fair random permutation of $[\,0, n)$. 

For any set $[\,0, n)$, there are $n!$ of unique possible 
arrangements ($n!$ ways of ordering it). A fair random 
permutation says that the possibility of returning any 
one of those arrangement should be equal. 
In other words, the probability of getting any one of 
those sequence $s$ is given by 
$$
P(S=s) = \frac{1}{n!}
$$

For $n=3$, the function have the equal chance of returning
`[0, 1, 2]`, `[0, 2, 1]`, `[1, 0, 2]`, `[1, 2, 0]`,
`[2, 0, 1]`, and `[2, 1, 0]`.

### It's Dark Art, Harry! (It's a Forbidden JuTsu, Naruto!)

It seems like a simple problem. But I am a programmer that
tHInkS OuT oF THe bOx, my first solution to question is 
with `Array.prototype.sort`. 

```js
function randomArr(n) {
  const arr = new Array(n);
  return [...arr.keys()].sort(() => Math.random() - 0.5);
}
```

It is short, and it is simple if you understand it. 
Let's try to walk through this code, starting with how I
get an array of `[0, 1, 2,… n]`.

```js
function randomArr(n) {
  const arr = new Array(n); // highlight-line
  return [...arr.keys()].sort(() => Math.random() - 0.5);
}
```

By passing a number `n` to the `Array` constructor, 
we create an array with length `n`. Since we never 
specified the elements, all of the elements are 
`undefined` by default. I am not sure if this is part of 
the ECMAScript standard, but it does not really matter to
us. 

```js
function randomArr(n) {
  const arr = new Array(n); 
  return [...arr.keys()].sort(() => Math.random() - 0.5); // highlight-line
}
```

`[...arr.keys()]` represents the array `[0, 1, 2, … n]`.
You might ask why is the destructuring (the `...` 
operator, how ever you call it) necessary. 
In this case, it is not actually an "destructuring" 
operation. `Array.prototype.keys` actually returns an 
__iterator__, the `...` operator is to force iterate 
the iterator such that we get an array. 

Side note: you might have thought of using `Object.keys`
here, but it returns an array of strings. It makes sense
from an Object's point of view since all keys are simply
converted to string in an object.

Here comes the fun part, the dark art, the black magic,
the forbidden spell: the magical `Array.prototype.sort` 
function. By default, it sorts an array by converting 
the object to a string, and use the alphabetical order.
When I was new to JavaScript, I got super confused about
why `[1, 2, 12].sort()` gives me `[1, 12, 2]`.

TODO: insert now you know image.

We can overwrite this behavior by providing a custom
comparison function. If you have worked with sorting
in C/C++, it is the same logic. The comparison function
$f$ takes in two element $a$ and $b$. We define $f$ as

$$
f(a, b) = \begin{cases}
\begin{aligned}
0\text{ if }a = b\\
>0\text{ if } a > b\\
<0\text{ if } a < b\\
\end{aligned}
\end{cases}
$$

This means that a numerical sorting can be done by 
```js
numericArray.sort((a, b) => a - b);
```

The black magic that I used is to return a random number
with a uniform distribution between `-0.5` to `0.5` 
(aka $\text{Unif}[-0.5, 0.5]$). Since `Math.random` 
returns a random float between 0 to 1, 
`Math.random() - 0.5` returns our desired distribution.

Think about it on a very high level, and efficiency aside.
If the comparison operation is random, the resulting 
"sorted" array should also be random, right? 

### How I Got Rejected for the Internship

> "I think this does not work. The smaller number has a 
> higher chance of showing up closer to the beginning."

This was the reaction from the interviewer after he 
saw my tHInkS OuT oF THe bOx solution. 
Now, it is time for me to give it a second deeper thought.
Most of the libraries/languages implements quicksort. 
The recursive algorithm for quicksort is layed out as

1. pick a random number to be the pivot
2. divide the rest of the number into 2 sets. 
   A set with all values smaller than the pivot, 
   and the other one larger 
   (let's ignore cases with repeated elements)
3. Repeat 1 and 2 on the two sets

With that simple algorithm in mind, I was able to run a 
sketch of proof in my head, the proof to why my method 
works fairly. Here is the central idea to the proof.

> There is an equal chance of an element ending up on the
> "smaller" set and the "larger" set, given our random
> comparison function distributes as $\rm Unif[-0.5, 0.5]$.

Then, we apply this fact recursively, we can say that 
any element has an equal chance of ending up in any 
positions. It therefore concludes my hand-wavy proof.

I did not argue with the interviewer and did not present 
my mental proof. There is no way that I can demonstrate 
my proof is 100% correct, and I don't want to validate
my solution statistically by running it ten thousands 
times during the interview. 
I quickly switched to another approach that for sure 
works. More on that later. At the end of the story, I got 
rejected for the internship. I was slightly salty. 
(If you know me well, you know how salty I actually got.)

### It Was All Tim's Fault!

After I got salty, I decided to validate my solution. 
We can simply run the function for many times, and record
where the elements ends up in. This is known as the 
[law of large number](https://en.wikipedia.org/wiki/Law_of_large_numbers).

```js
const audit = (randomFunc, numIter) => {
    const dummy = new Array(100).fill(null);
    const densityMap = dummy.map(() => new Array(100).fill(0));

    for (let i = 0; i < numIter; i++) {
        const arr = randomFunc();
        arr.forEach((item, idx) => densityMap[item][idx]++);
    }
    return densityMap;
}

```

The `audit` function takes in `randomFunc`, which is the
function that returns the randomly permutated array, and 
`numIter`, which is the number of times we are running
the function. In this audit function, we assumed $n=100$ 
to simplify things.

Most importantly, it returns a density map, a 100x100 2-D
array recording how many times that each number appeared 
in each index. With the density map available, we can
visualize the data. 

```js
const times = 100000;
const density = audit(() => randomArr(100), times);

const probability = [];
for (const num of density) {
  probability.push(num.map(count => (count / times * 100.0).toFixed(2)));
}
console.log(probability[1]);
```

We convert the density to a probability map, and
simply print the map. Is it too simple? We did not even
examine the rest of it. But this is already enough, 
enough to prove me wrong.

Here is a probability map that I got for the number `1`,
running the function for 100000 times, with $n=100$.
```js
[
  '1.09', '1.39', '1.57', '1.46', '1.60', '1.63',
  '1.62', '1.48', '1.57', '1.53', '1.44', '1.53',
  '1.50', '1.50', '1.46', '1.47', '1.42', '1.37',
  '1.38', '1.35', '1.43', '1.32', '1.34', '1.40',
  '1.31', '1.37', '1.28', '1.29', '1.32', '1.27',
  '1.30', '1.31', '1.32', '1.25', '1.24', '1.27',
  '1.20', '1.20', '1.11', '1.17', '1.13', '1.13',
  '1.15', '1.14', '1.08', '1.16', '1.12', '1.10',
  '1.07', '1.07', '1.09', '1.08', '1.07', '1.07',
  '1.05', '1.04', '1.03', '1.04', '1.01', '0.93',
  '1.00', '0.97', '0.96', '0.92', '0.90', '0.88',
  '0.86', '0.86', '0.84', '0.74', '0.80', '0.82',
  '0.78', '0.69', '0.73', '0.68', '0.66', '0.65',
  '0.63', '0.56', '0.60', '0.58', '0.55', '0.56',
  '0.50', '0.50', '0.43', '0.38', '0.44', '0.40',
  '0.35', '0.38', '0.35', '0.30', '0.27', '0.26',
  '0.20', '0.17', '0.15', '0.11'
]
```

This map represents what is the probability of the number
1 appearing in each index. 
If my method was correct, this map should have been
all ones, or at least values that are close to one.
But look at the last few indices, the number `1` only
shows up there with a 0.20% chance. 
I was wrong, yet I was so confident. 
Not only is my method slow (sorting has a time complexity of $O(n\log n)$), it is also incorrect and unfair.
But what went wrong though? 

The biggest fault in my thought process is in my 
assumption. I assumed that JavaScript (or more 
specifically the V8 engine) implements 
`Array.prototype.sort` using quicksort. I was wrong.
Just recently, they [switched to using Tim sort](https://v8.dev/blog/array-sort#timsort). 

Tim sort is a combination of insertion sort and 
merge sort. We are not discussing the details here. 
But that means my proof cannot be applied. 

### No, I Am Still Right. Maybe

What if I implemented my own quicksort? That defeats the 
purpose of using this dark magic for it being a 2-liner. 
But it should work by theory. 

```js
const quicksortFactory = comparison => {
    const isSmaller = (a, b) => comparison(a, b) < 0;
    
    const quicksort = arr => {
        if (arr.length < 2) return arr;
        const [pivot] = arr.splice(Math.floor(Math.random() * arr.length), 1);
        
        const [left, right] = arr.reduce((tuple, i) => {
            if (isSmaller(i, pivot)) tuple[0].push(i);
            else tuple[1].push(i);
            return tuple;
        }, [[ /*smaller*/ ], [ /*bigger*/ ]]);

        const leftSorted = quicksort(left);
        const rightSorted = quicksort(right);
        leftSorted.push(pivot, ...rightSorted);
        return leftSorted;
    };

    return quicksort;
}
```

Notice how I pick the pivot randomly, that is important
to ensure the fairness as well.
This implementation is not efficient both in terms of 
time and memory, but what I really care about is that 
it implements the quicksort algorithm.
Using the same configuration as above, we get the 
following distribution for the number 1. 

```js
[
  '0.98', '1.06', '1.03', '1.00', '0.98', '1.01',
  '0.95', '1.02', '0.97', '0.97', '0.97', '1.06',
  '1.01', '1.02', '1.01', '0.98', '1.00', '0.98',
  '1.04', '0.98', '1.03', '1.01', '0.97', '0.99',
  '1.02', '0.95', '0.97', '1.07', '1.00', '0.94',
  '0.98', '0.98', '1.05', '1.03', '0.98', '1.01',
  '1.00', '0.97', '1.06', '0.99', '1.01', '0.99',
  '0.97', '0.97', '1.05', '0.98', '1.01', '1.00',
  '0.96', '1.00', '0.99', '1.01', '1.00', '0.98',
  '1.03', '0.94', '0.97', '0.99', '1.03', '0.99',
  '1.01', '1.00', '1.08', '0.97', '1.05', '0.98',
  '1.05', '1.02', '0.98', '1.00', '1.02', '0.98',
  '1.02', '0.98', '1.07', '1.00', '1.01', '1.05',
  '0.98', '1.01', '0.98', '0.98', '0.95', '0.99',
  '1.01', '0.97', '1.02', '0.95', '1.00', '1.00',
  '0.97', '1.02', '0.98', '0.98', '0.99', '1.03',
  '0.95', '0.98', '1.01', '1.02'
]
```

It is pretty even and close enough to 1. 
But let's compare it to other methods that works.

Here is the mathematically proven Knuth shuffle method.
```js
function shuffle(array) {
    var tmp, current, top = array.length;
    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }
    return array;
}
```
This gives us the following distribution map

```js
[
  '1.00', '1.01', '1.03', '0.97', '1.01', '0.95',
  '0.96', '0.98', '0.99', '0.99', '0.95', '1.04',
  '1.03', '1.03', '0.93', '0.99', '0.96', '0.98',
  '0.98', '0.99', '1.04', '1.03', '0.95', '1.03',
  '0.97', '0.98', '1.03', '0.95', '0.98', '1.00',
  '1.00', '1.02', '1.02', '0.98', '0.99', '1.01',
  '1.04', '0.99', '1.02', '1.02', '1.02', '1.02',
  '1.00', '0.97', '1.00', '1.00', '0.95', '1.02',
  '0.99', '0.98', '0.96', '0.97', '1.02', '1.03',
  '1.00', '1.00', '1.03', '1.01', '1.02', '1.04',
  '0.98', '1.00', '0.96', '1.04', '0.97', '0.96',
  '1.04', '1.04', '0.98', '1.05', '1.00', '1.00',
  '1.00', '1.05', '1.01', '1.01', '0.99', '0.98',
  '1.01', '1.02', '0.98', '0.96', '1.02', '1.02',
  '0.97', '1.04', '1.00', '1.02', '1.01', '1.00',
  '1.05', '1.00', '1.06', '1.02', '0.92', '1.01',
  '1.04', '0.93', '0.98', '1.01'
]
```

If we only look at the distribution of one number,
the method of random quicksort-ing seems to work in terms
of fairness. In a future blog post, I will do a more 
rigorous measurement of the distribution.

I am quite happy at stage to see that my idea is working
to a certain degree. 

### My Second Approach

Rolling back to the interview, after my forbidden spell
got, well, forbidden, I switched to another method.
This one is intuitive. We pick an random element from
the array, remove it and push it to a new array.

```js
const randomArrBySplicePush = () => {
    let arr = new Array(100);
    arr = [...arr.keys()]
    const result = [];
    for (let i = 100; i > 0; i--) {
        const idx = Math.floor(Math.random() * i);
        const [selected] = arr.splice(idx, 1);
        result.push(selected);
    }
    return result;
};
```

This is also very simple, but no where near the Knuth 
method. The performance bottleneck comes from the `splice`
operation. Since you might need to shift the entire array,
this is a $O(n^2)$ function.

We will be going into measuring performance as well,
in another blog post.


### Conclusion

V8 uses Tim sort. But if it were to use quicksort, my 
approach might still work. Some good progress has been
made. We will take a deep dive into measuring the 
distribution and therefore my algorithm's correctness
in Part 2.
