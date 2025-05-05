import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function Home() {
  const [freeTerm, setFreeTerm] = useState('')
  const [brandTerm, setBrandTerm] = useState('')
  const [noteTerm, setNoteTerm] = useState('')
  const [selectedSeasons, setSelectedSeasons] = useState([])
  const [selectedGenders, setSelectedGenders] = useState([])
  const [selectedImpression, setSelectedImpression] = useState('')
  const [perfumes, setPerfumes] = useState([])
  const [message, setMessage] = useState('')

  // フリー検索
  async function handleFreeSearch() {
    if (!freeTerm) {
      setMessage('キーワードを入力してください')
      setPerfumes([])
      return
    }

    const { data, error } = await supabase
      .from('perfumes')
      .select('*')
      .or(`perfume_name.ilike.%${freeTerm}%,brand.ilike.%${freeTerm}%,top_note1.ilike.%${freeTerm}%,top_note2.ilike.%${freeTerm}%,top_note3.ilike.%${freeTerm}%,top_note4.ilike.%${freeTerm}%,top_note5.ilike.%${freeTerm}%,middle_note1.ilike.%${freeTerm}%,middle_note2.ilike.%${freeTerm}%,middle_note3.ilike.%${freeTerm}%,middle_note4.ilike.%${freeTerm}%,middle_note5.ilike.%${freeTerm}%,base_note1.ilike.%${freeTerm}%,base_note2.ilike.%${freeTerm}%,base_note3.ilike.%${freeTerm}%,base_note4.ilike.%${freeTerm}%,base_note5.ilike.%${freeTerm}%`)

    handleResult(data, error)
  }

  // 詳細検索
  async function handleDetailSearch() {
    if (!brandTerm && !noteTerm) {
      setMessage('ブランドまたはノートを入力してください')
      setPerfumes([])
      return
    }

    let query = supabase.from('perfumes').select('*')

    if (brandTerm) {
      query = query.ilike('brand', `%${brandTerm}%`)
    }
    if (noteTerm) {
      const orClause = `top_note1.ilike.%${noteTerm}%,top_note2.ilike.%${noteTerm}%,top_note3.ilike.%${noteTerm}%,top_note4.ilike.%${noteTerm}%,top_note5.ilike.%${noteTerm}%,middle_note1.ilike.%${noteTerm}%,middle_note2.ilike.%${noteTerm}%,middle_note3.ilike.%${noteTerm}%,middle_note4.ilike.%${noteTerm}%,middle_note5.ilike.%${noteTerm}%,base_note1.ilike.%${noteTerm}%,base_note2.ilike.%${noteTerm}%,base_note3.ilike.%${noteTerm}%,base_note4.ilike.%${noteTerm}%,base_note5.ilike.%${noteTerm}%`
      query = query.or(orClause)
    }

    const { data, error } = await query
    handleResult(data, error)
  }

  // シーン検索
  async function handleSceneSearch() {
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
    handleResult(data, error)
  }

  function handleCheckboxChange(value, list, setList) {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
    } else {
      setList([...list, value])
    }
  }

  function handleResult(data, error) {
    if (error) {
      console.error(error)
      setMessage('エラーが発生しました')
      setPerfumes([])
    } else if (data.length === 0) {
      setMessage('該当する香水が見つかりません')
      setPerfumes([])
    } else {
      setMessage('')
      setPerfumes(data)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfume Search</h1>

      {/* フリー検索 */}
      <div>
        <input
          type="text"
          placeholder="フリー検索"
          value={freeTerm}
          onChange={(e) => setFreeTerm(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <button onClick={handleFreeSearch} style={{ padding: '8px 12px', marginLeft: '10px' }}>
          フリー検索
        </button>
      </div>

      {/* 詳細検索 */}
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="ブランド"
          value={brandTerm}
          onChange={(e) => setBrandTerm(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="ノート"
          value={noteTerm}
          onChange={(e) => setNoteTerm(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={handleDetailSearch} style={{ padding: '8px 12px' }}>
          詳細検索
        </button>
      </div>

      {/* シーン検索 */}
      <div style={{ marginTop: '20px' }}>
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

        <button onClick={handleSceneSearch} style={{ padding: '8px 12px', marginTop: '10px' }}>
          シーン検索
        </button>
      </div>

      {/* 検索結果 */}
      {message && <p>{message}</p>}
      <ul style={{ marginTop: '20px' }}>
        {perfumes.map((perfume) => (
          <li key={perfume.id}>
            <Link href={`/perfume/${perfume.id}`}>
              <strong>{perfume.perfume_name}</strong> - {perfume.brand}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
