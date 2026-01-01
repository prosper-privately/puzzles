ALPHABET = ("A".."Z").to_a + [" ", "."]
CHAR_TO_NUM = ALPHABET.each_with_index.to_h
NUM_TO_CHAR = ALPHABET.each_with_index.map { |c, i| [i, c] }.to_h
MOD = ALPHABET.length

def load_pad(path)
  pad = File.readlines(path).map(&:chomp).map(&:to_i)
  pad.each do |n|
    raise "Pad number out of range: #{n}" unless (0...MOD).include?(n)
  end
  pad
end

def validate_message!(msg, label)
  msg.each_char do |ch|
    raise "Invalid character in #{label}: #{ch.inspect}" unless CHAR_TO_NUM.key?(ch)
  end
end

def encrypt_message(msg, pad)
  raise "Message too long" if msg.length > pad.length

  msg.chars.each_with_index.map do |ch, i|
    p = CHAR_TO_NUM[ch]
    k = pad[i]
    NUM_TO_CHAR[(p + k) % MOD]
  end.join
end

def decrypt_message(msg, pad)
  raise "Message too long" if msg.length > pad.length

  msg.chars.each_with_index.map do |ch, i|
    c = CHAR_TO_NUM[ch]
    k = pad[i]
    NUM_TO_CHAR[(c - k) % MOD]
  end.join
end
