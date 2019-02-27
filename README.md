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
  .with(pattern1: any, callback1: (subject, pattern1) => any)
  .with(pattern2: any, callback2: (subject, pattern2) => any)
  .default(callback3: (subject) => any);
```

Examples:

```ts
...
const subject = {
  one: 1,
  two: undefined,
  three: "3",
};

match(subject)
  .with({ one: 1, two: undefined }, () => {
    return "match";
  }).result; // "match";

match(subject)
  .with({ one: match.TRUTHY, two: match.FALSY, three: match.EXISTS }, () => {
    return true;
  });

match(subject)
  .with({ one: 9 }, () => {
    // Skipped.
  })
  .default(() => {
    return 42;
  });

match(subject)
  .with({ four: match.EXISTS }, () => {
    // Skipped.
  })
  .with({ four: undefined }, () => {
    return "match";
  });
```

## Community

Let me know what you think. After you ★ this project, follow me [@Rygu](https://twitter.com/rygu) on Twitter.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
