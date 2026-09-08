import { Search } from "lucide-react";

export function SearchBox({ compact = false, defaultValue = "" }: { compact?: boolean; defaultValue?: string }) {
  return (
    <form action="/search" className={compact ? "search-box search-box-compact" : "search-box"}>
      <Search size={22} strokeWidth={1.8} aria-hidden="true" />
      <input name="q" defaultValue={defaultValue} aria-label="Search verified factories" placeholder="Search products, categories, factories or provinces" />
      <button type="submit" className="button button-blue">Search factories</button>
    </form>
  );
}
