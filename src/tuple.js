import * as R from 'ramda'

const isNotSameLength = (types, tuple) => types.length !== tuple.length
const commaSeperate = R.join(', ')
const typeNamesString = R.compose(commaSeperate, R.pluck('name'))
const tupleToString = R.compose(commaSeperate, R.map(R.toString))

const tupleTypeValueString = (types, tuple) => {
  return `\nTypes: (${typeNamesString(types)})\nValues: (${tupleToString(tuple)})`
}

const throwTupleNilError = (types, tuple) => {
  throw new ReferenceError(`Cannot have null or undefined values${tupleTypeValueString(types, tuple)}`)
}

const throwTupleArityError = (length, tuple) => {
  throw new TypeError(`Tuple arg doesn\'t match prototype length of ${length}`)
}

const throwTupleTypeError = (types, tuple) => {
  throw new TypeError(`Tuple types do not match${tupleTypeValueString(types, tuple)}`)
}

const tupleTypesMatch = (types, tuple) => types.every(((type, i) => R.is(type, tuple[i])))

const Tuple = function(...types) {
  const createTuple = function (...tuple) {
    if (R.any(R.isNil, tuple))
      throwTupleNilError(tuple)

    if (isNotSameLength(types, tuple))
      throwTupleArityError(types.length)

    if (!tupleTypesMatch(types, tuple))
      throwTupleTypeError(types, tuple)

    return Object.freeze({
      [Symbol.iterator]() {
        const iterator = {
          index: 0,
          next() {
            const value = tuple[iterator.index]

            return {value, done: iterator.index++ === tuple.length}
          }
        }

        return iterator
      },

      map: R.compose(R.apply(createTuple), R.map(R.__, tuple)),
      reduce: R.reduce(R.__, R.__, tuple),

      get length() {
        return tuple.length
      },

      equals(compTuple) {
        const [...thisTupleItems] = tuple,
              [...compareItems] = compTuple

        return R.equals(thisTupleItems, compareItems)
      },


      toString() {
        return `(${tupleToString(tuple)})`
      }
    })
  }

  return createTuple
}

