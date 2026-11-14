// ==========================================
// MARSBOUND: MARS ACADEMY LESSONS (10 Lessons + Quizzes)
// ==========================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AcademyLesson {
  id: string;
  number: number;
  title: string;
  tagline: string;
  category: 'atmosphere' | 'energy' | 'biology' | 'engineering' | 'survival';
  readTime: string;
  simpleExplanation: string;
  inDepthScience: string;
  interestingFact: string;
  gameConnection: string;
  iconName: string;
  quiz: QuizQuestion[];
}

export const ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'lesson_oxygen',
    number: 1,
    title: 'Why Do Astronauts Need Oxygen?',
    tagline: 'Breathing on a planet with 95% Carbon Dioxide',
    category: 'atmosphere',
    readTime: '3 min',
    simpleExplanation: 'Our human bodies need oxygen to turn food into energy so our brain, heart, and muscles can work. Mars has air, but it is almost entirely carbon dioxide (CO2)—which humans cannot breathe! On Mars, every single breath of oxygen has to be made inside machines or carried from Earth.',
    inDepthScience: 'NASA’s MOXIE experiment on the Perseverance rover showed we can make oxygen right on Mars! MOXIE sucks in Martian CO2 and heats it to 800°C (1,470°F) to split it into oxygen atoms and carbon monoxide. It made enough oxygen for a small dog to breathe for 10 hours!',
    interestingFact: 'Earth’s atmosphere is 21% Oxygen and 78% Nitrogen. Mars’s atmosphere has less than 0.13% Oxygen. You would faint in about 15 seconds without a spacesuit on Mars!',
    gameConnection: 'In MARSBOUND, increasing MOXIE oxygen production keeps your crew safe, but consumes a lot of electricity. If power runs low, your air scrubbers will slow down!',
    iconName: 'Wind',
    quiz: [
      {
        id: 'q1',
        question: 'What is the main gas in the Martian atmosphere?',
        options: ['Oxygen', 'Carbon Dioxide (CO2)', 'Helium', 'Water Vapor'],
        correctIndex: 1,
        explanation: 'Mars air is roughly 95% Carbon Dioxide, which is toxic for human lungs to breathe directly.',
      },
      {
        id: 'q2',
        question: 'How did NASA’s MOXIE instrument create oxygen on Mars?',
        options: ['By melting polar ice caps', 'By splitting CO2 gas with high heat and electricity', 'By planting apple trees on rocks', 'By catching comets'],
        correctIndex: 1,
        explanation: 'MOXIE uses solid oxide electrolysis at 800°C to strip oxygen atoms from carbon dioxide molecules.',
      },
    ],
  },
  {
    id: 'lesson_temperature',
    number: 2,
    title: 'Why Is Mars So Cold?',
    tagline: 'Surviving at -60°C (-80°F) in a thin atmosphere',
    category: 'survival',
    readTime: '3 min',
    simpleExplanation: 'Mars is much farther from the Sun than Earth—about 228 million kilometers (142 million miles) away. Because of that distance, Mars receives less than half of the sunlight that warms Earth. Plus, its atmosphere is very thin, so heat quickly escapes into cold space at night!',
    inDepthScience: 'The average temperature on Mars is -60°C (-80°F), and near the poles during winter it can plunge to -125°C (-195°F)! That is so freezing that carbon dioxide gas freezes directly into dry ice snow on the ground.',
    interestingFact: 'Even on a pleasant summer day at the Martian equator, while your feet might feel a warm 20°C (68°F), your head would still feel a freezing 0°C (32°F) because the thin air cannot hold warmth!',
    gameConnection: 'Your habitat requires continuous electrical heaters. If power drops below 15%, the habitat temperature plunges and your crew’s health will rapidly decrease.',
    iconName: 'ThermometerSnowflake',
    quiz: [
      {
        id: 'q1',
        question: 'What is the average temperature across the surface of Mars?',
        options: ['+25°C (Warm summer)', '0°C (Freezing water)', '-60°C (-80°F)', '-270°C (Absolute zero)'],
        correctIndex: 2,
        explanation: 'Mars is an icy desert with an average temperature of approximately -60°C (-80°F).',
      },
      {
        id: 'q2',
        question: 'Why does Mars lose heat so quickly at night?',
        options: ['It has no core', 'Its atmosphere is very thin and cannot trap heat', 'Aliens turn off the lights', 'The ice reflects all the heat'],
        correctIndex: 1,
        explanation: 'With atmospheric pressure less than 1% of Earth, there is very little greenhouse effect to trap daytime heat.',
      },
    ],
  },
  {
    id: 'lesson_radiation',
    number: 3,
    title: 'What Is Space Radiation?',
    tagline: 'Invisible cosmic rays and solar storms',
    category: 'atmosphere',
    readTime: '4 min',
    simpleExplanation: 'Radiation is invisible energy that travels through space. On Earth, we are protected by a thick atmosphere and a giant magnetic field that acts like an invisible forcefield. Mars has no global magnetic field and only a whisper of air, so dangerous radiation hits the ground.',
    inDepthScience: 'There are two main sources of space radiation: Galactic Cosmic Rays (GCR), which are atomic nuclei shot across the galaxy by exploding supernovae, and Solar Particle Events (SPE), which are huge burps of protons blasted by the Sun during solar storms.',
    interestingFact: 'Astronauts on Mars would receive about 50 times more radiation in a year than a person living on Earth!',
    gameConnection: 'During solar flare alerts, you must decide whether to send your crew into the underground storm shelter or keep scientific instruments running for bonus discoveries.',
    iconName: 'ShieldAlert',
    quiz: [
      {
        id: 'q1',
        question: 'Why is Earth naturally protected from cosmic radiation while Mars is not?',
        options: ['Earth is closer to Jupiter', 'Earth has a strong magnetic field and thick atmosphere', 'Earth has more oceans', 'Mars is too small to see'],
        correctIndex: 1,
        explanation: 'Earth’s molten iron core creates a protective magnetosphere, and our thick atmosphere absorbs dangerous cosmic rays.',
      },
      {
        id: 'q2',
        question: 'Where do Galactic Cosmic Rays (GCR) come from?',
        options: ['The center of the Moon', 'Exploding stars (supernovae) far across our galaxy', 'Cell phone towers', 'Comet tails'],
        correctIndex: 1,
        explanation: 'Galactic cosmic rays are high-energy particles accelerated to near the speed of light by ancient supernova explosions.',
      },
    ],
  },
  {
    id: 'lesson_dust_storms',
    number: 4,
    title: 'Why Do Solar Panels Lose Power in Dust?',
    tagline: 'Dust storms that swallow an entire planet',
    category: 'energy',
    readTime: '3 min',
    simpleExplanation: 'Mars is covered in tiny, rusty red dust grains made of iron oxide. When high winds blow, this dust rises into the sky and can block out the Sun for weeks. When dust settles on solar panels, sunlight cannot reach the solar cells, cutting electrical generation drastically.',
    inDepthScience: 'NASA rovers Spirit, Opportunity, and the InSight lander all used solar panels. In 2018, a monster global dust storm darkened the sky above Opportunity, draining its batteries permanently after 15 incredible years of exploration.',
    interestingFact: 'Martian dust particles are electrostatically charged, which makes them stick like glue to spacesuits and rover cameras!',
    gameConnection: 'When dust accumulates on your solar array, your daily power generation drops. You can deploy robotic wipers to sweep the panels, but it costs materials and battery power.',
    iconName: 'SunDim',
    quiz: [
      {
        id: 'q1',
        question: 'What gave Mars its nickname "The Red Planet"?',
        options: ['Red paint from meteors', 'Rust (Iron Oxide) in the soil and dust', 'Red algae in the ice', 'Hot lava lakes'],
        correctIndex: 1,
        explanation: 'The iron in Martian dust has oxidized (rusted), giving the entire planetary surface its reddish hue.',
      },
      {
        id: 'q2',
        question: 'How do dust storms affect solar-powered Mars equipment?',
        options: ['They make panels spin too fast', 'They block sunlight and coat panels with dust, cutting electricity', 'They freeze the wires', 'They turn power into water'],
        correctIndex: 1,
        explanation: 'Dust clouds darken the sky and blanket photovoltaic glass, cutting solar power by up to 80%.',
      },
    ],
  },
  {
    id: 'lesson_hydroponics',
    number: 5,
    title: 'How Does Hydroponic Farming Work?',
    tagline: 'Growing crunchy food without a single scoop of dirt',
    category: 'biology',
    readTime: '3 min',
    simpleExplanation: 'Hydroponics is a clever way of growing plants in water and liquid minerals instead of soil. On Mars, the natural soil contains poisonous salts called perchlorates. Growing crops in clean, recycled water under LED lights allows astronauts to produce fresh potatoes, salad greens, and wheat safely!',
    inDepthScience: 'Plants only need four main things: water, carbon dioxide, light for photosynthesis, and dissolved nutrients (nitrogen, phosphorus, potassium, and minerals). Aeroponics sprays nutrient mist directly onto dangling plant roots, using 95% less water than Earth farming!',
    interestingFact: 'NASA astronauts on the International Space Station have successfully grown and eaten red romaine lettuce, chili peppers, and zinnia flowers!',
    gameConnection: 'Expanding hydroponics increases your future food supply, but it requires electricity for grow lights and fresh water for nutrient reservoirs.',
    iconName: 'Sprout',
    quiz: [
      {
        id: 'q1',
        question: 'What is hydroponic farming?',
        options: ['Growing crops in water with nutrients, without soil', 'Burying seeds under polar ice', 'Feeding plants Martian dust', 'Eating vitamin pills only'],
        correctIndex: 0,
        explanation: 'Hydroponics supplies plants with balanced mineral nutrients dissolved in water, eliminating the need for dirt.',
      },
      {
        id: 'q2',
        question: 'Why can’t astronauts just plant vegetables directly into Martian dirt?',
        options: ['Martian dirt is too hot', 'Martian soil contains toxic perchlorate salts and no organic matter', 'Seeds float away in low gravity', 'Worms on Mars eat the seeds'],
        correctIndex: 1,
        explanation: 'Martian regolith lacks biological humus and contains toxic chlorine salts (perchlorates) that must be washed away first.',
      },
    ],
  },
  {
    id: 'lesson_comm_delay',
    number: 6,
    title: 'Why Does Calling Mars Take Time?',
    tagline: 'The speed of light across 100 million miles of space',
    category: 'engineering',
    readTime: '3 min',
    simpleExplanation: 'Even though radio waves travel at the speed of light—300,000 kilometers per second (186,000 miles per second)—Earth and Mars are so far apart that radio messages take between 3 and 22 minutes to travel one way! A round-trip conversation could take almost 45 minutes.',
    inDepthScience: 'Because both planets orbit the Sun at different speeds, the distance between them constantly changes from 54.6 million kilometers (at their closest point) to over 401 million kilometers (when on opposite sides of the Sun).',
    interestingFact: 'If an astronaut dropped a wrench on Mars and shouted "Houston, we have a problem!", Mission Control in Texas wouldn’t even hear the words until at least 4 to 20 minutes later!',
    gameConnection: 'During an unexpected emergency on Mars, you cannot wait for Earth to tell you what to do. The game gives you autonomous commander authority!',
    iconName: 'Radio',
    quiz: [
      {
        id: 'q1',
        question: 'How fast do radio communications travel through deep space?',
        options: ['The speed of sound', 'The speed of light (300,000 km/s)', '100 kilometers per hour', 'Instantly with zero delay'],
        correctIndex: 1,
        explanation: 'Radio signals are electromagnetic waves that travel at the universal speed of light.',
      },
      {
        id: 'q2',
        question: 'Why does the communication delay between Mars and Earth change over time?',
        options: ['Because satellites turn off at night', 'Because both planets orbit the Sun, so the distance between them constantly changes', 'Because of cloud cover on Earth', 'Because radio batteries get tired'],
        correctIndex: 1,
        explanation: 'As Earth and Mars circle the Sun in different orbits, their separation distance swings from 55 million to 400 million kilometers.',
      },
    ],
  },
  {
    id: 'lesson_water_recycling',
    number: 7,
    title: 'How Do Astronauts Recycle Water?',
    tagline: 'Turning yesterday’s coffee into tomorrow’s coffee',
    category: 'engineering',
    readTime: '3 min',
    simpleExplanation: 'Lifting heavy gallons of water off Earth costs thousands of dollars per pound. That is why space outposts use high-tech closed-loop recycling. Every drop of moisture—from astronaut sweat, exhaled breath in the air, and even urine—is purified and distilled into crystal-clear drinking water!',
    inDepthScience: 'NASA’s Environmental Control and Life Support System (ECLSS) on the ISS uses vacuum distillation, catalytic oxidizers, and ultra-fine filtration membranes to recycle over 98% of all water. The water astronauts drink in space is cleaner than tap water in most cities!',
    interestingFact: 'Astronauts often joke: "In space, today’s coffee is tomorrow’s coffee!"',
    gameConnection: 'Your outpost’s Water Recovery System recycles most of your water every Sol. If the filtration loop breaks down, your water supply plummets rapidly unless you mine subsurface ice.',
    iconName: 'Droplets',
    quiz: [
      {
        id: 'q1',
        question: 'What percentage of water does NASA’s modern space station system recycle?',
        options: ['10%', '50%', 'Over 95%', '0% (all water is dumped)'],
        correctIndex: 2,
        explanation: 'NASA’s advanced ECLSS recovers over 98% of all crew moisture, sweat, and wastewater.',
      },
      {
        id: 'q2',
        question: 'Where can astronauts find additional fresh water naturally on Mars?',
        options: ['In rushing surface rivers', 'In vast sheets of buried underground ice', 'In rain clouds', 'From cactus plants'],
        correctIndex: 1,
        explanation: 'Vast deposits of ancient water ice are buried just meters under the Martian soil in mid-latitude plains.',
      },
    ],
  },
  {
    id: 'lesson_shielding',
    number: 8,
    title: 'How Can Humans Shield Against Radiation?',
    tagline: 'Building forts with Martian soil and water walls',
    category: 'engineering',
    readTime: '3 min',
    simpleExplanation: 'Lead is very heavy and dangerous to launch on rockets. Instead, space engineers discovered that the best radiation shields are materials made of light atoms—especially hydrogen! Storing water tanks around astronaut bedrooms and piling Martian dirt (regolith) on top of the habitat provides great protection.',
    inDepthScience: 'A 1-to-2 meter layer of compacted Martian regolith blocks almost all solar storm protons and significantly cuts down galactic cosmic rays. Water and polyethylene plastics also absorb high-energy particles without creating dangerous secondary radiation scatter.',
    interestingFact: 'NASA is researching edible fungi and mycelium bricks grown from mushrooms to build lightweight radiation-absorbing shields for Mars habitats!',
    gameConnection: 'Reinforcing your habitat regolith shield costs construction materials and power, but drastically reduces radiation exposure during your 30-Sol mission.',
    iconName: 'ShieldCheck',
    quiz: [
      {
        id: 'q1',
        question: 'Which element is most effective at absorbing cosmic radiation in space?',
        options: ['Gold', 'Hydrogen (found in water and plastics)', 'Iron', 'Glass'],
        correctIndex: 1,
        explanation: 'Hydrogen nuclei (protons) have nearly the same mass as cosmic ray particles, absorbing their energy like billiard balls.',
      },
      {
        id: 'q2',
        question: 'What local Martian material can astronauts pile on top of their habitat for protection?',
        options: ['Martian soil and rock (regolith)', 'Plastic bottles from Earth', 'Snowmen', 'Dry leaves'],
        correctIndex: 0,
        explanation: 'Martian regolith can be melted or stacked in sandbags to form thick, durable radiation barriers.',
      },
    ],
  },
  {
    id: 'lesson_microgravity_body',
    number: 9,
    title: 'How Does Low Gravity Change Human Bodies?',
    tagline: 'Bones, muscles, and 38% gravity',
    category: 'biology',
    readTime: '4 min',
    simpleExplanation: 'On Mars, gravity is only 38% of Earth’s gravity. If you weigh 100 pounds on Earth, you would weigh only 38 pounds on Mars! That makes jumping fun, but without Earth’s constant pull, astronaut muscles and bones do not have to work as hard and can weaken over time.',
    inDepthScience: 'NASA’s Open Science Data Repository (OSDR) studies show astronauts in microgravity can lose 1% to 1.5% of their bone mineral density in their hips and spine every single month unless they perform strenuous resistance exercise every day.',
    interestingFact: 'Astronauts grow up to 2 inches (5 centimeters) taller in space because gravity isn’t squeezing their spinal discs together!',
    gameConnection: 'Keeping your crew healthy requires proper nutrition, clean water, and exercise protocols. If resources fall, crew health drops and astronauts fatigue faster.',
    iconName: 'Activity',
    quiz: [
      {
        id: 'q1',
        question: 'How strong is gravity on the surface of Mars compared to Earth?',
        options: ['Exactly the same', 'About 38% of Earth gravity', '10 times stronger', 'Zero gravity (you float into space)'],
        correctIndex: 1,
        explanation: 'Because Mars is smaller and has less mass than Earth, its surface gravity is about 38% of Earth’s.',
      },
      {
        id: 'q2',
        question: 'What must astronauts do every day to stop their bones and muscles from weakening?',
        options: ['Sleep 20 hours', 'Strenuous resistance and treadmill exercise', 'Drink sugary soda', 'Stay completely still'],
        correctIndex: 1,
        explanation: 'Astronauts spend roughly 2 hours each day exercising with specialized weight-simulating resistance machines.',
      },
    ],
  },
  {
    id: 'lesson_teamwork',
    number: 10,
    title: 'Why Is Teamwork Vital on Mars?',
    tagline: 'Living together in a tin can millions of miles from home',
    category: 'survival',
    readTime: '3 min',
    simpleExplanation: 'Surviving on Mars is not just about engineering—it is about people! Four astronauts living in a small habitat for years must communicate kindly, support each other when tired, solve complex problems together, and keep each other’s spirits high through humor, delicious meals, and shared purpose.',
    inDepthScience: 'NASA psychological research in isolation habitats (like CHAPEA and HI-SEAS) proves that crew cohesion, emotional empathy, and celebration of small daily victories are just as essential for mission success as life-support oxygen scrubbers.',
    interestingFact: 'Crews in space always make sure to eat dinner together at the same table to share stories and check on how each person is feeling!',
    gameConnection: 'Each astronaut on your crew has a unique role: Commander, Flight Surgeon, Robotics Engineer, and Astrobiologist. Balancing their workloads and rest keeps the whole mission thriving!',
    iconName: 'Users',
    quiz: [
      {
        id: 'q1',
        question: 'What is NASA CHAPEA?',
        options: ['A rocket engine', 'A 3D-printed Mars habitat on Earth where crews live in isolation for a year', 'A Martian moon', 'A freeze-dried snack'],
        correctIndex: 1,
        explanation: 'CHAPEA (Crew Health and Performance Exploration Analog) is a NASA mission testing how humans handle living in a simulated Mars base.',
      },
      {
        id: 'q2',
        question: 'Why do space crews eat meals together?',
        options: ['To save electricity and build strong team morale and emotional support', 'Because there is only one fork', 'Robots force them to', 'To test who eats fastest'],
        correctIndex: 0,
        explanation: 'Shared meals provide a daily social anchor that reduces isolation and strengthens crew bonding.',
      },
    ],
  },
];
