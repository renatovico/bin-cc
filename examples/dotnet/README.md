# Credit Card Validator - .NET Example

.NET example showing how to use the CreditCardIdentifier library.

For the full library implementation, see: [`../../libs/dotnet/`](../../libs/dotnet/)

## Installation

```bash
dotnet add package CreditCardIdentifier
```

## Running This Example

```bash
dotnet run
```

Or compile and run:
```bash
csc CreditCardValidator.cs
./CreditCardValidator
```

## Features Demonstrated

- Using static methods
- Using the Validator class
- Brand identification
- CVV validation
- Getting brand information

## Example

```csharp
using CreditCardIdentifier;

// Using static methods
var brand = CreditCard.FindBrand("4012001037141112");
Console.WriteLine(brand);  // "visa"

// Check if supported
var supported = CreditCard.IsSupported("4012001037141112");
Console.WriteLine(supported);  // True
```

## Documentation

For complete API documentation, see the [.NET library README](../../libs/dotnet/README.md).
