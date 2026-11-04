/* EDIT HERE: all product prices, shipping policies, official asset paths,
   personalities and skins are centrally managed. No build step is needed. */
window.DAZIPET_CONFIG = {
  currency: 'USD',
  locale: 'en-US',
  product: { name: 'Dada', brand: 'DaziPet', price: 59.99, extraSkinPrice: 8.99, maxQuantity: 99 },
  shipping: {
    completeSetFee: 0, // Free standard shipping within mainland China.
    standaloneSkinFee: null, // Not yet priced; never display this as free shipping.
    market: 'Chinese Gen Z consumers',
    destination: 'Mainland China',
    completeSetNote: 'Free Standard Shipping within Mainland China. Extra skins ordered with a complete set ship together at no additional standard shipping charge.',
    standaloneSkinNote: 'Standalone extra-skin shipping is not included in the displayed demo total. The delivery fee will be confirmed before commercial launch.',
    extraSkinNote: 'Extra skins ordered with a complete set ship together. Standalone skin purchases may incur a delivery fee; free shipping is not guaranteed.',
    futureVision: 'International markets through cross-border e-commerce.'
  },
  ai: {
    connectionNote: "Talk to Dada whenever it's connected to Wi-Fi or a supported hotspot.",
    serviceNote: "AI-powered conversations and voice reminders are part of Dada's proposed core experience. Service availability and usage terms will be finalized before commercial launch."
  },
  /* Supplied classroom concept visuals, not manufactured product photography.
     Current retail prices: complete set US$59.99; extra skin US$8.99; personality fixed after purchase. */
  skins: [
    { id: 'cloud', name: 'Cloud', material: 'Long-Pile Plush', color: '#f4e7ed', image: 'assets/products/dada-cloud.png', description: 'A cloud-shaped skin in white or soft pink-white long-pile plush.', mood: 'A softer kind of everyday.', tag: 'SOFT & DREAMY' },
    { id: 'sun', name: 'Sun', material: 'Short-Pile Plush', color: '#fff0be', image: 'assets/products/dada-sun.png', description: 'A sunshine-yellow, sun-shaped skin in short-pile plush.', mood: 'A little pocket of sunshine.', tag: 'WARM & BRIGHT' },
    { id: 'star', name: 'Star', material: 'Silicone', color: '#e3ddf8', image: 'assets/products/dada-star.png', description: 'A star-shaped silicone skin with a purple, blue and pink gradient.', mood: 'For your own little universe.', tag: 'PLAYFUL & COSMIC' }
  ],
  personalities: [
    { id: 'metal', name: 'Metal', trait: 'Analytical', symbol: '◇', color: '#e4e3ef', headline: 'A little clarity, when you need it.', description: 'Thoughtful, logical, and clear. A companion who helps you untangle your thoughts and take things one step at a time.', quote: 'Let’s make a little plan. What’s one thing we can start with?', reminder: 'Your study session starts in ten minutes. Ready for step one?' },
    { id: 'wood', name: 'Wood', trait: 'Gentle', symbol: '❋', color: '#e1ecd9', headline: 'A soft place to land.', description: 'Patient, caring, and quietly encouraging. A gentle listener for busy minds and all the feelings in between.', quote: 'You don’t have to figure it all out today. I’m right here.', reminder: 'A little nudge: it’s almost time to study. Let’s ease into it.' },
    { id: 'water', name: 'Water', trait: 'Agile', symbol: '≈', color: '#dcecf4', headline: 'Go with your own flow.', description: 'Adaptable, curious, and quick on its feet. A flexible friend who brings a fresh perspective to your everyday.', quote: 'Change of plans? We can find a new way together.', reminder: 'Study time is coming up! Want to start with something new?' },
    { id: 'fire', name: 'Fire', trait: 'Passionate', symbol: '✴', color: '#f8dfd3', headline: 'Your own little cheerleader.', description: 'Bright, enthusiastic, and full of heart. An upbeat companion who celebrates your efforts and cheers on your next step.', quote: 'Look at you go! Every small win is worth a little celebration.', reminder: 'Ready, little superstar? It’s almost study time. You’ve got this!' },
    { id: 'earth', name: 'Earth', trait: 'Steady', symbol: '◒', color: '#ede4d4', headline: 'A little calm to count on.', description: 'Grounded, reassuring, and dependable. A steady presence that makes daily routines feel a little more manageable.', quote: 'One thing at a time. We’ll find our rhythm together.', reminder: 'It’s nearly time for your study session. One steady step forward.' }
  ]
};
