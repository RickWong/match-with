# match-with

Pattern matching object structures. Semi-related to [tc39/proposal-pattern-matching](https://github.com/tc39/proposal-pattern-matching).

## Installation

```bash
yarn add match-with
```

## Usage

```js
import { match } from "match-with";

match({ one: 1, two: undefined, three: "3" })
  .with(
    { one: 1, two: undefined },
    () => console.log("matched"), // <-- yes
    () => console.warn("not matched"),
  )
  .with(
    { one: match.TRUTHY, two: match.FALSY },
    () => console.log("matched"), // <-- yes
    () => console.warn("not matched"),
  )
  .with(
    { one: 1, two: match.EXISTS },
    () => console.log("matched"), // <-- yes
    () => console.warn("not matched"),
  )
  .with(
    { one: 1, four: undefined },
    () => console.log("matched"), // <-- yes
    () => console.warn("not matched"),
  )
  .with(
    { one: 1, four: match.EXISTS },
    () => console.log("matched"),
    () => console.warn("not matched"), // <-- nope
  );
```

## Community

Let's start one together! After you ★ this project, follow me [@Rygu](https://twitter.com/rygu) on Twitter. Let me know what you think.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
