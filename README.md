# 🧩 match-with

Pattern matching object structures. Semi-related to [tc39/proposal-pattern-matching](https://github.com/tc39/proposal-pattern-matching).

## Installation

```bash
yarn add match-with
```

## Usage

Basic syntax:

```ts
import { match } from "match-with";

match(subject: any)
  .with(pattern1: any, matchCallback: (subject, pattern) => void)
  .with(pattern2: any, matchCallback: (subject, pattern) => void);
```

Examples:

```ts
...
const subject = { one: 1, two: undefined, three: "3" };

match(subject)
  .with(
    { one: 1, two: undefined },
    () => console.log("match"),
  );

match(subject)
  .with(
    { one: match.TRUTHY, two: match.FALSY },
    () => console.log("match"),
  );

match(subject)
  .with(
    { one: 1, two: match.EXISTS },
    () => console.log("match"),
  );

match(subject)
  .with(
    { one: 1, four: undefined },
    () => console.log("match"),
  );
```

## Community

Let's start one together! After you ★ this project, follow me [@Rygu](https://twitter.com/rygu) on Twitter. Let me know what you think.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
