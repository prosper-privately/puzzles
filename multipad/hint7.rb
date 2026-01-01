# Alphabet: A-Z plus space plus period (28 chars)
ALPHABET = ("A".."Z").to_a + [" ", "."]
CHAR_TO_NUM = ALPHABET.each_with_index.to_h
NUM_TO_CHAR = ALPHABET.each_with_index.map { |c, i| [i, c] }.to_h
MOD = ALPHABET.length
PARTIAL_KEY_FILE = "key.txt"
PARTIAL_KEY = File.readlines(PARTIAL_KEY_FILE).map(&:chomp).map do |line|
  if line.empty?
    nil
  else
    line.to_i
  end
end rescue []
CIPHER_TEXTS = File.readlines("cipher.txt").map(&:chomp).reject { |line| line.empty? }

# Decrypt helper for a single character using key number
def dec_char(cipher_ch, key_num)
  c = CHAR_TO_NUM.fetch(cipher_ch) { raise ArgumentError, "Invalid cipher char: #{cipher_ch.inspect}" }
  NUM_TO_CHAR[(c - key_num) % MOD]
end

# Given one ciphertext, assume `test_string` appears at `position`, derive key guesses,
# and partially decrypt this ciphertext + other ciphertexts with those guessed key positions
# plus any already-known key positions from `partial_key`.
#
# Args:
#   cipher_text: String (A-Z, space, period)
#   test_string: String (A-Z, space, period)
#   position: Integer (0-based index)
#   other_cipher_texts: Array<String>
#   partial_key: Array<Integer,nil>  (sparse; key numbers 0..27 or nil)
#
# Returns:
#   Array<String> of partially decrypted messages:
#     [decrypted_cipher_text, *decrypted_other_cipher_texts]
#
def try_crib(cipher_text_index, test_string, position, cipher_texts, partial_key=[])
  raise ArgumentError, "position must be >= 0" if position < 0

  cipher_text = cipher_texts[cipher_text_index]

  # Build key_guess as a hash: index -> key_num
  key_guess = {}

  test_string.chars.each_with_index do |p_ch, offset|
    i = position + offset
    p = CHAR_TO_NUM[p_ch]
    c = CHAR_TO_NUM[cipher_text[i]]
    k = (c - p) % MOD  # because c = p + k (mod 28)
    key_guess[i] = k
  end

  # Merge known key with guess.
  merged_key = merge_keys(partial_key, key_guess)

  # Determine how far we can render for each message:
  # render up to the max of (cipher length) and (merged_key length) — but only positions
  # within each message's ciphertext can decrypt.
  results = cipher_texts.map do |ct|
    out = +""
    ct.length.times do |i|
      k = merged_key[i]
      if k.nil?
        out << "_"
      else
        out << dec_char(ct[i], k)
      end
    end
    out
  end

  [results, merged_key]
end

# Merge known key with guess. If conflicts, raise.
def merge_keys(partial_key, key_guess)
  merged_key = partial_key.dup
  key_guess.each do |i, k|
    known = merged_key[i]
    if !known.nil? && known != k
      raise ArgumentError, "Key conflict at position #{i}: known=#{known} guessed=#{k}"
    end
    merged_key[i] = k
  end
  merged_key
end

# Overwrites the file
def write_partial_key(key)
  key_str = key.join("\n")
  File.write(PARTIAL_KEY_FILE, key_str)
end

def crib_all(cipher_texts, test_string, position, partial_key=[])
  cipher_texts.map.with_index do |cipher_text, cipher_text_index|
    try_crib(cipher_text_index, test_string, position, cipher_texts, partial_key)
  end
end

test_string = ARGV[1].upcase
position = ARGV[0].to_i
guesses = crib_all(CIPHER_TEXTS, test_string, position, PARTIAL_KEY)

puts "Testing '#{test_string}' at position #{position}."

guesses.each.with_index do |guess, i|
  puts "="*88
  puts "Guess #{i}"

  messages, merged_key = guess

  # Wrap the test_string in quotes to make it easier to see.
  to_print = messages.map do |msg|
    msg.insert(position, "'")
    msg.insert(position + test_string.length + 1, "'")
  end

  puts to_print.join("\n")
  puts "="*88
  puts "Do these look right? (y/n)"

  input = STDIN.gets.chomp
  if input.downcase == "y"
    puts "Updating #{PARTIAL_KEY_FILE}"
    write_partial_key(merged_key)
    exit 0
  end
end