# CreditCard Identifier - Java

Credit Card BIN validation library using bin-cc data.

## Installation

### Maven

```xml
<dependency>
    <groupId>com.creditcard</groupId>
    <artifactId>creditcard-identifier</artifactId>
    <version>2.1.0</version>
</dependency>
```

### Gradle

```gradle
implementation 'com.creditcard:creditcard-identifier:2.1.0'
```

## Usage

```java
import com.creditcard.identifier.CreditCardValidator;

public class Main {
    public static void main(String[] args) {
        CreditCardValidator validator = new CreditCardValidator();
        
        // Find brand
        String brand = validator.findBrand("4012001037141112");
        System.out.println(brand); // "visa"
        
        // Check if supported
        boolean supported = validator.isSupported("4012001037141112");
        System.out.println(supported); // true
        
        // Validate CVV
        boolean validCvv = validator.validateCvv("123", "visa");
        System.out.println(validCvv); // true
        
        // Luhn validation
        boolean validLuhn = CreditCardValidator.luhn("4012001037141112");
        System.out.println(validLuhn); // true
    }
}
```

## Running the Example

```bash
# Compile
mvn compile

# Run example
mvn exec:java -Dexec.mainClass="com.creditcard.identifier.Example"
```

## Features

- **Brand Identification**: Identify card brand by BIN/IIN patterns
- **CVV Validation**: Validate CVV length for each brand
- **Luhn Algorithm**: Validate card numbers using Luhn checksum
- **Detailed Brand Info**: Get comprehensive brand information
- **Performance**: Pre-compiled regex patterns for fast validation

## Supported Brands

See [data/compiled/BRANDS.md](../../data/compiled/BRANDS.md) for the complete list.

## License

MIT License
