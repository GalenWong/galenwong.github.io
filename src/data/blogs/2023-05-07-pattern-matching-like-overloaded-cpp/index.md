---
title: Understanding the "std::variant"/"std::visit" Pattern Matching Like Construct in C++
subtitle: "Modern C++ features coming together"
date: "2023-05-07"
---

+ [Background](#background)
+ [Lambda Is Really A Class with `operator()`](#lambda-is-really-a-class-with-operator)
+ [List Initialization](#list-initialization)
+ [Template Parameter Pack](#template-parameter-pack)
+ [Template Deduction Guide](#template-deduction-guide)
+ [Aggregate Initialization](#aggregate-initialization)
+ [Putting Everything Together: Function Overloading](#putting-everything-together-function-overloading)
+ [Summary](#summary)

### Background

I have recently been using
[`std::variant`](https://en.cppreference.com/w/cpp/utility/variant) for some
abstraction that I am working on. As someone who picked up modern C++ in the
past 1.5 year, I am glad there is a vocabulary sum type in the C++ standard
library. And the standard library provides a handy function `std::visit`
allowing us to perform operation on the variant. However, there is a very 
interesting example listed in the `std::visit`:


```cpp
// the variant to visit
using var_t = std::variant<int, long, double, std::string>;
 
// helper type for the visitor #4
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
// explicit deduction guide (not needed as of C++20)
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;

int main() {
    std::vector<var_t> vec = {10, 15l, 1.5, "hello"};
    
    for (auto& v: vec) {
        // 4. another type-matching visitor: a class with 3 overloaded operator()'s
        // Note: The `(auto arg)` template operator() will bind to `int` and `long`
        //       in this case, but in its absence the `(double arg)` operator()
        //       *will also* bind to `int` and `long` because both are implicitly
        //       convertible to double. When using this form, care has to be taken
        //       that implicit conversions are handled correctly.
        std::visit(overloaded {
            [](auto arg) { std::cout << arg << ' '; },
            [](double arg) { std::cout << std::fixed << arg << ' '; },
            [](const std::string& arg) { std::cout << std::quoted(arg) << ' '; }
        }, v);
    }
}
```



First, let's take a look at the syntax of the callsite: 

```cpp
std::visit(overloaded {
    [](auto arg) { std::cout << arg << ' '; },
    [](double arg) { std::cout << std::fixed << arg << ' '; },
    [](const std::string& arg) { std::cout << std::quoted(arg) << ' '; }
}, v);
```

This reminds me of pattern matching in some other languages. If we were to express the same thing in OCaml:

```ocaml
match v with 
    | String arg -> print_string arg
    | Double arg -> print_float arg
    | _ arg ->  (** some how polymorphically print this fallback, but I don't know how to *)
```


The pattern matching like construct is not the same as pattern matching in
other languages. For one, we cannot match against the structure of the object,
but only the type of the object. However, this is not the focus of this
article. 

I want to understand, from a language feature perspective, how C++ enabled this
pattern matching like pattern. It amazes me how elegant the construct is
written out. It is easy to write since it is not very verbose. It is also very
easy to read since each lambda corresponds to one case. This pattern make a lot
of sense to me yet at the same time, I fail to understand how the pattern gets
put together. So in this article, we will break down the pattern piece by piece
and understand all the C++ language features that combined to give such
beautiful pattern. 


### Lambda Is Really A Class with `operator()`


First, let's understand what a lambda really is. In C++, there are 2 types of
entity that are callable: normal functions, and any object with `operator()`
defined on it (also known as function objects or functor). Lambda is actually
just an object with `operator()` that the compiler creates for us.

```cpp
auto lambda = [](int i) { return i * i };

// will get translated to something like 

struct __some_compiler_generated_name
{
    int operator()(int i) const 
    {
        return i * i;
    }
};

__some_compiler_generated_name lambda = __some_compiler_generated_name{};
```

So it is simply a syntactic sugar for a quickly making a function object. The
important fact to note here is that lambda is just an object and therefore a
value. 


### List Initialization

One of the part of this pattern that trips me is the syntax of `overloaded`
with the lambdas:

```cpp
overloaded {
    [](auto arg) { std::cout << arg << ' '; },
    [](double arg) { std::cout << std::fixed << arg << ' '; },
    [](const std::string& arg) { std::cout << std::quoted(arg) << ' '; }
}
```

What is this syntax with a type name bracket with a list of lambdas? 
To understand this, we first look at something simpler:

```cpp
std::vector{1, 2, 3}
```

This initializes a vector using the list initialization syntax, meaning
these values are passed to the constructor that accepts these arguments 
and the object is constructed that way. 

Lambdas are objects after all, so we can pass them as values in list
initialization. However, we never defined a constructor for the `overloaded` 
class. What constructor is it calling? 

```cpp
// calling some weird constructor that takes 3 lambdas?
overloaded {lambda1, lambda2, lambda3}
```

### Template Parameter Pack


Now we analyze how the overloaded class is defined:

```cpp
// helper type for the visitor #4
template<class... Ts> struct overloaded : Ts... { using Ts::operator()...; };
// explicit deduction guide (not needed as of C++20)
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;
```

Wow, this is pretty complicated. Let's first analyze the ellipsis:

```cpp
template <class... Ts>
```

The ellipsis in the template parameter is the template parameter pack. This is
also known as variadic template parameter. It allows us to pass in an arbitrary
number of template argument when using this class, meaning that these are all
valid:

```cpp
// assuming class A, B, C are defined:

using overloaded_A = overloaded<A>;
using overloaded_A_B = overloaded<A, B>;
using overloaded_A_B_C = overloaded<A, B, C>;
```

And how does the template argument get used in `overloaded`?

```cpp
template<class... Ts> 
struct overloaded : Ts... 
{ 
    using Ts::operator()...; 
};
```

They are used as the base class of the `overloaded` class, meaning that
overloaded will inherit from the parameter types. They are also used to
reference the `operator()` from the parameter types. So all the `operator()` 
will get introduced into the `overloaded` class. 

Here is how `overloaded<A, B, C>` gets expanded:

```cpp
struct overloaded : public A, public B, public C 
{
    using A::operator(), B::operator(), C::operator();
}
```


### Template Deduction Guide 

Now, let's look at second part of the `overloaded` class. 

```cpp
template<class... Ts> overloaded(Ts...) -> overloaded<Ts...>;
```

This is known as a template deduction guide. It is meant to help
the compiler derive template argument from the constructor call. 
This template deduction guide is telling the compiler that for 
each of the argument being passed in the constructor, use their types 
as the template arguments. For example,

```cpp
overloaded overloaded_A_B_C_obj { A(), B(), C() };
```

The `overloaded` template class will receive the concrete template arguments
because of the deduction guide: 

```cpp
overloaded<A, B, C> overloaded_A_B_C_obj { A(), B(), C() };
```

### Aggregate Initialization 

Now we know fully how the class will be defined. But we still did not 
define a constructor. So how does the list initialization syntax works
for the `overloaded` class?  

When an class is defined without any constructor, the class is known as an
**aggregate** in C++. C++ will allow us to list-initialize an aggregate's data
members. And this special list-initialization is called aggregate initialization. 

Here is a simple example:

```cpp
struct Person 
{
    std::string name;
    int age;
};

Person p { "Galen", 23 };
std::cout << p.name << " " << p.age; // outputs Galen 23
```

But our overloaded class has no data members. Turns out, C++ will allow us to
list-initialize the aggregate's base class with list-initialization as well: 

```cpp
struct A {};
struct B {};
struct C : public A, public B {};

C c_obj {A(), B()};
```


Therefore, our initialization implicitly has the initializer list constructor that
accepts the values to copy/move initialize in the base class:

```cpp
overloaded<A, B, C> overloaded_A_B_C_obj { 
    A(), // copy or move initialize the A base class
    B(), // copy or move initialize the B base class
    C()  // copy or move initialize the C base class
};
```

### Putting Everything Together: Function Overloading

Now, we have everything we need to piece together how this pattern works:

```cpp
overloaded {
    [](auto arg) { std::cout << arg << ' '; },
    [](double arg) { std::cout << std::fixed << arg << ' '; },
    [](const std::string& arg) { std::cout << std::quoted(arg) << ' '; }
}
```

Expanding the lambda to function objects:

```cpp

struct __lambda_1 {
    void operator()(auto arg) const { std::cout << arg << ' '; } 
};

struct __lambda_2 {
    void operator()(double arg) const { std::cout << std::fixed << arg << ' ' ; } 
};

struct __lambda_3 {
    void operator()(const std::string& arg) const { std::cout << std::quoted(arg) << ' '; } 
};

overloaded { __lambda_1(), __lambda_2(), __lambda3() }
```

Then, using the template deduction guide we deduce the exact concrete template implemention:

```cpp
struct overloaded : public __lambda_1, public __lambda_2, public __lambda_3 
{
    using __lambda_1::operator(), __lambda_2::operator(), __lambda_3::operator()
};
```

which is effectively equivalent to:

```cpp
struct overloaded_function_class
{
    void operator()(auto arg) const { std::cout << arg << ' '; } 
    void operator()(double arg) const { std::cout << std::fixed << arg << ' ' ; } 
    void operator()(const std::string& arg) const { std::cout << std::quoted(arg) << ' '; } 
};
```

Therefore, 

```cpp
overloaded {
    [](auto arg) { std::cout << arg << ' '; },
    [](double arg) { std::cout << std::fixed << arg << ' '; },
    [](const std::string& arg) { std::cout << std::quoted(arg) << ' '; }
}
// is behaviorally equivalent to 

overloaded_function_class obj;
```

Then, whenever our obj is called, the implementation will be selected based on function overloading resolution. For example:

```cpp
overloaded_function_class overloaded_functions;

double d = 2.4;
overloaded_functions(2.4); // this will call the double overload
std::string s = "hello world!";
overloaded_functions(s); // this will call the string overload
```

And in the context of `std::visit`, `std::visit` will extract the underlying
type stored inside the `std::variant` and call the function passed to it with
the underlying object. And the correct implementation will be called using
overload resolution. 

### Summary

Isn't this so cool? All these C++ features coming together to enable this 
cute pattern of overloaded lambdas to emulate the pattern matching syntax.

Hope this article is helpful to you, and you are able to learn something
new through my analysis of this pattern. Here are all the C++ features we talked about 
today:
- Lambda
- List initialization and aggregate initialization
- Template parameter pack
- Template argument deduction guide
- Function overloading
