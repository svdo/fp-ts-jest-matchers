# Jest Matchers for fp-ts

![Build and test](https://github.com/svdo/fp-ts-jest-matchers/workflows/Build%20and%20test/badge.svg)
![npm](https://img.shields.io/npm/v/fp-ts-jest-matchers)

This library provides Jest matchers to nicely test code based on
[`fp-ts`][fp-ts]. Currently it provides matchers for 
[`Option`][fp-ts-option] and [`Either`][fp-ts-either].

## Installation

First add the dependency to your project:

```bash
yarn add --dev fp-ts-jest-matchers
```

Then make sure this package is loaded by Jest. If you have a file
`setupTests.ts`, you can include it there:

```typescript
import 'fp-ts-jest-matchers'
```

If not, you may need to add this to your Jest config:

```json
"jest": {
  "setupFilesAfterEnv": ["fp-ts-jest-matchers"]
}
```

## Usage

After installation, you can now write assertions like these in your test:

```typescript
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'

it('can test fp-ts options', () => {
    // Expect an option to be 'none':
    expect(O.none).toBeNone()

    // Expect an option to be 'some' with any value:
    expect(O.some('value')).toBeSome()

    // Expect an option to be 'some' with a specific value:
    expect(O.some('value')).toBeSome('value')

    // Use custom Eq for testing the value:
    expect(O.some(['a', 'b'])).toBeSome(['a', 'b'], A.getEq(eqString))
})

it('can test fp-ts eithers', () => {
    // Expect an either to be a left:
    expect(E.left('left value')).toBeLeft()

    // Expect an either to be a left with a specific value:
    expect(E.left('left value')).toBeLeft('left value')

    // Use custom Eq for testing the value:
    expect(E.left(['a', 'b'])).toBeLeft(['a', 'b'], A.getEq(eqString))

    // Expect an either to be a right:
    expect(E.right('right value')).toBeRight()

    // Expect an either to be a right with a specific value:
    expect(E.right('right value')).toBeRight('right value')

    // Use custom Eq for testing the value:
    expect(E.right(['a', 'b'])).toBeRight(['a', 'b'], A.getEq(eqString))
})
```

[fp-ts]: https://gcanti.github.io/fp-ts/
[fp-ts-either]: https://gcanti.github.io/fp-ts/modules/Either.ts.html
[fp-ts-option]: https://gcanti.github.io/fp-ts/modules/Option.ts.html
