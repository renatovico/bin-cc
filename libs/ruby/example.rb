#!/usr/bin/env ruby
# frozen_string_literal: true

# Credit Card Validator - Ruby Example
#
# This example shows how to use the creditcard-identifier gem.
#
# In production, install via: gem install creditcard-identifier

require_relative 'lib/creditcard_identifier'

def main
  puts '=== Credit Card Validator - Ruby Example ==='
  puts

  # Using module-level methods
  puts 'Using module-level methods:'
  puts "Brand of 4012001037141112: #{CreditcardIdentifier.find_brand('4012001037141112')}"
  puts "Is supported: #{CreditcardIdentifier.supported?('4012001037141112')}"
  puts

  # Using the Validator class
  validator = CreditcardIdentifier::Validator.new

  # Example 1: List all brands
  puts "Supported brands: #{validator.list_brands.join(', ')}"
  puts

  # Example 2: Identify card brands
  test_cards = {
    '4012001037141112' => 'visa',
    '5533798818319497' => 'mastercard',
    '378282246310005' => 'amex',
    '6011236044609927' => 'discover',
    '6362970000457013' => 'elo',
    '6062825624254001' => 'hipercard'
  }

  puts 'Card brand identification:'
  test_cards.each do |card, expected|
    brand = validator.find_brand(card)
    status = brand == expected ? '✓' : '✗'
    puts "#{status} #{card}: #{brand} (expected: #{expected})"
  end
  puts

  # Example 3: CVV validation
  puts 'CVV validation:'
  puts "Visa CVV 123: #{validator.validate_cvv('123', 'visa')}"
  puts "Amex CVV 1234: #{validator.validate_cvv('1234', 'amex')}"
  puts "Visa CVV 12: #{validator.validate_cvv('12', 'visa')} (invalid)"
  puts

  # Example 4: Get brand details
  puts 'Visa brand details:'
  visa_info = validator.get_brand_info('visa')
  if visa_info
    puts "  BIN pattern: #{visa_info['regexpBin']}"
    puts "  Full pattern: #{visa_info['regexpFull']}"
    puts "  CVV pattern: #{visa_info['regexpCvv']}"
  else
    puts '  Not found'
  end
end

main if __FILE__ == $PROGRAM_NAME
