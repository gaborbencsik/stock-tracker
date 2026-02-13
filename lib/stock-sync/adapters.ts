import { promises as fs } from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import type { Stock } from '../../src/types/Stock'
import type { FileAdapter, GitAdapter } from './syncStockPrices'

export class FileSystemAdapter implements FileAdapter {
  async read(filePath: string): Promise<Stock[]> {
    try {
      const absolutePath = path.resolve(filePath)
      const data = await fs.readFile(absolutePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse JSON: ${error.message}`)
      }
      throw new Error(`Failed to read file: ${(error as NodeJS.ErrnoException).message}`)
    }
  }

  async write(filePath: string, stocks: Stock[]): Promise<void> {
    try {
      const absolutePath = path.resolve(filePath)
      const jsonData = JSON.stringify(stocks, null, 2)
      await fs.writeFile(absolutePath, jsonData, 'utf-8')
    } catch (error) {
      throw new Error(`Failed to write file: ${(error as Error).message}`)
    }
  }
}

export class GitCommandAdapter implements GitAdapter {
  private projectRoot: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  async add(filePath: string): Promise<void> {
    try {
      execSync(`git -C "${this.projectRoot}" add "${filePath}"`, {
        stdio: 'pipe',
        encoding: 'utf-8',
      })
    } catch (error) {
      throw new Error(`Failed to stage file: ${(error as Error).message}`)
    }
  }

  async commit(message: string): Promise<void> {
    try {
      execSync(`git -C "${this.projectRoot}" commit -m "${message}"`, {
        stdio: 'pipe',
        encoding: 'utf-8',
      })
    } catch (error) {
      throw new Error(`Failed to commit: ${(error as Error).message}`)
    }
  }

  async push(): Promise<void> {
    try {
      execSync(`git -C "${this.projectRoot}" push`, {
        stdio: 'pipe',
        encoding: 'utf-8',
      })
    } catch (error) {
      throw new Error(`Failed to push: ${(error as Error).message}`)
    }
  }
}
