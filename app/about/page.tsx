// /app/page.tsx
 
import markdownToHtml from '@/lib/markdownToHtml'
import { getSingletonBySlug } from 'outstatic/server'
 
export default async function HomePage() {
  const home = await getData()
  return (
    <main className='p-12'>
      <h1 className='text-black'>{home?.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: home?.content || '' }} />
    </main>
  )
}
 
async function getData() {
  const home = getSingletonBySlug('home', [
    'title',
    'content',
    'description'
  ])

  const content = await markdownToHtml(home?.content || '')

  console.log('home', home)
 
  return { ...home, content }
}