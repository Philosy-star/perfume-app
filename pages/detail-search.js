import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function DetailSearch() {
  const [brand, setBrand] = useState('')
  const [note, setNote] = useState('')
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')

  async function handleSearch() {
    let query = supabase.from('perfumes').select('*')

    if (brand) {
      query = query.ilike('brand', `%${brand}%`)
    }
    if (note) {
      const orClause = `top_note1.ilike.%${note}%,middle_note1.ilike.%${note}%,base_note1.ilike.%${note}%`
      query = query.or(orClause)
    }

    const { data, error } = await query
    if (error) {
      setMessage('エラーが発生しました')
      setResults([])
    } else if (data.length === 0) {
      setMessage('該当する香水が見つかりません')
      setResults([])
    } else {
      setMessage('')
      setResults(data)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>詳細検索</h1>
      <p>ブランドやノート（香調）から香水を検索できます</p>

      <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="ブランド" style={{ padding: '8px', marginRight: '10px' }} />
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="ノート" style={{ padding: '8px', marginRight: '10px' }} />
      <button onClick={handleSearch} style={{ padding: '8px 12px' }}>
        検索
      </button>

      {message && <p>{message}</p>}
      <ul>
        {results.map((item) => (
          <li key={item.id}>
            <Link href={`/perfume/${item.id}`}>
              <strong>{item.perfume_name}</strong> - {item.brand}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
