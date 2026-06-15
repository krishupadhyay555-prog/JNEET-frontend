// ============================================================
//  JNEET+ AI — components/ui/SkeletonLoader.jsx
// ============================================================

export function MessageSkeleton({ isUser = false }) {
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full skeleton shrink-0 mt-1" />
      {/* Bubble */}
      <div className={`flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <div className={`h-4 rounded-xl skeleton ${isUser ? "w-32" : "w-64"}`} />
        <div className={`h-4 rounded-xl skeleton ${isUser ? "w-20" : "w-48"}`} />
        {!isUser && <div className="h-4 rounded-xl skeleton w-36" />}
      </div>
    </div>
  );
}

export function SessionSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <div className="w-3 h-3 rounded skeleton shrink-0" />
      <div className="h-3 rounded skeleton flex-1" />
    </div>
  );
}

export function SidebarSkeletons() {
  return (
    <div className="space-y-1 px-2">
      {[70, 85, 60, 90, 75].map((w, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-2">
          <div className="w-3 h-3 rounded skeleton shrink-0" />
          <div className="h-3 rounded skeleton" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
}

export function ChatSkeletons() {
  return (
    <div className="space-y-6 px-4 py-6">
      <MessageSkeleton isUser={false} />
      <MessageSkeleton isUser={true}  />
      <MessageSkeleton isUser={false} />
      <MessageSkeleton isUser={true}  />
    </div>
  );
}