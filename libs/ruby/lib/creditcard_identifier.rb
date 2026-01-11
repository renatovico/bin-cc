# frozen_string_literal: true

require_relative 'creditcard_identifier/brands'

##
# Credit Card BIN Validator
#
# This module provides credit card validation using bin-cc data.
module CreditcardIdentifier
  VERSION = '2.0.0'

  ##
  # Credit card validator using bin-cc data.
  class Validator
    attr_reader :brands

    ##
    # Initialize validator with brand data
    def initialize
      @brands = BRANDS
    end

    ##
    # Identify the credit card brand
    #
    # @param card_number [String] Credit card number
    # @return [String, nil] Brand name or nil if not found
    def find_brand(card_number)
      return nil if card_number.nil? || card_number.empty?

      brand = @brands.find do |b|
        b[:regexp_full].match?(card_number)
      end

      brand ? brand[:name] : nil
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
    # @param brand_name [String] Brand name (e.g., 'visa', 'mastercard')
    # @return [Boolean] true if valid, false otherwise
    def validate_cvv(cvv, brand_name)
      brand = get_brand_info(brand_name)
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
    # List all supported brands
    #
    # @return [Array<String>] List of brand names
    def list_brands
      @brands.map { |b| b[:name] }
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
    # Identify the credit card brand
    #
    # @param card_number [String] Credit card number
    # @return [String, nil] Brand name or nil if not found
    def find_brand(card_number)
      validator.find_brand(card_number)
    end

    ##
    # Check if card number is supported
    #
    # @param card_number [String] Credit card number
    # @return [Boolean] true if supported, false otherwise
    def supported?(card_number)
      validator.supported?(card_number)
    end
  end
end
