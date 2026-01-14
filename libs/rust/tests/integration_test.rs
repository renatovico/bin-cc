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
    // Static ELO BINs
    assert_eq!(find_brand("4011780000000000"), Some("elo"));
    assert_eq!(find_brand("4011790000000000"), Some("elo"));
    assert_eq!(find_brand("4312740000000000"), Some("elo"));
    assert_eq!(find_brand("4389350000000000"), Some("elo"));
    assert_eq!(find_brand("4514160000000000"), Some("elo"));
    assert_eq!(find_brand("4573930000000000"), Some("elo"));
    assert_eq!(find_brand("4576310000000000"), Some("elo"));
    assert_eq!(find_brand("4576320000000000"), Some("elo"));
    assert_eq!(find_brand("5041750000000000"), Some("elo"));
    assert_eq!(find_brand("6277800000000000"), Some("elo"));
    // ELO ranges
    assert_eq!(find_brand("5066990000000000"), Some("elo"));
    assert_eq!(find_brand("5067770000000000"), Some("elo"));
    assert_eq!(find_brand("5090000000000000"), Some("elo"));
    assert_eq!(find_brand("5099980000000000"), Some("elo"));
    assert_eq!(find_brand("6500310000000000"), Some("elo"));
    assert_eq!(find_brand("6500350000000000"), Some("elo"));
    assert_eq!(find_brand("6504050000000000"), Some("elo"));
    assert_eq!(find_brand("6505410000000000"), Some("elo"));
    assert_eq!(find_brand("6507000000000000"), Some("elo"));
    assert_eq!(find_brand("6509010000000000"), Some("elo"));
    assert_eq!(find_brand("6516520000000000"), Some("elo"));
    assert_eq!(find_brand("6550000000000000"), Some("elo"));
    assert_eq!(find_brand("6550210000000000"), Some("elo"));
}

#[test]
fn test_find_brand_elo_invalid() {
    // These should NOT be ELO
    let result = find_brand("4011770000000000");
    assert!(result.is_none() || result != Some("elo"), "4011770000000000 should NOT be ELO");
    let result = find_brand("4011800000000000");
    assert!(result.is_none() || result != Some("elo"), "4011800000000000 should NOT be ELO");
    let result = find_brand("5066980000000000");
    assert!(result.is_none() || result != Some("elo"), "5066980000000000 should NOT be ELO");
    let result = find_brand("6500340000000000");
    assert!(result.is_none() || result != Some("elo"), "6500340000000000 should NOT be ELO");
}

#[test]
fn test_find_brand_aura() {
    assert_eq!(find_brand("5000000000000000"), Some("aura"));
    assert_eq!(find_brand("5010000000000000"), Some("aura"));
    assert_eq!(find_brand("5020000000000000"), Some("aura"));
    assert_eq!(find_brand("5030000000000000"), Some("aura"));
    assert_eq!(find_brand("5040000000000000"), Some("aura"));
    assert_eq!(find_brand("5050000000000000"), Some("aura"));
    assert_eq!(find_brand("5060000000000000"), Some("aura"));
    assert_eq!(find_brand("5070000000000000"), Some("aura"));
    assert_eq!(find_brand("5080000000000000"), Some("aura"));
    assert_eq!(find_brand("5078601912345600019"), Some("aura"));
    assert_eq!(find_brand("5078601800003247449"), Some("aura"));
    assert_eq!(find_brand("5078601870000127985"), Some("aura"));
}

#[test]
fn test_find_brand_aura_invalid() {
    // These should NOT be Aura (wrong length)
    let result = find_brand("510000000000000");
    assert!(result.is_none() || result != Some("aura"), "510000000000000 should NOT be Aura");
    let result = find_brand("500000000000000");
    assert!(result.is_none() || result != Some("aura"), "500000000000000 should NOT be Aura");
    let result = find_brand("5100000000000000");
    assert!(result.is_none() || result != Some("aura"), "5100000000000000 should NOT be Aura");
}

#[test]
fn test_find_brand_hipercard() {
    assert_eq!(find_brand("6062825624254001"), Some("hipercard"));
    assert_eq!(find_brand("6062821294950895"), Some("hipercard"));
    assert_eq!(find_brand("6062827452101536"), Some("hipercard"));
    assert_eq!(find_brand("6062827557052048"), Some("hipercard"));
    assert_eq!(find_brand("3841001111222233334"), Some("hipercard"));
    assert_eq!(find_brand("3841401111222233334"), Some("hipercard"));
    assert_eq!(find_brand("3841601111222233334"), Some("hipercard"));
}

#[test]
fn test_find_brand_diners_more() {
    assert_eq!(find_brand("38605306210123"), Some("diners"));
    assert_eq!(find_brand("30111122223331"), Some("diners"));
    assert_eq!(find_brand("30569309025904"), Some("diners"));
    assert_eq!(find_brand("38520000023237"), Some("diners"));
}

#[test]
fn test_find_brand_diners_invalid() {
    // These should NOT be Diners
    let result = find_brand("310000000000000");
    assert!(result.is_none() || result != Some("diners"), "310000000000000 should NOT be Diners");
    let result = find_brand("300000000000000");
    assert!(result.is_none() || result != Some("diners"), "300000000000000 should NOT be Diners");
    let result = find_brand("370000000000000");
    assert!(result.is_none() || result != Some("diners"), "370000000000000 should NOT be Diners");
}

#[test]
fn test_find_brand_discover_more() {
    assert_eq!(find_brand("6011726125958524"), Some("discover"));
    assert_eq!(find_brand("6511020000245045"), Some("discover"));
}

#[test]
fn test_find_brand_mastercard_more() {
    assert_eq!(find_brand("5101514275875158"), Some("mastercard"));
    assert_eq!(find_brand("5313557320486111"), Some("mastercard"));
    assert_eq!(find_brand("5216730016991151"), Some("mastercard"));
    assert_eq!(find_brand("2720990000000000"), Some("mastercard"));
}

#[test]
fn test_find_brand_visa_more() {
    assert_eq!(find_brand("4073020000000002"), Some("visa"));
    assert_eq!(find_brand("4012001038443335"), Some("visa"));
    assert_eq!(find_brand("4024007190131"), Some("visa"));
    assert_eq!(find_brand("4556523434899"), Some("visa"));
    assert_eq!(find_brand("4477509054445560"), Some("visa"));
    assert_eq!(find_brand("4146805709584576"), Some("visa"));
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
