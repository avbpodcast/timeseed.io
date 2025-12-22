# TimeSeed  - A Time Synchronize passowrd derivation system without middlemen 
A seed string for generating secure AES-GCM encryption messages over any network.

A web standalone web application for encryption on time-based key generation using LockIt and Time-Seed features.
It uses AES encryption alongside entropy to generate a virtual time-synchronized system between correspondents.
Highly flexible use of salting, pepper passwords and AES encryption based on a seed (timeseed) gives the user extreme flexibility for any kind of needs for communications and privacy.

A web-based tool to generate 256-bit AES-GCM keys using a shared 50-character seed. The application supports secure seed generation, optional pepper passphrases, and daily/long-term key derivation with a user-friendly interface. It gives people the ability to just use it as an ordinary encryption tool, but also as a means to "sync" passwords with each other over great distances, using a one-time shared secret or a timeseed only. This gives people a versatile tool that doesn't depend on an ID, central server or set of public/private keys. 

You have a timessed (+optional pepper password) , you have the derived passwords (daily/6 months/custom date) and you have the ability to just use your own passwords directly (or randomly generate one)
It's a small learning curve, with an enormous independently operated buidling block as a result.
You can basically encrypt your communication with anyone freely, and according to your security needs.

## Features
- Generate cryptographically secure 50-character seeds with high-entropy method
- Derive 256-bit AES-GCM keys for daily or long-term use.
- Optional pepper passphrase for enhanced security.
- Smooth progress bar animation during seed generation.
- Responsive design for mobile and desktop.
- Downloadable HTML file for offline and local use.
- Links to related tools and contact information.

- **LockIt**: Encrypt and decrypt text or files using a user-provided key (password).
- **Time-Seed**: Generate time-based keys from a 50-character seed, with optional passphrase (pepper).
- Supports both standard (0 to 10 MB) and large file (10 MB tot 2GB and maybe higher) encryption modes. (above 2GB should be possible depending on which browser and system)
- Built with HTML, CSS, and JavaScript, using Flatpickr for optional custom date selection (default is 24h geneated passwords and 6 months interval passwords).
- Every same message gives another cypher on every encryption, giving reverse-engineering efforts a difficult time.


## Installation
No installation is required! The application runs entirely in any modern browser (safe for Firefox on Ubuntu).

## Using the One-Page Version
The one-page version (`lockit-timeseed-v1_13.html`) is hosted on GitHub Pages at [https://avbpodcast.github.io/timeseed.io](https://avbpodcast.github.io/timeseed.io). It contains all functionality in a single HTML file, ideal for downloading and offline use.

- **Access**: Visit [https://avbpodcast.github.io/timeseed.io](https://avbpodcast.github.io/timeseed.io).
- **Download**: Click the "Download" link in the footer to save `lockit-timeseed-v1_13.html`.
- **Note**: Requires an internet connection for Flatpickr and Google Fonts unless you embed these locally.

### Getting Started
1. Clone the repository: `git clone https://github.com/avbpodcast/timeseed.io.git`
2. Open `index.html` in a modern web browser for testing.
3. Modify `styles.css` or `script.js` as needed.
4. To update the one-page version, manually combine files or use a build script.


## Dependencies
- [Flatpickr](https://flatpickr.js.org/) for date picking.
- Google Fonts (Poppins and Inter).

## For Developers
The repository contains separated files for development and customization:

- `index.html`: HTML structure.
- `styles.css`: CSS styles.
- `script.js`: JavaScript logic.
- `logo_small.png`: Logo image.


## Contact
Visit [timeseed.io](https://timeseed.io) or check the [contact page](https://timeseed.io/contact.html).
nostr: npub1sec6degc3ae7warveuxaz6dlffnc2sutwtqjr7pmll7sf7ypjngsd4p0l7

## PoW is life, give credit and support the project please 
Visit [timeseed.io/donate](https://timeseed.io/donate )

## Structure : 
timeseed.io/
├── index.html                    # One-page version (lockit-timeseed-v1_13.html)
├── dev/
│   ├── index.html               # Developer HTML
│   ├── styles.css
│   ├── script.js
│   └── logo_small.png
├── README.md
├── .gitignore
└── LICENSE                      

## License
Full GNU GPL v3 Text (Free Software Foundation)

## Disclaimer

The TimeSync Key Generator is provided "as is" without any warranties or representations, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. The developers, contributors, and maintainers of this software (collectively, "the Authors") assume no responsibility or liability for any damages, losses, or consequences arising from the use, misuse, or inability to use this software.

By using the TimeSync Key Generator, you acknowledge and agree that:

- The software is intended for generating cryptographic keys based on user-provided seeds and optional passphrases. The security of the generated keys depends on the secrecy and integrity of the inputs, which are solely your responsibility.
- The Authors are not responsible for any loss of data, financial loss, security breaches, or other damages resulting from the use of this software, including but not limited to improper key management, sharing of seeds or passphrases, or vulnerabilities in the user's environment (e.g., browser, operating system, or network).
- The software relies on third-party libraries (e.g., CryptoJS via CDN) and browser APIs (e.g., Web Crypto API). The Authors are not responsible for any issues, vulnerabilities, or failures in these external dependencies.
- You are solely responsible for verifying the integrity and security of the software, especially when downloading or using it offline.
- The Authors do not guarantee the availability, accuracy, or reliability of the software or any linked resources (e.g., footer links to external sites).

Use this software at your own risk. The Authors disclaim all liability for any direct, indirect, incidental, consequential, or special damages, including but not limited to loss of profits, data, or other intangible losses, even if advised of the possibility of such damages. If you do not agree to these terms, do not use the TimeSync Key Generator.


v1.13
June 21, 2025

v1.14
22 dec, 2025 (the file was moved to a dedicated folder, and the footer links were updated (no code changes) 
this results in an update of the hash values.



checksums:

the root , main index.html file v1.13 (all code on one page) subsequential other version checksums will be mentioned in the new releases itself.

*obsolote sum, just FYI*
v1.13 The initial file has the following checksums:

MD5 sum: D9E119C191A41240D0EE1B4CB180A491 

SHA256 : 234350F6B858BE906AB5BFF72037DF9FFC9ECB1991CF8FEC52FAAF74AF16BA3C

--------
Current live correct sum:

v 1.14 (decmber 2025)

MD5 sum: CED9AD8DE8B774924D7141AC36813580

SHA256 sum: A502B0DA1CB4E65CD872E99C745F0960A3D8382C96E28D7D59B806973B0045CF
