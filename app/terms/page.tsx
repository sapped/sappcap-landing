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
            <TermlyPolicy policyId="0d95a406-49de-49c5-b67f-bac38e9a290a" />
          </div>
        </div>
      </main>
    </>
  )
}