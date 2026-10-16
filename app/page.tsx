'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { translations } from '@/lib/i18n'

export default function Home() {
  const [lang, setLang] = useState<'sq' | 'en'>('sq')
  const t = translations[lang]
  const [nickname, setNickname] = useState('')
  const [location, setLocation] = useState('albania')
  const [hasProtested, setHasProtested] = useState(false)
  const [age, setAge] = useState(18)
  const [educationStatus, setEducationStatus] = useState('high_school')
  const [universityMajor, setUniversityMajor] = useState('')
  const [plannedMajor, setPlannedMajor] = useState('')
  const [hasJob, setHasJob] = useState(false)
  const [currentJob, setCurrentJob] = useState('')
  const [worksForGovernment, setWorksForGovernment] = useState(false)
  const [protestGoals, setProtestGoals] = useState(['', '', '', '', ''])
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  useEffect(() => {
    loadComments()
    const stored = localStorage.getItem('nickname')
    if (stored) setNickname(stored)
  }, [])

  async function loadComments() {
    const { data } = await supabase.from('comments').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setComments(data)
  }

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      localStorage.setItem('nickname', nickname.trim())
      setStep(1)
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    setCommentLoading(true)
    const nick = localStorage.getItem('nickname') || ''
    const { error } = await supabase.from('comments').insert({ nickname: nick, comment: newComment })
    if (!error) { setNewComment(''); loadComments() }
    setCommentLoading(false)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const nick = localStorage.getItem('nickname') || ''

    try {
      const { error: profileError } = await supabase.from('user_profiles').insert({
        nickname, location, has_protested: hasProtested, age,
        university_major: universityMajor, education_status: educationStatus,
        planned_major: plannedMajor, current_job: currentJob,
        has_job: hasJob, works_for_government: worksForGovernment,
      })
      if (profileError) throw profileError

      const { error: answerError } = await supabase.from('protest_answers').insert({
        nickname, protest_goals: protestGoals.filter(g => g.trim() !== ''),
      })
      if (answerError) throw answerError

      setShowSuccess(true)
      setStep(5)
    } catch (err: any) {
      setError(err.message || t.error)
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...protestGoals]
    newGoals[index] = value
    setProtestGoals(newGoals)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-red-500 text-2xl">⬆</span>
            Albania Protest Tracker
          </h1>
          <div className="flex items-center gap-3">
            {nickname && <span className="badge badge-blue">@{nickname}</span>}
            <button onClick={() => setLang(l => l === 'sq' ? 'en' : 'sq')} className="badge badge-gray cursor-pointer">{lang === 'sq' ? 'EN' : 'SQ'}</button>
          </div>
        </div>
      </header>

      {/* Step 0: Nickname */}
      {step === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="card max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">{t.welcome}</h2>
            <p className="text-gray-400 mb-6">{t.choose_nickname}</p>
            <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleNicknameSubmit()} placeholder={t.enter_nickname} className="input-field mb-4" />
            <button onClick={handleNicknameSubmit} className="btn-primary w-full">{t.submit_nickname}</button>
          </div>
        </div>
      )}

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">{t.section1_title}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3">{t.section1_location}</label>
                <div className="flex gap-3">
                  <button onClick={() => setLocation('albania')} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${location === 'albania' ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section1_location_albania}</button>
                  <button onClick={() => setLocation('abroad')} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${location === 'abroad' ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section1_location_abroad}</button>
                </div>
              </div>
              <div>
                <label className="block text-lg font-medium mb-3">{t.section1_protested}</label>
                <div className="flex gap-3">
                  <button onClick={() => setHasProtested(true)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${hasProtested ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section1_protested_yes}</button>
                  <button onClick={() => setHasProtested(false)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${!hasProtested ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section1_protested_no}</button>
                </div>
              </div>
              <div>
                <label className="block text-lg font-medium mb-2">{t.section1_age}</label>
                <input type="number" min={16} max={99} value={age} onChange={e => setAge(parseInt(e.target.value) || 18)} className="input-field" />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="btn-primary w-full mt-6">{t.next}</button>
          </div>
        </div>
      )}

      {/* Step 2: Education */}
      {step === 2 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">{t.section2_title}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3">{t.section2_status}</label>
                <div className="flex flex-col gap-2">
                  {[{ value: 'high_school', label: t.section2_status_high_school }, { value: 'in_progress', label: t.section2_status_in_progress }, { value: 'finished', label: t.section2_status_finished }].map(opt => (
                    <button key={opt.value} onClick={() => setEducationStatus(opt.value)} className={`py-3 px-4 rounded-lg border-2 text-left transition-colors ${educationStatus === opt.value ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{opt.label}</button>
                  ))}
                </div>
              </div>
              {educationStatus === 'in_progress' && (
                <div>
                  <label className="block text-lg font-medium mb-2">{t.section2_major}</label>
                  <input type="text" value={universityMajor} onChange={e => setUniversityMajor(e.target.value)} placeholder={t.section2_major_placeholder} className="input-field" />
                </div>
              )}
              {educationStatus === 'high_school' && (
                <div>
                  <label className="block text-lg font-medium mb-2">{t.section2_planned}</label>
                  <input type="text" value={plannedMajor} onChange={e => setPlannedMajor(e.target.value)} placeholder={t.section2_planned_placeholder} className="input-field" />
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">{t.back}</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">{t.next}</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Employment */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">{t.section3_title}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium mb-3">{t.section3_has_job}</label>
                <div className="flex gap-3">
                  <button onClick={() => setHasJob(true)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${hasJob ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section3_has_job_yes}</button>
                  <button onClick={() => setHasJob(false)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${!hasJob ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section3_has_job_no}</button>
                </div>
              </div>
              {hasJob && (
                <>
                  <div>
                    <label className="block text-lg font-medium mb-2">{t.section3_job_sector}</label>
                    <input type="text" value={currentJob} onChange={e => setCurrentJob(e.target.value)} placeholder={t.section3_job_sector_placeholder} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-lg font-medium mb-3">{t.section3_gov}</label>
                    <div className="flex gap-3">
                      <button onClick={() => setWorksForGovernment(true)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${worksForGovernment ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section3_gov_yes}</button>
                      <button onClick={() => setWorksForGovernment(false)} className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${!worksForGovernment ? 'border-red-500 bg-red-900/30 text-red-400' : 'border-gray-700 hover:border-gray-500'}`}>{t.section3_gov_no}</button>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">{t.back}</button>
              <button onClick={() => setStep(4)} className="btn-primary flex-1">{t.next}</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Protest Goals */}
      {step === 4 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-2">{t.section4_title}</h2>
            <p className="text-gray-400 mb-6">{t.section4_goals_desc}</p>
            <div className="space-y-4 mb-6">
              {protestGoals.map((goal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="badge badge-red w-8 h-8 flex items-center justify-center shrink-0">{index + 1}</span>
                  <input type="text" value={goal} onChange={e => updateGoal(index, e.target.value)} placeholder={`${t.section4_goals} #${index + 1}`} className="input-field flex-1" />
                </div>
              ))}
            </div>
            {error && <div className="bg-red-900/50 border border-red-800 text-red-400 rounded-lg p-4 mb-4">{error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">{t.back}</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary flex-1">{loading ? t.submitting : t.section4_submit}</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="card max-w-md w-full text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold mb-2">{t.submitted}</h2>
            <p className="text-gray-400 mb-6">{lang === 'sq' ? 'Faleminderit! Të dhënat tuaja janë anonime.' : 'Thank you! Your data is anonymous.'}</p>
            <div className="bg-gray-800 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">{lang === 'sq' ? 'Përmbledhja juaj:' : 'Your summary:'}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-400">{lang === 'sq' ? 'Vendndodhja:' : 'Location:'}</span>
                <span>{location === 'albania' ? t.section1_location_albania : t.section1_location_abroad}</span>
                <span className="text-gray-400">{lang === 'sq' ? 'Moshë:' : 'Age:'}</span><span>{age}</span>
                <span className="text-gray-400">{lang === 'sq' ? 'Arsimimi:' : 'Education:'}</span><span>{educationStatus}</span>
                <span className="text-gray-400">{lang === 'sq' ? 'Punë:' : 'Employment:'}</span><span>{hasJob ? t.section3_has_job_yes : t.section3_has_job_no}</span>
              </div>
            </div>
            <button onClick={() => { setStep(4); setProtestGoals(['', '', '', '', '']) }} className="btn-secondary">{lang === 'sq' ? 'Ndrysho përgjigjen' : 'Edit answer'}</button>
          </div>
        </div>
      )}

      {/* Comments section */}
      {step > 0 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h3 className="text-xl font-bold mb-4">{t.comments_title}</h3>
          <div className="flex gap-3 mb-6">
            <input type="text" value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()} placeholder={t.comment_placeholder} className="input-field flex-1" />
            <button onClick={handleCommentSubmit} disabled={commentLoading || !newComment.trim()} className="btn-primary whitespace-nowrap">{commentLoading ? '...' : t.submit_comment}</button>
          </div>
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="card text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-blue">@{comment.nickname}</span>
                  <span className="text-gray-500 text-sm">{new Date(comment.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-300">{comment.comment}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-gray-500 text-center py-8">{t.no_comments}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
