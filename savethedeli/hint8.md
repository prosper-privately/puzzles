# Hint 8: A solution

Run this

```bash
ruby hint8.rb
```

This will make various guesses (called "cribs" in the crypto world)
and then inspects how other messages would decrypt with that same key.

It then runs those tests through some basic heuristics to judge how accurate they are.
If they look accurate enough, then that part of the key is assumed to be correct,
and the next guess is made.

You can adjust the guesses by editing `CRIBS` in `hint8.rb`.

In a more realistic scenario you would:

- Use a longer (and more generic) list of cribs.
- Use a much larger DICTIONARY to check words against.
  Maybe try with the dictionary from hint4.
- Use more sophisticated language processing heuristics to check for proper
  grammar, letter frequencies, etc.

## What about the last word?

The messages are not all the same length. The longest message has a few characters that
cannot be decrypted because we don't have any other ciphertext that can validate our
guesses.

A proper one-time pad is used only once. When used properly, it provides perfect security.
Since the end of the pad is used only once (for the last word of the longest message),
it is secure and cannot be decrypted.

Perhaps you can guess what it is.
