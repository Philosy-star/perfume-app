import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function PerfumeDetail() {
  const router = useRouter()
  const { id } = router.query
  const [perfume, setPerfume] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchPerfume()
    }
  }, [id])

  async function fetchPerfume() {
    const { data, error } = await supabase.from('perfumes').select('*').eq('id', id).single()
    if (error) {
      console.error(error)
    } else {
      setPerfume(data)
    }
    setLoading(false)
  }

  if (loading) return <p>読み込み中...</p>
  if (!perfume) return <p>香水が見つかりませんでした</p>

  return (
    <div style={{ padding: '20px' }}>
      <h1>{perfume.perfume_name}</h1>
      <p><strong>ブランド:</strong> {perfume.brand}</p>
      <p><strong>Top Notes:</strong> {perfume.top_note1}, {perfume.top_note2}, {perfume.top_note3}</p>
      <p><strong>Middle Notes:</strong> {perfume.middle_note1}, {perfume.middle_note2}, {perfume.middle_note3}</p>
      <p><strong>Base Notes:</strong> {perfume.base_note1}, {perfume.base_note2}, {perfume.base_note3}</p>
      <p><strong>Description:</strong> {perfume.description || '（未入力）'}</p>
    </div>
  )
}
