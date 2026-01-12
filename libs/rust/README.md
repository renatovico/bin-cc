# CreditCard Identifier - Rust

Credit Card BIN validation library using bin-cc data.

## Installation

Add this to your `Cargo.toml`:

```toml
[dependencies]
creditcard-identifier = "2.1.0"
```

## Usage

```rust
use creditcard_identifier::*;

fn main() {
    // Find brand
    let brand = find_brand("4012001037141112");
    println!("{:?}", brand); // Some("visa")
    
    // Check if supported
    let supported = is_supported("4012001037141112");
    println!("{}", supported); // true
    
    // Validate CVV
    let valid_cvv = validate_cvv("123", "visa");
    println!("{}", valid_cvv); // true
    
    // Luhn validation
    let valid_luhn = luhn("4012001037141112");
    println!("{}", valid_luhn); // true
}
```

## Running the Example

```bash
cargo run --example example
```

## Testing

```bash
# Run tests
cargo test

# Run tests with output
cargo test -- --nocapture
```

## Features

- **Brand Identification**: Identify card brand by BIN/IIN patterns
- **CVV Validation**: Validate CVV length for each brand
- **Luhn Algorithm**: Validate card numbers using Luhn checksum
- **Detailed Brand Info**: Get comprehensive brand information
- **Performance**: Pre-compiled regex patterns for fast validation
- **Zero-cost abstractions**: Compiled with Rust's performance guarantees

## Supported Brands

See [data/compiled/BRANDS.md](../../data/compiled/BRANDS.md) for the complete list.

## License

MIT License
