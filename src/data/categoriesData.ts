export interface BusinessCategoryInfo {
  id: string;
  name: string;
  nameHindi: string;
  iconName: string;
  description: string;
  descriptionHindi: string;
  typicalMarginCapital: number; // ₹
  typicalMinProjectCost: number;
  typicalMaxProjectCost: number;
  typicalEquipmentPercent: number;
  typicalWorkingCapitalPercent: number;
  demandFactor: 'Very High' | 'High' | 'Steady';
  keyRawMaterials: string[];
  primaryMarket: string;
  sampleProducts: string[];
}

export const BUSINESS_CATEGORIES: BusinessCategoryInfo[] = [
  {
    id: "dairy",
    name: "Dairy Farming & Milk Chilling",
    nameHindi: "डेयरी फार्मिंग एवं दुग्ध शीतलन",
    iconName: "Milk",
    description: "Milch cattle rearing, bulk milk chilling unit, paneer & curd processing for village clusters and urban mandis.",
    descriptionHindi: "दुधारू पशु पालन, कच्चा दूध संकलन, पनीर व दही उत्पादन एवं स्थानीय मंडी आपूर्ति।",
    typicalMarginCapital: 12000,
    typicalMinProjectCost: 100000,
    typicalMaxProjectCost: 450000,
    typicalEquipmentPercent: 70,
    typicalWorkingCapitalPercent: 30,
    demandFactor: "Very High",
    keyRawMaterials: ["Cattle Feed / Fodder", "Veterinary Care Supplies", "Milk Cans", "Chilling Cooler"],
    primaryMarket: "Village Dairy Co-operatives, Local Sweet Shops, Weekly Haats",
    sampleProducts: ["Fresh Cow/Buffalo Milk (Ltr)", "Fresh Paneer (Kg)", "Cultured Dahi (Kg)", "Ghee"]
  },
  {
    id: "retail_kirana",
    name: "Rural Kirana & Daily Provisions Store",
    nameHindi: "ग्रामीण किराना एवं दैनिक उपभोग स्टोर",
    iconName: "Store",
    description: "Multi-utility convenience grocery retail providing packaged grains, edible oils, spices, stationery and basic toiletries.",
    descriptionHindi: "अनाज, खाद्य तेल, मसाले, साबुन, स्टेशनरी व दैनिक उपभोग की वस्तुओं की खुदरा दुकान।",
    typicalMarginCapital: 14000,
    typicalMinProjectCost: 120000,
    typicalMaxProjectCost: 350000,
    typicalEquipmentPercent: 35,
    typicalWorkingCapitalPercent: 65,
    demandFactor: "Very High",
    keyRawMaterials: ["Wholesale Grocery Inventory", "Display Racks", "Digital Weighing Scale", "POS System"],
    primaryMarket: "Local Panchayat Residents, Agricultural Laborers, Passing Highway Travelers",
    sampleProducts: ["Daily Staples (Atta, Rice, Dal)", "Cooking Oil Pouch", "Packaged Snacks", "Household Items"]
  },
  {
    id: "textiles_handloom",
    name: "Handloom, Khadi & Garment Stitching",
    nameHindi: "हथकरघा, खादी एवं सिलाई वस्त्र निर्माण",
    iconName: "Scissors",
    description: "Traditional fabric weaving, school uniform tailoring, designer kurtas, and boutique handloom work with local artisan groups.",
    descriptionHindi: "पारंपरिक हथकरघा बुनाई, सिलाई केंद्र, स्कूल यूनिफॉर्म एवं ग्रामीण परिधान सिलाई।",
    typicalMarginCapital: 9000,
    typicalMinProjectCost: 80000,
    typicalMaxProjectCost: 280000,
    typicalEquipmentPercent: 55,
    typicalWorkingCapitalPercent: 45,
    demandFactor: "High",
    keyRawMaterials: ["Cotton/Silk Yarn", "Industrial Sewing Machines", "Lining Cloth", "Zippers & Buttons"],
    primaryMarket: "District Cloth Markets, School Uniform Contracts, Festival Pop-ups",
    sampleProducts: ["Tailored School Uniform Sets", "Cotton Kurta-Pajama", "Handwoven Gamcha / Shawl", "Bedsheets"]
  },
  {
    id: "food_processing",
    name: "Agro Food Processing & Pickling",
    nameHindi: "कृषि खाद्य प्रसंस्करण, अचार व पापड़",
    iconName: "Utensils",
    description: "Value addition to seasonal farm produce: mango/chilli pickles, sun-dried papad, fruit pulps, herbal teas, and turmeric grinding.",
    descriptionHindi: "स्थानीय मौसमी फसलों से आचार, पापड़, हल्दी पिसाई, सत्तू व नमकीन प्रसंस्करण।",
    typicalMarginCapital: 10000,
    typicalMinProjectCost: 90000,
    typicalMaxProjectCost: 320000,
    typicalEquipmentPercent: 60,
    typicalWorkingCapitalPercent: 40,
    demandFactor: "High",
    keyRawMaterials: ["Raw Vegetables / Mangoes", "Mustard Oil & Spices", "Packaging Pouches", "Sealing Machine"],
    primaryMarket: "Local Weekly Haats, Highway Dhabas, Self-Help Group (SHG) Outlets",
    sampleProducts: ["Stuffed Red Chilli Pickle (500g)", "Spiced Urad Papad (Pack)", "Roasted Chana Sattu (Kg)", "Spice Powder"]
  },
  {
    id: "handicrafts",
    name: "Handicrafts & Terracotta Pottery",
    nameHindi: "हस्तशिल्प, टेराकोटा एवं मिट्टी उत्पाद",
    iconName: "Palette",
    description: "Eco-friendly clay water jugs (matkas), decorative clay diyas, jute bag weaving, bamboo baskets, and folk art artifacts.",
    descriptionHindi: "पारंपरिक मिट्टी के बर्तन, सुराही, कुल्हड़, बांस की टोकरियां व जूट बैग निर्माण।",
    typicalMarginCapital: 7000,
    typicalMinProjectCost: 60000,
    typicalMaxProjectCost: 180000,
    typicalEquipmentPercent: 50,
    typicalWorkingCapitalPercent: 50,
    demandFactor: "Steady",
    keyRawMaterials: ["Purified Potter Clay", "Electric Potters Wheel", "Kiln Fuel / Husk", "Natural Mineral Colors"],
    primaryMarket: "Urban Tourist Centers, Tea Stalls (Kulhad), Wedding Decorators, Festive Melas",
    sampleProducts: ["Earthen Tea Kulhad (100 pcs)", "Clay Water Dispenser with Tap", "Festival Terracotta Diya Sets", "Jute Carry Bags"]
  },
  {
    id: "poultry",
    name: "Backyard Poultry & Layer Farming",
    nameHindi: "कुक्कुट पालन एवं अंडा उत्पादन",
    iconName: "Egg",
    description: "Desi and broiler bird rearing, organic free-range eggs, and supply to nearby roadside eateries and town butcheries.",
    descriptionHindi: "देसी मुर्गी पालन, अंडा उत्पादन एवं स्थानीय होटलों/दुकानों में आपूर्ति।",
    typicalMarginCapital: 11000,
    typicalMinProjectCost: 95000,
    typicalMaxProjectCost: 350000,
    typicalEquipmentPercent: 65,
    typicalWorkingCapitalPercent: 35,
    demandFactor: "Very High",
    keyRawMaterials: ["Day-Old Chicks (DOC)", "Poultry Feed (Maize/Soy)", "Brooder Lamps & Drinkers", "Vaccines"],
    primaryMarket: "Rural Weekly Poultry Bazaars, Local Dhabas, Town Retailers",
    sampleProducts: ["Desi Free-Range Eggs (Tray of 30)", "Live Country Fowl / Broiler (Kg)", "Manure Fertilizer Bags"]
  },
  {
    id: "agri_input",
    name: "Agri-Input, Seed & Bio-Fertilizer Retail",
    nameHindi: "कृषि इनपुट, बीज एवं जैविक खाद केंद्र",
    iconName: "Sprout",
    description: "Certified seeds, vermicompost, bio-pesticides, drip irrigation pipes, and sprayers catering to village farming communities.",
    descriptionHindi: "प्रमाणित बीज, वर्मीकम्पोस्ट, जैविक कीटनाशक एवं कृषि उपकरण बिक्री केंद्र।",
    typicalMarginCapital: 16000,
    typicalMinProjectCost: 140000,
    typicalMaxProjectCost: 500000,
    typicalEquipmentPercent: 30,
    typicalWorkingCapitalPercent: 70,
    demandFactor: "High",
    keyRawMaterials: ["Authorized Seed Packets", "Bio-Fertilizer Bags", "Battery Sprayer Pumps", "Dealer Licensing"],
    primaryMarket: "Gram Panchayat Farmers, Krishi Vigyan Kendra (KVK) Network, SHG Farmers",
    sampleProducts: ["Hybrid Paddy/Wheat Seed Bags", "Enriched Vermicompost (50Kg)", "Neem Oil Bio-pesticide (Ltr)", "Sprayer Spare Parts"]
  },
  {
    id: "repair_services",
    name: "Solar & Electrical Repair Workshop",
    nameHindi: "सोलर, मोटर एवं विद्युत उपकरण मरम्मत केंद्र",
    iconName: "Wrench",
    description: "Agricultural pump set rewinding, domestic solar inverter repair, fan/cooler servicing, and electric e-rickshaw battery servicing.",
    descriptionHindi: "कृषि मोटर रिवाइंडिंग, सोलर इनवर्टर, पंखा-कूलर एवं ई-रिक्शा मरम्मत केंद्र।",
    typicalMarginCapital: 8000,
    typicalMinProjectCost: 75000,
    typicalMaxProjectCost: 220000,
    typicalEquipmentPercent: 75,
    typicalWorkingCapitalPercent: 25,
    demandFactor: "Very High",
    keyRawMaterials: ["Copper Enamelled Wire", "Multimeter & Soldering Tools", "Drill & Lathe Access", "Spare Capacitors & Bearings"],
    primaryMarket: "Farmers with Borewells, Rural Solar Homeowners, Local E-rickshaw Drivers",
    sampleProducts: ["Submersible Pump Rewinding Service", "Solar Inverter Diagnostic & Repair", "Ceiling Fan Overhaul", "Emergency Home Wiring"]
  },
  {
    id: "spice_grinding",
    name: "Micro Spice Grinding & Packaging Unit",
    nameHindi: "मसाला पिसाई एवं पैकिंग इकाई",
    iconName: "Flame",
    description: "Pure stone-ground turmeric, coriander, red chilli, and garam masala processing with hygienic vacuum seal packaging.",
    descriptionHindi: "हल्दी, धनिया, मिर्च व गरम मसाला की शुद्ध पिसाई एवं पाउच पैकिंग इकाई।",
    typicalMarginCapital: 13000,
    typicalMinProjectCost: 110000,
    typicalMaxProjectCost: 380000,
    typicalEquipmentPercent: 70,
    typicalWorkingCapitalPercent: 30,
    demandFactor: "Very High",
    keyRawMaterials: ["Raw Dry Whole Spices", "Pulverizer Grinder Machine", "Food Grade Laminate Rolls", "Continuous Band Sealer"],
    primaryMarket: "Village Grocery Stores, Caterers, Weekly Rural Markets",
    sampleProducts: ["Pure Turmeric Powder (200g/500g)", "Red Chilli Powder", "Coriander Blend", "Special Garam Masala"]
  }
];

export function getCategoryById(id: string): BusinessCategoryInfo | undefined {
  return BUSINESS_CATEGORIES.find(c => c.id === id) || BUSINESS_CATEGORIES[0];
}
