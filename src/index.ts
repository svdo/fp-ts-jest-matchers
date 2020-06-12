import {
  toBeNoneMatcher,
  toBeSomeMatcher,
  toBeLeftMatcher,
  toBeRightMatcher
} from './fp-ts-jest-matchers'
import { Eq, eqStrict } from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'

expect.extend({
  toBeNone: toBeNoneMatcher,
  toBeSome<A> (received: O.Option<A>, expected?: A, eq: Eq<A> = eqStrict) {
    return toBeSomeMatcher(!!this.expand, received, expected, eq)
  },
  toBeLeft<E, A> (
    received: E.Either<E, A>,
    expected?: E,
    eq: Eq<E> = eqStrict
  ) {
    return toBeLeftMatcher(!!this.expand, received, expected, eq)
  },
  toBeRight<E, A> (received: E.Either<E, A>, expected?: A, eq?: Eq<A>) {
    return toBeRightMatcher(!!this.expand, received, expected, eq)
  }
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNone(value?: any, eq?: Eq<any>): R
      toBeSome(value?: any, eq?: Eq<any>): R
      toBeLeft(value?: any, eq?: Eq<any>): R
      toBeRight(value?: any, eq?: Eq<any>): R
    }
  }
}
