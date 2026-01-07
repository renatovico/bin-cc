# Credit Card Identifier - .NET Library

.NET library for credit card BIN validation using bin-cc data.

## Installation

Install via NuGet Package Manager:

```bash
dotnet add package CreditCardIdentifier
```

Or via Package Manager Console:

```powershell
Install-Package CreditCardIdentifier
```

## Usage

### Static Methods

```csharp
using CreditCardIdentifier;

// Identify card brand
var brand = CreditCard.FindBrand("4012001037141112");
Console.WriteLine(brand);  // "visa"

// Check if card is supported
var supported = CreditCard.IsSupported("4012001037141112");
Console.WriteLine(supported);  // True
```

### Using the Validator Class

```csharp
using CreditCardIdentifier;

var validator = new Validator();

// Identify brand
var brand = validator.FindBrand("4012001037141112");
Console.WriteLine(brand);  // "visa"

// Check if supported
var supported = validator.IsSupported("4012001037141112");
Console.WriteLine(supported);  // True

// Validate CVV
var valid = validator.ValidateCvv("123", "visa");
Console.WriteLine(valid);  // True

// Get brand info
var info = validator.GetBrandInfo("visa");
Console.WriteLine(info.regexpBin);

// List all brands
var brands = validator.ListBrands();
foreach (var b in brands)
{
    Console.WriteLine(b);
}
```

## API

### Static CreditCard Class

#### `CreditCard.FindBrand(string cardNumber)`
Identify the credit card brand.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (string) Brand name (e.g., "visa", "mastercard") or null if not found

#### `CreditCard.IsSupported(string cardNumber)`
Check if the card number is supported.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (bool) True if supported, false otherwise

### Validator Class

#### `Validator(string dataPath = null)`
Initialize validator with brand data.

**Parameters:**
- `dataPath` (string, optional): Path to brands.json. If null, uses bundled data.

#### `FindBrand(string cardNumber)`
Identify the credit card brand.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (string) Brand name or null if not found

#### `IsSupported(string cardNumber)`
Check if card number is supported.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (bool) True if supported, false otherwise

#### `ValidateCvv(string cvv, string brandName)`
Validate CVV for a specific brand.

**Parameters:**
- `cvv` (string): CVV code
- `brandName` (string): Brand name (e.g., "visa", "mastercard")

**Returns:** (bool) True if valid, false otherwise

#### `GetBrandInfo(string brandName)`
Get information about a specific brand.

**Parameters:**
- `brandName` (string): Brand name

**Returns:** (Brand) Brand information or null if not found

#### `ListBrands()`
List all supported brands.

**Returns:** (List<string>) List of brand names

### Brand Class

Properties:
- `name` (string): Brand name
- `regexpBin` (string): BIN pattern
- `regexpFull` (string): Full validation pattern
- `regexpCvv` (string): CVV validation pattern

## Supported Frameworks

- .NET Standard 2.0+
- .NET Core 2.0+
- .NET Framework 4.6.1+
- .NET 5.0+

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is bundled with the package, and can be updated by installing a newer version.

## Development

### Build

```bash
cd libs/dotnet/CreditCardIdentifier
dotnet build
```

### Run Tests

```bash
cd libs/dotnet/CreditCardIdentifier.Tests
dotnet test
```

## License

MIT
