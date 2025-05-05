import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function FreeSearch() {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')

  async function handleSearch() {
    if (!term) {
      setMessage('キーワードを入力してください')
      setResults([])
      return
    }
    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .or(`perfume_name.ilike.%${term}%,brand.ilike.%${term}%,top_note1.ilike.%${term}%,middle_note1.ilike.%${term}%,base_note1.ilike.%${term}%`)
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
      <h1>フリー検索</h1>
      <p>フリーワードで香水を検索できます</p>

      <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="キーワード" style={{ padding: '8px', width: '300px' }} />
      <button onClick={handleSearch} style={{ padding: '8px 12px', marginLeft: '10px' }}>
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
