# frozen_string_literal: true

require_relative 'creditcard_identifier/brands'
require_relative 'creditcard_identifier/brands_detailed'

##
# Credit Card BIN Validator
#
# This module provides credit card validation using bin-cc data.
module CreditcardIdentifier
  VERSION = '2.1.0'

  # Luhn lookup table for doubling digits
  LUHN_LOOKUP = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9].freeze

  ##
  # Validate a credit card number using the Luhn algorithm
  #
  # @param number [String] Credit card number (digits only)
  # @return [Boolean] true if valid according to Luhn algorithm
  # @raise [TypeError] if number is not a string
  def self.luhn(number)
    raise TypeError, 'Expected string input' unless number.is_a?(String)
    return false if number.empty?

    total = 0
    x2 = true

    (number.length - 1).downto(0) do |i|
      value = number[i].ord - 48
      return false if value < 0 || value > 9

      x2 = !x2
      total += x2 ? LUHN_LOOKUP[value] : value
    end

    (total % 10).zero?
  end

  ##
  # Credit card validator using bin-cc data.
  class Validator
    attr_reader :brands, :brands_detailed

    ##
    # Initialize validator with brand data
    def initialize
      @brands = BRANDS
      @brands_detailed = CreditcardIdentifier.brands_detailed
    end

    ##
    # Identify the credit card brand
    #
    # @param card_number [String] Credit card number
    # @param detailed [Boolean] If true, returns detailed brand info
    # @return [Hash, nil] Brand hash or nil if not found
    def find_brand(card_number, detailed: false)
      return nil if card_number.nil? || card_number.empty?

      # Collect all matching brands
      matching_brands = @brands.select do |b|
        b[:regexp_full].match?(card_number)
      end

      return nil if matching_brands.empty?

      # Resolve priority: a brand with priority_over takes precedence
      brand = matching_brands.first
      if matching_brands.length > 1
        matching_names = matching_brands.map { |b| b[:name] }
        matching_brands.each do |candidate|
          priority_over = candidate[:priority_over] || []
          if priority_over.any? { |p| matching_names.include?(p) }
            brand = candidate
            break
          end
        end
      end

      if detailed
        detailed_brand = @brands_detailed.find { |b| b[:scheme] == brand[:name] }
        if detailed_brand
          # Find the specific pattern that matched
          matched_pattern = detailed_brand[:patterns]&.find do |p|
            Regexp.new(p[:bin]).match?(card_number)
          end

          # Find the specific bin that matched (if bins exist)
          bin_prefix = card_number[0, 6]
          matched_bin = detailed_brand[:bins]&.find do |b|
            bin_prefix.start_with?(b[:bin]) || b[:bin] == bin_prefix
          end

          # Return without the full bins array
          result = detailed_brand.reject { |k, _| k == :bins }
          result[:matched_pattern] = matched_pattern
          result[:matched_bin] = matched_bin
          return result
        end
      end

      brand
    end

    ##
    # Check if card number is supported
    #
    # @param card_number [String] Credit card number
    # @return [Boolean] true if supported, false otherwise
    def supported?(card_number)
      !find_brand(card_number).nil?
    end

    ##
    # Validate CVV for a specific brand
    #
    # @param cvv [String] CVV code
    # @param brand_or_name [String, Hash] Brand name or brand object from find_brand
    # @return [Boolean] true if valid, false otherwise
    def validate_cvv(cvv, brand_or_name)
      return false if cvv.nil? || cvv.empty?

      # Handle brand object (Hash)
      if brand_or_name.is_a?(Hash)
        # Handle detailed brand object
        if brand_or_name[:cvv] && brand_or_name[:cvv][:length]
          expected_length = brand_or_name[:cvv][:length]
          return cvv.match?(/^\d{#{expected_length}}$/)
        end
        # Handle simplified brand object
        if brand_or_name[:regexp_cvv]
          return brand_or_name[:regexp_cvv].match?(cvv)
        end
        # Handle brand name from object
        brand_name = brand_or_name[:name] || brand_or_name[:scheme]
        if brand_name
          brand = @brands.find { |b| b[:name] == brand_name }
          return brand&.dig(:regexp_cvv)&.match?(cvv) || false
        end
        return false
      end

      # Handle brand name (String)
      brand = @brands.find { |b| b[:name] == brand_or_name }
      return false if brand.nil?

      brand[:regexp_cvv].match?(cvv)
    end

    ##
    # Get information about a specific brand
    #
    # @param brand_name [String] Brand name (e.g., 'visa', 'mastercard')
    # @return [Hash, nil] Brand hash or nil if not found
    def get_brand_info(brand_name)
      @brands.find { |b| b[:name] == brand_name }
    end

    ##
    # Get detailed information about a specific brand
    #
    # @param scheme [String] Scheme name (e.g., 'visa', 'mastercard')
    # @return [Hash, nil] Detailed brand hash or nil if not found
    def get_brand_info_detailed(scheme)
      @brands_detailed.find { |b| b[:scheme] == scheme }
    end

    ##
    # List all supported brands
    #
    # @return [Array<String>] List of brand names
    def list_brands
      @brands.map { |b| b[:name] }
    end

    ##
    # Validate a credit card number using the Luhn algorithm
    #
    # @param number [String] Credit card number (digits only)
    # @return [Boolean] true if valid according to Luhn algorithm
    def luhn(number)
      CreditcardIdentifier.luhn(number)
    end
  end

  # Module-level convenience methods
  class << self
    ##
    # Get or create the singleton validator instance
    #
    # @return [Validator] The validator instance
    def validator
      @validator ||= Validator.new
    end

    ##
    # Get all brand data
    #
    # @return [Array<Hash>] List of brand hashes
    def brands
      BRANDS
    end

    # Note: brands_detailed is defined in brands_detailed.rb

    ##
    # Identify the credit card brand
    #
    # @param card_number [String] Credit card number
    # @param detailed [Boolean] If true, returns detailed brand info
    # @return [Hash, nil] Brand hash or nil if not found
    def find_brand(card_number, detailed: false)
      validator.find_brand(card_number, detailed: detailed)
    end

    ##
    # Check if card number is supported
    #
    # @param card_number [String] Credit card number
    # @return [Boolean] true if supported, false otherwise
    def supported?(card_number)
      validator.supported?(card_number)
    end

    ##
    # Validate CVV for a specific brand
    #
    # @param cvv [String] CVV code
    # @param brand_or_name [String, Hash] Brand name or brand object
    # @return [Boolean] true if valid, false otherwise
    def validate_cvv(cvv, brand_or_name)
      validator.validate_cvv(cvv, brand_or_name)
    end
  end
end
