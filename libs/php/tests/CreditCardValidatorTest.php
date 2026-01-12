<?php

use PHPUnit\Framework\TestCase;
use CreditCard\Identifier\CreditCardValidator;

require_once __DIR__ . '/../src/BrandData.php';
require_once __DIR__ . '/../src/BrandDataDetailed.php';
require_once __DIR__ . '/../src/CreditCardValidator.php';

class CreditCardValidatorTest extends TestCase
{
    private $validator;
    
    protected function setUp(): void
    {
        $this->validator = new CreditCardValidator();
    }
    
    public function testLuhnValidNumbers()
    {
        $this->assertTrue(CreditCardValidator::luhn('4012001037141112'));
        $this->assertTrue(CreditCardValidator::luhn('5533798818319497'));
        $this->assertTrue(CreditCardValidator::luhn('378282246310005'));
    }
    
    public function testLuhnInvalidNumbers()
    {
        $this->assertFalse(CreditCardValidator::luhn('1234567890123456'));
        $this->assertFalse(CreditCardValidator::luhn(''));
        $this->assertFalse(CreditCardValidator::luhn('4012001037141113'));
    }
    
    public function testFindBrandVisa()
    {
        $this->assertEquals('visa', $this->validator->findBrand('4012001037141112'));
        $this->assertEquals('visa', $this->validator->findBrand('4551870000000183'));
        $this->assertEquals('visa', $this->validator->findBrand('6367000000001022'));
    }
    
    public function testFindBrandMastercard()
    {
        $this->assertEquals('mastercard', $this->validator->findBrand('5533798818319497'));
        $this->assertEquals('mastercard', $this->validator->findBrand('5437251265160938'));
        $this->assertEquals('mastercard', $this->validator->findBrand('2221000000000000'));
    }
    
    public function testFindBrandAmex()
    {
        $this->assertEquals('amex', $this->validator->findBrand('378282246310005'));
        $this->assertEquals('amex', $this->validator->findBrand('376411112222331'));
        $this->assertEquals('amex', $this->validator->findBrand('371449635398431'));
    }
    
    public function testFindBrandDiscover()
    {
        $this->assertEquals('discover', $this->validator->findBrand('6011236044609927'));
        $this->assertEquals('discover', $this->validator->findBrand('6011091915358231'));
    }
    
    public function testFindBrandDiners()
    {
        $this->assertEquals('diners', $this->validator->findBrand('30066909048113'));
        $this->assertEquals('diners', $this->validator->findBrand('30266056449987'));
        $this->assertEquals('diners', $this->validator->findBrand('36490102462661'));
    }
    
    public function testFindBrandElo()
    {
        $this->assertEquals('elo', $this->validator->findBrand('6362970000457013'));
        $this->assertEquals('elo', $this->validator->findBrand('6363680000000000'));
    }
    
    public function testFindBrandHipercard()
    {
        $this->assertEquals('hipercard', $this->validator->findBrand('6062825624254001'));
        $this->assertEquals('hipercard', $this->validator->findBrand('6062821294950895'));
    }
    
    public function testFindBrandUnsupported()
    {
        $this->assertNull($this->validator->findBrand('1234567890123456'));
        $this->assertNull($this->validator->findBrand(''));
    }
    
    public function testIsSupported()
    {
        $this->assertTrue($this->validator->isSupported('4012001037141112'));
        $this->assertTrue($this->validator->isSupported('5533798818319497'));
        $this->assertFalse($this->validator->isSupported('1234567890123456'));
        $this->assertFalse($this->validator->isSupported(''));
    }
    
    public function testValidateCvv()
    {
        $this->assertTrue($this->validator->validateCvv('123', 'visa'));
        $this->assertTrue($this->validator->validateCvv('1234', 'amex'));
        $this->assertFalse($this->validator->validateCvv('12', 'visa'));
        $this->assertFalse($this->validator->validateCvv('1234', 'visa'));
        $this->assertFalse($this->validator->validateCvv('', 'visa'));
        $this->assertFalse($this->validator->validateCvv('123', 'unknown'));
    }
    
    public function testGetBrandInfo()
    {
        $visaInfo = $this->validator->getBrandInfo('visa');
        $this->assertNotNull($visaInfo);
        $this->assertEquals('visa', $visaInfo['name']);
        
        $this->assertNull($this->validator->getBrandInfo('unknown'));
    }
    
    public function testGetBrandInfoDetailed()
    {
        $visaDetailed = $this->validator->getBrandInfoDetailed('visa');
        $this->assertNotNull($visaDetailed);
        $this->assertEquals('visa', $visaDetailed['scheme']);
        $this->assertEquals('Visa', $visaDetailed['brand']);
        $this->assertNotEmpty($visaDetailed['number']['lengths']);
        
        $this->assertNull($this->validator->getBrandInfoDetailed('unknown'));
    }
    
    public function testFindBrandDetailed()
    {
        $brand = $this->validator->findBrandDetailed('4012001037141112');
        $this->assertNotNull($brand);
        $this->assertEquals('visa', $brand['scheme']);
        $this->assertEquals('Visa', $brand['brand']);
    }
    
    public function testListBrands()
    {
        $brands = $this->validator->listBrands();
        $this->assertNotEmpty($brands);
        $this->assertContains('visa', $brands);
        $this->assertContains('mastercard', $brands);
    }
}
