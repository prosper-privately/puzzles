# Cryptanalysis Glossary

Terms used in this puzzle and in the field of cryptanalysis.

## Basic Terms

**Plaintext**
The original, readable message before encryption.

**Ciphertext**
The encrypted, unreadable message after encryption.

**Key**
Secret information used to encrypt and decrypt messages. In a one-time pad, the key is a sequence of random values.

**Modular Arithmetic**
Arithmetic where numbers "wrap around" after reaching a certain value (the modulus). In this puzzle, we use mod 28, so after Z (25), space (26), and period (27), we wrap back to A (0).

## One-Time Pad

**One-Time Pad (OTP)**
An encryption scheme that combines each character of plaintext with a corresponding random key value. When used correctly (with a truly random key, used only once), it provides perfect secrecy—mathematically unbreakable.

**Two-Time Pad (Multi-Time Pad)**
The vulnerability exploited in this puzzle. When the same pad is reused for multiple messages, the encryption is no longer secure. An attacker can use knowledge from one message to decrypt others.

## Attack Techniques

**Crib**
A known or guessed piece of plaintext. For example, if you suspect a message contains "THE ", that phrase is your crib.

**Crib Dragging**
The technique of "sliding" a crib across different positions in the ciphertext, testing each position to see if it produces sensible plaintext in other messages encrypted with the same key. This is the core technique for breaking a two-time pad.

**Known Plaintext Attack**
An attack where the cryptanalyst has access to both plaintext and its corresponding ciphertext, allowing them to derive key information.

## Historical Context

The two-time pad vulnerability is not just theoretical. Notable real-world examples include:

- **VENONA Project**: US codebreakers exploited Soviet reuse of one-time pad keys during the Cold War, decrypting thousands of messages over several decades.

- The name "one-time pad" emphasizes that the pad must be used exactly once. Reusing it—even partially—destroys the security guarantee.
