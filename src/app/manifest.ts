import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    "name": "OOUMPH",
    "short_name": "OOUMPH",
    "description": "The Socail Medaia Community App",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
      {
        "src": "/assets/logo.jpg",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/assets/logo_md.jpg",
        "sizes": "256x256",
        "type": "image/png"
      },
      {
        "src": "/assets/logo_md.jpg",
        "sizes": "384x384",
        "type": "image/png"
      },
      {
        "src": "/assets/logo_md.jpg",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }

}
