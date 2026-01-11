<?php

require_once __DIR__ . '/src/BrandData.php';
require_once __DIR__ . '/src/BrandDataDetailed.php';
require_once __DIR__ . '/src/CreditCardValidator.php';

use CreditCard\Identifier\CreditCardValidator;

echo "=== Credit Card Validator - PHP Example ===\n\n";

$validator = new CreditCardValidator();

// Example 1: List all brands
echo "Supported brands: " . implode(", ", $validator->listBrands()) . "\n\n";

// Example 2: Identify card brands
$testCards = [
    '4012001037141112' => 'visa',
    '5533798818319497' => 'mastercard',
    '378282246310005' => 'amex',
    '6011236044609927' => 'discover',
    '6362970000457013' => 'elo',
    '6062825624254001' => 'hipercard',
    '6220123456789012' => 'unionpay',
    '6759123456789012' => 'maestro',
];

echo "Card brand identification:\n";
foreach ($testCards as $card => $expected) {
    $brandName = $validator->findBrand($card);
    $status = $brandName === $expected ? '✓' : '✗';
    echo "$status $card: $brandName (expected: $expected)\n";
}
echo "\n";

// Example 3: Check if card is supported
echo "Check if card is supported:\n";
echo "Visa card supported: " . ($validator->isSupported('4012001037141112') ? 'true' : 'false') . "\n";
echo "Invalid card supported: " . ($validator->isSupported('1234567890123456') ? 'true' : 'false') . "\n";
echo "\n";

// Example 4: CVV validation
echo "CVV validation:\n";
echo "Visa CVV 123: " . ($validator->validateCvv('123', 'visa') ? 'true' : 'false') . "\n";
echo "Amex CVV 1234: " . ($validator->validateCvv('1234', 'amex') ? 'true' : 'false') . "\n";
echo "Visa CVV 12: " . ($validator->validateCvv('12', 'visa') ? 'true' : 'false') . " (invalid)\n";
echo "\n";

// Example 5: Get brand details
echo "Visa brand details:\n";
$visaInfo = $validator->getBrandInfo('visa');
if ($visaInfo !== null) {
    echo "  Name: {$visaInfo['name']}\n";
    echo "  BIN pattern: {$visaInfo['regexpBin']}\n";
    echo "  Full pattern: {$visaInfo['regexpFull']}\n";
    echo "  CVV pattern: {$visaInfo['regexpCvv']}\n";
}
echo "\n";

// Example 6: Get detailed brand information
echo "Visa detailed info:\n";
$visaDetailed = $validator->getBrandInfoDetailed('visa');
if ($visaDetailed !== null) {
    echo "  Scheme: {$visaDetailed['scheme']}\n";
    echo "  Brand: {$visaDetailed['brand']}\n";
    echo "  Type: {$visaDetailed['type']}\n";
}
echo "\n";

// Example 7: Find brand with detailed info
echo "Find brand with detailed info:\n";
$brandDetailed = $validator->findBrandDetailed('4012001037141112');
if ($brandDetailed !== null) {
    echo "  Scheme: {$brandDetailed['scheme']}\n";
    echo "  Brand: {$brandDetailed['brand']}\n";
    echo "  Type: {$brandDetailed['type']}\n";
}
echo "\n";

// Example 8: Luhn validation
echo "Luhn validation:\n";
echo "Valid card: " . (CreditCardValidator::luhn('4012001037141112') ? 'true' : 'false') . "\n";
echo "Invalid card: " . (CreditCardValidator::luhn('4012001037141113') ? 'true' : 'false') . "\n";
