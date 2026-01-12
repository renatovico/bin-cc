use creditcard_identifier::*;

#[test]
fn test_luhn_valid_numbers() {
    assert!(luhn("4012001037141112"), "Valid Visa");
    assert!(luhn("5533798818319497"), "Valid Mastercard");
    assert!(luhn("378282246310005"), "Valid Amex");
}

#[test]
fn test_luhn_invalid_numbers() {
    assert!(!luhn("1234567890123456"), "Invalid number");
    assert!(!luhn(""), "Empty string");
    assert!(!luhn("4012001037141113"), "Modified valid number");
}

#[test]
fn test_find_brand_visa() {
    assert_eq!(find_brand("4012001037141112"), Some("visa"));
    assert_eq!(find_brand("4551870000000183"), Some("visa"));
    assert_eq!(find_brand("6367000000001022"), Some("visa"));
}

#[test]
fn test_find_brand_mastercard() {
    assert_eq!(find_brand("5533798818319497"), Some("mastercard"));
    assert_eq!(find_brand("5437251265160938"), Some("mastercard"));
    assert_eq!(find_brand("2221000000000000"), Some("mastercard"));
}

#[test]
fn test_find_brand_amex() {
    assert_eq!(find_brand("378282246310005"), Some("amex"));
    assert_eq!(find_brand("376411112222331"), Some("amex"));
    assert_eq!(find_brand("371449635398431"), Some("amex"));
}

#[test]
fn test_find_brand_discover() {
    assert_eq!(find_brand("6011236044609927"), Some("discover"));
    assert_eq!(find_brand("6011091915358231"), Some("discover"));
}

#[test]
fn test_find_brand_diners() {
    assert_eq!(find_brand("30066909048113"), Some("diners"));
    assert_eq!(find_brand("30266056449987"), Some("diners"));
    assert_eq!(find_brand("36490102462661"), Some("diners"));
}

#[test]
fn test_find_brand_elo() {
    assert_eq!(find_brand("6362970000457013"), Some("elo"));
    assert_eq!(find_brand("6363680000000000"), Some("elo"));
}

#[test]
fn test_find_brand_hipercard() {
    assert_eq!(find_brand("6062825624254001"), Some("hipercard"));
    assert_eq!(find_brand("6062821294950895"), Some("hipercard"));
}

#[test]
fn test_find_brand_unsupported() {
    assert_eq!(find_brand("1234567890123456"), None);
    assert_eq!(find_brand(""), None);
}

#[test]
fn test_is_supported() {
    assert!(is_supported("4012001037141112"));
    assert!(is_supported("5533798818319497"));
    assert!(!is_supported("1234567890123456"));
    assert!(!is_supported(""));
}

#[test]
fn test_validate_cvv() {
    assert!(validate_cvv("123", "visa"));
    assert!(validate_cvv("1234", "amex"));
    assert!(!validate_cvv("12", "visa"));
    assert!(!validate_cvv("1234", "visa"));
    assert!(!validate_cvv("", "visa"));
    assert!(!validate_cvv("123", "unknown"));
}

#[test]
fn test_get_brand_info() {
    let visa_info = get_brand_info("visa");
    assert!(visa_info.is_some());
    assert_eq!(visa_info.unwrap().name, "visa");
    
    assert!(get_brand_info("unknown").is_none());
}

#[test]
fn test_get_brand_info_detailed() {
    let visa_detailed = get_brand_info_detailed("visa");
    assert!(visa_detailed.is_some());
    let visa = visa_detailed.unwrap();
    assert_eq!(visa.scheme, "visa");
    assert_eq!(visa.brand, "Visa");
    assert!(visa.number_lengths.len() > 0);
    
    assert!(get_brand_info_detailed("unknown").is_none());
}

#[test]
fn test_find_brand_detailed() {
    let brand = find_brand_detailed("4012001037141112");
    assert!(brand.is_some());
    let brand_unwrapped = brand.unwrap();
    assert_eq!(brand_unwrapped.scheme, "visa");
    assert_eq!(brand_unwrapped.brand, "Visa");
}

#[test]
fn test_list_brands() {
    let brands = list_brands();
    assert!(brands.len() > 0);
    assert!(brands.contains(&"visa"));
    assert!(brands.contains(&"mastercard"));
}
