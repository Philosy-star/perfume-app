import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Perfume Search App</h1>

      <div style={{ marginTop: '20px' }}>
        <Link href="/free-search">
          <h2>フリー検索</h2>
        </Link>
        <p>フリーワードで香水を検索できます</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/detail-search">
          <h2>詳細検索</h2>
        </Link>
        <p>ブランドやノート（香調）から香水を検索できます</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link href="/scene-search">
          <h2>シーン検索</h2>
        </Link>
        <p>季節、性別、香りの印象から香水を検索できます</p>
      </div>
    </div>
  )
}
