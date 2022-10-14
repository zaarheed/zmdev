import fs from 'fs'
import path from 'path'

export const PROJECTS_PATH = path.join(process.cwd(), '_projects')
export const MILESTONES_PATH = path.join(process.cwd(), '_posts')

export const postFilePaths = fs
  .readdirSync(PROJECTS_PATH)
  // Only include mdx files
  .filter((path) => /\.mdx?$/.test(path))
  
export const milestoneFilePaths = fs
  .readdirSync(MILESTONES_PATH)
  // Only include mdx files
  .filter((path) => /\.mdx?$/.test(path))