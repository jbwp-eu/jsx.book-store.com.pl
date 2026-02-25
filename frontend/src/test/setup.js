
import '@testing-library/jest-dom'

import '../i18n'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,                   // Simulate no media queries matching
    media: query,
    onchange: null,
    addListener: () => { },            // Stub for deprecated addListener API (does nothing)
    removeListener: () => { },         // Stub for deprecated removeListener API (does nothing)
    addEventListener: () => { },       // Stub for addEventListener (does nothing)
    removeEventListener: () => { },    // Stub for removeEventListener (does nothing)
    dispatchEvent: () => false,       // Stub for dispatchEvent (does nothing)
  }),
})
