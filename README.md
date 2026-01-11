# Credit Card BIN Data

**This is a data file project** similar to tzdata, providing credit card BIN (Bank Identification Number) patterns as a source of truth for other libraries.

This repository contains authoritative data about credit card BIN patterns for validation and brand identification, along with reference implementations in multiple programming languages.

The original idea came from this [gist](https://gist.github.com/erikhenrique/5931368) by Erik Henrique.

After a JavaScript-only creditcard version, I found myself looking for this in other languages. With a bit of vibe coding style, I created libs for all languages I need (come contribute with more!). The idea is to generate from a source of truth in JSON to language-specific native code, avoiding the overhead of loading JSON files at runtime.

## 📁 Project Structure

```
bin-cc/
├── data/                    # Credit card BIN data
│   ├── sources/            # Source data files (editable)
│   │   ├── visa/          # Subfolder for complex brands
│   │   │   ├── base.json
│   │   │   └── bins-*.json
│   │   ├── mastercard.json
│   │   └── ...
│   ├── compiled/           # Compiled output formats
│   │   ├── cards.json      # Simplified regex format
│   │   └── cards-detailed.json  # Full detailed format
│   ├── SCHEMA.md           # Data schema documentation
│   └── README.md           # Data usage guide
│
├── scripts/                # Build and validation tools
│   ├── build.js           # Compiles source → compiled data
│   ├── validate.js        # Standalone validation CLI
│   ├── create-card.js     # Interactive card creation CLI
│   └── lib/               # Shared modules
│
├── libs/                   # Reference implementations
│   ├── javascript/        # Each lib includes example.{ext}
│   ├── python/
│   ├── ruby/
│   ├── elixir/
│   ├── dotnet/
│   ├── java/
│   ├── rust/
│   ├── go/
│   └── php/
│
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
└── package.json            # Build scripts
```

## 🎯 Data Source

The **authoritative data** follows a **build system** similar to browserslist:

- **Source files** [`data/sources/`](./data/sources) - Human-editable card scheme definitions
- **Build script** [`scripts/build.js`](./scripts/build.js) - Compiles and validates data
- **Detailed output** [`data/compiled/cards-detailed.json`](./data/compiled/cards-detailed.json) - Full details with BINs
- **Simplified output** [`data/compiled/cards.json`](./data/compiled/cards.json) - Regex patterns only
- **Schema docs** [`data/SCHEMA.md`](./data/SCHEMA.md) - Complete schema documentation

### Building the Data

```bash
npm run build
```

This compiles source files into both detailed and simplified formats with validation.

### Validating Data

```bash
# Validate all sources
node scripts/validate.js

# Validate specific file or directory
node scripts/validate.js data/sources/visa
node scripts/validate.js data/sources/amex.json
```

### Creating New Card Schemes

```bash
node scripts/create-card.js
```

Interactive CLI to create new card scheme source files.

## 📚 Library Implementations

All libraries provide the same core functionality for credit card BIN validation and brand identification.

### JavaScript/Node.js

Complete implementation in [`libs/javascript/`](./libs/javascript/)

```bash
npm install creditcard-identifier
```

```javascript
const cc = require('creditcard-identifier');
console.log(cc.findBrand('4012001037141112')); // 'visa'
```

### Python

Complete implementation in [`libs/python/`](./libs/python/)

```bash
pip install creditcard-identifier
```

```python
from creditcard_identifier import find_brand
print(find_brand('4012001037141112'))  # 'visa'
```

### Ruby

Complete implementation in [`libs/ruby/`](./libs/ruby/)

```bash
gem install creditcard-identifier
```

```ruby
require 'creditcard_identifier'
puts CreditcardIdentifier.find_brand('4012001037141112')  # 'visa'
```

### Elixir

Complete implementation in [`libs/elixir/`](./libs/elixir/)

```elixir
# mix.exs
{:creditcard_identifier, "~> 1.0"}

# usage
CreditcardIdentifier.find_brand("4012001037141112")  # "visa"
```

### .NET/C#

Complete implementation in [`libs/dotnet/`](./libs/dotnet/)

```bash
dotnet add package CreditCardIdentifier
```

```csharp
using CreditCardIdentifier;
CreditCard.FindBrand("4012001037141112");  // "visa"
```

### Java

Complete implementation in [`libs/java/`](./libs/java/)

```xml
<!-- Maven -->
<dependency>
    <groupId>com.creditcard</groupId>
    <artifactId>creditcard-identifier</artifactId>
    <version>2.1.0</version>
</dependency>
```

```java
import com.creditcard.identifier.CreditCardValidator;

CreditCardValidator validator = new CreditCardValidator();
validator.findBrand("4012001037141112");  // "visa"
```

### Rust

Complete implementation in [`libs/rust/`](./libs/rust/)

```toml
# Cargo.toml
[dependencies]
creditcard-identifier = "2.1.0"
```

```rust
use creditcard_identifier::*;
find_brand("4012001037141112");  // Some("visa")
```

### Go

Complete implementation in [`libs/go/`](./libs/go/)

```bash
go get github.com/renatovico/bin-cc/libs/go
```

```go
import creditcard "github.com/renatovico/bin-cc/libs/go"

brand := creditcard.FindBrand("4012001037141112")  // "visa"
```

### PHP

Complete implementation in [`libs/php/`](./libs/php/)

```bash
composer require creditcard/identifier
```

```php
use CreditCard\Identifier\CreditCardValidator;

$validator = new CreditCardValidator();
$validator->findBrand('4012001037141112');  // "visa"
```

## 🎴 Supported Card Brands

See [data/compiled/BRANDS.md](./data/compiled/BRANDS.md) for the auto-generated list of supported card brands.

## 🤝 Contributing

Contributions are welcome! This project follows a **source → build → compiled** workflow:

1. **Data updates:** Edit source files in [`data/sources/`](./data/sources)
2. **Build:** Run `npm run build` to compile and validate
3. **Test:** Ensure `npm test` passes
4. **Document:** Cite sources in your PR description

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for detailed guidelines.

### Quick Start for Contributors

```bash
# Create a new card scheme interactively
node scripts/create-card.js

# Or edit a source file manually
vim data/sources/visa/base.json

# Build and validate
npm run build

# Test
npm test

# Commit changes (both source and generated files)
git add data/
git commit -m "Update Visa BIN patterns"
```

## 📝 License

MIT License
