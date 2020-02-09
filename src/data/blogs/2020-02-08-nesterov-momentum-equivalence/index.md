---
date: "2020-02-08"
title: "Nesterov Momentum Equivalence Derivation"
subtitle: "That Missing Piece in the Papers and the Slides"
---

During the Winter Quarter of 2020 at UCLA, I am/was taking a 
class on neural network and deep learning. The course is numbered
ECE C147/247. It was a course modified from the famous Stanford
[CS 231n](http://cs231n.stanford.edu/). 

> Note: I assume you (the reader) already knows what is 
> momentum update, and how Nesterov Momentum is different from 
> momentum. 

In the chapter about optimization on training (the gradient
descent stage), we learned about a technique called Nesterov
Momentum used to update the weight to improve training speed.

The formulation of Nesterov Momentum update is given as 

Updating momentum:
$$
\mathbf{v} \leftarrow \alpha\mathbf{v} - 
\epsilon\nabla_{\theta} J(\theta + \alpha\mathbf{v})
$$
Updating parameter:
$$
\theta \leftarrow \theta + \mathbf{v}
$$

Here $J$ is the loss function. However, this formulation
is difficult to implement in code. In code, we usually
have $\nabla_\theta J(\theta)$ available to us instead
of $\nabla_{\theta} J(\theta + \alpha\mathbf{v})$.

To solve this problem, an alternative formulation is 
given. We first let 
$$
\tilde{\theta}_\text{old} 
= \theta_\text{old} + \alpha\mathbf{v}_\text{old}
$$

Then, the formulation becomes

$$
\mathbf{v}_\text{new} = \alpha\mathbf{v}_\text{old}
- \epsilon\nabla_{\tilde{\theta}_\text{old}}
J(\tilde{\theta}_\text{old})
$$
$$
\tilde{\theta}_\text{new} = \tilde{\theta}_\text{old}
+\mathbf{v}_\text{new} 
+ \alpha(\mathbf{v}_\text{new} - \mathbf{v}_\text{old})
$$


In class, there were no explanation given on how the 
2 formulations are equivalent. Instead, a hint is given
to us that the proof can be done through a substitution
of variable. 
This formulation still confuses me a lot. 

There are multiple points of confusion here:
1. How do we calculate 
  $\nabla_{\tilde\theta_\text{old}}J(\tilde\theta_\text{old})$?
2. What is the actual meaning of $\tilde\theta$?
3. What are we storing as our parameter?


I then sought help from the [Stanford course webpage on 
this chapter](http://cs231n.github.io/neural-networks-3/#sgd). 
They pointed to two papers on the derivation of Nesterov
momentum.
Only [one of them](https://arxiv.org/pdf/1212.0901v2.pdf) 
(session 3.5) discusses the alternative derivation, but
it simply stated the 2 formulation without proof.
I understand the target audience of the paper are very
likely capable to figure out the equivalence but I am 
not one of them. 

The paper did offer some insight:

> the parameters $\tilde\theta$ are a completely equivalent 
> replacement of $\theta$.

This offers the answer to confusion 3. We are storing 
$\tilde\theta$ as the parameter. In code, what is given
to us the the derivative of $J(\tilde\theta)$ with 
respect to $\theta$. Using chain rule, we can show that
$$
\begin{aligned}
\tilde\theta &= \theta + \alpha\mathbf{v}\\
\therefore \nabla_{\theta}\tilde\theta &= 1\\
\end{aligned}
$$

$$
\begin{aligned}
\nabla_{\theta}J(\tilde\theta) &= 
\nabla_{\theta}\tilde\theta \nabla_{\tilde\theta}J(\tilde\theta)\\
\therefore  \nabla_{\theta}J(\tilde\theta) &= 
\nabla_{\tilde\theta}J(\tilde\theta)\\
\end{aligned}
$$

This answer confusion 1, since in code we are given 
gradient of loss with $\tilde\theta$ with respect to $\theta$
and it is equivalent to gradient with respect to $\tilde\theta$.
Now back to confusion 2, what is the meaning of $\tilde\theta$?
Is it okay to use it as the parameter for prediction and 
testing?
The answer is yes. By definition, $\tilde\theta$ is simply
the parameter after one momentum update. Therefore, we
can think of it as a parameter value that is closer to 
the optimum. 

I had to take the time to do the derivation on my own.
Here, I offer the derivation of the equivalence. 
First, we have the substitution and the original formulation.

$$
\tag{1}
\tilde{\theta}_\text{old} 
= \theta_\text{old} + \alpha\mathbf{v}_\text{old}
$$

$$
\tag{2}
\mathbf{v}_\text{new} = \alpha\mathbf{v}_\text{old} - 
\epsilon\nabla_{\theta_\text{old}} J(\theta_\text{old} + \alpha\mathbf{v}_\text{old})
$$
$$
\tag{3}
\theta_\text{new} = \theta_\text{old} + \mathbf{v}_\text{new}
$$

We substitute $(1)$ into $(2)$ and apply the relationship
$\nabla_{\theta}J(\tilde\theta) = \nabla_{\tilde\theta}J(\tilde\theta)$:
$$
\mathbf{v}_\text{new} = \alpha\mathbf{v}_\text{old} - 
\epsilon\nabla_{\theta_\text{old}} J(\tilde\theta_\text{old})\\
\tag{4}
\mathbf{v}_\text{new} = \alpha\mathbf{v}_\text{old} - 
\epsilon\nabla_{\tilde\theta_\text{old}} J(\tilde\theta_\text{old})
$$

We can rewrite $(1)$ as $\theta = \tilde\theta - \alpha\mathbf{v}$.
Then, we substitute $(1)$ into $(3)$. Note that we have to 
substitute both $\theta_\text{new}$ and $\theta_\text{old}$. 

$$
\tilde\theta_\text{new} - \alpha\mathbf{v}_\text{new} = 
\tilde\theta_\text{old} - \alpha\mathbf{v}_\text{old} + 
\mathbf{v}_\text{new}\\
\tag{5}
\tilde\theta_\text{new} = \tilde\theta_\text{old}
+ \mathbf{v}_\text{new} + \alpha(\mathbf{v}_\text{new}  
- \mathbf{v}_\text{old})
$$

Now we have arrived at the alternative formulation
with $(4)$ and $(5)$. Therefore, in the code, the new
parameter is $\tilde\theta_\text{new}$ that is returned 
instead of $\theta_\text{new}$. Again, the idea is that 
the actual parameter stored and used for evaluation 
is always updated with the momentum. Therefore, the  
gradient is taken with loss is the parameter updated
with the momentum.


