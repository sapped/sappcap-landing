import { Navbar } from '@/components/navbar'
import TermlyPolicy from '@/components/termly-policy'

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-12 text-gray-900 dark:text-white">Cookie Policy</h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <TermlyPolicy policyId="6335951d-2748-4785-a738-bdbac9fc9060" />
          </div>
        </div>
      </main>
    </>
  )
}