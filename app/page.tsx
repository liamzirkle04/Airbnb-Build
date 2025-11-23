import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listing/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";
import { mockListings } from "@/lib/mockListings";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  let listing = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  // Use mock listings if no real listings exist and no filters are applied
  const hasFilters = Object.keys(searchParams || {}).length > 0;
  if (listing.length === 0 && !hasFilters) {
    listing = mockListings as any;
  }

  if (listing.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8 overflow-x-hidden">
          {listing.map((list) => {
            return (
              <ListingCard
                key={list.id}
                data={list}
                currentUser={currentUser}
              />
            );
          })}
        </div>
      </Container>
    </ClientOnly>
  );
}
