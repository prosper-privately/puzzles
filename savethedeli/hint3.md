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
