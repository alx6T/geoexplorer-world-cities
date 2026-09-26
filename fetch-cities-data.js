/**
 * Script to fetch ~500 major cities with Wikipedia facts and Unsplash images.
 * Run this locally: node fetch-cities-data.js
 * Output: cities-data.json (to be committed to repo)
 */

const https = require('https');
const fs = require('fs');

// Major world cities (500+) by population and significance
const MAJOR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
  { name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
  { name: 'Dhaka', country: 'Bangladesh', lat: 23.8103, lng: 90.4125 },
  { name: 'Osaka', country: 'Japan', lat: 34.6937, lng: 135.5023 },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
  { name: 'Manila', country: 'Philippines', lat: 14.5995, lng: 120.9842 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
  { name: 'Guangzhou', country: 'China', lat: 23.1291, lng: 113.2644 },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821 },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734 },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173 },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631 },
  { name: 'Toronto', country: 'Canada', lat: 43.6629, lng: -79.3957 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297 },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0285, lng: 105.8542 },
  { name: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869 },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853 },
  { name: 'Phuket', country: 'Thailand', lat: 8.0863, lng: 98.3923 },
  { name: 'Pattaya', country: 'Thailand', lat: 12.9271, lng: 100.8765 },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873 },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
  { name: 'Lucknow', country: 'India', lat: 26.8467, lng: 80.9462 },
  { name: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708 },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', lat: 24.4539, lng: 54.3773 },
  { name: 'Doha', country: 'Qatar', lat: 25.2854, lng: 51.5310 },
  { name: 'Riyadh', country: 'Saudi Arabia', lat: 24.7136, lng: 46.6753 },
  { name: 'Jeddah', country: 'Saudi Arabia', lat: 21.5433, lng: 39.1727 },
  { name: 'Tehran', country: 'Iran', lat: 35.6892, lng: 51.3889 },
  { name: 'Baghdad', country: 'Iraq', lat: 33.3157, lng: 44.3661 },
  { name: 'Beirut', country: 'Lebanon', lat: 33.8886, lng: 35.4955 },
  { name: 'Jerusalem', country: 'Israel', lat: 31.7683, lng: 35.2137 },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Giza', country: 'Egypt', lat: 30.0131, lng: 31.1898 },
  { name: 'Alexandria', country: 'Egypt', lat: 31.2000, lng: 29.9500 },
  { name: 'Casablanca', country: 'Morocco', lat: 33.5731, lng: -7.5898 },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 },
  { name: 'Fez', country: 'Morocco', lat: 34.0331, lng: -5.0044 },
  { name: 'Tunis', country: 'Tunisia', lat: 36.8065, lng: 10.1686 },
  { name: 'Algiers', country: 'Algeria', lat: 36.7376, lng: 3.0588 },
  { name: 'Lagos', country: 'Nigeria', lat: 6.5244, lng: 3.3792 },
  { name: 'Kano', country: 'Nigeria', lat: 12.0022, lng: 8.6753 },
  { name: 'Abuja', country: 'Nigeria', lat: 9.0765, lng: 7.3986 },
  { name: 'Nairobi', country: 'Kenya', lat: -1.2864, lng: 36.8172 },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2023, lng: 28.0436 },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 },
  { name: 'Durban', country: 'South Africa', lat: -29.8587, lng: 31.0218 },
  { name: 'Pretoria', country: 'South Africa', lat: -25.7461, lng: 28.2293 },
  { name: 'Accra', country: 'Ghana', lat: 5.6037, lng: -0.1870 },
  { name: 'Dakar', country: 'Senegal', lat: 14.7167, lng: -17.4673 },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
  { name: 'Monterrey', country: 'Mexico', lat: 25.6867, lng: -100.3161 },
  { name: 'Guadalajara', country: 'Mexico', lat: 20.6597, lng: -103.2494 },
  { name: 'Cancún', country: 'Mexico', lat: 21.1613, lng: -86.8515 },
  { name: 'Playa del Carmen', country: 'Mexico', lat: 20.6296, lng: -87.0739 },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', country: 'United States', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', country: 'United States', lat: 33.4484, lng: -112.0742 },
  { name: 'Philadelphia', country: 'United States', lat: 39.9526, lng: -75.1652 },
  { name: 'San Antonio', country: 'United States', lat: 29.4241, lng: -98.4936 },
  { name: 'San Diego', country: 'United States', lat: 32.7157, lng: -117.1611 },
  { name: 'Dallas', country: 'United States', lat: 32.7767, lng: -96.7970 },
  { name: 'San Jose', country: 'United States', lat: 37.3382, lng: -121.8863 },
  { name: 'Austin', country: 'United States', lat: 30.2672, lng: -97.7431 },
  { name: 'Miami', country: 'United States', lat: 25.7617, lng: -80.1918 },
  { name: 'Boston', country: 'United States', lat: 42.3601, lng: -71.0589 },
  { name: 'Seattle', country: 'United States', lat: 47.6062, lng: -122.3321 },
  { name: 'Denver', country: 'United States', lat: 39.7392, lng: -104.9903 },
  { name: 'Las Vegas', country: 'United States', lat: 36.1699, lng: -115.1398 },
  { name: 'Portland', country: 'United States', lat: 45.5152, lng: -122.6784 },
  { name: 'Toronto', country: 'Canada', lat: 43.6629, lng: -79.3957 },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207 },
  { name: 'Montreal', country: 'Canada', lat: 45.5017, lng: -73.5673 },
  { name: 'Calgary', country: 'Canada', lat: 51.0447, lng: -114.0719 },
  { name: 'Havana', country: 'Cuba', lat: 23.1291, lng: -82.3794 },
  { name: 'Santo Domingo', country: 'Dominican Republic', lat: 18.4861, lng: -69.9312 },
  { name: 'San Juan', country: 'Puerto Rico', lat: 18.4861, lng: -66.1057 },
  { name: 'Kingston', country: 'Jamaica', lat: 17.9714, lng: -76.7933 },
  { name: 'Panama City', country: 'Panama', lat: 8.9824, lng: -79.5199 },
  { name: 'San Salvador', country: 'El Salvador', lat: 13.6929, lng: -89.2182 },
  { name: 'Guatemala City', country: 'Guatemala', lat: 14.6343, lng: -90.5069 },
  { name: 'Tegucigalpa', country: 'Honduras', lat: 14.0723, lng: -87.1921 },
  { name: 'Managua', country: 'Nicaragua', lat: 12.1150, lng: -86.2362 },
  { name: 'San José', country: 'Costa Rica', lat: 9.9281, lng: -84.0907 },
  { name: 'Bogotá', country: 'Colombia', lat: 4.7110, lng: -74.0055 },
  { name: 'Medellín', country: 'Colombia', lat: 6.2442, lng: -75.5812 },
  { name: 'Cali', country: 'Colombia', lat: 3.4372, lng: -76.5198 },
  { name: 'Caracas', country: 'Venezuela', lat: 10.4806, lng: -66.9036 },
  { name: 'Guayaquil', country: 'Ecuador', lat: -2.1894, lng: -79.8891 },
  { name: 'Quito', country: 'Ecuador', lat: -0.2299, lng: -78.5249 },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428 },
  { name: 'Arequipa', country: 'Peru', lat: -16.3889, lng: -71.5350 },
  { name: 'La Paz', country: 'Bolivia', lat: -16.2998, lng: -68.1494 },
  { name: 'Santa Cruz', country: 'Bolivia', lat: -17.7838, lng: -63.1822 },
  { name: 'Asunción', country: 'Paraguay', lat: -25.2600, lng: -57.5759 },
  { name: 'Montevideo', country: 'Uruguay', lat: -34.9011, lng: -56.1645 },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816 },
  { name: 'Córdoba', country: 'Argentina', lat: -31.4201, lng: -64.1888 },
  { name: 'Santiago', country: 'Chile', lat: -33.4489, lng: -70.6693 },
  { name: 'Valparaíso', country: 'Chile', lat: -33.0473, lng: -71.6127 },
  { name: 'Concepción', country: 'Chile', lat: -36.8267, lng: -73.0498 },
  { name: 'Auckland', country: 'New Zealand', lat: -37.0082, lng: 174.7850 },
  { name: 'Wellington', country: 'New Zealand', lat: -41.2865, lng: 174.7762 },
  { name: 'Christchurch', country: 'New Zealand', lat: -43.5320, lng: 172.6362 },
  // Add more cities up to 500+
];

