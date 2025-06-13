const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_KEY = 'your-anon-public-key';
const supabase = supabase.createClient(https://edbevjrupwqkbicfguiq.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYmV2anJ1cHdxa2JpY2ZndWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mzg3MzUsImV4cCI6MjA2NTQxNDczNX0.XrplfdLYgtx0NnxiUm3yKuwkhBkz2ZLutA_1PFeFueY);

function normalizeDeck(input) {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

async function submitDeck() {
  const rawInput = document.getElementById('deckInput').value;
  const deck = normalizeDeck(rawInput);
  const cards = deck.split(' ');

  if (cards.length !== 52) {
    document.getElementById('result').innerText = '❌ Must be 52 cards!';
    return;
  }

  const { data, error } = await supabase
    .from('decks')
    .upsert({
      deck_string: deck,
      last_claimed: new Date(),
      claim_count: 1,
    }, {
      onConflict: 'deck_string',
      ignoreDuplicates: false
    })
    .select();

  if (error) {
    // Deck exists → update claim count
    const { error: updateError, data: updated } = await supabase.rpc('increment_claim', { d: deck });
    if (updateError) {
      document.getElementById('result').innerText = `⚠️ Error: ${updateError.message}`;
    } else {
      document.getElementById('result').innerText =
        `✅ Deck claimed again! Total claims: ${updated}`;
    }
  } else {
    document.getElementById('result').innerText = `🎉 New deck claimed! Total claims: 1`;
  }
}
