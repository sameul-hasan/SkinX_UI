import GlassCard from './GlassCard'

function AdminPanel({ isAdmin, stats, sessions, users, onToggleUserAdmin, onExportData }) {
  const exportOptions = [
    { id: 'all', label: 'All Data' },
    { id: 'users', label: 'Users' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'scans', label: 'Scans' },
    { id: 'messages', label: 'Messages' },
    { id: 'stats', label: 'Stats' },
  ]

  if (!isAdmin) {
    return (
      <GlassCard variant="light" className="text-skx-brand-navy">
        <p className="text-sm font-semibold">Admin Access Required</p>
        <p className="mt-1 text-xs text-skx-brand-navy/75">
          Sign in with admin@skinx.com to view lightweight admin insights.
        </p>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-3">
      <GlassCard variant="light" className="text-skx-brand-navy">
        <p className="text-sm font-semibold">Admin Dashboard Snapshot</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4">
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Users</p>
            <p className="text-base font-bold">{stats.totalUsers}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Sessions</p>
            <p className="text-base font-bold">{stats.totalSessions}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Scans</p>
            <p className="text-base font-bold">{stats.totalScans}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Avg Confidence</p>
            <p className="text-base font-bold">{stats.avgConfidence}%</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">High Risk Scans</p>
            <p className="text-base font-bold">{stats.highRiskScans}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Today Sessions</p>
            <p className="text-base font-bold">{stats.todaySessions}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Messages</p>
            <p className="text-base font-bold">{stats.totalMessages}</p>
          </div>
          <div className="rounded-xl border border-skx-brand-cyan/30 bg-white/75 px-2 py-2">
            <p className="text-skx-brand-navy/75">Top Region</p>
            <p className="text-sm font-bold">{stats.topRegion}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard variant="light" className="text-skx-brand-navy">
        <p className="text-sm font-semibold">Latest User Sessions</p>
        <div className="mt-2 space-y-2">
          {sessions.slice(0, 6).map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 px-3 py-2 text-xs"
            >
              <p className="font-medium">{session.ownerEmail ?? 'unknown@user'}</p>
              <p className="font-medium">{session.intake.region} • {session.intake.skinTone}</p>
              <p className="text-skx-brand-navy/75">
                Scans: {session.scanHistory.length} • Messages: {session.chatHistory.length}
              </p>
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-xs text-skx-brand-navy/75">No session data available yet.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard variant="light" className="text-skx-brand-navy">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">User Roles</p>
        </div>
        <p className="mt-1 text-xs text-skx-brand-navy/75">Choose what to export as JSON.</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onExportData(option.id)}
              className="rounded-lg border border-skx-brand-cyan/35 bg-white/80 px-2 py-1 text-[11px] text-skx-brand-navy"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-2 space-y-2">
          {users.map((user) => (
            <div
              key={user.email}
              className="rounded-xl border border-skx-brand-cyan/25 bg-white/75 px-3 py-2 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{user.email}</p>
                <button
                  onClick={() => onToggleUserAdmin(user.email)}
                  disabled={user.email.toLowerCase() === 'admin@skinx.com'}
                  className="rounded-lg border border-skx-brand-cyan/35 bg-white/80 px-2 py-1 text-[11px] disabled:opacity-60"
                >
                  {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                </button>
              </div>
              <p className="text-skx-brand-navy/75">Role: {user.role}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

export default AdminPanel
