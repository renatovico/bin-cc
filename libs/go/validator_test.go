package creditcard

import (
	"testing"
)

func TestLuhnValidNumbers(t *testing.T) {
	tests := []string{
		"4012001037141112", // Visa
		"5533798818319497", // Mastercard
		"378282246310005",  // Amex
	}
	
	for _, cardNumber := range tests {
		if !Luhn(cardNumber) {
			t.Errorf("Luhn(%s) = false, expected true", cardNumber)
		}
	}
}

func TestLuhnInvalidNumbers(t *testing.T) {
	tests := []string{
		"1234567890123456",
		"",
		"4012001037141113",
	}
	
	for _, cardNumber := range tests {
		if Luhn(cardNumber) {
			t.Errorf("Luhn(%s) = true, expected false", cardNumber)
		}
	}
}

func TestFindBrandVisa(t *testing.T) {
	tests := []string{
		"4012001037141112",
		"4551870000000183",
		"6367000000001022",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "visa" {
			t.Errorf("FindBrand(%s) = %v, expected visa", cardNumber, brand)
		}
	}
}

func TestFindBrandMastercard(t *testing.T) {
	tests := []string{
		"5533798818319497",
		"5437251265160938",
		"2221000000000000",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "mastercard" {
			t.Errorf("FindBrand(%s) = %v, expected mastercard", cardNumber, brand)
		}
	}
}

func TestFindBrandAmex(t *testing.T) {
	tests := []string{
		"378282246310005",
		"376411112222331",
		"371449635398431",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "amex" {
			t.Errorf("FindBrand(%s) = %v, expected amex", cardNumber, brand)
		}
	}
}

func TestFindBrandDiscover(t *testing.T) {
	tests := []string{
		"6011236044609927",
		"6011091915358231",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "discover" {
			t.Errorf("FindBrand(%s) = %v, expected discover", cardNumber, brand)
		}
	}
}

func TestFindBrandDiners(t *testing.T) {
	tests := []string{
		"30066909048113",
		"30266056449987",
		"36490102462661",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "diners" {
			t.Errorf("FindBrand(%s) = %v, expected diners", cardNumber, brand)
		}
	}
}

func TestFindBrandElo(t *testing.T) {
	tests := []string{
		"6362970000457013",
		"6363680000000000",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "elo" {
			t.Errorf("FindBrand(%s) = %v, expected elo", cardNumber, brand)
		}
	}
}

func TestFindBrandHipercard(t *testing.T) {
	tests := []string{
		"6062825624254001",
		"6062821294950895",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand == nil || *brand != "hipercard" {
			t.Errorf("FindBrand(%s) = %v, expected hipercard", cardNumber, brand)
		}
	}
}

func TestFindBrandUnsupported(t *testing.T) {
	tests := []string{
		"1234567890123456",
		"",
	}
	
	for _, cardNumber := range tests {
		brand := FindBrand(cardNumber)
		if brand != nil {
			t.Errorf("FindBrand(%s) = %v, expected nil", cardNumber, brand)
		}
	}
}

func TestIsSupported(t *testing.T) {
	if !IsSupported("4012001037141112") {
		t.Error("IsSupported(4012001037141112) = false, expected true")
	}
	if !IsSupported("5533798818319497") {
		t.Error("IsSupported(5533798818319497) = false, expected true")
	}
	if IsSupported("1234567890123456") {
		t.Error("IsSupported(1234567890123456) = true, expected false")
	}
	if IsSupported("") {
		t.Error("IsSupported('') = true, expected false")
	}
}

func TestValidateCVV(t *testing.T) {
	tests := []struct {
		cvv   string
		brand string
		want  bool
	}{
		{"123", "visa", true},
		{"1234", "amex", true},
		{"12", "visa", false},
		{"1234", "visa", false},
		{"", "visa", false},
		{"123", "unknown", false},
	}
	
	for _, tt := range tests {
		got := ValidateCVV(tt.cvv, tt.brand)
		if got != tt.want {
			t.Errorf("ValidateCVV(%s, %s) = %v, want %v", tt.cvv, tt.brand, got, tt.want)
		}
	}
}

func TestGetBrandInfo(t *testing.T) {
	visaInfo := GetBrandInfo("visa")
	if visaInfo == nil {
		t.Error("GetBrandInfo(visa) = nil, expected brand info")
	} else if visaInfo.Name != "visa" {
		t.Errorf("GetBrandInfo(visa).Name = %s, expected visa", visaInfo.Name)
	}
	
	if GetBrandInfo("unknown") != nil {
		t.Error("GetBrandInfo(unknown) != nil, expected nil")
	}
}

func TestGetBrandInfoDetailed(t *testing.T) {
	visaDetailed := GetBrandInfoDetailed("visa")
	if visaDetailed == nil {
		t.Error("GetBrandInfoDetailed(visa) = nil, expected brand info")
	} else {
		if visaDetailed.Scheme != "visa" {
			t.Errorf("GetBrandInfoDetailed(visa).Scheme = %s, expected visa", visaDetailed.Scheme)
		}
		if visaDetailed.Brand != "Visa" {
			t.Errorf("GetBrandInfoDetailed(visa).Brand = %s, expected Visa", visaDetailed.Brand)
		}
		if len(visaDetailed.NumberLengths) == 0 {
			t.Error("GetBrandInfoDetailed(visa).NumberLengths is empty")
		}
	}
	
	if GetBrandInfoDetailed("unknown") != nil {
		t.Error("GetBrandInfoDetailed(unknown) != nil, expected nil")
	}
}

func TestFindBrandDetailed(t *testing.T) {
	brand := FindBrandDetailed("4012001037141112")
	if brand == nil {
		t.Error("FindBrandDetailed(4012001037141112) = nil, expected brand info")
	} else {
		if brand.Scheme != "visa" {
			t.Errorf("FindBrandDetailed(4012001037141112).Scheme = %s, expected visa", brand.Scheme)
		}
		if brand.Brand != "Visa" {
			t.Errorf("FindBrandDetailed(4012001037141112).Brand = %s, expected Visa", brand.Brand)
		}
	}
}

func TestListBrands(t *testing.T) {
	brands := ListBrands()
	if len(brands) == 0 {
		t.Error("ListBrands() returned empty list")
	}
	
	hasVisa := false
	hasMastercard := false
	for _, brand := range brands {
		if brand == "visa" {
			hasVisa = true
		}
		if brand == "mastercard" {
			hasMastercard = true
		}
	}
	
	if !hasVisa {
		t.Error("ListBrands() does not contain visa")
	}
	if !hasMastercard {
		t.Error("ListBrands() does not contain mastercard")
	}
}
