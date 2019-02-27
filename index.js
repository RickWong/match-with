"use strict";

const { arraysEqual } = require("./arrays-equal");

function isObject(object) {
  return object !== null && typeof object === "object";
}

function match(subject, initValue, compareFn) {
  return new Matcher(subject, initValue, compareFn);
}

match.EXISTS = Symbol("EXISTS");
match.TRUTHY = Symbol("TRUTHY");
match.FALSY = Symbol("FALSY");

class Matcher {
  constructor(subject, initValue, compareFn) {
    this._subject = subject;
    this._result = initValue;
    this._compareFn = compareFn || this.compare;
  }

  get result() {
    return this._result;
  }

  with(pattern, callback) {
    if (this._compareFn({ wrapper: this._subject }, { wrapper: pattern })) {
      if (callback) {
        this._result = callback(this._subject, pattern);
      }

      return new NoOpMatcher(this._subject, this._result, this._compareFn);
    }

    return this;
  }

  compare(subject, pattern) {
    for (const [prop, comparison] of Object.entries(pattern)) {
      if (Array.isArray(comparison)) {
        return arraysEqual(subject[prop], comparison);
      } else if (isObject(comparison)) {
        if (isObject(subject[prop]) && this._compareFn(subject[prop], comparison)) {
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
      } else if (subject[prop] === comparison) {
        continue;
      }

      return false;
    }

    return true;
  }

  default(callback) {
    if (callback) {
      this._result = callback(this._subject, null);
    }

    return new NoOpMatcher(this._subject, this._result, this._compareFn);
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
