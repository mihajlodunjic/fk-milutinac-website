export const imageAssets = {
  field: {
    wide: {
      avif: "/media/field-wide-1600.avif",
      webp: "/media/field-wide-1600.webp",
      width: 1600,
      height: 1000
    },
    portrait: {
      avif: "/media/field-portrait-960.avif",
      webp: "/media/field-portrait-960.webp",
      width: 960,
      height: 1200
    },
    banner: {
      avif: "/media/field-banner-1200.avif",
      webp: "/media/field-banner-1200.webp",
      width: 1200,
      height: 675
    },
    alt: "Neutralni kadar linije na fudbalskom terenu sa veštačkom travom"
  }
} as const;

export const assetSources = [
  {
    name: "Half-way line on the Brastad arena soccer field 2",
    author: "W.carter",
    license: "CC0 1.0",
    url: "https://commons.wikimedia.org/wiki/File:Half-way_line_on_the_Brastad_arena_soccer_field_2.jpg"
  }
] as const;
