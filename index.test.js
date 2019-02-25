const { match, Matcher } = require("match-with");

describe("match", () => {
  test("scalars", () => {
    let matched = 0;
    match(0).with(0, () => {
      matched++;
    });
    match("1").with("1", () => {
      matched++;
    });
    match([1, 2]).with([1, 2], () => {
      matched++;
    });
    match(1).with(match.TRUTHY, () => {
      matched++;
    });
    match(0).with(match.FALSY, () => {
      matched++;
    });
    match().with(undefined, () => {
      matched++;
    });
    match().with(match.EXISTS, () => {
      matched--;
    });

    expect(matched).toBe(6);
  });

  test("no props", () => {
    let matched = 0;
    match({ foo: "foo" }).with({}, () => {
      matched++;
    });

    expect(matched).toBe(1);
  });

  test("multiple props", () => {
    let matched = 0;
    match({ foo: "foo", bar: 12, baz: true }).with({ foo: "foo", bar: 12, baz: true }, () => {
      matched++;
    });
    match({ foo: "", bar: 0, baz: false }).with({ foo: "", bar: 0, baz: false }, () => {
      matched++;
    });
    match({ foo: "", bar: 0 }).with({ bar: 0, baz: false }, () => {
      matched--;
    });

    expect(matched).toBe(2);
  });

  test("numerical props", () => {
    let matched = 0;
    match({ num: 12 }).with({ num: 12 }, () => {
      matched++;
    });
    match({ num: +0 }).with({ num: -0 }, () => {
      matched++;
    });
    match({ num: Infinity }).with({ num: Infinity }, () => {
      matched++;
    });
    match({ num: "0" }).with({ num: 0 }, () => {
      matched--;
    });

    expect(matched).toBe(3);
  });

  test("boolean props", () => {
    let matched = 0;
    match({ bool: true }).with({ bool: true }, () => {
      matched++;
    });
    match({ bool: false }).with({ bool: false }, () => {
      matched++;
    });
    match({ bool: true }).with({ bool: false }, () => {
      matched--;
    });
    match({ bool: 1 }).with({ bool: true }, () => {
      matched--;
    });
    match({ bool: 0 }).with({ bool: false }, () => {
      matched--;
    });

    expect(matched).toBe(2);
  });

  test("null props", () => {
    let matched = 0;
    match({ nil: null }).with({ nil: null }, () => {
      matched++;
    });
    match({ nil: undefined }).with({ nil: null }, () => {
      matched--;
    });
    match({}).with({ nil: null }, () => {
      matched--;
    });

    expect(matched).toBe(1);
  });

  test("string props", () => {
    let matched = 0;
    match({ foo: "" }).with({ foo: "" }, () => {
      matched++;
    });
    match({ foo: "0" }).with({ foo: "0" }, () => {
      matched++;
    });
    match({ foo: false }).with({ foo: "" }, () => {
      matched--;
    });

    expect(matched).toBe(2);
  });

  test("array props", () => {
    let matched = 0;
    match({ foo: [] }).with({ foo: [] }, () => {
      matched++;
    });
    match({ foo: [1] }).with({ foo: [1] }, () => {
      matched++;
    });
    match({ foo: [1] }).with({ foo: [1, 2] }, () => {
      matched--;
    });
    match({ foo: [1, 2] }).with({ foo: [2, 1] }, () => {
      matched--;
    });

    expect(matched).toBe(2);
  });

  test("undefined props", () => {
    let matched = 0;
    match({}).with({ foo: undefined }, () => {
      matched++;
    });
    match({ foo: null }).with({ foo: undefined }, () => {
      matched--;
    });
    match({ foo: false }).with({ foo: undefined }, () => {
      matched--;
    });

    expect(matched).toBe(1);
  });

  test("existent props", () => {
    let matched = 0;
    match({ foo: null }).with({ foo: match.EXISTS }, () => {
      matched++;
    });
    match({ foo: false }).with({ foo: match.EXISTS }, () => {
      matched++;
    });
    match({ foo: undefined }).with({ foo: match.EXISTS }, () => {
      matched++;
    });
    match({}).with({ foo: match.EXISTS }, () => {
      matched--;
    });

    expect(matched).toBe(3);
  });

  test("truthy props", () => {
    let matched = 0;
    match({ foo: true }).with({ foo: match.TRUTHY }, () => {
      matched++;
    });
    match({ foo: 1 }).with({ foo: match.TRUTHY }, () => {
      matched++;
    });
    match({ foo: [] }).with({ foo: match.TRUTHY }, () => {
      matched++;
    });
    match({ foo: "" }).with({ foo: match.TRUTHY }, () => {
      matched--;
    });
    match({ foo: false }).with({ foo: match.TRUTHY }, () => {
      matched--;
    });

    expect(matched).toBe(3);
  });

  test("falsy props", () => {
    let matched = 0;
    match({ foo: false }).with({ foo: match.FALSY }, () => {
      matched++;
    });
    match({ foo: null }).with({ foo: match.FALSY }, () => {
      matched++;
    });
    match({ foo: "" }).with({ foo: match.FALSY }, () => {
      matched++;
    });
    match({ foo: undefined }).with({ foo: match.FALSY }, () => {
      matched++;
    });
    match({ foo: 0 }).with({ foo: match.FALSY }, () => {
      matched++;
    });
    match({ foo: [] }).with({ foo: match.FALSY }, () => {
      matched--;
    });

    expect(matched).toBe(5);
  });

  test("deep object", () => {
    let matched = 0;
    match({ foo: { bar: 1, baz: "2" } }).with({ foo: { bar: 1 } }, () => {
      matched++;
    });
    match({ foo: { bar: 1, baz: null } }).with({ foo: { baz: null } }, () => {
      matched++;
    });
    match({ foo: { bar: 1 } }).with({ foo: {} }, () => {
      matched++;
    });
    match({ foo: {} }).with({ foo: { bar: { baz: undefined } } }, () => {
      matched--;
    });
    match({ foo: { bar: 1 } }).with({ foo: [] }, () => {
      matched--;
    });
    match({ foo: {} }).with({ foo: { bar: 1 } }, () => {
      matched--;
    });

    expect(matched).toBe(3);
  });

  test("custom match function", () => {
    let matched = 0;
    match({ zero: +0 }).with({ zero: -0 }, () => {
      matched++;
    });
    match({ zero: +0 }, Object.is).with({ zero: -0 }, () => {
      matched--;
    });

    expect(matched).toBe(1);
  });

  test("example from README", () => {
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
  });
});
