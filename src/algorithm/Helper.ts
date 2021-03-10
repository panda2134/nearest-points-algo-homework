function arrayMerge<T>(mergeA: T[], mergeB: T[], compareFn: ((a: T, b: T) => number)): T[] {
  const ret: T[] = []
  let i = 0, j = 0

  while (i < mergeA.length || j < mergeB.length) {
    if (j >= mergeB.length || (i < mergeA.length && compareFn(mergeA[i], mergeB[j]) < 0)) {
      ret.push(mergeA[i++])
    } else {
      ret.push(mergeB[j++])
    }
  }

  return ret
}

export {
  arrayMerge
}