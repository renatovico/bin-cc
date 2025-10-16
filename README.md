Credit Card BIN Data - Data File Project
====================

**This is a data file project** similar to tzdata, providing credit card BIN (Bank Identification Number) patterns as a source of truth for other libraries.

This repository contains authoritative data about credit card BIN patterns for validation and brand identification, along with reference implementations in multiple programming languages.

Repository for this [gist](https://gist.github.com/erikhenrique/5931368)

## 📁 Project Structure

```
bin-cc/
├── data/                    # Source of truth - Credit card BIN data
│   ├── brands.json         # All brand patterns (BIN, validation, CVV)
│   └── README.md           # Data schema documentation
│
├── libs/                   # Reference implementations
│   └── javascript/         # JavaScript/Node.js implementation
│
└── examples/               # Usage examples in different languages
    ├── javascript-example.js
    ├── python/
    ├── elixir/
    ├── ruby/
    └── dotnet/
```

## 🎯 Data Source

The **authoritative data** is located in the [`data/`](./data) directory:
- [`data/brands.json`](./data/brands.json) - Complete BIN patterns for all supported brands
- [`data/README.md`](./data/README.md) - Full schema documentation

## 📚 Implementations

### JavaScript/Node.js
Complete implementation available in [`libs/javascript/`](./libs/javascript/)

**Installation:**
```bash
npm install creditcard-identifier
```

**Usage:**
```javascript
const cc = require('creditcard-identifier');
console.log(cc.findBrand('4012001037141112')); // 'visa'
```

See [JavaScript documentation](./libs/javascript/README.md) for details.

### Python
Example implementation in [`examples/python/`](./examples/python/)

### Elixir
Example implementation in [`examples/elixir/`](./examples/elixir/)

### Ruby
Example implementation in [`examples/ruby/`](./examples/ruby/)

### .NET
Example implementation in [`examples/dotnet/`](./examples/dotnet/)

## 🎴 Supported Card Brands

| Brand      | Starts with                                  | Max length | CVV length |
| ---------- | ------------------------------------------- | ---------- | ---------- |
| Visa       | 4, 6367                                     | 13, 16     | 3          |
| Mastercard | 5, 222100 to 272099                         | 16         | 3          |
| Diners     | 301, 305, 36, 38                            | 14, 16     | 3          |
| Elo        | 4011, 401178, 401179, 431274, 438935, etc.  | 16         | 3          |
| Amex       | 34, 37                                      | 15         | 4          |
| Discover   | 6011, 622, 64, 65                           | 16         | 4          |
| Aura       | 50                                          | 16         | 3          |
| Hipercard  | 38, 60                                      | 13, 16, 19 | 3          |

**Note:** Some Brazilian brands (Elo, Hipercard, Aura) do not have official public documentation. Patterns collected from real-world usage.

## 🤝 Contributing

Contributions are welcome! To update BIN patterns or add new implementations:

1. **Data updates:** Edit [`data/brands.json`](./data/brands.json) and document your source
2. **New implementations:** Add to the appropriate language folder in `examples/`
3. **Tests:** Ensure all tests pass before submitting

Please provide the source of information when updating BIN patterns to maintain data reliability.

## 📝 License

MIT License

## 👥 Contributors

- @jotafelipe
- @ahonorato 
- @renatoelias


| Bandeira   | Começa com                                  | Máximo de número | Máximo de número cvc |
| ---------- | ------------------------------------------- | ---------------- | -------------------- |
| Visa       | 4, 6367                                     | 13,16            | 3                    |
| Mastercard | 5, 222100 à 272099                          | 16               | 3                    |
| Diners     | 301, 305, 36, 38 [link](http://bin-iin.com/American-Express-BIN-List.html)                               | 14,16            | 3                    |
| Elo        | 4011, 401178, 401179, 431274, 438935, 451416, 457393, 4576, 457631, 457632, 504175, 504175, 506699 à 506778, 509000 à 509999, 627780, 636297, 636368, 636369, 650031 à 650033, 650035 à 650051, 650405 à 650439, 650485 à 650538, 650541 à 650598, 650700 à 650718, 650720 à 650727, 650901 à 650920, 651652 à 651679, 655000 à 655019, 655021 à 655058 | 16               | 3                    |
| Amex       | 34,37                                       | 15               | 4                    |
| Discover   | 6011, 622, 64, 65                              | 16               | 4                    |
| Aura       | 50                                          | 16               | 3                    |
| jcb        | 35                                          | 16               | 3                    |
| Hipercard  | 38,60                                       | 13,16,19         | 3                    |





# Contribuidores

- @jotafelipe
- @ahonorato 
- @renatoelias
