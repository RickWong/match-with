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
    match().with(undefined, () => {
      matched++;
    });
    match().with(match.EXISTS, () => {
      matched++;
    });

    expect(matched).toBe(5);
  });

  test("return value", () => {
    const matcher = match(2).with(2, subject => {
      return subject * 3;
    });

    expect(matcher.result).toBe(6);
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
      fail();
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
      fail();
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
      fail();
    });
    match({ bool: 1 }).with({ bool: true }, () => {
      fail();
    });
    match({ bool: 0 }).with({ bool: false }, () => {
      fail();
    });

    expect(matched).toBe(2);
  });

  test("null props", () => {
    let matched = 0;
    match({ nil: null }).with({ nil: null }, () => {
      matched++;
    });
    match({ nil: undefined }).with({ nil: null }, () => {
      fail();
    });
    match({}).with({ nil: null }, () => {
      fail();
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
      fail();
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
      fail();
    });
    match({ foo: [1, 2] }).with({ foo: [2, 1] }, () => {
      fail();
    });

    expect(matched).toBe(2);
  });

  test("undefined props", () => {
    let matched = 0;
    match({}).with({ foo: undefined }, () => {
      matched++;
    });
    match({ foo: null }).with({ foo: undefined }, () => {
      fail();
    });
    match({ foo: false }).with({ foo: undefined }, () => {
      fail();
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
      fail();
    });

    expect(matched).toBe(3);
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
      fail();
    });
    match({ foo: { bar: 1 } }).with({ foo: [] }, () => {
      fail();
    });
    match({ foo: {} }).with({ foo: { bar: 1 } }, () => {
      fail();
    });

    expect(matched).toBe(3);
  });

  test("match once", () => {
    let matched = 0;
    match({ foo: 1 })
      .with({ foo: 0 }, () => {
        fail();
      })
      .with({ foo: 1 }, () => {
        matched++;
      })
      .with({ foo: 1 }, () => {
        matched++;
      });

    expect(matched).toBe(1);
  });

  test("match default", () => {
    let matched = 0;
    const { result } = match({ foo: 1 })
      .with({ foo: 0 }, () => {
        fail();
      })
      .default(() => {
        matched++;
        return 42;
      })
      .default(() => {
        fail();
      });

    expect(matched).toBe(1);
    expect(result).toBe(42);
  });

  test("custom match function", () => {
    let matched = 0;
    match({ zero: +0 }).with({ zero: -0 }, () => {
      matched++;
    });
    match({ zero: +0 }, null, Object.is).with({ zero: -0 }, () => {
      fail();
    });

    expect(matched).toBe(1);
  });

  test("pattern function", () => {
    let matched = 0;

    match({ num: 6 }).with(
      ({ num }) => {
        return num > 5;
      },
      () => {
        matched++;
      },
    );
    expect(matched).toBe(1);

    match({ num: 4 }).with({ num: n => n < 5 }, () => {
      matched++;
    });
    expect(matched).toBe(2);
  });
});
