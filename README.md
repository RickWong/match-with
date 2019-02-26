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

match(subject0: any)
  .with(pattern1: any, matchCallback1: (subject0, pattern1) => void)
  .with(pattern2: any, matchCallback2: (subject0, pattern2) => void)
  .default(matchCallback3: (subject0) => void);
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
    { one: 1, four: match.EXISTS },
    () => console.log("match"), // Skipped.
  )
  .with(
    { one: 1, four: undefined },
    () => console.log("match"),
  );
```

## Community

Let me know what you think. After you ★ this project, follow me [@Rygu](https://twitter.com/rygu) on Twitter.

## License

BSD 3-Clause license. Copyright © 2019, Rick Wong. All rights reserved.
