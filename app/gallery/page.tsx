import Gallery from '@/components/Gallery'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Duyen Le | Gallery',
    description: 'Welcome to my personal blog',
  }
}

interface GitHubFile {
  name: string
}

const OWNER = 'duyenle1312'
const REPO = 'personal-blog'
const IMAGES_PATH = 'public/images'

const CONTENTS_API = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${IMAGES_PATH}`
const COMMITS_API = `https://api.github.com/repos/${OWNER}/${REPO}/commits`
const RAW_BASE_URL = `https://raw.githubusercontent.com/${OWNER}/${REPO}/master/${IMAGES_PATH}`

async function getLastCommitDate(filePath: string) {
  const res = await fetch(
    `${COMMITS_API}?path=${filePath}&per_page=1`
  )

  if (!res.ok) return null

  const commits = await res.json()
  return commits[0]?.commit?.committer?.date ?? null
}

async function getGallerySections() {
  const res = await fetch(CONTENTS_API, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch images')
  }

  const files = await res.json()

  const imageFiles = files.filter((file: GitHubFile) =>
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
  )

  const imagesWithDates = await Promise.all(
    imageFiles.map(async (file: GitHubFile) => {
      const commitDate = await getLastCommitDate(
        `${IMAGES_PATH}/${file.name}`
      )

      return {
        src: `${RAW_BASE_URL}/${file.name}`,
        alt: file.name
          .replace(/[-_]/g, ' ')
          .replace(/\.[^/.]+$/, ''),
        date: commitDate,
      }
    })
  )

  // 🔥 Sort newest → oldest
  imagesWithDates.sort((a, b) => {
    if (!a.date || !b.date) return 0
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return [
    {
      type: 'grid',
      images: imagesWithDates,
    },
  ]
}

const GalleryPage = async () => {
  const gallerySections = await getGallerySections()
  return <Gallery sections={gallerySections} />
}

export default GalleryPage
