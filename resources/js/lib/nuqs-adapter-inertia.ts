import { router, usePage } from '@inertiajs/react';
import {
  unstable_createAdapterProvider as createAdapterProvider,
  renderQueryString,
  type unstable_AdapterInterface as AdapterInterface,
  type unstable_AdapterOptions as AdapterOptions,
  type unstable_UpdateUrlFunction as UpdateUrlFunction
} from 'nuqs/adapters/custom';
import * as React from 'react';
import { useEffect } from 'react';

/**
 * Safely construct a URL from an Inertia `usePage().url` value which can be:
 *  - a path ("/my-route")
 *  - a relative path without leading slash ("my-route")
 *  - a query only string ("?page=2")
 *  - already absolute ("https://example.com/my-route")
 */
function buildAbsoluteUrl(raw: string | null | undefined): URL {
  if (typeof window === 'undefined') {
    return new URL('http://localhost/');
  }

  const origin = window.location.origin;
  const safe = (raw ?? '').trim();

  try {
    if (!safe) return new URL(window.location.href);

    // Already absolute
    if (/^https?:\/\//i.test(safe)) return new URL(safe);

    // Query only
    if (safe.startsWith('?')) {
      return new URL(window.location.pathname + safe, origin);
    }

    // If it contains spaces or invalid chars that would break new URL, encode minimally
    const normalized = safe.replace(/\s+/g, '%20');
    const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
    return new URL(path, origin);
  } catch (e) {
    console.warn('[nuqs-inertia-adapter] Failed to build URL from', safe, e);
    return new URL(window.location.href);
  }
}

function useNuqsInertiaAdapter(): AdapterInterface {
  // Inertia gives something like "/my-domains?page=1" (path + query, no origin)
  // Rare edge cases (during hot reload) might give an empty string.
  const inertiaUrl = usePage().url || window.location.pathname + window.location.search;

  // Optimistic local copy of search params to reduce flicker
  const [searchParams, setSearchParams] = React.useState(() =>
    buildAbsoluteUrl(inertiaUrl).searchParams
  );

  // Update when Inertia route changes
  useEffect(() => {
    setSearchParams(buildAbsoluteUrl(inertiaUrl).searchParams);
  }, [inertiaUrl]);

  const updateUrl: UpdateUrlFunction = React.useCallback(
    (nextSearch: URLSearchParams, options: AdapterOptions) => {
      if (typeof window === 'undefined') return;

      const current = buildAbsoluteUrl(inertiaUrl);
      // Ensure search string formatting (renderQueryString already returns string WITHOUT leading '?')
      const rendered = renderQueryString(nextSearch);
      current.search = rendered;
      setSearchParams(current.searchParams);

      const fullUrl = current.toString();

      if (options?.shallow === false) {
        // Use relative path for Inertia to avoid potential absolute URL edge cases
        const relative = current.pathname + (rendered ? `?${rendered}` : '');
        router.visit(relative, {
          replace: options.history === 'replace',
          preserveScroll: !options.scroll,
          preserveState: true,
          async: true
        });
        return;
      }

      // Shallow: direct history update without network call
      const method = options.history === 'replace' ? 'replaceState' : 'pushState';
      try {
        window.history[method](
          { ...window.history.state, url: fullUrl },
          '',
          fullUrl
        );
      } catch (e) {
        console.warn('[nuqs-inertia-adapter] history update failed, falling back to location.assign', e);
        if (options.history === 'replace') {
          window.location.replace(fullUrl);
        } else {
          window.location.assign(fullUrl);
        }
      }
    },
    [inertiaUrl]
  );

  return { searchParams, updateUrl };
}

export const NuqsAdapter = createAdapterProvider(useNuqsInertiaAdapter);
