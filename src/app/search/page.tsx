import SearchClient from "./SearchClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Search - JayTech",
  description: "Search JayTech services, projects, and guides.",
}

export default function SearchPage() {
  return <SearchClient />
}
