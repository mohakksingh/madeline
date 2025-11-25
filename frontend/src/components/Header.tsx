'use client';

import { ThemeToggle } from './ThemeToggle';
import { Bell, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function Header() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`/dashboard?${params.toString()}`);
  }, 300);

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('search')?.toString()}
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all placeholder:text-muted-foreground text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
        </button>
        <div className="h-6 w-px bg-border"></div>
        <ThemeToggle />
      </div>
    </header>
  );
}
