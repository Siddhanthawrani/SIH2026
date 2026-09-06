export const ALERTS = [
  { id: 1, sev: 'critical', road: 'NH-6 • Sonapur–Jowai', msg: 'Landslide — both lanes blocked', time: '2 min ago', src: 'BRO sensor + 6 field reports' },
  { id: 2, sev: 'warning', road: 'NH-27 • Bongaigaon', msg: 'Waterlogging 40cm — HMV diverted', time: '11 min ago', src: 'IMD + CCTV AI' },
  { id: 3, sev: 'info', road: 'NH-29 • Dimapur–Kohima', msg: 'Convoy KA-4521 rerouted via Pfutsero', time: '19 min ago', src: 'NERVE AI Core' },
  { id: 4, sev: 'success', road: 'NH-37 • Silchar–Imphal', msg: 'Corridor verified clear by 3 geo-reports', time: '26 min ago', src: 'Field network' },
  { id: 5, sev: 'warning', road: 'Lumding–Badarpur rail', msg: 'Speed restriction 30 km/h — rain', time: '34 min ago', src: 'NFR integration' },
];

export const REPORTS = [
  { user: 'M. Das • Truck driver', loc: 'Jowai, Meghalaya', tag: 'BLOCKED', text: 'Boulders across road near km 62. JCB on site, 3hr clearance est.', img: '/images/terrain-road.jpg', time: '8 min', verified: true },
  { user: 'ASDMA Volunteer', loc: 'Nalbari, Assam', tag: 'FLOOD', text: 'Flood water 2ft over NH-27 service lane. Cars diverting via Sarthebari.', img: '/images/flood.jpg', time: '22 min', verified: true },
  { user: 'BRO Unit 44', loc: 'Tawang axis', tag: 'CLEAR', text: 'Sela tunnel approach clear. Convoy movement green for next 6 hrs.', img: '/images/hills.jpg', time: '41 min', verified: true },
];

export const ROUTES = [
  { id: 'R1', from: 'Guwahati', to: 'Aizawl', via: 'NH-6 (direct)', dist: '618 km', eta: '19h 40m', risk: 82, status: 'BLOCKED', score: 34 },
  { id: 'R2', from: 'Guwahati', to: 'Aizawl', via: 'NH-27 → NH-37 (AI pick)', dist: '692 km', eta: '18h 05m', risk: 18, status: 'RECOMMENDED', score: 91 },
  { id: 'R3', from: 'Guwahati', to: 'Aizawl', via: 'NH-2 via Kohima', dist: '745 km', eta: '21h 20m', risk: 44, status: 'CAUTION', score: 66 },
];
