# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = 'creditcard-identifier'
  spec.version       = '1.0.0'
  spec.authors       = ['bin-cc contributors']
  spec.email         = []

  spec.summary       = 'Credit card BIN validation using bin-cc data'
  spec.description   = 'A Ruby library for credit card BIN validation and brand identification'
  spec.homepage      = 'https://github.com/renatovico/bin-cc'
  spec.license       = 'MIT'
  spec.required_ruby_version = '>= 2.5.0'

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['source_code_uri'] = 'https://github.com/renatovico/bin-cc'
  spec.metadata['documentation_uri'] = 'https://github.com/renatovico/bin-cc/tree/main/libs/ruby'

  # Specify which files should be added to the gem when it is released.
  spec.files = Dir[
    'lib/**/*',
    'data/**/*',
    'README.md',
    'LICENSE'
  ]
  spec.require_paths = ['lib']

  # Runtime dependencies
  spec.add_dependency 'json', '~> 2.0'

  # Development dependencies
  spec.add_development_dependency 'minitest', '~> 5.0'
  spec.add_development_dependency 'rake', '~> 13.0'
end
