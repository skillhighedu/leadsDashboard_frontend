import { useEffect, useState } from "react"
import { toast } from "sonner"

import { fetchProfile, type ProfileResponse } from "@/services/employes.services";


export function useProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const data = await fetchProfile()
        if (mounted) setProfile(data)
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load profile"
        if (mounted) {
          setError(msg)
          toast.error(msg)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  return { profile, loading, error }
}
