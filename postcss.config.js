module.exports = {
  plugins: {
    // Support both the new plugin package and the legacy key name so tooling
    // that still references "tailwindcss" as a PostCSS plugin won't fail.
    'tailwindcss': require('@tailwindcss/postcss'),
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}