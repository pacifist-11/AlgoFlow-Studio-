// ─── Global Screen Telemetry & Diagnostics Bridge ──────────────────────────────
// Allows the AI ChatBot to have real-time awareness of what is happening on the
// user's screen (active algorithms, current animation steps, execution logs, canvas state,
// and any errors or unexpected problems encountered).

let currentScreenState = {
  screenTitle: 'Home Dashboard',
  activeAlgo: 'None',
  currentStep: 0,
  totalSteps: 0,
  currentStepMessage: '',
  recentLogs: [],
  screenDataSummary: '',
  lastErrorOrIssue: null,
  runtimeErrors: [],
  lastUpdated: Date.now()
};

const listeners = new Set();

// Automatically capture unhandled window errors and promise rejections
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (!event.message) return;
    recordScreenError(`Uncaught Error: ${event.message} (in ${event.filename || 'script'}:${event.lineno || 0})`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || event.reason || 'Unhandled Promise Rejection';
    recordScreenError(`Promise Rejection: ${String(reason)}`);
  });
}

export function setScreenContext(update) {
  if (!update || typeof update !== 'object') return;
  currentScreenState = {
    ...currentScreenState,
    ...update,
    lastUpdated: Date.now()
  };
  notifyListeners();
}

export function recordScreenError(errorMsg) {
  if (!errorMsg) return;
  const errorStr = String(errorMsg);
  const runtimeErrors = [
    errorStr,
    ...(currentScreenState.runtimeErrors || []).filter(e => e !== errorStr)
  ].slice(0, 5);

  currentScreenState = {
    ...currentScreenState,
    lastErrorOrIssue: errorStr,
    runtimeErrors,
    lastUpdated: Date.now()
  };
  notifyListeners();
}

export function clearScreenError() {
  currentScreenState = {
    ...currentScreenState,
    lastErrorOrIssue: null,
    lastUpdated: Date.now()
  };
  notifyListeners();
}

export function getScreenContext() {
  return currentScreenState;
}

export function subscribeScreenContext(cb) {
  listeners.add(cb);
  cb(currentScreenState);
  return () => listeners.delete(cb);
}

function notifyListeners() {
  listeners.forEach(cb => {
    try {
      cb(currentScreenState);
    } catch (err) {
      console.warn('Screen context listener error:', err);
    }
  });
  if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent('algoflow_screen_telemetry', { detail: currentScreenState }));
  }
}