// Fetch Wikipedia extract for a city
function fetchWikipediaFact(cityName, countryName) {
  return new Promise((resolve) => {
    const query = `${cityName}, ${countryName}`;
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=extracts&exintro=true&explaintext=true&format=json`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const page = Object.values(pages)[0];
          const extract = page.extract || '';
          // Get first 2-3 sentences
          const sentences = extract.split('.').slice(0, 2).join('.') + '.';
          resolve(sentences.substring(0, 300) || `${cityName} is a major city in ${countryName}.`);
        } catch {
          resolve(`${cityName} is a major city in ${countryName}.`);
        }
      });
    }).on('error', () => resolve(`${cityName} is a major city in ${countryName}.`));
  });
}

// Generate Unsplash image URL
function getUnsplashImageUrl(cityName) {
  return `https://images.unsplash.com/search?query=${encodeURIComponent(cityName)}+city&orientation=landscape&format=json`;
}

// Batch fetch all cities
async function fetchAllCities() {
  console.log('Fetching data for major cities...');
  const cities = [];
  
  for (let i = 0; i < MAJOR_CITIES.length; i++) {
    const city = MAJOR_CITIES[i];
    console.log(`[${i + 1}/${MAJOR_CITIES.length}] Fetching ${city.name}, ${city.country}...`);
    
    try {
      const fact = await fetchWikipediaFact(city.name, city.country);
      cities.push({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        fact: fact,
        image: `https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80` // Placeholder; use city name to search
      });
    } catch (error) {
      console.error(`Error fetching ${city.name}:`, error);
      cities.push({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        fact: `${city.name} is a major city in ${city.country}.`,
        image: ''
      });
    }
    
    // Rate limit: 1 request per 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return cities;
}

// Main
fetchAllCities().then(cities => {
  fs.writeFileSync('cities-data.json', JSON.stringify(cities, null, 2));
  console.log(`\n✅ Saved ${cities.length} cities to cities-data.json`);
});
