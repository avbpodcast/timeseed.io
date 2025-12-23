# TimeSeed v2

TimeSeed v2 is a standalone, browser-based tool for generating strong, time-based encryption keys (Argon2) and encrypting/decrypting messages and files using AES-GCM.

It combines **deterministic key derivation** with modern authenticated encryption (**Argon2id + AES-GCM**) — all in a single offline-capable HTML file.

**No servers. No accounts. No key exchange required.**

Security relies on pre-shared secrets:  
- A **50-character TimeSeed** (which can be public)  
- An optional **secret pepper password**

## Key Features

- **TimeSeed section**: Generate or enter a 50-character seed, add an optional pepper, and derive 256-bit keys that change:
  - Daily (00:00 UTC)
  - Every 6 months (long-term/semester keys)
  - Custom dates supported
- **LockIt section**: Encrypt/decrypt text or files using any key (derived from TimeSeed or manually entered)
- **Strong key derivation**: Argon2id with 128 MiB memory, 5 iterations — highly resistant to brute-force
- **Non-deterministic encryption**: Random salt + IV ensures the same message produces different ciphertext every time
- **File encryption**: Up to ~300 MB in ASCII-armored format (TS4 `.locked` files). Larger files possible with native tools
- **Public TimeSeed method**: Publish your TimeSeed openly (e.g., journalists accepting anonymous submissions) while keeping the pepper secret
- **Fully offline**: Single HTML file, no external dependencies after initial load (Argon2 WASM bundled)
- **Responsive design**: Works on desktop and mobile browsers

## Two Usage Modes

### Public TimeSeed Method
Ideal for journalists, NGOs, or anyone receiving anonymous secure messages.  
Publish your 50-character TimeSeed openly. Keep a strong secret pepper private.  
Senders use "Today" or "Current semester" — you only need to try 2–4 date/pepper combinations to decrypt.

### Private TimeSeed Method
Maximum security: Share the TimeSeed privately (never publish). Pepper is optional but recommended.

## Getting Started

No installation required. Open the HTML file in any modern browser.

- **Online**: Visit [https://timeseed.io/v2](https://timeseed.io/v2)
- **Offline**: Download the single HTML file and open locally

## For Developers / Customization

The tool is a single self-contained HTML file. For development or modifications:

- Extract/unbundle if needed (CSS and JS are inline)
- Argon2 WASM is bundled; Web Crypto API handles AES-GCM

## Links

- Website: [https://timeseed.io](https://timeseed.io)
- GitHub: [https://github.com/avbpodcast/timeseed.io](https://github.com/avbpodcast/timeseed.io)
- Support development (v3 + maintenance): [https://timeseed.io/donate](https://timeseed.io/donate)

## License

GNU GPL v3 [](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Disclaimer

TimeSeed is provided **"as is"** without warranties.  
Security depends entirely on keeping your pepper (and private TimeSeeds) secret.  
The authors are not responsible for data loss, breaches, or issues arising from misuse, weak secrets, browser vulnerabilities, or third-party dependencies.

### Legal & Cryptographic Disclaimer

This is a standalone, open-source cryptographic tool that runs entirely in a modern web browser as a single HTML page.

All cryptographic operations (including Argon2 and AES-GCM) are performed **locally on the user’s device**.

**No keys, passwords, seeds, or plaintext data** are transmitted, stored, logged, or accessible to the author or any third party — including servers, service providers, blockchains, telecommunications providers, or analytics platforms.

Users may transmit encrypted output at their own discretion.

Users are solely responsible for compliance with applicable laws and regulations in their jurisdiction.

This software is provided free of charge and without warranty of any kind, express or implied.

The author provides no service, holds no user keys, and has no technical ability to access, recover, or decrypt any data produced by this tool.

There is no server-side component, key escrow, administrative access, backdoor, or recovery mechanism.

Decryption is possible only with the user’s own TimeSeed, optional pepper, and selected parameters.

This software is published without restriction and does not require export authorisation under EU Regulation (EU) 2021/821 (dual-use items).

The source code is intended to be auditable and verifiable by independent third parties.

**Use at your own risk.** Always verify downloaded files and practice good key hygiene.

**v2.0 – December 2025**