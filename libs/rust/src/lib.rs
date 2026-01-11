mod brands;
mod brands_detailed;

use regex::Regex;
use std::sync::OnceLock;

pub use brands::Brand;
pub use brands::BRANDS;
pub use brands_detailed::BrandDetailed;
pub use brands_detailed::Pattern;
pub use brands_detailed::Bin;
pub use brands_detailed::BRANDS as BRANDS_DETAILED;

/// Luhn lookup table for doubling digits
const LUHN_LOOKUP: [u8; 10] = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

/// Pre-compiled regex patterns for better performance
struct CompiledBrand {
    name: &'static str,
    min_length: usize,
    max_length: usize,
    regexp_bin: Regex,
    regexp_full: Regex,
    regexp_cvv: Regex,
}

static COMPILED_BRANDS: OnceLock<Vec<CompiledBrand>> = OnceLock::new();

/// Extract length constraints from regex pattern like (?=.{15}$) or (?=.{13,16}$)
/// Returns (clean_pattern, min_length, max_length)
fn extract_length_from_regex(pattern: &str) -> (String, usize, usize) {
    let re = Regex::new(r"\(\?=\.\{(\d+)(,(\d+))?\}\$\)").unwrap();
    
    if let Some(caps) = re.captures(pattern) {
        let clean_pattern = re.replace(pattern, "").to_string();
        
        let min_len = caps.get(1)
            .and_then(|m| m.as_str().parse::<usize>().ok())
            .unwrap_or(0);
        
        let max_len = if caps.get(2).is_some() {
            // Range format: (?=.{13,16}$)
            caps.get(3)
                .and_then(|m| m.as_str().parse::<usize>().ok())
                .unwrap_or(0)
        } else {
            // Exact format: (?=.{15}$)
            min_len
        };
        
        (clean_pattern, min_len, max_len)
    } else {
        (pattern.to_string(), 0, 0)
    }
}

fn get_compiled_brands() -> &'static Vec<CompiledBrand> {
    COMPILED_BRANDS.get_or_init(|| {
        BRANDS
            .iter()
            .map(|brand| {
                let (clean_full, min_len, max_len) = extract_length_from_regex(brand.regexp_full);
                
                CompiledBrand {
                    name: brand.name,
                    min_length: min_len,
                    max_length: max_len,
                    regexp_bin: Regex::new(brand.regexp_bin).unwrap(),
                    regexp_full: Regex::new(&clean_full).unwrap(),
                    regexp_cvv: Regex::new(brand.regexp_cvv).unwrap(),
                }
            })
            .collect()
    })
}

/// Validate a credit card number using the Luhn algorithm
///
/// # Arguments
///
/// * `number` - Credit card number (digits only)
///
/// # Returns
///
/// `true` if valid according to Luhn algorithm, `false` otherwise
pub fn luhn(number: &str) -> bool {
    if number.is_empty() {
        return false;
    }

    let mut total = 0u32;
    let mut x2 = true;

    for ch in number.chars().rev() {
        let value = match ch.to_digit(10) {
            Some(d) => d as u8,
            None => return false,
        };

        x2 = !x2;
        total += if x2 {
            LUHN_LOOKUP[value as usize] as u32
        } else {
            value as u32
        };
    }

    total % 10 == 0
}

/// Find card brand by card number
///
/// # Arguments
///
/// * `card_number` - Credit card number
///
/// # Returns
///
/// Brand name or `None` if not found
pub fn find_brand(card_number: &str) -> Option<&'static str> {
    if card_number.is_empty() {
        return None;
    }

    let compiled = get_compiled_brands();
    let card_len = card_number.len();
    
    compiled
        .iter()
        .find(|brand| {
            // Check length constraint if specified
            if brand.min_length > 0 && card_len < brand.min_length {
                return false;
            }
            if brand.max_length > 0 && card_len > brand.max_length {
                return false;
            }
            
            // Check pattern match
            brand.regexp_full.is_match(card_number)
        })
        .map(|brand| brand.name)
}

/// Find card brand with detailed information
///
/// # Arguments
///
/// * `card_number` - Credit card number
///
/// # Returns
///
/// Detailed brand information or `None` if not found
pub fn find_brand_detailed(card_number: &str) -> Option<&'static BrandDetailed> {
    let brand_name = find_brand(card_number)?;
    BRANDS_DETAILED
        .iter()
        .find(|b| b.scheme == brand_name)
}

/// Check if card number is supported
///
/// # Arguments
///
/// * `card_number` - Credit card number
///
/// # Returns
///
/// `true` if supported, `false` otherwise
pub fn is_supported(card_number: &str) -> bool {
    find_brand(card_number).is_some()
}

/// Validate CVV for a brand
///
/// # Arguments
///
/// * `cvv` - CVV code
/// * `brand_name` - Brand name (e.g., "visa", "mastercard")
///
/// # Returns
///
/// `true` if valid, `false` otherwise
pub fn validate_cvv(cvv: &str, brand_name: &str) -> bool {
    if cvv.is_empty() {
        return false;
    }

    let compiled = get_compiled_brands();
    compiled
        .iter()
        .find(|brand| brand.name == brand_name)
        .map(|brand| brand.regexp_cvv.is_match(cvv))
        .unwrap_or(false)
}

/// Get brand info by name
///
/// # Arguments
///
/// * `brand_name` - Brand name
///
/// # Returns
///
/// Brand info or `None`
pub fn get_brand_info(brand_name: &str) -> Option<&'static Brand> {
    BRANDS.iter().find(|b| b.name == brand_name)
}

/// Get detailed brand info by scheme name
///
/// # Arguments
///
/// * `scheme` - Scheme name (e.g., "visa", "mastercard")
///
/// # Returns
///
/// Detailed brand info or `None`
pub fn get_brand_info_detailed(scheme: &str) -> Option<&'static BrandDetailed> {
    BRANDS_DETAILED.iter().find(|b| b.scheme == scheme)
}

/// List all supported brands
///
/// # Returns
///
/// Array of brand names
pub fn list_brands() -> Vec<&'static str> {
    BRANDS.iter().map(|b| b.name).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_luhn() {
        assert!(luhn("4012001037141112"));
        assert!(!luhn("4012001037141113"));
    }

    #[test]
    fn test_find_brand() {
        assert_eq!(find_brand("4012001037141112"), Some("visa"));
        assert_eq!(find_brand("5533798818319497"), Some("mastercard"));
        assert_eq!(find_brand("1234567890123456"), None);
    }

    #[test]
    fn test_is_supported() {
        assert!(is_supported("4012001037141112"));
        assert!(!is_supported("1234567890123456"));
    }

    #[test]
    fn test_validate_cvv() {
        assert!(validate_cvv("123", "visa"));
        assert!(validate_cvv("1234", "amex"));
        assert!(!validate_cvv("12", "visa"));
    }
}
