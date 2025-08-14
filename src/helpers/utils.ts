interface Sector {
  id: string;
  escapedname: string;
  name: string;
}

export const sectors: Sector[] = [
  { id: "overall", escapedname: "all", name: "Overall Leaderboard" },
  { id: '2571435841', escapedname: 'aphelions_rest', name: "Aphelion's Rest" },
  { id: '628527324', escapedname: 'bay_of_drowned_wishes', name: 'Bay of Drowned Wishes' },
  { id: '3981864036', escapedname: 'bunker_e15', name: 'Bunker E15' },
  { id: '457172842', escapedname: 'chamber_of_starlight', name: 'Chamber Of Starlight' },
  { id: '4044885806', escapedname: 'concealed_void', name: 'Concealed Void' },
  { id: '2019961998', escapedname: 'empty_tank', name: 'Empty Tank' },
  { id: '3350278559', escapedname: 'excavation_site_xii', name: 'Excavation Site XII' },
  { id: '2504276275', escapedname: 'exodus_garden_2a', name: 'Exodus Garden 2A' },
  { id: '1509764568', escapedname: 'extraction', name: 'Extraction' },
  { id: '2983905025', escapedname: 'gilded_precept', name: 'Gilded Precept' },
  { id: '1869786712', escapedname: 'hydroponics_delta', name: 'Hydroponics Delta' },
  { id: '1956131630', escapedname: 'k1_communion', name: 'K1 Communion' },
  { id: '1525311382', escapedname: 'k1_crew_quarters', name: 'K1 Crew Quarters' },
  { id: '3229581111', escapedname: 'k1_logistics', name: 'K1 Logistics' },
  { id: '1174061510', escapedname: 'k1_revelation', name: 'K1 Revelation' },
  { id: '283251614', escapedname: 'metamorphosis', name: 'Metamorphosis' },
  { id: '1962464165', escapedname: 'perdition', name: 'Perdition' },
  { id: '144485114', escapedname: 'scavengers_den', name: "Scavenger's Den" },
  { id: '212477861', escapedname: 'sepulcher', name: 'Sepulcher' },
  { id: '55186263', escapedname: 'skydock_iv', name: 'Skydock IV' },
  { id: '4269987990', escapedname: 'the_conflux', name: 'The Conflux' },
  { id: '1344654780', escapedname: 'the_quarry', name: 'The Quarry' },
  { id: '3995113176', escapedname: 'the_blooming_deep', name: 'The Blooming Deep' },
  { id: '2875391872', escapedname: 'the_broken_deep', name: 'The Broken Deep' },
  { id: '699527776', escapedname: 'the_forgotten_deep', name: 'The Forgotten Deep' },
  { id: '4259709416', escapedname: 'the_rift', name: 'The Rift' },
  { id: '584726932', escapedname: 'thrilladrome', name: 'Thrilladrome' },
  { id: '2310698359', escapedname: 'veles_labyrinth', name: 'Veles Labyrinth' }
];

export function getSectorDetailsByID(id: string) {
  let selected: number = sectors.findIndex(item => item.id === id);
  if (selected == -1) {
    selected = 0;
  }

  const escapedname = sectors[selected].escapedname;
  const displayname = sectors[selected].name;

  return [id, escapedname, displayname];
}