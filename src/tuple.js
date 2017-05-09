import * as R from 'ramda'
import fl from 'fantasy-land'

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

const typeAny = R.when(R.is(String), R.toLower)
const tupleTypesMatch = (types, tuple) => types.every((type, i) => typeAny(type) === 'any' || R.is(type, tuple[i]));

export const Tuple = function(...types) {
  const createTuple = function (...tuple) {
    const map = R.compose(R.apply(createTuple), R.map(R.__, tuple))
    const reduce = R.reduce(R.__, R.__, tuple)
    const equals = (compTuple) => {
      const [...thisTupleItems] = tuple,
            [...compareItems] = compTuple

      return R.equals(thisTupleItems, compareItems)
    }

    if (R.any(R.isNil, tuple))
      throwTupleNilError(tuple)

    if (isNotSameLength(types, tuple))
      throwTupleArityError(types.length)

    if (!tupleTypesMatch(types, tuple))
      throwTupleTypeError(types, tuple)

    return Object.freeze({
      ...Object.assign({}, tuple),
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

      map,
      [fl.map]: map,

      reduce,
      [fl.reduce]: reduce,

      get length() {
        return tuple.length
      },

      equals,
      [fl.equals]: equals,


      toString() {
        return `(${tupleToString(tuple)})`
      }
    })
  }

  return createTuple
}

