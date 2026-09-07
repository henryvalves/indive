import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const API = process.env.NEXT_PUBLIC_API_URL

export function useRestaurants() {
  return useQuery(['restaurants'], async () => {
    const res = await axios.get(`${API}/restaurants`)
    return res.data
  })
}
