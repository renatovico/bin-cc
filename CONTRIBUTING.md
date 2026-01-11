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

3. **Or use the interactive CLI**

   ```bash
   node scripts/create-card.js
   ```

#### Option 2: Subfolder (For Large or Regional Data)

For brands with extensive BIN data or regional variations:

1. **Create a subfolder** in `data/sources/`

   ```bash
   mkdir -p data/sources/jcb
   ```

2. **Create multiple JSON files**

   ```
   data/sources/jcb/
   ├── base.json        # Required: scheme, brand, patterns
   ├── bins-jp.json     # Optional: Japan-specific BINs
   └── bins-us.json     # Optional: US-specific BINs
   ```

3. **Base file** contains full schema:

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

4. **Partial files** contain only `bins`:

   ```json
   {
     "bins": [
       {
         "bin": "356789",
         "type": "CREDIT",
         "category": "GOLD",
         "issuer": "BANK OF JAPAN",
         "countries": ["JP"]
       }
     ]
   }
   ```

5. **Files are automatically merged** by the build script

### Build and Validate

```bash
# Build and validate all
node scripts/build.js

# Validate specific file or directory
node scripts/validate.js data/sources/jcb
```

### Test the Changes

```bash
cd libs/javascript
npm test
```

### Document Your Source

In your PR description, cite official documentation:
- Include URLs to BIN databases or official specs
- Explain how you verified the patterns

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

## 💻 Contributing Code

### Adding Language Implementations

We welcome implementations in any programming language!

1. **Create a directory** in `libs/` for your language
2. **Implement the validator** that reads from compiled data
3. **Include a README** with usage instructions
4. **Test your implementation** with sample cards
5. **Submit a PR** with your code

### Improving the Build System

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/improve-validation
   ```
3. **Make your changes** to `scripts/` files
4. **Test thoroughly**
   ```bash
   node scripts/build.js
   ```
5. **Submit a PR** with clear description

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

# Option 1: Use interactive CLI
node scripts/create-card.js

# Option 2: Edit single source file
vim data/sources/visa.json

# Option 3: Edit files in a subfolder
vim data/sources/visa/base.json
vim data/sources/visa/bins-br-1.json

# Build (automatically merges and validates)
node scripts/build.js

# Test (JavaScript)
cd libs/javascript && npm test && cd ../..

# Commit with descriptive message
git add data/
git commit -m "Add Brazil-specific Visa BIN data"

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
