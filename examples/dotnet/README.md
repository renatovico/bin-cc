# Credit Card Validator - .NET Example

C#/.NET implementation showing how to use the bin-cc data file project.

## Usage

```bash
dotnet run
```

Or compile and run:
```bash
csc CreditCardValidator.cs
./CreditCardValidator
```

## Requirements

- .NET 5.0+ or .NET Core 3.1+
- System.Text.Json (included in .NET)

## Features

- Load brand data from JSON
- Identify credit card brand
- Validate CVV codes
- Check if card is supported
- Get brand information

## Example

```csharp
using CreditCardValidation;

var validator = new CreditCardValidator();

// Identify brand
var brand = validator.FindBrand("4012001037141112");
Console.WriteLine(brand);  // "visa"

// Check if supported
var supported = validator.IsSupported("4012001037141112");
Console.WriteLine(supported);  // True

// Validate CVV
var valid = validator.ValidateCvv("123", "visa");
Console.WriteLine(valid);  // True
```

## Data Source

Loads data from [`../../data/brands.json`](../../data/brands.json)
