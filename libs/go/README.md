# CreditCard Identifier - Go

Credit Card BIN validation library using bin-cc data.

## Installation

```bash
go get github.com/renatovico/bin-cc/libs/go
```

## Usage

```go
package main

import (
    "fmt"
    creditcard "github.com/renatovico/bin-cc/libs/go"
)

func main() {
    // Find brand
    brand := creditcard.FindBrand("4012001037141112")
    if brand != nil {
        fmt.Println(*brand) // "visa"
    }
    
    // Check if supported
    supported := creditcard.IsSupported("4012001037141112")
    fmt.Println(supported) // true
    
    // Validate CVV
    validCvv := creditcard.ValidateCVV("123", "visa")
    fmt.Println(validCvv) // true
    
    // Luhn validation
    validLuhn := creditcard.Luhn("4012001037141112")
    fmt.Println(validLuhn) // true
}
```

## Running the Example

```bash
cd example
go run main.go
```

## Testing

```bash
go test -v
```

## Features

- **Brand Identification**: Identify card brand by BIN/IIN patterns
- **CVV Validation**: Validate CVV length for each brand
- **Luhn Algorithm**: Validate card numbers using Luhn checksum
- **Detailed Brand Info**: Get comprehensive brand information
- **Performance**: Pre-compiled regex patterns with lazy initialization
- **Concurrency-safe**: Thread-safe operations with sync.Once

## Supported Brands

See [data/compiled/BRANDS.md](../../data/compiled/BRANDS.md) for the complete list.

## License

MIT License
