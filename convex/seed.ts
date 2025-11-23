import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample listing data with real-looking Airbnb properties
const sampleListings = [
  {
    title: "Luxurious Beachfront Villa",
    description: "Wake up to the sound of waves in this stunning beachfront property. Features include a private beach access, infinity pool, and panoramic ocean views. Perfect for families or groups looking for a tropical getaway.",
    imageSrc: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
    category: "Beach",
    roomCount: 4,
    bathroomCount: 3,
    guestCount: 8,
    locationValue: "MX", // Mexico
    price: 450,
  },
  {
    title: "Modern Downtown Loft",
    description: "Sleek and sophisticated loft in the heart of the city. Floor-to-ceiling windows, designer furniture, and walking distance to top restaurants and entertainment. Ideal for business travelers or couples.",
    imageSrc: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    category: "Modern",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 4,
    locationValue: "US",
    price: 180,
  },
  {
    title: "Charming Countryside Cottage",
    description: "Escape to the countryside in this cozy cottage surrounded by rolling hills and meadows. Features a wood-burning fireplace, garden, and outdoor patio perfect for stargazing. A peaceful retreat from city life.",
    imageSrc: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    category: "Countryside",
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 6,
    locationValue: "GB", // United Kingdom
    price: 120,
  },
  {
    title: "Tropical Island Bungalow",
    description: "Private bungalow on a secluded island paradise. Surrounded by crystal-clear waters and white sand beaches. Includes snorkeling gear, kayaks, and a private deck for sunset viewing.",
    imageSrc: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
    category: "Islands",
    roomCount: 2,
    bathroomCount: 1,
    guestCount: 4,
    locationValue: "TH", // Thailand
    price: 280,
  },
  {
    title: "Mountain Ski Chalet",
    description: "Luxurious ski-in/ski-out chalet with breathtaking mountain views. Features include a hot tub, sauna, game room, and gourmet kitchen. Located steps from the main ski lifts.",
    imageSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Skiing",
    roomCount: 5,
    bathroomCount: 4,
    guestCount: 10,
    locationValue: "CH", // Switzerland
    price: 650,
  },
  {
    title: "Lakeside Cabin Retreat",
    description: "Peaceful lakeside cabin perfect for fishing, kayaking, and relaxation. Private dock, fireplace, and large deck overlooking the water. Ideal for nature lovers and families.",
    imageSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    category: "Lake",
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 6,
    locationValue: "CA", // Canada
    price: 150,
  },
  {
    title: "Historic Castle Estate",
    description: "Live like royalty in this authentic medieval castle. Featuring turrets, grand halls, antique furnishings, and 10 acres of private grounds. Perfect for special occasions and unforgettable experiences.",
    imageSrc: "https://images.unsplash.com/photo-1585910604983-c9fa2fe7e6c7?w=800",
    category: "Castles",
    roomCount: 8,
    bathroomCount: 6,
    guestCount: 16,
    locationValue: "IE", // Ireland
    price: 890,
  },
  {
    title: "Luxury Pool Villa",
    description: "Stunning villa with a private infinity pool overlooking the valley. Modern amenities, outdoor kitchen, and spacious sun deck. Perfect for entertaining and relaxation.",
    imageSrc: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800",
    category: "Pools",
    roomCount: 4,
    bathroomCount: 3,
    guestCount: 8,
    locationValue: "IT", // Italy
    price: 380,
  },
  {
    title: "Rustic Barn Conversion",
    description: "Beautifully restored barn blending rustic charm with modern comfort. Exposed beams, large windows, and open-plan living. Set on a working farm with animals and fresh produce.",
    imageSrc: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    category: "Barns",
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 6,
    locationValue: "FR", // France
    price: 165,
  },
  {
    title: "Desert Oasis Retreat",
    description: "Unique desert home with stunning rock formations and endless views. Features include an outdoor shower, fire pit, and telescopes for stargazing. Experience the magic of the desert.",
    imageSrc: "https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800",
    category: "Desert",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 4,
    locationValue: "AE", // UAE
    price: 220,
  },
  {
    title: "Glamping Under the Stars",
    description: "Luxury camping experience with all the comforts of home. Safari-style tent with real beds, electricity, and private bathroom. Surrounded by nature with guided hikes available.",
    imageSrc: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    category: "Camping",
    roomCount: 1,
    bathroomCount: 1,
    guestCount: 2,
    locationValue: "AU", // Australia
    price: 95,
  },
  {
    title: "Mysterious Cave Dwelling",
    description: "Extraordinary cave home carved into the cliffsid. Features modern amenities while maintaining natural rock formations. Cool in summer, warm in winter. A truly unique experience.",
    imageSrc: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
    category: "Caves",
    roomCount: 2,
    bathroomCount: 1,
    guestCount: 4,
    locationValue: "ES", // Spain
    price: 175,
  },
];

// Seed mutation to populate database with sample listings
export const seedSampleListings = mutation({
  args: {},
  handler: async (ctx) => {
    // First, check if we already have listings
    const existingListings = await ctx.db.query("listings").collect();

    if (existingListings.length > 0) {
      return {
        success: false,
        message: `Database already has ${existingListings.length} listings. Skipping seed.`
      };
    }

    // Create or get a demo user to own these listings
    const existingUsers = await ctx.db.query("users").collect();
    let demoUserId;

    if (existingUsers.length > 0) {
      // Use the first existing user
      demoUserId = existingUsers[0]._id;
    } else {
      // Create a demo user
      demoUserId = await ctx.db.insert("users", {
        name: "Demo Host",
        email: "demo@airbnb.com",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
        favoriteIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    // Insert all sample listings
    const listingIds = [];
    for (const listing of sampleListings) {
      const id = await ctx.db.insert("listings", {
        ...listing,
        userId: demoUserId,
        createdAt: Date.now(),
      });
      listingIds.push(id);
    }

    return {
      success: true,
      message: `Successfully created ${listingIds.length} sample listings!`,
      listingIds
    };
  },
});

// Helper mutation to clear all listings (useful for re-seeding)
export const clearAllListings = mutation({
  args: {},
  handler: async (ctx) => {
    const listings = await ctx.db.query("listings").collect();

    for (const listing of listings) {
      await ctx.db.delete(listing._id);
    }

    return {
      success: true,
      message: `Deleted ${listings.length} listings`
    };
  },
});
