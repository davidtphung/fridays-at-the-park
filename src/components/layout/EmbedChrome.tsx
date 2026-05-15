'use client';

import { useEffect } from 'react';

/**
 * Toggles a `data-embed="1"` attribute on <html> when the URL has `?embed=1`
 * or `?embed=true`. CSS in globals.css (`html[data-embed='1'] .embed-hide`)
 * uses this attribute to hide the header / footer / mobile tab bar so the
 * works site can be cleanly iframed inside fridaysatthepark.org.
 *
 * Runs only on the client (the page is still server-rendered).
 */
export function EmbedChrome() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const value = params.get('embed');
    if (value === '1' || value === 'true') {
      document.documentElement.setAttribute('data-embed', '1');
    } else {
      document.documentElement.removeAttribute('data-embed');
    }
  }, []);
  return null;
}
