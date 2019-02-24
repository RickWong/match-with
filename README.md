# match-with

Pattern matching object structures. Related to [tc39/proposal-pattern-matching](https://github.com/tc39/proposal-pattern-matching)

## Installation

```bash
yarn add match-with
```

## Usage

Setup and generate webhook as a Promise:

```js
import match from "match-with";

match(object).with(
  { foo: "foo", bar: match.exists },
  () => console.log("matched"),
  () => console.warn("not matched"),
);
```

## Community

Let's start one together! After you ★ this project, follow me [@rygu](https://twitter.com/rygu) on Twitter.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
