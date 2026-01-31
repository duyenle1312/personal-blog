export async function generateMetadata() {
  return {
    title: 'Duyen Le | Dashboard',
    description: 'Welcome to my personal blog',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body id="outstatic">{children}</body>
    </html>
  )
}