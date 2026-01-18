# TimeSeed v3

TimeSeed v3 is a standalone, browser-based tool for generating strong, time-based encryption keys and encrypting/decrypting messages and files using AES-256-GCM.

It uses **hybrid post-quantum key derivation** (Argon2id + official NIST ML-KEM) combined with modern authenticated encryption — all in a single offline-capable HTML file.

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
- **Hybrid post-quantum key derivation**: 
  - Argon2id (128 MiB memory, 5 iterations) for classical resistance
  - ML-KEM (NIST-standard post-quantum KEM) layered on top
  - Final symmetric key securely combines both for full future-proof protection
- **Backward compatibility**: Automatically detects and decrypts v2 (and older) ciphertexts using pure Argon2id mode (silent fallback)
- **Non-deterministic encryption**: Random salt + IV ensures unique ciphertexts
- **File encryption**: Up to ~300 MB in ASCII-armored `.locked` files (larger possible with native tools)
- **Public TimeSeed method**: Publish your TimeSeed openly while keeping the pepper secret
- **Fully offline**: Single HTML file, bundled WASM (Argon2 + ML-KEM), no external dependencies after load
- **Responsive design**: Works on desktop and mobile browsers

## Two Usage Modes

### Public TimeSeed Method
Ideal for journalists, NGOs, or anyone receiving anonymous secure messages.  
Publish your 50-character TimeSeed openly. Keep a strong secret pepper private.  
Senders use “Today” or “Current semester” — you only need to try 2–4 date/pepper combinations to decrypt.

### Private TimeSeed Method
Maximum security: Share the TimeSeed privately (never publish). Pepper is optional but recommended.

## Getting Started

No installation required. Open the HTML file in any modern browser.

- **Online**: Visit [https://timeseed.io/v3](https://timeseed.io/v3)
- **Offline**: Download the single HTML file and open locally

## For Developers / Customization

The tool is a single self-contained HTML file. For development:
- CSS and JS are inline
- Argon2 and ML-KEM WASM modules are bundled
- Web Crypto API handles AES-256-GCM

## For Example flow for Encrypted Text / File Flow (TimeSeed v3)

Inputs
├── TimeSeed (50-char anchor, can be public)
├── Pepper (secret password, optional but recommended)
├── Date (today, semester, or custom)
└── Plaintext (message text OR file data)

Key Derivation (Hybrid Post-Quantum)
TimeSeed + Pepper + Date
    ↓
Argon2id (128 MiB memory-hard) → classical key
    ↓
ML-KEM (NIST PQ standard) → additional PQ component
    ↓
Combine → final 256-bit AES key

Encryption (AES-256-GCM)
Plaintext
    + Random Salt
    + Random IV (nonce)
    ↓
AES-256-GCM encrypt with final key
    ↓
Ciphertext + Authentication Tag

Packaging
Version Header (e.g. "TS5" for v3)
    ↓
Full blob → Base64 ASCII-armored

Output
├── Text: Inline string starting with header (e.g. TS5.......)
└── File: .locked file (same format, downloadable)


## Known Issues

On iOS devices (iPhone/iPad), offline/local use of the HTML file is limited by Apple’s WebKit restrictions on memory-intensive WASM and long-running JS (Argon2 + ML-KEM).  
LockIt can be used online on iPhone however. This is not a bug but an Apple platform limitation.  
For reliable offline use, prefer desktop browsers on any OS, or Android devices.

## Links

- Website: [https://timeseed.io](https://timeseed.io)
- GitHub: [https://github.com/avbpodcast/timeseed.io](https://github.com/avbpodcast/timeseed.io)
- Source for v3: [https://github.com/avbpodcast/timeseed-v3](https://github.com/avbpodcast/timeseed-v3) (or main repo release tag)
- How it works: [https://timeseed.io/v3/TSexplainedv3.html](https://timeseed.io/v3/TSexplainedv3.html)
- Support development & maintenance: [https://timeseed.io/donate](https://timeseed.io/donate)

## License

GNU GPL v3 [https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html)

## Disclaimer

TimeSeed is provided **"as is"** without warranties.  
Security depends entirely on keeping your pepper (and private TimeSeeds) secret.  
The authors are not responsible for data loss, breaches, or issues arising from misuse, weak secrets, browser vulnerabilities, or third-party dependencies.

### Legal & Cryptographic Disclaimer

This is a standalone, open-source cryptographic tool that runs entirely in a modern web browser as a single HTML page.  
All cryptographic operations (Argon2id, ML-KEM, AES-256-GCM) are performed **locally on the user’s device**.  
**No keys, passwords, seeds, or plaintext data** are transmitted, stored, logged, or accessible to the author or any third party.  
Users may transmit encrypted output at their own discretion.  
Users are solely responsible for compliance with applicable laws and regulations in their jurisdiction.  
This software is provided free of charge and without warranty of any kind.  
The author provides no service, holds no user keys, and has no technical ability to access, recover, or decrypt any data produced by this tool.  
There is no server-side component, key escrow, administrative access, backdoor, or recovery mechanism.  
Decryption is possible only with the user’s own TimeSeed, optional pepper, and selected parameters.  
This software is published without restriction and does not require export authorisation under EU Regulation (EU) 2021/821 (dual-use items).  
The source code is intended to be auditable and verifiable by independent third parties.  
**Use at your own risk.** Always verify downloaded files and practice good key hygiene.

https://timeseed.io/v3/

**v3.0 – January 2026** (Post-Quantum Hybrid Release)