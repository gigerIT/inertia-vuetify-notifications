import type { App, Plugin } from 'vue'
import { createNotificationContext } from './composables/useNotifications'
import { NOTIFICATION_INJECTION_KEY, type NotificationPluginOptions } from './types'

// Type for Inertia success event
interface InertiaSuccessEvent extends CustomEvent {
  detail: {
    page: {
      flash?: Record<string, unknown>
    }
  }
}

// Type for Inertia flash event (client-side flash via router.flash())
interface InertiaFlashEvent extends CustomEvent {
  detail: {
    flash: Record<string, unknown>
  }
}

/**
 * Process flash data and add notifications to queue
 */
function processFlashData(
  flash: Record<string, unknown>,
  context: ReturnType<typeof createNotificationContext>
): void {
  for (const key of context.options.flashKeys) {
    const value = flash[key]
    if (value !== undefined && value !== null) {
      context.notify(value as string | Parameters<typeof context.notify>[0], key)
    }
  }
}

/**
 * Create the Inertia Vuetify Notifications plugin
 */
export function inertiaVuetifyNotifications(options: NotificationPluginOptions = {}): Plugin {
  return {
    install(app: App) {
      const context = createNotificationContext(options)

      // Provide context for useNotifications composable
      app.provide(NOTIFICATION_INJECTION_KEY, context)

      // Track the last processed flash key to avoid duplicates
      // This persists until a new navigation with different flash data
      let lastProcessedFlashKey: string | null = null

      // Clear processed flash on new navigation (before the response)
      document.addEventListener('inertia:before', () => {
        lastProcessedFlashKey = null
      })

      // Listen to success events for server-side flash data
      document.addEventListener('inertia:success', ((event: InertiaSuccessEvent) => {
        const flash = event.detail.page?.flash
        if (!flash || typeof flash !== 'object' || Object.keys(flash).length === 0) return

        const flashKey = JSON.stringify(flash)

        // Only process if this is new flash data
        if (flashKey !== lastProcessedFlashKey) {
          lastProcessedFlashKey = flashKey
          processFlashData(flash, context)
        }
      }) as EventListener)

      // Listen to flash events for client-side flash via router.flash()
      document.addEventListener('inertia:flash', ((event: InertiaFlashEvent) => {
        const flash = event.detail.flash
        if (!flash || typeof flash !== 'object' || Object.keys(flash).length === 0) return

        processFlashData(flash, context)
      }) as EventListener)
    },
  }
}


