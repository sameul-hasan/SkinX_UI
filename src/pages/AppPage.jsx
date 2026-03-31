import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, PlusCircle, SendHorizontal, X } from 'lucide-react'
import TopBar from '../components/TopBar'
import GlassCard from '../components/GlassCard'
import ChatMessage from '../components/ChatMessage'
import QuickActions from '../components/QuickActions'
import AwarenessPanel from '../components/AwarenessPanel'
import BoSkinChatbot from '../components/BoSkinChatbot'
import AdminPanel from '../components/AdminPanel'
import FooterBar from '../components/FooterBar'
import {
  awarenessCards,
  conditionInsights,
  quickActions,
  riskLevels,
  safetyDisclaimer,
  scanNotes,
} from '../data/mockData'
import { loadState, saveState, STORAGE_KEYS } from '../utils/storage'

const riskOrder = {
  Low: 0,
  Moderate: 1,
  High: 2,
}

const intakeTemplate = {
  age: '',
  skinTone: '',
  region: '',
  previousCondition: '',
}

const scanQuestionTemplate = {
  spotArea: '',
  duration: '',
  observedChange: '',
}

const scanAdjustmentTemplate = {
  zoom: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
}

const skinToneOptions = [
  { id: 'fitz-1', value: 'Type 1 (Very Fair)', color: '#f6e2d3' },
  { id: 'fitz-2', value: 'Type 2 (Fair)', color: '#e8c9ac' },
  { id: 'fitz-3', value: 'Type 3 (Light Brown)', color: '#d2a47b' },
  { id: 'fitz-4', value: 'Type 4 (Moderate Brown)', color: '#b97d4f' },
  { id: 'fitz-5', value: 'Type 5 (Dark Brown)', color: '#8b5a36' },
  { id: 'fitz-6', value: 'Type 6 (Deeply Pigmented)', color: '#5a3826' },
]

