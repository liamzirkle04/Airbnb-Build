"use client";

import { safeListing, SafeUser } from "@/types";
import React from "react";
import { MdChevronRight } from "react-icons/md";
import ListingCard from "./ListingCard";

interface HorizontalListingSectionProps {
  title: string;
  subtitle?: string;
  listings: safeListing[];
  currentUser?: SafeUser | null;
  showGuestFavorite?: boolean;
}

const HorizontalListingSection: React.FC<HorizontalListingSectionProps> = ({
  title,
  subtitle,
  listings,
  currentUser,
  showGuestFavorite = false,
}) => {
  if (listings.length === 0) return null;

  return (
    <div className="w-full mb-12">
      <div className="flex items-center gap-2 mb-4 cursor-pointer group">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <MdChevronRight className="w-6 h-6 group-hover:translate-x-1 transition" />
      </div>
      {subtitle && (
        <p className="text-neutral-500 mb-4">{subtitle}</p>
      )}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex-none w-[300px] snap-start"
            >
              <ListingCard
                data={listing}
                currentUser={currentUser}
                showGuestFavorite={showGuestFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalListingSection;
