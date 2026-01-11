# Known Limitations

## Rust

The current Rust implementation has compilation issues due to using `vec![]` macros in static context. This needs to be refactored to use array slices or lazy static initialization.

**Status:** Not functional - requires refactoring of the generator to use array literals or lazy initialization.

## Go

Go's `regexp` package does not support lookahead assertions (`(?=...)`) which are used in the card data for length validation. This causes runtime panics when compiling the regex patterns.

**Possible solutions:**
1. Pre-process the data to remove lookahead assertions and add explicit length validation in the code
2. Use a different regex library that supports lookahead (e.g., google/re2)
3. Keep the current approach and document that Go users need to handle this limitation

**Status:** Not functional - requires either data preprocessing or alternative regex handling.

## Fully Functional Languages

The following implementations are fully functional and tested:
- Java ✅
- PHP ✅
- JavaScript ✅
- Python ✅
- Ruby ✅
- Elixir ✅
- .NET/C# ✅
