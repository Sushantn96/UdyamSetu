export interface PanchayatData {
  name: string;
  population: number;
  lat: number;
  lng: number;
}

export interface BlockData {
  name: string;
  population: number;
  panchayats: PanchayatData[];
}

export interface DistrictData {
  name: string;
  blocks: BlockData[];
}

export interface StateData {
  state: string;
  stateCode: string;
  districts: DistrictData[];
}

export const INDIAN_GEO_DATA: StateData[] = [
  {
    state: "Uttar Pradesh",
    stateCode: "UP",
    districts: [
      {
        name: "Varanasi",
        blocks: [
          {
            name: "Sevapuri",
            population: 238000,
            panchayats: [
              { name: "Adampur", population: 4200, lat: 25.321, lng: 82.812 },
              { name: "Bhatpurwa", population: 3100, lat: 25.334, lng: 82.798 },
              { name: "Karsada", population: 5800, lat: 25.342, lng: 82.825 },
              { name: "Kalikabara", population: 3900, lat: 25.318, lng: 82.805 },
              { name: "Rampur", population: 4600, lat: 25.351, lng: 82.833 }
            ]
          },
          {
            name: "Harahua",
            population: 215000,
            panchayats: [
              { name: "Dhaurahara", population: 4900, lat: 25.395, lng: 82.934 },
              { name: "Pindra Bazar", population: 6100, lat: 25.412, lng: 82.918 },
              { name: "Basantpur", population: 3800, lat: 25.388, lng: 82.945 }
            ]
          },
          {
            name: "Kashi Vidyapeeth",
            population: 280000,
            panchayats: [
              { name: "Manduadih Gram", population: 7200, lat: 25.295, lng: 82.965 },
              { name: "Shivpur Rural", population: 6500, lat: 25.352, lng: 82.975 },
              { name: "Chandpur", population: 5400, lat: 25.315, lng: 82.942 }
            ]
          }
        ]
      },
      {
        name: "Gorakhpur",
        blocks: [
          {
            name: "Pipraich",
            population: 245000,
            panchayats: [
              { name: "Jangal Dhusan", population: 5100, lat: 26.812, lng: 83.456 },
              { name: "Mahuawa", population: 4300, lat: 26.834, lng: 83.478 },
              { name: "Belghat", population: 3900, lat: 26.798, lng: 83.421 }
            ]
          },
          {
            name: "Sahjanwa",
            population: 210000,
            panchayats: [
              { name: "Ghanshyampur", population: 4800, lat: 26.765, lng: 83.218 },
              { name: "Bhariwaisi", population: 3600, lat: 26.745, lng: 83.235 }
            ]
          }
        ]
      },
      {
        name: "Lucknow",
        blocks: [
          {
            name: "Bakshi Ka Talab",
            population: 265000,
            panchayats: [
              { name: "Itaunja", population: 6200, lat: 27.025, lng: 80.912 },
              { name: "Bhaisamau", population: 4100, lat: 26.985, lng: 80.895 },
              { name: "Kathwara", population: 3700, lat: 27.012, lng: 80.932 }
            ]
          },
          {
            name: "Malihabad",
            population: 198000,
            panchayats: [
              { name: "Bakhtiyarnagar", population: 4400, lat: 26.915, lng: 80.712 },
              { name: "Kakraha", population: 3900, lat: 26.932, lng: 80.735 }
            ]
          }
        ]
      }
    ]
  },
  {
    state: "Bihar",
    stateCode: "BR",
    districts: [
      {
        name: "Patna",
        blocks: [
          {
            name: "Danapur",
            population: 275000,
            panchayats: [
              { name: "Usri", population: 5200, lat: 25.612, lng: 85.045 },
              { name: "Hetampur", population: 4600, lat: 25.598, lng: 85.021 },
              { name: "Mubarakpur", population: 3900, lat: 25.625, lng: 85.068 }
            ]
          },
          {
            name: "Bikram",
            population: 185000,
            panchayats: [
              { name: "Dahiwama", population: 4100, lat: 25.465, lng: 84.854 },
              { name: "Gorakhari", population: 3800, lat: 25.485, lng: 84.872 }
            ]
          }
        ]
      },
      {
        name: "Gaya",
        blocks: [
          {
            name: "Bodh Gaya",
            population: 220000,
            panchayats: [
              { name: "Mastipur", population: 4900, lat: 24.695, lng: 84.991 },
              { name: "Bakror", population: 4200, lat: 24.712, lng: 85.012 },
              { name: "Moratalab", population: 3500, lat: 24.682, lng: 84.975 }
            ]
          }
        ]
      }
    ]
  },
  {
    state: "Madhya Pradesh",
    stateCode: "MP",
    districts: [
      {
        name: "Indore",
        blocks: [
          {
            name: "Sanwer",
            population: 240000,
            panchayats: [
              { name: "Ajnod", population: 5400, lat: 22.952, lng: 75.821 },
              { name: "Kshipra Gram", population: 4900, lat: 22.915, lng: 75.852 },
              { name: "Chandrawatiganj", population: 6100, lat: 23.012, lng: 75.795 }
            ]
          },
          {
            name: "Depalpur",
            population: 215000,
            panchayats: [
              { name: "Betma Rural", population: 6800, lat: 22.685, lng: 75.612 },
              { name: "Gautampura", population: 5900, lat: 22.742, lng: 75.589 }
            ]
          }
        ]
      },
      {
        name: "Ujjain",
        blocks: [
          {
            name: "Ghatiya",
            population: 195000,
            panchayats: [
              { name: "Panthpiplai", population: 4100, lat: 23.285, lng: 75.782 },
              { name: "Unhel Rural", population: 5300, lat: 23.342, lng: 75.698 }
            ]
          }
        ]
      }
    ]
  },
  {
    state: "Rajasthan",
    stateCode: "RJ",
    districts: [
      {
        name: "Jaipur",
        blocks: [
          {
            name: "Sanganer",
            population: 260000,
            panchayats: [
              { name: "Watika", population: 5800, lat: 26.745, lng: 75.845 },
              { name: "Bilwa", population: 4900, lat: 26.782, lng: 75.872 },
              { name: "Shyosinghpura", population: 3700, lat: 26.715, lng: 75.821 }
            ]
          },
          {
            name: "Chaksu",
            population: 175000,
            panchayats: [
              { name: "Kotkhawda", population: 4600, lat: 26.582, lng: 75.985 },
              { name: "Kadera", population: 3900, lat: 26.612, lng: 75.952 }
            ]
          }
        ]
      }
    ]
  },
  {
    state: "Maharashtra",
    stateCode: "MH",
    districts: [
      {
        name: "Nashik",
        blocks: [
          {
            name: "Dindori",
            population: 230000,
            panchayats: [
              { name: "Vani Rural", population: 6400, lat: 20.312, lng: 73.895 },
              { name: "Nanashi", population: 4200, lat: 20.285, lng: 73.845 },
              { name: "Khedgaon", population: 5100, lat: 20.198, lng: 73.912 }
            ]
          },
          {
            name: "Niphad",
            population: 270000,
            panchayats: [
              { name: "Pimpalgaon Baswant", population: 8200, lat: 20.175, lng: 73.985 },
              { name: "Ozar Rural", population: 7100, lat: 20.095, lng: 73.921 }
            ]
          }
        ]
      }
    ]
  }
];

export function findLocationByCoords(lat: number, lng: number): {
  state: string;
  district: string;
  block: string;
  panchayat: string;
} {
  // Find nearest panchayat in static DB
  let closestDist = Infinity;
  let result = {
    state: "Uttar Pradesh",
    district: "Varanasi",
    block: "Sevapuri",
    panchayat: "Adampur"
  };

  for (const s of INDIAN_GEO_DATA) {
    for (const d of s.districts) {
      for (const b of d.blocks) {
        for (const p of b.panchayats) {
          const dlat = p.lat - lat;
          const dlng = p.lng - lng;
          const dist = Math.sqrt(dlat * dlat + dlng * dlng);
          if (dist < closestDist) {
            closestDist = dist;
            result = {
              state: s.state,
              district: d.name,
              block: b.name,
              panchayat: p.name
            };
          }
        }
      }
    }
  }

  return result;
}
