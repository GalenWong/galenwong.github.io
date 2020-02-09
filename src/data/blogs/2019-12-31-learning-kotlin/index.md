---
date: "2019-12-31"
title: "Kotlin Learning Notes"
subtitle: "The Traps and Pitfalls"
---

+ [Lambda and Anonymous Functions (A.F.)](#lambda-and-anonymous-functions-af)
  + [`return` from Lambda and A.F.](#return-from-lambda-and-af)
  + [Nested Lambda with Qualified Return](#nested-lambda-with-qualified-return)
  + [Passing Lambda vs A.F. as Argument](#passing-lambda-vs-af-as-argument)
  + [The Implicit `it` in Lambda](#the-implicit-it-in-lambda)
  + [Trailing Lambda Shorthand](#trailing-lambda-shorthand)
+ [`lateinit` Variables](#lateinit-variables)
+ [Inflation](#inflation)
+ [Default Parameters with Inheritance](#default-parameters-with-inheritance)
+ [Default Parameters Evaluation](#default-parameters-evaluation)

This is a blog post will act as a note as for my Kotlin 
learning. I will document some pitfall that I encountered 
while learning the language and present it in a format 
similar to evil interview questions ~~because I like 
torturing other people with interview questions~~.

## Lambda and Anonymous Functions (A.F.)

### `return` from Lambda and A.F.

Take a look at the following code snippet. 
Predict its output to the console. 

```kt
fun main(args: Array<String>) {
    val arr = arrayOf(1, 2, 3, 4, 5)
    println("stopAt3WithLambda")
    stopAt3WithLambda(arr)
    println("stopAt3WithAF")
    stopAt3WithAF(arr)
}

fun stopAt3WithLambda(args: Array<Int>) {
    args.forEach { k -> 
        println("this is $k")
        if (k == 3) return
    }
    println("finished, returning")
}

fun stopAt3WithAF(args: Array<Int>) {
    args.forEach(fun (k: Int) {
        println("this is $k")
        if (k == 3) return      
    })
    println("finished, returning")
}
```

<details>
<summary>Answer</summary>

The code block outputs the following to the console:

```
stopAt3WithLambda
this is 1
this is 2
this is 3
stopAt3WithAF
this is 1
this is 2
this is 3
this is 4
this is 5
finished, returning
```
</details>

<h4> Explanation</h4>

According the 
[docs](https://kotlinlang.org/docs/reference/returns.html#return-at-labels), 
a "qualified return" allows us to "return from an outer 
function". I personally find it hard to understand the 
sentence when I first read it. What is a "qualified" 
return? Why an "outer" function? Doesn't the `return` 
keyword just return from the "current" function? 

To understand the statement, I interpret the terms as such:
- A "qualified" return is an action of return through the 
explicit return statement with the `return` keyword.
 Meaning
  ```kt
  return 1
  ```
  is a qualified return. Another type of return is the 
  implicit return from a lambda. Meaning, the last 
  expression of the body of the lambda. 
  ```kt
  { a, b ->
    println("a: $a b: $b")
    a + b
  }
  ```
  The given lambda expression returns `a + b` implicitly, 
  and this is not a qualified return.
- "Function" should be understood as a code block that 
  can be executed or invoked **that is declared by the `fun`
  keyword**. A lambda is also a code block that is 
  executable but it is not a "function" in this context. 
  Therefore, in the statement, "returning from an outer 
  function" means returning from a code block declared 
  through the `fun` keyword.

With such definition, this statement describes the behavior
of qualified return in a lambda expression correctly. 
In the given example above, the `return` keyword in the 
lambda is returning from `stopAt3WithLambda` instead of 
the lambda expression. That's why `"finished, returning"` 
is not printed. 

In `stopAt3WithAF`, however, the `return` keyword in the 
A.F. is returning from the anonymous **function** that is 
declared through a `fun` keyword. This is not a 
contradiction to the statement if we interpret it 
according to the definitions laid out above. 

The property introduces more interesting questions. 

1. What happens if we nest lambdas with inner qualified 
   return? 
2. What if we pass a lambda with qualified return as an 
   argument to a function? Will the behavior differ if we 
   pass an A.F. instead? 

### Nested Lambda with Qualified Return

According to the interpretation of the statement, I 
anticipate that the return to escape the nested lambda
and return from the outer function with `fun` keyword.

To validate the theory, we change our `stopAt3` to traverse
a 2D array instead. We have the following code snippets.

```kt
fun main(args: Array<String>) {  
    val matrix = arrayOf(
    	arrayOf(1, 2, 3, 4, 5),
        arrayOf(1, 2, 3, 4, 5)
    )
    
    stopAt3Nested(matrix)
}

fun stopAt3Nested(matrix: Array<Array<Int>>) {
    matrix.forEach { row ->
        row.forEach {k ->
        	println("this is $k")
            if (k == 3) return 
        }
    }
    println("finished, returning")
}
```

As expected, the output is 

```
this is 1
this is 2
this is 3
```

Meaning we returned from `stopAt3Nested` directly, without
printing `"finished returning"`. 


### Passing Lambda vs A.F. as Argument

> What if we pass a lambda with qualified return as an 
   argument to a function? Will the behavior differ if we 
   pass an A.F. instead? 

The reason why I asked this question is that if the return
statement in lambda or A.F. will return from the current
scope where they are declared or within in the scope that 
they are called (the function that accepts the lambda or 
A.F. as an argument). I realized that the answer is clearly
stated in the given example. 

In our example, we passed lambda and A.F. to the function
of `Array<T>.forEach`, and we see the difference in their 
behavior. Therefore, this provides us with a way to think 
about the `return` statement. It jumps to the end of the 
closest function "frame" delimited by the `fun` keyword. 


```kt
fun f() {
  fun g() {
    fun h() {
      return 1 // jumps to the end of h, the closest function "frame"
    }
  }
}
```

Another way to think about this is that `return` is 
"statically scoped" instead of dynamically scoped. 
The target function to escape from is resolved at compile
time statically, instead of at run time dynamically. 

__Moral of the story:__ I should rethink about the term 
lambda. Computer Scientists could have called lambda just a 
shorthand for an anonymous function (in Kotlin at least), 
but they did not for a reason. 
__Lambdas and functions are different__. The property of 
jumping out of the closest function frame of a qualified 
return in lambda really makes lambda different from a 
function. It seems to open up doors to very interesting 
programming patterns but I can't come up with anything 
off the top of my head. 

### The Implicit `it` in Lambda

This is super weird to me at first but I guess it make
sense as a short hand. 

What is the output if we executed the following function?

```kt
fun whatIsIt() {
  val it = 2
  val myEvilLambda = {
    println("it in lambda: $it")
  }
  myEvilLambda(3)
}
```

<details>
<summary>Answer</summary>

No, it is not 3 since this does not compile. 
For the reason that the type of 
`it` cannot be inferred at declaration. Therefore, it is 
resolved to the `it` variable declared in the scope of 
`whatIsIt`. Therefore, `myEvilLambda` has the type of 
`Kotlin.Function0`, which means the lambda does not accept 
any arguments. To fix the problem, we can declare the 
parameter of `it` with an explicit type. 

```kt
val myEvilLambda = { it:Int ->  
  println("it in lambda: $it")
}
```

Well, this loses the point of the implicit `it` shorthand.

</details>


The `it` implicit keyword really shines when you are passing
a lambda to another function as an argument, 
since the function that accepts the lambda already have
a type declared for the lambda. For example, in Android,
when you add an listener:

```kt
myButton.setOnClickListener {
  val randNum = Random.nextInt(0, 100)
  it.setText("$randNum")
}
```

Or what the people in JavaScript lands call the functional
programming style of `map`, `reduce`, `filter`, but instead
in Kotlin they are `flatMap`, `fold`, and `filter`. 

```kt
intArray.filter { it > 0 }
```

### Trailing Lambda Shorthand

In the previous example of `Array.filter` and
`setOnClickListener`, we see that we can pass lambda to a
function omitting the parenthesis. This applies to any 
function with the last argument being a function type 
(here function type is used to refer to both lambda and 
functions). 

An example from the documentation is 

```kt
val product = items.fold(1) { acc, e -> acc * e }
```

Wow, this feels like functional programming a lot, where
`items.fold(1)` returns a function as well. No, this is 
only a visual trick to make you think that this is a higher
order function when it is actually not. 

## `lateinit` Variables 

I understand the motivation behind `lateinit`, 
especially in the context of UI development where some 
variables are only initialized in the lifecycle methods.

However, my first thought looking at this feature
is that it is quite dangerous for a compiled language. 
It is like the programmer tries to make a promise to the 
program like "I will definitely gives the variable a value
before I use it. I promise". We all know that human is never
reliable. What happens if we access it without initializing 
it? Well, an exception is thrown. I naively thought that the
program will actually not check if it is initialized first
since performance is better without the null check, but yes
that was way too naive. 
Null check is still done in run time before using `lateinit`
variables. It is not too much speed to sacrifice for safety.
You can just view it as a nullable type. However, it is 
stricter since it cannot be `null`. It either has a value 
or does not have a value at all.


## Inflation

In Android development, the term is used a lot. It means 
"instantiating a layout XML file into its corresponding 
`View` objects" (source: 
[LayoutInflator](https://developer.android.com/reference/android/view/LayoutInflater)).
I understand it as parsing the XML file and generating the 
view hierarchy in memory. To draw analogy from the web dev
domain, it would be to parse the HTML file and generating 
the actual DOM tree. 

## Default Parameters with Inheritance 

Read the following code snippet. 
Predict its output to the console. 

```kt
fun main(args: Array<String>) {  
	val a = A()
    val b = B()
    println(a.method())
    println(b.method())
}

open class A {
    open fun method(i: Int = 1): Int {
        return i
    }
}

class B: A() {
    override fun method(i: Int = 2): Int {
        return i
    }
}
```


<details>
<summary>Answer</summary>

No, there is no output since this code does not compile. 
The reason can be found in the 
[Kotlin docs](https://kotlinlang.org/docs/reference/functions.html#default-arguments).
Here I quote it.

> Overriding methods always use the same default parameter values as the base method. When overriding a method with default parameter values, the default parameter values must be omitted from the signature.

The compiler error message for this case would be 

```
An overriding function is not allowed to specify default values for its parameters
```

</details>

<h4>Discussion</h4>

Initially, I cannot understand the intention of such 
language design decision. It is not difficult to 
implement such language feature. The reason for 
such design is perfectly answered by 
[this Stack Overflow answer](https://stackoverflow.com/a/37701188).
The following quote from the answer explain why 
overriding parent classes' default parameters is bad:

> Callers would not know what the default value is unless they were aware of which implementation they were using, which is of course highly undesirable.

What does it look like in code? Let's assume that 
the in another parallel universe the Kotlin compiler
allow us to override the parent classes' default 
parameters. Therefore the code above compiles. 
Let's say that we declare a function that takes
in an object of class `A` as parameter. 

```kt
fun processClassA(obj: A) {
  return obj.method() * 2
}
```

When the programmer want to use `A.method` and its
default parameters, it has to know which implementation
of `A` is being passed in. The reason for that is that 
we can also pass an instance of `B` into `processClassA`
by the principle of OOP. That's why such behavior is 
undesirable.

Therefore, letting the parent class dictates the default
parameters is the best choice to make so that programmer
can reason about their program easier. 

## Default Parameters Evaluation

Predict the output to the console of the following code
snippet. 

```kt
fun main(args: Array<String>) {  
    for (_i in 1..10) {
        whatIsGlobal()
    }
}

var global = 0

fun getAndIncGlobal(): Int {
    global++
    return global
}

fun whatIsGlobal(g: Int = getAndIncGlobal()) {
    println(g)
}
```

<details>
<summary>Answer</summary>

```
1
2
3
4
5
6
7
8
9
10
```

This proves that the default parameter expression is 
evaluated at call time instead of compile time, unlike
Python.
</details>
