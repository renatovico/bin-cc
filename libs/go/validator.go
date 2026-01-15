package creditcard

import (
	"regexp"
	"strconv"
	"sync"
)

// Luhn lookup table for doubling digits
var luhnLookup = [10]int{0, 2, 4, 6, 8, 1, 3, 5, 7, 9}

// CompiledBrand holds pre-compiled regex patterns and extracted length constraints
type CompiledBrand struct {
	Name         string
	PriorityOver []string
	MinLength    int
	MaxLength    int
	RegexpBin    *regexp.Regexp
	RegexpFull   *regexp.Regexp
	RegexpCvv    *regexp.Regexp
	OriginalFull string
}

var (
	compiledBrands     []CompiledBrand
	compiledBrandsOnce sync.Once
)

// extractLengthFromRegex extracts min/max length from lookahead pattern like (?=.{15}$) or (?=.{13,16}$)
// Returns the cleaned pattern and the min/max length constraints
func extractLengthFromRegex(pattern string) (cleanPattern string, minLen, maxLen int) {
	minLen = 0
	maxLen = 0
	cleanPattern = pattern

	// Match (?=.{N}$) or (?=.{M,N}$) pattern
	lookaheadPattern := regexp.MustCompile(`\(\?=\.\{(\d+)(,(\d+))?\}\$\)`)
	matches := lookaheadPattern.FindStringSubmatch(pattern)

	if len(matches) > 0 {
		// Remove the lookahead assertion from pattern
		cleanPattern = lookaheadPattern.ReplaceAllString(pattern, "")

		// Extract length constraint
		if matches[2] == "" {
			// Exact length: (?=.{15}$)
			if val, err := strconv.Atoi(matches[1]); err == nil {
				minLen = val
				maxLen = val
			}
		} else {
			// Range: (?=.{13,16}$)
			if val, err := strconv.Atoi(matches[1]); err == nil {
				minLen = val
			}
			if matches[3] != "" {
				if val, err := strconv.Atoi(matches[3]); err == nil {
					maxLen = val
				}
			}
		}
	}

	return cleanPattern, minLen, maxLen
}

func getCompiledBrands() []CompiledBrand {
	compiledBrandsOnce.Do(func() {
		compiledBrands = make([]CompiledBrand, len(Brands))
		for i, brand := range Brands {
			cleanFull, minLen, maxLen := extractLengthFromRegex(brand.RegexpFull)

			compiledBrands[i] = CompiledBrand{
				Name:         brand.Name,
				PriorityOver: brand.PriorityOver,
				MinLength:    minLen,
				MaxLength:    maxLen,
				RegexpBin:    regexp.MustCompile(brand.RegexpBin),
				RegexpFull:   regexp.MustCompile(cleanFull),
				RegexpCvv:    regexp.MustCompile(brand.RegexpCvv),
				OriginalFull: brand.RegexpFull,
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
	cardLen := len(cardNumber)

	// Collect all matching brands
	var matchingBrands []CompiledBrand
	for _, brand := range compiled {
		// Check length constraint if specified
		if brand.MinLength > 0 && cardLen < brand.MinLength {
			continue
		}
		if brand.MaxLength > 0 && cardLen > brand.MaxLength {
			continue
		}

		// Check pattern match
		if brand.RegexpFull.MatchString(cardNumber) {
			matchingBrands = append(matchingBrands, brand)
		}
	}

	if len(matchingBrands) == 0 {
		return nil
	}

	// If only one match, return it
	if len(matchingBrands) == 1 {
		name := matchingBrands[0].Name
		return &name
	}

	// Resolve priority: a brand with priorityOver takes precedence over brands in that list
	matchingNames := make(map[string]bool)
	for _, b := range matchingBrands {
		matchingNames[b.Name] = true
	}

	for _, candidate := range matchingBrands {
		for _, p := range candidate.PriorityOver {
			if matchingNames[p] {
				name := candidate.Name
				return &name
			}
		}
	}

	// No priority winner, return first match
	name := matchingBrands[0].Name
	return &name
}

// FindBrandDetailed returns detailed brand information
func FindBrandDetailed(cardNumber string) *BrandDetailed {
	brandName := FindBrand(cardNumber)
	if brandName == nil {
		return nil
	}

	for _, brand := range GetBrandsDetailed() {
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
	for _, brand := range GetBrandsDetailed() {
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
