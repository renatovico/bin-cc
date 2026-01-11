# Credit Card Identifier - .NET Library

.NET library for credit card BIN validation and identification.

## Supported Card Brands

- American Express (amex)
- Aura
- BaneseCard
- Diners Club
- Discover
- Elo
- Hipercard
- JCB
- Maestro
- Mastercard
- UnionPay
- Visa

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

### Using the Validator Class

```csharp
using CreditCardIdentifier;

var validator = new Validator();

// Identify brand
var brand = validator.FindBrand("4012001037141112");
Console.WriteLine(brand.Name);  // "visa"

// Get detailed brand info
var detailed = validator.FindBrandDetailed("4012001037141112");
Console.WriteLine(detailed.Scheme);  // "visa"
Console.WriteLine(detailed.MatchedPattern?.Bin);  // "^4"

// Check if supported
var supported = validator.IsSupported("4012001037141112");
Console.WriteLine(supported);  // True

// Validate CVV
var valid = validator.ValidateCvv("123", "visa");
Console.WriteLine(valid);  // True

// Get brand info
var info = validator.GetBrandInfo("visa");
Console.WriteLine(info?.RegexpBin);

// Get detailed brand info
var detailedInfo = validator.GetBrandInfoDetailed("amex");

// List all brands
var brands = validator.ListBrands();
foreach (var b in brands)
{
    Console.WriteLine(b);
}
// amex, aura, banesecard, diners, discover, elo, hipercard, jcb, maestro, mastercard, unionpay, visa
```

### Static Methods

```csharp
using CreditCardIdentifier;

// Static convenience method
var brand = Validator.FindBrandStatic("4012001037141112");
Console.WriteLine(brand?.Name);  // "visa"

var supported = Validator.IsSupportedStatic("4012001037141112");
Console.WriteLine(supported);  // True
```

## API

### Validator Class

#### `Validator()`
Initialize validator with embedded brand data.

#### `FindBrand(string cardNumber)`
Identify the credit card brand.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (BrandData.Brand) Brand object or null if not found

#### `FindBrandDetailed(string cardNumber)`
Identify the credit card brand with detailed information.

**Parameters:**
- `cardNumber` (string): The credit card number

**Returns:** (DetailedBrandResult) Detailed brand result with MatchedPattern and MatchedBin, or null if not found

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

**Returns:** (BrandData.Brand) Brand information or null if not found

#### `GetBrandInfoDetailed(string scheme)`
Get detailed information about a specific brand.

**Parameters:**
- `scheme` (string): Scheme name (e.g., "visa", "mastercard")

**Returns:** (BrandDataDetailed.Brand) Detailed brand information or null if not found

#### `ListBrands()`
List all supported brands.

**Returns:** (List<string>) List of brand names

### BrandData.Brand Class

Properties:
- `Name` (string): Brand name
- `RegexpBin` (Regex): BIN pattern (pre-compiled)
- `RegexpFull` (Regex): Full validation pattern (pre-compiled)
- `RegexpCvv` (Regex): CVV validation pattern (pre-compiled)

### DetailedBrandResult Class

Properties:
- `Scheme` (string): Scheme name
- `Brand` (string): Display brand name
- `Type` (string): Card type (credit/debit)
- `Cvv` (CvvInfo): CVV information
- `Patterns` (Pattern[]): BIN patterns
- `Countries` (string[]): Supported countries
- `MatchedPattern` (Pattern): The specific pattern that matched
- `MatchedBin` (BinInfo): The specific BIN that matched (if available)

## Supported Frameworks

- .NET Standard 2.0+
- .NET Core 2.0+
- .NET Framework 4.6.1+
- .NET 5.0+

## Data Source

This library uses the BIN data from the [bin-cc project](https://github.com/renatovico/bin-cc).

The data is embedded directly in the package for optimal performance.

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
