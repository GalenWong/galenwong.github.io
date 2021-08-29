---
title: "My Notes for UCLA CS231: Types and Programming Languages"
subtitle: "Winter 2021, taught by professor Todd Millstein"
date: "2021-08-29"
---

+ [Operational Semantics](#operational-semantics)
  + [Big-step operational semantics](#big-step-operational-semantics)
    + [Applying inference rule](#applying-inference-rule)
    + [Plus](#plus)
    + [Greater](#greater)
  + [Proving properties given rules](#proving-properties-given-rules)
    + [Structural induction](#structural-induction)
  + [Small-step operation semantics](#small-step-operation-semantics)
    + [Some terminology related to small-step semantics](#some-terminology-related-to-small-step-semantics)
  + [Practicing Proof](#practicing-proof)
+ [Static Type System](#static-type-system)
  + [Type Soundness](#type-soundness)
    + [Progress + Preservation](#progress--preservation)
+ [Lambda Calculus](#lambda-calculus)
  + [untyped lambda calculus (chapter 5)](#untyped-lambda-calculus-chapter-5)
    + [Omega term](#omega-term)
  + [Congruence rule](#congruence-rule)
    + [Call-by-value](#call-by-value)
    + [Church Booleans](#church-booleans)
    + [Church numerals](#church-numerals)
  + [Simply-Typed Lambda Calculus](#simply-typed-lambda-calculus)
    + [Typecheck variable](#typecheck-variable)
    + [Typecheck function](#typecheck-function)
    + [Typecheck function call](#typecheck-function-call)
+ [Logic and typechecking](#logic-and-typechecking)
  + [Curry-Howard Isomorphism](#curry-howard-isomorphism)
  + [Logical Conjunction in type system](#logical-conjunction-in-type-system)
  + [Interlude: Midterm next Wednesday (one week from today)](#interlude-midterm-next-wednesday-one-week-from-today)
  + [Logical Disjunction](#logical-disjunction)
  + [Type True](#type-true)
+ [Adding features](#adding-features)
  + [Local Variables](#local-variables)
  + [Sequencing (side-effect)](#sequencing-side-effect)
  + [Recursion](#recursion)
+ [Type Inference](#type-inference)
  + [Constraint Generation](#constraint-generation)
    + [Correctness of Constraint Generation](#correctness-of-constraint-generation)
  + [Constraints Solving](#constraints-solving)
  + [Constraint Generation](#constraint-generation-1)
    + [Correctness of Constraint Generation](#correctness-of-constraint-generation-1)
  + [Constraints Solving](#constraints-solving-1)
+ [Parametric Polymorphism](#parametric-polymorphism)
  + [Polymorphic Lambda Calculus (System F, Second-Order Lambda Calculus)](#polymorphic-lambda-calculus-system-f-second-order-lambda-calculus)
    + [Example: swap](#example-swap)
    + [Operational semantics for polymorphic lambda](#operational-semantics-for-polymorphic-lambda)
    + [Typecheck for polymorphic lambda](#typecheck-for-polymorphic-lambda)
  + [Existential quantification](#existential-quantification)
+ [Proof assistant](#proof-assistant)
    + [Defining boolean](#defining-boolean)
    + [Defining negate](#defining-negate)
    + [Running computation:](#running-computation)
    + [Writing a lemma](#writing-a-lemma)
    + [Proofing the lemma](#proofing-the-lemma)
    + [Defining list](#defining-list)
    + [Defining Recursion](#defining-recursion)
    + [Proof by Induction](#proof-by-induction)
    + [Parametric polymorphism](#parametric-polymorphism-1)
    + [Defining Pairs](#defining-pairs)
    + [Dependent Proposition](#dependent-proposition)
  + [Proofs of 231 in Coq](#proofs-of-231-in-coq)
    + [Typechecking](#typechecking)
    + [Small-step operational semantics](#small-step-operational-semantics)
    + [Proving Progress and Preservation](#proving-progress-and-preservation)
+ [Mutable References](#mutable-references)
  + [Typing rules](#typing-rules)
  + [Small-step semantics](#small-step-semantics)
  + [Type Soundness with reference](#type-soundness-with-reference)
  + [Typing rule of location](#typing-rule-of-location)
+ [Subtyping](#subtyping)
+ [Type and Effect Systems](#type-and-effect-systems)
  + [Monads](#monads)

## Operational Semantics
### Big-step operational semantics

The simple language that we are working with today
defined in BNF grammar:
```ocaml
t ::= true | false | if t then t else t
```

The language gives some results. We call these values
and they can be defined as grammar as well.

```ocaml
v ::= true | false
```

> P.S. for this class. Values are usually a subset of the grammar.

We first define a interpreter for this language.

```ocaml
(* the types to represent the tree *)
type t = True | False | If of t * t * t
(* 
 * How to initialize If:
 *   If (True, False, True)
 *)

(* the values/outputs of the program *)
type v = TrueV | FalseV
```

An interpreter at this point is a function that takes a term of type `t` and
return a value of type `v`.

```ocaml
let rec eval (t:t):v = 
    match t with 
        True -> TrueV
    |   False -> FalseV
    |   If(cond, thn, els) ->
        match eval cond with
            TrueV -> eval thn
        |   FalseV -> eval els
```

So, big-step operation semantics really means we define a function that takes
in a term to produce a value. This relationship is the big step operation
semantics. Notation: $t \Downarrow v$ (read as $t$ big-steps to $v$)

In world of logic: binary relation, predicate, logical judgement.

Big-step operational semantics give rules to define the relation. Notation of a rule:

$$
\cfrac{\text{Premises}}{\text{Conclusion}}
$$


We attempt to writes the rules for the simple language defined above.

$$
\cfrac{}{v \Downarrow v}\quad E_{val}\quad 
$$

The rule $E_{val}$ has no premises. It is called an __axiom__. The logical equivalence of this rule is:

$$
\forall v. \quad v \Downarrow v
$$

Now we consider a rule where If condition evals to true.

$$
\cfrac{t_1 \Downarrow true\quad t_2 \Downarrow v_2}
{
    \texttt{If t1 then t2 else t3} \Downarrow v_2
}
\quad E_{IfTrue}
$$

Logical equivalence
$$
\forall t_1,t_2,t_3,v_2. \\
(t_1 \Downarrow true \land t_2 \Downarrow v_2)
\Rightarrow \texttt{If t1 then t2 else t3} \Downarrow v_2
$$

We can define the rule for false.

$$
\cfrac{t_1 \Downarrow false\quad t_3 \Downarrow v_3}
{
    \texttt{If t1 then t2 else t3} \Downarrow v_3
}
\quad E_{IfFalse}
$$

#### Applying inference rule

Claim: `if true then false else true` $\Downarrow$ `false`

We pick a rule to apply to the claim. We appeal to $E_{IfTrue}$. Then we
recursively prove each preconditions.

$$
\cfrac{
    \cfrac{}{true \Downarrow true}E_{val} \quad 
    \cfrac{}{false \Downarrow false}E_{val}
}
{
    \texttt{if true then false else true} \Downarrow false
} \quad E_{IfTrue}
$$

This is a derivation tree. To know the tree is correct. We can simply apply
the rules and see if the correct predicates are evaluated. So a simple
process.

If we choose the wrong rule initially. Our proof cannot proceed. A derivation
attempt that fails:

$$
\cfrac{
    \cfrac{}{true \Downarrow false} \quad 
    \cfrac{}{true \Downarrow false}
}
{
    \texttt{if true then false else true} \Downarrow false
} \quad \boldsymbol{E_{IfFalse}}
$$


Goal: `if true then (if false then true else false) else true` $\Downarrow$ `false`

$$
\cfrac{
    \cfrac{}{true \Downarrow true}E_{val} \quad 
    \cfrac{
        \cfrac{}{false \Downarrow false} E_{val}
        \quad
        \cfrac{}{false \Downarrow false} E_{val}

    }{\texttt{if false then true else false}\Downarrow false}E_{IfFalse}
}
{
    \texttt{if true then (if false then true else false) else true} 
    \Downarrow false
} \quad E_{IfTrue}
$$


Now we make our language more interesting by adding 
numbers.

```ocaml
t ::= true | false | if t then t else t 
     | n | t + t | t > t
n ::= <integer constants>
```


We manipulate the interpreter.

```ocaml
type t = True | False | If of t * t * t
        | Int of int | Plus of t * t | Greater of t * t

type v = TrueV | FalseV | IntV of int

let rec eval (t:t):v = 
    match t with 
        True -> TrueV

    |   False -> FalseV

    |   If(cond, thn, els) ->
        match eval cond with
            TrueV -> eval thn
        |   FalseV -> eval els

    |   Int i -> IntV i

    |   Plus (t1, t2) -> 
        (match (eval t1, eval t2) with -> 
            (Intv i, IntV j) -> IntV (i+j))

    |   Greater(t1, t2) -> 
        (match (eval t1, eval t2) with -> 
            (IntV i, IntV j) -> 
                if i > j then TrueV else FalseV)

``` 

> When Plus evals does not match two ints, OCaml throws a runtime error. To
be nicer, we add a Exception match clause
> ```ocaml
> _ -> raise TypeError
> ```

This is dynamically typed language. If we don't encounter type error during
execution, we don't do anything. For instance, 
an if-expression:

```ocaml
if true then true else false + 1
```

since the else-branch is never evaluated, we don't care about the type mismatch there.
We continue from last time. Let's write out the rule
for Plus and Greater than. 

#### Plus
$$
\cfrac{
    t_1 \Downarrow n_1 \quad t_2 \Downarrow n_2
    \quad n_1 [[+]] n_2 = n
}{
    t_1 + t_2 \Downarrow n
}

\quad E_{Plus}
$$

- Note that $[[+]]$ means a mathematical plus

#### Greater

$$
\cfrac{
    t_1 \Downarrow n_1 \quad t_2 \Downarrow n_2
    \quad n_1 [[>]] n_2 = b
}{
    t_1 + t_2 \Downarrow b
}
\quad E_{Greater}
$$

We introduce another metavariable for type of value for boolean. 

```ocaml
t ::= b | if t then t else t
    | n | t + t | t > t
b ::= true | false
n ::= integer constants
v ::= b | n
```

### Proving properties given rules 

Let's go back to the simplistic OCaml with only boolean
without the integer values.

Theorem: For all terms t, there exists value v such that t $\Downarrow$ v.

> Note this theorem might not be true for turing complete languages. The term
> might get stuck in infinite loop.

There is infinite number of terms. We use induction to prove it.

#### Structural induction 

We want to prove $P(t)$ for all terms $t$. 
- Prove $P(t)$ for separately for each kind of term
  - we can assume that $P(t')$ holds for each subterm $t'$ in $t$

Proof: by structural induction on $t$.

- Induction hypothesis: for all terms $t'$ such that $t'$ is a subterm of $t$,
there exists value $v'$ such that $t' \Downarrow v'$.
- Case analysis on the root node in $t$.
  - Case $t$=`true`: By $E_{val}$, $true \Downarrow true$.
  - Case $t$=`false`: By $E_{val}$, $false \Downarrow false$.
  - Case $t$ = `if t1 then t2 else t3`:
    - By induction hypothesis on $t_1$, there exists $v_1$ such that $t_1$ $\Downarrow$ $v_1$.
      - Case $v_1$=`true`: By IH on $t_2$, there exists $v_2$ such that $t_2 \Downarrow v_2$.
        - Then by $E_{IfTrue}$ `if t1 then t2 else t3` $\Downarrow v_2$
      - Case $v_1$=`false`: By IH on $t_2$, there exists $v_3$ such that $t_3 \Downarrow v_3$.
        - Then by $E_{IfFalse}$ `if t1 then t2 else t3` $\Downarrow v_3$
- QED


You can only do a case analysis on something that you know to exists/be true.

Example: for the same theorem, we cannot do a case analysis on $v$. Since the
goal is to prove $v$ exists, to do a case analysis we are just saying that
$v$ exists.


### Small-step operation semantics

Judgement of form $t\rightarrow t'$, meaning $t$ evaluates in one step to $t'$. It is a single step of derivation. What is a single step of derivation? 

Example:
```ocaml
if (if true then false else true) then false else true 

(* single-step to --> *)

if false then false else true 

(* single-step to --> *)

true
```

Two types of small-step rules:
- "computation" rules that simply do one small bit of evaluation
- "congruence" rules that simply tell you where to look recursively for the next bit of work

Examples of computation rule: 
$$
\cfrac{}{
  \texttt{if true then t2 else t3} \rightarrow t2
}
\quad 
E_{IfTrue}
$$

$$
\cfrac{}{
  \texttt{if false then t2 else t3} \rightarrow t3
}
\quad 
E_{IfFalse}
$$

Well, not all if statements simply uses `true` or `false` as the condition. We need a congruence rule to tell us what to do

$$
\cfrac{
  t1 \rightarrow t1'
}{
  \texttt{if t1 then t2 else t3} \rightarrow 
  \texttt{if t1' then t2 else t3}
}
\quad 
E_{If}
$$
- from this congruence rule, we ended up with a new piece of program.
- a derivation tree here is simply a derivation list.


An example of derivation:
$$
\cfrac{
  \cfrac{}{
    \texttt{ if true then false else true } 
    \rightarrow
    \texttt{false}
  } 
  E_{IfTrue}
}{
  \begin{array}{l}
  \texttt{
    if (if true then false else true) then false else true 
  }  \rightarrow\\

  \texttt{
    if false then false else true 
  } 
  \end{array}
}
E_{If}
$$


Plus rules
$$
\cfrac{
  n1 [[+]] n2 = n
}{
  n1 + n2 \rightarrow n
}\quad E_{PlusRed}
$$
- Red stands for reduction

$$
\cfrac{t1 \rightarrow t1'}{
  t1 + t2 \rightarrow t1' + t2
}\quad E_{Plus1}
$$
- Notice that we have taken explicit control over the order of 
  evaluation: always left term first

$$
\cfrac{t2 \rightarrow t2'}{
  v1 + t2 \rightarrow v1 + t2'
}\quad E_{Plus2}
$$

- notice that we didn't enforce the type of $v1$ since, we only enforce the
requirement at the moment of addition (aka $E_{PlusRed}$). This is nice since
the operands can be different types and it is useful to put constraints only
when it is absolutely needed.

#### Some terminology related to small-step semantics

A term $t$ is called a *normal form* if there does not exist a $t'$ such that
$t \rightarrow t'$.
- example: `true`
- in general, we will arrange it such that values are normal forms

There are  normal forms that are not values.
- example: `true + 5`

A normal form that is not a value is called a *stuck* expression
- run-time type error

Stuck expression can be arbitrarily large.
- That means you cannot take a step to get a smaller program
- `(true) + 5` is stuck
- `if (true + 5) then 0 else 1` is stuck
- `if (if (true + 5) then 0 else 1) then 0 else 1` is stuck

Define a second judgement that is simply reflexive, transitive closure of the
$\rightarrow$ relation. "Multi-step relation" notated as $t\rightarrow^* t'$.

$$
\cfrac{}{t \rightarrow^* t} \quad M_{Refl}
$$

$$
\cfrac{t \rightarrow t'}{t\rightarrow^* t'} \quad M_{Step}
$$

$$
\cfrac{t \rightarrow^* t''\quad t'' \rightarrow^*t'}{t\rightarrow^* t'} \quad M_{Transitive}
$$

Now we can derive the execution of the entire program using this relation in
a single tree just as in big-step semantics.

Definition: a term is *eventually stuck* if $t \rightarrow^* t'$ and $t'$ is
stuck.

`(true + 5)` is eventually stuck 
- in general, all stuck expressions are also eventually stuck.

Example of eventually stuck:
`if true then (5 + true) else 0`
- note that this expression is not stuck. We can still take a step to reduce it to `5 + true`
  - `if true then (5 + true) else 0` $\rightarrow$ `5 + true`
- note that `if (5 + true) then 1 else 0` is stuck tho. Since we cannot take
an step to reduce it

What is this in a real programming language?
- a bad program
- a program that will eventually crash
 
### Practicing Proof

Define the $falseCount$ of a term $t$ as follows:
- $falseCount(true) = 0$
- $falseCount(false) = 1$
- $falseCount(\text{if t1 then t2 else t3}) = 
    falseCount(t1) + falseCount(t2) + falseCount(t3)$

We are given a lemma $FC_{Nonneg}$: for all $t$, $falseCount(t) \geq 0$.

Theorem: If $t \longrightarrow t'$, then $falseCount(t') \leq falseCount(t)$.


Proof: we perform a structural induction on $t$. 
- induction hypothesis: For all subterm $t'$ of $t$, if $t' \rightarrow t''$, $falseCount(t'') \leq falseCount(t')$

We can do case analysis on root node term $t$. An alternative, when we are
given a derivation ($t\rightarrow t'$), is to do case analysis on the rules.

Case analysis on the root rule in the derivation of $t\rightarrow t'$:

- Case $E_{IfTrue}$: Then $t = \texttt{if true then t2 else t3 }$ and $t' =
t2$.
  - By definition of $falseCount(t)= falseCount(t2) + falseCount(t3)$. 
  - By $FC_{Nonneg}$, $falseCount(t2) \geq 0$ and $falseCount(t3) \geq 0$.
  - Therefore, $falseCount(t2) + falseCount(t3) \geq falseCount(t2)$
- Case $E_{IfFalse}$, same idea as above
- Case $E_{If}$, Then $t=\texttt{if t1 then t2 else t3}$ and $t'=\texttt{if t1' then t2 else t3}$ and $t1\rightarrow t1'$.
  - By IH, $falseCount(t1') \leq falseCount(t1)$
  - Therefore, $falseCount(t1') + falseCount(t2) + falseCount(t3) \leq falseCount(t1) + falseCount(t2) + falseCount(t3)$.
  - THen, the result follows from the definition of $falseCount$.

If we were to perform a case analysis, we also have to cover cases where term
is `true` and we need to say that there is no derivation possible by deriving
a contradiction, very annoying.

Note: this theorem does not hold when we add integer into the language. Since
we can derive `false` from `0 > 1`.

Exercise: proving lemma $FC_{Nonneg}$:
- By structural induction on $t$. 
- IH: for all $t'$ which is a subterm of $t$, $falseCount(t') \geq 0$
- Case $t=true$, $falseCount(t) = 0 \geq 0$
- Case $t=false$, $falseCount(t) = 1 \geq 0$
- Case $t=\texttt{if t1 then t2 else t3}$
  - By IH, $falseCount(t1) \geq 0$,$falseCount(t2) \geq 0$, $falseCount(t3) \geq 0$ 
  - By def of $falseCount$, $falseCount(t) \geq 0$


Now that we have the proof, we name it lemma $FC_{Step}$.
Next, we derive the theorem for multi-step.


Theorem: if $t \rightarrow^* t'$, then $falseCount(t') \leq falseCount(t)$. 

Proof: By structural induction on $t$, 
- IH: If $t0 \rightarrow^* t0'$, where $t0$ is a subterm of $t$, then $falseCount(t0') \leq falseCount(t0)$.
- Case analysis on the root rule in the derivation of $t \rightarrow^* t'$ 
  - Case $M_{Refl}$: Then $t=t'$, then $falseCount(t') = falseCount(t) \leq falseCount(t)$.
  - Case $M_{Step}$, Then $t\rightarrow t'$, By $FC_{Step}$, $falseCount(t') \leq falseCount(t)$.
  - Case $M_{transitive}$, then $t\rightarrow^* t''$ and $t'' \rightarrow^* t'$.
    - $\textbf{WE ARE STUCK}$

We cannot use our induction hypothesis here. There is no valid subterm
relationship. There is no subterm we can grab for the transitive
relationship.

Solution: we don't do structural induction on $t$. Instead we do a induction
on the derivation tree.

We restart our proof. First, rewrite the theorem such that our derivation is
given a name.

Theorem: If $d: t\rightarrow^* t'$, then $falseCount(t') \leq falseCount(t)$.

Proof: By structural induction on $d$, which is the derivation of $t \rightarrow^* t'$

- IH: If $d_0: t_0 \rightarrow t_0'$, **where $d_0$ is a subderivation of $d$**,
then $falseCount(t_0')\leq falseCount(t_0)$.
- Case analysis on the root rule in the derivation of $t \rightarrow^* t'$:
  - Case $M_{Refl}$: Then $t=t'$, then $falseCount(t') = falseCount(t) \leq falseCount(t)$.
  - Case $M_{Step}$: Then $t\rightarrow t'$, By $FC_{Step}$, $falseCount(t') \leq falseCount(t)$.
  - Case $M_{Transitive}$: Then $d_1: t\rightarrow^* t''$ and $d_2: t''\rightarrow^* t'$.
    - By IH on $d_1$, $falseCount(t'') \leq falseCount(t)$
    - By IH on $d_2$, $falseCount(t') \leq falseCount(t'')$
    - Therefore, result follows by transitivity. 

We can do this since derivation tree is a **tree**. It is recursively defined
so we can perform structural induction as well.

> Take home: we can apply this type of induction on the $FC_{Step}$

Theorem: If $d: t \rightarrow^* t'$ and $t \neq t'$, then there exists a $t''$
such that $t\rightarrow t''$ and $t'' \rightarrow^* t'$.

Proof: by structural induction on $d$.
- IH: If $d_0: t_0 \rightarrow^* t_0'$ and $t_0 \neq t_0'$ and $d_0$ is a subderivation of $d$, then there exists a $t_0''$
such that $t_0\rightarrow t_0''$ and $t_0'' \rightarrow^* t_0'$.
- Case analysis on the root rule in the derivation of $t \rightarrow^* t'$:
  - Case $M_{Refl}$: Then $t = t'$. This is a contradiction. This case is not part of the theorem. 
  - Case $M_{Step}$: Then $t \rightarrow t'$
    - by $M_{Refl}$, $t' \rightarrow^* t'$
    - Therefore, $t\rightarrow t'$ and $t' \rightarrow^* t'$
  - Case $M_{Transitive}$: Then $d_1: t\rightarrow^* t_0$ and $d_2: t_0\rightarrow^* t'$.
    - Case analysis on the relationship between $t$ and $t_0$: 
    - > This case analysis is to satisfy IH condition $t \neq t'$. So that we mathematically satisfies the IH. 
      - Case $t \neq t_0$:
        - By IH on $d_1$, $t\rightarrow t_n$ and $t_n \rightarrow^* t_0$.
        - Therefore, $t\rightarrow t_n$ and $t_n \rightarrow^* t_0$ and $t_0 \rightarrow^* t'$
        - By $M_{Transitive}$, $t\rightarrow t_n$ and $t_n \rightarrow^* t'$.
        - result follows $t'' = t_0$.
      - Case $t = t_0$:
        - Case analysis on the relationship between $t_0$ and $t'$:
          - Case $t_0 \neq t'$: By IH, there exists $t_n$ such that $t_0 \rightarrow t_n$  and $t_n \rightarrow^* t'$. Since $t=t_0$, the result follows with $t'' = t_n$.
          - Case $t_0 = t'$. Then $t = t'$. Contradiction.

Wow, a deeply nested structural induction. We have 3 levels of case analysis
nested inside each other. 

## Static Type System

> textbook: Chapter 8

Goal: Get rid of type error at compile time.

Previously, we have big-step, small-step and multi-step semantics judgement
form. We need a new judgement form. 

To build a type system, we assign each expression a type. 

```
T ::= Bool | Int
```

The new typing judgement of the form $t: T$, which means "term $t$ has type $T$.

$$
\cfrac{}{
    b: Bool
}
\quad {T_{Bool}}
$$

$$
\cfrac{}{
    n: Int 
}
\quad {T_{Int}}
$$

$$
\cfrac{
    t1: Int \quad t2: Int
}{
    t1 + t2: Int
}
\quad {T_{Plus}}
$$

> Note that we don't have value evaluation here. But we have type assignment.

We can build derivation tree from these rules again.

$$
\cfrac{
    \cfrac{}{1: Int} T_{Int}\quad \cfrac{}{2: Int}T_{Int}
}{
    1 + 2: Int
}\quad T_{Plus}
$$

We can have derivation that doesn't work. 

$$
\cfrac{
    \cfrac{}{1: Int} T_{Int}\quad \cfrac{\bf ERR!}{false: Int}T_{Int}
}{
    1 + false: Int
}\quad T_{Plus}
$$

Rule for Greater

$$
\cfrac{
    t1: Int \quad t2: Int
}{
    t1 > t2: Bool
}
\quad {T_{Greater}}
$$

Rule for If

$$
\cfrac{
    t1: Bool\quad
    t2: T\quad
    t3: T 
}{
    \texttt{if t1 then t2 else t3}: T
} \quad {T_{If}}
$$

- we are forcing the true branch and false branch to have the same type 
- figuring out eventually stuck expression is undecidable. A sound type
system always be conservative and rule out program that technically run fine.
   ```ocaml
   if true then 0 else false
   ```
   This will evaluate to 0. But OCaml will prevent it from even running.

> What if we want `if true then 0 else false` to pass the type check?
> We can add If-True rule.
> 
> $$
> \cfrac{
>     t2: T
> }{
>     \texttt{if true then t2 else t3}: T
> }\quad {T_{IfTrue}}
> $$
> 
> However, this rule is very limited since it requires the if to have
> syntactically have `true` as condition. Oh Bad.
> 
> We also cannot statically know what the condition will be, even we introduce
> a `true` or `false` type. So we like forcing if statement to have the same type.
> 

__Example: Build a type derivation tree__

for `if 3 > 2 then 0 else 1+2` build a derivation tree.

$$
\cfrac{
    \cfrac{
        \cfrac{}{3: Int}T_{Int} \quad \cfrac{}{2: Int}T_{Int}
    }{3 > 2: Bool} T_{Greater}
    \quad
    \cfrac{}{0: Int} T_{Int}
    \quad
    \cfrac{
        \cfrac{}{1: Int} T_{Int} \cfrac{}{2: Int} T_{Int}
    }{1+2: Int}T_{Plus}
}{
    \texttt{if 3 > 2 then 0 else 1+2}: Int
}\quad  T_{If}
$$

### Type Soundness

How to we prove that our type system has eliminated type error before runtime? 

> "Well-typed programs don't go wrong" (Milner)

Our goal: Well-typed programs are not eventually stuck.

Theorem (Type Soundness)

- attempt 1: If $t : T$, then either $t$ is a value or exists $t'$ s.t. $t \rightarrow^* t'$.
  - this is not what we want. According to multi-step semantics. Any stuck expression multi-step to itself.
- attempt 2: If $t : T$, then either $t$ is a value or exists $t'$ s.t. $t \rightarrow t'$.
  - Not good enough. We can take a step but it doesn't mean we are not eventually stuck.
- attempt 3: If $t : T$, then there exists a value $v$ such that $t\rightarrow^* v$.
  - what if program contains infinite loop. That means that we need to solve the halting problem in runtime.
- attempt 4
  - $t$ is eventually stuck if $t \rightarrow^* t'$ and $t'$ is stuck.
  - $t$ is stuck means there does not exist $t'$ s.t. $t \rightarrow t'$.
  - $t$ is not eventually stuck if for all $t'$ s.t. $t \rightarrow^* t'$, $t'$ is not stuck:
    - Either $t'$ is a value or exists $t''$ that $t'\rightarrow t''$.

Theorem (type soundness): if $t: T$ and $t \rightarrow^* t'$, either $t'$ is a value or there exists $t''$ s.t. $t' \rightarrow t''$.
- we allow infinite execution in this form.
- big-step semantics does not allow us infinite execution.

How do we prove this? 

#### Progress + Preservation 

Progress and Preservation implies Type Soundness.

Lemma (Progress): "well typed terms are not stuck".
- If $t : T$, then either $t$ is a value or exists $t'$ s.t. $t \rightarrow t'$.

Lemma (Type Preservation): "stepping preserves well-typedness"
- If $t: T$ and $t \rightarrow t'$, then $t' : T$.

This is actually stronger than the original version. It implies that
- the expression that we step to is well-typed 
- the expression that we step to has the same type as before

while the original does not. Let's prove them! 

Lemma (Progress): 
If $d: (t : T)$, then either $t$ is a value or exists $t'$ s.t. $t \rightarrow t'$.

Proof:  by structural induction on t. 
- IH: If $t_0 : T_0$ and $t_0$ is a subterm of $t$, then either $t_0$ is a value or exists $t_0'$ s.t. $t_0 \rightarrow t_0'$.
- Case analysis on the root rule in the derivation $d$:
  - Case $T_{Int}$: Then $t=n$ and $T=Int$. So $t$ is a value. 
  - Case $T_{Plus}$: Then $t=t1+t2$, $t1: Int$ and $t2: Int$. 
    - By IH, either $t1$ is a value or exists $t1'$ s.t. $t1\rightarrow t1'$.
    - By IH, either $t2$ is a value or exists $t2'$ s.t. $t2\rightarrow t2'$.
    - Case analysis on the possibilities of $t1$ and $t2$
      - Case $t1$ is a value and $t2$ is a value:
      - > we need a lemma here that says a value of type Int is a number.
        - Since $t1: Int$ and $t2: Int$, by Canonical Forms for Int, $t1 = n1$ and $t2 = n2$. Therefore by $E_{PlusRed}$, $t1 + t2 \rightarrow n$, where $n = n1 [[+]] n2$. 
      - Case $t1 \rightarrow t1'$ and $t2 \rightarrow t2'$:
        - Then $t1 + t2 \rightarrow t1' + t2$ by $E_{Plus1}$
      - Case $t1 \rightarrow t1'$ and $t2$ is a value:
        - Then $t1 + t2 \rightarrow t1' + t2$ by $E_{Plus1}$
      - Case $t1$ is a value and $t2 \rightarrow t2'$:
        - Then $t1 + t2 \rightarrow t1 + t2'$ by $E_{Plus2}$
    - ...

Lemma (Canonical Forms for Int): If $v: Int$, then $v$ is a number $n$.
- we can prove this by case analysis on the rules without induction. 

Alternatively, we can also do structural induction on $d$.
- IH: If $d_0: (t_0 : T_0)$ and __$d_0$ is a subderivation of $d$__, then either $t_0$ is a value or exists $t_0'$ s.t. $t_0 \rightarrow t_0'$.
In turing complete language, we cannot use structural induction on subterms. We want to focus on structural induction on derivation.

We are going to redo our Progress proof from last time. 


Lemma (Progress): 
If $d: (t : T)$, then either $t$ is a value or exists $t'$ s.t. $t \rightarrow t'$.

We have 2 canonical forms that we can use:
- Lemma (Canonical Forms, Bool): If $v:Bool$, then $v$ is a boolean value $b$. 
- Lemma (Canonical Forms, Int): If $v:Int$, then $v$ is a integer value $n$. 

Proof: By induction on derivation $d$.
- IH: If $d_0:(t_0:T_0)$, where $d_0$ is a subderivation of $d$, then either $t_0$ is a value or exists $t_0'$ such that $t_0\rightarrow t_0'$.
- Case analysis on the root rule of $d$:
  - Case $T_{Bool}$: Then $t=b$ and $T=Bool$. Then $t$ is value.
  - Case $T_{If}$: Then $t=\texttt{if t1 then t2 else t3}$ and $t_1:Bool$ and
  $t_2:T$ and $t_3:T$.
    - (i propose to use case analysis on $t_1$ but it goes into infinite regress)
    - By IH, $t_1$ is a value or exists $t_1'$ such that $t_1\rightarrow t_1'$.
    - Case analysis on these cases. 
      - Case $t_1$ is a value:
        - By Canonical Forms, Bool, either $t_1=true$ or $t_1=false$
        - If former, $t$ steps by $E_{IfTrue}$ otherwise by $E_{IfFalse}$
      - Case $t_1\rightarrow t_1'$:
        - By $E_{If}$, $t$ steps to $\texttt{if t1' then t2 else t3}$
  - Case $T_{Int}$: Then $t=n$ and $T=Int$. Then $t$ is a value. 
  - Case $T_{Plus}$: Then $t_1:Int$ and $t_2:Int$. 
    - By IH, $t_1$ is either a value or $t_1\rightarrow t_1'$ (we can apply IH since $t_1:Bool$ is a subderivation of $t:Bool$).
    - By IH, $t_2$ is either a value or $t_2\rightarrow t_2'$.
    - Case analysis on these cases:
      - Case $t_1$ is a value and $t_2$ is a value. 
        - By Canonical form, Int, $t_1$ is an integer value $n_1$ and $t_2$ is an integer value $n_2$. By $E_{PlusRed}$, $t$ steps.
      - Case $t_1$ is a value and $t_2\rightarrow t_2'$. 
        - By $E_{Plus2}$, $t$ steps.
      - Case $t_1\rightarrow t_1'$ and $t_2$ is a value. 
        - By $E_{Plus1}$, $t$ steps.
      - Case $t_1\rightarrow t_1'$ and $t_2\rightarrow t_2'$. 
        - By $E_{Plus1}$, $t$ steps.
  - (Other cases left as an exercise to the reader)

Note: a type system that rejects all program also satisfies type soundness,
since $t:T$ is never true, so the statement is true.

Now we focus on Preservation. 

Lemma (Type Preservation): 
If $d: (t: T)$ and $t \rightarrow t'$, then $t' : T$.

Proof: By induction on derivation $d$.
- IH: 
If $d_0: (t_0: T_0)$, where $d_0$ is a subderivation of $d$, and $t_0 \rightarrow t_0'$, then $t_0' : T_0$.
- Case $T_{Bool}$: Then $t=b$. Since $t$ is a value, it cannot step.
- Case $T_{If}$: Then $t=\texttt{if t1 then t2 else t3}$, $t_1:Bool$,
  $t_2:T$, $t_3:T$.
  - case analysis on derivation $t\rightarrow t'$:
    - Case $E_{If}$: $t \rightarrow \texttt{if t1' then t2 else t3}$.
      - By IH, $t1': Bool$
      - By $T_{If}$, $t':T$
    - Case $E_{True}$: $t\rightarrow t_2$: $t_2:T$
    - Case $E_{False}$: $t\rightarrow t_3$: $t_3:T$

## Lambda Calculus 

An informal semantics for a function call:
- `(function x -> x + x) 4` $\rightarrow$ `4+4` $\rightarrow$ `8`
- `(function x -> (function y -> x + y)) 4` $\rightarrow$
   `(function y -> 4 + y)`
- `((function x -> (function y -> x + y)) 4) 3` $\rightarrow$  
  `(function y -> 4 + y) 3` $\rightarrow$ `4 + 3` $\rightarrow$ `7`


### untyped lambda calculus (chapter 5)
```ocaml
t ::= x | (function x -> t) | t t
x ::= variable names
```

- `t t` is a function call. 
- this small language is turing complete.
- $\lambda x.t$ is the original syntax in lambda calculus for `(function x -> t)`.

Some languages:
- `t` is the body of `(function x -> t)`
- `x` is *bound* within the body of `(function x -> t)`
- `a` variable that occurs in `t` but is not bound in `t` is called a *free* variable

small-step operational semantics for the lambda calculus
```ocaml
v ::= (function x -> t)
```

Computation rule:

$$
\cfrac{}{\texttt{(function x -> t) t'}\rightarrow t[x\mapsto t']}
\quad E_{AppBeta}
$$
- "$\mapsto$" is the substitution operation that sub $x$ with $t'$.
- $E_{AppBeta}$ is also referred to the beta reduction
- $t[x\mapsto t']$ substitutes $t'$ for all *free* occurrences of $x$ in $t$
  - e.g. `(function x -> (function x -> x)) 5` 
    $\rightarrow$ `(function x -> x)` 
  - aka. variable scoping 


This language so powerful that it can define infinite loop.

#### Omega term
```ocaml
(function x -> x x) (function x -> x x)
```

Notice that this expression steps to itself. 

### Congruence rule

Where do we look for the next piece of work to do?
- Describe the order of evaluation. 
- we go with call by value since that's the most common
  - call-by-value semantics: call the leftmost function whose argument is a
  value

let `id` be shorthand for the identity function: `(function x -> x)`.

```
((id (id id)) (id id))
```
- which evaluation is called first? (the first `(id id)` by call-by-value)

#### Call-by-value

Call the leftmost function whose argument is a value.

$$
\cfrac{
t_1 \rightarrow t_1'
}{t_1\ t_2 \rightarrow t_1'\ t_2} \quad E_{App1}
$$

$$
\cfrac{
t_2 \rightarrow t_2'
}{v_1\ t_2 \rightarrow v_1\ t_2'} \quad E_{App2}
$$

According to these rules, we derive the tree for the example:

$$
\cfrac{
  \cfrac{
    \cfrac{}{
      (id\ id) \rightarrow id
    }  
    E_{AppBeta}
  }{
    (id\ (id\ id)) \rightarrow 
    (id\ id)
  }
  \quad E_{App2}
}{
  ((id\ (id\ id))\ (id\ id)) \rightarrow
  ((id\ id)\ (id\ id))
} \quad E_{App1}
$$

$$
  ((id\ (id\ id))\ (id\ id)) \rightarrow
  ((id\ id)\ (id\ id)) \rightarrow
  (id\ (id\ id)) \rightarrow
  (id\ id) \rightarrow
  id
$$

Now we have fully defined the language. It is turing complete!

> Note: some evaluation strategy will terminate while some other don't. Let's consider this program:
> ```
> (function x -> id) omega
> ```
> where `omega` is the infinite loop expression we defined above. 
> - In a call-by-value semantics, we are required to evaluate `omega` 
> first into a value, meaning it will run forever. 
> - In lazy evaluation, we don't evaluate argument until you need them. So, this program evaluate to just `id`

> Note: for any 2 strategies that terminates, both will end up with the same value.


Examples of stuff that we can do with lambda calculus. Church came out we all
of these. So we call them church boolean, church integers, etc. We try doing
that in ocaml.

#### Church Booleans

But first, we take a detour to datatype
```ocaml
(* detour: booleans as a datatype *)
type mybool = True | False

let myand b1 b2 = 
  match b1 with 
    True -> b2 
  | False -> False

```

How do we define boolean in lambda calculus?

```ocaml
let ctrue = function t -> function f -> t
let cfalse = function t -> function f -> f

let cand b1 b2 = b1 b2 cfalse;;
```

Yes, that's it! That's how `cand` runs. If `b1` is true, calling on `b1` will return `b2`, whatever value it is. If `b1` is false, calling on `b1` will return `cfalse`, regardless of `b2`! Genius!

#### Church numerals 

Note that `nat` stands for natural numbers. Yes, no negative here.
Again, first we start with data type.

```ocaml
type mynat =  
  Zero 
| Succ of mynat

let rec mynat n1 n2 = 
  match n1 with 
    Zero -> n2
  | Succ n1' -> Succ (myplus n1' n2)
```

We defined a recursive plus, not efficient but it works. 

```ocaml
let czero = function z -> function s -> z
let cOne = function z -> function s -> (s z)
let cTwo = function z -> function s -> s (s z)
```
- `z` is the zero, and `s` is successor. Now we see how it knows what number it is.

```ocaml
let cplus n1 n2 = 
  (function z -> function s -> n1 (n2 z s) s)
```

How do we think of this? Well, we can treat the first argument `z` in any
number as the number to start counting from, and `s` is how much we count up
in each step. Calling `cplus` means create a new number that starts counting
from `n2`, but we use the same count up of `s`. To make it truly correct 
`n1 + n2`, we have to force `n2` to start from zero therefore we pass it the `z`
and the fixed step up `s`.


Another way to think about it is from a type perspective. Assume we have some
magic type `Z`. (not valid ocaml btw)
```ocaml
let czero = function z:Z -> function s:Z->Z -> z:Z
```

Therefore, we have to call `n1` with a type `Z` and `Z->Z`

### Simply-Typed Lambda Calculus

What is the error we are trying to catch? 
What are the stuck expressions?

- We get stuck when trying to evaluate a variable that was never defined
(i.e., a free variable).
  - `x` is stuck
  - `(x x)` is stuck 
  - `(function x -> x) x` is stuck (the rightmost `x` is free)

Again we start with the grammar, this time with a type.

```ocaml
t ::= x | (function x -> t) | t t
v ::= (function x -> t)

T ::= T -> T | Unit
(* an input type and an output type. *)
(* Unit is a base type, otherwise it is infinite recursion *)
```

#### Typecheck variable

$$
\cfrac{

}{
x:??
} \quad T_{Var}
$$

How do we typecheck a variable? What do we look for stuff? In a real
programming languages, the types of arguments or variables are declared by
the user.

We define a type environment:
> a *type environment* is a finite mapping from variable names in scope to their types   
>  We use the symbol $\Gamma$.

Type judgment now has the form $\Gamma \vdash t: T$.
- "term $t$ has type $T$ in the context type environment $\Gamma$"

To type check a variable, we do a look up in the type env.

$$
\cfrac{
  G(x) = T
}{
  \Gamma\vdash x: T
}\quad T_{Var}
$$

#### Typecheck function 

$$
\cfrac{
\Gamma,x:T_1 \vdash t: T_2
}{ 
\Gamma\vdash function\ x \rightarrow t: T_1 \rightarrow T_2
}\quad T_{Fun}
$$
- $\Gamma,x:T_1$ means add/overwrite the type of $x$ in $\Gamma$ with $T_1$.

This means if we can guess the type of `x` to be $T_1$. If it type checks it
is fine. In reality, we have to try all possible types to find one that
works. However, in real programming languages, we make the user declare the
type of `x`.


To make our life easier, we add type declaration to our grammar.

```ocaml
t ::= x | (function x:T -> t) | t t
v ::= (function x:T -> t)

T ::= T -> T | Unit
```

The rule becomes

$$
\cfrac{
\Gamma,x:T_1 \vdash t: T_2
}{ 
\Gamma\vdash function\ x:T_1 \rightarrow t: T_1 \rightarrow T_2
}\quad T_{Fun}
$$

#### Typecheck function call

$$
\cfrac{
  \Gamma\vdash t_1:T_2 \rightarrow T \quad
  \Gamma\vdash t_2:T_2
}{
  \Gamma\vdash t_1\ t_2: T
}\quad T_{App}
$$

Let's type check `czero`.


$$
\cfrac{
  \cfrac{
    \cfrac{
      \cfrac{}{\Gamma\vdash s:Unit\rightarrow Unit} \quad T_{Var}
      \quad
      \cfrac{}{\Gamma\vdash z:Unit}\quad T_{Var}
    }{
    \Gamma
    \vdash \texttt{(s z)}: Unit
    }
    \quad T_{App}
  }{
    z:Unit\vdash \texttt{function (s:Unit -> Unit) -> (s z)} :
    (Unit \rightarrow Unit) \rightarrow Unit
  } \quad T_{Fun}
}{

  \{\} \vdash \texttt{function z:Unit -> function (s:Unit -> Unit) -> (s z)}:

  Unit\rightarrow (Unit \rightarrow Unit) \rightarrow Unit
}\quad T_{Fun}

$$
- abbreviate $z:Unit, s:Unit\rightarrow Unit$ as $\Gamma$ 

Modular typechecking: typecheck a function once and safely call it multiple
times.
- formalize this with a *type substitution* lemma: typing is preserved by substitution.

Theorem (Type Substitution): 
If $\Gamma,x:T_1\vdash t:T_2$ and $\Gamma \vdash v:T_1$, 
then $G\vdash t[x \mapsto v]:T_2$

We forgot to define substitution($\mapsto$). Here we define substitution
$t[x\mapsto v]$ formally. We assume that $v$ has no free variables. 

- $x[x\mapsto v] = v$.
- $x'[x\mapsto v] = x'$, where $x'\neq x$.
- `(function x -> t)`$[x\mapsto v]=$ `function(x -> t)` (`x` is bound).
- `(function x' -> t)`$[x\mapsto v]=$ `function(x' -> t`$[x\mapsto v]$`)` 
  where $x'\neq x$.
- `(t1 t2)`$[x\mapsto v]=$ `(t1`$[x\mapsto v]$ `t2`$[x\mapsto v]$`)`.


Note: if we slap the type system into the language. Our language is no longer
turing complete. It is terminates. (since type is finite) We need to
introduce primitive of recursion.


## Logic and typechecking

Notice $T_{App}$ is a simple logic that is known for a long time since
Aristotle.

$$
\cfrac{
  \Gamma\vdash t_1:T_2 \rightarrow T \quad
  \Gamma\vdash t_2:T_2
}{
  \Gamma\vdash t_1\ t_2: T
}\quad T_{App}
$$

If we treat our function type as an implication, i.e. $T_2\rightarrow T$, 
this is means that 

$$
\cfrac{P\Rightarrow Q \quad P}{Q}
$$

If we know $P$ implies $Q$ and we know $P$, we know $Q$.

### Curry-Howard Isomorphism

Types are also theorems. Programs are also proofs of theorem (proof objects
or proof witnesses). 

"natural deduction"

For each logical connective, you have an "introduction rule", which says how
to prove facts of that form, and an "elimination rule", which says how to use
facts of that form.

- Introduction rule
$$
\cfrac{
    G, P \vdash Q
}{
    G \vdash P \implies Q
} 
\quad 
Implication_{Intro}
$$

- elimination rule
$$
\cfrac{
    G \vdash P \implies Q\quad
    G \vdash P
}{
    G \vdash Q
} 
\quad 
Implication_{Elim}
$$

- assumption
$$
\cfrac{P \text{ in } Q}{G\vdash P} 
\quad Assumption
$$

The simply-typed calculus is a *constructive* propositional logic. 
- every proof comes with an explicit proof object that witnesses the proof

A proposition $P$ is valid if and only if there exists a term $t$ such that $\{\}\vdash t:P$.

Let's suppose we have an infinite number of uninterpreted type constants 
$A,B,C,...$

Example:

$$
\{\} \vdash {\tt (function\ x:P \rightarrow x)} : P \rightarrow P
$$

Note if we introduce base types like booleans or integers into the lambda
calculus, the proof system breaks down and does not follow strict logic.

- Can you write a program in simply-typed lambda calculus that has type $P\rightarrow P$?
  - yes: `(function x:P -> x)`
- What about type $P\rightarrow Q$? 
  - no 
- What about type $P\rightarrow(Q\rightarrow P)$? 
  eqiv. to $P \rightarrow Q \rightarrow P$
  - Yes: `(function x:P -> function y:Q -> x)`
- What about type $(P \rightarrow Q \rightarrow R) \rightarrow (Q \rightarrow P \rightarrow R)$?
  - Yes: 
   ```ocaml
   function f:(P->Q->R) -> function q:Q -> function p:P -> f p q
   ```

### Logical Conjunction in type system

We add an "and" into our type system.
This is really just adding a tuple to our system.

```ocaml
T ::= ... | T ∧ T
t ::= ... | (t, t) | fst t | snd t
```

$$
\cfrac{
  \Gamma\vdash t_1: T_1 \quad \Gamma\vdash t_2: T_2
}{
  \Gamma\vdash (t_1, t_2): T_1 \land T_2
} \quad And_{Intro}
$$

$$
\cfrac{
  \Gamma\vdash t: T_1 \land T_2
}{
  \Gamma\vdash \texttt{fst t}: T_1 
} \quad And_{Elim1}
$$

$$
\cfrac{
  \Gamma\vdash t: T_1 \land T_2
}{
  \Gamma\vdash \texttt{snd t}: T_2 
} \quad And_{Elim2}
$$

That means we can derive data structure from logic.

Example: commutativity of logical conjunction
$$
(P\land Q) \rightarrow (Q\land P)
$$

Find a program that has that type:
- ans: `(function x: (P ∧ Q) -> (snd x, fst x))`
- in ocaml with help of type inference: `function x -> (snd x, fst x)`

Now we define the operational semantics. First, we have to notice new values. Now we can have tuples as value as well.

```ocaml
v ::= (function x:T -> t) | (v, v)
```

**On-Exam** Exercise: write a small-step operational semantics for tuple.

$$
\cfrac{
  t_1 \rightarrow t_1'
}{
  (t_1, t_2) \rightarrow (t_1', t_2)
} \quad E_{Pair1}
$$

$$
\cfrac{
  t_2 \rightarrow t_2'
}{
  (v_1, t_2) \rightarrow (v_1, t_2')
} \quad E_{Pair2}
$$

Notice that we do not have computational rule for tuple to construct a tuple
(unlike function or whatever). This is because tuple is already a value.

$$
\cfrac{
  t \rightarrow t'
}{
  \texttt{fst }t \rightarrow \texttt{fst }t'
} \quad E_{Fst}
$$

$$
\cfrac{}{
  \texttt{fst }(v_1, v_2) \rightarrow v_1
} \quad E_{FstRed}
$$
- we need both elements to be value because if second element has side effect we want to carry it out, so we evaluate second element until it is a value.

$$
\cfrac{
  t\rightarrow t'
}{
  \texttt{snd }t \rightarrow \texttt{snd }t'
} \quad E_{Snd}
$$

$$
\cfrac{}{
  \texttt{snd }(v_1, v_2) \rightarrow v_2
} \quad E_{SndRed}
$$

### Interlude: Midterm next Wednesday (one week from today)
- no class on wednesday
- online exam (probably on gradescope)
- 24 hours window to take the exam
- but only 1 hour and 50 minutes once you start
- 2 hours total, including scanning and uploading
- open note, open book


### Logical Disjunction 

In ocaml, we know that type unions are disjunction.
```ocaml
type intorbool = I of int | B of bool;;
```
We need the tag `I` and `B` are for a type safe way to use unions.

```ocaml
T ::= ... | T ∨ T
```

The logical rules are

$$
\cfrac{
\Gamma\vdash t_1:T_1
}{\Gamma \vdash {\tt left}\ t_1: T_1 \lor T_2} 
\quad Or_{Intro1}
$$
- notice that $T_2$ is unknown 
- the rule is not algorithmic, we have to guess what $T_2$ is
- in real programming languages, we know ahead what type `left` is 
- like in ocaml, we have to declare it upfront 
   ```ocaml
   type LeftOrRight = Left of a | Right of b;;
   ```

$$
\cfrac{
\Gamma\vdash t_2: T_2
}{\Gamma\vdash{\tt right}\ t_2: T_1 \lor T_2} 
\quad Or_{Intro2}
$$

$$
\cfrac{
  \Gamma \vdash t: T_1 \lor T_2\quad 
  \Gamma, x: T_1 \vdash t1: T\quad
  \Gamma, y: T_2 \vdash t2: T
}{
  \Gamma \vdash 
  \texttt{(match t with left x -> t1 | right y -> t2)} : T
}
\quad Or_{Elim}
$$

This is saying that if we can do something (getting $T$) assuming $T_1$ and
if we do something (getting $T$) assuming $T_2$. We can conclude that we can
for sure get something of type $T$ back.

To simplify this, we limit union size to only 2. We only use `left` and `right` as our constructor names.

```ocaml
t ::= ... | left t | right t 
    | (match t with left x -> t '|' right x -> t)
```

Example: commutativity of disjunction

Write a program whose type is $(P \lor Q) \rightarrow (Q\lor P)$

```ocaml
function u: (P ∨ Q) -> 
  match u with 
    left x -> right x
  | right y -> left y
```
The set of rules defines a relation and it can be many-to-many.
We are allowed to have 

$$
\cfrac{}{0:Bool}
$$

$$
\cfrac{}{0:Int}
$$

So 0 can have both types. In preservation theorem, we only need to prove it
preserves type as long as one of the possible type is the matching one.

In semantics, what if we have two paths to take? Then our language is
non-deterministic, which is completely okay! Since multi-threaded languages
are non-deterministic so to model that we would need many-to-many relation
even in semantics.

Back to pairs:

With pairs as primitive, we get multiple arguments and multiple returns for
free.

```ocaml
function x:(Int, Bool) -> x
(* returns a (Int, Bool) *)
```

Back to disjunction

Derivation for flipping disjunction from last time:

```ocaml
function u: (P ∨ Q) -> 
  match u with 
    left x -> right x
  | right y -> left y
```

$$
\cfrac{
  \cfrac{
    \cfrac{}{u:(P ∨ Q) \vdash u:(P ∨ Q)} T_{Var}
    \quad
    \cfrac{
      \cfrac{}{u:(P ∨ Q),x:P\vdash x:P} T_{Var}
    }{u:(P ∨ Q),x:P\vdash right\ x: Q ∨ P} T_{Or-Intro2}
    
  }{
    u: (P ∨ Q) \vdash \texttt{match u with ...}: Q ∨ P
  }
  Or_{Elim}
}{
  \{\} \vdash \texttt{P}
} T_{Fun}
$$


The tree is not complete since we are missing subtree for `right y` 
but do it yourself. 

Semantics for union type:

$$
\cfrac{
  t \rightarrow t'
}{\tt left\ t \rightarrow left\ t'}
E_{Left}
$$

$$
\cfrac{
  t \rightarrow t'
}{\tt right\ t \rightarrow right\ t'}
E_{Right}
$$

$$
\cfrac{
  t \rightarrow t'
}{
  \begin{array}{c}
    \texttt{match t with left x -> t1 `|' right x -> t2}\\
    \rightarrow\\
    \texttt{match t' with left x -> t1 `|' right x -> t2}\\
  \end{array}
} E_{Match}
$$

$$
\cfrac{}{
  \begin{array}{c}
    \texttt{match left v with left x -> t1 `|' right x -> t2}\\
    \rightarrow\\
    \tt t1[x\mapsto v]
  \end{array}
} E_{MatchLeft}
$$

$$
\cfrac{}{
  \begin{array}{c}
    \texttt{match right v with left x -> t1 `|' right x -> t2}\\
    \rightarrow\\
    \tt t2[x\mapsto v]
  \end{array}
} E_{MatchRight}
$$


### Type True

What if we introduce type `True`?

```ocaml
T ::= ... | True
```

What's the equivalent in real programming languages? 
In OCaml, it is `Unit`. Why is it useful? 
We want function that takes in no argument or without 
no return value. For uniformity, we use `Unit`.

$$
\cfrac{}{
  \Gamma \vdash (): True
} \quad True_{Intro}
$$
- note that `()` is the syntactic value of unit type
- write an example of function with type `(P->True)`
  ```ocaml
  (function x:P -> ()) : P -> True
  ```

What about `False`? 

$$
\cfrac{
  \Gamma\vdash t: False
}{
  \Gamma\vdash t: T
}\quad False_{Elim}
$$
- from false, we get everything


`~T` as the shorthand for `(T -> False)`

Example: `(~P ∧ (P ∨ Q)) -> Q`
```ocaml
(function x: (P -> False) ∧ (P ∨ Q) -> 
  match snd x with
    left p -> (fst x) p
  | right q -> q
)
```

Since from `(P -> False)` we can derive everything, in `left p` case we
extract `~P` with `fst` then passing `p` to it to produce `False`.

In real programming language, a non-terminating program is typed `False`, since we can assign any return type to a non-terminating function.

```ocaml
# let rec infLoop() = infLoop();;
val infLoop : unit -> 'a = <fun>
```

OCaml, type the return as `'a` meaning we can choose any type, it will pass
type checking but will run forever.


## Adding features

### Local Variables 
Currently, we have variables either through function or match case.
In OCaml, we can use `let` 

```ocaml
t ::= ... | let x=t in t
```

Local variables:

$$
\cfrac{
  t1 \rightarrow t1'
}{
  \texttt{let x=t1 in t2} \rightarrow \texttt{let x=t1' in t2}
} 
\quad
E_{Let}
$$

$$
\cfrac{}{
  \texttt{let x=v1 in t2} \rightarrow \texttt{t2[x$\mapsto$v1]}
} 
\quad
E_{LetRed}
$$ 

$$
\cfrac{
  \Gamma \vdash t1: T1 
  \quad
  \Gamma, x:T1 \vdash t2: T
}{
  \Gamma\vdash \texttt{let x=t1 in t2}: T
}
$$

Is this a syntactic sugar?

Is `let x=t1 in t2` equivalent to `(function x:T -> t2) t1`? 
- not quite, since we do not know the type of `x`, until we have typechecked

### Sequencing (side-effect)
```ocaml
t ::= ... | t;t
```

we don't have side-effect yet but it would be useful later.

$$
\cfrac{
  t1 \rightarrow t1'
}{
  t1;t2 \rightarrow t1';t2
}
\quad
E_{Seq}
$$

$$
\cfrac{}{
  ();t2 \rightarrow t2
}
\quad
E_{SeqRed}
$$

- We force any statement to evaluate to the `()`, the `True` type (our
representation of type Unit). So we indicate clearly we don't care about the
value.


$$
\cfrac{
  \Gamma\vdash t1: True 
  \quad
  \Gamma\vdash t2: T
}{
  \Gamma\vdash t1;t2:T
}
\quad 
T_{Seq}
$$

`t1;t2` is equivalent to `(function x:True -> t2) t1`.
Therefore, this is a syntactic sugar.

In Ocaml, `t1;t2` is syntactic sugar for `let _ = t1 in t2`.

### Recursion

```ocaml
t ::= ... | let rec x=v in t
```
- the difference between `let x=t1 in t2` and `let rec x=v in t2`
  is that `x` is not available in the scope of `t1` in the former while `x` is in scope in `v` for `rec`.
- by making the right hand side a value `v`, we make sure that it is a function instead of other terms so we don't get something like 
  ```ocaml
  let rec x = x + 1 in ...
  ```
- but why `v` not only `(function x:T -> t)`? It is more general since we can
define a pair of function, therefore it is mutually recursive.

$$
\cfrac{}{
  \texttt{let rec x=v1 in t2} \rightarrow 
  \texttt{let x = v1[x$\mapsto$let rec x=v1 in x] in t2}
}
\quad
E_{LetRec}
$$

This rules says we simply redefine the instance of variable name in the body
with an inline declaration of itself.

Example 

```ocaml
let rec fact = 
  function n -> if n=0 then 1 else n * fact(n-1) in fact 5

(* ---> *)

let fact = 
  function n -> if n=0 then 1 else 
    n * (let rec fact = function n -> ... fact)(n-1) in fact 5

(* ---> *)
(* reducing the let in *)

(function n -> ...) 5

(* ---> *)

if 5=0 then 1 else 
  5 * (let rec fact = function n -> ... in fact)(5-1)

(* --->* *)

5 * (let rec fact = function n -> ... in fact)(5-1)

(* --->* *)

5 * (function n -> if n=0 then 1 else n * (let rec fact = function n -> ... in fact)) (3)
```

Notice at the end, on the right hand side, the expression is back
to calling a fact function with a number. Hey, recursion!


Does this type check rule work?
$$
\cfrac{
  \Gamma\vdash v1: T1
  \quad
  \Gamma,x:T1\vdash t2: T
}{
  \Gamma\vdash \texttt{let rec x=v1 in t2}: T
}
$$

It does not! To type check `v1`, we need to add `x` into the scope 
of `v1`. Any instance of `x` in `v1` will make `v1` to do the typecheck,

$$
\cfrac{
  \Gamma,x:T1\vdash v1: T1
  \quad
  \Gamma,x:T1\vdash t2: T
}{
  \Gamma\vdash \texttt{let rec x=v1 in t2}: T
}
$$

Notice how this matches our comparison between `let in` and `let rec`,
since `x` is also in the scope of `v1`.

We guess the type of `x` and hope it works.
In real programming languages, we declare both the return and argument types:

```c
int fact(int n) {
  return n == 0 ? 1 : fact(n-1) * n;
}
```

OCaml figure this out by using type inference.

The book does so by defining a fix point. Go read the book. 

At this point, our language is turing complete

Example: infinite loop

```ocaml
let rec infiniteLoop = 
  (function x:True -> infiniteLoop x) in infiniteLoop ()
```

How do we type check this?

$$
\cfrac{

\begin{array}{c}
  {\tt infiniteLoop}: True \rightarrow Bool
  \vdash
  \\
  \texttt{function x:True -> infiniteLoop x}:
  True \rightarrow Bool
\end{array}
}{
  \{\} \vdash
\text{
  our infinite loop expression
}
}
$$

We guessed the typed to be $True\rightarrow Bool$. And the derivation tree is
actually valid. You can derive the whole derivation tree. Again from before,
we know that an infinite loop that does not terminate can return any type,
and `Bool` is one of any type.

Therefore, we can derive infinite number of types for `infiniteLoop`.

However, the logic system becomes unsound as soon as we have infinite loop.
Since infinite loop allows us to go from any thing to go to anything.

## Type Inference

Consider the simply-typed lambda calculus plus integers:

```ocaml
t ::= n | t + t | x | function x:T -> t | t t
T::= Int | T -> T
```

Type checking judgement is a ternary relation between type env $\Gamma$, term
$t$ and type $T$.

Typechecking problem: Given $\Gamma$ and $t$, does there exist a type $T$ such that $\Gamma\vdash t:T$? 

It was easy to type check function since the input is annotated with a type
`T`. However, in OCaml, we don't need to declare type for function since the
language infer this for us. How do we do typechecking in those cases?

We define the problem of type inference.

Define an "erased" version of our language:

```ocaml
s ::= n | s + s | x | function x -> s | s s
```

Define an "erase" function from `t` to `s`:
- `erase(n) = n` 
- `erase(t1 + t2) = erase(t1) + erase(t2)`
- `erase(x) = x`
- `erase(function x:T1 -> t) = function x -> erase(t)` 
- `erase(t1 t2) = erase(t1) erase(t2)`

Type inference problem: Given $\Gamma$ and $s$, does there exist a term $t$
and type $T$ such that $\Gamma\vdash t:T$ and `erase(t) = s`?

Example: Given $\Gamma=\{\}$ and $s=$`function x -> x + 1`, what is $t$? What is $T$?
- $t=$`function x:Int -> x + 1`
- $T=Int\rightarrow Int$

Type inference broken into 2 phases. 
1. constraints generation
2. constraints solving 

We introduce a new meta-variable for "types".

```ocaml
S ::= Int | S -> S | X
X ::= type variable
```

### Constraint Generation

How to turn typechecking rules into type inference rules?
1. whenever a typechecking rules would have to "guess" a type, instead we
create a fresh variable
2. our type inference rules will never fail
   - `1 + true` fails on type check
   - but there is a valid derivation in type inference 
   - produce a set of constraints that must be satisfied
   - later, if the constraints cannot be solved, we reject

Type inference judgement: ${\rm tinfer}(\Gamma, s)=(S, C)$
- in the book, $\Gamma\vdash s: S \mid C$
- $C$ is a set of _type equality_ constraints of the form $S_1=S_2$.

Type inference for Int

$$
\cfrac{
    {\rm fresh} X
}{
    {\rm tinfer}(\Gamma, n) = (X, \{ X = Int\})
}
\quad
I_{Num}
$$
- ${\rm fresh}X$ grabs a free type variable. Then, we impose constraint $X=Int$.


$$
\cfrac{
    {\rm tinfer}(\Gamma, s_1) = (S_1, C_1)
    \quad
    {\rm tinfer}(\Gamma, s_2) = (S_2, C_2)
    \quad
    {\rm fresh}X
}{
    {\rm tinfer}(\Gamma, s_1 + s_2) = (X, \{ X=Int, S_1=Int, S_2=Int\} \cup C_1 \cup C_2)
}
\quad
I_{Plus}
$$

Why does ${\rm tinfer}(\Gamma, s_1)$ returns a type variable $S_1$? 
- if we force it to have $Int$, then we don't have the type inference 
- example: `x+5`. We cannot resolve `x` to concrete type yet!


Example of type infer derivation: `1+2`

$$
\cfrac{
    \cfrac{}{
      {\rm tinfer}(1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
    \quad
    \cfrac{}{
      {\rm tinfer}(2) = (X_2, \{X_2 = Int\})
    }
    I_{Num}
}{
    {\rm tinfer}(1+2) = (X_3, \{
        X_1 = Int, X_2 = Int, X_3 = Int
    \}) 
}
\quad
I_{Plus}
$$
- assumption $\Gamma=\empty$ implicitly

One that has no solution: `1 + true`

$$
\cfrac{
    \cfrac{}{
      {\rm tinfer}(1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
    \quad
    \cfrac{}{
      {\rm tinfer}(true) = (X_2, \{X_2 = Bool\})
    }
    I_{Num}
}{
    {\rm tinfer}(1+true) = (X_3, \{
        X_1 = Int, X_2 = Int, X_2=Bool, X_3 = Int
    \}) 
}
\quad
I_{Plus}
$$

- $X_2=Int$ and $X_2=Bool$ is unsolvable

$$
\cfrac{
  \Gamma(x) = S
}{
  {\rm tinfer}(\Gamma, x) = (S, \{\})
}
\quad
I_{Var}
$$


$$
\cfrac{
  {\rm fresh}X
  \quad 
  {\rm tinfer}((\Gamma, x:X), s) = (S, C)
  \quad
  {\rm fresh}Y
}{
  {\rm tinfer}(\Gamma, \texttt{function x -> s}) = (Y, \{
    Y = X\rightarrow S
  \}\cup C)
}
\quad
I_{Function}
$$
- we use rule 1, guess the type for `x` by assigning a type variable $X$
- then, we put that into the type env

Example for type infer on function
$$
\cfrac{
  \cfrac{
    \cfrac{ }{
      {\rm tinfer}(x:X, x) = (X, \{\})
    }
    I_{Var}

    \cfrac{}{
      {\rm tinfer}(x:X, 1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
  }{
    {\rm tinfer}(x:X, x+1) = (X_2, \{X_1 = Int, X_2=Int, X=Int\})
  } I_{Plus}
}{
  \begin{array}{ll}
  & {\rm tinfer}(\{\}, \texttt{function x -> x + 1})  \\
  =&(X_3, \{X_3=X\rightarrow X_2, X_2=Int, X=Int, X_1=Int\})
  \end{array}
}
\quad
I_{Function}
$$

- notice the benefit of not eagerly requiring `x` to have $Int$ in the $I_{Plus}$ check!

$$
\cfrac{
  {\rm tinfer}(\Gamma, s_1) = (S_1, C_1)
  \quad
  {\rm tinfer}(\Gamma, s_2) = (S_2, C_2)
  \quad
  {\rm fresh}X
}{
  {\rm tinfer}(\Gamma, s_1\ s_2) = (X, \{
    S_1 = S_2 \rightarrow X
  \}\cup C_1 \cup C_2)
} 
\quad 
I_{App}
$$

Example: `function f -> f 0`

$$
\cfrac{
  \cfrac{
    \cfrac{}{
      {\rm tinfer}(\{f:F\},f) = (F, \{\})
    }
    I_{Var}
    \quad
    \cfrac{}{
      {\rm tinfer}(\{f:F\}, 0) = (X, \{ X = Int\})
    }
    I_{Num} 
  }{
    {\rm tinfer}(\{f: F\}, \texttt{f 0}) = (Y, \{
      F = X \rightarrow Y, X = Int
      \})
  }
  \quad
  I_{App}
}{
  {\rm tinfer}(\{\},\texttt{function f -> f 0}) 
  = (Z, \{
    Z = F \rightarrow Y,
    F = X \rightarrow Y,
    X = Int
    \})
}
\quad
I_{Function}
$$

A _substitution_ $\sigma$ is a mapping from type variable to types.
- A substitution $\sigma$ satisfies $C=\{S_1 = S_1',...,S_n=S_n'\}$ if $\sigma(S_i)$ is syntactically equal to $\sigma(S_i')$ for all $i$.


What is the substitution solution to `function f -> f 0`?
$$
\{
  X: Int, 
  Y: Bool,
  F: Int \rightarrow Bool,
  Z: (Int \rightarrow Bool) \rightarrow Bool
\}
$$
- notice that we can choose any type for $Y$. Here we just choose $Bool$


#### Correctness of Constraint Generation 

Intuitively we want to prove that the constraints we generate capture _only_
and _all_ of the possible typings for a program.

- Soundness of Constraint Generation
  - If ${\rm tinfer}(\{\}, s) = (S, C)$ and $\sigma$ satisfies $C$, then there exists term $t$ such that `erase(t) = s` and $\{\}\vdash t:\sigma(S)$

- Completeness of Constraint Generation 
  - If $\{\}\vdash t:T$ and `s=erase(t)`,   
     then ${\rm tinfer}(\{\}, s) = (S, C)$ and there exists a $\sigma$ such that   
     $\sigma$ satisfies $C$ and $\sigma(S) = T$

We will not be proving them. 

### Constraints Solving
How do we solve constraints? 
- we can plug them into Prolog. Consider  $\{
    Z = F \rightarrow Y,
    F = X \rightarrow Y,
    X = Int
    \})$

  ```prolog
  Z=arrow(F, Y), F=arrow(X, Y), X=int.
  ```

  gives the solution
  ```prolog
  Z=arrow(arrow(int, Y), Y)
  X=int
  F=arrow(int, Y)
  ```
- OCaml type inference system does something similar 

We will explore constraint solving next time.

Type inference broken into 2 phases. 
1. constraints generation
2. constraints solving 

We introduce a new meta-variable for "types".

```ocaml
S ::= Int | S -> S | X
X ::= type variable
```

### Constraint Generation

How to turn typechecking rules into type inference rules?
1. whenever a typechecking rules would have to "guess" a type, instead we
create a fresh variable
2. our type inference rules will never fail
   - `1 + true` fails on type check
   - but there is a valid derivation in type inference 
   - produce a set of constraints that must be satisfied
   - later, if the constraints cannot be solved, we reject

Type inference judgement: ${\rm tinfer}(\Gamma, s)=(S, C)$
- in the book, $\Gamma\vdash s: S \mid C$
- $C$ is a set of _type equality_ constraints of the form $S_1=S_2$.

Type inference for Int

$$
\cfrac{
    {\rm fresh} X
}{
    {\rm tinfer}(\Gamma, n) = (X, \{ X = Int\})
}
\quad
I_{Num}
$$
- ${\rm fresh}X$ grabs a free type variable. Then, we impose constraint $X=Int$.


$$
\cfrac{
    {\rm tinfer}(\Gamma, s_1) = (S_1, C_1)
    \quad
    {\rm tinfer}(\Gamma, s_2) = (S_2, C_2)
    \quad
    {\rm fresh}X
}{
    {\rm tinfer}(\Gamma, s_1 + s_2) = (X, \{ X=Int, S_1=Int, S_2=Int\} \cup C_1 \cup C_2)
}
\quad
I_{Plus}
$$

Why does ${\rm tinfer}(\Gamma, s_1)$ returns a type variable $S_1$? 
- if we force it to have $Int$, then we don't have the type inference 
- example: `x+5`. We cannot resolve `x` to concrete type yet!


Example of type infer derivation: `1+2`

$$
\cfrac{
    \cfrac{}{
      {\rm tinfer}(1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
    \quad
    \cfrac{}{
      {\rm tinfer}(2) = (X_2, \{X_2 = Int\})
    }
    I_{Num}
}{
    {\rm tinfer}(1+2) = (X_3, \{
        X_1 = Int, X_2 = Int, X_3 = Int
    \}) 
}
\quad
I_{Plus}
$$
- assumption $\Gamma=\empty$ implicitly

One that has no solution: `1 + true`

$$
\cfrac{
    \cfrac{}{
      {\rm tinfer}(1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
    \quad
    \cfrac{}{
      {\rm tinfer}(true) = (X_2, \{X_2 = Bool\})
    }
    I_{Num}
}{
    {\rm tinfer}(1+true) = (X_3, \{
        X_1 = Int, X_2 = Int, X_2=Bool, X_3 = Int
    \}) 
}
\quad
I_{Plus}
$$

- $X_2=Int$ and $X_2=Bool$ is unsolvable

$$
\cfrac{
  \Gamma(x) = S
}{
  {\rm tinfer}(\Gamma, x) = (S, \{\})
}
\quad
I_{Var}
$$


$$
\cfrac{
  {\rm fresh}X
  \quad 
  {\rm tinfer}((\Gamma, x:X), s) = (S, C)
  \quad
  {\rm fresh}Y
}{
  {\rm tinfer}(\Gamma, \texttt{function x -> s}) = (Y, \{
    Y = X\rightarrow S
  \}\cup C)
}
\quad
I_{Function}
$$
- we use rule 1, guess the type for `x` by assigning a type variable $X$
- then, we put that into the type env

Example for type infer on function
$$
\cfrac{
  \cfrac{
    \cfrac{ }{
      {\rm tinfer}(x:X, x) = (X, \{\})
    }
    I_{Var}

    \cfrac{}{
      {\rm tinfer}(x:X, 1) = (X_1, \{X_1 = Int\})
    }
    I_{Num}
  }{
    {\rm tinfer}(x:X, x+1) = (X_2, \{X_1 = Int, X_2=Int, X=Int\})
  } I_{Plus}
}{
  \begin{array}{ll}
  & {\rm tinfer}(\{\}, \texttt{function x -> x + 1})  \\
  =&(X_3, \{X_3=X\rightarrow X_2, X_2=Int, X=Int, X_1=Int\})
  \end{array}
}
\quad
I_{Function}
$$

- notice the benefit of not eagerly requiring `x` to have $Int$ in the $I_{Plus}$ check!

$$
\cfrac{
  {\rm tinfer}(\Gamma, s_1) = (S_1, C_1)
  \quad
  {\rm tinfer}(\Gamma, s_2) = (S_2, C_2)
  \quad
  {\rm fresh}X
}{
  {\rm tinfer}(\Gamma, s_1\ s_2) = (X, \{
    S_1 = S_2 \rightarrow X
  \}\cup C_1 \cup C_2)
} 
\quad 
I_{App}
$$

Example: `function f -> f 0`

$$
\cfrac{
  \cfrac{
    \cfrac{}{
      {\rm tinfer}(\{f:F\},f) = (F, \{\})
    }
    I_{Var}
    \quad
    \cfrac{}{
      {\rm tinfer}(\{f:F\}, 0) = (X, \{ X = Int\})
    }
    I_{Num} 
  }{
    {\rm tinfer}(\{f: F\}, \texttt{f 0}) = (Y, \{
      F = X \rightarrow Y, X = Int
      \})
  }
  \quad
  I_{App}
}{
  {\rm tinfer}(\{\},\texttt{function f -> f 0}) 
  = (Z, \{
    Z = F \rightarrow Y,
    F = X \rightarrow Y,
    X = Int
    \})
}
\quad
I_{Function}
$$

A _substitution_ $\sigma$ is a mapping from type variable to types.
- A substitution $\sigma$ satisfies $C=\{S_1 = S_1',...,S_n=S_n'\}$ if $\sigma(S_i)$ is syntactically equal to $\sigma(S_i')$ for all $i$.


What is the substitution solution to `function f -> f 0`?
$$
\{
  X: Int, 
  Y: Bool,
  F: Int \rightarrow Bool,
  Z: (Int \rightarrow Bool) \rightarrow Bool
\}
$$
- notice that we can choose any type for $Y$. Here we just choose $Bool$


#### Correctness of Constraint Generation 

Intuitively we want to prove that the constraints we generate capture _only_
and _all_ of the possible typings for a program.

- Soundness of Constraint Generation
  - If ${\rm tinfer}(\{\}, s) = (S, C)$ and $\sigma$ satisfies $C$, then there exists term $t$ such that `erase(t) = s` and $\{\}\vdash t:\sigma(S)$

- Completeness of Constraint Generation 
  - If $\{\}\vdash t:T$ and `s=erase(t)`,   
     then ${\rm tinfer}(\{\}, s) = (S, C)$ and there exists a $\sigma$ such that   
     $\sigma$ satisfies $C$ and $\sigma(S) = T$

We will not be proving them. 

### Constraints Solving
How do we solve constraints? 
- we can plug them into Prolog. Consider  $\{
    Z = F \rightarrow Y,
    F = X \rightarrow Y,
    X = Int
    \})$

  ```prolog
  Z=arrow(F, Y), F=arrow(X, Y), X=int.
  ```

  gives the solution
  ```prolog
  Z=arrow(arrow(int, Y), Y)
  X=int
  F=arrow(int, Y)
  ```
- OCaml type inference system does something similar 

We will explore constraint solving next time.
## Parametric Polymorphism

Example:
```ocaml
function x -> x;;
```
This function has type `'a -> 'a`

$$
\text{tinfer}(\{\}, \texttt{function x -> x}) 
= (Y, \{Y = X\rightarrow X\})
$$

The least constraining solution is to don't assign `X` to any type.


This does not work however if we consider the example
```ocaml
let id = function x -> x 
    in (id 32, id true)
```

This is not gonna pass inference. By $I_{App}$ with constraint `id` as type
`int -> int` on `id 32`, but constraint `id` as type `bool -> bool` on `id
true`. This creates a unsatisfiable set of constraint.

In our notation, this doesn't really work. How does OCaml do it? When OCaml
sees that a polymorphic function call, it creates a set of constraint under a
fresh variable, meaning the constraint applies to each call uniquely.

This is called let-polymorphism.

OCaml only supports parametric polymorphism for let-bound variables. It's not
sound to treat other variables as polymorphic.

```ocaml
(function id -> (id 32, id true)) : ('a -> 'a) -> (int * bool)
```

If we assign the above function with the above type, we can call this function
and crash it in runtime.

When user call this function, user gets to choose `'a`. It can take in a concrete type like `int -> int` and crash the program.

Another way of seeing this is because anything in `bound` we have the concrete
implementation and can see it as polymorphic. We cannot make the same
assumption in a parameter that is not bound to implementation until it is call.

Parametric polymorphism also exists in Java.

```java
class Identity<T> {
    T id (T x) { return x; }
}
```

The motivation of adding generics in Java is for data structure. We want type
safe data structure. Without polymorphism, we can only have data structure that
stores objects. We have to downcast and it is not type safe.

In OCaml, we can create our own polymorphic data structure.

```ocaml
type 'a mylist = Empty | Node of 'a * 'a mylist
```

### Polymorphic Lambda Calculus (System F, Second-Order Lambda Calculus)

The grammars 
```ocaml
t ::= ... | function x:T -> t | function X -> t | t [T]
v ::= ... | function X -> t
T ::= Unit | Int | Bool | T -> T | X 
    | ...(all the tuples and stuff) 
    | forall X.T
```

New type `forall X.T` Example:
- identity function should have the type `forall X.X->X`

We also have a function that takes a type!
Identity function in polymorphic lambda calculus:

```ocaml
(function X -> function x:X -> x)
```
It has type `forall X. X -> X`. To call it

```ocaml
let id = (function X -> function x:X -> x) in 
    id [Bool] true
```

#### Example: swap

In OCaml, we can write 
```ocaml
let swap = function p -> (snd p, fst p) in
    swap (34, true)
```

Write this program in polymorphic lambda.

```ocaml
let swap = function X -> 
           function Y -> 
           function p:(X ∧ Y) -> (snd p, fst p) in 
    swap [Int] [Bool] (34, true)
```

The type for `swap` is `forall X. forall Y. (X ∧ Y) -> (Y ∧ X)`.

Now we go back to the bad example of `function id -> (id 34, id true)`. Now we
can make it valid. 

```ocaml
let notSoBad = function id:forall X.X->X -> 
    (id [Int] 34, id [Bool] true)
```

This works because user don't get to decide the concrete type. 
The implementation decides it!

Now we can typecheck self-application.
```ocaml
function x:forall X.X->X -> (x [forall X.X->X] x)
```

This function is now `forall X.X->X -> forall X.X->X`.
Same reason why `id [forall X. X->X] id` type checks.

The type inference for this language is undecidable.  That's why OCaml only
stick to let polymorphism to make type inference decidable.


#### Operational semantics for polymorphic lambda

$$
\cfrac{
  t\rightarrow t'
}{
  t\ [T] \rightarrow t'\ [T]
} 
\quad
E_{TApp}
$$

$$
\cfrac{}{
  \texttt{(function X -> t) [T]}  \rightarrow t[X\mapsto T]
}
\quad
E_{TAppRed}
$$

Example: `(function X -> function x:X -> x) [Int] 34`
- steps to `(function x:Int -> x) 34`
- steps to 34


#### Typecheck for polymorphic lambda

$$
\cfrac{
  \Gamma,X \vdash t: T
}{
  \Gamma\vdash \texttt{function X -> t} : \text{forall } X.T
}
\quad
T_{TFun}
$$

We put $X$ into $\Gamma$ to keep track of the type variables which will use later.

Example: typechecking id
$$
\cfrac{

  \cfrac{

    \cfrac{}{
      X,x:X \vdash x:X
    }
    \quad 
    T_{Var}
  }{
    X\vdash \texttt{function x:X -> x}: X\rightarrow X
  }
  \quad 
  T_{Fun}
}{
  \{\}\vdash \texttt{function X -> function x:X -> x}: \text{forall } X.X\rightarrow X
}
\quad
T_{TFun}
$$

$$
\cfrac{
  \Gamma \vdash t: \text{forall } X.T
}{
  \Gamma \vdash t\ [T_0]: T[X\mapsto T_0]
}
\quad
T_{TApp}
$$


Example: `function id:forall X.X->X -> id [Int] 34`

$$
\cfrac{
  \cfrac{
    \cfrac{
      \cfrac{}{
        \Gamma \vdash 
        id:\text{forall }X.X\rightarrow X
      }
      T_{Var}
    }{
      \Gamma \vdash 
      \texttt{id [Int]}: Int \rightarrow Int
    }
    T_{TApp}
    \quad
    \cfrac{}{
      \Gamma \vdash 
      34:Int
    } 
    T_{Num}
  }{
    id:\text{forall }X.X\rightarrow X \vdash 
    \texttt{id [Int] 34} : Int
  }
  T_{App}
}{
  \{\}\vdash \texttt{function id:forall X.X->X -> id [Int] 34}:
  (\text{forall }X.X\rightarrow X)\rightarrow Int
}
T_{Fun}
$$


Why is this "second-order"? 
- First-order logic: forall x.P(x)
- Second-order logic: forall X.P(X)

We skipped over first-order logic. Second order logic is more natural in
programming languages.

Example: the identity function is a witness of a theorem of forall X. X-> X or $X\rightarrow X, \forall X$

### Existential quantification
Existential typing is a core of information hiding.

Consider a counter class in Java:
```java
class Counter {
  private int c = 0;
  public void inc() { c++; }
  public void reset() { c = 0; }
  public void get() { return c; }
}
```

We hide the information of implementation using `private` field. 

We implement something like this in OCaml as a tuple of functions. 

```ocaml
let counter = (
  (function () -> 0),
  (function x -> x + 1), (* takes a counter and increment it *)
  (function x -> 0), 
  (function x -> x)
)
```

These are typed as 
```
(Unit -> int)
(int -> int)
('a -> int)
('b -> 'b)
```

We are not hiding the representation as `int`. 
To hide the representation, we give this tuple of functions the following types:

```ocaml
exists X. (Unit -> X, X -> X, X -> X, X -> Int)
```

Now the client does not know what `X` is. 

## Proof assistant

- Proof assistant is a programming environment where you can also prove
  properties about your code.
- functional programming language called Gallina 
  - define functions and define datatypes 
  - both powerful, much more expressive than what we can do in OCaml


#### Defining boolean

In OCaml, 
```ocaml
type bool = True | False
```

In Gallina,

```coq
Inductive bool : Type :=
  true : bool
| false : bool.
```

#### Defining negate 

In OCaml,

```ocaml
let negate b = match b with 
  true -> false
| false -> true
```

In Gallina, 
```coq
Definition negate (b:bool) := 
  match b with
    true => false
  | false => true
  end.
```

#### Running computation:
```coq
Computer (negate (negate true)).
```

#### Writing a lemma 

```coq
Lemma doubleNegation:
  forall b, negate(negate b) = b.
```

#### Proofing the lemma 

```coq
Lemma doubleNegation:
  forall b, negate(negate b) = b.
Proof.
  intros. destruct b.
  - unfold negate. reflexivity.
  - unfold negate. reflexivity.
Qed.
```
- `intros` is the assumptions that we make. We type of the variables will be inferred from the type system.
- `destruct` is the tactic of proof, which is case analysis
- `unfold` means we unfold the definition of `negate` in the proof 
- `reflexivity`: when we unfold `negate`, we get `true` equals `true`. We explicitly use the lemma of `reflexivity` such that `true = true` is a true theorem. 
- we have 2 sub case `true` and `false` so we repeat `unfold` twice. In Proof mode, we know what are the subcases. They should be in the order that they show up in the type def. 
  

#### Defining list

In OCaml,

```ocaml
type boollist = nil | cons of bool * boollist
```

In Gallina, 
```coq
Inductive boollist: Type :=
  nil : boollist
| cons : bool -> boolllist -> boollist.
```

We write the def of `cons` as a constructor function, we have 2 arguments: a
boolean and a list of bools and the result.

#### Defining Recursion

```coq
Fixpoint append (l1 l2 : boollist) := 
  match l1 with
    nil => l2
  | cons b l1' => cons b (append l1' l2)
```

Now we need induction since we have recursion.

#### Proof by Induction

```coq
Lemma appendToNil: forall l, (append l nil) = l.
Proof.
  intros. induction l as [|b l']. 
  - simpl. reflexivity.
  - simpl. rewrite IHl'. reflexivity.
Qed.
```
- `induction l` means we are carrying induction
- `as [|b l']` is the naming of variables within the sub cases. Kind of like `match`. each sub case is separated by a bar `|`.
- `simpl.` means execute and simplify. The first case is where `l` is `nil` so we get `nil`. So reflexivity can be applied
- the second sub case (`cons b l'`)is where induction happens
  - `simpl` applies def of `append` and simplify it 
  - then we have an induction hypothesis on `l'`, which is 
    ```coq
    append l' nil = l'
    ```
    we apply this IH by `rewrite IHl'` which finds all terms in the proof with the LHS and rewrite it with the RHS
  - Lastly we apply reflexivity.


We can also extract the proof as OCaml code as well. 

```coq
Require Coq.extraction.Extraction.
Extraction Language OCaml.

Extraction append.
```

#### Parametric polymorphism

```coq
Definition id (T: Type) (x:T) := x.
```

This is the function of identity. The type is 
```
forall T: Type, T -> T
```

_Type functions_ are also supported, functions that takes in type and output of
type. This gives us polymorphic types.

```coq
Module PolyList.

Inductive list (T:Type) : Type :=
  nil : list T
| cons : T -> list T -> list T.
End PolyList.
```

This is a polymorphic list. We can do integer list, boolean list, whatever
list.

We have functions that 
- values -> values
- types -> values (polymorphic functions)
- types to types (polymorphic types)

We are missing values -> types. This is called _dependent types_.

For our convenience, we define the natural number as a type.
```coq
Inductive nat : Type :=
  zero : nat
| succ : nat -> nat.

Fixpoint plus(n1 n2 : nat) : nat :=
  match n1 with
    zero => n2
  | succ n1' => succ (plus n1' n2)
```

Let's say we want to have a boolean list that keep tracks of its size statically.

```coq
Module ListsWithLength.

  Inductive boollist : nat -> Type :=
    nil : boollist zero
  | cons : forall n, bool -> boollist n -> boollist (succ n).

End ListsWithLength.
```

To use this. 
```coq
Check (cons (succ zero) false nil).
```

See how we need to pass 1 (`succ zero`), which is the length of the list
`[false]`. 

Note that this is first order logic since `cons` is `forall n, bool`

#### Defining Pairs

```coq
Module Pairs.

Inductive prod (A B : Type): Type := 
  pair : A -> B -> prod A B. 

End Pairs.
```

To build a pair: `pair nat bool zero true`.

This is built into Gallina. Check with `Print prod.` 
However, there is something similar to this.
```coq
Print and.
```
`and` takes in `Prop` instead of `Type`. We have proposition.

```coq
Lemma andIsCommutative : forall P Q, and P Q -> and Q P.
Proof.
  intros. inversion H. split.
  - assumption.
  - assumption.
Qed.
```
- `intros` gets us `H = and P Q`. 
- `inversion H` create two variables in the inverse order. 
- `split` separate them into the subcase of `Q` and `P` in this order because we applied inversion
- then for each subcase, we check `Q`/`P` is true. By checking our `assumption`, we know that they are true

Another way of writing this

```coq
Definition andIsCommutative2 (P Q : Prop) (H : and P Q) :=
  match H with
    conj HP HQ => conj HQ HP
  end.
```
This is building a program that is a proof witness.

#### Dependent Proposition 

We had dependent types. Do we have dependent proposition? Yes, they are
inference rules. 

Let's have inference rule for even numbers.

$$
\cfrac{}{
  isEven\ zero
}
\quad 
IsEven-Zero
$$

$$
\cfrac{
  isEven\ n
}{
  isEven\ (succ(succ\ n))
}
\quad
IsEven-SuccSucc
$$

To express this,
```coq
Inductive isEven : nat -> Prop :=
    IsEvenZero : isEven zero
  | IsEvenSuccSucc : forall n, is Even n -> isEven (succ (succ n)).
```

We proof by constructing a derivation tree:

```coq
Definition fourIsEven :=
  IsEvenSuccSucc (succ (succ zero)) (IsEvenSuccSucc zero IsEvenZero).
```

We can also use proof tactics.
```coq
Lemma fourIsEven2 : isEven (succ (succ (succ (succ zero)))).
Proof.
  apply IsEvenSuccSucc. apply IsEvenSuccSucc. apply IsEvenZero.
Qed.
```
### Proofs of 231 in Coq

We express the language of boolean from Chapter 3

```coq
Inductive term : Type := 
  t_unit : term (* the Unit type *)
| t_true : term
| t_false : term
| t_if : term -> term -> term -> term.
```

We can define a simple program `if true then false else true` as such 

```coq
t_if t_true t_false t_true.
```

Now we define the data types. 

```coq
Inductive ty : Type :=
  Unit : ty
| Bool : ty
```

#### Typechecking 
Now we define some typechecking rules. We define them as dependent proposition.

```coq
Inductive typeof : term -> ty -> Prop := 
| T_True : typeof t_true Bool
| T_False : typeof t_false Bool
| T_Unit : typeof t_unit Unit
| T_If : forall t1 t2 t3 T, typeof t1 Bool -> typeof t2 T -> typeof t3 T -> typeof (t_if t1 t2 t3) T.
```

We can define simplifying notation in Coq.

```coq
Notation "t : T" := (typeof t T) (at level 40).
```
- level 40 means the precedence of our new notation.

To derive a derivation tree for `simpleProgram`:

```coq
Definition typeOfSimpleProgram : (typeof simpleProgram Bool) := 
  T_If t_true t_false t_true Bool T_True T_False T_True.
```
- `t_true t_false t_true Bool` is for `forall t1 t2 t3 T`
- then we give it a derivation tree for `t1` with `T_True`
- then we give it a derivation tree for `t2` with `T_False`
- then we give it a derivation tree for `t3` with `T_True`

We can enforce in teh grammar that an expression has to be well typed. 

```coq
Module WellTypedExprs.

Inductive term : ty -> Type :=
  t_unit : term Unit
| t_true : term Bool
| t_false : term Bool
| t_if : forall T, term Bool -> term T -> term T -> term T.

End WellTypedExprs.
```
In the original definition of `term`, we can define a bad program such as `if () then false else true` 
```coq
Definition badProgram := t_if t_unit t_false t_true.
```

But under the new rule it is no longer valid.

#### Small-step operational semantics

First we define what is a value.
```coq
Inductive isValue : term -> Prop := 
  UnitVal : isValue t_unit
| TrueVal : isValue t_true
| FalseVal : isValue t_false
```

Define a step relation as a relation between a term and a term:
```coq
Inductive step : term -> term -> Prop :=
  E_IfTrue : forall t2 t3, step (t_if t_true t2 t3) t2
| E_IfFalse : forall t2 t3, step (t_if t_false t2 t3) t3
| E_If : forall t1 t2 t3 t1', step t1 t1' -> step (t_if t1 t2 t3) (t_if t1' t2 t3)
```

Exercise: extending `and` to the language

Given a new term for `and` 
```coq
Inductive term : Type :=
  (* ... *)
| t_and : term -> term -> term
```

Give a typing rule under `typeof`.

The solution

```coq
Inductive typeof : term -> ty -> Prop := 
  (* ... *)
  T_And : forall t1 t2, typeof t1 Bool -> typeof t2 Bool -> typeof (t_and t1 t2) Bool.
```

Give a small-step semantics under `step`.

The solution
```coq
Inductive step : term -> term -> Prop := 
  (* ... *)
| E_And1 : forall t1 t2 t1', step t1 t1' -> step (t_and t1 t2) (t_and t1' t2)
(* the rest left as exercise to the reader *)
```

#### Proving Progress and Preservation

Notation for stepping 

```coq
Notation "t1 '-->' t2" := (step t1 t2) (at level 40).
```

```coq
Theorem progress: forall t T, t : T -> isValue t \/ exists t', t --> t'.
Proof.
intros. induction H.
- left. apply TrueVal.
- left. apply FalseVal.
- left. apply UnitVal.
- right. inversion IHtypeof1.
  * apply (canonicalFormsBool t1 H2) in H. inversion H.
    + exists t2. rewrite H3. apply E_IfTrue. 
    + exists t3. rewrite H3. apply E_IfFalse. 
  * inversion H2. exists (t_if x t2 t3). apply E_if. assumption. 
Qed.
```
- `t : T` is from our defined notation 
- `intros` gives us 
  - `t` is a term
  - `T` is a `ty` aka type
  - `H: (t: T)`  is our hypothesis and it is our derivation tree
- by `induction H`, we break `H` into all cases.
  - 1st case is for `t_true`, so we appeal to `TrueVal` to the `left` condition, which is `isValue t`.
  - 2nd and 3rd case are similar
  - by deriving from the first 3 cases, we get induction hypothesis as extra premises. 
  - in the 4th case, if should step, so `right`. 
  - `IHtypeof1` is induction hypothesis where `t1` can type. 
    - if `t1` is value of type bool, then it has to be `t_true` or `t_false`, but we need the canonical forms for bools. we pause the proof. go and write a lemma before this
      - now 


```coq
Lemma canonicalFormsBool: forall t, isValue t -> t: Bool -> t = t_true \/ t = t_false.
Proof. 
intros. inversion H. 
- rewrite <- H1 in H0. inversion H0. 
- left. reflexivity.
- right. reflexivity.
```
- first case is `t_unit`, `H1: t_unit = t` and `H0: t:Bool`, then we write `H1` in `H0`, then it becomes `H0: t_unit : Bool`, but this is a contradiction. We call `inversion H0`. then this is proven

Proof for preservation

```coq
Theorem preservation: forall t t' T, t : T -> t --> t' -> t' : T.
Proof.
intros. generalize dependent t'. induction H.
- (* T-True *) intros. inversion H0.
- (* T-False *) intros. inversion H0.
- (* T-Unit *) intros. inversion H0.
- (* T-If *) intros. inversion H2. 
  * (* E-IfTrue *) rewrite <- H3. assumption. 
  * (* E-IfFalse *) rewrite <- H3. assumption. 
  * (* E-If *) apply T_If. 
    + (* t1' is Bool *) apply IHtypeof1. assumption.
    + assumption.
    + assumption. 
Qed.
```
- we leave `t'` as universally quantified using `generalize dependent t'` 
- first 3 cases are contradiction, `H2` is applied.

> Note about `rewrite` 
> - In `rewrite H`, `H` has to be an equality (`A=B`), and it rewrites `A` in the goal with `B`
> - In `rewrite <- H`, `H` has to be an equality (`A=B`) and it rewrites `B` in the goal with `A`
> - In `rewrite <- H1 in H2`, is like `rewrite <- H` but instead of rewriting in the goal but it rewrites in the given hypothesis `H2`
 
## Mutable References 
- book chapter 13 

In OCaml, 
- local variables are always immutable 
- all mutable memory is on the heap
  
In C, `int` and `int*` are both mutable In OCaml, `int*` is represented by the
type `int ref`. `int ref` is mutable but `int` is not.  This means mutability
is explicitly encoded in the type. 

```ocaml
(* create a reference *)
ref 0;;

ref (2, "hello");;

ref (function x -> x + 1);;

ref (ref 0);;
```
- this creates a reference on the heap with some initial value

```ocaml
(* dereference *)
let r = ref 0;;
!r;;
```
- `!r` is the equivalent of `*r` in C

```ocaml
(* updating value *)
r := 53;;
```

```ocaml
(* aliasing *)
let x = ref 0;;
let y = x;;
```

Once we have reference, we don't need recursion anymore.

```ocaml
let factorial = ref (function x -> x + 1);;
factorial := 
  function x -> if x = 0 then 1 else x (!factorial)(x-1);;
let fact = !factorial;;
fact(5);;
```

Reference is really powerful.  We can define a cyclic list as well. 

```ocaml
type clist = Nil | Cons of int * clist ref;;

let lst = ref Nil;;
lst := Cons(4, lst);;
```

Object in references 

```ocaml
(* an integer counter object *)
let (get, inc, reset) = 
  let c = ref 0 in (
    (function() -> !c), 
    (function() -> c := !c + 1), 
    (function() -> c := 0)
  );;
  
(* make a constructor *)
let makeCounter () = 
  let c = ref 0 in (
    (function() -> !c), 
    (function() -> c := !c + 1), 
    (function() -> c := 0)
  );;

let counter1 = makeCounter();;
let (get1, inc1, reset1) = counter1;;

```

There is no null reference since all reference has to contain some value. The way to hack up null is union type.

```ocaml
type optionalInt = Null | I of int;;
```

This is available within the standard library. It is called `option`. 

### Typing rules

```ocaml
t := ... | ref t | !t | t := t
T := ... | Ref T
```

$$
\cfrac{
  \Gamma\vdash t:T
}{\Gamma \vdash \texttt{ref t}: \texttt{Ref }T}
\quad 
T_{Ref}
$$

$$
\cfrac{
  \Gamma\vdash t:\texttt{Ref } T
}{
  \Gamma\vdash\texttt{!t}: T
}
\quad
T_{Deref}
$$

$$
\cfrac{
  \Gamma\vdash t_1: \texttt{Ref }T \quad t_2: T
}{\Gamma\vdash t_1:=t_2: Unit}
T_{Assign}
$$

### Small-step semantics
What are the new value forms? 
Can we use `ref v` as a value form? No since there is aliasing. 

```ocaml
let r1 = ref 0 in 
let r2 = r1 in 
  (r1 := 4); !r2
```

`r2` copies `r1` and gets `ref 0` but we can't propagate the change in `r1 := 4` to `r2` in our given semantics.

To do this, we introduce new meta-variable

```
l ::= infinite set of memory locations
```

A *heap*/store is a mapping $\mu$ from memory location to their values. 


New judgement of the form $\lang t, \mu\rang\rightarrow\lang t',\mu'\rang$.

$$
\cfrac{
  \lang\texttt{t},\mu\rang
  \rightarrow
  \lang\texttt{t'},\mu'\rang
}{
  \lang\texttt{ref t},\mu\rang
  \rightarrow
  \lang\texttt{ref t'},\mu'\rang
}
\quad
E_{Ref}
$$

$$
\cfrac{
  l \text{ that is not in domain($\mu$)}
}{
  \lang\texttt{ref v},\mu\rang
  \rightarrow
  \lang\texttt{l},\mu[l\mapsto v]\rang
}
\quad
E_{RefLoc}
$$

$$
\cfrac{
  \lang\texttt{t},\mu\rang
  \rightarrow
  \lang\texttt{t'},\mu'\rang
}{
  \lang\texttt{!t}, \mu\rang
  \rightarrow
  \lang\texttt{!t'}, \mu'\rang
}
\quad
E_{Deref}
$$

$$
\cfrac{
  \mu(l) = v
}{
  \lang!l,\mu\rang
  \rightarrow
  \lang v,\mu\rang
}
\quad
E_{DeRefLoc}
$$

$$
\cfrac{
  \lang t_1,\mu\rang
  \rightarrow
  \lang t_1',\mu'\rang
}{
  \lang t_1:=t_2,\mu\rang
  \rightarrow
  \lang t_1':=t_2,\mu'\rang
}
\quad
E_{Assign1}
$$

$$
\cfrac{
  \lang t_2,\mu\rang
  \rightarrow
  \lang t_2',\mu'\rang
}{
  \lang v_1:=t_2,\mu\rang
  \rightarrow
  \lang v_1:=t_2',\mu'\rang
}
\quad
E_{Assign2}
$$

$$
\cfrac{
  l \text{ is in the domain($\mu$)}
}{
  \lang l:=v, \mu\rang
  \rightarrow
  \lang (), \mu[l\mapsto v]\rang
}
\quad
E_{AssignLoc}
$$

### Type Soundness with reference

Original type soundness: 
If $\{\}\vdash t:T$ and $t\rightarrow^* t'$, then either $t'$ is a value or there exists $t''$ such that $t'\rightarrow t''$.

New type soundness: 
If $\{\}\vdash t:T$ and $\lang t,\{\}\rang\rightarrow^* \lang t'\mu'\rang$, 
then either $t'$ is a value or there exists $t''$ and $\mu''$ such that $\lang t',\mu'\rang\rightarrow \lang t'', \mu''\rang$.

New Progress:

If $\{\}\vdash t:T$, then either $t$ is a value or there exists $t'$ and $\mu'$ such that $\lang t,\mu \rang\rightarrow \lang t',\mu'\rang$. 
- something is wrong about this, where is $\mu$ coming from?
- how do we guarantee that we don't do invalid reference! 


New Preservation: 

If $\{\}\vdash t:T$ and $\lang t,\mu \rang\rightarrow \lang t'\mu'\rang$, then $\{\}\vdash t': T$. 
### Typing rule of location

Problem: In our small step semantics, we introduce some intermediate of memory
location `l`. We can step to some term containing memory location. To prove
this in preservation/progress, we need typing rules for `l`. 

Example: preservation does not currently hold.

- $\{\}\vdash\texttt{ref 0}:\texttt{Ref }Int$
- and $\lang \texttt{ref 0}, \{\}\rang \rightarrow \lang l, \{(l, 0)\}\rang$ 
- but $l$ is not well-typed. 

$$
\cfrac{}{
  \Gamma\vdash l : ??
}
$$

We don't know what is the type of the thing we store in a memory location. We
introduce a new mapping that keeps track of types of the stuff we stored in
memory. 

Introduce a store typing $\Sigma$. The typing judgement is of the form
$\Gamma;\Sigma\vdash t:T$. Therefore, the typing rule for location is 

$$
\cfrac{
  \Sigma(l) = T
}{
  \Gamma;\Sigma \vdash l : \texttt{Ref }T
}
\quad
T_{Loc}
$$


Let's update Progress/Preservation to account for $\Sigma$:

- Progress: If $\{\};S\vdash t:T$, then either $t$ is a value or there exists $t'$ and $\mu'$ such that $\lang t,\mu\rang \rightarrow \lang t',\mu'\rang$.
- Preservation: If $\{\};S\vdash t:T$ and $\lang t,\mu\rang\rightarrow \lang t',\mu'\rang$, then $\{\};S\vdash t':T$.


But this is still incorrect, consider the following example.

```ocaml
!l
```

- $\{\};\{(l,Int)\}\vdash !l : Int$ but $\lang !l,\{\}\rang$ doesn't step.
  Contradiction to Progress. 
- $\{\};\{(l,Int)\}\vdash !l + 1: Int$, and $\lang
  !l+1,\{(l,true)\}\rang\rightarrow \lang true + 1, \{(l, true)\}\rang$ but
  $true + 1$ is not well-typed. Contradiction to Preservation


Problem: there is no connection between $\Sigma$ and $\mu$. 

We introduce a new relationship. 

Definition (Heap typing): We say $\Sigma$ and $\mu$ are consistent (denoted $\Sigma\vdash\mu$) if: 
- $domain(\Sigma)=domain(\mu)$ 
- $\forall l \in domain(\Sigma), \{\};\Sigma\vdash \mu(l) : \Sigma(l)$

Now update Progress/Preservation:

- Progress: If $\{\};\Sigma\vdash t:T$ and $\Sigma\vdash\mu$, then either $t$ is a
  value or there exists $t'$ and $\mu'$ such that 
  $\lang t,\mu\rang \rightarrow \lang t',\mu'\rang$.
- Preservation: If $\{\};\Sigma\vdash t:T$ and 
  $\Sigma\vdash\mu$ and
  $\lang t,\mu\rang\rightarrow \lang t',\mu'\rang$,
  then there exists an $\Sigma'$ such that 
  $\{\};\Sigma'\vdash t':T$ and $\Sigma'\vdash \mu'$.


## Subtyping 

Introduce a subtyping relation, denoted $S<: T$
- "S is more specific than T"
- "values of type S can be passed where values of type T are expected"
  - principle of subtype substitutability


We would like to do this in our language

```ocaml
let f = function x -> if (fst x) then (snd x) + 1 else (snd x) - 1
in
f (true, 1, "some other info")
```
- OCaml doesn't let us do this
- but it should be allowed since extracting first and second from a triple
  containing extra info should be a subtype
- conceptually a tuple is a struct/record, to extend a struct/record we add
  extra fields

Formalize the principle of subtype substitutability through a typing rule called "subsumption": 

$$
\cfrac{
  \Gamma \vdash t: S \quad S <: T
}{
  \Gamma \vdash t: T
}
\quad
T_{Sub}
$$
- if $t$ is type $S$ and $S$ is a subtype of $T$, then we can treat $t$ as type $T$.

Next we define the subtyping relationship $<:$. 

Consider the simply-typed lambda calculus plus base types (ints and bools) plus
(arbitrary-length) tuples.

```ocaml
T ::= Int | Bool | T -> T | ... | T * T * ... * T | Top
```
- we introduce a `Top` type 
- This is the equivalence of the root type `Object` in Java


$$
\cfrac{}{
  T <: T
}
\quad
S_{Refl}
$$

$$
\cfrac{
  S<: U\quad U <:T
}{
  S <: T
}
\quad
S_{Trans}
$$

$$
\cfrac{
}{
T <: Top
}
\quad 
S_{Top}
$$


$$
\cfrac{
  S_1 <: T_1 \quad
  S_2 <: T_2 \quad
  ... \quad
  S_m <: T_m \quad
}{
  S_1 * \dots * S_m <: T_1 * \cdots T_m
}
\quad
S_{DepthTuple}
$$
- e.g. `Int * Bool` $<:$ `Top * Bool`

$$
\cfrac{
  m \geq n
}{
  T_1 * \dots * T_m <: T_1 * \dots * T_n
}
S_{WidthTuple}
$$
- e.g. `Bool * Int * Bool` $<:$ `Bool * Int`


Combining $S_{DepthTuple}$ and $S_{WidthTuple}$, we can have subtyping for shorter tuples with subtypes. 

Now define subtyping for functions?

$$
\cfrac{
  T_1 <: S_1 \quad S_2 <: T_2
}{
  S_1 \rightarrow S_2 <: T_1 \rightarrow T_2
}
\quad
S_{Fun}
$$

Consider a formal parameter `f` of type `T1 -> Int * Int * Int`. Can we pass in for `f` a value of type:
- `T1 -> Int * Int`? (No)
- `T1 -> Int * Int * Int * Int`? (Yes)

This means $S_2 <: T_2$. 


Consider a formal parameter `f` of type `Int * Int * Int -> T2`. Can we pass in for `f` a value of type:
- `Int * Int -> T2`? (Yes)
- `Int * Int * Int * Int -> T2`? (No)

This means $T_1 <: S_1$.

Example in Java: 

```java
class C {
  Object m() {
    return new Integer(4);
  }
}

class D extends C {
  String m() {
    return "hello";
  }
}
```
- see how the subtype function `m` is valid since `String` <: `Object`

Suppose we add mutable references `Ref T` to our language 

Can we do this?
$$
\cfrac{}{
  \texttt{Ref S} <: \texttt{Ref T}
}
\quad 
S_{Ref}
$$

- `Ref Int * Int` <: `Ref Int * Int * Int`? NOT OK. 
- `Ref Int * Int * Int` <: `Ref Int * Int`? 
  - can we do this? 
    ```ocaml
    let (r: Ref Int*Int*Int) = ref (0, 1, 2) in 
    let (s: Ref Int*Int) = r in
      (* ... *)
    ```
    No! what if we 
    ```ocaml
    s := (0, 1)
    ```
    This is dangerous since `s` is an alias. Then we...
    ```ocaml
    (fst !r) + (trd !r)
    ```
    (where `trd` is taking a third element)

We cannot allow subtyping for references!




Suppose that S <: T. 
- Can we consider Ref T <: Ref S?
  - can Ref Top <: Ref Int? 
  - no
    ```ocaml
    let (r: Ref Top) = ref true in
    let (s: Ref Int) = r in 
    !s + 5
    ```
- Can we consider Ref S <: Ref T?
  - can Ref Int <: Ref Top?
  - no
    ```ocaml
    let (r: Ref Int) = ref 0 in
    let (s: Ref Top) = r in 
    s := true; !s + 1
    ```

In Java, the problem comes up in the following form

```java
class C {
  Object f;
  void m() {
    f = new Integer(34);
  }
}

class D extends C {
  override String f; // not legal Java
  int n() {
    return f.length;
  }
}
```

Since someone can assign `int` to `f`, then `override String f` has to be
illegal otherwise it is unsafe. 

Now consider `List`. `List<String>` is not a subtype of `List<Object>` because `List` are mutable. 
 
```java
class Test {
  void m(List<Object> l) {
    // we can append an integer to a list of string
    l.add(new Integer(34)); 
  }
}

class Main {
  public static void main(String[] args) {
    Test t = new Test();
    
    List<String> strs = new LinkedList<String>();
    strs.add("hi");
    strs.add("there");
    t.m(strs); // this will upset the compiler 
  }
}
```

We can append integer to a list of strings. Java doesn't allow that. 

But what if we want

```java
void printAll(List<Object> l) {
  for (Object o:l) { 
    System.out.println(o);
  }
}
```

In this case, it is completely safe. But the type system is stopping us. We need parametric polymorphism 

```java
<T> void printAll(List<T> l) {
  for (T o:l) { 
    System.out.println(o);
  }
}
```

Consider `Array`. The same problem happens, however...
```java
class Test {
  void m2(Object[] l) {
    l[0] = 1;
  }
}

class Main {
  public static void main(String[] args) {
    Test t = new Test();
    
    t.m2(args); 
  }
}
```

This will typecheck! But it will crash at runtime.  Historical baggage or tech
debt. In early days of Java there is no Generics, to make the language
pragmatic. They let this happen in compile time but trade it by giving up
runtime performance and runtime safety.

Consider this example. We have some `Shape` that we can draw. 

```java
interface Shape {
  void draw();
}

class Rectangle implements Shape {
  void draw() { /* ... */ }
}

class Test {
  void drawAll(List<Shape> l) {
    for (Shape s : l) {
      s.draw();
    }
  }
}

class Main {
  public static void main(String []args) {
    List<Rectangle> rects = new LinkedList<Rectangle>();
    t.drawAll(rects); // compiler complains
  }
}
```

This is doesn't compile for the same reason. 
Can we use parametric polymorphism? 

```java
<T> void drawAll(List<T> l) {
  for (T s : l) {
    s.draw();
  }
}
```

This also doesn't compile. Since `T` doesn't have a `draw` method.  However, we
can use bounded parametric polymorphism. 

```java
<T extends Shape> void drawAll(List<T> l) {
  for (T s : l) {
    s.draw();
  }
}
```

Now this type checks.

## Type and Effect Systems

Side effects are not visible in the type of the functions.

```ocaml
let r = ref 42;;
let inc = function x ->  x + 1;;
let inc2 = function x -> r := 1000; x + 1;;
```

Both `inc` and `inc2` has type `int -> int`. However, `inc2` has side effects
but we don't know from its type.

What doesn't function type tell us?
- does the function read/write mutable memory?
- does the function read/write to a file?
- does the function send/receive packets?
- does the function acquire/release lock?

There are a lot of things that the types don't tell us about. 

A type and effect system then is a system that also tracks side effects.

Simple idea: augment the type system to track a set of "effects"

```ocaml
ϕ ::= {} | { read } | { write } | { alloc } | ϕ U ϕ
```

New typing judgment:

$$
\Gamma;\Sigma \vdash t : T ; \phi
$$

"$t$ has type $T$ and $t$'s evaluation may cause the effects $\phi$"

Example: $\Gamma;\Sigma\vdash t: T ; \{\}$ implies the term is pure.
- this means we can cache calls

Example: $\Gamma ;\Sigma\vdash t: T ; \{ read \}$ 
implies the $t$ is side-effect-free but does not change the heap. 
- this means there is no side effect but the calls cannot be cached

Now consider the rules for references. 

$$
\cfrac{
  \Gamma;\Sigma\vdash t : T;\phi
}{
  \Gamma;\Sigma\vdash\texttt{ref t} : \texttt{Ref T}; \phi\cup\{alloc\} 
}
\quad 
T_{Ref}
$$

$$
\cfrac{
  \Gamma;\Sigma\vdash t : \texttt{Ref } T;\phi
}{
  \Gamma;\Sigma\vdash\texttt{!t} : T; \phi\cup\{read\}
}
\quad 
T_{Deref}
$$

$$
\cfrac{
  \Gamma;\Sigma\vdash t_1 : \texttt{Ref }T;\phi_1
  \quad
  \Gamma;\Sigma\vdash t_2 : T;\phi_2
}{
  \Gamma;\Sigma\vdash t_1 := t_2 : Unit; \phi_1\cup\phi_2\cup\{write\}
}
\quad 
T_{Assign}
$$

Now, we can tell the difference between `0` and `!(ref 0)`.
- $\Gamma;\Sigma\vdash !(\texttt{ref } 0) : Int;\{alloc, read\}$
- $\Gamma;\Sigma\vdash 0 : Int;\{\}$


Let's augment the rest of the typing rules.

$$
\cfrac{}{
  \Gamma;\Sigma\vdash true : Bool ; \{\}
}
\quad 
T_{True}
$$

$$
\cfrac{}{
  \Gamma;\Sigma\vdash false : Bool ; \{\}
}
\quad 
T_{False}
$$

$$
\cfrac{
  \Gamma;\Sigma\vdash t1 : Bool ;\phi_1
  \quad
  \Gamma;\Sigma\vdash t2 : T ;\phi_2
  \quad
  \Gamma;\Sigma\vdash t3 : T;\phi_3
}{
  \Gamma;\Sigma\vdash \texttt{if t1 then t2 else t3}
  : T ; \phi_1\cup\phi_2\cup\phi_3
}\quad T_{If}
$$

From the case of `if`, we see that our system is an over-approximation and
conservative since we don't know which branch it is going to take.


Final
- no polymorphic lambda calculus, no existential types
- but include let polymorphism

Continuing on effect system

Consider `let x = ...`
$$
\cfrac{
  \Gamma;\Sigma\vdash t1: T1;\phi_1
  \quad
  \Gamma,x:T1;\Sigma\vdash t2: T;\phi_2
}{\Gamma;\Sigma\vdash\texttt{let x = t1 in t2}: T ; \phi_1\cup\phi_2}
\quad
T_{Let}
$$

Consider variable look up
$$
\cfrac{\Gamma(x)=T}{\Gamma;\Sigma\vdash x : T ; \{\}}
\quad
T_{Var}
$$

Consider declaring a function
$$
\cfrac{
  \Gamma,x:T1;\Sigma\vdash t2: T2;\phi
}{
  \Gamma;\Sigma\vdash\texttt{function x:T1 -> t2}:
  T1\rightarrow T2;\{\}
}
\quad
T_{Func}
$$
- declaring a function doesn't have any effect 
- but we are ignoring them on the floor...

Consider calling a function
$$
\cfrac{
  \Gamma;\Sigma\vdash t1 : T2 \rightarrow T ; \phi_1
  \quad
  \Gamma;\Sigma\vdash t2 : T2 ; \phi_2
}{
  \Gamma;\Sigma\vdash\texttt{t1 t2}: T ; \phi_1\cup\phi_2
}
\quad
T_{App}
$$
- but now, the side effect in `t1` is not accounted for!
- our type system is unsound
  
Solution to unsoundness: augment function type to also keep track of the body
of the function.
$$
T_1 \xrightarrow{\phi}T_2
$$

$$
\cfrac{
  \Gamma,x:T1;\Sigma\vdash t2: T2;\phi
}{
  \Gamma;\Sigma\vdash\texttt{function x:T1 -> t2}:
  T1\xrightarrow{\phi} T2;\{\}
}
\quad
T_{Func}
$$

$$
\cfrac{
  \Gamma;\Sigma\vdash t1 : T2 \xrightarrow{\phi} T ; \phi_1
  \quad
  \Gamma;\Sigma\vdash t2 : T2 ; \phi_2
}{
  \Gamma;\Sigma\vdash\texttt{t1 t2}: T ; \phi\cup\phi_1\cup\phi_2
}
\quad
T_{App}
$$

The effect is now part of the type language. 

Java has an effect system. It is called exception. 

```java
class Exn1 extends Exception {}
class Exn2 extends Exception {}

class Test {
  void m1(int x) throws Exn1 {
    if (x < 0) throw new Exn1();
    // ...
  }
  
  void m2(int y) throws Exn1, Exn2 {
    m1(y);
    if (y > 100) throw new Exn2();
  }
  
  void m3(int z) throws Exn2 {
    try {
      m2(z);
    } catch (Exn1 e) {
      // ...
    }
  }
}
```
- `throws` documents the exception side effect.
- we "consume" the effect by using `try-catch` 

### Monads

There are 2 distinct aspect to monads
- ability to track effects of various kinds in the type system
- a cool programming pattern for separating out code that manipulates effects from the "normal" code does the regular computation

```ocaml
let h x y = x/y

let g x = x + 1

let f x = x * 2 

let myprogram x y = 
  let v = h x y in 
  let u = g v in 
  f u
```

`h` can throw a division by 0 exception. 
We can wrap it in an option type.
```ocaml
let h' x y = if y = 0 then None else Some (x / y)
```

However, we cannot just replace `h` in `myprogram` with `h'` since now it
returns an option. Then this bubbles up all the way in the program. So much
pattern matching to do!

Problem: so much boilerplate code that bubbles up everywhere. 

A monad is an API that allows all the boilerplate handling of the effect to be modularized. Two functions:
- `return`: a function that lifts a value into monad (`a' -> a' option`)
- `bind`: thread an effect through a computation (`'a option -> ('a -> 'b option) -> b' option`)
  - give me some result with an effect, a function to handle a value and have some effect. Give you back a combined effect.

```ocaml
let return x = Some x;;
(* defining an infix operator for bind *)
let (>>=) x f =
  match x with 
    None -> None
  | Some x' -> (f x')
```

Now re-consider `myprogram` 

```ocaml
let myprogram' x y =
  (h' x y) >>= (function v -> return (g v)) >>= (function u -> return (f u))
```


Consider another example. This time, we want to log all function execution. To capture the side effect, we have a type that capture the side effect.

```ocaml
type 'a logged = 'a * string
```

Then we define `return` and `bind`
```ocaml
let return x = (x, "")

let (>>=) x f = 
  let (v, log) = x in
  let (v', log') = f v in 
  (v', log ^ " " ^ log')
```

Now modify my program:
```ocaml
let h x y = (x/y, "h")

let g x = (x + 1, "g")

let f x = (x * 2, "f")

let myprogram' x y = 
  (h x y) >>= g >>= h
```

Each function only cares about their own logs.  The concatenation is abstracted
away from them. 
