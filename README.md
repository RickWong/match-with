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
  .with(pattern1: any, callback1: (subject, pattern1) => result: any)
  .with(pattern2: any, callback2: (subject, pattern2) => result: any)
  .default(callback3: (subject) => result: any)
  .result;
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
  })
  .result; // "match";

match(subject)
  .with({ one: 2 }, () => {
    // Skipped.
  })
  .default(() => {
    return 1;
  });

match(subject)
  .with({ one: n => n < 2 }, () => {
    console.log(true);
  });

match(subject)
  .with({ four: match.EXISTS }, () => {
    // Skipped.
  })
  .with({ four: undefined }, () => {
    return 4;
  });
```

## Community

Let me know what you think. After you ★ this project, follow me [@Rygu](https://twitter.com/rygu) on Twitter.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
