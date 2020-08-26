# Contributing guidelines

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Coding Style](#coding-style)
  - [Solidity](#solidity)
  - [JavaScript](#javascript)
  - [Python](#python)
- [Documentation](#documentation)
  - [mkdocs](#mkdocs)

## Coding Style

### Solidity

* Solidity portions of the codebase adhere follow the official [Solidity Styleguide]

### JavaScript

### Python

* Python portions of the codebase follow standard PEP8 best practices.
* Python code must be formatted using the Black formatter using the provided settings.

## Documentation

New addition to the codebase must be fully documented.

- JavaScript portions of the code should be annotated using JSDoc style docstrings.
- Solidity portions of the code should be fully annotated using [NatSpec] and [Solidity Domain for Sphinx].

Documentation is generated using [solidity-docgen] and rendered via [mkdocs].
[solidity-docgen] parses NatSpec and outputs `.md` files inside `docs/md-build` according
to an Handlebars template located at `docs/solidity-docgen-templates/contract.hbs`.

**NOTE:** Each `.sol` file should contain only one `Interface` or `Contract`.

To build the documentation:

```console
yarn docs
```

To serve the documentation

```console
yarn docs:serve
```

### mkdocs

To install [mkdocs] Python must be installed in the system.

```
pip install docs/requirements.in
```

**NOTE:** Working inside a virtual environment is highly recommended!

---

[Solidity Styleguide]: https://solidity.readthedocs.io/en/v0.7.0/style-guide.html
[NatSpec]: https://solidity.readthedocs.io/en/v0.7.0/style-guide.html#natspec
[Write the Docs!]: docs/source/write_the_docs.rst
[solidity-docgen]: https://github.com/OpenZeppelin/solidity-docgen
[mkdocs]: https://www.mkdocs.org/
