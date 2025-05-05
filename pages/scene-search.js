import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function SceneSearch() {
  const [selectedSeasons, setSelectedSeasons] = useState([])
  const [selectedGenders, setSelectedGenders] = useState([])
  const [selectedImpression, setSelectedImpression] = useState('')
  const [results, setResults] = useState([])
  const [message, setMessage] = useState('')

  function handleCheckboxChange(value, list, setList) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
    } else {
      setList([...list, value])
    }
  }

  async function handleSearch() {
    let query = supabase.from('perfumes').select('*')

    if (selectedSeasons.length > 0) {
      query = query.in('season', selectedSeasons)
    }
    if (selectedGenders.length > 0) {
      query = query.in('gender', selectedGenders)
    }
    if (selectedImpression) {
      query = query.ilike('impression', `%${selectedImpression}%`)
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
      <h1>シーン検索</h1>
      <p>季節、性別、香りの印象から香水を検索できます</p>

      <div>
        <label>季節:</label>
        {['春', '夏', '秋', '冬'].map((season) => (
          <label key={season} style={{ marginLeft: '10px' }}>
            <input
              type="checkbox"
              checked={selectedSeasons.includes(season)}
              onChange={() => handleCheckboxChange(season, selectedSeasons, setSelectedSeasons)}
            />
            {season}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>性別:</label>
        {['メンズ', 'レディース', 'ユニセックス'].map((gender) => (
          <label key={gender} style={{ marginLeft: '10px' }}>
            <input
              type="checkbox"
              checked={selectedGenders.includes(gender)}
              onChange={() => handleCheckboxChange(gender, selectedGenders, setSelectedGenders)}
            />
            {gender}
          </label>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>香りの印象:</label>
        <select
          value={selectedImpression}
          onChange={(e) => setSelectedImpression(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        >
          <option value="">選択してください</option>
          {['ムスク', 'フローラル', 'ウッディ', 'スパイシー', 'バニラ'].map((imp) => (
            <option key={imp} value={imp}>
              {imp}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleSearch} style={{ padding: '8px 12px', marginTop: '10px' }}>
        シーン検索
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
