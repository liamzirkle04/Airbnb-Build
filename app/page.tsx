import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import HorizontalListingSection from "@/components/listing/HorizontalListingSection";
import { groupListingsByLocation } from "@/lib/listingHelpers";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const listing = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listing.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  // Group listings by location for horizontal sections
  const groupedByLocation = groupListingsByLocation(listing, 3);

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24">
          {groupedByLocation.map((group) => (
            <HorizontalListingSection
              key={group.location}
              title={`Popular homes in ${group.locationLabel}`}
              listings={group.listings}
              currentUser={currentUser}
              showGuestFavorite={true}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
}
