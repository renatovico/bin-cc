use creditcard_identifier::*;
use std::collections::HashMap;

fn main() {
    println!("=== Credit Card Validator - Rust Example ===\n");

    // Example 1: List all brands
    println!("Supported brands: {}", list_brands().join(", "));
    println!();

    // Example 2: Identify card brands
    let mut test_cards = HashMap::new();
    test_cards.insert("4012001037141112", "visa");
    test_cards.insert("5533798818319497", "mastercard");
    test_cards.insert("378282246310005", "amex");
    test_cards.insert("6011236044609927", "discover");
    test_cards.insert("6362970000457013", "elo");
    test_cards.insert("6062825624254001", "hipercard");
    test_cards.insert("6220123456789012", "unionpay");
    test_cards.insert("6759123456789012", "maestro");

    println!("Card brand identification:");
    for (card, expected) in &test_cards {
        let brand = find_brand(card).unwrap_or("unknown");
        let status = if brand == *expected { "✓" } else { "✗" };
        println!("{} {}: {} (expected: {})", status, card, brand, expected);
    }
    println!();

    // Example 3: Check if card is supported
    println!("Check if card is supported:");
    println!("Visa card supported: {}", is_supported("4012001037141112"));
    println!("Invalid card supported: {}", is_supported("1234567890123456"));
    println!();

    // Example 4: CVV validation
    println!("CVV validation:");
    println!("Visa CVV 123: {}", validate_cvv("123", "visa"));
    println!("Amex CVV 1234: {}", validate_cvv("1234", "amex"));
    println!("Visa CVV 12: {} (invalid)", validate_cvv("12", "visa"));
    println!();

    // Example 5: Get brand details
    println!("Visa brand details:");
    if let Some(visa_info) = get_brand_info("visa") {
        println!("  Name: {}", visa_info.name);
        println!("  BIN pattern: {}", visa_info.regexp_bin);
        println!("  Full pattern: {}", visa_info.regexp_full);
        println!("  CVV pattern: {}", visa_info.regexp_cvv);
    }
    println!();

    // Example 6: Get detailed brand information
    println!("Visa detailed info:");
    if let Some(visa_detailed) = get_brand_info_detailed("visa") {
        println!("  Scheme: {}", visa_detailed.scheme);
        println!("  Brand: {}", visa_detailed.brand);
        println!("  Type: {:?}", visa_detailed.brand_type);
    }
    println!();

    // Example 7: Luhn validation
    println!("Luhn validation:");
    println!("Valid card: {}", luhn("4012001037141112"));
    println!("Invalid card: {}", luhn("4012001037141113"));
}