function buildSkinToneSwatch(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect x="6" y="6" width="68" height="68" rx="16" fill="${color}"/><rect x="6" y="6" width="68" height="68" rx="16" fill="none" stroke="rgba(15,42,68,0.2)" stroke-width="2"/></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`
}

function formatScanLabel(scan, index) {
  const date = new Date(scan.createdAt).toLocaleDateString()
  return `Scan ${index + 1} • ${date} • ${scan.risk}`
}

function createMockScan(previousScan, details) {
  const riskIndex = previousScan
    ? Math.max(
        0,
        Math.min(2, riskOrder[previousScan.risk] + [-1, 0, 1][Math.floor(Math.random() * 3)]),
      )
    : Math.floor(Math.random() * riskLevels.length)

  return {
    id: uid('scan'),
    createdAt: new Date().toISOString(),
    risk: riskLevels[riskIndex],
    confidence: Math.floor(73 + Math.random() * 25),
    notes: `${pickRandom(scanNotes)} (${details.spotArea}, ${details.duration})`,
    details,
  }
}

function buildComparison(previousScan, currentScan) {
  const previousRisk = riskOrder[previousScan.risk]
  const currentRisk = riskOrder[currentScan.risk]
  const diff = currentRisk - previousRisk

  return {
    riskChange:
      diff > 0
        ? `Risk moved from ${previousScan.risk} to ${currentScan.risk}.`
        : diff < 0
          ? `Risk improved from ${previousScan.risk} to ${currentScan.risk}.`
          : `Risk remains ${currentScan.risk}.`,
    riskDirection: diff > 0 ? 'up' : diff < 0 ? 'down' : 'same',
    confidenceShift: `${currentScan.confidence - previousScan.confidence > 0 ? '+' : ''}${currentScan.confidence - previousScan.confidence}% vs previous`,
    conditionInsight: pickRandom(conditionInsights),
  }
}

function buildSummary(scanHistory) {
  const first = scanHistory[0]
  const last = scanHistory[scanHistory.length - 1]
  const trendDelta = riskOrder[last.risk] - riskOrder[first.risk]

  let trend = 'Stable trend over time'
  if (trendDelta > 0) trend = 'Elevating trend, monitor closely'
  if (trendDelta < 0) trend = 'Improving trend with lower risk'

  const avgConfidence = Math.round(
    scanHistory.reduce((sum, scan) => sum + scan.confidence, 0) / scanHistory.length,
  )

  return {
    trend,
    keyObservations: [
      `${scanHistory.length} total scans tracked`,
      `Latest risk: ${last.risk}`,
      `Average confidence: ${avgConfidence}%`,
    ],
    nextSteps: [
      'Continue consistent weekly scans',
      'Use similar light and angle each capture',
      'Consult a dermatologist for persistent concern',
    ],
  }
}

function AppPage({ currentUser, users, isAdmin, onLogout, onToggleUserAdmin }) {
  const [activeView, setActiveView] = useState('home')
  const [sessions, setSessions] = useState(() => loadState(STORAGE_KEYS.sessions, []))
  const [activeSessionId, setActiveSessionId] = useState(() =>
    loadState(STORAGE_KEYS.activeSessionId, null),
  )
  const [intakeForm, setIntakeForm] = useState(intakeTemplate)
  const [chatDraft, setChatDraft] = useState('')

  const [showScanInstructionModal, setShowScanInstructionModal] = useState(false)
  const [showScanModal, setShowScanModal] = useState(false)
  const [scanQuestions, setScanQuestions] = useState(scanQuestionTemplate)
  const [scanPhotos, setScanPhotos] = useState({
    closeUp: null,
    midRange: null,
    bodyContext: null,
  })
  const [scanPhotoPreviews, setScanPhotoPreviews] = useState({
    closeUp: null,
    midRange: null,
    bodyContext: null,
  })
  const [scanPhotoAdjustments, setScanPhotoAdjustments] = useState({
    closeUp: { ...scanAdjustmentTemplate },
    midRange: { ...scanAdjustmentTemplate },
    bodyContext: { ...scanAdjustmentTemplate },
  })
  const [cameraTargetPhotoType, setCameraTargetPhotoType] = useState('closeUp')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [showCompareModal, setShowCompareModal] = useState(false)
  const [selectedPreviousScanId, setSelectedPreviousScanId] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const holdMoveIntervalRef = useRef(null)
  const previewContainerRefs = useRef({
    closeUp: null,
    midRange: null,
    bodyContext: null,
  })

  const visibleSessions = useMemo(() => {
    if (isAdmin) {
      return sessions
    }

    return sessions.filter(
      (session) => (session.ownerEmail ?? '').toLowerCase() === currentUser.email.toLowerCase(),
    )
  }, [sessions, isAdmin, currentUser.email])

  const activeSession = useMemo(
    () => visibleSessions.find((session) => session.id === activeSessionId) ?? null,
    [visibleSessions, activeSessionId],
  )

  const adminStats = useMemo(() => {
    const allScans = sessions.flatMap((session) => session.scanHistory)
    const totalMessages = sessions.reduce((sum, session) => sum + session.chatHistory.length, 0)
    const highRiskScans = allScans.filter((scan) => scan.risk === 'High').length
    const totalUsers = new Set(
      sessions.map((session) => (session.ownerEmail ?? 'unknown@legacy').toLowerCase()),
    ).size
    const today = new Date().toDateString()
    const todaySessions = sessions.filter(
      (session) => new Date(session.createdAt).toDateString() === today,
    ).length
    const regionMap = sessions.reduce((acc, session) => {
      const region = session.intake.region?.trim() || 'Unknown'
      acc[region] = (acc[region] ?? 0) + 1
      return acc
    }, {})
    const topRegion = Object.entries(regionMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A'

    const avgConfidence = allScans.length
      ? Math.round(allScans.reduce((sum, scan) => sum + scan.confidence, 0) / allScans.length)
      : 0

    return {
      totalUsers,
      totalSessions: sessions.length,
      totalScans: allScans.length,
      avgConfidence,
      highRiskScans,
      todaySessions,
      totalMessages,
      topRegion,
    }
  }, [sessions])

  useEffect(() => {
    saveState(STORAGE_KEYS.sessions, sessions)
  }, [sessions])

  useEffect(() => {
    saveState(STORAGE_KEYS.activeSessionId, activeSessionId)
  }, [activeSessionId])

  useEffect(
    () => () => {
      Object.values(scanPhotoPreviews).forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url)
        }
      })

      if (holdMoveIntervalRef.current) {
        clearInterval(holdMoveIntervalRef.current)
      }
    },
    [scanPhotoPreviews],
  )

  function updateSession(sessionId, updater) {
    setSessions((prev) =>
      prev.map((session) => (session.id === sessionId ? updater(session) : session)),
    )
  }

  function addMessage(sessionId, payload) {
    updateSession(sessionId, (session) => ({
      ...session,
      chatHistory: [...session.chatHistory, payload],
    }))
  }

  function startSession(event) {
    event.preventDefault()

    const validIntake =
      intakeForm.age &&
      intakeForm.skinTone.trim() &&
      intakeForm.region.trim() &&
      intakeForm.previousCondition.trim()

    if (!validIntake) {
      return
    }

    const sessionId = uid('session')
    const created = {
      id: sessionId,
      ownerEmail: currentUser.email.toLowerCase(),
      createdAt: new Date().toISOString(),
      intake: intakeForm,
      scanHistory: [],
      chatHistory: [
        {
          id: uid('msg'),
          sender: 'assistant',
          text: 'Session created. Start with Scan New Spot to generate your first assessment.',
          kind: 'text',
          createdAt: new Date().toISOString(),
        },
      ],
    }

    setSessions((prev) => [created, ...prev])
    setActiveSessionId(sessionId)
    setActiveView('session')
    setIntakeForm(intakeTemplate)
  }

  function handleSendChat() {
    if (!activeSession || !chatDraft.trim()) {
      return
    }

    const text = chatDraft.trim()
    setChatDraft('')

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'user',
      text,
      kind: 'text',
      createdAt: new Date().toISOString(),
    })

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'assistant',
      text: 'Use quick actions below for structured scan, selective comparison, or summary.',
      kind: 'text',
      createdAt: new Date().toISOString(),
    })
  }

  function openScanPopup() {
    if (!activeSession) {
      return
    }

    Object.values(scanPhotoPreviews).forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    })

    setScanQuestions(scanQuestionTemplate)
    setScanPhotos({ closeUp: null, midRange: null, bodyContext: null })
    setScanPhotoPreviews({ closeUp: null, midRange: null, bodyContext: null })
    setScanPhotoAdjustments({
      closeUp: { ...scanAdjustmentTemplate },
      midRange: { ...scanAdjustmentTemplate },
      bodyContext: { ...scanAdjustmentTemplate },
    })
    setShowScanInstructionModal(true)
  }

  async function openCamera(photoType) {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      })
      streamRef.current = stream
      setCameraTargetPhotoType(photoType)
      setCameraOpen(true)

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
    } catch {
      setCameraOpen(false)
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraOpen(false)
  }

  function captureFromCamera() {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) {
        return
      }

      const capturedFile = new File([blob], `${cameraTargetPhotoType}-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      })
      handleScanPhotoUpload(cameraTargetPhotoType, capturedFile)
      stopCamera()
    }, 'image/jpeg')
  }

  function handleScanPhotoUpload(photoType, file) {
    setScanPhotoPreviews((prev) => {
      if (prev[photoType]) {
        URL.revokeObjectURL(prev[photoType])
      }

      return {
        ...prev,
        [photoType]: file ? URL.createObjectURL(file) : null,
      }
    })

    setScanPhotos((prev) => ({ ...prev, [photoType]: file ?? null }))
  }

  function updatePhotoAdjustment(photoType, key, value) {
    setScanPhotoAdjustments((prev) => ({
      ...prev,
      [photoType]: {
        ...prev[photoType],
        [key]: value,
      },
    }))
  }

  function movePreview(photoType, key, delta) {
    setScanPhotoAdjustments((prev) => ({
      ...prev,
      [photoType]: {
        ...prev[photoType],
        [key]: Math.max(-24, Math.min(24, prev[photoType][key] + delta)),
      },
    }))
  }

  function startHoldMove(photoType, key, delta) {
    movePreview(photoType, key, delta)

    if (holdMoveIntervalRef.current) {
      clearInterval(holdMoveIntervalRef.current)
    }

    holdMoveIntervalRef.current = setInterval(() => {
      movePreview(photoType, key, delta)
    }, 90)
  }

  function stopHoldMove() {
    if (holdMoveIntervalRef.current) {
      clearInterval(holdMoveIntervalRef.current)
      holdMoveIntervalRef.current = null
    }
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file)
      const image = new Image()
      image.onload = () => {
        URL.revokeObjectURL(url)
        resolve(image)
      }
      image.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Could not load image file'))
      }
      image.src = url
    })
  }

  function canvasToBlob(canvas, type = 'image/jpeg', quality = 0.95) {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality)
    })
  }

  async function createMarkedPhoto(photoType) {
    const file = scanPhotos[photoType]
    if (!file) {
      return null
    }

    const image = await loadImageFromFile(file)
    const adjustment = scanPhotoAdjustments[photoType]
    const previewContainer = previewContainerRefs.current[photoType]

    const previewWidth = Math.max(120, (previewContainer?.clientWidth ?? 180) - 8)
    const previewHeight = Math.max(80, (previewContainer?.clientHeight ?? 96) - 8)
    const markerSize = 56

    const renderCanvas = document.createElement('canvas')
    renderCanvas.width = previewWidth
    renderCanvas.height = previewHeight
    const renderContext = renderCanvas.getContext('2d')

    if (!renderContext) {
      return {
        file,
        previewDataUrl: null,
      }
    }

    const baseScale = Math.max(previewWidth / image.width, previewHeight / image.height)
    const drawWidth = image.width * baseScale
    const drawHeight = image.height * baseScale

    renderContext.save()
    renderContext.translate(previewWidth / 2 + adjustment.offsetX, previewHeight / 2 + adjustment.offsetY)
    renderContext.rotate((adjustment.rotation * Math.PI) / 180)
    renderContext.scale(adjustment.zoom, adjustment.zoom)
    renderContext.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
    renderContext.restore()

    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = markerSize
    cropCanvas.height = markerSize
    const cropContext = cropCanvas.getContext('2d')

    if (!cropContext) {
      return {
        file,
        previewDataUrl: null,
      }
    }

    cropContext.drawImage(
      renderCanvas,
      (previewWidth - markerSize) / 2,
      (previewHeight - markerSize) / 2,
      markerSize,
      markerSize,
      0,
      0,
      markerSize,
      markerSize,
    )

    const croppedBlob = await canvasToBlob(cropCanvas)
    if (!croppedBlob) {
      return {
        file,
        previewDataUrl: null,
      }
    }

    return {
      file: new File([croppedBlob], `${photoType}-marked-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      }),
      previewDataUrl: cropCanvas.toDataURL('image/jpeg', 0.9),
    }
  }

  async function submitScanPopup(event) {
    event.preventDefault()
    if (!activeSession) {
      return
    }

    const valid =
      scanQuestions.spotArea.trim() &&
      scanQuestions.duration.trim() &&
      scanQuestions.observedChange.trim() &&
      scanPhotos.closeUp &&
      scanPhotos.midRange &&
      scanPhotos.bodyContext

    if (!valid) {
      return
    }

    const [closeUpMarked, midRangeMarked, bodyContextMarked] = await Promise.all([
      createMarkedPhoto('closeUp'),
      createMarkedPhoto('midRange'),
      createMarkedPhoto('bodyContext'),
    ])

    const markedPhotos = {
      closeUp: closeUpMarked?.file ?? scanPhotos.closeUp,
      midRange: midRangeMarked?.file ?? scanPhotos.midRange,
      bodyContext: bodyContextMarked?.file ?? scanPhotos.bodyContext,
    }

    const markedPreviewImages = {
      closeUp: closeUpMarked?.previewDataUrl ?? null,
      midRange: midRangeMarked?.previewDataUrl ?? null,
      bodyContext: bodyContextMarked?.previewDataUrl ?? null,
    }

    const previous = activeSession.scanHistory[activeSession.scanHistory.length - 1]
    const scan = createMockScan(previous, {
      ...scanQuestions,
      photos: {
        closeUp: markedPhotos.closeUp?.name,
        midRange: markedPhotos.midRange?.name,
        bodyContext: markedPhotos.bodyContext?.name,
      },
      markedPreviewImages,
    })

    updateSession(activeSession.id, (session) => ({
      ...session,
      scanHistory: [...session.scanHistory, scan],
    }))

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'user',
      text: `Scan requested for ${scanQuestions.spotArea} (${scanQuestions.duration})`,
      kind: 'text',
      createdAt: new Date().toISOString(),
    })

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'assistant',
      text: 'New scan generated from the provided spot details.',
      kind: 'scan',
      payload: scan,
      createdAt: new Date().toISOString(),
    })

    Object.values(scanPhotoPreviews).forEach((url) => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    })

    setScanPhotoPreviews({ closeUp: null, midRange: null, bodyContext: null })

    setShowScanModal(false)
  }

  function exportAdminData(exportType = 'all') {
    const scans = sessions.flatMap((session) =>
      session.scanHistory.map((scan) => ({
        ...scan,
        sessionId: session.id,
        ownerEmail: session.ownerEmail,
      })),
    )

    const messages = sessions.flatMap((session) =>
      session.chatHistory.map((message) => ({
        ...message,
        sessionId: session.id,
        ownerEmail: session.ownerEmail,
      })),
    )

    const exportMap = {
      users,
      sessions,
      scans,
      messages,
      stats: adminStats,
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      exportType,
      ...(exportType === 'all' ? exportMap : { [exportType]: exportMap[exportType] ?? [] }),
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `skinx-${exportType}-export-${Date.now()}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  function openComparePopup() {
    if (!activeSession || activeSession.scanHistory.length < 2) {
      if (activeSession) {
        addMessage(activeSession.id, {
          id: uid('msg'),
          sender: 'assistant',
          text: 'At least two scans are required before comparison.',
          kind: 'text',
          createdAt: new Date().toISOString(),
        })
      }
      return
    }

    const scans = activeSession.scanHistory
    const defaultPrevious = scans[scans.length - 2]
    setSelectedPreviousScanId(defaultPrevious.id)
    setShowCompareModal(true)
  }

  function submitComparePopup(event) {
    event.preventDefault()
    if (!activeSession) {
      return
    }

    const scans = activeSession.scanHistory
    const current = scans[scans.length - 1]
    const previous = scans.find((scan) => scan.id === selectedPreviousScanId)

    if (!previous || previous.id === current.id) {
      return
    }

    const comparison = buildComparison(previous, current)

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'user',
      text: `Compare latest scan with ${new Date(previous.createdAt).toLocaleDateString()}`,
      kind: 'text',
      createdAt: new Date().toISOString(),
    })

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'assistant',
      text: 'Comparison completed for the selected previous scan.',
      kind: 'compare',
      payload: comparison,
      createdAt: new Date().toISOString(),
    })

    setShowCompareModal(false)
  }

  function runQuickAction(actionId) {
    if (!activeSession) {
      return
    }

    if (actionId === 'scan') {
      openScanPopup()
      return
    }

    if (actionId === 'compare') {
      openComparePopup()
      return
    }

    if (activeSession.scanHistory.length === 0) {
      addMessage(activeSession.id, {
        id: uid('msg'),
        sender: 'assistant',
        text: 'No scans available yet. Run Scan New Spot first.',
        kind: 'text',
        createdAt: new Date().toISOString(),
      })
      return
    }

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'user',
      text: 'Get Summary',
      kind: 'text',
      createdAt: new Date().toISOString(),
    })

    addMessage(activeSession.id, {
      id: uid('msg'),
      sender: 'assistant',
      text: 'Summary generated from your current session history.',
      kind: 'summary',
      payload: buildSummary(activeSession.scanHistory),
      createdAt: new Date().toISOString(),
    })
  }

  const compareOptions = activeSession
    ? activeSession.scanHistory
        .slice(0, -1)
        .map((scan, index) => ({ id: scan.id, label: formatScanLabel(scan, index) }))
    : []

  return (
    <div className="min-h-screen pb-24 text-skx-soft">
      <TopBar email={currentUser.email} onLogout={onLogout} />

      <main className="mx-auto w-full max-w-6xl p-3 sm:p-5">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <Motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3"
            >
              <GlassCard className="text-skx-soft">
                <p className="text-sm font-semibold">Start New Skin Session</p>
                <p className="mt-1 text-xs text-skx-soft/90">
                  Intake, scan history, and chat history are saved per session in local storage.
                </p>

                <form className="mt-3 grid gap-2" onSubmit={startSession}>
                  <label className="text-xs font-semibold text-skx-soft">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className="glow-cyan rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                    type="number"
                    min="1"
                    required
                    placeholder="Age"
                    value={intakeForm.age}
                    onChange={(event) =>
                      setIntakeForm((prev) => ({ ...prev, age: event.target.value }))
                    }
                  />
                  <label className="text-xs font-semibold text-skx-soft">
                    Skin tone <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/30 p-2 sm:grid-cols-3">
                    {skinToneOptions.map((option, index) => (
                      <label
                        key={option.id}
                        className="glow-cyan cursor-pointer rounded-xl border border-skx-brand-cyan/25 bg-white/70 p-2 text-center text-[11px] text-skx-brand-navy"
                      >
                        <input
                          type="radio"
                          name="skinTone"
                          value={option.value}
                          required={index === 0}
                          checked={intakeForm.skinTone === option.value}
                          onChange={(event) =>
                            setIntakeForm((prev) => ({ ...prev, skinTone: event.target.value }))
                          }
                        />
                        <img
                          src={buildSkinToneSwatch(option.color)}
                          alt={option.value}
                          className="mx-auto mt-1 h-12 w-12 rounded-lg object-cover"
                        />
                        <p className="mt-1">{option.value}</p>
                      </label>
                    ))}
                  </div>
                  <label className="text-xs font-semibold text-skx-soft">
                    Body region <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className="glow-cyan rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                    required
                    placeholder="Body region"
                    value={intakeForm.region}
                    onChange={(event) =>
                      setIntakeForm((prev) => ({ ...prev, region: event.target.value }))
                    }
                  />
                  <label className="text-xs font-semibold text-skx-soft">
                    Previous condition <span className="text-rose-500">*</span>
                  </label>
                  <input
                    className="glow-cyan rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                    required
                    placeholder="Previous condition"
                    value={intakeForm.previousCondition}
                    onChange={(event) =>
                      setIntakeForm((prev) => ({ ...prev, previousCondition: event.target.value }))
                    }
                  />

                  <button
                    type="submit"
                    className="btn-primary mt-1 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
                  >
                    <PlusCircle size={16} />
                    Create Session
                  </button>
                </form>
              </GlassCard>

              <GlassCard className="text-skx-soft">
                <p className="text-sm font-semibold">Recent Sessions</p>
                <div className="mt-2 space-y-2">
                  {visibleSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        setActiveSessionId(session.id)
                        setActiveView('session')
                      }}
                      className="glow-cyan w-full rounded-xl border border-skx-brand-cyan/25 bg-skx-bg-strong/45 px-3 py-2 text-left text-xs text-skx-soft transition"
                    >
                      <p className="font-semibold">
                        {session.intake.region} • {session.intake.skinTone}
                      </p>
                      <p className="text-skx-soft/85">
                        {new Date(session.createdAt).toLocaleString()} • {session.scanHistory.length} scans
                      </p>
                    </button>
                  ))}
                  {visibleSessions.length === 0 && (
                    <p className="text-xs text-skx-soft/85">No sessions yet. Create your first one above.</p>
                  )}
                </div>
              </GlassCard>

              {isAdmin && (
                <AdminPanel
                  isAdmin={isAdmin}
                  stats={adminStats}
                  sessions={sessions}
                  users={users}
                  onToggleUserAdmin={onToggleUserAdmin}
                  onExportData={exportAdminData}
                />
              )}
            </Motion.div>
          )}

          {activeView === 'session' && (
            <Motion.div
              key="session"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <GlassCard variant="light" className="h-[calc(100vh-10.75rem)] p-0 text-skx-brand-navy">
                {!activeSession ? (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-skx-soft/90">
                    No active session selected. Go to Home and create a new session.
                  </div>
                ) : (
                  <div className="flex h-full flex-col">
                    <div className="border-b border-skx-brand-navy/15 px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-skx-brand-navy">
                            {activeSession.intake.region} • {activeSession.intake.skinTone}
                          </p>
                          <p className="text-xs text-skx-brand-navy/75">Chat-first monitoring workspace</p>
                        </div>
                        <button
                          onClick={() => setActiveView('home')}
                          className="btn-primary rounded-lg px-3 py-1.5 text-xs font-semibold"
                        >
                          Create New Session
                        </button>
                      </div>
                    </div>

                    <div className="chat-scroll flex-1 space-y-2 overflow-y-auto px-3 py-3">
                      {activeSession.chatHistory.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))}
                    </div>

                    <div className="space-y-2 border-t border-skx-brand-navy/15 p-3">
                      <QuickActions actions={quickActions} onRun={runQuickAction} />

                      <div className="flex items-center gap-2">
                        <input
                          className="glow-cyan flex-1 rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                          placeholder="Type your message..."
                          value={chatDraft}
                          onChange={(event) => setChatDraft(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleSendChat()
                            }
                          }}
                        />
                        <button className="btn-primary rounded-xl px-3 py-2" onClick={handleSendChat}>
                          <SendHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            </Motion.div>
          )}

          {activeView === 'awareness' && (
            <Motion.div
              key="awareness"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <div className="grid gap-3 sm:grid-cols-[1.35fr_1fr]">
                <BoSkinChatbot subtitle="Awareness support inside your dashboard" />
                <AwarenessPanel cards={awarenessCards} disclaimer={safetyDisclaimer} />
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </main>

      <FooterBar activeView={activeView} setActiveView={setActiveView} />

      <AnimatePresence>
        {showScanInstructionModal && (
          <Motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#0f2a44]/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="glass max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-skx-brand-cyan/35 p-4"
            >
              <p className="text-sm font-semibold text-skx-brand-navy">Scan Instructions</p>
              <ul className="mt-2 space-y-1 text-xs text-skx-brand-navy/80">
                <li>• Keep camera steady and use good lighting.</li>
                <li>• Capture 3 photos: close shot, 45 degree angle, wide angle.</li>
                <li>• Center the mole inside the transparent guide area.</li>
              </ul>
              <button
                onClick={() => {
                  setShowScanInstructionModal(false)
                  setShowScanModal(true)
                }}
                className="btn-primary mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold"
              >
                Start Scan
              </button>
            </Motion.div>
          </Motion.div>
        )}

        {showScanModal && (
          <Motion.div
            className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#0f2a44]/45 px-4 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.form
              onSubmit={submitScanPopup}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="glass max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-skx-brand-cyan/35 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-skx-soft">Scan Questions</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowScanModal(false)
                    stopCamera()
                  }}
                  className="rounded-full p-1 text-skx-soft/80"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/70 p-2 text-xs text-skx-brand-navy">
                  <p className="font-semibold">Photo Instructions (3 Required)</p>
                  <ul className="mt-1 space-y-0.5">
                    <li>1. Close shot of the mole/spot (sharp and centered).</li>
                    <li>2. 45 degree angle shot with nearby texture visible.</li>
                    <li>3. Wide angle shot showing body area context.</li>
                  </ul>
                </div>

                <label className="text-xs font-semibold text-skx-soft">
                  Spot or area <span className="text-rose-400">*</span>
                </label>
                <input
                  className="glow-cyan w-full rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                  placeholder="Which spot/area are you scanning?"
                  required
                  value={scanQuestions.spotArea}
                  onChange={(event) =>
                    setScanQuestions((prev) => ({ ...prev, spotArea: event.target.value }))
                  }
                />
                <label className="text-xs font-semibold text-skx-soft">
                  Visible since when <span className="text-rose-400">*</span>
                </label>
                <input
                  className="glow-cyan w-full rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                  placeholder="Since when is it visible?"
                  required
                  value={scanQuestions.duration}
                  onChange={(event) =>
                    setScanQuestions((prev) => ({ ...prev, duration: event.target.value }))
                  }
                />
                <label className="text-xs font-semibold text-skx-soft">
                  Observed change <span className="text-rose-400">*</span>
                </label>
                <input
                  className="glow-cyan w-full rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none placeholder:text-skx-soft/70"
                  placeholder="Observed change (size/color/texture)"
                  required
                  value={scanQuestions.observedChange}
                  onChange={(event) =>
                    setScanQuestions((prev) => ({ ...prev, observedChange: event.target.value }))
                  }
                />

                <div className="grid gap-2 rounded-xl border border-skx-brand-cyan/30 bg-white/70 p-2">
                  <p className="text-xs font-semibold text-skx-brand-navy">Capture / Upload Photos</p>
                  <label className="text-xs text-skx-brand-navy">
                    Close shot photo <span className="text-rose-500">*</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="mt-1 block w-full text-xs text-skx-brand-navy"
                      onChange={(event) => handleScanPhotoUpload('closeUp', event.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => openCamera('closeUp')}
                      className="mt-1 rounded-lg border border-skx-brand-cyan/35 bg-white px-2 py-1 text-[11px]"
                    >
                      Open Camera
                    </button>
                    {scanPhotoPreviews.closeUp && (
                      <div
                        ref={(element) => {
                          previewContainerRefs.current.closeUp = element
                        }}
                        className="relative mt-1 h-24 overflow-hidden rounded-lg border border-skx-brand-cyan/25 bg-white p-1"
                      >
                        <img
                          src={scanPhotoPreviews.closeUp}
                          alt="Close-up preview"
                          className="h-full w-full rounded object-cover"
                          style={{
                            transform: `translate(${scanPhotoAdjustments.closeUp.offsetX}px, ${scanPhotoAdjustments.closeUp.offsetY}px) scale(${scanPhotoAdjustments.closeUp.zoom}) rotate(${scanPhotoAdjustments.closeUp.rotation}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-skx-brand-cyan/90" />
                      </div>
                    )}
                    <div className="mt-1 grid grid-cols-3 gap-1 text-[10px]">
                      <label>
                        Zoom
                        <input
                          type="range"
                          min="0.8"
                          max="2"
                          step="0.1"
                          value={scanPhotoAdjustments.closeUp.zoom}
                          onChange={(event) =>
                            updatePhotoAdjustment('closeUp', 'zoom', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Angle
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={scanPhotoAdjustments.closeUp.rotation}
                          onChange={(event) =>
                            updatePhotoAdjustment('closeUp', 'rotation', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Move
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('closeUp', 'offsetX', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('closeUp', 'offsetX', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('closeUp', 'offsetX', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('closeUp', 'offsetX', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowRight size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('closeUp', 'offsetY', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('closeUp', 'offsetY', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowUp size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('closeUp', 'offsetY', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('closeUp', 'offsetY', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowDown size={10} />
                          </button>
                        </div>
                      </label>
                    </div>
                  </label>
                  <label className="text-xs text-skx-brand-navy">
                    45 degree angle photo <span className="text-rose-500">*</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="mt-1 block w-full text-xs text-skx-brand-navy"
                      onChange={(event) => handleScanPhotoUpload('midRange', event.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => openCamera('midRange')}
                      className="mt-1 rounded-lg border border-skx-brand-cyan/35 bg-white px-2 py-1 text-[11px]"
                    >
                      Open Camera
                    </button>
                    {scanPhotoPreviews.midRange && (
                      <div
                        ref={(element) => {
                          previewContainerRefs.current.midRange = element
                        }}
                        className="relative mt-1 h-24 overflow-hidden rounded-lg border border-skx-brand-cyan/25 bg-white p-1"
                      >
                        <img
                          src={scanPhotoPreviews.midRange}
                          alt="Mid-range preview"
                          className="h-full w-full rounded object-cover"
                          style={{
                            transform: `translate(${scanPhotoAdjustments.midRange.offsetX}px, ${scanPhotoAdjustments.midRange.offsetY}px) scale(${scanPhotoAdjustments.midRange.zoom}) rotate(${scanPhotoAdjustments.midRange.rotation}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-skx-brand-cyan/90" />
                      </div>
                    )}
                    <div className="mt-1 grid grid-cols-3 gap-1 text-[10px]">
                      <label>
                        Zoom
                        <input
                          type="range"
                          min="0.8"
                          max="2"
                          step="0.1"
                          value={scanPhotoAdjustments.midRange.zoom}
                          onChange={(event) =>
                            updatePhotoAdjustment('midRange', 'zoom', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Angle
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={scanPhotoAdjustments.midRange.rotation}
                          onChange={(event) =>
                            updatePhotoAdjustment('midRange', 'rotation', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Move
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('midRange', 'offsetX', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('midRange', 'offsetX', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('midRange', 'offsetX', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('midRange', 'offsetX', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowRight size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('midRange', 'offsetY', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('midRange', 'offsetY', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowUp size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('midRange', 'offsetY', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('midRange', 'offsetY', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowDown size={10} />
                          </button>
                        </div>
                      </label>
                    </div>
                  </label>
                  <label className="text-xs text-skx-brand-navy">
                    Wide angle photo <span className="text-rose-500">*</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="mt-1 block w-full text-xs text-skx-brand-navy"
                      onChange={(event) => handleScanPhotoUpload('bodyContext', event.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => openCamera('bodyContext')}
                      className="mt-1 rounded-lg border border-skx-brand-cyan/35 bg-white px-2 py-1 text-[11px]"
                    >
                      Open Camera
                    </button>
                    {scanPhotoPreviews.bodyContext && (
                      <div
                        ref={(element) => {
                          previewContainerRefs.current.bodyContext = element
                        }}
                        className="relative mt-1 h-24 overflow-hidden rounded-lg border border-skx-brand-cyan/25 bg-white p-1"
                      >
                        <img
                          src={scanPhotoPreviews.bodyContext}
                          alt="Body-context preview"
                          className="h-full w-full rounded object-cover"
                          style={{
                            transform: `translate(${scanPhotoAdjustments.bodyContext.offsetX}px, ${scanPhotoAdjustments.bodyContext.offsetY}px) scale(${scanPhotoAdjustments.bodyContext.zoom}) rotate(${scanPhotoAdjustments.bodyContext.rotation}deg)`,
                            transformOrigin: 'center',
                          }}
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded border-2 border-skx-brand-cyan/90" />
                      </div>
                    )}
                    <div className="mt-1 grid grid-cols-3 gap-1 text-[10px]">
                      <label>
                        Zoom
                        <input
                          type="range"
                          min="0.8"
                          max="2"
                          step="0.1"
                          value={scanPhotoAdjustments.bodyContext.zoom}
                          onChange={(event) =>
                            updatePhotoAdjustment('bodyContext', 'zoom', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Angle
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="1"
                          value={scanPhotoAdjustments.bodyContext.rotation}
                          onChange={(event) =>
                            updatePhotoAdjustment('bodyContext', 'rotation', Number(event.target.value))
                          }
                        />
                      </label>
                      <label>
                        Move
                        <div className="mt-1 grid grid-cols-2 gap-1">
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('bodyContext', 'offsetX', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('bodyContext', 'offsetX', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowLeft size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('bodyContext', 'offsetX', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('bodyContext', 'offsetX', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowRight size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('bodyContext', 'offsetY', -4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('bodyContext', 'offsetY', -4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowUp size={10} />
                          </button>
                          <button
                            type="button"
                            className="rounded border border-skx-brand-cyan/35 bg-white px-1 py-0.5"
                            onMouseDown={() => startHoldMove('bodyContext', 'offsetY', 4)}
                            onMouseUp={stopHoldMove}
                            onMouseLeave={stopHoldMove}
                            onTouchStart={() => startHoldMove('bodyContext', 'offsetY', 4)}
                            onTouchEnd={stopHoldMove}
                            onTouchCancel={stopHoldMove}
                          >
                            <ArrowDown size={10} />
                          </button>
                        </div>
                      </label>
                    </div>
                  </label>
                </div>

                <p className="rounded-xl border border-skx-brand-cyan/30 bg-white/70 px-2 py-1.5 text-[11px] text-skx-brand-navy/80">
                  Only the marked square area is saved for each scan photo.
                </p>
              </div>

              <button type="submit" className="btn-primary mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold">
                Generate Scan
              </button>
            </Motion.form>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cameraOpen && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-skx-brand-cyan/40 bg-black">
              <video ref={videoRef} autoPlay playsInline className="h-105 w-full object-cover" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-40 w-40 rounded-full border-2 border-skx-brand-cyan shadow-[0_0_40px_rgba(0,194,214,0.9)]" />
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                <button
                  onClick={captureFromCamera}
                  className="btn-primary rounded-xl px-3 py-2 text-sm font-semibold"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="rounded-xl border border-white/50 bg-white/10 px-3 py-2 text-sm text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Motion.div>
        )}

        {showCompareModal && activeSession && (
          <Motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-[#08192a]/70 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.form
              onSubmit={submitComparePopup}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="glass w-full max-w-md rounded-2xl border border-skx-brand-cyan/35 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-skx-soft">Compare with Previous</p>
                <button
                  type="button"
                  onClick={() => setShowCompareModal(false)}
                  className="rounded-full p-1 text-skx-soft/80"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="mb-2 text-xs text-skx-soft/85">
                Current scan: {formatScanLabel(activeSession.scanHistory[activeSession.scanHistory.length - 1], activeSession.scanHistory.length - 1)}
              </p>

              <select
                className="glow-cyan w-full rounded-xl border border-skx-brand-cyan/35 bg-skx-bg-strong/45 px-3 py-2 text-sm text-skx-soft outline-none"
                value={selectedPreviousScanId}
                onChange={(event) => setSelectedPreviousScanId(event.target.value)}
              >
                {compareOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn-primary mt-3 w-full rounded-xl px-3 py-2 text-sm font-semibold">
                Run Comparison
              </button>
            </Motion.form>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AppPage
