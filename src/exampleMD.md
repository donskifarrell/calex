


---
title: About
---

# CaleX


The idea behind this simple web application is taken from [Jerry Seinfield](http://lifehacker.com/281626/jerry-seinfelds-productivity-secret), where he describes his technique of writing jokes. He marks an X on a calendar for each day he has written a new joke with the aim of having a chain of X's. He then gets addicted to not breaking the chain, which forces him to write more jokes. 

Personally, my daily activites are going to be:

1. Play at least 10 minutes of Ukelele
2. Commit at least one change in any of the projects I am working on
3. Jot down at least a sentence for a blog post

## Code example

```
  $commitBtn.click(function(e){
    e.preventDefault();
    entry = builder.buildEntry($entryTitle.val(), $entryMarkdown.val());
    gh.setCredentials($usernameField.val(), $passwordField.val());
    gh.commit(entry);
  });
```
* Item 1
* Item 2
  * Item 2a
  * Item 2b

As Kanye West said:

> We're living the future so
> the present is our past.



 
Markdown Cheat Sheet
Format Text

Headers
# This is an <h1> tag
## This is an <h2> tag
###### This is an <h6> tag

Text styles
*This text will be italic*
_This will also be italic_
**This text will be bold**
__This will also be bold__

*You **can** combine them*
Lists

Unordered
* Item 1
* Item 2
  * Item 2a
  * Item 2b

Ordered
1. Item 1
2. Item 2
3. Item 3
   * Item 3a
   * Item 3b
Miscellaneous

Images
![GitHub Logo](/images/logo.png)
Format: ![Alt Text](url)

Links
http://github.com - automatic!
[GitHub](http://github.com)

Blockquotes
As Kanye West said:

> We're living the future so
> the present is our past.
Code Examples in Markdown

Syntax highlighting with GFM
```javascript
function fancyAlert(arg) {
  if(arg) {
    $.facebox({div:'#foo'})
  }
}
```

Or, indent your code 4 spaces
Here is a Python code example
without syntax highlighting:

    def foo:
      if not bar:
        return true

Inline code for comments
I think you should use an
`<addr>` element here instead.