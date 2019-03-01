// Source: https://jsperf.com/comparing-arrays2/3

function arraysEqual(array1, array2) {
  const a = array1;
  const b = array2;
  const c = a.length !== b.length;

  /*
   * Test both factors that immediately make this method unnecessary.
   */
  if (c || !b) {
    return false;
  }

  /*
   * Assign the length value to a variable outside of the loop to
   * increase performance. The process is sped up because the value is
   * not being evaluated every time the decrement loop is being run.
   */
  let i = a.length;
  /*
   * Use a decrement to iterate through the array objects.
   */
  for (i; i--; ) {
    /*
     * Compare the objects types for arrays. If both are arrays then
     * loop through this function again with those objects.
     */

    if (a[i] instanceof Array && a[i] instanceof Array) {
      /*
       * Recursively run the same test to determine if the child objects
       * are equal arrays.
       */

      if (!arraysEqual(a[i], b[i])) {
        return false;
      }
    } else if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

module.exports = { arraysEqual };
