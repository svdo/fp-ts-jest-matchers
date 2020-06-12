import {
  toBeNoneMatcher,
  toBeSomeMatcher,
  toBeLeftMatcher,
  toBeRightMatcher
} from './fp-ts-jest-matchers'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as Array from 'fp-ts/lib/Array'
import { eqString, getTupleEq, getStructEq } from 'fp-ts/lib/Eq'

describe('toBeNone', () => {
  it('passes on none', () => {
    const { pass } = toBeNoneMatcher(O.none)
    expect(pass).toBeTruthy()
  })

  it('fails on some', () => {
    const { pass, message } = toBeNoneMatcher(O.some('value'))
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be none, but was some')
  })
})

describe('toBeSome', () => {
  it('fails on none', () => {
    const { pass, message } = toBeSomeMatcher(true, O.none, 'value')
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be some, but was none')
  })

  it('fails on incorrect some', () => {
    const { pass, message } = toBeSomeMatcher(
      true,
      O.some('wrong value'),
      'value'
    )
    expect(pass).toBeFalsy()
    expect(message()).toContain('- value')
    expect(message()).toContain('+ wrong value')
  })

  it('passes on some without checking value', () => {
    const { pass } = toBeSomeMatcher(true, O.some('value'))
    expect(pass).toBeTruthy()
  })

  it('passes on some with correct value', () => {
    const { pass } = toBeSomeMatcher(true, O.some('value'), 'value')
    expect(pass).toBeTruthy()
  })
})

describe('toBeLeft', () => {
  it('passes on left', () => {
    const { pass } = toBeLeftMatcher(true, E.left('value'))
    expect(pass).toBeTruthy()
  })

  it('passes on left with correct value', () => {
    const { pass } = toBeLeftMatcher(true, E.left('value'), 'value')
    expect(pass).toBeTruthy()
  })

  it('fails on left with incorrect value', () => {
    const { pass, message } = toBeLeftMatcher(
      true,
      E.left('wrong value'),
      'value'
    )
    expect(pass).toBeFalsy()
    expect(message()).toContain('- value')
    expect(message()).toContain('+ wrong value')
  })

  it('fails on right', () => {
    const { pass, message } = toBeLeftMatcher(true, E.right('value'))
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be left, but was right')
  })

  it('fails on right even with correct value', () => {
    const { pass, message } = toBeLeftMatcher(true, E.right('value'), 'value')
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be left, but was right')
  })
})

describe('toBeRight', () => {
  it('fails on left', () => {
    const { pass, message } = toBeRightMatcher(
      true,
      E.left('wrong value'),
      'value'
    )
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be right, but was left')
  })

  it('fails on left even with correct value', () => {
    const { pass, message } = toBeRightMatcher(true, E.left('value'), 'value')
    expect(pass).toBeFalsy()
    expect(message()).toContain('expected to be right, but was left')
  })

  it('fails on right with wrong value', () => {
    const { pass, message } = toBeRightMatcher(
      true,
      E.right('wrong value'),
      'value'
    )
    expect(pass).toBeFalsy()
    expect(message()).toContain('- value')
    expect(message()).toContain('+ wrong value')
  })

  it('passes on right without value', () => {
    const { pass } = toBeRightMatcher(true, E.right('value'))
    expect(pass).toBeTruthy()
  })

  it('passes on right with correct value', () => {
    const { pass } = toBeRightMatcher(true, E.right('value'), 'value')
    expect(pass).toBeTruthy()
  })
})

describe('with Eq', () => {
  it('accepts Eq for toBeSome', () => {
    const v1: string[] = ['x']
    const v2: string[] = ['x']

    const { pass: passStrict } = toBeSomeMatcher(true, O.some(v1), v2)
    expect(passStrict).toBeFalsy()

    const eq = Array.getEq(eqString)
    const { pass: passWithEq } = toBeSomeMatcher(true, O.some(v1), v2, eq)
    expect(passWithEq).toBeTruthy()
  })

  it('accepts Eq for toBeLeft', () => {
    const v1: [string] = ['x']
    const v2: [string] = ['x']

    const { pass: passStrict } = toBeLeftMatcher(true, E.left(v1), v2)
    expect(passStrict).toBeFalsy()

    const eq = getTupleEq(eqString)
    const { pass: passWithEq } = toBeLeftMatcher(true, E.left(v1), v2, eq)
    expect(passWithEq).toBeTruthy()
  })

  it('accepts Eq for toBeRight', () => {
    const v1 = { x: 'y' }
    const v2 = { x: 'y' }

    const { pass: passStrict } = toBeRightMatcher(true, E.right(v1), v2)
    expect(passStrict).toBeFalsy()

    const eq = getStructEq({ x: eqString })
    const { pass: passWithEq } = toBeRightMatcher(true, E.right(v1), v2, eq)
    expect(passWithEq).toBeTruthy()
  })
})
