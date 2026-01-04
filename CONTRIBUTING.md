# Contributing to bin-cc

Thank you for your interest in contributing to bin-cc! This document provides guidelines for contributing card BIN data and code improvements.

## 🎯 Project Philosophy

bin-cc is a **data file project** similar to [browserslist](https://github.com/browserslist/browserslist) and [tzdata](https://www.iana.org/time-zones):
- **Data is the product** - We maintain authoritative BIN patterns
- **Source of truth** - Other libraries depend on our data
- **Community-driven** - Contributions keep data accurate and up-to-date
- **Multi-language** - Implementations exist in many programming languages

## 📊 Contributing Data

### Adding a New Card Scheme

You can organize card data in two ways:

#### Option 1: Single File (Simple Brands)

1. **Create a source file** in `data/sources/`

   ```bash
   # Example: adding JCB
   touch data/sources/jcb.json
   ```

2. **Follow the schema** (see `data/SCHEMA.md`)

   ```json
   {
     "scheme": "jcb",
     "brand": "JCB",
     "patterns": [
       {
         "bin": "^35",
         "length": [16],
         "luhn": true,
         "cvvLength": 3
       }
     ],
     "type": "credit",
     "countries": ["GLOBAL"]
   }
   ```

#### Option 2: Subfolder (For Large or Regional Data)

For brands with extensive BIN data or regional variations, use a subfolder:

1. **Create a subfolder** in `data/sources/`

   ```bash
   # Example: organizing Visa data
   mkdir -p data/sources/visa
   ```

2. **Create multiple JSON files** in the subfolder

   ```bash
   # Base patterns
   data/sources/visa/base.json
   
   # Detailed BIN data
   data/sources/visa/detailed.json
   
   # Regional data (optional)
   data/sources/visa/br.json
   data/sources/visa/us.json
   ```

3. **Files are automatically merged** by the build script
   - Patterns are deduplicated by structure
   - BINs are deduplicated by number
   - Countries are merged
   - Subfolder name becomes the scheme identifier

**Example folder structure:**

```
data/sources/
├── visa/
│   ├── base.json          # Base patterns for Visa
│   ├── detailed.json      # Detailed BIN database
│   └── br.json            # Brazil-specific data (optional)
├── mastercard/
│   ├── base.json
│   └── regional.json
└── amex.json              # Single file for simple brands
```

   **Optional: Add detailed BIN information**
   
   You can include specific BIN-level details for known issuers:
   
   ```json
   {
     "scheme": "visa",
     "brand": "Visa",
     "patterns": [
       {
         "bin": "^4",
         "length": [13, 16],
         "luhn": true,
         "cvvLength": 3
       }
     ],
     "type": "credit",
     "countries": ["GLOBAL"],
     "bins": [
       {
         "bin": "491441",
         "type": "CREDIT",
         "category": null,
         "issuer": "BANCO PROSPER, S.A."
       },
       {
         "bin": "491414",
         "type": "CREDIT",
         "category": "GOLD",
         "issuer": "BANCO DO ESTADO DO PARANA"
       }
     ]
   }
   ```
   
   The `bins` array is optional and provides:
   - **bin**: 6-digit BIN number
   - **type**: Card type (CREDIT, DEBIT)
   - **category**: Card tier (CLASSIC, GOLD, PLATINUM, etc.) - use `null` if not applicable
   - **issuer**: Name of the issuing bank

3. **Build and validate**

   ```bash
   node scripts/build.js
   ```

4. **Test the changes**

   ```bash
   cd libs/javascript
   npm test
   ```

5. **Document your source**
   - In your PR description, cite official documentation
   - Include URLs to BIN databases or official specs
   - Explain how you verified the patterns

### Updating Existing Patterns

#### For Single File Brands

1. **Edit the source file** in `data/sources/`
2. **Add a comment** explaining the change
3. **Rebuild** with `node scripts/build.js`
4. **Run tests** to ensure nothing breaks
5. **Document** the reason for the update in your PR

#### For Subfolder-Organized Brands

1. **Edit the appropriate file** in the brand's subfolder (e.g., `data/sources/visa/base.json`)
2. **Add regional data** by creating new files (e.g., `data/sources/visa/es.json`)
3. **Rebuild** with `node scripts/build.js` - files are automatically merged
4. **Run tests** to ensure nothing breaks
5. **Document** the reason for the update in your PR

### Example: Updating Visa Patterns

#### Single file approach:

```json
{
  "scheme": "visa",
  "brand": "Visa",
  "patterns": [
    {
      "bin": "^4",
      "length": [13, 16],
      "luhn": true,
      "cvvLength": 3
    },
    {
      "bin": "^6367",
      "length": [16],
      "luhn": true,
      "cvvLength": 3,
      "comment": "Added: Visa Denmark/Dankort co-brand cards"
    }
  ],
  "type": "credit",
  "countries": ["GLOBAL"]
}
```

#### Subfolder approach (recommended for large datasets):

**data/sources/visa/base.json:**
```json
{
  "scheme": "visa",
  "brand": "Visa",
  "patterns": [
    {
      "bin": "^4",
      "length": [13, 16],
      "luhn": true,
      "cvvLength": 3
    },
    {
      "bin": "^6367",
      "length": [16],
      "luhn": true,
      "cvvLength": 3
    }
  ],
  "type": "credit",
  "countries": ["GLOBAL"]
}
```

**data/sources/visa/detailed.json:**
```json
{
  "scheme": "visa",
  "brand": "Visa",
  "patterns": [
    {
      "bin": "^4",
      "length": [13, 16],
      "luhn": true,
      "cvvLength": 3
    }
  ],
  "type": "credit",
  "countries": ["GLOBAL"],
  "bins": [
    {
      "bin": "491441",
      "type": "CREDIT",
      "category": null,
      "issuer": "BANCO PROSPER, S.A."
    }
  ]
}
```

The build script will merge both files into a single Visa entry.

## 💻 Contributing Code

### Adding Language Implementations

We welcome implementations in any programming language!

1. **Create a directory** in `examples/` for your language
2. **Implement the validator** that reads from `data/brands.json`
3. **Include a README** with usage instructions
4. **Test your implementation** with sample cards
5. **Submit a PR** with your code

### Improving the Build System

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/improve-build-validation
   ```
3. **Make your changes** to `scripts/build.js` or related files
4. **Test thoroughly**
   ```bash
   node scripts/build.js
   # Verify output in data/compiled/ and data/brands.json
   ```
5. **Submit a PR** with clear description

## ✅ Data Quality Guidelines

### Required Documentation

Every data contribution must include:

1. **Source citation**
   - Official card network documentation
   - Published BIN ranges
   - ISO standards
   - Verified test cards

2. **Verification method**
   - How you tested the patterns
   - Sample (anonymized) BINs that match
   - Any edge cases discovered

3. **Change justification**
   - Why this change is necessary
   - What problem it solves
   - Impact on existing patterns

### Data Accuracy Standards

- ✅ Use official sources when available
- ✅ Test patterns with real (anonymized) BINs
- ✅ Include edge cases in patterns
- ✅ Document limitations or uncertainties
- ❌ Don't guess or assume patterns
- ❌ Don't use unverified third-party sources
- ❌ Don't break backward compatibility without discussion

## 🔍 Review Process

### What We Look For

1. **Accuracy** - Patterns must be correct and verified
2. **Completeness** - All required fields present
3. **Documentation** - Sources and reasoning provided
4. **Testing** - Changes don't break existing functionality
5. **Format** - Follows schema and style guidelines

### Timeline

- Initial review: Within 1 week
- Follow-up questions: Please respond within 2 weeks
- Merge: After approval and successful CI checks

## 🚀 Development Workflow

### Setup

```bash
# Clone the repository
git clone https://github.com/renatovico/bin-cc.git
cd bin-cc

# Install JavaScript dependencies (for testing)
cd libs/javascript
npm install
cd ../..
```

### Making Changes

```bash
# Create a branch
git checkout -b update/visa-patterns

# Option 1: Edit single source file
vim data/sources/visa.json

# Option 2: Edit or add files in a subfolder
vim data/sources/visa/base.json
vim data/sources/visa/br.json

# Build (automatically merges subfolder files)
node scripts/build.js

# Test (JavaScript)
cd libs/javascript
npm test
cd ../..

# Commit with descriptive message
git add data/sources/
git commit -m "Update Visa BIN patterns for Brazil"

# Push and create PR
git push origin update/visa-patterns
```

### Commit Message Guidelines

- Use present tense ("Add pattern" not "Added pattern")
- Be specific ("Update Visa Dankort BINs" not "Update data")
- Reference issues when applicable ("Fixes #123")
- Keep first line under 72 characters

## 📝 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New card scheme
- [ ] Update existing patterns
- [ ] Bug fix
- [ ] Documentation
- [ ] Code improvement

## Data Source
- Official docs: [URL]
- Verification: [How you tested]

## Testing
- [ ] Build script runs successfully
- [ ] Tests pass (if applicable)
- [ ] Validated with sample cards

## Checklist
- [ ] Follows schema guidelines
- [ ] Includes source documentation
- [ ] Build script passes
- [ ] Tests updated if needed
```

## 🐛 Reporting Issues

### Data Issues

If you find incorrect BIN patterns:

1. **Search existing issues** to avoid duplicates
2. **Create a new issue** with:
   - Card scheme affected
   - Incorrect pattern details
   - Correct pattern (if known)
   - Source documentation
   - Sample BIN that demonstrates the issue

### Code Issues

For bugs in implementations or build scripts:

1. **Describe the bug** clearly
2. **Include steps to reproduce**
3. **Show expected vs actual behavior**
4. **Include environment details** (Node version, OS, etc.)

## 💬 Questions?

- Open an issue for data questions
- Check `data/SCHEMA.md` for format questions
- Review existing source files for examples

## 📜 Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Welcome newcomers and help them learn
- Assume good intentions

## 🏆 Recognition

Contributors are listed in:
- Git commit history
- Release notes for significant contributions
- README acknowledgments

Thank you for contributing to bin-cc! 🎉
