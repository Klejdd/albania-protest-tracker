'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { translations } from '@/lib/i18n'

export default function Results() {
  const [lang, setLang] = useState<'sq' | 'en'>('en')
  const t = translations[lang]
  const [totalResponses, setTotalResponses] = useState(0)
  const [locationBreakdown, setLocationBreakdown] = useState<any[]>([])
  const [educationBreakdown, setEducationBreakdown] = useState<any[]>([])
  const [jobBreakdown, setJobBreakdown] = useState<any[]>([])
  const [goalsFrequency, setGoalsFrequency] = useState<any[]>([])
  const [ageDistribution, setAgeDistribution] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [showComments, setShowComments] = useState(false)
  const [nickname, setNickname] = useState('')
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    loadDashboard()
    const nick = localStorage.getItem('nickname')
    if (nick) setNickname(nick)
  }, [])

  async function loadDashboard() {
    setLoading(true)

    // Total responses
    const { count: totalCount } = await supabase.from('protest_answers').select('*', { count: 'exact', head: true })
    setTotalResponses(totalCount || 0)

    // Location breakdown
    const { data: locationData } = await supabase.from('user_profiles').select('location').eq('location', 'albania').or('location.eq.abroad')
    if (locationData) {
      const counts: any = { albania: 0, abroad: 0 }
      locationData.forEach((p: any) => counts[p.location]++)
      setLocationBreakdown([
        { label: lang === 'sq' ? 'Në Shqipëri' : 'In Albania', count: counts.albania, color: 'bg-red-600' },
        { label: lang === 'sq' ? 'Në diasporë' : 'Abroad', count: counts.abroad, color: 'bg-blue-600' },
      ])
    }

    // Education breakdown
    const { data: eduData } = await supabase.from('user_profiles').select('education_status')
    if (eduData) {
      const counts: any = { high_school: 0, in_progress: 0, finished: 0 }
      eduData.forEach((p: any) => counts[p.education_status]++)
      setEducationBreakdown([
        { label: lang === 'sq' ? 'Gjimnaz' : 'High School', count: counts.high_school, color: 'bg-green-600' },
        { label: lang === 'sq' ? 'Universitet (në vazhdim)' : 'University (in progress)', count: counts.in_progress, color: 'bg-purple-600' },
        { label: lang === 'sq' ? 'Universitet i përfunduar' : 'University completed', count: counts.finished, color: 'bg-yellow-600' },
      ])
    }

    // Age distribution
    const { data: ageData } = await supabase.from('user_profiles').select('age')
    if (ageData) {
      const ranges: any = { '16-20': 0, '21-25': 0, '26-30': 0, '31-40': 0, '41-50': 0, '51+': 0 }
      ageData.forEach((p: any) => {
        const a = p.age
        if (a <= 20) ranges['16-20']++
        else if (a <= 25) ranges['21-25']++
        else if (a <= 30) ranges['26-30']++
        else if (a <= 40) ranges['31-40']++
        else if (a <= 50) ranges['41-50']++
        else ranges['51+']++
      })
      setAgeDistribution([
        { label: '16-20', count: ranges['16-20'], color: 'bg-pink-600' },
        { label: '21-25', count: ranges['21-25'], color: 'bg-orange-600' },
        { label: '26-30', count: ranges['26-30'], color: 'bg-blue-600' },
        { label: '31-40', count: ranges['31-40'], color: 'bg-green-600' },
        { label: '41-50', count: ranges['41-50'], color: 'bg-purple-600' },
        { label: '51+', count: ranges['51+'], color: 'bg-gray-600' },
      ])
    }

    // Goals frequency
    const { data: answerData } = await supabase.from('protest_answers').select('protest_goals')
    if (answerData) {
      const freq: any = {}
      answerData.forEach((a: any) => {
        (a.protest_goals || []).forEach((goal: string) => {
          const trimmed = goal.trim().toLowerCase()
          if (trimmed) freq[trimmed] = (freq[trimmed] || 0) + 1
        })
      })
      const sorted = Object.entries(freq)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 10)
        .map(([goal, count]: any) => ({ goal, count }))
      setGoalsFrequency(sorted)
    }

    // Comments
    const { data: commentData } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(100)
    if (commentData) setComments(commentData)

    setLoading(false)
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    setCommentLoading(true)
    const nick = localStorage.getItem('nickname') || ''
    const { error } = await supabase.from('comments').insert({ nickname: nick, comment: newComment })
    if (!error) { setNewComment(''); loadDashboard() }
    setCommentLoading(false)
  }

  const maxGoals = goalsFrequency.length > 0 ? goalsFrequency[0].count : 1
  const maxBar = Math.max(...locationBreakdown.map(b => b.count), ...educationBreakdown.map(b => b.count), ...ageDistribution.map(b => b.count), 1)

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">{t.dashboard_title}</h1>
          <div className="flex items-center gap-3">
            {nickname && <span className="badge badge-blue">@{nickname}</span>}
            <button onClick={() => setLang(l => l === 'sq' ? 'en' : 'sq')} className="badge badge-gray cursor-pointer">{lang === 'sq' ? 'SQ' : 'EN'}</button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <div className="space-y-8">
            {/* Stats header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{t.total_responses}</h2>
                <p className="text-5xl font-bold text-red-500 mt-2">{totalResponses}</p>
              </div>
            </div>

            {/* Grid of charts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Location */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{t.location_dist}</h3>
                <div className="space-y-3">
                  {locationBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="bar-container">
                        <div className={`bar-fill ${item.color}`} style={{ width: `${(item.count / maxBar) * 100}%` }}>
                          <span className="bar-text">{item.count > 0 ? item.count : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{t.education_dist}</h3>
                <div className="space-y-3">
                  {educationBreakdown.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="bar-container">
                        <div className={`bar-fill ${item.color}`} style={{ width: `${(item.count / maxBar) * 100}%` }}>
                          <span className="bar-text">{item.count > 0 ? item.count : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{t.age_dist}</h3>
                <div className="space-y-3">
                  {ageDistribution.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.label}</span>
                        <span className="font-semibold">{item.count}</span>
                      </div>
                      <div className="bar-container">
                        <div className={`bar-fill ${item.color}`} style={{ width: `${(item.count / maxBar) * 100}%` }}>
                          <span className="bar-text">{item.count > 0 ? item.count : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Goals */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">{t.top_goals}</h3>
              {goalsFrequency.length === 0 ? (
                <p className="text-gray-500 text-center py-8">{lang === 'sq' ? 'Ende nuk ka përgjigje.' : 'No responses yet.'}</p>
              ) : (
                <div className="space-y-4">
                  {goalsFrequency.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <span className="badge badge-red w-8 h-8 flex items-center justify-center shrink-0 text-sm">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{item.goal}</span>
                          <span className="text-gray-400">{item.count} {lang === 'sq' ? 'herë' : 'times'}</span>
                        </div>
                        <div className="bar-container">
                          <div className="bar-fill bg-red-600" style={{ width: `${(item.count / maxGoals) * 100}%` }}>
                            <span className="bar-text">{item.count > 0 ? item.count : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.comments_title}</h3>
                <button onClick={() => setShowComments(!showComments)} className="badge badge-gray cursor-pointer">
                  {showComments ? 'Hide' : 'Show'}
                </button>
              </div>

              {showComments && (
                <>
                  <div className="flex gap-3 mb-6">
                    <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()} placeholder={t.comment_placeholder} className="input-field flex-1" />
                    <button onClick={handleCommentSubmit} disabled={commentLoading || !newComment.trim()} className="btn-primary whitespace-nowrap">{commentLoading ? '...' : t.submit_comment}</button>
                  </div>
                  <div className="space-y-3">
                    {comments.map(comment => (
                      <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge badge-blue">@{comment.nickname}</span>
                          <span className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-300">{comment.comment}</p>
                      </div>
                    ))}
                    {comments.length === 0 && <p className="text-gray-500 text-center py-8">{t.no_comments}</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
