"use strict";

const { arraysEqual } = require("./arrays-equal");

function isObject(object) {
  return object !== null && typeof object === "object";
}

function match(subject, matchFunc) {
  return new Matcher(subject, matchFunc);
}

match.EXISTS = Symbol("EXISTS");
match.TRUTHY = Symbol("TRUTHY");
match.FALSY = Symbol("FALSY");

class Matcher {
  constructor(subject, matchFunc) {
    this._subject = subject;
    this._matchFunc = matchFunc;
  }

  with(pattern, matchCallback) {
    if (this.compare({ wrapper: this._subject }, { wrapper: pattern })) {
      matchCallback && matchCallback(this._subject, pattern);
      return new NoOpMatcher(this._subject, this._matchFunc);
    }

    return this;
  }

  compare(subject, pattern) {
    if (!Object.keys(pattern).length) {
      return true;
    }

    for (const [prop, comparison] of Object.entries(pattern)) {
      if (Array.isArray(comparison)) {
        return arraysEqual(subject[prop], comparison);
      } else if (isObject(comparison)) {
        if (isObject(subject[prop]) && this.compare(subject[prop], comparison)) {
          continue;
        }
      } else if (comparison === match.EXISTS) {
        if (prop in subject) {
          continue;
        }
      } else if (comparison === match.TRUTHY) {
        if (subject[prop]) {
          continue;
        }
      } else if (comparison === match.FALSY) {
        if (!subject[prop]) {
          continue;
        }
      } else if (this._matchFunc) {
        if (this._matchFunc(subject[prop], comparison, prop)) {
          continue;
        }
      } else if (subject[prop] === comparison) {
        continue;
      }

      return false;
    }

    return true;
  }

  default(matchCallback) {
    matchCallback && matchCallback(this._subject, null);
    return new NoOpMatcher(this._subject, this._matchFunc);
  }
}

class NoOpMatcher extends Matcher {
  with() {
    return this;
  }

  default() {
    return this;
  }
}

module.exports = {
  match: match,
  Matcher: Matcher,
};
