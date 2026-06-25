export const PER_ARTICLE = 12;

export const bundles = [
  { id: 'starter',   name: 'Starter',   articles: 25,  cadence: '2× / week', duration: '~3 months',  perArticle: 12, total: 300,  popular: false, href: 'https://app.citydeskmarketing.com/auth/register?plan=starter'   },
  { id: 'growth',    name: 'Growth',    articles: 50,  cadence: '2× / week', duration: '~6 months',  perArticle: 11, total: 550,  popular: false, href: 'https://app.citydeskmarketing.com/auth/register?plan=growth'    },
  { id: 'authority', name: 'Authority', articles: 100, cadence: '2× / week', duration: '~12 months', perArticle: 10, total: 1000, popular: true,  href: 'https://app.citydeskmarketing.com/auth/register?plan=authority' },
  { id: 'agency',    name: 'Agency',    articles: 250, cadence: '3× / week', duration: '~12 months', perArticle: 9,  total: 2250, popular: false, href: 'https://app.citydeskmarketing.com/auth/register?plan=agency'    },
] as const;
