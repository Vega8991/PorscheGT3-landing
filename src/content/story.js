// Todo el texto de la experiencia. Las cifras proceden exclusivamente de fuentes oficiales (SOURCES).
// Nada aquí atribuye al modelo 3D detalles mecánicos que no representa.

export const SOURCES = [
  { label: 'Porsche Newsroom — Purpose-built for performance: the new 911 GT3 RS (2022)', href: 'https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html' },
  { label: 'Porsche Newsroom — 911 GT3 RS (992) press kit', href: 'https://newsroom.porsche.com/dam/jcr:46a23375-e7ee-4507-a577-d9761b784d33/992%20911%20GT3%20RS%20Press%20Kit%201.pdf' },
];

export const CHAPTERS = [
  { id: 'hero', label: 'Car' },
  { id: 'form', label: 'Form' },
  { id: 'aero', label: 'Aerodynamics' },
  { id: 'wing', label: 'Downforce' },
  { id: 'wheels', label: 'Detail' },
  { id: 'macro', label: 'Detail' },
  { id: 'cockpit', label: 'Control' },
  { id: 'exploded', label: 'Engineering' },
  { id: 'numbers', label: 'The machine' },
  { id: 'control', label: 'The machine' },
  { id: 'final', label: 'The machine' },
];

export const HERO = {
  brand: 'Porsche',
  model: '911 GT3 RS',
  claim: 'Sculpted by air',
  cta: 'Explore',
  posterAlt: 'Porsche 911 GT3 RS in white, three-quarter front view, lit by a single strip of studio light on a black background.',
};

export const FORM = {
  eyebrow: 'Form',
  title: 'Every line has a reason.',
  chapters: [
    { id: 'front', label: 'Front splitter', text: 'The nose divides the air: what flows over the car and what flows beneath it.' },
    { id: 'nostrils', label: 'Bonnet nostrils', text: 'A single, angled radiator sits in the nose. Its hot air leaves through the bonnet.' },
    { id: 'arch', label: 'Wing louvres', text: 'Louvred front wings bleed pressure out of the wheel arches.' },
    { id: 'roof', label: 'Carbon', text: 'Doors, front wings, roof and bonnet are carbon fibre-reinforced plastic.' },
    { id: 'profile', label: 'Above the roofline', text: 'For the first time on a Porsche road car, the top of the rear wing sits higher than the roof.' },
    { id: 'plan', label: 'Plan view', text: 'Seen from above, every surface is a path for air.' },
  ],
};

export const AERO = {
  eyebrow: 'Aerodynamics',
  title: 'Sculpted by air.',
  subtitle: 'Downforce changes everything.',
  flowNote: 'Airflow shown as an illustration, not a simulation.',
  figures: [
    { value: '409', unit: 'kg', context: 'of downforce at 200 km/h' },
    { value: '860', unit: 'kg', context: 'of downforce at 285 km/h' },
  ],
};

export const WING = {
  eyebrow: 'Downforce',
  title: 'Air becomes grip.',
  notes: [
    { id: 'neck', label: 'Swan-neck mounts', text: 'The wing hangs from above, so its underside meets clean, undisturbed air.' },
    { id: 'drs', label: 'DRS', text: 'At the push of a button, the upper element flattens hydraulically to cut drag on the straights.' },
  ],
};

export const WHEELS = {
  eyebrow: 'Detail',
  title: 'Controlled at every corner.',
  notes: [
    { id: 'front', label: 'Front', text: '408 mm discs. Six-piston fixed callipers.' },
    { id: 'rear', label: 'Rear', text: '380 mm discs. Four-piston fixed callipers.' },
    { id: 'wheel', label: 'Wheels', text: 'Forged centre-lock wheels on 275/35 R20 front and 335/30 R21 rear tyres.' },
  ],
};

export const MACRO = {
  eyebrow: 'Detail',
  title: 'Nothing is ornament.',
  shots: [
    { id: 'light', label: 'Light', text: 'The face of the car, drawn in light.' },
    { id: 'vent', label: 'Vent', text: 'Where the central radiator exhales.' },
    { id: 'carbon', label: 'Carbon', text: 'Weight removed from the highest point of the car.' },
    { id: 'exhaust', label: 'Exhaust', text: 'Where 9,000 rpm leaves the car.' },
  ],
};

export const COCKPIT = {
  eyebrow: 'Control',
  title: 'Built around the driver.',
  notes: [
    { id: 'wheel', label: 'Steering wheel', text: 'Four rotary controls and a DRS button, within reach of the thumbs.' },
    { id: 'gauges', label: 'Instruments', text: 'A central rev counter, read in a glance.' },
    { id: 'seat', label: 'Seats', text: 'Full bucket seats in carbon fibre-reinforced plastic.' },
  ],
};

export const EXPLODED = {
  eyebrow: 'Engineering',
  title: 'Seven layers. One purpose.',
  groups: [
    { id: 'glass', n: '01', label: 'Glass' },
    { id: 'body', n: '02', label: 'Body' },
    { id: 'aero', n: '03', label: 'Aerodynamics' },
    { id: 'wheels', n: '04', label: 'Wheels & brakes' },
    { id: 'interior', n: '05', label: 'Interior' },
    { id: 'chassis', n: '06', label: 'Chassis' },
    { id: 'mech', n: '07', label: 'Mechanical' },
  ],
  technical: {
    title: 'Architecture, inside the silhouette.',
    text: 'With the skin made transparent, the structure that carries the air’s load comes forward.',
    disclaimer: 'Visual representation. The chassis and mechanical components of this 3D model are illustrative and do not depict the GT3 RS’s actual engine or drivetrain.',
  },
};

export const NUMBERS = {
  eyebrow: 'The machine',
  title: 'In figures.',
  items: [
    { value: '525', unit: 'PS', context: '386 kW from a naturally aspirated engine.' },
    { value: '9,000', unit: 'rpm', context: 'Maximum engine speed.' },
    { value: '4.0', unit: 'l', context: 'Flat-six displacement.' },
    { value: '860', unit: 'kg', context: 'Total downforce at 285 km/h.' },
    { value: '3.2', unit: 's', context: '0–100 km/h, through a seven-speed PDK.' },
  ],
};

export const CONTROL = {
  lines: ['Performance is nothing without control.', 'Precision is the point.'],
};

export const FINAL = {
  brand: 'Porsche',
  model: '911 GT3 RS',
  claim: 'Sculpted by air',
  cta: 'Explore',
  ctaHref: 'https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/',
};

export const CREDITS = {
  disclaimer: 'Personal, unofficial project. Not affiliated with or endorsed by Porsche AG. Porsche, 911 and GT3 RS are trademarks of Dr. Ing. h.c. F. Porsche AG.',
  model: { text: '3D model “Porsche GT3 RS” by Black Snow, licensed under CC BY 4.0.', href: 'https://sketchfab.com/3d-models/porsche-gt3-rs-e738eae819c34d19a31dd066c45e0f3d', license: 'https://creativecommons.org/licenses/by/4.0/' },
  modelNote: 'The model was optimised and some duplicate or non-GT3 RS parts were removed. Figures quoted are manufacturer data for the 992 GT3 RS (EU), not measurements of the model.',
  author: 'Design & development: Manuel Vega',
};
