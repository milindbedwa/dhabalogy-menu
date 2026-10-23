/* =====================================================================
   Dhabalogy — artwork, stories and dish notes
   ---------------------------------------------------------------------
   Visual and editorial layer on top of js/menu-data.js.

   sections[id]  art    → illustration used for the section header and
                          for every dish in it that has no image of its own
                 tone   → card colour family: sky | mustard | coral | teal
                 story  → { title, text } short cultural note for the header

   dishes[id]    short "About" note shown in the dish sheet. Keys are dish
                 ids: an explicit `id` from menu-data.js, otherwise
                 "<section id>-<dish name slug>" (lowercase, & → and,
                 anything else → "-").

   These are general food-culture notes, not claims about the kitchen.
   Swap any `art` for a real photo whenever one is ready.
   ===================================================================== */
window.DHABALOGY_STORIES = {
  sections: {
    navratri: {
      art: "assets/satvik-thali.jpg", tone: "coral",
      story: { title: "Satvik, the fasting-season way", text: "Light, simple cooking for the nine nights: millet in place of grain, rock salt, kuttu and singhara flours, and fruit, nuts and dairy doing the heavy lifting." },
    },
    winter: {
      art: "assets/illus/winter.jpg", tone: "sky",
      story: { title: "Sardi ka swaad", text: "Winter in Rajasthan and Punjab means mustard greens, bajra and makki rotis, fresh gur and halwas made slowly in ghee. Food meant to warm you from the inside." },
    },
    starters: {
      art: "assets/illus/starters.jpg", tone: "sky",
      story: { title: "Tandoor and tawa", text: "Kababs and tikkas come from the clay tandoor; bhajiyas and pakodas from the bubbling kadhai. Both were built for sharing across a table." },
    },
    chaat: {
      art: "assets/illus/chaat.jpg", tone: "mustard",
      story: { title: "Chatpata means it bites back", text: "Chaat is North India's street-corner art of balance: crunchy, tangy, sweet and spicy in one spoon. Best eaten fast, before the papdi softens." },
    },
    soup: {
      art: "assets/illus/soup.jpg", tone: "teal",
      story: { title: "Shorba in a kullad", text: "Shorba is the thin, spiced broth of Mughal kitchens. Serving it in an unglazed clay kullad adds an earthy note you cannot get from a bowl." },
    },
    sabji: {
      art: "assets/illus/sabji.jpg", tone: "coral",
      story: { title: "The dhaba main course", text: "Highway dhabas built their name on big-flavoured sabjis and dals cooked over slow fires: Punjabi paneer, Marwari kadhi and desert vegetables like ker sangri." },
    },
    thali: {
      art: "assets/illus/thali.jpg", tone: "sky",
      story: { title: "Ek se bhale do", text: "A thali is a whole meal on one brass plate. The mini meals pair one dish with its classic partner, the way they are eaten at home." },
    },
    vrat: {
      art: "assets/sabudana-khichdi.jpg", tone: "mustard",
      story: { title: "Vrat ka khana", text: "Fasting food uses sendha namak (rock salt) and grain-free flours such as singhara and sabudana, so it is light but still filling." },
    },
    rotiyan: {
      art: "assets/illus/rotis.jpg", tone: "mustard",
      story: { title: "Rang birangi rotiyan", text: "Every region has its bread: bajra and makki from the desert, missi roti with gram flour, flaky laccha paratha and tandoori naan from Punjab." },
    },
    chawal: {
      art: "assets/illus/rice.jpg", tone: "teal",
      story: { title: "Chawal, dahi, papad", text: "Rice, cooling curd and a crisp papad are the quiet partners of every dhaba meal. Mewari handi pulao and gatte ka pulao are Rajasthan's own." },
    },
    nashta: {
      art: "assets/illus/nashta.jpg", tone: "coral",
      story: { title: "Back to school", text: "The nashta of Indian mornings: poha from Malwa, vada pav from Mumbai, Jodhpur's mirchi bada and parathas with white makhan." },
    },
    sandwiches: {
      art: "assets/illus/cafe.jpg", tone: "sky",
      story: { title: "Toasted and grilled", text: "The Indian sandwich is its own thing: green chutney, masala aloo, ragda and plenty of cheese, pressed on a hot grill." },
    },
    pizza: {
      art: "assets/illus/cafe.jpg", tone: "sky",
      story: { title: "Desi twist on Italian", text: "Chatpata paneer on a pizza, pink penne, garlic bread with tandoori paneer. Pizza and pasta in pure desi ghee are available on request." },
    },
    waffles: {
      art: "assets/illus/desserts.jpg", tone: "mustard",
      story: { title: "Waffles with ice cream", text: "Crisp outside, soft inside, served with your choice of ice cream." },
    },
    desserts: {
      art: "assets/illus/desserts.jpg", tone: "mustard",
      story: { title: "Khane ke baad", text: "Meetha is not optional. Jalebi dunked in warm milk, saffron kheer in a kullad, Mughal shahi tukda and Rajasthani churma ladoo." },
    },
    chai: {
      art: "assets/illus/chai.jpg", tone: "teal",
      story: { title: "Kullad wali chai", text: "Chai in a clay kullad is the heart of the dhaba: the cup is used once, the clay perfumes the tea, and the earth takes it back." },
    },
    shakes: {
      art: "assets/illus/drinks.jpg", tone: "coral",
      story: { title: "Thick and cold", text: "Milkshakes, paan gulkand and seasonal fresh juices. Sharbat is the older tradition: fruit and flower syrups stirred into cold water." },
    },
    beverages: {
      art: "assets/illus/drinks.jpg", tone: "coral",
      story: { title: "Lassi, chaas, shikanji", text: "Punjab's lassi, Rajasthan's smoked buttermilk and the roadside shikanji: the drinks that cool down a spicy meal." },
    },
    mocktails: {
      art: "assets/illus/mocktails.jpg", tone: "mustard",
      story: { title: "Something tall and fizzy", text: "Mojitos, lemonades and a guava peru pyala with a chaat-masala rim." },
    },
  },

  dishes: {
    /* Navratri */
    "satvik-thali": "Satvik is the fasting-season style of cooking: light, simple and traditionally made without onion or garlic. Eight dishes on one thali, from samak rice to anjeer makhana kheer.",
    "kuttu-lauki-cheela": "Kuttu is buckwheat, a fasting flour that is not a grain at all. Grated lauki keeps the cheela soft; the chia-seed raita is the cooling side.",
    "sweet-potato-makhana-cutlets": "Makhana are puffed lotus seeds, roasted and crushed to bind the shakarkandi. Peanut chutney is a classic fasting-day partner.",
    "sabudana-khichdi": "Sabudana (tapioca pearls) khichdi with peanuts and green chilli is the most loved vrat dish of western India. Banana walnut lassi makes it a meal.",
    "singhara-malpua": "Singhara atta is water-chestnut flour, used during fasts in place of wheat. Malpua is the deep-fried pancake of Rajasthan and Bihar, here with apple and a sitafal (custard apple) rabadi.",

    /* Winter */
    "winter-sarso-ka-saag": "Punjab's winter anthem: slow-cooked mustard greens finished with makhan, eaten with makki ki roti and a lump of gur.",
    "winter-haldi-ki-sabji": "A Rajasthani winter rarity made from fresh turmeric root, cooked in ghee with curd and spices. Sharp, earthy and warming.",
    "winter-bathua-ki-bhaji": "Bathua (chenopodium) is a winter green that grows between the wheat. It is cooked as a bhaji or stirred into kadhi and raita.",
    "winter-mirchi-kutta": "A Rajasthani pounded green-chilli relish, hot and tangy. A spoonful lifts a plate of bajra roti.",
    "winter-mogri-aloo-mogri-mangodi": "Mogri are the pods of the rat-tail radish, a winter vegetable of the north-west, cooked with potato or sun-dried mangodi.",
    "winter-bajra-ka-khichda-with-desi-ghee": "Khichda is coarsely crushed pearl millet simmered to a porridge, finished with a pool of desi ghee. Pure Marwari winter comfort.",
    "winter-makki-ke-paniye-with-kali-udar-daal": "Paniye are flat corn-flour cakes cooked on leaves, a Mewar village preparation served with dark urad dal.",
    "winter-mewari-makki-ke-dhokle-with-kali-udar-daal": "Mewari dhokla is nothing like the Gujarati one: steamed corn-flour dumplings, split open and eaten with kali urad dal and ghee.",
    "winter-gajar-ka-halwa": "The red winter carrot, grated and reduced in milk and ghee with khoya and nuts. The dessert of every North Indian December.",
    "winter-khajoor-doodh": "Dates simmered in milk, a warming winter drink sweetened only by the fruit.",
    "winter-desi-gur-ki-raab": "Raab is a thin, warming porridge drink of Rajasthan, made with bajra or makki flour; this one is sweetened with fresh desi gur.",
    "winter-makki-ka-jaajariya": "Jaajariya is a Rajasthani sweet of fresh corn cooked down in milk and ghee, served here in a kullad.",
    "winter-choliya-ka-halwa": "Choliya is fresh green chickpea, a short winter crop, ground and slow-cooked into a halwa.",
    "winter-gur-ki-lapsi": "Lapsi is broken wheat roasted in ghee and sweetened with jaggery, the sweet made for Rajasthani celebrations and first days.",

    /* Starters */
    "starters-dahi-ke-kababjade": "Kababs made from hung curd rather than meat, a Lucknowi vegetarian classic: crisp outside, creamy within.",
    "starters-paneer-bhatti": "Bhatti is the open coal grill of the dhaba. Paneer marinated and charred over it picks up the smoke.",
    "starters-tandoori-najakat-aloo": "Najakat means delicacy: whole baby potatoes stuffed and roasted in the tandoor.",
    "starters-dahi-bade": "Soft urad-dal dumplings soaked in sweetened curd with chutneys, a Holi and Diwali table regular.",
    "starters-gol-gappe": "Crisp hollow puris filled with spiced water and potato. Called pani puri in Mumbai, puchka in Kolkata, gol gappe in the north.",
    "starters-aloo-matar-ki-potli": "Potli means a little pouch: pastry parcels filled with spiced peas and potato.",

    /* Chaat */
    "chaat-dahi-papdi-chat": "Papdi, boiled potato, chana, curd and two chutneys, finished with sev. The Delhi standard of chaat.",
    "chaat-makki-papdi-chat": "A Rajasthani turn on papdi chaat using corn-flour papdis.",
    "chaat-tokri-chat": "Tokri means basket: a crisp potato-lattice bowl filled with chaat.",

    /* Soup */
    "soup-tamatar-dhaniya-shorba": "Shorba is the thin spiced broth of Mughal kitchens, lighter than a western soup and meant to be sipped.",

    /* Sabji */
    "sabji-sev-tamatar": "A Marwari and Kathiawari favourite: tangy tomato gravy with crunchy besan sev stirred in at the end.",
    "sabji-kadhi-karari": "Rajasthani kadhi is thinner and sharper than the Punjabi kind, made with besan and sour curd; karari adds crisp pakodis.",
    "sabji-dahi-wale-gatte": "Gatte are steamed gram-flour dumplings, a desert-pantry invention for a land with few fresh vegetables, simmered here in a curd gravy.",
    "sabji-ker-sangari": "Ker berries and sangri beans grow wild on the khejri trees of the Thar. Sun-dried and cooked with pickle spices, this is the taste of Marwar.",
    "sabji-papad-methi": "Another desert classic: papad cooked into a gravy with fenugreek seeds, from kitchens where papad was the only vegetable in summer.",
    "sabji-mangodi-ki-sabji": "Mangodi are sun-dried moong-dal nuggets, made in the hot months and stored for the year.",
    "sabji-maa-ki-daal-rajma-masala": "Maa ki daal is whole black urad slow-cooked overnight, the dal of Punjabi dhabas.",
    "sabji-dhabe-wali-daal": "The mixed dal of highway dhabas, finished with a smoky ghee tadka.",
    "sabji-paanch-ratan-daal": "Five dals (the paanch ratan) cooked together, a Rajasthani royal-kitchen recipe.",
    "sabji-angara-lasooni-paneer": "Angara means ember: the gravy is smoked with a live coal, with plenty of garlic.",
    "sabji-bharwa-baingan": "Small brinjals stuffed with a spice masala and slow-cooked, a northern home-style dish.",
    "sabji-kaatil-karela": "Bitter gourd cooked until it turns kaatil, killer good: stuffed, fried and spiced.",
    "sabji-methi-mastani": "Fresh fenugreek leaves cooked rich and creamy. Mastani is a Pune word for anything lavish.",

    /* Thali & mini meals */
    "veg-thali": "A complete meal on one brass plate, the way it has been served at dhabas and homes across India.",
    "thali-daal-bati-with-churma-ladoo": "Rajasthan's signature: baked wheat batis cracked open and drowned in ghee, panchmel dal, and sweet crumbly churma. Legend says it began as travel food for Mewar's soldiers.",
    "thali-kadhi-chawal": "Sour curd and besan kadhi over plain rice, the comfort meal of North Indian lunch tables.",
    "thali-rajma-daal-chawal": "Rajma chawal is Delhi and Punjab's Sunday lunch: kidney beans in a thick tomato gravy over rice.",
    "thali-chole-bhature": "Punjabi chickpeas with puffy fried bhature, a breakfast that doubles as lunch.",
    "thali-daal-khichadi-with-curd": "Dal and rice cooked together into khichdi, India's oldest comfort food, served with curd.",

    /* Vrat */
    "vrat-singhare-atta-puri-and-aloo-masala": "Puris made from water-chestnut flour with a rock-salt aloo, the standard fasting-day plate.",
    "vrat-sabudana-papad": "Sun-dried tapioca papads, fried crisp; a fasting snack from Maharashtra.",

    /* Rotiyan */
    "rotiyan-bajra-makki-roti": "Pearl millet and corn flatbreads, patted by hand and finished with a spoon of white makhan, the breads of the desert and Punjab.",
    "rotiyan-missi-jau-jwar-bejar-roti": "Bejar is a Rajasthani mix of flours; missi roti blends wheat with besan and spices.",
    "rotiyan-gur-churi-roti": "Roti crumbled with ghee and jaggery, a sweet Punjabi comfort eaten with the fingers.",
    "rotiyan-laccha-paratha": "The layered paratha of Punjab, folded and coiled so it fans into flaky laccha.",

    /* Chawal */
    "chawal-mewari-handi-pulao": "A spiced vegetable pulao cooked in a sealed handi, from the Mewar region around Udaipur.",
    "chawal-rajasthani-gatte-ka-pulao": "Rice cooked with gram-flour gatte and whole spices, the desert's answer to a biryani.",
    "chawal-tadke-wale-dahi-chawal": "Curd rice with a mustard-and-curry-leaf tadka, cooling and light.",

    /* Nashta */
    "nashta-poha": "Flattened rice tossed with mustard, turmeric and peanuts, the breakfast of Indore and Malwa.",
    "nashta-vada-paav": "Mumbai's burger: a spiced potato vada in a soft pav with dry garlic chutney.",
    "nashta-mirchi-bada": "Jodhpur's famous snack: a large green chilli stuffed with spiced potato and fried in a besan coat.",
    "nashta-moong-dal-paneer-childa": "A savoury moong-dal pancake with paneer, a protein-rich North Indian breakfast.",
    "nashta-upma": "The South Indian semolina breakfast, cooked here in desi ghee.",

    /* Desserts */
    "desserts-shahi-tukda": "Mughal bread pudding: fried bread soaked in saffron syrup and topped with rabri and nuts.",
    "desserts-lapsi-gur-ki": "Broken wheat roasted in ghee and sweetened with jaggery, Rajasthan's sweet for auspicious beginnings.",
    "desserts-gulabi-firni": "Phirni is ground-rice pudding set in clay cups; gulabi adds rose.",
    "desserts-doodh-jalebi": "Hot jalebi dunked in warm milk, a North Indian winter breakfast tradition.",
    "desserts-kesariya-kheer": "Saffron rice pudding served in a kullad; the clay keeps it cool and faintly earthy.",
    "desserts-churme-ka-ladoo": "Churma, the sweet wheat crumble of dal-bati, rolled into ladoos with ghee and jaggery.",
    "desserts-paan-gulkand-ice-cream": "Gulkand is rose-petal preserve, the sweet heart of a paan, here folded into ice cream.",
    "desserts-rabri-faluda": "Thickened rabri with falooda vermicelli and basil seeds, a Persian-rooted summer dessert.",
    "desserts-barf-ka-gola": "Shaved ice with syrups, the summer treat of every Indian fair.",

    /* Chai, doodh, coffee */
    "kullad-masala-chai": "Chai simmered with ginger and spices, served in an unglazed clay kullad that perfumes the tea. The cup is used once and returns to the earth.",
    "kullad-coffee": "Dhaba-style frothy coffee served in a clay kullad.",
    "chai-desi-gud-wali-masala-chai": "Chai sweetened with jaggery instead of sugar, the old village way.",
    "chai-kesar-badam-pahalwani-doodh": "Pahalwani is wrestler-style: full-cream milk thickened with almonds and saffron, a bedtime strength drink.",
    "chai-haldi-doodh": "Turmeric milk, the golden home remedy of every Indian grandmother.",
    "chai-adrak-jeere-pudina-chai": "Ginger, cumin and mint, a chai meant to settle the stomach after a big meal.",

    /* Beverages */
    "beverages-meethi-namkin-lassi-medium": "Punjab's churned-curd drink, sweet or salted, served thick with a layer of malai.",
    "beverages-gulabi-kesariya-lassi-medium": "Lassi flavoured with rose or saffron, the festive versions.",
    "beverages-dhaba-special-thandai": "A cold milk drink with almonds, fennel, cardamom and rose, traditionally made for Holi and Shivratri.",
    "beverages-smoked-masala-butter-milk": "Chaas infused with a smoking coal and roasted spices, a Rajasthani touch on buttermilk.",
    "beverages-shikanji-pani-wali": "The roadside lemonade of the north: lemon, black salt, cumin and sugar.",

    /* Mocktails */
    "mocktails-peru-pyala": "Peru is guava: a guava cooler with the chaat-masala kick of the street-side fruit cart.",

    /* Shakes */
    "shakes-sharbat": "Sharbat is the oldest cold drink of the subcontinent: fruit and flower syrups stirred into cold water. Kokum, gulab, paan or kala khatta.",
    "shakes-paan-gulkand-shake": "The flavours of a meetha paan, rose preserve and betel leaf, in a milkshake.",
  },
};
