/**
 * SpotZa - Smart Parking Web Application Prototype
 * Sample Generic Parking Dataset (Indian Rupees - ₹)
 * 
 * Note: All availability and pricing data are simulated for prototype demonstration.
 */

const SAMPLE_PARKING_DATA = [
  {
    id: "spot-1",
    name: "Central Multi-Level Parking Deck",
    category: "Covered Multi-Level Deck",
    tagline: "Prime location with multi-tier automated bays",
    address: "Block A, Commercial Boulevard",
    landmark: "Directly opposite Central Mall Gate 1",
    distanceKm: 0.25,
    walkTimeMinutes: 3,
    pricing: {
      carHourly: 40,
      bikeHourly: 15
    },
    totalCapacity: 160,
    availableSpots: {
      car: 38,
      bike: 22
    },
    security: {
      cctv: true,
      cctvDetails: "32 High-Definition 360° cameras with 24/7 continuous recording",
      securityGuard: true,
      guardSchedule: "24/7 Physical Guard On-Duty at entry and exit boom barriers",
      safetyRating: 4.9
    },
    amenities: [
      { name: "Covered Parking", icon: "umbrella", desc: "100% weather protected multi-level deck" },
      { name: "EV Charging Bay", icon: "zap", desc: "4 Type-2 fast charging points on Level 1" },
      { name: "Wheelchair Accessible", icon: "accessibility", desc: "Elevator access and reserved ground-level bays" },
      { name: "Automated Boom Barrier", icon: "shield", desc: "Digital ticket dispenser and license plate reader" },
      { name: "Well Lit Corridors", icon: "sun", desc: "High-lumen LED illumination throughout all decks" },
      { name: "Height Clearance", icon: "arrow-up-down", desc: "Max clearance 2.2 meters" }
    ],
    featuredTag: "Closest Walk",
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: "spot-2",
    name: "Metro Junction Safe Vault Lot",
    category: "Underground Facility",
    tagline: "Secure underground parking next to transit terminal",
    address: "Station Road, Outer Ring",
    landmark: "Adjacent to Metro Station South Concourse",
    distanceKm: 0.45,
    walkTimeMinutes: 6,
    pricing: {
      carHourly: 30,
      bikeHourly: 10
    },
    totalCapacity: 220,
    availableSpots: {
      car: 84,
      bike: 45
    },
    security: {
      cctv: true,
      cctvDetails: "Full ramp, corner, and parking slot digital surveillance",
      securityGuard: true,
      guardSchedule: "2-Guard shift coverage with regular patrol logs",
      safetyRating: 4.7
    },
    amenities: [
      { name: "Underground Covered", icon: "umbrella", desc: "Cool subterranean shelter away from sunlight" },
      { name: "Direct Metro Link", icon: "map-pin", desc: "Direct sheltered pedestrian walkway to metro" },
      { name: "Wheelchair Ramps", icon: "accessibility", desc: "Grade-separated ramp access to turnstiles" },
      { name: "Digital Gate System", icon: "shield", desc: "Automated entry slip with QR validation" },
      { name: "Tire Air & Water Station", icon: "wrench", desc: "Complimentary air check point at exit" }
    ],
    featuredTag: "Best Value",
    rating: 4.7,
    reviewsCount: 218
  },
  {
    id: "spot-3",
    name: "City Plaza Underground Garage",
    category: "Premium Commercial Basement",
    tagline: "Spacious premium facility with valet assistance",
    address: "Civic Center Complex, Sector 4",
    landmark: "Underground level of Financial & Retail Plaza",
    distanceKm: 0.65,
    walkTimeMinutes: 8,
    pricing: {
      carHourly: 60,
      bikeHourly: 20
    },
    totalCapacity: 300,
    availableSpots: {
      car: 112,
      bike: 60
    },
    security: {
      cctv: true,
      cctvDetails: "Dedicated control room with AI motion tracking and 64 cameras",
      securityGuard: true,
      guardSchedule: "24/7 Uniformed Security Agency team with canine patrols",
      safetyRating: 5.0
    },
    amenities: [
      { name: "Valet Assistance", icon: "user-check", desc: "Optional courteous valet parking service" },
      { name: "High Clearance (2.4m)", icon: "arrow-up-down", desc: "Accommodates full-size SUVs and crossovers" },
      { name: "EV Fast Chargers", icon: "zap", desc: "8 DC fast-charging bays with mobile app link" },
      { name: "Express Elevators", icon: "chevrons-up", desc: "Direct lift access to retail floors" },
      { name: "Clean Restrooms", icon: "sparkles", desc: "Sanitized driver lounges and restrooms" }
    ],
    featuredTag: "High Security",
    rating: 4.9,
    reviewsCount: 385
  },
  {
    id: "spot-4",
    name: "District Market Open Secure Yard",
    category: "Gated Paved Open Lot",
    tagline: "Budget-friendly parking ideal for quick market shopping",
    address: "East Avenue, Near Market Gate 2",
    landmark: "Behind East Market Wholesale Arcade",
    distanceKm: 0.85,
    walkTimeMinutes: 11,
    pricing: {
      carHourly: 20,
      bikeHourly: 10
    },
    totalCapacity: 90,
    availableSpots: {
      car: 14,
      bike: 8
    },
    security: {
      cctv: true,
      cctvDetails: "Boundary perimeter CCTV cameras covering main gate",
      securityGuard: false,
      guardSchedule: "Daytime attendant only (08:00 AM - 08:00 PM)",
      safetyRating: 4.1
    },
    amenities: [
      { name: "Gated Perimeter", icon: "shield", desc: "Fully fenced perimeter with single entry/exit" },
      { name: "Paved Surface", icon: "check", desc: "Asphalt paved surface with clear yellow lane markings" },
      { name: "Quick Open Access", icon: "clock", desc: "No height restrictions; easy turnaround" }
    ],
    featuredTag: "Budget Pick",
    rating: 4.2,
    reviewsCount: 96
  }
];

// Quick destination suggestions for Screen 1
const POPULAR_DESTINATIONS = [
  "City Center Commercial Hub",
  "Central Metro Terminal",
  "District Shopping Plaza",
  "Civic Financial District",
  "North General Hospital"
];
