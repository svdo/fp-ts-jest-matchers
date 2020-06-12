import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { constant, flow } from 'fp-ts/lib/function'
import diff from 'jest-diff'
import { matcherHint, printExpected, printReceived } from 'jest-matcher-utils'
import { Eq, eqStrict } from 'fp-ts/lib/Eq'

/**
 * This matcher allows you to expect that an `Option` is `none`.
 *
 * @param received the option that is expected to be `none`
 *
 * @see https://gcanti.github.io/fp-ts/modules/Option.ts.html
 */
export const toBeNoneMatcher = <A>(received: O.Option<A>) => {
  return {
    pass: O.isNone(received),
    message: () => 'Option expected to be none, but was some'
  }
}

/**
 * This matcher allows you to expect that an `Option` is `some`, optionally
 * with the expected value of the `some` and an `Eq` instance that should be
 * used for checking the value.
 *
 * @param received the option that is expected to be `some`
 * @param expected optionally, the expected value of the `some`
 * @param eq optionally, an `Eq` instance for checking the value; if absent,
 *           `eqStrict` is used, which corresponds to checking with `===`.
 *
 * @see https://gcanti.github.io/fp-ts/modules/Option.ts.html
 * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
 */
export const toBeSomeMatcher = <A>(
  expand: boolean,
  received: O.Option<A>,
  expected?: A,
  eq: Eq<A> = eqStrict
) => {
  return {
    pass: expected ? O.elem(eq)(expected, received) : O.isSome(received),
    message: () => {
      if (!expected) {
        return 'Option expected to be some, but was none'
      } else {
        const formatter = formattedDiffString('toBeSome', { expand }, expected)
        return O.fold(
          constant(`Option expected to be some, but was none`),
          formatter
        )(received)
      }
    }
  }
}

/**
 * This matcher allows you to expect that an `Either` is a `left`, optionally
 * with the expected value of the `left` and an `Eq` instance that should be
 * used for checking the value.
 *
 * @param received the either that is expected to be `left`
 * @param expected optionally, the expected value of the `left`
 * @param eq optionally, an `Eq` instance for checking the value; if absent,
 *           `eqStrict` is used, which corresponds to checking with `===`.
 *
 * @see https://gcanti.github.io/fp-ts/modules/Either.ts.html
 * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
 */
export const toBeLeftMatcher = <E, A>(
  expand: boolean,
  received: E.Either<E, A>,
  expected?: E,
  eq: Eq<E> = eqStrict
) => {
  return {
    pass: expected
      ? E.elem(eq)(expected, E.swap(received))
      : E.isLeft(received),
    message: () => {
      if (!expected) {
        return `Either expected to be left, but was right`
      } else {
        const formatter = formattedDiffString('toBeLeft', { expand }, expected)
        return flow(
          E.swap,
          E.fold(
            constant(`Either expected to be left, but was right`),
            formatter
          )
        )(received)
      }
    }
  }
}

/**
 * This matcher allows you to expect that an `Either` is a `right`, optionally
 * with the expected value of the `right` and an `Eq` instance that should be
 * used for checking the value.
 *
 * @param received the either that is expected to be `right`
 * @param expected optionally, the expected value of the `right`
 * @param eq optionally, an `Eq` instance for checking the value; if absent,
 *           `eqStrict` is used, which corresponds to checking with `===`.
 *
 * @see https://gcanti.github.io/fp-ts/modules/Either.ts.html
 * @see https://gcanti.github.io/fp-ts/modules/Eq.ts.html
 */
export const toBeRightMatcher = <E, A>(
  expand: boolean,
  received: E.Either<E, A>,
  expected?: A,
  eq?: Eq<A>
) => {
  let equals = eq || eqStrict
  return {
    pass: expected ? E.elem(equals)(expected, received) : E.isRight(received),
    message: () => {
      if (!expected) {
        return 'Either expected to be right, but was left'
      } else {
        const formatter = formattedDiffString('toBeRight', { expand }, expected)
        return E.fold(
          constant(`Either expected to be right, but was left`),
          formatter
        )(received)
      }
    }
  }
}

const formattedDiffString = <A>(
  matcherName: string,
  options: any,
  expected: A
) => <A>(receivedValue: A) => {
  const diffString = diff(expected, receivedValue, options)
  return (
    matcherHint(matcherName, undefined, undefined) +
    '\n\n' +
    (diffString && diffString.includes('- Expect')
      ? `Difference:\n\n${diffString}`
      : `Expected: ${printExpected(expected)}\n` +
        `Received: ${printReceived(receivedValue)}`)
  )
}
