# Credit Card BIN Data - Data File Project

**This is a data file project** similar to tzdata, providing credit card BIN (Bank Identification Number) patterns as a source of truth for other libraries.

This repository contains authoritative data about credit card BIN patterns for validation and brand identification, along with reference implementations in multiple programming languages.

Repository for this [gist](https://gist.github.com/erikhenrique/5931368)

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
│   ├── javascript/
│   ├── python/
│   ├── ruby/
│   ├── elixir/
│   └── dotnet/
│
├── examples/               # Usage examples
│   ├── javascript-example.js
│   ├── python/
│   ├── elixir/
│   ├── ruby/
│   └── dotnet/
│
├── CONTRIBUTING.md         # Contribution guidelines
└── package.json            # Build scripts
```

## 🎯 Data Source

The **authoritative data** follows a **build system** similar to browserslist:

- **Source files** [`data/sources/`](./data/sources) - Human-editable card scheme definitions
- **Build script** [`scripts/build.js`](./scripts/build.js) - Compiles and validates data
- **Detailed output** [`data/compiled/cards-detailed.json`](./data/compiled/cards-detailed.json) - Full details with BINs
- **Simplified output** [`data/compiled/cards.json`](./data/compiled/cards.json) - Regex patterns only
- **Schema docs** [`data/SCHEMA.md`](./data/SCHEMA.md) - Complete schema documentation

### Data Releases

Data is released separately from library code:
- **Location**: [GitHub Releases](https://github.com/renatovico/bin-cc/releases?q=data-v)
- **Tagging**: `data-vX.Y.Z` (e.g., `data-v2.0.1`)
- **Automatic**: Releases are created automatically when `data/sources/` changes
- **Files included**: `cards.json`, `cards-detailed.json`, `sources/*.json`

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
