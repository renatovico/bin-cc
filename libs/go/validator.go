package creditcard

import (
	"regexp"
	"sync"
)

// Luhn lookup table for doubling digits
var luhnLookup = [10]int{0, 2, 4, 6, 8, 1, 3, 5, 7, 9}

// CompiledBrand holds pre-compiled regex patterns
type CompiledBrand struct {
	Name       string
	RegexpBin  *regexp.Regexp
	RegexpFull *regexp.Regexp
	RegexpCvv  *regexp.Regexp
}

var (
	compiledBrands     []CompiledBrand
	compiledBrandsOnce sync.Once
)

func getCompiledBrands() []CompiledBrand {
	compiledBrandsOnce.Do(func() {
		compiledBrands = make([]CompiledBrand, len(Brands))
		for i, brand := range Brands {
			compiledBrands[i] = CompiledBrand{
				Name:       brand.Name,
				RegexpBin:  regexp.MustCompile(brand.RegexpBin),
				RegexpFull: regexp.MustCompile(brand.RegexpFull),
				RegexpCvv:  regexp.MustCompile(brand.RegexpCvv),
			}
		}
	})
	return compiledBrands
}

// Luhn validates a credit card number using the Luhn algorithm
func Luhn(number string) bool {
	if len(number) == 0 {
		return false
	}

	total := 0
	x2 := true

	for i := len(number) - 1; i >= 0; i-- {
		ch := number[i]
		if ch < '0' || ch > '9' {
			return false
		}
		value := int(ch - '0')

		x2 = !x2
		if x2 {
			total += luhnLookup[value]
		} else {
			total += value
		}
	}

	return total%10 == 0
}

// FindBrand identifies the credit card brand by card number
func FindBrand(cardNumber string) *string {
	if len(cardNumber) == 0 {
		return nil
	}

	compiled := getCompiledBrands()
	for _, brand := range compiled {
		if brand.RegexpFull.MatchString(cardNumber) {
			name := brand.Name
			return &name
		}
	}

	return nil
}

// FindBrandDetailed returns detailed brand information
func FindBrandDetailed(cardNumber string) *BrandDetailed {
	brandName := FindBrand(cardNumber)
	if brandName == nil {
		return nil
	}

	for _, brand := range BrandsDetailed {
		if brand.Scheme == *brandName {
			return &brand
		}
	}

	return nil
}

// IsSupported checks if the card number is supported
func IsSupported(cardNumber string) bool {
	return FindBrand(cardNumber) != nil
}

// ValidateCVV validates CVV for a specific brand
func ValidateCVV(cvv, brandName string) bool {
	if len(cvv) == 0 {
		return false
	}

	compiled := getCompiledBrands()
	for _, brand := range compiled {
		if brand.Name == brandName {
			return brand.RegexpCvv.MatchString(cvv)
		}
	}

	return false
}

// GetBrandInfo returns brand information by name
func GetBrandInfo(brandName string) *Brand {
	for _, brand := range Brands {
		if brand.Name == brandName {
			return &brand
		}
	}
	return nil
}

// GetBrandInfoDetailed returns detailed brand information by scheme
func GetBrandInfoDetailed(scheme string) *BrandDetailed {
	for _, brand := range BrandsDetailed {
		if brand.Scheme == scheme {
			return &brand
		}
	}
	return nil
}

// ListBrands returns all supported brand names
func ListBrands() []string {
	brands := make([]string, len(Brands))
	for i, brand := range Brands {
		brands[i] = brand.Name
	}
	return brands
}
