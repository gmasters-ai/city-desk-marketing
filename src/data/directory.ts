export const directoryTiers = [
  {
    id: 'standard',
    name: 'Standard listing',
    price: 89,
    per: 'year',
    featured: false,
    features: [
      'Profile in the network directory',
      'Indexed, permanent listing',
      'Name, contact, category & link',
    ],
    cta: 'Add a listing',
    href: 'https://app.citydeskmarketing.com/auth/register',
  },
  {
    id: 'featured',
    name: 'Featured listing',
    price: 149,
    per: 'year',
    featured: true,
    features: [
      'Everything in Standard',
      '<strong style="color:#fff">Sidebar banner</strong> on article pages',
      'Sitewide exposure across the paper',
    ],
    cta: 'Go featured',
    href: 'https://app.citydeskmarketing.com/auth/register',
  },
] as const;
