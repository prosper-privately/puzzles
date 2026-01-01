# Hint 3

A one-time pad works by modifying each character[1] of a message based
on a "pad" of random data.

The conspirators used the following technique:

- Each character is mapped to a number 0–27.
  - We have 26 letters, plus " " and "."
  - "A" = 0
  - "Z" = 25
  - " " = 26
  - "." = 27
- Encryption is done character-by-character with: C = (P + K) mod 28.
- Decryption is: P = (C - K) mod 28.
- P = A character in the plain text message
- C = A character in the cipher text
- K = A number from the pad
- The "pad" is a list of random numbers from 0-27

[1] Technically it does not need to operate on exactly one character
    at a time. In fact, most one-time pad implementations on computers
    operate one bit at a time.

## Lookup table

How to use this table

- Rows = Plaintext character (P)
- Columns = Key value (K)
- Cell value = Ciphertext character (C)

Encryption rule:

```mathematica
C = (P + K) mod 28
```

To decrypt manually:

```mathematica
P = (C − K) mod 28
```

| P\K | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 |
| --: | - | - | - | - | - | - | - | - | - | - | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- | -- |
|   A | A | B | C | D | E | F | G | H | I | J | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  |
|   B | B | C | D | E | F | G | H | I | J | K | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  |
|   C | C | D | E | F | G | H | I | J | K | L | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  |
|   D | D | E | F | G | H | I | J | K | L | M | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  |
|   E | E | F | G | H | I | J | K | L | M | N | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  |
|   F | F | G | H | I | J | K | L | M | N | O | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  |
|   G | G | H | I | J | K | L | M | N | O | P | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  |
|   H | H | I | J | K | L | M | N | O | P | Q | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  |
|   I | I | J | K | L | M | N | O | P | Q | R | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  |
|   J | J | K | L | M | N | O | P | Q | R | S | T  | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  |
|   K | K | L | M | N | O | P | Q | R | S | T | U  | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  |
|   L | L | M | N | O | P | Q | R | S | T | U | V  | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  |
|   M | M | N | O | P | Q | R | S | T | U | V | W  | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  |
|   N | N | O | P | Q | R | S | T | U | V | W | X  | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  |
|   O | O | P | Q | R | S | T | U | V | W | X | Y  | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  |
|   P | P | Q | R | S | T | U | V | W | X | Y | Z  | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  |
|   Q | Q | R | S | T | U | V | W | X | Y | Z | ␠  | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  |
|   R | R | S | T | U | V | W | X | Y | Z | ␠ | .  | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  |
|   S | S | T | U | V | W | X | Y | Z | ␠ | . | A  | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  |
|   T | T | U | V | W | X | Y | Z | ␠ | . | A | B  | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  |
|   U | U | V | W | X | Y | Z | ␠ | . | A | B | C  | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  |
|   V | V | W | X | Y | Z | ␠ | . | A | B | C | D  | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  |
|   W | W | X | Y | Z | ␠ | . | A | B | C | D | E  | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  |
|   X | X | Y | Z | ␠ | . | A | B | C | D | E | F  | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  |
|   Y | Y | Z | ␠ | . | A | B | C | D | E | F | G  | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  |
|   Z | Z | ␠ | . | A | B | C | D | E | F | G | H  | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  |
|   ␠ | ␠ | . | A | B | C | D | E | F | G | H | I  | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  |
|   . | . | A | B | C | D | E | F | G | H | I | J  | K  | L  | M  | N  | O  | P  | Q  | R  | S  | T  | U  | V  | W  | X  | Y  | Z  | ␠  |

## Character ↔ Number Mapping

```mathematica
A=0  B=1  C=2  D=3  E=4  F=5  G=6  H=7  I=8  J=9
K=10 L=11 M=12 N=13 O=14 P=15 Q=16 R=17 S=18 T=19
U=20 V=21 W=22 X=23 Y=24 Z=25 SPACE=26 .=27
```

## The easy button: `hint3.html`

`hint3.html` is a set of small utilities for working with the puzzle’s **mod 28** alphabet.
It helps you do the conversions and arithmetic quickly so you can focus on the cryptanalysis.

No internet connection is required.

### What You’re Looking At

When you open `hint7.html` in your web browser, you’ll see:

`hint3.html` has **four independent sections**. Each one updates automatically as you type or paste.

- **Numbers → Letters**  
  Converts space-separated numbers (0–27) into characters (A–Z, space, period).

- **Letters → Numbers**  
  Converts characters into their numeric form (0–27).

- **Encrypt: Pad numbers + Plaintext → Ciphertext**  
  Performs `C = (P + K) mod 28` character-by-character.

- **Decrypt: Pad numbers + Ciphertext → Plaintext**  
  Performs `P = (C − K) mod 28` character-by-character.

Each section has a **Copy output** button so you can quickly move results into notes, a spreadsheet, or other tools.

### Basic Workflow

#### 1. Convert letters to numbers (when you have a crib)

If you want to test a guess like:

```text
THE RECIPE.
```

Paste it into **Letters → Numbers** to get the numeric form.

This is helpful because the encryption/decryption math is done on numbers.

#### 2. Convert numbers to letters (when you’ve done arithmetic)

If you’ve computed a list of numbers (for example, differences between two ciphertexts),
paste them into **Numbers → Letters** to see what they correspond to in the alphabet.

#### 3. Encrypt (to sanity check your understanding)

Paste:

- pad numbers (space-separated) into **Pad numbers**
- plaintext into **Plaintext letters**

The **Ciphertext letters** output updates automatically.

#### 4. Decrypt (to recover plaintext when you know pad values)

Paste:

- pad numbers (space-separated) into **Pad numbers**
- ciphertext into **Ciphertext letters**

The **Plaintext letters** output updates automatically.

### Troubleshooting

- **Nothing happens when I double-click**  
  Try right-clicking `hint3.html` and choosing **Open with → your browser**.

- **The page looks blank or broken**  
  Make sure `hint3.html`, `hint3.js`, and `hint3.css` are all in the **same folder**.

- **Copy output doesn’t work**  
  Some browsers restrict clipboard access in certain situations. If it fails, select the output text and copy normally (Ctrl/Cmd+C).

- **I opened it on GitHub and it didn’t work**  
  You must download the files and open `hint3.html` locally.  
  Opening the file preview on GitHub will not run the helper page.

## Basic Terms

**Modular Arithmetic**
Arithmetic where numbers "wrap around" after reaching a certain value (the modulus). In this puzzle, we use mod 28, so after Z (25), space (26), and period (27), we wrap back to A (0).

- 28 becomes 0
- 29 becomes 1

It applies to negative numbers too, though it is a little less intuitive

- -1 becomes 27
- -2 becomes 26
- -26 becomes 2
- -27 becomes 1
- -28 becomes 0
- -29 becomes 27
